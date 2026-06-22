import Carousel from './Carousel';

export default function HeroSection({ onOpenRegister }) {
  return (
    <section className="hero">
      <div className="hero-shell">
        {/* Botones de acción */}
        <div className="hero-actions">
          <button onClick={onOpenRegister} className="btn-primary">
            Quiero inscribirme
          </button>
          <a href="#propuestas" className="btn-secondary">
            Ver nuestras propuestas
          </a>
        </div>

        {/* 🔹 CARRUSEL DESACTIVADO TEMPORALMENTE ✨ */}
        {/* <Carousel /> */}
      </div>

      <style>{`
        .hero {
          background-color: #3D1F7A;
          color: white;
          padding: 24px 0 40px;
          font-family: 'Montserrat', sans-serif;
        }

        .hero-shell {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
          width: 100%;
        }

        .btn-primary {
          background-color: #2EBD8E;
          color: white;
          border: none;
          border-radius: 999px;
          padding: 14px 32px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.15s;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .btn-primary:hover {
          background-color: #1A9A72;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: transparent;
          color: white;
          border: 2px solid #2EBD8E;
          border-radius: 999px;
          padding: 12px 28px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }

        .btn-secondary:hover {
          background: #2EBD8E;
          color: white;
        }

        @media (max-width: 640px) {
          .hero-actions {
            flex-direction: column;
            align-items: center;
          }
          .btn-primary,
          .btn-secondary {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}