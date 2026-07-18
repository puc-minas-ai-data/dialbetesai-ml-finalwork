const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export async function predictDiabetes(payload) {
  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message = body?.detail
      ? JSON.stringify(body.detail)
      : `Erro ${response.status} ao consultar a API.`
    throw new Error(message)
  }

  return response.json()
}
