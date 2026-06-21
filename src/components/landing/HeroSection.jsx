// src/components/landing/HeroSection.jsx
import Carousel from './Carousel';

export default function HeroSection({ onOpenRegister }) {
  return (
    <section className="hero">
      <div className="hero-shell">
        {/* Imagen principal (título/logo) */}
        <div className="hero-image-container">
          <img
            src="/VamosTodos.png"
            alt="Todos juntos por la UNA - El tío Charles más cerca de ti"
            className="hero-image"
          />
        </div>

        {/* Botones de acción */}
        <div className="hero-actions">
          <button onClick={onOpenRegister} className="btn-primary">
            Quiero inscribirme
          </button>
          <a href="#propuestas" className="btn-secondary">
            Ver nuestras propuestas
          </a>
        </div>

        {/* Carrusel (tu cuadro que rota imágenes) */}
        <Carousel />
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
          gap: 24px;
        }

        /* Imagen principal */
        .hero-image-container {
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
          border: 2px solid rgba(46, 189, 142, 0.3);
          background: rgba(255, 255, 255, 0.05);
        }

        .hero-image {
          width: 100%;
          height: auto;
          display: block;
        }

        /* Botones */
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
          width: 100%;
          margin-top: 4px;
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

        /* Carrusel: ocupa todo el ancho, sin margen superior extra */
        .hero-shell .relative.mt-10 {
          margin-top: 0 !important;
          width: 100%;
          max-width: 800px;
        }

        @media (max-width: 640px) {
          .hero-actions {
            flex-direction: column;
            align-items: center;
          }
          .btn-primary,
          .btn-secondary {
            width: 100%;
            max-width: 280px;
            justify-content: center;
          }
          .hero-image-container {
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
}