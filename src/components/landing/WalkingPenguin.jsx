// src/components/landing/WalkingPenguin.jsx

export default function WalkingPenguin() {
  return (
    <>
      {/*
        Filtro SVG de croma en 3 pasos:
        1. feColorMatrix  → mide "qué tan verde" es cada píxel y lo pone en el canal alfa
                            (verde puro → A≈1 | negro/blanco → A≈0)
        2. feComponentTransfer → invierte ese alfa
                            (verde → 0=transparente | resto → 1=opaco)
        3. feComposite "in" → aplica esa máscara sobre la imagen original
      */}
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute', pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <defs>
          <filter id="penguin-chroma-key" x="0%" y="0%" width="100%" height="100%"
                  colorInterpolationFilters="sRGB">

            {/* Paso 1 – medir "verdosidad": A = -R + 2G - B  (verde=1, blanco/negro=0) */}
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0 1
                     -1 2 -1 0 0"
              result="greenMask"
            />

            {/* Paso 2 – invertir: verde=0 (transparente), resto=1 (opaco) */}
            <feComponentTransfer in="greenMask" result="alphaMask">
              <feFuncA type="linear" slope="-1" intercept="1" />
            </feComponentTransfer>

            {/* Paso 3 – recortar la imagen original con la máscara */}
            <feComposite in="SourceGraphic" in2="alphaMask" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* Contenedor que camina */}
      <div className="penguin-wrap" aria-hidden="true">
        <img
          src="/pinguino.gif"
          alt=""
          className="penguin-img"
          draggable="false"
        />
      </div>

      <style>{`
        /* ===== Pingüino caminante ===== */
        .penguin-wrap {
          position: fixed;
          bottom: 0;
          left: 0;
          z-index: 9998;
          pointer-events: none;
          will-change: transform;
          animation: penguin-patrol 22s linear infinite;
        }

        /* Tamaño aumentado para igualar visualmente al botón de WhatsApp */
        .penguin-img {
          display: block;
          height: 200px;
          width: 200px;
          object-fit: contain;
          filter: url(#penguin-chroma-key);
          image-rendering: auto;
        }

        /*
          0 %  → entra por la izquierda (fuera de pantalla)
          48 % → llega al borde derecho (fuera de pantalla)
          50 % → se voltea (scaleX -1) y empieza a regresar
          98 % → llega de vuelta al borde izquierdo
          100% → se voltea de nuevo y reinicia
        */
        @keyframes penguin-patrol {
          0%   { transform: translateX(-100px) scaleX(1);  }
          48%  { transform: translateX(calc(100vw + 20px)) scaleX(1);  }
          50%  { transform: translateX(calc(100vw + 20px)) scaleX(-1); }
          98%  { transform: translateX(-100px) scaleX(-1); }
          100% { transform: translateX(-100px) scaleX(1);  }
        }

        /* ===== Responsive ===== */
        @media (max-width: 500px) {
          .penguin-img {
            height: 140px;
            width: 140px;
          }
        }
      `}</style>
    </>
  );
}
