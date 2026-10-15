"""
ASGI entry point for the MenoPhenotype API server.
Run with:
    uvicorn main:app --reload --port 8000
Or execute directly with Python:
    python main.py
"""

import uvicorn
from menophenotype.api import app

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
