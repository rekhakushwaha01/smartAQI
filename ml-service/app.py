"""
FastAPI service for SmartAQI risk scoring.

Uses the same demo risk category / score logic as the main frontend
(frontend/src/utils/riskCalculator.js). No trained model is required.

Run:  uvicorn app:app --host 127.0.0.1 --port 8000
"""
from typing import Any, Dict, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from recommend import build_prediction

app = FastAPI(title="SmartAQI ML service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    aqi: float = Field(..., ge=0, le=1000)
    pollutants: Optional[Dict[str, Any]] = None
    profile: Dict[str, Any] = {}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": True,
        "modelSource": "demo",
        "logic": "frontend demo riskCalculator",
    }


@app.post("/predict")
def predict(req: PredictRequest):
    return build_prediction(req.aqi, req.profile or {}, req.pollutants or {})
