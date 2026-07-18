# DiabetesAI — Frontend

Interface web (React + Vite) para preencher os dados clínicos de um paciente e visualizar o risco de diabetes estimado pela API do backend.

## Estrutura

```
src/
  api.js                          chamada HTTP para a API (POST /predict)
  components/
    DiabetesForm.jsx              formulário com os 8 campos numéricos
    PredictionResult.jsx          cartão de resultado (probabilidade + nível de risco)
  App.jsx                         página principal
  App.css / index.css             estilos e variáveis de tema (claro/escuro)
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- Backend rodando em `http://localhost:8000` (ver `backend/README.md`)

## Como executar

```bash
npm install
npm run dev
```

Sobe em `http://localhost:5173`.

## Configuração

A URL da API é lida de `VITE_API_URL` (arquivo `.env`, já presente no projeto):

```
VITE_API_URL=http://localhost:8000
```

## Fluxo

1. `DiabetesForm` valida os campos (`required`, `min`/`max` espelhando os limites da API) e envia os dados para `predictDiabetes` (`src/api.js`).
2. `App.jsx` guarda o estado da requisição (`idle` / `loading` / `success` / `error`) e passa para `PredictionResult`.
3. `PredictionResult` exibe a probabilidade estimada e um selo de risco (baixo/moderado/alto, com cores próprias em `App.css`) ou uma mensagem de erro amigável, caso a API rejeite os dados ou esteja fora do ar.

## Scripts disponíveis

- `npm run dev` — servidor de desenvolvimento com hot-reload
- `npm run build` — build de produção (`dist/`)
- `npm run preview` — serve o build de produção localmente
- `npm run lint` — lint com Oxlint
