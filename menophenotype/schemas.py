"""
MenoPhenotype Data Schemas & Constants
Defines SWAN symptom codebook mappings, clinical domains, and Pydantic validation schemas
matching the 18-symptom SWAN baseline phenotype discovery pipeline.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

# The canonical 18 Likert symptom items used in SWAN Baseline clustering
SYMPTOMS: Dict[str, List[str]] = {
    'vasomotor': ['HOTFLAS0', 'NITESWE0', 'COLDSWE0'],
    'psychological': ['FEELBLU0', 'IRRITAB0', 'NRVOUS0', 'FORGET0', 'MOODCHG0', 'FEARFULA0'],
    'somatic': ['STIFF0', 'HDACHE0', 'VAGINDR0', 'HARTRAC0', 'DIZZY0', 'LEAKURI0'],
    'sleep': ['TRBLSLE0', 'WAKEUP0', 'WAKEARL0'],
}

DOMAINS: Dict[str, List[str]] = SYMPTOMS

SYMP_COLS: List[str] = (
    SYMPTOMS['vasomotor'] +
    SYMPTOMS['psychological'] +
    SYMPTOMS['somatic'] +
    SYMPTOMS['sleep']
)

# Ordinal string encodings matching raw SWAN data
F5_MAP: Dict[str, int] = {
    'Not At All': 0,
    '1-5 Days': 1,
    '6-8 Days': 2,
    '9-13 Days': 3,
    'Every Day': 4
}

SLEEP_MAP: Dict[str, int] = {
    'No, Not In The Past 2 Wks': 0,
    'Yes, < Once A Wk': 1,
    'Yes, 1-2 Times/Wk': 2,
    'Yes, 3-4 Times/Wk': 3,
    'Yes, 5 or More Times/Wk': 4
}

CESD_MAP: Dict[str, int] = {
    'Rarely/None Of The Time (< 1 Day)': 0,
    'Some/A Little Of The Time (1-2 Days)': 1,
    'Occasionally/Mod Amt Of The Time (3-4 Days)': 2,
    'Most/All Of The Time (5-7 Days)': 3
}

SPORT_MAP: Dict[str, int] = {
    'Never': 0,
    'Less Than Once A Month': 1,
    'Once A Month': 2,
    '2-3 Times A Month': 3,
    'Once A Week': 4,
    'More Than Once A Week': 5
}

CESD_COLS: List[str] = [
    'BOTHER0', 'APPETIT0', 'BLUES0', 'GOOD0', 'KEEPMIN0', 'DEPRESS0',
    'EFFORT0', 'HOPEFUL0', 'FAILURE0', 'FEARFUL0', 'RESTLES0', 'HAPPY0',
    'TALKLES0', 'LONELY0'
]
CESD_REVERSED: List[str] = ['GOOD0', 'HOPEFUL0', 'HAPPY0']

# Rich descriptive metadata for each symptom item
SYMPTOM_METADATA: Dict[str, Dict[str, Any]] = {
    'HOTFLAS0': {
        'code': 'HOTFLAS0',
        'name': 'Hot Flashes',
        'domain': 'vasomotor',
        'question': 'How often have you experienced hot flashes or flushes over the past 2 weeks?'
    },
    'NITESWE0': {
        'code': 'NITESWE0',
        'name': 'Night Sweats',
        'domain': 'vasomotor',
        'question': 'How often have you awakened with night sweats or sweating episodes over the past 2 weeks?'
    },
    'COLDSWE0': {
        'code': 'COLDSWE0',
        'name': 'Cold Sweats',
        'domain': 'vasomotor',
        'question': 'How often have you had cold sweats or sudden chills over the past 2 weeks?'
    },
    'FEELBLU0': {
        'code': 'FEELBLU0',
        'name': 'Feeling Blue / Down',
        'domain': 'psychological',
        'question': 'How often have you felt down, sad, or blue over the past 2 weeks?'
    },
    'IRRITAB0': {
        'code': 'IRRITAB0',
        'name': 'Irritability',
        'domain': 'psychological',
        'question': 'How often have you felt irritable, snappy, or easily annoyed over the past 2 weeks?'
    },
    'NRVOUS0': {
        'code': 'NRVOUS0',
        'name': 'Nervousness / Anxiety',
        'domain': 'psychological',
        'question': 'How often have you felt nervous, anxious, or tense over the past 2 weeks?'
    },
    'FORGET0': {
        'code': 'FORGET0',
        'name': 'Forgetfulness / Brain Fog',
        'domain': 'psychological',
        'question': 'How often have you been forgetful or had difficulty concentrating over the past 2 weeks?'
    },
    'MOODCHG0': {
        'code': 'MOODCHG0',
        'name': 'Mood Swings',
        'domain': 'psychological',
        'question': 'How often have you noticed sudden mood swings or shifts in temperament over the past 2 weeks?'
    },
    'FEARFULA0': {
        'code': 'FEARFULA0',
        'name': 'Fearfulness / Apprehension',
        'domain': 'psychological',
        'question': 'How often have you felt fearful, afraid, or apprehensive over the past 2 weeks?'
    },
    'STIFF0': {
        'code': 'STIFF0',
        'name': 'Joint / Muscle Stiffness',
        'domain': 'somatic',
        'question': 'How often have you felt stiffness, soreness, or aching in your joints or neck?'
    },
    'HDACHE0': {
        'code': 'HDACHE0',
        'name': 'Headaches',
        'domain': 'somatic',
        'question': 'How often have you had headaches or migraines over the past 2 weeks?'
    },
    'VAGINDR0': {
        'code': 'VAGINDR0',
        'name': 'Vaginal Dryness',
        'domain': 'somatic',
        'question': 'How often have you experienced vaginal dryness, irritation, or soreness?'
    },
    'HARTRAC0': {
        'code': 'HARTRAC0',
        'name': 'Heart Pounding / Racing',
        'domain': 'somatic',
        'question': 'How often have you felt your heart pounding, skipping beats, or racing?'
    },
    'DIZZY0': {
        'code': 'DIZZY0',
        'name': 'Dizziness / Lightheadedness',
        'domain': 'somatic',
        'question': 'How often have you felt dizzy, faint, or lightheaded over the past 2 weeks?'
    },
    'LEAKURI0': {
        'code': 'LEAKURI0',
        'name': 'Involuntary Urine Leakage',
        'domain': 'somatic',
        'question': 'How often have you experienced involuntary bladder leakage when coughing, laughing, or exercising?'
    },
    'TRBLSLE0': {
        'code': 'TRBLSLE0',
        'name': 'Difficulty Falling Asleep',
        'domain': 'sleep',
        'question': 'How often have you had trouble falling asleep at bedtime over the past 2 weeks?'
    },
    'WAKEUP0': {
        'code': 'WAKEUP0',
        'name': 'Waking Up During Night',
        'domain': 'sleep',
        'question': 'How often have you awakened several times during the night and found it hard to get back to sleep?'
    },
    'WAKEARL0': {
        'code': 'WAKEARL0',
        'name': 'Waking Up Earlier Than Desired',
        'domain': 'sleep',
        'question': 'How often have you awakened earlier than you wanted to in the morning?'
    }
}

QUESTIONNAIRE_ITEMS: List[Dict[str, Any]] = [
    {
        'id': col,
        'name': meta['name'],
        'domain': meta['domain'],
        'question': meta['question']
    }
    for col, meta in SYMPTOM_METADATA.items()
]

# Likert scale options
LIKERT_SCALE: List[Dict[str, Any]] = [
    {'value': 0, 'label': 'Not at all', 'description': '0 days in past 2 weeks'},
    {'value': 1, 'label': '1-5 days', 'description': 'Occasional mild episodes'},
    {'value': 2, 'label': '6-8 days', 'description': 'Roughly every other day'},
    {'value': 3, 'label': '9-13 days', 'description': 'Frequent, almost daily'},
    {'value': 4, 'label': 'Every day', 'description': 'Continuous daily occurrences'}
]

LIKERT_OPTIONS = LIKERT_SCALE

# Hormone and anthropometric columns
HORM_COLS: List[str] = ['FSH0', 'E2AVE0', 'T0', 'TSH0', 'SHBG0', 'DHAS0']
ANTHRO: List[str] = ['BMI0', 'WHR']
SENTINELS: List[str] = ['Missing', 'Do not know', 'Do Not Know']

# Phenotype textual summaries
PHENOTYPE_PROFILES: Dict[str, Dict[str, Any]] = {
    'Phenotype A': {
        'name': 'Phenotype A (lower burden)',
        'cluster': 0,
        'tagline': 'Lower symptom burden across all clinical domains',
        'description': (
            'Characterized by low average frequencies across vasomotor, psychological, '
            'somatic, and sleep symptoms. Correlates with pre-menopausal status and higher SHBG levels.'
        )
    },
    'Phenotype B': {
        'name': 'Phenotype B (higher, multi-domain burden)',
        'cluster': 1,
        'tagline': 'Elevated burden across all symptom domains simultaneously',
        'description': (
            'Characterized by elevated frequency across all four domains simultaneously, '
            'with cold sweats, urine leakage, and sleep disturbance as prominent boundary drivers. '
            'Significantly associates with transition into perimenopause.'
        )
    }
}

CLINICAL_DISCLAIMER: str = (
    "This tool provides machine-learning phenotype pattern matching based on the SWAN study cohort. "
    "It is strictly for research, educational, and self-reflection purposes and does NOT provide medical "
    "diagnosis, clinical judgment, or treatment advice. Always consult a qualified medical professional."
)


from pydantic import BaseModel, ConfigDict, Field


class StagingResult(BaseModel):
    stage_id: str = Field(..., description="Stage identifier (premenopause, early_perimenopause, late_perimenopause, postmenopause, surgical)")
    stage_name: str = Field(..., description="Human-readable title (e.g. 'Late Perimenopause (Near Menopause)')")
    stage_category: str = Field(..., description="High-level phase group")
    timeline_step: int = Field(..., ge=0, le=3, description="Index on 4-point visual timeline (0 to 3)")
    is_near_menopause: bool = Field(default=False, description="True if late perimenopause")
    poi_alert: bool = Field(default=False, description="Flagged for women under 40 with amenorrhea/irregularity")
    poi_alert_text: Optional[str] = Field(None, description="Clinical guidance for POI if flagged")
    biological_summary: str = Field(..., description="Hormone and ovarian state explanation")
    physician_discussion_points: List[str] = Field(default_factory=list, description="Targeted talking points for healthcare providers")
    intake_responses: Optional[Dict[str, Optional[str]]] = Field(None, description="Raw intake choices submitted by user")


# Pydantic Schemas for API validation
class SymptomAssessmentInput(BaseModel):
    model_config = ConfigDict(extra="ignore")

    # 3-Question Staging Intake (Optional)
    age_range: Optional[str] = Field(None, description="Age group: '<40', '40-44', '45-49', '50-54', '55+'")
    cycle_regularity: Optional[str] = Field(None, description="Regularity: 'regular', 'variable', 'skipped'")
    time_since_period: Optional[str] = Field(None, description="Amenorrhea: 'within_last_month', '2_to_11_months', '12_months_or_more', 'surgical'")

    # 18 symptom columns optional (0 to 4)
    HOTFLAS0: Optional[int] = Field(None, ge=0, le=4)
    NITESWE0: Optional[int] = Field(None, ge=0, le=4)
    COLDSWE0: Optional[int] = Field(None, ge=0, le=4)
    FEELBLU0: Optional[int] = Field(None, ge=0, le=4)
    IRRITAB0: Optional[int] = Field(None, ge=0, le=4)
    NRVOUS0: Optional[int] = Field(None, ge=0, le=4)
    FORGET0: Optional[int] = Field(None, ge=0, le=4)
    MOODCHG0: Optional[int] = Field(None, ge=0, le=4)
    FEARFULA0: Optional[int] = Field(None, ge=0, le=4)
    STIFF0: Optional[int] = Field(None, ge=0, le=4)
    HDACHE0: Optional[int] = Field(None, ge=0, le=4)
    VAGINDR0: Optional[int] = Field(None, ge=0, le=4)
    HARTRAC0: Optional[int] = Field(None, ge=0, le=4)
    DIZZY0: Optional[int] = Field(None, ge=0, le=4)
    LEAKURI0: Optional[int] = Field(None, ge=0, le=4)
    TRBLSLE0: Optional[int] = Field(None, ge=0, le=4)
    WAKEUP0: Optional[int] = Field(None, ge=0, le=4)
    WAKEARL0: Optional[int] = Field(None, ge=0, le=4)


# Alias for backwards compatibility
SymptomAnswers = SymptomAssessmentInput


class SymptomAssessmentOutput(BaseModel):
    cluster: int = Field(..., description="Predicted cluster index (0 or 1)")
    phenotype: str = Field(..., description="Phenotype title")
    confidence: float = Field(..., ge=0.0, le=1.0, description="GMM posterior probability")
    probabilities: Dict[str, float] = Field(..., description="Probabilities for each phenotype")
    atypical_flag: bool = Field(..., description="Flagged by consensus outlier detection")
    domain_scores: Dict[str, float] = Field(..., description="Normalized domain severity scores (0.0 to 1.0)")
    answered_items: int = Field(..., description="Number of symptom items answered")
    total_items: int = Field(default=18, description="Total symptom items evaluated")
    staging: Optional[StagingResult] = Field(None, description="STRAW+10 clinical transition stage assessment")
    disclaimer: str = Field(default=CLINICAL_DISCLAIMER)


AssessmentResult = SymptomAssessmentOutput

