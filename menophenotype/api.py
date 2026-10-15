"""
MenoPhenotype FastAPI Microservice.
Exposes REST endpoints for symptom self-assessment scoring, questionnaire metadata,
and health monitoring backed by the SWAN baseline ML models.
"""

from contextlib import asynccontextmanager
from typing import Any, Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from menophenotype.inference import assess, load_models, resolve_artifact_dir
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


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager that pre-loads ML models into cache on startup."""
    try:
        load_models()
    except Exception as e:
        print(f"[Warning] Failed to pre-load models during startup: {e}")
    yield


app = FastAPI(
    title="MenoPhenotype API",
    description=(
        "Production ML inference microservice for Menopause Phenotype Pattern Matching, "
        "trained on the Study of Women's Health Across the Nation (SWAN) cohort."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware for local frontend and web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Info"])
def root_info() -> Dict[str, Any]:
    """Basic service information and API documentation route."""
    return {
        "service": "MenoPhenotype API",
        "version": "1.0.0",
        "docs_url": "/docs",
        "health_url": "/api/health",
        "metadata_url": "/api/metadata",
        "assess_url": "/api/assess",
        "disclaimer": CLINICAL_DISCLAIMER,
    }


@app.get("/api/health", tags=["Monitoring"])
def health_check() -> Dict[str, Any]:
    """Health probe reporting service status and model artifact presence."""
    art_dir = resolve_artifact_dir()
    artifacts = [f.name for f in art_dir.glob("*.*")] if art_dir.exists() else []
    models_ready = bool((art_dir / "tuned_models.joblib").exists())

    return {
        "status": "healthy" if models_ready else "degraded",
        "version": "1.0.0",
        "models_loaded": models_ready,
        "artifact_count": len(artifacts),
        "artifacts_present": sorted(artifacts),
    }


@app.get("/api/metadata", tags=["Metadata"])
def get_questionnaire_metadata() -> Dict[str, Any]:
    """Retrieve full questionnaire codebook, clinical domains, Likert scale, and phenotype descriptions."""
    return {
        "symptoms": QUESTIONNAIRE_ITEMS,
        "domains": DOMAINS,
        "likert_scale": LIKERT_SCALE,
        "phenotypes": PHENOTYPE_PROFILES,
        "total_symptoms": len(SYMP_COLS),
        "disclaimer": CLINICAL_DISCLAIMER,
    }


@app.post("/api/assess", response_model=SymptomAssessmentOutput, tags=["Inference"])
def assess_symptoms(payload: SymptomAssessmentInput) -> Dict[str, Any]:
    """
    Score symptom responses against the 18-symptom phenotype clustering pipeline (GMM k=2).
    Returns matched phenotype, posterior confidence (0.0-1.0), atypical consensus flag,
    and domain-level normalized severity scores.
    """
    try:
        answers = payload.model_dump(exclude_none=True)
        result = assess(answers)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Inference error during symptom assessment: {str(e)}"
        )
