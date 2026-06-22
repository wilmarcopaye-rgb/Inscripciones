import { useState, useEffect } from 'react';
import VoteCheckbox from '../registration/VoteCheckbox';
import SuccessScreen from '../registration/SuccessScreen';
import { CARRERAS_OPCIONES } from '../../lib/content';
import {
  obtenerMensajeError,
  registrarInscripcion,
  supabaseConfigurado,
  validarConfiguracionSupabase,
} from '../../lib/supabase';
import {
  ESTADO_INICIAL,
  PREFERENCIAS,
  TIPOS_IDENTIFICACION,
  construirPayload,
  soloNumeros,
  validarFormulario,
} from '../../lib/validation';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-poppins text-sm text-white placeholder:text-white/30 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 disabled:opacity-60';

export default function RegisterModal({ isOpen, onClose }) {
  const [values, setValues] = useState(ESTADO_INICIAL);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState('');
  const [success, setSuccess] = useState(false);
  const [inscripcionId, setInscripcionId] = useState(null);
  const [tipoIdentificacion, setTipoIdentificacion] = useState(TIPOS_IDENTIFICACION.CODIGO_MATRICULA);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [voteWarning, setVoteWarning] = useState(false);
  const [votoInvalido, setVotoInvalido] = useState(false);

  const configError = validarConfiguracionSupabase();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setSuccess(false);
    setValues(ESTADO_INICIAL);
    setErrores({});
    setErrorGlobal('');
    setTipoIdentificacion(TIPOS_IDENTIFICACION.CODIGO_MATRICULA);
    setVoteSuccess(false);
    setVoteWarning(false);
    setVotoInvalido(false);
    onClose();
  };

  const handleChange = (field) => (event) => {
    let { value } = event.target;
    if (field === 'telefono') value = soloNumeros(value, 9);
    if (field === 'dni') value = soloNumeros(value, 8);
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrores((prev) => ({ ...prev, [field]: undefined }));
    setErrorGlobal('');
  };

  const handleVoteChange = (preferencia) => {
    setValues((prev) => ({ ...prev, preferencia }));
    setErrores((prev) => ({ ...prev, preferencia: undefined }));
    setVoteSuccess(preferencia === PREFERENCIAS.TODOS_JUNTOS);
    setVoteWarning(preferencia === PREFERENCIAS.SOMOS_ESTUDIANTIL);
    setErrorGlobal('');
    if (preferencia === PREFERENCIAS.SOMOS_ESTUDIANTIL) {
      setVotoInvalido(true);
    } else {
      setVotoInvalido(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (votoInvalido) {
      setErrorGlobal('⚠️ No, sobrin@ ahí no es');
      return;
    }

    const validationErrors = validarFormulario(values, tipoIdentificacion);
    if (Object.keys(validationErrors).length > 0) {
      setErrores(validationErrors);
      return;
    }

    const configErrorActual = validarConfiguracionSupabase();
    if (configErrorActual) {
      setErrorGlobal(configErrorActual);
      return;
    }

    setEnviando(true);
    setErrorGlobal('');

    const payload = construirPayload(values, tipoIdentificacion);
    const { error, id } = await registrarInscripcion(payload);

    setEnviando(false);

    if (error) {
      setErrorGlobal(obtenerMensajeError(error) ?? 'No pudimos completar tu inscripción.');
      return;
    }

    setInscripcionId(id);
    setSuccess(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[998] bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      />

      <div
        className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div
          className="w-full max-w-md my-8 relative"
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          <button
            onClick={handleClose}
            className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors md:-top-10 md:-right-10"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {success ? (
            <div
              className="rounded-2xl p-6 overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <SuccessScreen nombre={values.nombre} inscripcionId={inscripcionId} onClose={handleClose} />
            </div>
          ) : (
            <div
              className="rounded-2xl p-6 overflow-hidden"
              style={{
                background: 'rgba(61, 31, 122, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* 🔹 ENCABEZADO - Logo VamosTodos.png ✨ */}
              <div className="mb-6 flex items-start justify-between gap-3">
                <div className="flex gap-3 flex-1 items-center">
                  {/* Logo más grande y centrado verticalmente */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg overflow-hidden border-2 border-green-400/30 bg-white/5">
                    <img 
                      src="/VamosTodos.png" 
                      alt="Movimiento" 
                      className="h-full w-full object-contain p-1" 
                    />
                  </div>
                  <div>
                    <h2 className="font-bebas text-2xl leading-tight text-white">
                      YA DECIDI MI VOTO,
                    </h2>
                    <p className="font-poppins text-sm text-green-400 font-semibold">
                      Este 2 de julio construimos un futuro de nuestra universidad.
                    </p>
                  </div>
                </div>

                {/* Recuadro con número 1 + "marca así" debajo ✨ */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white border-2 border-white">
                    <span className="font-bebas text-lg text-purple-600">1</span>
                    <svg viewBox="0 0 50 50" className="absolute inset-0 h-full w-full p-0.5">
                      <line x1="8" y1="8" x2="42" y2="42" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
                      <line x1="42" y1="8" x2="8" y2="42" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-semibold text-white/70 font-poppins mt-1 leading-none tracking-wide uppercase">
                    marca así
                  </p>
                </div>
              </div>

              {configError && (
                <div className="mb-4 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
                  {configError}
                </div>
              )}
              <form onSubmit={handleSubmit} noValidate className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
                {/* 🔹 SECCIÓN DE VOTACIÓN */}
                <div>
                  <p className="mb-3 font-bebas text-2xl tracking-wide text-white">
                    Cédula de votación
                  </p>

                  {/* Opción 1 - TODOS JUNTOS */}
                  <div
                    className={`rounded-xl border-2 p-4 mb-3 transition-all ${
                      values.preferencia === PREFERENCIAS.TODOS_JUNTOS
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/20 bg-white/5'
                    }`}
                  >
                    <VoteCheckbox
                      number="1"
                      label="Vota por el TODOS JUNTOS POR LA UNA"
                      description="Marca el cuadro con el número 1"
                      checked={values.preferencia === PREFERENCIAS.TODOS_JUNTOS}
                      onChange={() => handleVoteChange(PREFERENCIAS.TODOS_JUNTOS)}
                      color="purple"
                      emoji="😊"
                      
                    />
                  </div>

                  {/* Opción 4 - NO al continuismo */}
                  <div
                    className={`rounded-xl border-2 p-4 transition-all ${
                      values.preferencia === PREFERENCIAS.SOMOS_ESTUDIANTIL
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-white/20 bg-white/5'
                    }`}
                  >
                    <VoteCheckbox
                      number="4"
                      label="No sobrin@ no regreses con tu ex"
                      description="Marca el cuadro con el número 4"
                      checked={values.preferencia === PREFERENCIAS.SOMOS_ESTUDIANTIL}
                      onChange={() => handleVoteChange(PREFERENCIAS.SOMOS_ESTUDIANTIL)}
                      color="red"
                      emoji="😞"
                     
                    />
                  </div>

                  {/* Mensaje de error para opción 4 */}
                  {votoInvalido && (
                    <div className="mt-3 rounded-xl border border-red-500/60 bg-red-500/10 p-3 text-center flex items-center justify-center gap-2">
                      <span className="text-2xl">⚠️</span>
                      <span className="font-poppins text-sm text-red-400 font-bold">
                        No, sobrin@ ahí no es
                      </span>
                    </div>
                  )}

                  {errores.preferencia && (
                    <p className="mt-2 text-sm text-red-400">{errores.preferencia}</p>
                  )}
                </div>

                {/* 🔹 MENSAJES DE ESTADO */}
                {voteSuccess && (
                  <div className="rounded-xl border-2 border-purple-500/60 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 text-center">
                    <p className="font-bebas text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      ¡FELICIDADES POR TU BUENA ELECCIÓN!
                    </p>
                    <p className="mt-1 font-poppins text-sm text-white/80">
                      Este <span className="font-bold text-purple-400">2 de julio</span> somos todos juntos por la UNA 🐧
                    </p>
                  </div>
                )}

                {voteWarning && !votoInvalido && (
                  <div className="rounded-xl border-2 border-red-500/60 bg-red-500/10 p-4 text-center">
                    <p className="font-bebas text-xl text-red-400">🚫 ¡NO POR LOS CORRUPTOS!</p>
                    <p className="mt-1 font-poppins text-sm text-white/80">
                      Marca el <span className="font-bold text-purple-400">CASILLA 1</span> — 2 de julio, todos juntos por la UNA 💜
                    </p>
                  </div>
                )}

                {/* 🔹 TEXTO DE AYUDA "Sobrin@ llena tus datos..." – Más grande, mayúsculas ✨ */}
                <p className="mt-3 text-center font-bebas text-3xl text-green-400 font-bold uppercase tracking-wide drop-shadow-lg">
                  SOBRIN@ LLENA TUS DATOS Y ASÍ GANARÁS GRANDES PREMIOS
                </p>

                {/* 🔹 CAMPOS DEL FORMULARIO */}
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
                      placeholder="Apellidos y nombres"
                      disabled={enviando}
                    />
                    {errores.nombre && <p className="mt-1 text-sm text-red-400">{errores.nombre}</p>}
                  </div>

                  <div>
                    <p className="mb-2 block font-poppins text-xs uppercase tracking-wider text-white/60">
                      Tipo de Identificación *
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTipoIdentificacion(TIPOS_IDENTIFICACION.CODIGO_MATRICULA);
                          setErrores((prev) => ({ ...prev, dni: undefined, codigoMatricula: undefined }));
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
                          setTipoIdentificacion(TIPOS_IDENTIFICACION.DNI);
                          setErrores((prev) => ({ ...prev, dni: undefined, codigoMatricula: undefined }));
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
                      De qué área eres sobrin@ *
                    </label>
                    <select
                      id="carrera"
                      className={`${inputClass} cursor-pointer`}
                      value={values.carrera}
                      onChange={handleChange('carrera')}
                      disabled={enviando}
                    >
                      <option value="" disabled>Selecciona tu área…</option>
                      {CARRERAS_OPCIONES.map((opcion) => (
                        <option key={opcion} value={opcion} className="text-slate-900">
                          {opcion}
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
                  disabled={enviando || !supabaseConfigurado() || votoInvalido}
                  className="font-bebas h-12 w-full rounded-xl text-xl tracking-wider text-white transition disabled:cursor-not-allowed disabled:opacity-50 font-bold"
                  style={{
                    background: 'var(--accent-green)',
                    boxShadow: '0 0 30px rgba(46, 189, 142, 0.5)',
                  }}
                >
                  {enviando ? 'Enviando…' : 'INSCRIBIRME AHORA'}
                </button>

                <p className="text-center font-poppins text-xs text-white/40">
                  Tus datos se usarán únicamente para la organización interna del movimiento estudiantil.
                </p>

                {/* 🔹 Botón "salir" con flecha ✨ */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full text-center text-white/60 hover:text-white transition font-poppins text-sm flex items-center justify-center gap-2 mt-2"
                >
                  <span>←</span> salir
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}