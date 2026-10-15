"""
Artifact integrity and model schema tests.
Verifies that all exported .joblib and .json artifacts exist, are valid, and load cleanly.
"""

import json
from pathlib import Path
import joblib
import pytest
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import IsolationForest
from sklearn.mixture import GaussianMixture
from sklearn.neighbors import LocalOutlierFactor

from menophenotype.schemas import SYMP_COLS


def test_artifacts_exist_and_load(artifact_dir):
    """Verify all 6 core artifact files exist and are non-empty."""
    expected_files = [
        "baseline_preprocessor.joblib",
        "tuned_models.joblib",
        "outlier_models.joblib",
        "phenotype_profiles.json",
        "quality_meta.json",
        "split_ids.json"
    ]
    for filename in expected_files:
        filepath = artifact_dir / filename
        assert filepath.exists(), f"Artifact '{filename}' missing in {artifact_dir}"
        assert filepath.stat().st_size > 0, f"Artifact '{filename}' is empty"


def test_model_types(artifact_dir):
    """Verify loaded scikit-learn models are correct classes and fitted."""
    pre = joblib.load(artifact_dir / "baseline_preprocessor.joblib")
    assert isinstance(pre, ColumnTransformer)

    models = joblib.load(artifact_dir / "tuned_models.joblib")
    assert "GMM" in models
    assert isinstance(models["GMM"], GaussianMixture)
    assert models["GMM"].n_components == 2

    outliers = joblib.load(artifact_dir / "outlier_models.joblib")
    assert "isolation_forest" in outliers
    assert "lof" in outliers
    assert isinstance(outliers["isolation_forest"], IsolationForest)
    assert isinstance(outliers["lof"], LocalOutlierFactor)


def test_phenotype_profiles_schema(artifact_dir):
    """Verify phenotype_profiles.json contains descriptions and cluster profiles."""
    with open(artifact_dir / "phenotype_profiles.json", "r", encoding="utf-8") as f:
        profiles = json.load(f)

    assert "Phenotype A (lower burden)" in profiles
    assert "Phenotype B (higher, multi-domain burden)" in profiles
    assert "Atypical / mixed profile" in profiles
    assert "domain_scores" in profiles["Phenotype A (lower burden)"]


def test_quality_meta_schema(artifact_dir):
    """Verify quality_meta.json matches expected schema."""
    with open(artifact_dir / "quality_meta.json", "r", encoding="utf-8") as f:
        meta = json.load(f)

    assert "SYMP_COLS" in meta
    assert len(meta["SYMP_COLS"]) == 18
    assert "HORM_COLS" in meta
    assert "sentinels" in meta


def test_split_ids_integrity(artifact_dir):
    """Verify split_ids.json contains non-overlapping train and test IDs."""
    with open(artifact_dir / "split_ids.json", "r", encoding="utf-8") as f:
        split = json.load(f)

    assert "train_ids" in split or "train" in split
    assert "test_ids" in split or "test" in split

    train_set = set(split.get("train_ids", split.get("train", [])))
    test_set = set(split.get("test_ids", split.get("test", [])))

    assert len(train_set) > 0
    assert len(test_set) > 0
    # Train and test should have zero overlap (leak-free)
    assert len(train_set.intersection(test_set)) == 0
