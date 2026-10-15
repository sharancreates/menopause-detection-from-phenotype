"""
Unit and integration tests for MenoPhenotype inference engine and assess() scoring function.
"""

import pytest
from menophenotype.inference import assess, compute_domain_scores
from menophenotype.schemas import DOMAINS, SYMP_COLS


def test_assess_output_schema(sample_symptom_data, artifact_dir):
    """Verify returned dictionary schema structure and required fields."""
    result = assess(sample_symptom_data, artifact_dir=artifact_dir)

    assert "cluster" in result
    assert result["cluster"] in [0, 1]
    assert "phenotype" in result
    assert "Phenotype" in result["phenotype"]
    assert "confidence" in result
    assert "atypical_flag" in result
    assert isinstance(result["atypical_flag"], bool)
    assert "domain_scores" in result
    assert set(result["domain_scores"].keys()) == set(DOMAINS.keys())
    assert "probabilities" in result
    assert "Phenotype A" in result["probabilities"]
    assert "Phenotype B" in result["probabilities"]
    assert result["answered_items"] == 18
    assert result["total_items"] == 18


def test_confidence_bounds(sample_symptom_data, artifact_dir):
    """Verify posterior confidence probability lies strictly between 0.0 and 1.0."""
    result = assess(sample_symptom_data, artifact_dir=artifact_dir)
    assert 0.0 <= result["confidence"] <= 1.0
    for prob in result["probabilities"].values():
        assert 0.0 <= prob <= 1.0


def test_boundary_all_zeros(zero_burden_symptom_data, artifact_dir):
    """Verify all-zero symptom response assigns to Phenotype A (lower burden)."""
    result = assess(zero_burden_symptom_data, artifact_dir=artifact_dir)
    assert result["cluster"] == 0
    assert "Phenotype A" in result["phenotype"]
    assert result["confidence"] > 0.80
    for score in result["domain_scores"].values():
        assert score == 0.0


def test_boundary_all_fours(high_burden_symptom_data, artifact_dir):
    """Verify all-fours symptom response assigns to Phenotype B (higher burden)."""
    result = assess(high_burden_symptom_data, artifact_dir=artifact_dir)
    assert result["cluster"] == 1
    assert "Phenotype B" in result["phenotype"]
    assert result["confidence"] > 0.80
    for score in result["domain_scores"].values():
        assert score == 1.0


def test_empty_input_graceful_handling(artifact_dir):
    """Verify empty dictionary imputes defaults via median without crashing."""
    result = assess({}, artifact_dir=artifact_dir)
    assert "cluster" in result
    assert result["answered_items"] == 0
    assert result["total_items"] == 18
    for score in result["domain_scores"].values():
        assert score == 0.0


def test_invalid_symptom_keys_ignored(sample_symptom_data, artifact_dir):
    """Verify foreign/unrecognized keys are gracefully filtered out."""
    noisy_input = sample_symptom_data.copy()
    noisy_input["UNKNOWN_FEATURE_XYZ"] = 999
    noisy_input["NOT_A_SYMPTOM"] = "invalid"

    result = assess(noisy_input, artifact_dir=artifact_dir)
    assert "cluster" in result
    assert result["answered_items"] == 18


def test_partial_input(partial_symptom_data, artifact_dir):
    """Verify partial questionnaire input succeeds with accurate answered count."""
    result = assess(partial_symptom_data, artifact_dir=artifact_dir)
    assert "cluster" in result
    assert result["answered_items"] == len(partial_symptom_data)


def test_compute_domain_scores():
    """Verify domain normalization math."""
    answers = {
        'HOTFLAS0': 4,  # vasomotor
        'NITESWE0': 2,  # vasomotor
        'COLDSWE0': 0,  # vasomotor -> mean = (4+2+0)/3 = 2.0 -> / 4.0 = 0.50
        'FEELBLU0': 4,  # psychological
    }
    scores = compute_domain_scores(answers)
    assert scores['vasomotor'] == 0.5
    assert scores['psychological'] == 1.0
    assert scores['sleep'] == 0.0
