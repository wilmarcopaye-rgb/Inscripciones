import { useState } from 'react'
import { esErrorDuplicado, registrarInscripcion } from '../lib/supabase'
import {
  CARRERAS_SUGERIDAS,
  ESTADO_INICIAL,
  PREFERENCIAS,
  construirPayload,
  soloNumeros,
  validarFormulario,
} from '../lib/validation'
import SuccessMessage from './SuccessMessage'

const MENSAJE_DUPLICADO = 'Ya existe una inscripción con esos datos.'
const MENSAJE_ERROR_GENERAL =
  'No pudimos completar tu inscripción. Inténtalo de nuevo en unos momentos.'

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass =
  'block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-slate-100'

export default function RegistrationForm() {
  const [values, setValues] = useState(ESTADO_INICIAL)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [errorGlobal, setErrorGlobal] = useState('')
  const [inscripcionExitosa, setInscripcionExitosa] = useState(null)

  const handleChange = (field) => (event) => {
    let { value } = event.target

    if (field === 'dni') {
      value = soloNumeros(value, 8)
    } else if (field === 'telefono') {
      value = soloNumeros(value, 9)
    }

    setValues((prev) => ({ ...prev, [field]: value }))
    setErrores((prev) => ({ ...prev, [field]: undefined }))
    setErrorGlobal('')
  }

  const handlePreferencia = (preferencia) => {
    setValues((prev) => ({ ...prev, preferencia }))
    setErrores((prev) => ({ ...prev, preferencia: undefined }))
    setErrorGlobal('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationErrors = validarFormulario(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrores(validationErrors)
      return
    }

    setEnviando(true)
    setErrorGlobal('')

    const payload = construirPayload(values)
    const { error } = await registrarInscripcion(payload)

    setEnviando(false)

    if (error) {
      if (esErrorDuplicado(error)) {
        setErrorGlobal(MENSAJE_DUPLICADO)
      } else {
        console.error('[Inscripción]', error)
        setErrorGlobal(MENSAJE_ERROR_GENERAL)
      }
      return
    }

    setInscripcionExitosa({ nombre: payload.nombre })
    setValues(ESTADO_INICIAL)
    setErrores({})
  }

  const handleNuevaInscripcion = () => {
    setInscripcionExitosa(null)
    setErrorGlobal('')
  }

  if (inscripcionExitosa) {
    return (
      <SuccessMessage
        nombre={inscripcionExitosa.nombre}
        onNuevaInscripcion={handleNuevaInscripcion}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {errorGlobal && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {errorGlobal}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="nombre" label="Nombre completo *" error={errores.nombre}>
          <input
            id="nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            maxLength={100}
            value={values.nombre}
            onChange={handleChange('nombre')}
            className={inputClass}
            placeholder="Ej. Juan Pérez García"
            aria-invalid={Boolean(errores.nombre)}
            aria-describedby={errores.nombre ? 'nombre-error' : undefined}
            disabled={enviando}
          />
        </Field>

        <Field id="dni" label="DNI *" error={errores.dni}>
          <input
            id="dni"
            name="dni"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={8}
            value={values.dni}
            onChange={handleChange('dni')}
            className={inputClass}
            placeholder="8 dígitos"
            aria-invalid={Boolean(errores.dni)}
            aria-describedby={errores.dni ? 'dni-error' : undefined}
            disabled={enviando}
          />
        </Field>

        <Field id="codigo_matricula" label="Código de matrícula *" error={errores.codigo_matricula}>
          <input
            id="codigo_matricula"
            name="codigo_matricula"
            type="text"
            autoComplete="off"
            maxLength={20}
            value={values.codigo_matricula}
            onChange={handleChange('codigo_matricula')}
            className={inputClass}
            placeholder="Ej. 2024001234"
            aria-invalid={Boolean(errores.codigo_matricula)}
            aria-describedby={errores.codigo_matricula ? 'codigo_matricula-error' : undefined}
            disabled={enviando}
          />
        </Field>

        <Field id="telefono" label="Número de celular *" error={errores.telefono}>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={9}
            value={values.telefono}
            onChange={handleChange('telefono')}
            className={inputClass}
            placeholder="9 dígitos"
            aria-invalid={Boolean(errores.telefono)}
            aria-describedby={errores.telefono ? 'telefono-error' : undefined}
            disabled={enviando}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field id="carrera" label="Carrera *" error={errores.carrera}>
            <input
              id="carrera"
              name="carrera"
              type="text"
              list="carreras-list"
              maxLength={100}
              value={values.carrera}
              onChange={handleChange('carrera')}
              className={inputClass}
              placeholder="Ej. Ingeniería de Sistemas"
              aria-invalid={Boolean(errores.carrera)}
              aria-describedby={errores.carrera ? 'carrera-error' : undefined}
              disabled={enviando}
            />
            <datalist id="carreras-list">
              {CARRERAS_SUGERIDAS.map((carrera) => (
                <option key={carrera} value={carrera} />
              ))}
            </datalist>
          </Field>
        </div>
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-slate-700">
          Preferencia de lista *
        </legend>
        <p className="mt-1 text-xs text-slate-500">Solo puedes seleccionar una opción.</p>

        {errores.preferencia && (
          <p className="mt-1.5 text-sm text-red-600" role="alert">
            {errores.preferencia}
          </p>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            {
              value: PREFERENCIAS.TODOS_JUNTOS,
              label: 'Todos Juntos',
              description: 'Lista de unidad y trabajo colectivo.',
            },
            {
              value: PREFERENCIAS.SOMOS_ESTUDIANTIL,
              label: 'Somos Estudiantil',
              description: 'Lista con enfoque en representación estudiantil.',
            },
          ].map((opcion) => {
            const selected = values.preferencia === opcion.value

            return (
              <label
                key={opcion.value}
                className={`relative flex cursor-pointer rounded-xl border-2 p-4 transition ${
                  selected
                    ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-600/20'
                    : 'border-slate-200 bg-white hover:border-primary-300'
                } ${enviando ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                <input
                  type="radio"
                  name="preferencia"
                  value={opcion.value}
                  checked={selected}
                  onChange={() => handlePreferencia(opcion.value)}
                  className="mt-1 h-4 w-4 shrink-0 border-slate-300 text-primary-600 focus:ring-primary-500"
                  disabled={enviando}
                />
                <span className="ml-3">
                  <span className="block text-sm font-semibold text-slate-900">
                    {opcion.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {opcion.description}
                  </span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={enviando}
        className="flex w-full items-center justify-center rounded-full bg-primary-700 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {enviando ? (
          <>
            <svg
              className="-ml-1 mr-2 h-5 w-5 animate-spin text-white"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Enviando...
          </>
        ) : (
          'Inscribirme'
        )}
      </button>

      <p className="text-center text-xs text-slate-500">
        Al inscribirte, aceptas que tus datos sean utilizados únicamente para fines del
        movimiento estudiantil.
      </p>
    </form>
  )
}
