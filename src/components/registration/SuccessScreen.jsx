import { useState, useEffect } from 'react';
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
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Error catch:', err);
      setErrorComentario('Error al guardar el comentario');
    } finally {
      setEnviandoComentario(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Éxito */}
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-purple-500/60 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <svg className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-bebas text-3xl tracking-wide bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Tu decisión hace la diferencia sobrin@
        </h2>
        <p className="mt-4 font-poppins text-sm leading-relaxed text-white/80">
          Gracias sobrin@ <strong className="text-purple-400">{nombreTemp}</strong>, el 2 de julio todos somos juntos.
        </p>
      </div>

      {/* Comentarios */}
      {!comentarioEnviado ? (
        <div className="border-t border-white/10 pt-6">
          <p className="mb-4 font-bebas text-sm tracking-wider bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            TU OPINIÓN IMPORTA, EL TÍO CHARLES TOMA NOTA
          </p>
          <form onSubmit={handleGuardarComentario} className="space-y-3">
            <textarea
              id="comentario"
              name="comentario"
              value={comentario}
              onChange={(e) => {
                setComentario(e.target.value);
                setErrorComentario('');
              }}
              placeholder="¿Qué piensas? Comparte tu comentario con el movimiento..."
              disabled={enviandoComentario}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-poppins text-sm text-white placeholder:text-white/30 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 disabled:opacity-60 resize-none h-24"
            />
            {errorComentario && <p className="text-sm text-red-400">{errorComentario}</p>}
            <button
              type="submit"
              disabled={enviandoComentario || !comentario.trim()}
              className="font-bebas h-10 w-full rounded-xl text-base tracking-wider text-slate-900 transition disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: 'hsl(48 100% 50%)',
                boxShadow: '0 0 20px hsl(48 100% 50% / 0.3)',
              }}
            >
              {enviandoComentario ? 'Guardando…' : 'ENVIAR COMENTARIO'}
            </button>
          </form>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-yellow-400/60 bg-yellow-400/10 p-4 text-center">
          <p className="font-bebas text-lg text-yellow-400">¡Comentario guardado!</p>
          <p className="mt-1 font-poppins text-xs text-white/70">Cerrando en unos instantes...</p>
        </div>
      )}

      {/* 🔹 WHATSAPP - TEXTO MÁS GRANDE Y LLAMATIVO ✨ */}
      <div className="border-t border-white/10 pt-6">
        <p className="mb-4 text-center font-bebas text-3xl text-green-400 tracking-wide drop-shadow-lg">
          📱 SOBRIN@, ÚNETE AL GRUPO DE WHATSAPP
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-poppins text-lg font-bold text-white no-underline transition hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #25D366, #128C7E)',
            boxShadow: '0 0 30px rgba(37,211,102,0.5)',
          }}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Ir al grupo de WhatsApp
        </a>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem('inscripcionTemporal');
          onClose();
        }}
        className="w-full font-poppins text-sm text-white/50 hover:text-white/80 transition py-2"
      >
        ← Cerrar
      </button>
    </div>
  );
}