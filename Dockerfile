# ==============================================================================
# Stage 1: Build React + Vite Frontend Bundle
# ==============================================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ==============================================================================
# Stage 2: Production Python Microservice Runtime
# ==============================================================================
FROM python:3.10-slim AS runtime
WORKDIR /app

# Install curl for container healthcheck probe
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Install pinned backend Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application packages, entry point, shims, and pre-trained model artifacts
COPY menophenotype/ menophenotype/
COPY artifacts/ artifacts/
COPY main.py meno_preproc.py ./

# Copy compiled frontend static bundle from Stage 1
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Expose unified web and API port
EXPOSE 8000

# Container healthcheck probe against FastAPI health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Launch production ASGI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
