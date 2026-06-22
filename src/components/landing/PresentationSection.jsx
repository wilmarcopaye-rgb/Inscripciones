// src/components/landing/PresentationSection.jsx
import { useState } from 'react';

export default function PresentationSection() {
  const propuestas_principales = [
    {
      numero: '01',
      titulo: 'EDUCACIÓN DE CALIDAD',
      descripcion:
        'Acreditación al 100% de los programas académicos, residencia universitaria, implementación de mobiliario ergonómico.',
    },
    {
      numero: '02',
      titulo: 'BIENESTAR Y SALUD',
      descripcion:
        'Impulsar programas de salud física (Gym), mental y emocional con espacios de acompañamiento estudiantil, comedor universitario con servicio de (desayuno, almuerzo y cena).',
    },
    {
      numero: '03',
      titulo: 'INCLUSIÓN Y RESPETO',
      descripcion:
        'Fomentar un smart campus inclusivo 24/7, seguro y libre de discriminación para todos.',
    },
    {
      numero: '04',
      titulo: 'DEPORTE Y CULTURA',
      descripcion:
        'Apoyar actividades culturales, artísticas y deportivas que fortalezcan la vida universitaria, con espacios adecuados.',
    },
  ];

  const propuestas_areas = [
    {
      area: 'INGENIERÍAS',
      propuestas: [
        'Equipamiento de laboratorios modernos de especialidad.',
        'Hub de infraestructura de innovación para estudio y trabajo colaborativo.',
        'Programa de empleabilidad e inserción laboral efectiva con empresas públicas y privadas.',
      ],
    },
    {
      area: 'BIOMÉDICAS',
      propuestas: [
        'Implementación de laboratorios clínicos y de formación.',
        'Prácticas clínicas en los hospitales universitarios y convenios con clínicas y empresas.',
        'Implementación del programa de bienestar y salud mental estudiantil.',
      ],
    },
    {
      area: 'SOCIALES',
      propuestas: [
        'Implementación de espacios de debate académico y de investigación.',
        'Talleres de liderazgo, oratoria y emprendimiento social.',
        'Implementación del voluntariado universitario con subvenciones para estudiantes.',
      ],
    },
    {
      area: 'EMPRESARIALES',
      propuestas: [
        'Fortalecimiento de la incubadora de empresas y vinculación empresarial.',
        'Capacitación en softskills para estudiantes y por los estudiantes.',
        'Bolsa de empleo estudiantil y ferias laborales de inserción.',
      ],
    },
  ];

  const directivos = [
    { nombre: 'Dr. Charles Mendoza', apodo: 'Tío Charles', cargo: 'RECTOR' },
    { nombre: 'Dr. Efraín Yupanqui', apodo: 'Fallo', cargo: 'Vicerrector Académico' },
    { nombre: 'Dr. Bernardo Roque', apodo: 'Maestro Roshi', cargo: 'Vicerrector de Investigación' },
  ];

  // 👇 Imágenes para el carrusel
  const imagenesCarrusel = ['/4.png', '/3.png'];
  const [imagenActual, setImagenActual] = useState(0);

  const siguiente = () => {
    setImagenActual((prev) => (prev + 1) % imagenesCarrusel.length);
  };

  const anterior = () => {
    setImagenActual((prev) => (prev - 1 + imagenesCarrusel.length) % imagenesCarrusel.length);
  };

  return (
    <section id="propuestas" className="presentation">
      <div className="landing-shell">
        {/* Presentación y Logo */}
        <div className="presentation-grid">
          <div className="presentation-text">
            <span className="eyebrow">Movimiento estudiantil</span>
            <h2>TODOS JUNTOS POR LA UNA</h2>
            <p className="slogan">Transparencia • Innovación • Honestidad</p>

            <div className="directivos">
              {directivos.map((dir, idx) => (
                <div key={idx} className="directivo">
                  <span className="directivo-nombre">
                    {dir.nombre}
                    <span className="directivo-apodo">"{dir.apodo}"</span>
                  </span>
                  <span className="directivo-cargo">{dir.cargo}</span>
                </div>
              ))}
            </div>

            <p className="presentation-message">
              Así como en nuestras comunidades el trabajo se hace con Minka, la universidad debe
              construirse con participación y transparencia.
            </p>

            <div className="presentation-badge">
              <span>¡LO QUE SE DICE SE CUMPLE!</span>
            </div>
          </div>

          {/* 👇 Carrusel de imágenes en lugar de la imagen estática */}
          <div className="presentation-image">
            <div className="image-container">
              <div className="carrusel-wrapper">
                <img
                  src={imagenesCarrusel[imagenActual]}
                  alt="Movimiento estudiantil"
                  className="foto-movimiento"
                />
                <div className="image-overlay">
                  <p>Movimiento estudiantil</p>
                  <small>Todos juntos por la UNA</small>
                </div>

                {/* Controles de navegación */}
                <button
                  onClick={anterior}
                  className="carrusel-btn carrusel-btn-izq"
                  aria-label="Imagen anterior"
                >
                  ‹
                </button>
                <button
                  onClick={siguiente}
                  className="carrusel-btn carrusel-btn-der"
                  aria-label="Imagen siguiente"
                >
                  ›
                </button>

                {/* Indicadores (puntos) */}
                <div className="carrusel-indicadores">
                  {imagenesCarrusel.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImagenActual(idx)}
                      className={`carrusel-punto ${
                        idx === imagenActual ? 'carrusel-punto-activo' : ''
                      }`}
                      aria-label={`Ir a imagen ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Propuestas principales */}
        <div className="propuestas-principales">
          <h3>Propuestas principales</h3>
          <div className="propuestas-grid">
            {propuestas_principales.map((prop, idx) => (
              <div key={idx} className="propuesta-card">
                <span className="propuesta-numero">{prop.numero}</span>
                <h4>{prop.titulo}</h4>
                <p>{prop.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Propuestas por áreas */}
        <div className="propuestas-areas">
          <h3>Propuestas por áreas</h3>
          <div className="areas-grid">
            {propuestas_areas.map((area, idx) => (
              <div key={idx} className="area-card">
                <h4>{area.area}</h4>
                <ul>
                  {area.propuestas.map((prop, pIdx) => (
                    <li key={pIdx}>{prop}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Cierre */}
        <div className="presentation-footer">
          <p>Por un smart campus y gestión universitaria cero papel.</p>
          <div className="footer-cta">
            <span>Este 2 de Julio apoya,</span>
            <div className="vota-badge">
              <span>TODOS JUNTOS POR LA UNA</span>
              <div className="numero-circulo">1</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .presentation {
          background: white;
          color: #1A1A1A;
          padding: 64px 0;
          font-family: 'Montserrat', sans-serif;
        }

        .landing-shell {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .presentation-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          margin-bottom: 64px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #2EBD8E;
          margin-bottom: 16px;
        }

        .eyebrow::before {
          content: '';
          width: 24px;
          height: 2px;
          background: #2EBD8E;
        }

        .presentation-text h2 {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 700;
          color: #3D1F7A;
          margin: 8px 0 12px;
          line-height: 1.05;
        }

        .slogan {
          font-weight: 600;
          color: #2EBD8E;
          letter-spacing: 0.08em;
          margin-bottom: 24px;
        }

        .directivos {
          border-left: 3px solid #2EBD8E;
          padding-left: 16px;
          margin-bottom: 24px;
        }

        .directivo {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 4px 12px;
          padding: 4px 0;
        }

        .directivo-nombre {
          font-weight: 700;
          color: #3D1F7A;
          font-size: 15px;
        }

        .directivo-apodo {
          font-weight: 400;
          color: #2EBD8E;
          font-size: 13px;
          font-style: italic;
          background: rgba(46, 189, 142, 0.12);
          padding: 0 8px;
          border-radius: 4px;
        }

        .directivo-cargo {
          color: #5B2D9E;
          font-size: 13px;
          font-weight: 500;
        }

        .presentation-message {
          font-size: 15px;
          color: #444;
          margin-bottom: 20px;
          line-height: 1.7;
        }

        .presentation-badge {
          display: inline-block;
          background: rgba(46, 189, 142, 0.15);
          border: 1px solid #2EBD8E;
          border-radius: 999px;
          padding: 8px 20px;
          color: #3D1F7A;
          font-weight: 700;
          font-size: 14px;
        }

        /* ===== CARRUSEL ===== */
        .presentation-image {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-container {
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          border: 2px solid rgba(46, 189, 142, 0.3);
          background: #f5f5f5;
          max-width: 500px;
        }

        .carrusel-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .foto-movimiento {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.3s ease;
        }

        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(61, 31, 122, 0.8));
          padding: 20px 16px 14px;
          color: white;
          text-align: center;
          pointer-events: none;
        }

        .image-overlay p {
          font-weight: 700;
          font-size: 16px;
          margin: 0;
        }

        .image-overlay small {
          font-size: 12px;
          opacity: 0.8;
        }

        /* Botones de navegación */
        .carrusel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(61, 31, 122, 0.7);
          color: white;
          border: 2px solid #2EBD8E;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 24px;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          backdrop-filter: blur(4px);
        }

        .carrusel-btn:hover {
          background: rgba(46, 189, 142, 0.8);
        }

        .carrusel-btn-izq {
          left: 10px;
        }

        .carrusel-btn-der {
          right: 10px;
        }

        /* Indicadores (puntos) */
        .carrusel-indicadores {
          position: absolute;
          bottom: 70px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .carrusel-punto {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.6);
          background: transparent;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          padding: 0;
        }

        .carrusel-punto-activo {
          background: #2EBD8E;
          border-color: #2EBD8E;
        }

        .carrusel-punto:hover {
          border-color: #2EBD8E;
        }

        /* ===== Fin carrusel ===== */

        .propuestas-principales,
        .propuestas-areas {
          margin-top: 56px;
        }

        .propuestas-principales h3,
        .propuestas-areas h3 {
          font-size: 28px;
          font-weight: 700;
          color: #3D1F7A;
          margin-bottom: 24px;
        }

        .propuestas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }

        .propuesta-card {
          background: #f8f8f8;
          padding: 24px;
          border-radius: 12px;
          border-left: 4px solid #2EBD8E;
          transition: transform 0.2s;
        }

        .propuesta-card:hover {
          transform: translateY(-4px);
        }

        .propuesta-numero {
          font-weight: 700;
          font-size: 28px;
          color: #2EBD8E;
          display: block;
          margin-bottom: 8px;
        }

        .propuesta-card h4 {
          font-weight: 700;
          font-size: 18px;
          color: #3D1F7A;
          margin-bottom: 8px;
        }

        .propuesta-card p {
          font-size: 14px;
          color: #555;
          line-height: 1.6;
        }

        .areas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }

        .area-card {
          background: #f8f8f8;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #eee;
        }

        .area-card h4 {
          font-weight: 700;
          color: #5B2D9E;
          margin-bottom: 12px;
          font-size: 18px;
        }

        .area-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .area-card li {
          position: relative;
          padding-left: 20px;
          margin-bottom: 8px;
          font-size: 14px;
          color: #444;
          line-height: 1.5;
        }

        .area-card li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #2EBD8E;
          font-weight: 700;
        }

        .presentation-footer {
          margin-top: 64px;
          padding-top: 32px;
          border-top: 1px solid #eee;
          text-align: center;
        }

        .presentation-footer p {
          color: #666;
          font-size: 15px;
          margin-bottom: 16px;
        }

        .footer-cta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-weight: 600;
        }

        .vota-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(46, 189, 142, 0.1);
          border: 1px solid #2EBD8E;
          border-radius: 999px;
          padding: 4px 16px 4px 20px;
        }

        .numero-circulo {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #2EBD8E;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .presentation-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .presentation-image {
            order: -1;
          }
          .image-container {
            max-width: 350px;
            margin: 0 auto;
          }
          .carrusel-btn {
            width: 34px;
            height: 34px;
            font-size: 20px;
          }
          .carrusel-indicadores {
            bottom: 60px;
          }
          .carrusel-punto {
            width: 8px;
            height: 8px;
          }
        }
      `}</style>
    </section>
  );
}