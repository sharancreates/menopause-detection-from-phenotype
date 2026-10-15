"""
MenoPhenotype Artifact Exporter Module
Extracts, cleans, maps ordinal strings, engineers features, splits,
fits ColumnTransformer pipeline and clustering/outlier models from raw SWAN data,
and exports all .joblib and .json artifacts required for production inference.
"""

import json
from pathlib import Path
from typing import Any, Dict, Optional, Tuple
import joblib
import numpy as np
import pandas as pd
from sklearn.cluster import AgglomerativeClustering, KMeans
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import IsolationForest
from sklearn.impute import SimpleImputer
from sklearn.mixture import GaussianMixture
from sklearn.model_selection import train_test_split
from sklearn.neighbors import LocalOutlierFactor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import FunctionTransformer, StandardScaler

from menophenotype.preproc import Winsorizer
from menophenotype.schemas import (
    ANTHRO,
    CESD_COLS,
    CESD_MAP,
    CESD_REVERSED,
    DOMAINS,
    F5_MAP,
    HORM_COLS,
    SENTINELS,
    SLEEP_MAP,
    SPORT_MAP,
    SYMP_COLS,
    SYMPTOMS,
)

FOLLOWUP_COLS = ['FLASHPH0', 'FLASHEB0', 'FLASHEM0']
HT_COLS = ['HORMCRE0', 'HORMPIL0', 'ESTRPTC0', 'BCP0']


