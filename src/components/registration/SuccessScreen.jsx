import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WHATSAPP_URL } from '../../lib/content';
import { obtenerSupabase } from '../../lib/supabase';

export default function SuccessScreen({ nombre, inscripcionId, onClose }) {
  const [comentario, setComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [errorComentario, setErrorComentario] = useState('');
  const [comentarioEnviado, setComentarioEnviado] = useState(false);
  const [idTemp, setIdTemp] = useState(null);
  const [nombreTemp, setNombreTemp] = useState(nombre);

  useEffect(() => {
    const datosTemporales = localStorage.getItem('inscripcionTemporal');
    if (datosTemporales) {
      try {
        const { nombre: n, inscripcionId: id } = JSON.parse(datosTemporales);
        setNombreTemp(n);
        setIdTemp(id);
      } catch (err) {
        console.error('Error al parsear datos temporales:', err);
      }
    } else {
      if (inscripcionId) {
        setIdTemp(inscripcionId);
      }
    }
  }, [inscripcionId]);

  const handleGuardarComentario = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) {
      setErrorComentario('Por favor escribe un comentario');
      return;
    }
    if (!idTemp) {
      setErrorComentario('Error: ID de inscripción no disponible. Recarga la página.');
      return;
    }
    setEnviandoComentario(true);
    setErrorComentario('');
    try {
      const supabase = obtenerSupabase();
      const payload = {
        inscripcion_id: idTemp,
        nombre_inscrito: nombreTemp,
        comentario: comentario.trim(),
      };
      const { error } = await supabase.from('comentarios').insert([payload]);
      if (error) {
        console.error('Error al guardar comentario:', error);
        setErrorComentario('No pudimos guardar tu comentario. Intenta nuevamente.');
        return;
      }
      setComentarioEnviado(true);
      setComentario('');
      localStorage.removeItem('inscripcionTemporal');
    } catch (err) {
      console.error('Error catch:', err);
      setErrorComentario('Error al guardar el comentario');
    } finally {
      setEnviandoComentario(false);
    }
  };

  return (
    <div className="text-center space-y-5 py-2" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Icono Principal (Check verde animado) */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 animate-pulse shadow-lg shadow-green-500/20">
        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      {/* Título de Inscripción Exitosa */}
      <div className="space-y-1">
        <h2 className="font-bebas text-3xl leading-tight text-white tracking-wide uppercase">
          ¡Inscripción Completada, Sobrin@!
        </h2>
        <p className="font-poppins text-xs text-white/80">
          Gracias <strong className="text-yellow-400">{nombreTemp}</strong>, tu decisión hace la diferencia.
        </p>
      </div>

      {/* Seccion Llamativa: Tu tío Charles te necesita */}
      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 space-y-4 shadow-lg shadow-yellow-500/5">
        <div className="space-y-1.5">
          <h3 className="font-bebas text-2xl leading-none text-yellow-400 tracking-wider uppercase">
            📢 ¡El tío Charles mas cerca de ti!
          </h3>
          <p className="font-poppins text-xs text-white/90">
            Únete al grupo de WhatsApp oficial para participar en el sorteo de grandes premios 🎁
          </p>
        </div>

        {/* Lista de premios */}
        <div className="rounded-lg bg-white/5 p-3 text-left">
          <p className="font-bebas text-[11px] text-green-400 tracking-wider mb-1">🎁 PREMIOS EN SORTEO:</p>
          <ul className="font-poppins text-[10px] text-white/70 list-disc list-inside space-y-0.5">
            <li>Sorteos de Yapeos diarios (dinero en efectivo al instante para tus gustos o pasajes) 💸</li>
            <li>Entradas al cine totalmente gratis para ti (estrenos 2D/3D) 🎬</li>
            <li>¡Y muchísimos más premios sorpresas que te ayudarán en la semana! 🎁</li>
          </ul>
        </div>

        {/* Botón de Whatsapp Gigante y Animado */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl px-5 py-3.5 font-poppins text-sm font-bold text-white no-underline transition hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            boxShadow: '0 0 25px rgba(37,211,102,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white animate-bounce">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          UNIRME AL GRUPO AHORA
        </a>
      </div>

      {/* Sección de Comentarios */}
      <div className="border-t border-white/10 pt-4">
        {!comentarioEnviado ? (
          <form onSubmit={handleGuardarComentario} className="space-y-3 text-left">
            <label htmlFor="comentario" className="block font-bebas text-xs text-green-400 tracking-wider">
              💬 TU OPINIÓN IMPORTA, DEJA TU COMENTARIO:
            </label>
            <textarea
              id="comentario"
              name="comentario"
              value={comentario}
              onChange={(e) => {
                setComentario(e.target.value);
                setErrorComentario('');
              }}
              placeholder="¿Qué piensas? Comparte tu comentario..."
              disabled={enviandoComentario}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-poppins text-xs text-white placeholder:text-white/30 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 disabled:opacity-60 resize-none h-20"
            />
            {errorComentario && <p className="text-[11px] text-red-400">{errorComentario}</p>}
            <button
              type="submit"
              disabled={enviandoComentario || !comentario.trim()}
              className="font-bebas h-10 w-full rounded-xl text-sm tracking-wider text-slate-900 transition disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: 'hsl(48 100% 50%)',
                boxShadow: '0 0 15px hsl(48 100% 50% / 0.3)',
              }}
            >
              {enviandoComentario ? 'Guardando…' : 'ENVIAR COMENTARIO'}
            </button>
          </form>
        ) : (
          <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-3 text-center">
            <p className="font-bebas text-sm text-green-400">¡Comentario guardado con éxito! 💚</p>
          </div>
        )}
      </div>

      {/* Botón de salir */}
      <div className="pt-2">
        {onClose ? (
          <button
            onClick={onClose}
            className="w-full font-poppins text-xs text-white/50 hover:text-white/80 transition py-1"
          >
            ← Salir / Cerrar
          </button>
        ) : (
          <Link
            to="/"
            className="block text-center w-full font-poppins text-xs text-white/50 hover:text-white/80 transition py-1 no-underline"
          >
            ← Volver al inicio
          </Link>
        )}
      </div>
    </div>
  );
}