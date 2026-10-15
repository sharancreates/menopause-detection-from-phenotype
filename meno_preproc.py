"""
Backward-compatible shim for Winsorizer transformer.
Preserves unpickling compatibility for saved scikit-learn pipelines.
"""

from menophenotype.preproc import Winsorizer

__all__ = ["Winsorizer"]
