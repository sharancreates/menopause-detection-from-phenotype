"""
Pytest configuration and shared test fixtures for MenoPhenotype.
"""

from pathlib import Path
import numpy as np
import pandas as pd
import pytest

from menophenotype.schemas import ANTHRO, DOMAINS, HORM_COLS, SYMP_COLS


@pytest.fixture
def artifact_dir() -> Path:
    """Path to the artifacts directory."""
    root = Path(__file__).resolve().parent.parent
    return root / "artifacts"


@pytest.fixture
def sample_symptom_data() -> dict:
    """Complete 18-symptom responses with mild-to-moderate severity."""
    return {
        'HOTFLAS0': 1,
        'NITESWE0': 1,
        'COLDSWE0': 0,
        'FEELBLU0': 1,
        'IRRITAB0': 2,
        'NRVOUS0': 1,
        'FORGET0': 1,
        'MOODCHG0': 1,
        'FEARFULA0': 0,
        'STIFF0': 2,
        'HDACHE0': 1,
        'VAGINDR0': 0,
        'HARTRAC0': 1,
        'DIZZY0': 0,
        'LEAKURI0': 0,
        'TRBLSLE0': 1,
        'WAKEUP0': 2,
        'WAKEARL0': 1,
    }


@pytest.fixture
def partial_symptom_data() -> dict:
    """Partial responses where only 4 symptoms are answered."""
    return {
        'HOTFLAS0': 3,
        'NITESWE0': 2,
        'TRBLSLE0': 3,
        'STIFF0': 2,
    }


@pytest.fixture
def high_burden_symptom_data() -> dict:
    """Extreme high-burden response (all 4s)."""
    return {c: 4 for c in SYMP_COLS}


@pytest.fixture
def zero_burden_symptom_data() -> dict:
    """Zero symptom burden response (all 0s)."""
    return {c: 0 for c in SYMP_COLS}


@pytest.fixture
def mock_feature_dataframe() -> pd.DataFrame:
    """Synthetic dataframe with full feature set for transformer testing."""
    np.random.seed(42)
    n_samples = 50
    data = {}
    for col in SYMP_COLS:
        data[col] = np.random.choice([0, 1, 2, 3, 4, np.nan], size=n_samples, p=[0.3, 0.2, 0.2, 0.15, 0.1, 0.05])
    data['cesd_mean'] = np.random.uniform(0, 3, size=n_samples)
    data['SPORTS0'] = np.random.choice(range(6), size=n_samples)
    data['AGE0'] = np.random.uniform(42, 53, size=n_samples)
    data['BMI0'] = np.random.uniform(18, 45, size=n_samples)
    data['WHR'] = np.random.uniform(0.65, 1.1, size=n_samples)
    for h in HORM_COLS:
        data[h] = np.random.exponential(scale=30, size=n_samples)
    return pd.DataFrame(data)
