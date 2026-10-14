# Kept in its own module so the fitted pipeline can be pickled and reloaded later.
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin

class Winsorizer(BaseEstimator, TransformerMixin):
    """Clip each column to [lower, upper] quantiles learned on the TRAINING data only."""
    def __init__(self, lower=0.01, upper=0.99):
        self.lower = lower
        self.upper = upper
    def fit(self, X, y=None):
        if hasattr(X, 'columns'):
            self.feature_names_in_ = np.asarray(X.columns, dtype=object)
        Xv = np.asarray(X, dtype=float)
        self.lo_ = np.nanquantile(Xv, self.lower, axis=0)
        self.hi_ = np.nanquantile(Xv, self.upper, axis=0)
        self.n_features_in_ = Xv.shape[1]
        return self
    def transform(self, X):
        return np.clip(np.asarray(X, dtype=float), self.lo_, self.hi_)
    def get_feature_names_out(self, input_features=None):
        if input_features is not None:
            return np.asarray(input_features, dtype=object)
        return np.asarray(getattr(self, 'feature_names_in_',
                                   [f'x{i}' for i in range(self.n_features_in_)]), dtype=object)
