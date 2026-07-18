import { useState } from 'react'
import DiabetesForm from './components/DiabetesForm'
import PredictionResult from './components/PredictionResult'
import './App.css'

function App() {
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  return (
    <>
      <header id="hero">
        <h1>DiabetesAI</h1>
        <p>
          Estimativa de risco de diabetes a partir de indicadores clínicos, usando um modelo de
          Regressão Logística treinado no dataset Pima Indians Diabetes.
        </p>
        <p className="disclaimer">
          Ferramenta educacional — não substitui diagnóstico médico.
        </p>
      </header>

      <section id="content">
        <DiabetesForm
          onLoading={() => {
            setStatus('loading')
            setError(null)
          }}
          onResult={(r) => {
            setResult(r)
            setStatus('success')
          }}
          onError={(message) => {
            setError(message)
            setStatus('error')
          }}
        />

        <PredictionResult status={status} result={result} error={error} />
      </section>
    </>
  )
}

export default App
