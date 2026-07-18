import { useState } from 'react'
import { predictDiabetes } from '../api'

const FIELDS = [
  { name: 'Pregnancies', label: 'Gestações', unit: '', min: 0, max: 17, step: 1, default: 1 },
  { name: 'Glucose', label: 'Glicose', unit: 'mg/dL', min: 0, max: 200, step: 1, default: 117 },
  { name: 'BloodPressure', label: 'Pressão sanguínea (diastólica)', unit: 'mmHg', min: 0, max: 130, step: 1, default: 72 },
  { name: 'SkinThickness', label: 'Espessura da pele (tríceps)', unit: 'mm', min: 0, max: 100, step: 1, default: 23 },
  { name: 'Insulin', label: 'Insulina sérica (2h)', unit: 'µU/mL', min: 0, max: 850, step: 1, default: 30 },
  { name: 'BMI', label: 'IMC', unit: 'kg/m²', min: 0, max: 70, step: 'any', default: 32 },
  { name: 'DiabetesPedigreeFunction', label: 'Histórico familiar (índice)', unit: '', min: 0, max: 2.5, step: 'any', default: 0.3725 },
  { name: 'Age', label: 'Idade', unit: 'anos', min: 1, max: 120, step: 1, default: 29 },
]

const initialState = Object.fromEntries(FIELDS.map((f) => [f.name, String(f.default)]))

export default function DiabetesForm({ onLoading, onResult, onError }) {
  const [values, setValues] = useState(initialState)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    onLoading?.()

    try {
      const payload = Object.fromEntries(
        FIELDS.map((f) => [f.name, Number(values[f.name])]),
      )
      const result = await predictDiabetes(payload)
      onResult?.(result)
    } catch (error) {
      onError?.(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="diabetes-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        {FIELDS.map((field) => (
          <label key={field.name} className="form-field">
            <span>
              {field.label}
              {field.unit && <small> ({field.unit})</small>}
            </span>
            <input
              type="number"
              required
              min={field.min}
              max={field.max}
              step={field.step}
              value={values[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          </label>
        ))}
      </div>

      <button type="submit" className="submit-button" disabled={submitting}>
        {submitting ? 'Verificando...' : 'Verificar risco de diabetes'}
      </button>
    </form>
  )
}
