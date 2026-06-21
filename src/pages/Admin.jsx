import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerSupabase, validarAdminCredenciales } from '../lib/supabase'
import { exportarInscripciones, exportarComentarios } from '../lib/exporters'

export default function Admin() {
  const [autenticado, setAutenticado] = useState(false)
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [exportando, setExportando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      const resultado = await validarAdminCredenciales(usuario, contrasena)

      if (resultado.valido) {
        setAutenticado(true)
        setUsuario('')
        setContrasena('')
      } else {
        setError(resultado.error)
        setContrasena('')
      }
    } catch (err) {
      setError('Error al validar credenciales')
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  const handleExportarInscripciones = async (e) => {
    e.preventDefault()
    setMensaje('')
    setExportando(true)

    try {
      const supabase = obtenerSupabase()
      const resultado = await exportarInscripciones(supabase, fechaInicio, fechaFin)
      setMensaje(resultado.message)
    } catch (err) {
      setMensaje('Error al exportar inscripciones')
      console.error(err)
    } finally {
      setExportando(false)
    }
  }

  const handleExportarComentarios = async (e) => {
    e.preventDefault()
    setMensaje('')
    setExportando(true)

    try {
      const supabase = obtenerSupabase()
      const resultado = await exportarComentarios(supabase)
      setMensaje(resultado.message)
    } catch (err) {
      setMensaje('Error al exportar comentarios')
      console.error(err)
    } finally {
      setExportando(false)
    }
  }

  if (!autenticado) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0e2c4c 0%, #143a61 100%)' }}>
        <div className="w-full max-w-md">
          <div
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <h1 className="font-bebas text-4xl text-center text-white mb-2 tracking-wide">ADMIN</h1>
            <p className="text-center text-white/60 font-poppins text-sm mb-6">Panel de administración</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-poppins text-sm text-white/70 mb-2">Usuario</label>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  disabled={cargando}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-poppins text-sm text-white placeholder:text-white/30 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-poppins text-sm text-white/70 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  disabled={cargando}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-poppins text-sm text-white placeholder:text-white/30 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 disabled:opacity-60"
                />
              </div>

              {error && <p className="text-sm text-red-400 text-center">{error}</p>}

              <button
                type="submit"
                disabled={cargando || !usuario || !contrasena}
                className="w-full h-10 rounded-xl font-bebas text-base tracking-wider text-slate-900 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'hsl(48 100% 50%)',
                  boxShadow: '0 0 20px hsl(48 100% 50% / 0.3)',
                }}
              >
                {cargando ? 'Validando...' : 'ENTRAR'}
              </button>
            </form>

            <Link
              to="/"
              className="block text-center mt-4 text-white/50 hover:text-white/80 transition font-poppins text-xs"
            >
              ← Volver
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4" style={{ background: 'linear-gradient(135deg, #0e2c4c 0%, #143a61 100%)' }}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-bebas text-4xl text-white tracking-wide">PANEL ADMIN</h1>
          <Link
            to="/"
            className="text-white/50 hover:text-white/80 transition font-poppins text-sm"
          >
            ← Salir
          </Link>
        </div>

        <div className="space-y-6">
          {/* Exportar Inscripciones */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <h2 className="font-bebas text-2xl text-white mb-4 tracking-wider">EXPORTAR INSCRIPCIONES</h2>

            <form onSubmit={handleExportarInscripciones} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-poppins text-sm text-white/70 mb-2">Fecha Inicio</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-poppins text-sm text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                  />
                </div>
                <div>
                  <label className="block font-poppins text-sm text-white/70 mb-2">Fecha Fin</label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-poppins text-sm text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                  />
                </div>
              </div>

              <p className="text-white/60 font-poppins text-xs">
                Deja los campos vacíos para exportar todas las inscripciones sin filtro.
              </p>

              <button
                type="submit"
                disabled={exportando}
                className="w-full h-10 rounded-xl font-bebas text-base tracking-wider text-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'hsl(48 100% 50%)',
                  boxShadow: '0 0 20px hsl(48 100% 50% / 0.3)',
                }}
              >
                {exportando ? 'Exportando...' : 'EXPORTAR EXCEL'}
              </button>
            </form>
          </div>

          {/* Exportar Comentarios */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <h2 className="font-bebas text-2xl text-white mb-4 tracking-wider">EXPORTAR COMENTARIOS</h2>

            <form onSubmit={handleExportarComentarios}>
              <p className="text-white/60 font-poppins text-sm mb-4">
                Descargar todos los comentarios registrados en un archivo Excel.
              </p>

              <button
                type="submit"
                disabled={exportando}
                className="w-full h-10 rounded-xl font-bebas text-base tracking-wider text-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'hsl(48 100% 50%)',
                  boxShadow: '0 0 20px hsl(48 100% 50% / 0.3)',
                }}
              >
                {exportando ? 'Exportando...' : 'EXPORTAR EXCEL'}
              </button>
            </form>
          </div>

          {/* Mensaje de estado */}
          {mensaje && (
            <div className="rounded-xl border-2 border-yellow-400/60 bg-yellow-400/10 p-4 text-center">
              <p className="font-poppins text-sm text-yellow-400">{mensaje}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
