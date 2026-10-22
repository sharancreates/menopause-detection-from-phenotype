"""
Integration tests for MenoPhenotype FastAPI microservice.
Tests health probes, dynamic metadata, validation contracts, CORS, and inference latency.
"""

import time
import pytest
from fastapi.testclient import TestClient

from menophenotype.api import app
from menophenotype.schemas import DOMAINS, SYMP_COLS

client = TestClient(app)


def test_root_info():
    """Verify root / info route returns version and documentation pointers."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "MenoPhenotype API"
    assert data["version"] == "1.0.0"
    assert "docs_url" in data
    assert "disclaimer" in data


def test_health_endpoint():
    """Verify GET /api/health probe returns 200 and indicates model readiness."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["models_loaded"] is True
    assert data["artifact_count"] >= 6
    assert "tuned_models.joblib" in data["artifacts_present"]
    assert "baseline_preprocessor.joblib" in data["artifacts_present"]


def test_metadata_endpoint():
    """Verify GET /api/metadata delivers complete 18-symptom codebook, domain structure, and staging questions."""
    response = client.get("/api/metadata")
    assert response.status_code == 200
    data = response.json()

    assert data["total_symptoms"] == 18
    assert len(data["symptoms"]) == 18
    assert set(data["domains"].keys()) == set(DOMAINS.keys())
    assert len(data["likert_scale"]) == 5
    assert "Phenotype A" in data["phenotypes"]
    assert "Phenotype B" in data["phenotypes"]
    assert "staging_questions" in data
    assert len(data["staging_questions"]) == 3
    assert "disclaimer" in data


def test_assess_with_staging_payload(sample_symptom_data):
    """Verify POST /api/assess includes complete STRAW+10 staging result when staging answers are provided."""
    payload = dict(sample_symptom_data)
    payload["age_range"] = "45-49"
    payload["cycle_regularity"] = "skipped"
    payload["time_since_period"] = "2_to_11_months"

    response = client.post("/api/assess", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "staging" in data
    staging = data["staging"]
    assert staging is not None
    assert staging["stage_id"] == "late_perimenopause"
    assert staging["is_near_menopause"] is True
    assert staging["timeline_step"] == 2
    assert "Near Menopause" in staging["stage_name"]
    assert len(staging["physician_discussion_points"]) > 0



def test_assess_valid_full_payload(sample_symptom_data):
    """Verify POST /api/assess returns 200 and schema compliant result for complete response."""
    response = client.post("/api/assess", json=sample_symptom_data)
    assert response.status_code == 200
    data = response.json()

    assert data["cluster"] in [0, 1]
    assert "Phenotype" in data["phenotype"]
    assert 0.0 <= data["confidence"] <= 1.0
    assert "Phenotype A" in data["probabilities"]
    assert "Phenotype B" in data["probabilities"]
    assert isinstance(data["atypical_flag"], bool)
    assert set(data["domain_scores"].keys()) == set(DOMAINS.keys())
    assert data["answered_items"] == 18
    assert data["total_items"] == 18
    assert "disclaimer" in data


def test_assess_partial_payload(partial_symptom_data):
    """Verify POST /api/assess handles partial responses accurately with median imputation."""
    response = client.post("/api/assess", json=partial_symptom_data)
    assert response.status_code == 200
    data = response.json()

    assert data["answered_items"] == len(partial_symptom_data)
    assert data["cluster"] in [0, 1]


def test_assess_empty_payload():
    """Verify POST /api/assess accepts empty payload without crashing."""
    response = client.post("/api/assess", json={})
    assert response.status_code == 200
    data = response.json()

    assert data["answered_items"] == 0
    assert data["total_items"] == 18
    for score in data["domain_scores"].values():
        assert score == 0.0


def test_assess_boundary_all_zeros(zero_burden_symptom_data):
    """Verify all 0s payload maps to Phenotype A (lower burden)."""
    response = client.post("/api/assess", json=zero_burden_symptom_data)
    assert response.status_code == 200
    data = response.json()

    assert data["cluster"] == 0
    assert "Phenotype A" in data["phenotype"]
    assert data["confidence"] > 0.80


def test_assess_boundary_all_fours(high_burden_symptom_data):
    """Verify all 4s payload maps to Phenotype B (higher burden)."""
    response = client.post("/api/assess", json=high_burden_symptom_data)
    assert response.status_code == 200
    data = response.json()

    assert data["cluster"] == 1
    assert "Phenotype B" in data["phenotype"]
    assert data["confidence"] > 0.80


def test_assess_invalid_range_above_max():
    """Verify POST /api/assess returns 422 when symptom score > 4."""
    response = client.post("/api/assess", json={"HOTFLAS0": 5})
    assert response.status_code == 422


def test_assess_invalid_range_negative():
    """Verify POST /api/assess returns 422 when symptom score < 0."""
    response = client.post("/api/assess", json={"HOTFLAS0": -1})
    assert response.status_code == 422


def test_assess_invalid_data_type():
    """Verify POST /api/assess returns 422 when string passed instead of integer."""
    response = client.post("/api/assess", json={"HOTFLAS0": "severe"})
    assert response.status_code == 422


def test_cors_headers():
    """Verify CORS middleware adds Access-Control headers."""
    response = client.options(
        "/api/assess",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
        }
    )
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers


def test_inference_latency_benchmark(sample_symptom_data):
    """
    Verify API latency requirement: average response time < 100ms
    across 10 sequential assessment requests.
    """
    latencies = []
    # Warmup
    client.post("/api/assess", json=sample_symptom_data)

    for _ in range(10):
        t0 = time.perf_counter()
        resp = client.post("/api/assess", json=sample_symptom_data)
        elapsed_ms = (time.perf_counter() - t0) * 1000.0
        assert resp.status_code == 200
        latencies.append(elapsed_ms)

    avg_latency = sum(latencies) / len(latencies)
    print(f"\n[Benchmark] Average /api/assess latency: {avg_latency:.2f}ms (Max: {max(latencies):.2f}ms)")
    assert avg_latency < 100.0, f"Average latency {avg_latency:.2f}ms exceeded 100ms threshold"
