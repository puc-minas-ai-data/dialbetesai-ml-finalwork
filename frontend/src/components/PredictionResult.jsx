const RISK_TEXT = {
  baixo: 'Risco baixo',
  moderado: 'Risco moderado',
  alto: 'Risco alto',
}

export default function PredictionResult({ status, result, error }) {
  if (status === 'loading') {
    return <div className="result-card result-loading">Calculando...</div>
  }

  if (status === 'error') {
    return (
      <div className="result-card result-error">
        <strong>Não foi possível calcular o resultado.</strong>
        <p>{error}</p>
      </div>
    )
  }

  if (status === 'success' && result) {
    return (
      <div className={`result-card risk-${result.risk_level}`}>
        <span className="risk-badge">{RISK_TEXT[result.risk_level]}</span>
        <p className="result-label">{result.label}</p>
        <p className="result-probability">
          Probabilidade estimada: <strong>{(result.probability * 100).toFixed(1)}%</strong>
        </p>
      </div>
    )
  }

  return (
    <div className="result-card result-placeholder">
      Preencha os dados e clique em "Verificar risco de diabetes" para ver o resultado aqui.
    </div>
  )
}
