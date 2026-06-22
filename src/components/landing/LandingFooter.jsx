import { Link } from 'react-router-dom';

export default function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
          <path d="M0,0 C300,60 600,0 900,40 C1050,60 1150,30 1200,20 L1200,60 L0,60 Z" fill="#FFFFFF" />
        </svg>
      </div>
      <div className="landing-shell">
        <h3 className="mb-1.5 font-[var(--serif)] text-2xl font-semibold">
          Todos juntos por la <span className="text-[var(--sky)]">UNA</span>
        </h3>
        <p className="mb-5 text-sm text-[var(--on-navy-2)]">
          Movimiento estudiantil · Elecciones a Rectorado 2026
        </p>
        <p className="border-t border-white/15 pt-4 text-xs leading-relaxed text-[var(--on-navy-2)]">
          Universidad Nacional del Altiplano de Puno · Puno, Perú.
          <br />
          Iniciativa estudiantil. Esta página es de carácter informativo y de registro de
          simpatizantes del movimiento
          {/* 🔹 PUNTO FINAL - OCULTO PERO CLICKEABLE PARA ADMIN ✨ */}
          <Link
            to="/admin"
            className="text-[var(--on-navy-2)] hover:text-white/70 transition no-underline"
            aria-label="Acceso administrador (oculto)"
          >
            .
          </Link>
        </p>
      </div>

      <style>{`
        .landing-footer {
          background-color: var(--accent-green) !important;
        }
        .landing-footer .text-\\[var\\(--sky\\)\\] {
          color: var(--primary-bg) !important;
        }
        .landing-footer .border-white\\/15 {
          border-color: rgba(255,255,255,0.2) !important;
        }
        .footer-wave svg {
          display: block;
          width: 100%;
          height: 50px;
        }
        .landing-footer .text-\\[var\\(--on-navy-2\\)\\] {
          color: rgba(255,255,255,0.9) !important;
        }
      `}</style>
    </footer>
  );
}