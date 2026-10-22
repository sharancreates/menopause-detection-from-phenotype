"""
MenoPhenotype STRAW+10 Menopause Staging Engine.
Implements the gold-standard Stages of Reproductive Aging Workshop + 10 (STRAW+10)
clinical staging criteria to classify women across reproductive aging stages.
"""

from typing import Any, Dict, List, Optional


STAGE_DEFINITIONS: Dict[str, Dict[str, Any]] = {
    "premenopause": {
        "stage_id": "premenopause",
        "stage_name": "Premenopause (Reproductive)",
        "stage_category": "Premenopause",
        "timeline_step": 0,
        "is_near_menopause": False,
        "biological_summary": (
            "Normal ovulatory reproductive function with regular menstrual cycles. Ovarian follicular "
            "reserve remains intact, with regular cyclical production of estrogen and progesterone."
        ),
        "physician_discussion_points": [
            "Baseline tracking of cycle regularity, cycle length changes, and sleep patterns.",
            "Family history of menopause onset and reproductive aging trajectory.",
            "Cardiovascular health and lifestyle baselines (nutrition, regular weight-bearing exercise).",
        ],
    },
    "early_perimenopause": {
        "stage_id": "early_perimenopause",
        "stage_name": "Early Perimenopause",
        "stage_category": "Early Perimenopause",
        "timeline_step": 1,
        "is_near_menopause": False,
        "biological_summary": (
            "Early menopausal transition characterized by increasing cycle variability (difference of 7 or more days "
            "between consecutive cycles). Ovarian follicle numbers are declining, causing elevated follicle-stimulating "
            "hormone (FSH) and unpredictable estrogen surges and dips, alongside reduced luteal phase progesterone."
        ),
        "physician_discussion_points": [
            "Options for managing emerging vasomotor, sleep, or mood fluctuations.",
            "Contraceptive and family planning needs during irregular cycles.",
            "Non-hormonal and hormonal strategies to stabilize unpredictable cycles.",
            "Baseline screening for thyroid function, bone health, and lipid profile.",
        ],
    },
    "late_perimenopause": {
        "stage_id": "late_perimenopause",
        "stage_name": "Late Perimenopause (Near Menopause)",
        "stage_category": "Late Perimenopause",
        "timeline_step": 2,
        "is_near_menopause": True,
        "biological_summary": (
            "Late menopausal transition characterized by prolonged intervals of amenorrhea (skipped cycles of 60+ days "
            "or 2 to 11 months without menses). Persistently elevated FSH, frequent anovulatory cycles, and sharp drops in "
            "circulating estradiol drive peak vasomotor (hot flashes, night sweats) and somatic symptoms."
        ),
        "physician_discussion_points": [
            "Menopausal Hormone Therapy (MHT) indications, safety profile, and non-hormonal alternatives.",
            "Cardioprotective and bone preservation strategies during accelerated bone density loss.",
            "Evidence-based symptom relief for severe hot flashes, night sweats, and brain fog.",
            "Continued contraception until 12 full consecutive months of amenorrhea are reached.",
        ],
    },
    "postmenopause": {
        "stage_id": "postmenopause",
        "stage_name": "Postmenopause",
        "stage_category": "Postmenopause",
        "timeline_step": 3,
        "is_near_menopause": False,
        "biological_summary": (
            "Complete cessation of ovarian follicular activity confirmed by 12 or more consecutive months of amenorrhea. "
            "Circulating estradiol remains at permanent low baseline levels with elevated FSH (>30 mIU/mL)."
        ),
        "physician_discussion_points": [
            "Long-term bone density preservation and DXA scan screening schedule.",
            "Genitourinary Syndrome of Menopause (GSM) management (vaginal dryness, urinary comfort).",
            "Cardiovascular risk monitoring, blood pressure, and cholesterol management.",
            "Healthy aging strategies including resistance training and balanced nutrition.",
        ],
    },
    "surgical": {
        "stage_id": "surgical",
        "stage_name": "Surgical Menopause",
        "stage_category": "Surgical Menopause",
        "timeline_step": 3,
        "is_near_menopause": False,
        "biological_summary": (
            "Abrupt transition resulting from bilateral oophorectomy (removal of both ovaries) and/or hysterectomy. "
            "Sudden loss of ovarian estrogen, progesterone, and testosterone production often results in immediate, "
            "more intense vasomotor and somatic symptoms compared to spontaneous menopause."
        ),
        "physician_discussion_points": [
            "Urgent discussion regarding early bone loss prevention and cardiovascular risk management.",
            "Hormone therapy options (estrogen monotherapy if hysterectomy; combined estrogen-progestogen if uterus present).",
            "Targeted management of sudden-onset severe hot flashes and genitourinary symptoms.",
        ],
    },
}