def clean_baseline_data(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """Clean raw SWAN baseline data by handling sentinels and dropped columns."""
    df_clean = df.copy()
    if 'SWANID' in df_clean.columns:
        df_clean = df_clean.set_index('SWANID')

    # Convert sentinel strings to NaN in object columns
    obj_cols = df_clean.select_dtypes(exclude='number').columns
    df_clean[obj_cols] = df_clean[obj_cols].replace(SENTINELS, np.nan)

    # Drop constant/structural follow-up columns
    drop_cols = [c for c in (FOLLOWUP_COLS + HT_COLS) if c in df_clean.columns]
    df_clean.drop(columns=drop_cols, inplace=True, errors='ignore')

    # Drop rows missing > 30% of symptom columns
    present_symps = [c for c in SYMP_COLS if c in df_clean.columns]
    symp_missing_rate = df_clean[present_symps].isna().mean(axis=1)
    drop_row_ids = df_clean[symp_missing_rate > 0.30].index.tolist()
    df_clean = df_clean.drop(index=drop_row_ids)

    meta = {
        'SYMPTOMS': SYMPTOMS,
        'SYMP_COLS': SYMP_COLS,
        'HORM_COLS': [c for c in HORM_COLS if c in df_clean.columns],
        'ANTHRO': [c for c in ANTHRO if c in df_clean.columns],
        'dropped_baseline_columns': drop_cols,
        'dropped_baseline_rows_n': len(drop_row_ids),
        'sentinels': SENTINELS,
    }
    return df_clean, meta


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Map raw strings to ordinals and engineer composite features."""
    # 1. Map symptom frequencies
    sym_dict = {}
    for c in SYMP_COLS:
        if c in df.columns:
            series = df[c]
            # Check if column contains string values
            if series.dtype == 'object' or isinstance(series.dropna().iloc[0], str) if len(series.dropna()) > 0 else False:
                mapper = SLEEP_MAP if c in SYMPTOMS['sleep'] else F5_MAP
                sym_dict[c] = series.map(mapper)
            else:
                sym_dict[c] = pd.to_numeric(series, errors='coerce')
        else:
            sym_dict[c] = pd.Series(np.nan, index=df.index)

    feat = pd.DataFrame(sym_dict, index=df.index)

    # 2. Map CESD depression items and compute cesd_mean
    cesd_dict = {}
    for c in CESD_COLS:
        if c in df.columns:
            series = df[c]
            if series.dtype == 'object' or (len(series.dropna()) > 0 and isinstance(series.dropna().iloc[0], str)):
                cesd_dict[c] = series.map(CESD_MAP)
            else:
                cesd_dict[c] = pd.to_numeric(series, errors='coerce')
    if cesd_dict:
        cesd_df = pd.DataFrame(cesd_dict, index=df.index)
        # Reverse score positive items
        rev_items = [c for c in CESD_REVERSED if c in cesd_df.columns]
        cesd_df[rev_items] = 3.0 - cesd_df[rev_items]
        # Require >= 10 answered items
        feat['cesd_mean'] = np.where(cesd_df.notna().sum(axis=1) >= 10, cesd_df.mean(axis=1), np.nan)
    else:
        feat['cesd_mean'] = np.nan

    # 3. Exercise frequency
    if 'SPORTS0' in df.columns:
        s = df['SPORTS0']
        if s.dtype == 'object' or (len(s.dropna()) > 0 and isinstance(s.dropna().iloc[0], str)):
            feat['SPORTS0'] = s.map(SPORT_MAP)
        else:
            feat['SPORTS0'] = pd.to_numeric(s, errors='coerce')
    else:
        feat['SPORTS0'] = np.nan

    # 4. Age
    if 'AGE0' in df.columns:
        feat['AGE0'] = pd.to_numeric(df['AGE0'], errors='coerce')
    else:
        feat['AGE0'] = np.nan

    # 5. Waist-to-hip ratio
    if 'WAIST0' in df.columns and 'HIP0' in df.columns:
        w = pd.to_numeric(df['WAIST0'], errors='coerce')
        h = pd.to_numeric(df['HIP0'], errors='coerce')
        feat['WHR'] = w / h
    else:
        feat['WHR'] = np.nan

    # 6. Hormones and BMI
    for col in HORM_COLS + ['BMI0']:
        if col in df.columns:
            feat[col] = pd.to_numeric(df[col], errors='coerce')
        else:
            feat[col] = np.nan

    return feat


def train_and_export(
    data_path: Path,
    output_dir: Path,
    random_state: int = 42
) -> Dict[str, Any]:
    """
    Run end-to-end training and export pipeline from raw CSV data.
    Saves baseline_preprocessor.joblib, tuned_models.joblib, outlier_models.joblib,
    and metadata JSONs into output_dir.
    """
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    if not data_path.exists():
        raise FileNotFoundError(f"Source dataset not found at {data_path}")

    # 1. Ingest raw baseline data
    print(f"Loading {data_path}...")
    raw_df = pd.read_csv(data_path, low_memory=False)

    # 2. Clean data
    clean_df, quality_meta = clean_baseline_data(raw_df)
    json.dump(quality_meta, open(output_dir / 'quality_meta.json', 'w'), indent=2)

    # 3. Engineer features
    feat_df = engineer_features(clean_df)

    ORD = SYMP_COLS + ['cesd_mean', 'SPORTS0', 'AGE0']
    ANTH = ['BMI0', 'WHR']
    present_ord = [c for c in ORD if c in feat_df.columns]
    present_horm = [c for c in HORM_COLS if c in feat_df.columns]
    present_anth = [c for c in ANTH if c in feat_df.columns]
    all_pipeline_cols = present_ord + present_horm + present_anth
    feat_subset = feat_df[all_pipeline_cols].copy()

    # 4. Stratified Train-Test Split (seed 42)
    if 'STATUS0' in clean_df.columns:
        strat_col = clean_df['STATUS0'].fillna('Unknown').replace({'Unknown due to HT use': 'Unknown'})
    else:
        strat_col = None

    train_ids, test_ids = train_test_split(
        feat_subset.index,
        test_size=0.20,
        random_state=random_state,
        stratify=strat_col
    )
    split_ids = {
        'train_ids': [int(i) if isinstance(i, (np.integer, int)) else str(i) for i in train_ids],
        'test_ids': [int(i) if isinstance(i, (np.integer, int)) else str(i) for i in test_ids],
        'train': [int(i) if isinstance(i, (np.integer, int)) else str(i) for i in train_ids],
        'test': [int(i) if isinstance(i, (np.integer, int)) else str(i) for i in test_ids],
    }
    json.dump(split_ids, open(output_dir / 'split_ids.json', 'w'), indent=2)

    Xtr_raw = feat_subset.loc[train_ids]
    Xte_raw = feat_subset.loc[test_ids]

    # 5. Fit Preprocessing Pipeline (ColumnTransformer with Winsorizer + Imputer + Scaler)
    def block(*steps):
        return Pipeline(list(steps))

    preprocessor = ColumnTransformer([
        ('ord', block(('imp', SimpleImputer(strategy='median')), ('sc', StandardScaler())), present_ord),
        ('hormone', block(('log', FunctionTransformer(np.log1p, feature_names_out='one-to-one')),
                          ('win', Winsorizer(0.01, 0.99)),
                          ('imp', SimpleImputer(strategy='median')), ('sc', StandardScaler())), present_horm),
        ('anthro', block(('win', Winsorizer(0.01, 0.99)),
                         ('imp', SimpleImputer(strategy='median')), ('sc', StandardScaler())), present_anth),
    ], verbose_feature_names_out=False).set_output(transform='pandas')

    print("Fitting ColumnTransformer preprocessing pipeline...")
    Xtr_scaled = preprocessor.fit_transform(Xtr_raw)
    Xte_scaled = preprocessor.transform(Xte_raw)
    joblib.dump(preprocessor, output_dir / 'baseline_preprocessor.joblib')

    # Save feature CSVs
    Xtr_scaled.to_csv(output_dir / 'baseline_train_features.csv')
    Xte_scaled.to_csv(output_dir / 'baseline_test_features.csv')

    # 6. Fit Clustering Models (Feature Set A: 18 symptoms only)
    Xtr_symp = Xtr_scaled[SYMP_COLS]
    print("Fitting Gaussian Mixture Model (k=2, full covariance)...")
    gmm = GaussianMixture(n_components=2, covariance_type='full', random_state=random_state, n_init=10)
    gmm.fit(Xtr_symp)

    kmeans = KMeans(n_clusters=2, random_state=random_state, n_init=10).fit(Xtr_symp)
    agg = AgglomerativeClustering(n_clusters=2, linkage='ward').fit(Xtr_symp)

    tuned_models = {
        'GMM': gmm,
        'KMeans': kmeans,
        'Agglomerative': agg
    }
    joblib.dump(tuned_models, output_dir / 'tuned_models.joblib')

    # 7. Fit Outlier Detectors on training symptoms
    print("Fitting Isolation Forest and Local Outlier Factor...")
    iso = IsolationForest(contamination=0.10, random_state=random_state, n_estimators=300)
    iso.fit(Xtr_symp)

    lof = LocalOutlierFactor(n_neighbors=20, contamination=0.10, novelty=True)
    lof.fit(Xtr_symp)

    joblib.dump({'isolation_forest': iso, 'lof': lof}, output_dir / 'outlier_models.joblib')

    # 8. Compute and Save Phenotype Profiles Metadata
    train_proba = gmm.predict_proba(Xtr_symp)
    train_clusters = np.argmax(train_proba, axis=1)

    symp_raw_tr = feat_subset.loc[train_ids, SYMP_COLS]
    means_cluster0 = symp_raw_tr[train_clusters == 0].mean().round(2).to_dict()
    means_cluster1 = symp_raw_tr[train_clusters == 1].mean().round(2).to_dict()

    phenotype_profiles = {
        'Phenotype A (lower burden)': {
            'n': int((train_clusters == 0).sum()),
            'domain_scores': means_cluster0,
            'description': 'Lower symptom burden across all domains (vasomotor, psychological, somatic, sleep).'
        },
        'Phenotype B (higher, multi-domain burden)': {
            'n': int((train_clusters == 1).sum()),
            'domain_scores': means_cluster1,
            'description': 'Elevated symptom burden across all domains simultaneously, not one dominant domain; skews toward later menopausal stages.'
        },
        'Atypical / mixed profile': {
            'description': 'Flagged by consensus anomaly detection (Isolation Forest + LOF); reflects high multi-domain variance.'
        }
    }
    json.dump(phenotype_profiles, open(output_dir / 'phenotype_profiles.json', 'w'), indent=2)

    print(f"Artifacts successfully exported to {output_dir}")
    return {
        'status': 'success',
        'n_train': len(train_ids),
        'n_test': len(test_ids),
        'output_dir': str(output_dir)
    }
