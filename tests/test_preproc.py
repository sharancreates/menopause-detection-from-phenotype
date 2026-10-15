"""
Unit tests for Winsorizer quantile clipping transformer and preprocessing compatibility.
"""

import io
import joblib
import numpy as np
import pandas as pd
import pytest

from menophenotype.preproc import Winsorizer


def test_winsorizer_fit_and_transform():
    """Verify that values outside [lower, upper] quantiles are clipped precisely."""
    data = np.array([[1.0], [2.0], [3.0], [4.0], [5.0], [100.0]])
    win = Winsorizer(lower=0.10, upper=0.80)
    win.fit(data)

    transformed = win.transform(data)
    assert transformed.shape == data.shape
    assert transformed.max() <= win.hi_[0]
    assert transformed.min() >= win.lo_[0]
    assert transformed[-1, 0] < 100.0  # Outlier 100 clipped


def test_winsorizer_preserves_shape_and_columns():
    """Verify output dimensions and feature names handling."""
    df = pd.DataFrame({
        "A": [10, 20, 30, 40, 50, 60],
        "B": [100, 200, 300, 400, 500, 600]
    })
    win = Winsorizer(lower=0.05, upper=0.95)
    win.fit(df)

    out = win.transform(df)
    assert out.shape == df.shape
    names = win.get_feature_names_out()
    assert list(names) == ["A", "B"]


def test_winsorizer_handles_nans():
    """Verify that NaNs pass through without raising errors and are preserved."""
    data = np.array([[1.0, np.nan], [2.0, 5.0], [np.nan, 10.0], [4.0, 15.0]])
    win = Winsorizer(lower=0.05, upper=0.95)
    win.fit(data)
    transformed = win.transform(data)

    assert np.isnan(transformed[0, 1])
    assert np.isnan(transformed[2, 0])
    assert not np.isnan(transformed[1, 0])


def test_winsorizer_serialization():
    """Verify that a fitted Winsorizer can be pickled and unpickled via joblib."""
    data = np.array([[1.0], [2.0], [3.0], [4.0], [5.0]])
    win = Winsorizer(lower=0.05, upper=0.95)
    win.fit(data)

    buf = io.BytesIO()
    joblib.dump(win, buf)
    buf.seek(0)
    loaded_win = joblib.load(buf)

    np.testing.assert_array_almost_equal(win.lo_, loaded_win.lo_)
    np.testing.assert_array_almost_equal(win.hi_, loaded_win.hi_)


def test_backward_compatible_import():
    """Verify that meno_preproc and menophenotype.preproc reference the same class."""
    from meno_preproc import Winsorizer as RootWinsorizer
    from menophenotype.preproc import Winsorizer as PkgWinsorizer

    assert RootWinsorizer is PkgWinsorizer
