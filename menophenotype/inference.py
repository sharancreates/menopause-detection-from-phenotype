"""
MenoPhenotype Inference Engine.
Loads model artifacts and scores user-submitted symptom responses against
the 18-symptom phenotype clustering pipeline (GMM k=2) and dual-model outlier detection.
"""

import json
from pathlib import Path
from typing import Any, Dict, Optional
import numpy as np
import pandas as pd
import joblib

# Ensure Winsorizer is registered in sys.modules for unpickling
import menophenotype.preproc
from menophenotype.schemas import ANTHRO, DOMAINS, HORM_COLS, SYMP_COLS

_CACHE: Dict[str, Any] = {}


def resolve_artifact_dir(custom_path: Optional[Path] = None) -> Path:
    """Resolve artifacts directory with robust fallback."""
    if custom_path and Path(custom_path).exists():
        return Path(custom_path)

    # Search standard locations
    candidates = [
        Path.cwd() / "artifacts",
        Path(__file__).resolve().parent.parent / "artifacts",
        Path("artifacts"),
    ]
    for c in candidates:
        if c.exists() and (c / "baseline_preprocessor.joblib").exists():
            return c

    # Fallback to current directory artifacts
    return Path.cwd() / "artifacts"


def load_models(artifact_dir: Optional[Path] = None, force_reload: bool = False) -> Dict[str, Any]:
    """Load and cache preprocessor, models, and metadata artifacts."""
    global _CACHE
    art_path = resolve_artifact_dir(artifact_dir)

    if not force_reload and "loaded" in _CACHE and _CACHE.get("path") == art_path:
        return _CACHE

    if not art_path.exists():
        raise FileNotFoundError(
            f"Artifacts directory not found at '{art_path}'. Run 'python export_artifacts.py' first."
        )

    pre_path = art_path / "baseline_preprocessor.joblib"
    models_path = art_path / "tuned_models.joblib"
    outliers_path = art_path / "outlier_models.joblib"
    profiles_path = art_path / "phenotype_profiles.json"
    qmeta_path = art_path / "quality_meta.json"

    for p in [pre_path, models_path, outliers_path]:
        if not p.exists():
            raise FileNotFoundError(f"Required model artifact '{p.name}' missing in {art_path}")

    pre = joblib.load(pre_path)
    models = joblib.load(models_path)
    outliers = joblib.load(outliers_path)

    profiles = {}
    if profiles_path.exists():
        profiles = json.load(open(profiles_path, "r", encoding="utf-8"))

    qmeta = {}
    if qmeta_path.exists():
        qmeta = json.load(open(qmeta_path, "r", encoding="utf-8"))

    _CACHE = {
        "loaded": True,
        "path": art_path,
        "pre": pre,
        "gmm": models.get("GMM"),
        "models": models,
        "outliers": outliers,
        "profiles": profiles,
        "qmeta": qmeta,
    }
    return _CACHE


def compute_domain_scores(symptom_answers: Dict[str, Any]) -> Dict[str, float]:
    """Calculate normalized average severity (0.0 to 1.0) for each clinical domain."""
    scores = {}
    for domain_name, cols in DOMAINS.items():
        vals = []
        for c in cols:
            if c in symptom_answers and symptom_answers[c] is not None:
                try:
                    val = float(symptom_answers[c])
                    if not np.isnan(val):
                        vals.append(val)
                except (ValueError, TypeError):
                    pass
        if vals:
            # Average score normalized from 0-4 scale to 0.0-1.0
            scores[domain_name] = round(float(np.mean(vals) / 4.0), 3)
        else:
            scores[domain_name] = 0.0
    return scores


def assess(
    symptom_answers: Dict[str, Any],
    artifact_dir: Optional[Path] = None
) -> Dict[str, Any]:
    """
    Score symptom responses against the MenoPhenotype GMM model and anomaly detectors.

    Parameters:
        symptom_answers: Dict mapping symptom column names (e.g. 'HOTFLAS0') to Likert score (0 to 4).
        artifact_dir: Optional custom path to model artifacts.

    Returns:
        Structured assessment dictionary with cluster, phenotype label, confidence,
        domain scores, and atypical flag.
    """
    models = load_models(artifact_dir)
    pre = models["pre"]
    gmm = models["gmm"]
    outliers = models["outliers"]

    # Filter and construct feature row
    row: Dict[str, Any] = {}
    answered_count = 0
    for col in SYMP_COLS:
        if col in symptom_answers and symptom_answers[col] is not None:
            try:
                val = float(symptom_answers[col])
                if not np.isnan(val):
                    row[col] = np.clip(val, 0, 4)
                    answered_count += 1
                else:
                    row[col] = np.nan
            except (ValueError, TypeError):
                row[col] = np.nan
        else:
            row[col] = np.nan

    # Fill placeholder clinical/anthro variables with NaN so ColumnTransformer median-imputes them
    row.update({"cesd_mean": np.nan, "SPORTS0": np.nan, "AGE0": np.nan})
    for col in HORM_COLS:
        row[col] = np.nan
    for col in ANTHRO:
        row[col] = np.nan

    input_df = pd.DataFrame([row])

    # Transform through fitted pipeline
    transformed = pre.transform(input_df)
    if hasattr(transformed, "columns"):
        X_scaled = transformed[SYMP_COLS].copy()
    else:
        feat_names = list(pre.get_feature_names_out())
        col_indices = [feat_names.index(c) for c in SYMP_COLS if c in feat_names]
        X_scaled = pd.DataFrame(transformed[:, col_indices], columns=SYMP_COLS)

    if not isinstance(X_scaled, pd.DataFrame):
        X_scaled = pd.DataFrame(X_scaled, columns=SYMP_COLS)

    # GMM Inference
    proba = gmm.predict_proba(X_scaled)[0]
    cluster = int(np.argmax(proba))
    confidence = round(float(proba.max()), 3)

    # Anomaly Detection consensus: both models must agree record is an outlier
    import warnings
    with warnings.catch_warnings():
        warnings.filterwarnings("ignore", category=UserWarning)
        iso_pred = outliers["isolation_forest"].predict(X_scaled)[0]
        lof_pred = outliers["lof"].predict(np.asarray(X_scaled))[0]
    atypical = bool((iso_pred == -1) and (lof_pred == -1))

    phen_key = (
        "Phenotype A (lower burden)"
        if cluster == 0
        else "Phenotype B (higher, multi-domain burden)"
    )

    domain_scores = compute_domain_scores(symptom_answers)

    return {
        "cluster": cluster,
        "phenotype": phen_key,
        "confidence": confidence,
        "probabilities": {
            "Phenotype A": round(float(proba[0]), 3),
            "Phenotype B": round(float(proba[1]), 3),
        },
        "atypical_flag": atypical,
        "domain_scores": domain_scores,
        "answered_items": answered_count,
        "total_items": len(SYMP_COLS),
    }


def main():
    """Quick demo test invocation."""
    print("Testing MenoPhenotype inference engine...")
    example = {c: 2 for c in SYMP_COLS}
    result = assess(example)
    print("Assessment Result:")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
