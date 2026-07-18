# DiabetesAI

Trabalho final da disciplina **Machine Learning** (PUC Minas): um projeto completo de classificação supervisionada que vai da exploração dos dados até uma interface web para consumir o modelo treinado.

O projeto prevê o risco de diabetes de um paciente a partir de 8 indicadores clínicos (dataset [Pima Indians Diabetes](https://www.kaggle.com/datasets/uciml/pima-indians-diabetes-database)), combinando:

- um **notebook de experimento de ML** (EDA, pré-processamento, comparação de modelos, interpretabilidade e exportação do modelo);
- uma **API em FastAPI** que carrega o modelo treinado e expõe um endpoint de predição;
- uma **interface web em React** para preencher os dados do paciente e visualizar o resultado.

> ⚠️ Ferramenta educacional — não substitui diagnóstico médico.

## Estrutura do repositório

```
backend/
  dados/                    dataset diabetes.csv
  jupyter/
    trabalho-final.ipynb                        notebook do experimento (entrega obrigatória)
    referencia_diabetes_classificacao_completa.ipynb   notebook de referência usado como inspiração
  modelos/                  artefatos exportados pelo notebook (modelo, scaler, features)
  src/main.py                API FastAPI + entrypoint (`uv run start`)
  pyproject.toml

frontend/
  src/
    components/             DiabetesForm, PredictionResult
    api.js                  chamada HTTP para a API
    App.jsx                 página principal
  package.json
```

## Dataset e modelo

Dataset Pima Indians Diabetes: 768 registros, 8 features clínicas (`Pregnancies`, `Glucose`, `BloodPressure`, `SkinThickness`, `Insulin`, `BMI`, `DiabetesPedigreeFunction`, `Age`) e variável alvo `Outcome` (1 = diabético, 0 = não diabético).

No notebook (`backend/jupyter/trabalho-final.ipynb`), 4 modelos de classificação foram treinados e comparados:

| Modelo | Acurácia | Precisão | Recall | F1-Score | AUC-ROC |
|---|---|---|---|---|---|
| **Regressão Logística** | 0.7446 | 0.6719 | 0.5309 | 0.5931 | **0.8361** |
| Random Forest | 0.7359 | 0.6562 | 0.5185 | 0.5793 | 0.8230 |
| XGBoost | 0.7446 | 0.6528 | 0.5802 | 0.6144 | 0.8172 |
| Árvore de Decisão | 0.7316 | 0.6338 | 0.5556 | 0.5921 | 0.7488 |

A **Regressão Logística** foi escolhida como melhor modelo (maior AUC-ROC) e é a que a API carrega em produção. O notebook também inclui interpretabilidade com SHAP e LIME.

## Como executar

Pré-requisitos: [uv](https://docs.astral.sh/uv/) e [Node.js](https://nodejs.org/) 18+.

### Backend (API)

```bash
cd backend
uv sync
uv run start
```

A API sobe em `http://localhost:8000` (documentação interativa em `http://localhost:8000/docs`).

- `GET /health` — status da API e nome do modelo carregado.
- `POST /predict` — recebe as 8 features e retorna `outcome`, `label`, `probability` e `risk_level`.

### Frontend (interface web)

```bash
cd frontend
npm install
npm run dev
```

A interface sobe em `http://localhost:5173` e consome a API em `http://localhost:8000` (configurável em `frontend/.env`, variável `VITE_API_URL`).

> Os dois servidores rodam separadamente: suba o backend antes do frontend.

### Notebook

Abra `backend/jupyter/trabalho-final.ipynb` no Jupyter/VS Code usando o kernel do ambiente `backend/.venv` (registrado como `DialbetesAI (backend .venv)`). Executá-lo novamente regenera os artefatos em `backend/modelos/`.

## Entregas do trabalho

1. Notebook de experimento — `backend/jupyter/trabalho-final.ipynb`
2. Relatório em PDF com prints da interface (entrega separada, fora deste repositório)
3. Link deste repositório (entrega opcional/bônus)

## Autor

Leonardo Soares Castro
