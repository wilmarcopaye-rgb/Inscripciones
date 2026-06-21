import { useState } from 'react'
import { Link } from 'react-router-dom'
import LogoBanner from '../components/registration/LogoBanner'
import VoteCheckbox from '../components/registration/VoteCheckbox'
import SuccessScreen from '../components/registration/SuccessScreen'
import { CARRERAS_EXTRA, CARRERAS_GRUPOS } from '../lib/content'
import {
  obtenerMensajeError,
  registrarInscripcion,
  supabaseConfigurado,
  validarConfiguracionSupabase,
} from '../lib/supabase'
import {
  ESTADO_INICIAL,
  PREFERENCIAS,
  TIPOS_IDENTIFICACION,
  construirPayload,
  soloNumeros,
  validarFormulario,
} from '../lib/validation'

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-poppins text-sm text-white placeholder:text-white/30 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 disabled:opacity-60'

export default function Register() {
  const [values, setValues] = useState(ESTADO_INICIAL)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [errorGlobal, setErrorGlobal] = useState('')
  const [success, setSuccess] = useState(false)
  const [inscripcionId, setInscripcionId] = useState(null)
  const [tipoIdentificacion, setTipoIdentificacion] = useState(TIPOS_IDENTIFICACION.CODIGO_MATRICULA)
  const [voteSuccess, setVoteSuccess] = useState(false)
  const [voteWarning, setVoteWarning] = useState(false)

  const configError = validarConfiguracionSupabase()

  const handleChange = (field) => (event) => {
    let { value } = event.target
    if (field === 'telefono') value = soloNumeros(value, 9)
    if (field === 'dni') value = soloNumeros(value, 8)
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrores((prev) => ({ ...prev, [field]: undefined }))
    setErrorGlobal('')
  }

  const handleVoteChange = (preferencia) => {
    setValues((prev) => ({ ...prev, preferencia }))
    setErrores((prev) => ({ ...prev, preferencia: undefined }))
    setVoteSuccess(preferencia === PREFERENCIAS.TODOS_JUNTOS)
    setVoteWarning(preferencia === PREFERENCIAS.SOMOS_ESTUDIANTIL)
    setErrorGlobal('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationErrors = validarFormulario(values, tipoIdentificacion)
    if (Object.keys(validationErrors).length > 0) {
      setErrores(validationErrors)
      return
    }

    const configErrorActual = validarConfiguracionSupabase()
    if (configErrorActual) {
      setErrorGlobal(configErrorActual)
      return
    }

    setEnviando(true)
    setErrorGlobal('')

    const payload = construirPayload(values, tipoIdentificacion)
    console.log('Payload a enviar:', payload)
    const { error, id } = await registrarInscripcion(payload)
    
    console.log('Respuesta de registrar:', { error, id })

    setEnviando(false)

    if (error) {
      setErrorGlobal(obtenerMensajeError(error) ?? 'No pudimos completar tu inscripción.')
      return
    }

    if (!id) {
      setErrorGlobal('Error: No se recibió el ID de inscripción de la base de datos.')
      console.error('ID es null o undefined:', id)
      return
    }

    // Guardar en state
    setInscripcionId(id)

    // Guardar datos temporales en localStorage para el comentario
    const datosTemporales = {
      nombre: values.nombre,
      inscripcionId: id,
      timestamp: Date.now(),
    }
    localStorage.setItem('inscripcionTemporal', JSON.stringify(datosTemporales))
    console.log('Datos temporales guardados en localStorage:', datosTemporales)

    setSuccess(true)
  }

  if (success) {
    return <SuccessScreen nombre={values.nombre} inscripcionId={inscripcionId} />
  }

  return (
    <div className="register-page flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-4 inline-block font-poppins text-xs text-white/50 no-underline hover:text-white/80"
        >
          ← Volver al inicio
        </Link>

        <LogoBanner />

        <div
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(6, 182, 212, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/40 bg-gradient-to-br from-purple-500 to-purple-600">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bebas text-2xl leading-none text-white">Inscripción Estudiantil</h2>
              <p className="font-poppins text-xs text-white/60">Inscríbete y gana grandes premios 🎁</p>
            </div>
          </div>

          {configError && (
            <div className="mb-4 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
              {configError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <p className="mb-3 font-bebas text-lg tracking-wide bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                PREGUNTAS DE VOTACIÓN
              </p>
              <div className="space-y-3">
                <VoteCheckbox
                  number="1"
                  label="Vota por el TODOS JUNTOS POR LA UNA"
                  description="Marca el cuadro con el número 1"
                  checked={values.preferencia === PREFERENCIAS.TODOS_JUNTOS}
                  onChange={() => handleVoteChange(PREFERENCIAS.TODOS_JUNTOS)}
                  color="purple"
                />
                <VoteCheckbox
                  number="9"
                  label="🚫 NO al continuismo - ALTO a la corrupción"
                  description="Marca el cuadro con el número 9"
                  checked={values.preferencia === PREFERENCIAS.SOMOS_ESTUDIANTIL}
                  onChange={() => handleVoteChange(PREFERENCIAS.SOMOS_ESTUDIANTIL)}
                  color="cyan"
                />
              </div>
              {errores.preferencia && (
                <p className="mt-2 text-sm text-red-400">{errores.preferencia}</p>
              )}
            </div>

            {voteSuccess && (
              <div className="rounded-xl border-2 border-purple-500/60 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 text-center">
                <p className="font-bebas text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ¡FELICIDADES POR TU BUENA ELECCIÓN!
                </p>
                <p className="mt-1 font-poppins text-sm text-white/80">
                  Este <span className="font-bold text-purple-400">2 de julio</span> somos todos juntos por la UNA 💜
                </p>
              </div>
            )}

            {voteWarning && (
              <div className="rounded-xl border-2 border-red-500/60 bg-red-500/10 p-4 text-center">
                <p className="font-bebas text-xl text-red-400">🚫 ¡NO POR LOS CORRUPTOS!</p>
                <p className="mt-1 font-poppins text-sm text-white/80">
                  Marca el <span className="font-bold text-purple-400">CASILLA 1</span> — 2 de julio, todos juntos por la UNA 💜
                </p>
              </div>
            )}

            <div className="space-y-3 border-t border-white/10 pt-4">
              <div>
                <label htmlFor="nombre" className="mb-1 block font-poppins text-xs uppercase tracking-wider text-white/60">
                  Nombre completo *
                </label>
                <input
                  id="nombre"
                  className={inputClass}
                  value={values.nombre}
                  onChange={handleChange('nombre')}
                  placeholder="Tu nombre completo"
                  disabled={enviando}
                />
                {errores.nombre && <p className="mt-1 text-sm text-red-400">{errores.nombre}</p>}
              </div>

              {/* Toggle: DNI vs Código de Matrícula */}
              <div>
                <p className="mb-2 block font-poppins text-xs uppercase tracking-wider text-white/60">
                  Tipo de Identificación *
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTipoIdentificacion(TIPOS_IDENTIFICACION.CODIGO_MATRICULA)
                      setErrores((prev) => ({ ...prev, dni: undefined, codigoMatricula: undefined }))
                    }}
                    className={`flex-1 py-2 px-4 rounded-xl font-poppins text-sm transition font-semibold ${
                      tipoIdentificacion === TIPOS_IDENTIFICACION.CODIGO_MATRICULA
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'border border-purple-400/30 bg-purple-500/5 text-white hover:bg-purple-500/10'
                    }`}
                  >
                    CÓDIGO MATRÍCULA
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTipoIdentificacion(TIPOS_IDENTIFICACION.DNI)
                      setErrores((prev) => ({ ...prev, dni: undefined, codigoMatricula: undefined }))
                    }}
                    className={`flex-1 py-2 px-4 rounded-xl font-poppins text-sm transition font-semibold ${
                      tipoIdentificacion === TIPOS_IDENTIFICACION.DNI
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                        : 'border border-teal-400/30 bg-teal-500/5 text-white hover:bg-teal-500/10'
                    }`}
                  >
                    DNI
                  </button>
                </div>
              </div>

              {/* Mostrar Código de Matrícula solo si está seleccionado */}
              {tipoIdentificacion === TIPOS_IDENTIFICACION.CODIGO_MATRICULA && (
                <div>
                  <label htmlFor="codigoMatricula" className="mb-1 block font-poppins text-xs uppercase tracking-wider text-white/60">
                    Código de matrícula *
                  </label>
                  <input
                    id="codigoMatricula"
                    className={inputClass}
                    value={values.codigoMatricula}
                    onChange={handleChange('codigoMatricula')}
                    placeholder="Ej. 20XXXX"
                    disabled={enviando}
                  />
                  {errores.codigoMatricula && <p className="mt-1 text-sm text-red-400">{errores.codigoMatricula}</p>}
                </div>
              )}

              {/* Mostrar DNI solo si está seleccionado */}
              {tipoIdentificacion === TIPOS_IDENTIFICACION.DNI && (
                <div>
                  <label htmlFor="dni" className="mb-1 block font-poppins text-xs uppercase tracking-wider text-white/60">
                    DNI *
                  </label>
                  <input
                    id="dni"
                    type="text"
                    inputMode="numeric"
                    maxLength="8"
                    className={inputClass}
                    value={values.dni}
                    onChange={handleChange('dni')}
                    placeholder="Ej. 71XXXXXX"
                    disabled={enviando}
                  />
                  {errores.dni && <p className="mt-1 text-sm text-red-400">{errores.dni}</p>}
                </div>
              )}

              <div>
                <label htmlFor="telefono" className="mb-1 block font-poppins text-xs uppercase tracking-wider text-white/60">
                  Número de teléfono *
                </label>
                <input
                  id="telefono"
                  type="tel"
                  inputMode="numeric"
                  className={inputClass}
                  value={values.telefono}
                  onChange={handleChange('telefono')}
                  placeholder="9XX XXX XXX"
                  disabled={enviando}
                />
                {errores.telefono && <p className="mt-1 text-sm text-red-400">{errores.telefono}</p>}
              </div>

              <div>
                <label htmlFor="carrera" className="mb-1 block font-poppins text-xs uppercase tracking-wider text-white/60">
                  Carrera / Escuela profesional *
                </label>
                <select
                  id="carrera"
                  className={`${inputClass} cursor-pointer`}
                  value={values.carrera}
                  onChange={handleChange('carrera')}
                  disabled={enviando}
                >
                  <option value="" disabled>
                    Selecciona tu escuela profesional…
                  </option>
                  {CARRERAS_GRUPOS.map((grupo) => (
                    <optgroup key={grupo.label} label={grupo.label}>
                      {grupo.options.map((carrera) => (
                        <option key={carrera} value={carrera} className="text-slate-900">
                          {carrera}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  {CARRERAS_EXTRA.map((carrera) => (
                    <option key={carrera} value={carrera} className="text-slate-900">
                      {carrera}
                    </option>
                  ))}
                </select>
                {errores.carrera && <p className="mt-1 text-sm text-red-400">{errores.carrera}</p>}
              </div>
            </div>

            {errorGlobal && (
              <p className="text-center font-poppins text-sm text-red-400">{errorGlobal}</p>
            )}

            <button
              type="submit"
              disabled={enviando || !supabaseConfigurado()}
              className="font-bebas h-12 w-full rounded-xl text-xl tracking-wider text-white transition disabled:cursor-not-allowed disabled:opacity-50 font-bold"
              style={{
                background: '#06b6d4',
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
              }}
            >
              {enviando ? 'Enviando…' : 'INSCRIBIRME AHORA'}
            </button>

            <p className="text-center font-poppins text-xs text-white/40">
              Tus datos se usarán únicamente para la organización interna del movimiento estudiantil.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
