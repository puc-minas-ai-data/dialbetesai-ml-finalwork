# DiabetesAI — Backend

Notebook de experimento de Machine Learning + API FastAPI que serve o modelo treinado para prever risco de diabetes.

## Estrutura

```
dados/                      dataset diabetes.csv (Pima Indians Diabetes)
jupyter/
  trabalho-final.ipynb                              notebook do experimento (entrega obrigatória)
  referencia_diabetes_classificacao_completa.ipynb  notebook de referência usado como inspiração
modelos/                    artefatos exportados pelo notebook via joblib
  diabetes_melhor_modelo.pkl
  diabetes_scaler.pkl
  diabetes_features.pkl
src/main.py                 API FastAPI + entrypoint (`uv run start`)
```

## Pré-requisitos

- [uv](https://docs.astral.sh/uv/) instalado
- Python é resolvido automaticamente pelo `uv` (`.python-version` fixa 3.12 — necessário para compatibilidade com `shap`/`lime`/`numba`)

## Notebook

```bash
uv sync
```

Abra `jupyter/trabalho-final.ipynb` no Jupyter/VS Code usando o kernel `DialbetesAI (backend .venv)` (registrado via `python -m ipykernel install --user --name=dialbetesai-ml`, já feito neste ambiente). Executá-lo novamente regenera os arquivos em `modelos/`.

O notebook cobre: importação e inspeção dos dados, EDA (4+ gráficos), pré-processamento (imputação por mediana + `StandardScaler`), treino e comparação de 4 modelos (Regressão Logística, Árvore de Decisão, Random Forest, XGBoost), avaliação (Acurácia, Precisão, Recall, F1, AUC-ROC, matriz de confusão, curva ROC), interpretabilidade com SHAP e LIME, exportação do melhor modelo e predição em novos dados.

Resultado da comparação (conjunto de teste):

| Modelo | Acurácia | Precisão | Recall | F1-Score | AUC-ROC |
|---|---|---|---|---|---|
| **Regressão Logística** | 0.7446 | 0.6719 | 0.5309 | 0.5931 | **0.8361** |
| Random Forest | 0.7359 | 0.6562 | 0.5185 | 0.5793 | 0.8230 |
| XGBoost | 0.7446 | 0.6528 | 0.5802 | 0.6144 | 0.8172 |
| Árvore de Decisão | 0.7316 | 0.6338 | 0.5556 | 0.5921 | 0.7488 |

## API

```bash
uv run start
```

Sobe em `http://localhost:8000` (Swagger em `/docs`). Carrega os artefatos de `modelos/` uma única vez no startup.

### `GET /health`

Retorna `{"status": "ok", "model": "<nome da classe do modelo>"}`.

### `POST /predict`

Recebe as 8 features do paciente e retorna a predição.

**Request:**
```json
{
  "Pregnancies": 6,
  "Glucose": 148,
  "BloodPressure": 72,
  "SkinThickness": 35,
  "Insulin": 0,
  "BMI": 33.6,
  "DiabetesPedigreeFunction": 0.627,
  "Age": 50
}
```

**Response:**
```json
{
  "outcome": 1,
  "label": "Diabético",
  "probability": 0.6825,
  "risk_level": "alto"
}
```

Cada campo tem limites validados via Pydantic (`Field(ge=..., le=...)`); valores fora da faixa ou de tipo inválido retornam `422` com o detalhe do erro.

CORS liberado para `http://localhost:5173` e `http://127.0.0.1:5173` (frontend em dev).
