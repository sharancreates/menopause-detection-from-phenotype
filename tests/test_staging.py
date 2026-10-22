"""
Unit tests for STRAW+10 Menopause Staging Engine.
Tests all clinical classification combinations, POI alerts, and edge cases.
"""

import pytest
from menophenotype.staging import evaluate_stage, STAGE_DEFINITIONS, STAGING_QUESTIONS


def test_evaluate_stage_none():
    """Verify evaluate_stage returns None when no arguments are provided."""
    assert evaluate_stage() is None
    assert evaluate_stage(None, None, None) is None
    assert evaluate_stage("", "", "") is None


def test_premenopause_classification():
    """Verify regular cycles and period within last month map to Premenopause."""
    res = evaluate_stage(age_range="40-44", cycle_regularity="regular", time_since_period="within_last_month")
    assert res is not None
    assert res["stage_id"] == "premenopause"
    assert res["timeline_step"] == 0
    assert res["is_near_menopause"] is False
    assert res["poi_alert"] is False
    assert "Premenopause" in res["stage_name"]
    assert len(res["physician_discussion_points"]) > 0


def test_early_perimenopause_classification():
    """Verify variable cycle length in women 40+ maps to Early Perimenopause."""
    res = evaluate_stage(age_range="45-49", cycle_regularity="variable", time_since_period="within_last_month")
    assert res is not None
    assert res["stage_id"] == "early_perimenopause"
    assert res["timeline_step"] == 1
    assert res["is_near_menopause"] is False
    assert res["poi_alert"] is False
    assert "Early Perimenopause" in res["stage_name"]


def test_young_reproductive_variable_cycles_not_perimenopause():
    """Verify young women (<40) with variable cycles map to Premenopause, NOT perimenopause."""
    res = evaluate_stage(age_range="<40", cycle_regularity="variable", time_since_period="within_last_month")
    assert res is not None
    assert res["stage_id"] == "premenopause"
    assert res["timeline_step"] == 0
    assert res["is_near_menopause"] is False
    assert res["poi_alert"] is False
    assert "Premenopause" in res["stage_name"]
    assert "PCOS" in res["biological_summary"]



def test_late_perimenopause_by_skipped_cycles():
    """Verify skipped cycles (60+ days) map to Late Perimenopause / Near Menopause."""
    res = evaluate_stage(age_range="45-49", cycle_regularity="skipped", time_since_period="within_last_month")
    assert res is not None
    assert res["stage_id"] == "late_perimenopause"
    assert res["timeline_step"] == 2
    assert res["is_near_menopause"] is True
    assert "Near Menopause" in res["stage_name"]


def test_late_perimenopause_by_amenorrhea_duration():
    """Verify 2 to 11 months of amenorrhea maps to Late Perimenopause."""
    res = evaluate_stage(age_range="50-54", cycle_regularity="variable", time_since_period="2_to_11_months")
    assert res is not None
    assert res["stage_id"] == "late_perimenopause"
    assert res["timeline_step"] == 2
    assert res["is_near_menopause"] is True


def test_postmenopause_classification():
    """Verify 12+ months amenorrhea maps to Postmenopause."""
    res = evaluate_stage(age_range="55+", cycle_regularity="skipped", time_since_period="12_months_or_more")
    assert res is not None
    assert res["stage_id"] == "postmenopause"
    assert res["timeline_step"] == 3
    assert res["is_near_menopause"] is False
    assert res["poi_alert"] is False
    assert "Postmenopause" in res["stage_name"]


def test_surgical_menopause_classification():
    """Verify surgical input maps to Surgical Menopause."""
    res = evaluate_stage(age_range="40-44", cycle_regularity="regular", time_since_period="surgical")
    assert res is not None
    assert res["stage_id"] == "surgical"
    assert "Surgical Menopause" in res["stage_name"]
    assert res["timeline_step"] == 3


def test_poi_alert_under_40():
    """Verify POI alert triggers for age < 40 with skipped cycles or prolonged amenorrhea."""
    # Under 40 with 12+ months
    res1 = evaluate_stage(age_range="<40", cycle_regularity="skipped", time_since_period="12_months_or_more")
    assert res1 is not None
    assert res1["poi_alert"] is True
    assert res1["poi_alert_text"] is not None
    assert "Primary Ovarian Insufficiency" in res1["poi_alert_text"]

    # Under 40 with skipped cycles (late perimenopause)
    res2 = evaluate_stage(age_range="under 40", cycle_regularity="skipped", time_since_period="2_to_11_months")
    assert res2 is not None
    assert res2["poi_alert"] is True

    # Under 40 with regular cycles (should NOT trigger POI)
    res3 = evaluate_stage(age_range="<40", cycle_regularity="regular", time_since_period="within_last_month")
    assert res3 is not None
    assert res3["poi_alert"] is False
    assert res3["poi_alert_text"] is None


def test_staging_questions_metadata():
    """Verify STAGING_QUESTIONS contains all 3 required intake questions."""
    assert len(STAGING_QUESTIONS) == 3
    ids = [q["id"] for q in STAGING_QUESTIONS]
    assert "age_range" in ids
    assert "cycle_regularity" in ids
    assert "time_since_period" in ids
