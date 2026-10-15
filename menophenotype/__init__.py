"""
MenoPhenotype Package
Operationalized ML pipeline and inference engine for Menopause Phenotype Detection.
"""

from menophenotype.inference import assess, load_models
from menophenotype.preproc import Winsorizer
from menophenotype.schemas import (
    DOMAINS,
    LIKERT_SCALE,
    QUESTIONNAIRE_ITEMS,
    SYMP_COLS,
    SymptomAssessmentInput,
    SymptomAssessmentOutput,
)

__version__ = "1.0.0"

__all__ = [
    "Winsorizer",
    "assess",
    "load_models",
    "SYMP_COLS",
    "DOMAINS",
    "LIKERT_SCALE",
    "QUESTIONNAIRE_ITEMS",
    "SymptomAssessmentInput",
    "SymptomAssessmentOutput",
]
