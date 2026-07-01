// src/components/landing/VotacionFloat.jsx
import { useState, useRef, useEffect } from 'react';
import { consultarLocalVotacion } from '../../lib/supabase';

/* ══════════════════════════════════════════════════════════
   MAPA DE LOCALES DE VOTACIÓN
   Clave = valor exacto guardado en local_votacion de la BD
   ══════════════════════════════════════════════════════════ */
const LOCALES_INFO = {
  'CEPREUNA': {
    area:      'Área de Biomédicas',
    edificio:  'Edificio CEPREUNA',
    direccion: 'Jr. Ácora N° 235, Puno',
    horario:   'De 8:00 a.m. a 3:00 p.m.',
    mapQuery:  'Edificio CEPREUNA Jr Acora 235 Puno Peru',
    mapsUrl:   'https://maps.app.goo.gl/XjZMnWCZ422feP967',
  },
  'EDUCACION CONTINUA': {
    area:      'Área de Ingeniería',
    edificio:  'Edificio de Educación Continua',
    direccion: 'Av. El Sol 300, Puno',
    horario:   'De 8:00 a.m. a 3:00 p.m.',
    mapQuery:  'Av. El Sol 300 Puno Peru',
    mapsUrl:   'https://maps.app.goo.gl/xUbhbg7spwjudqor8',
  },
  'CIENCIAS AGRARIAS': {
    area:      'Facultad de Ciencias Agrarias',
    edificio:  'Ex Edificio Administrativo',
    direccion: 'Av. Ejército N° 355, Puno',
    horario:   'De 8:00 a.m. a 3:00 p.m.',
    mapQuery:  'Av. Ejercito 355 Puno Peru',
    mapsUrl:   'https://maps.app.goo.gl/1j1HNASEHkNRAr8R9',
  },
  'JURIDICAS': {
    area:      'Área de Sociales',
    edificio:  'Facultad de Ciencias Jurídicas y Políticas',
    direccion: 'Pasaje Grau con Jr. Conde de Lemos, Puno',
    horario:   'De 8:00 a.m. a 3:00 p.m.',
    mapQuery:  'Facultad Ciencias Juridicas Puno Peru Pasaje Grau',
    mapsUrl:   'https://maps.app.goo.gl/fjJqA8BbmooLX2h46',
  },
  'ING ECONOMICA': {
    area:      'Estudiantes de Posgrado',
    edificio:  'Facultad de Ingeniería Económica',
    direccion: 'Jr. Tarapacá N° 123, Puno',
    horario:   'De 8:00 a.m. a 3:00 p.m.',
    mapQuery:  'Facultad Ingenieria Economica Jr Tarapaca 123 Puno Peru',
    mapsUrl:   'https://maps.app.goo.gl/dKMxo8SQPJ21LqxXA',
  },
};

/* Devuelve la info enriquecida del local, o un fallback con el texto de la BD */
function getLocalInfo(localVotacion) {
  if (!localVotacion) return null;
  const key = localVotacion.trim().toUpperCase();

  // 1. Mapeo explícito de variantes de la BD para Puno
  if (
    key.includes('DERECHO') || 
    key.includes('JURIDICAS') || 
    key.includes('JURÍDICAS') ||
    key.includes('GRAU')
  ) {
    return LOCALES_INFO['JURIDICAS']; // Derecho / Sociales -> Pasaje Grau
  }
  if (
    key.includes('AGRARIAS') || 
    key.includes('EJERCITO') || 
    key.includes('EJÉRCITO')
  ) {
    return LOCALES_INFO['CIENCIAS AGRARIAS']; // Ciencias Agrarias -> Av. Ejército
  }
  if (key.includes('CEPRE')) {
    return LOCALES_INFO['CEPREUNA'];
  }
  if (key.includes('CONTINUA') || key.includes('SOL')) {
    return LOCALES_INFO['EDUCACION CONTINUA'];
  }
  if (key.includes('ECONOMICA') || key.includes('ECONÓMICA') || key.includes('POSGRADO')) {
    return LOCALES_INFO['ING ECONOMICA'];
  }

  // 2. Búsqueda exacta estándar
  if (LOCALES_INFO[key]) return LOCALES_INFO[key];

  // 3. Búsqueda parcial estándar
  const match = Object.keys(LOCALES_INFO).find(k => key.includes(k) || k.includes(key));
  if (match) return LOCALES_INFO[match];

  // Fallback si no coincide con ninguna regla anterior (usando Puno, Perú)
  return {
    area:      null,
    edificio:  localVotacion,
    direccion: null,
    horario:   'De 8:00 a.m. a 3:00 p.m.',
    mapQuery:  `${localVotacion} Puno Peru`,
    mapsUrl:   null,
  };
}


