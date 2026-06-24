// src/components/landing/SplashScreen.jsx
import { useEffect, useState } from 'react';

export default function SplashScreen() {
  // 'visible' → mostrando, 'fading' → animando salida, 'gone' → desmontado
  const [phase, setPhase] = useState('visible');

  useEffect(() => {
    // Después de 1 segundo inicia el fade-out
    const fadeTimer = setTimeout(() => setPhase('fading'), 1000);
    // Después de 1.4 s (fade de 400 ms) se desmonta completamente
    const goneTimer = setTimeout(() => setPhase('gone'), 1400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(goneTimer);
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <>
      <div className={`splash-overlay ${phase === 'fading' ? 'splash-fade-out' : ''}`}>
        <img src="/gato.jpg" alt="Bienvenida" className="splash-img" />
      </div>

      <style>{`
        .splash-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(0, 0, 0, 0.82);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: splash-in 0.25s ease-out both;
        }

        .splash-fade-out {
          animation: splash-out 0.4s ease-in forwards;
        }

        .splash-img {
          max-width: min(480px, 90vw);
          max-height: 80vh;
          border-radius: 18px;
          object-fit: contain;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.7),
                      0 0 0 4px rgba(255, 255, 255, 0.08);
          animation: splash-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes splash-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes splash-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }

        @keyframes splash-pop {
          from { transform: scale(0.82); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </>
  );
}
