"""
MenoPhenotype Package
Operationalized ML pipeline and inference engine for Menopause Phenotype Detection.
"""

from menophenotype.api import app
from menophenotype.inference import assess, load_models
from menophenotype.preproc import Winsorizer
from menophenotype.schemas import (
    CLINICAL_DISCLAIMER,
    DOMAINS,
    LIKERT_SCALE,
    PHENOTYPE_PROFILES,
    QUESTIONNAIRE_ITEMS,
    SYMP_COLS,
    SymptomAssessmentInput,
    SymptomAssessmentOutput,
)

__version__ = "1.0.0"

__all__ = [
    "app",
    "Winsorizer",
    "assess",
    "load_models",
    "SYMP_COLS",
    "DOMAINS",
    "LIKERT_SCALE",
    "QUESTIONNAIRE_ITEMS",
    "PHENOTYPE_PROFILES",
    "CLINICAL_DISCLAIMER",
    "SymptomAssessmentInput",
    "SymptomAssessmentOutput",
]