/* ── Ícono urna de votación ── */
function IconUrna({ size = 32, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="10" y="20" width="28" height="22" rx="4" fill={color} fillOpacity="0.95"/>
      <path d="M14 20V16C14 11.58 18.47 8 24 8C29.53 8 34 11.58 34 16V20" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <rect x="19" y="26" width="10" height="3" rx="1.5" fill="#3D1F7A"/>
      <path d="M22 12L24 10L26 12" stroke="#3D1F7A" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="24" cy="14" r="1.5" fill="#3D1F7A"/>
      <rect x="21" y="17" width="6" height="1.5" rx="0.75" fill="#2EBD8E"/>
    </svg>
  );
}

export default function VotacionFloat({ isOpen, onClose }) {
  const [openInternal, setOpenInternal] = useState(false);
  const [codigo, setCodigo]           = useState('');
  const [loading, setLoading]         = useState(false);
  const [resultado, setResultado]     = useState(null);
  const [error, setError]             = useState(null);
  const [mapBloqueado, setMapBloqueado] = useState(false);
  const inputRef = useRef(null);

  const open = isOpen !== undefined ? isOpen : openInternal;
  const setOpen = isOpen !== undefined ? (val) => { if (!val && onClose) onClose(); } : setOpenInternal;

  /* Foco automático al abrir */
  useEffect(() => {
    if (open && !resultado) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open, resultado]);

  /* Cerrar con Escape */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const handleConsultar = async () => {
    const cod = codigo.trim();
    if (!cod) {
      setError('Ingresa tu código de matrícula.');
      return;
    }
    if (cod.length < 6) {
      setError('El código debe tener 6 dígitos.');
      return;
    }
    setLoading(true);
    setError(null);
    setResultado(null);

    const { data, error: err } = await consultarLocalVotacion(cod);
    setLoading(false);

    if (err) {
      setError('Error al conectar con el servidor. Intenta nuevamente.');
      return;
    }
    if (!data || data.length === 0) {
      setError(
        'No se encontró tu local de votación.\nVerifica tu código o consulta con el responsable.'
      );
      return;
    }
    setResultado(data[0]);
  };

  const handleClose = () => {
    setOpen(false);
    setCodigo('');
    setResultado(null);
    setError(null);
    setMapBloqueado(false);
    if (onClose) onClose();
  };

  /* Info enriquecida del local según el valor de la BD */
  const localInfo = resultado ? getLocalInfo(resultado.local_votacion) : null;

  const mapUrl = localInfo
    ? `https://maps.google.com/maps?q=${encodeURIComponent(localInfo.mapQuery)}&output=embed&hl=es`
    : null;

  // Usa el link directo de Google Maps si está disponible; si no, construye uno por dirección
  const mapsLink = localInfo
    ? (localInfo.mapsUrl ?? `https://www.google.com/maps/search/?q=${encodeURIComponent(localInfo.mapQuery)}`)
    : null;

  return (
    <>
      {/* ══════════════ BOTÓN FLOTANTE ══════════════ */}
      <button
        id="btn-consultar-votacion"
        className="vot-float"
        onClick={() => setOpen(true)}
        aria-label="Consultar local de votación"
        title="¿Dónde voto?"
      >
        <IconUrna size={36} color="#fff" />
        <span className="vot-tooltip">¿Dónde voto?</span>
        <span className="vot-pulse" aria-hidden="true" />
      </button>

      {/* ══════════════ OVERLAY + MODAL ══════════════ */}
      {open && (
        <div
          className="vot-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Consulta tu local de votación"
          onClick={handleClose}
        >
          <div className="vot-modal" onClick={(e) => e.stopPropagation()}>

            {/* ── Cabecera ── */}
            <div className="vot-header">
              <div className="vot-header-brand">
                <div className="vot-header-icon-wrap">
                  <IconUrna size={28} color="#2EBD8E" />
                </div>
                <div>
                  <p className="vot-header-subtitle">SISTEMA DE CONSULTA ELECTORAL</p>
                  <h2 className="vot-header-title">Consulta tu Local de Votación</h2>
                </div>
              </div>
              <button className="vot-close" onClick={handleClose} aria-label="Cerrar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="vot-divider" />

            {/* ── Cuerpo ── */}
            <div className="vot-body">

              {/* ─── PASO 1: Ingreso de código ─── */}
              {!resultado && (
                <>
                  <p className="vot-instruccion">
                    Ingresa tu <strong>código de matrícula</strong> para conocer tu local de votación y número de mesa asignados.
                  </p>

                  <div className="vot-field-group">
                    <label htmlFor="vot-codigo-input" className="vot-label">
                      Código de matrícula
                    </label>
                    <input
                      id="vot-codigo-input"
                      ref={inputRef}
                      className={`vot-input ${error ? 'vot-input--error' : ''}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={codigo}
                      onChange={(e) => {
                        // Solo permite dígitos numéricos
                        const solo = e.target.value.replace(/\D/g, '');
                        setCodigo(solo);
                        setError(null);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleConsultar()}
                      placeholder="Ej: 214996"
                      maxLength={6}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>

                  {error && (
                    <div className="vot-error-msg" role="alert">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1" fill="currentColor"/>
                      </svg>
                      {error}
                    </div>
                  )}

                  <button
                    id="btn-consultar-submit"
                    className="vot-btn-consultar"
                    onClick={handleConsultar}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="vot-spinner" aria-hidden="true" />
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                    )}
                    {loading ? 'Consultando...' : 'Consultar'}
                  </button>

                  <p className="vot-aviso">🔒 Solo accede a tu propia información.</p>
                </>
              )}

              {/* ─── PASO 2: Resultado ─── */}
              {resultado && (
                <div className="vot-resultado">

                  {/* Badge éxito */}
                  <div className="vot-badge-ok">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2EBD8E" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Local de votación encontrado
                  </div>

                  {/* ── Datos del alumno (si están disponibles) ── */}
                  {resultado.alumno_nombre && (
                    <div className="vot-card vot-card--alumno">
                      <div className="vot-card-header">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                        Tus datos
                      </div>
                      <div className="vot-card-body">
                        <div className="vot-data-row">
                          <span className="vot-data-lbl">Nombre</span>
                          <span className="vot-data-val">{resultado.alumno_nombre}</span>
                        </div>
                        <div className="vot-data-row">
                          <span className="vot-data-lbl">DNI</span>
                          <span className="vot-data-val">{resultado.alumno_dni}</span>
                        </div>
                        <div className="vot-data-row">
                          <span className="vot-data-lbl">Programa</span>
                          <span className="vot-data-val">{resultado.alumno_carrera}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Mesa y Posición (protagonistas) ── */}
                  <div className="vot-mesa-posicion-grid">
                    <div className="vot-mesa-card">
                      <span className="vot-mesa-lbl">Mesa</span>
                      <span className="vot-mesa-num">{resultado.mesa}</span>
                    </div>
                    <div className="vot-posicion-card">
                      <span className="vot-mesa-lbl">Posición</span>
                      <span className="vot-posicion-num">{resultado.posicion}</span>
                    </div>
                  </div>

                  {/* ── Local de votación (enriquecido) ── */}
                  {localInfo && (
                    <div className="vot-card vot-card--local">
                      <div className="vot-card-header">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        Local de votación
                      </div>

                      {/* Badge área */}
                      {localInfo.area && (
                        <div className="vot-local-area-badge">{localInfo.area}</div>
                      )}

                      <div className="vot-card-body">
                        <div className="vot-data-row">
                          <span className="vot-data-lbl">Edificio</span>
                          <span className="vot-data-val vot-data-val--highlight">{localInfo.edificio}</span>
                        </div>
                        {localInfo.direccion && (
                          <div className="vot-data-row">
                            <span className="vot-data-lbl">Dirección</span>
                            <span className="vot-data-val">{localInfo.direccion}</span>
                          </div>
                        )}
                        <div className="vot-data-row">
                          <span className="vot-data-lbl">Horario</span>
                          <span className="vot-data-val vot-data-val--green">
                            🕗 {localInfo.horario}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Mapa Google Maps con fallback si está bloqueado ── */}
                  {mapsLink && (
                    <div className="vot-map-wrap">
                      <div className="vot-map-lbl">
                        <span>🗺️ Cómo llegar</span>
                        <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="vot-map-link">
                          Abrir en Google Maps →
                        </a>
                      </div>

                      {/* Iframe del mapa — si el navegador lo bloquea muestra fallback */}
                      {!mapBloqueado ? (
                        <div className="vot-map-frame-wrap">
                          <iframe
                            title={`Mapa de ${localInfo?.edificio ?? resultado.local_votacion}`}
                            src={mapUrl}
                            className="vot-map-frame"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            onError={() => setMapBloqueado(true)}
                          />
                          {/* Overlay invisible que detecta si el iframe no cargó */}
                          <div
                            className="vot-map-check"
                            onLoad={(e) => {
                              // Si el iframe tiene 0 alto, está bloqueado
                              const iframe = e.target.previousSibling;
                              if (iframe && iframe.clientHeight === 0) setMapBloqueado(true);
                            }}
                          />
                        </div>
                      ) : (
                        /* Fallback cuando el mapa está bloqueado por el navegador */
                        <div className="vot-map-fallback">
                          <span className="vot-map-fallback-icon">📍</span>
                          <p className="vot-map-fallback-txt">
                            {localInfo?.direccion ?? resultado.local_votacion}
                          </p>
                          <a
                            href={mapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="vot-map-fallback-btn"
                          >
                            Ver en Google Maps
                          </a>
                          <p className="vot-map-fallback-hint">
                            El mapa fue bloqueado por tu navegador o extensión.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Botón volver ── */}
                  <button
                    className="vot-btn-volver"
                    onClick={() => { setResultado(null); setCodigo(''); setError(null); }}
                  >
                    ← Consultar otro código
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ ESTILOS ══════════════ */}
      <style>{`
        /* ── Botón flotante ── */
        .vot-float {
          position: fixed;
          top: 90px;
          right: 28px;
          z-index: 9998;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #3D1F7A 0%, #5B2D9E 100%);
          box-shadow: 0 6px 24px rgba(61,31,122,0.55), 0 2px 8px rgba(0,0,0,0.25);
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
        }
        .vot-float:hover {
          transform: scale(1.12);
          box-shadow: 0 10px 32px rgba(61,31,122,0.72), 0 4px 12px rgba(0,0,0,0.3);
        }
        .vot-float:hover .vot-tooltip {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
        }

        /* Tooltip */
        .vot-tooltip {
          position: absolute;
          right: 80px;
          background: #3D1F7A;
          color: #fff;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          padding: 6px 12px;
          border-radius: 8px;
          pointer-events: none;
          opacity: 0;
          transform: translateX(8px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 1px solid rgba(46,189,142,0.4);
        }
        .vot-tooltip::after {
          content: '';
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 6px 0 6px 6px;
          border-style: solid;
          border-color: transparent transparent transparent #3D1F7A;
        }

        /* Pulso */
        .vot-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(46,189,142,0.35);
          animation: vot-ping 2.2s cubic-bezier(0,0,0.2,1) infinite;
          z-index: 1;
        }
        @keyframes vot-ping {
          0%   { transform: scale(1);    opacity: 0.7; }
          70%  { transform: scale(1.65); opacity: 0; }
          100% { transform: scale(1.65); opacity: 0; }
        }

        /* ── Overlay ── */
        .vot-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(10,4,28,0.75);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: vot-fade-in 0.2s ease;
        }
        @keyframes vot-fade-in { from { opacity: 0; } to { opacity: 1; } }

        /* ── Modal ── */
        .vot-modal {
          background: #1a0b3b;
          border: 1px solid rgba(46,189,142,0.25);
          border-radius: 20px;
          width: 100%;
          max-width: 500px;
          max-height: 92vh;
          overflow-y: auto;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(46,189,142,0.1);
          animation: vot-slide-up 0.28s cubic-bezier(0.34,1.3,0.64,1);
          font-family: 'Montserrat', sans-serif;
          scrollbar-width: thin;
          scrollbar-color: rgba(46,189,142,0.3) transparent;
        }
        .vot-modal::-webkit-scrollbar { width: 5px; }
        .vot-modal::-webkit-scrollbar-track { background: transparent; }
        .vot-modal::-webkit-scrollbar-thumb { background: rgba(46,189,142,0.3); border-radius: 99px; }

        @keyframes vot-slide-up {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Cabecera ── */
        .vot-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 24px 0;
          gap: 12px;
        }
        .vot-header-brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .vot-header-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(46,189,142,0.12);
          border: 1.5px solid rgba(46,189,142,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .vot-header-subtitle {
          margin: 0;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #2EBD8E;
          text-transform: uppercase;
        }
        .vot-header-title {
          margin: 4px 0 0;
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
        }
        .vot-close {
          background: rgba(255,255,255,0.07);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s, color 0.2s;
        }
        .vot-close:hover { background: rgba(255,255,255,0.15); color: #fff; }

        /* Divisor */
        .vot-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(46,189,142,0.4), transparent);
          margin: 18px 0 0;
        }

        /* Body */
        .vot-body { padding: 20px 24px 28px; }

        /* Instrucción */
        .vot-instruccion {
          margin: 0 0 20px;
          font-size: 14px;
          color: rgba(255,255,255,0.75);
          line-height: 1.55;
        }
        .vot-instruccion strong { color: #fff; }

        /* Campo */
        .vot-field-group { margin-bottom: 14px; }
        .vot-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-bottom: 8px;
        }
        .vot-input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          font-family: 'Montserrat', monospace;
          letter-spacing: 0.15em;
          text-align: center;
          text-transform: uppercase;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
          outline: none;
        }
        .vot-input::placeholder { color: rgba(255,255,255,0.25); font-weight: 400; letter-spacing: 0.05em; font-size: 16px; }
        .vot-input:focus { border-color: #2EBD8E; background: rgba(46,189,142,0.06); }
        .vot-input--error { border-color: #ff6b6b !important; }

        /* Error */
        .vot-error-msg {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: rgba(255,107,107,0.12);
          border: 1px solid rgba(255,107,107,0.3);
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          color: #ff9a9a;
          margin-bottom: 14px;
          white-space: pre-line;
          line-height: 1.5;
        }
        .vot-error-msg svg { flex-shrink: 0; margin-top: 1px; }

        /* Botón consultar */
        .vot-btn-consultar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, #2EBD8E, #1A9A72);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 15px 24px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 6px 20px rgba(46,189,142,0.35);
          margin-bottom: 14px;
        }
        .vot-btn-consultar:hover:not(:disabled) {
          background: linear-gradient(135deg, #1A9A72, #12785a);
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(46,189,142,0.5);
        }
        .vot-btn-consultar:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Spinner */
        .vot-spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: vot-spin 0.7s linear infinite;
        }
        @keyframes vot-spin { to { transform: rotate(360deg); } }

        /* Aviso */
        .vot-aviso {
          margin: 0;
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          text-align: center;
        }

        /* ════════════════ RESULTADO ════════════════ */
        .vot-resultado { display: flex; flex-direction: column; gap: 14px; }

        /* Badge éxito */
        .vot-badge-ok {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(46,189,142,0.12);
          border: 1px solid rgba(46,189,142,0.35);
          border-radius: 999px;
          padding: 7px 16px;
          font-size: 13px;
          font-weight: 700;
          color: #2EBD8E;
          align-self: flex-start;
        }

        /* Cards genéricas */
        .vot-card {
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .vot-card--alumno { background: rgba(255,255,255,0.04); }
        .vot-card--local  { background: rgba(61,31,122,0.4); border-color: rgba(46,189,142,0.2); }

        .vot-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(255,255,255,0.06);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .vot-card-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }

        /* Filas dato */
        .vot-data-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }
        .vot-data-lbl {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.4);
          flex-shrink: 0;
          padding-top: 1px;
        }
        .vot-data-val {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          text-align: right;
          line-height: 1.4;
        }

        /* ── Grid Mesa / Posición ── */
        .vot-mesa-posicion-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .vot-mesa-card,
        .vot-posicion-card {
          border-radius: 14px;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(46,189,142,0.3);
        }
        .vot-mesa-card     { background: rgba(46,189,142,0.1); }
        .vot-posicion-card { background: rgba(61,31,122,0.5); border-color: rgba(91,45,158,0.5); }
        .vot-mesa-lbl {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .vot-mesa-num {
          font-size: 48px;
          font-weight: 700;
          color: #2EBD8E;
          line-height: 1;
        }
        .vot-posicion-num {
          font-size: 48px;
          font-weight: 700;
          color: #a78bfa;
          line-height: 1;
        }


        /* Badge del área del local */
        .vot-local-area-badge {
          margin: 10px 16px 0;
          display: inline-block;
          background: rgba(46,189,142,0.15);
          border: 1px solid rgba(46,189,142,0.35);
          color: #2EBD8E;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 999px;
        }

        /* Valor destacado en cards */
        .vot-data-val--highlight {
          color: #fff;
          font-weight: 700;
          font-size: 15px;
        }
        .vot-data-val--green { color: #2EBD8E; }

        /* Mapa */
        .vot-map-wrap { border-radius: 14px; overflow: hidden; border: 1px solid rgba(46,189,142,0.2); }
        .vot-map-lbl {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          padding: 10px 16px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          background: rgba(46,189,142,0.07);
          border-bottom: 1px solid rgba(46,189,142,0.15);
        }
        .vot-map-link {
          font-size: 11px;
          font-weight: 700;
          color: #2EBD8E;
          text-decoration: none;
          letter-spacing: 0.05em;
          text-transform: none;
          transition: color 0.2s;
        }
        .vot-map-link:hover { color: #1A9A72; text-decoration: underline; }
        .vot-map-frame-wrap { position: relative; width: 100%; height: 260px; background: #0d0424; }
        .vot-map-frame {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
          filter: hue-rotate(240deg) saturate(0.7) brightness(0.9);
        }
        .vot-map-check { display: none; }

        /* Fallback cuando el mapa es bloqueado por el navegador */
        .vot-map-fallback {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 28px 20px;
          background: rgba(61,31,122,0.3);
          text-align: center;
        }
        .vot-map-fallback-icon { font-size: 32px; }
        .vot-map-fallback-txt {
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          margin: 0;
        }
        .vot-map-fallback-btn {
          display: inline-block;
          background: #2EBD8E;
          color: #0d0424;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 22px;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .vot-map-fallback-btn:hover { background: #1A9A72; }
        .vot-map-fallback-hint {
          color: rgba(255,255,255,0.35);
          font-size: 11px;
          margin: 0;
        }

        /* Botón volver */
        .vot-btn-volver {
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 12px 20px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Montserrat', sans-serif;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
          margin-top: 4px;
        }
        .vot-btn-volver:hover { border-color: #2EBD8E; color: #2EBD8E; }

        /* ── Responsive ── */
        @media (max-width: 500px) {
          .vot-float { top: 80px; right: 16px; width: 62px; height: 62px; }
          .vot-tooltip { display: none; }
          .vot-modal { border-radius: 16px; }
          .vot-header-title { font-size: 15px; }
          .vot-header { padding: 18px 18px 0; }
          .vot-body { padding: 18px 18px 24px; }
          .vot-mesa-num, .vot-posicion-num { font-size: 38px; }
          .vot-map-frame-wrap { height: 210px; }
        }
      `}</style>
    </>
  );
}