POI_ALERT_TEXT = (
    "CLINICAL ATTENTION ADVISED: You are under age 40 and experiencing skipped cycles or prolonged absence of menses. "
    "This presentation suggests potential Primary Ovarian Insufficiency (POI) or premature ovarian insufficiency, "
    "which warrants timely comprehensive clinical evaluation, hormone lab assessment (FSH, estradiol, AMH), "
    "and bone density monitoring with a qualified gynecologist or reproductive endocrinologist."
)

STAGING_QUESTIONS = [
    {
        "id": "age_range",
        "question": "What is your current age range?",
        "options": [
            {"value": "<40", "label": "Under 40", "description": "Under 40 years old"},
            {"value": "40-44", "label": "40–44", "description": "40 to 44 years old"},
            {"value": "45-49", "label": "45–49", "description": "45 to 49 years old"},
            {"value": "50-54", "label": "50–54", "description": "50 to 54 years old"},
            {"value": "55+", "label": "55+", "description": "55 years or older"},
        ],
    },
    {
        "id": "cycle_regularity",
        "question": "How predictable are your menstrual cycle lengths?",
        "options": [
            {
                "value": "regular",
                "label": "Regular",
                "description": "Predictable within 7 days each month",
            },
            {
                "value": "variable",
                "label": "Variable cycle lengths",
                "description": "Cycle length differs by 7 or more days from month to month",
            },
            {
                "value": "skipped",
                "label": "Skipped 2+ months",
                "description": "Frequent 60+ day gaps or missed multiple cycles",
            },
        ],
    },
    {
        "id": "time_since_period",
        "question": "When did your last menstrual period start?",
        "options": [
            {
                "value": "within_last_month",
                "label": "Within last month",
                "description": "Had a period in the past 30-60 days",
            },
            {
                "value": "2_to_11_months",
                "label": "2–11 months ago",
                "description": "No period for between 2 and 11 consecutive months",
            },
            {
                "value": "12_months_or_more",
                "label": "12+ months ago",
                "description": "No menstrual period for a full year or longer",
            },
            {
                "value": "surgical",
                "label": "Surgical Menopause",
                "description": "Prior bilateral oophorectomy (both ovaries removed) or hysterectomy",
            },
        ],
    },
]


def evaluate_stage(
    age_range: Optional[str] = None,
    cycle_regularity: Optional[str] = None,
    time_since_period: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    """
    Deterministic STRAW+10 clinical evaluation engine.

    Maps age, cycle regularity, and amenorrhea duration to transition stage.
    Returns None if no staging inputs are supplied (maintaining backward compatibility).
    """
    if not any([age_range, cycle_regularity, time_since_period]):
        return None

    norm_period = (time_since_period or "").strip().lower()
    norm_reg = (cycle_regularity or "").strip().lower()
    norm_age = (age_range or "").strip().lower()

    # 1. Surgical Menopause
    if norm_period in ["surgical", "hysterectomy", "oophorectomy"]:
        stage_key = "surgical"

    # 2. Postmenopause: 12+ consecutive months without menses
    elif norm_period in ["12_months_or_more", "12+ months ago", "12+ months"]:
        stage_key = "postmenopause"

    # 3. Late Perimenopause ("Near Menopause"): skipped cycles for 60+ days or 2-11 months amenorrhea
    elif norm_period in ["2_to_11_months", "2-11 months ago"] or norm_reg in ["skipped", "skipped 2+ months"]:
        stage_key = "late_perimenopause"

    # 4. Early Perimenopause: variable cycle length by 7+ days, but period within last month
    elif norm_reg in ["variable", "variable cycle lengths", "variable by 7+ days"]:
        stage_key = "early_perimenopause"

    # 5. Premenopause: regular cycle, period within last month
    elif norm_reg in ["regular"] or norm_period in ["within_last_month", "within last month"]:
        stage_key = "premenopause"

    # Fallback to early perimenopause if indeterminate
    else:
        stage_key = "early_perimenopause"

    base_stage = STAGE_DEFINITIONS[stage_key].copy()

    # Detect Primary Ovarian Insufficiency (POI) / Premature Menopause alert
    is_under_40 = norm_age in ["<40", "under 40", "under_40", "< 40"]
    has_prolonged_amenorrhea = stage_key in ["late_perimenopause", "postmenopause"]
    poi_alert = bool(is_under_40 and has_prolonged_amenorrhea)

    result = {
        "stage_id": base_stage["stage_id"],
        "stage_name": base_stage["stage_name"],
        "stage_category": base_stage["stage_category"],
        "timeline_step": base_stage["timeline_step"],
        "is_near_menopause": base_stage["is_near_menopause"],
        "poi_alert": poi_alert,
        "poi_alert_text": POI_ALERT_TEXT if poi_alert else None,
        "biological_summary": base_stage["biological_summary"],
        "physician_discussion_points": list(base_stage["physician_discussion_points"]),
        "intake_responses": {
            "age_range": age_range,
            "cycle_regularity": cycle_regularity,
            "time_since_period": time_since_period,
        },
    }

    return result
