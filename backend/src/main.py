from pathlib import Path
from typing import Literal

import joblib
import pandas as pd
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

MODELOS_DIR = Path(__file__).resolve().parent.parent / "modelos"

modelo = joblib.load(MODELOS_DIR / "diabetes_melhor_modelo.pkl")
scaler = joblib.load(MODELOS_DIR / "diabetes_scaler.pkl")
features = joblib.load(MODELOS_DIR / "diabetes_features.pkl")

app = FastAPI(title="DiabetesAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class DiabetesInput(BaseModel):
    Pregnancies: int = Field(ge=0, le=17)
    Glucose: float = Field(ge=0, le=200)
    BloodPressure: float = Field(ge=0, le=130)
    SkinThickness: float = Field(ge=0, le=100)
    Insulin: float = Field(ge=0, le=850)
    BMI: float = Field(ge=0, le=70)
    DiabetesPedigreeFunction: float = Field(ge=0, le=2.5)
    Age: int = Field(ge=1, le=120)


class PredictionOutput(BaseModel):
    outcome: int
    label: Literal["Diabético", "Não diabético"]
    probability: float
    risk_level: Literal["baixo", "moderado", "alto"]


def classificar_risco(probability: float) -> str:
    if probability < 0.33:
        return "baixo"
    if probability < 0.66:
        return "moderado"
    return "alto"


@app.get("/health")
def health():
    return {"status": "ok", "model": type(modelo).__name__}


@app.post("/predict", response_model=PredictionOutput)
def predict(dados: DiabetesInput):
    entrada = pd.DataFrame([dados.model_dump()])[features]
    entrada_sc = pd.DataFrame(scaler.transform(entrada), columns=features)

    outcome = int(modelo.predict(entrada_sc)[0])
    probability = float(modelo.predict_proba(entrada_sc)[0, 1])

    return PredictionOutput(
        outcome=outcome,
        label="Diabético" if outcome == 1 else "Não diabético",
        probability=probability,
        risk_level=classificar_risco(probability),
    )


def main():
    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
