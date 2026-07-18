const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const FIELD_LABELS = {
  Pregnancies: 'Gestações',
  Glucose: 'Glicose',
  BloodPressure: 'Pressão sanguínea',
  SkinThickness: 'Espessura da pele',
  Insulin: 'Insulina sérica',
  BMI: 'IMC',
  DiabetesPedigreeFunction: 'Histórico familiar',
  Age: 'Idade',
}

function formatDetail(detail, status) {
  if (typeof detail === 'string') return detail

  if (Array.isArray(detail)) {
    return detail
      .map((err) => {
        const field = err.loc?.[err.loc.length - 1]
        const label = FIELD_LABELS[field] ?? field ?? 'Campo'
        return `${label}: valor inválido (${err.msg}).`
      })
      .join(' ')
  }

  return `Erro ${status} ao consultar a API.`
}

export async function predictDiabetes(payload) {
  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(formatDetail(body?.detail, response.status))
  }

  return response.json()
}
