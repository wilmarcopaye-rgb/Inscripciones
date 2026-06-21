// src/components/landing/Topbar.jsx
export default function Topbar({ onOpenRegister }) {
  return (
    <header className="topbar">
      <div className="topbar-shell">
        {/* Logo + nombre (más grande) */}
        <div className="topbar-brand">
          <img src="/Dr.Charles1.jpg" alt="Dr. Charles" className="brand-logo" />
          <span className="brand-text">El tío Charles más cerca de ti</span>
        </div>

        {/* Elementos de la derecha (más grandes) */}
        <div className="topbar-right">
          <a href="#propuestas" className="nav-link">Propuestas</a>

          <div className="yape-group">
            <img src="/yape.png" alt="Yape" className="yape-logo" />
            <span className="yape-text">para recibir grandes premios</span>
            <button onClick={onOpenRegister} className="btn-inscribete">
              Inscríbete
            </button>
            {/* GIF recortado y más pequeño */}
            <img src="/yapeo.gif" alt="Regalo" className="gift-icon" />
          </div>
        </div>
      </div>

      <style>{`
        .topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background-color: #3D1F7A;
          border-bottom: 3px solid #2EBD8E; /* borde más grueso */
          padding: 14px 0; /* más padding vertical */
          font-family: 'Montserrat', sans-serif;
        }

        .topbar-shell {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px 24px;
        }

        /* Logo + texto (más grandes) */
        .topbar-brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brand-logo {
          height: 52px; /* antes 40px */
          width: 52px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #2EBD8E; /* borde más grueso */
        }

        .brand-text {
          font-weight: 700;
          font-size: 20px; /* antes 16px */
          color: white;
          white-space: nowrap;
          letter-spacing: 0.03em;
        }

        /* Lado derecho */
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .nav-link {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-weight: 600;
          font-size: 16px; /* antes 14px */
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: #2EBD8E;
        }

        /* Grupo Yape (más grande) */
        .yape-group {
          display: flex;
          align-items: center;
          gap: 10px 16px;
          background: rgba(46, 189, 142, 0.12);
          padding: 8px 20px 8px 14px; /* más padding */
          border-radius: 999px;
          border: 1.5px solid rgba(46, 189, 142, 0.35);
          flex-wrap: wrap;
        }

        .yape-logo {
          height: 34px; /* antes 28px */
          width: auto;
        }

        .yape-text {
          font-weight: 500;
          font-size: 15px; /* antes 13px */
          color: rgba(255, 255, 255, 0.95);
          white-space: nowrap;
        }

        .btn-inscribete {
          background: #2EBD8E;
          color: white;
          border: none;
          border-radius: 999px;
          padding: 8px 24px; /* más grande */
          font-weight: 700;
          font-size: 15px; /* antes 13px */
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .btn-inscribete:hover {
          background: #1A9A72;
          transform: scale(1.05);
        }

        /* GIF recortado: más pequeño y centrado */
        .gift-icon {
          height: 34px; /* antes 28px */
          width: 34px;
          object-fit: cover; /* recorta el gif para que no se deforme */
          border-radius: 4px;
          display: block;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 820px) {
          .topbar-shell {
            flex-direction: column;
            align-items: center; /* centrado en móviles */
            gap: 10px;
          }

          .topbar-right {
            justify-content: center;
            flex-wrap: wrap;
            gap: 12px;
            width: 100%;
          }

          .yape-group {
            justify-content: center;
            padding: 6px 16px;
            width: 100%;
            max-width: 500px;
          }

          .brand-text {
            font-size: 18px;
            white-space: normal;
            text-align: center;
          }
        }

        @media (max-width: 500px) {
          .topbar {
            padding: 10px 0;
          }

          .brand-logo {
            height: 44px;
            width: 44px;
          }

          .brand-text {
            font-size: 16px;
          }

          .yape-group {
            gap: 6px 10px;
            padding: 6px 12px;
            max-width: 100%;
          }

          .yape-logo {
            height: 28px;
          }

          .yape-text {
            font-size: 13px;
          }

          .btn-inscribete {
            font-size: 13px;
            padding: 6px 16px;
          }

          .gift-icon {
            height: 28px;
            width: 28px;
          }

          .nav-link {
            font-size: 14px;
          }
        }
      `}</style>
    </header>
  );
}