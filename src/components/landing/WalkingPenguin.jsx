// src/components/landing/WalkingPenguin.jsx

export default function WalkingPenguin() {
  return (
    <>
      {/*
        Filtro SVG para eliminar el croma verde.
        Fórmula del canal alfa:
          A_out = 2*R - 4*G + 2*B + 2
          → verde puro (0,1,0) → A = -2  → 0  (transparente) ✓
          → blanco     (1,1,1) → A =  2  → 1  (opaco)        ✓
          → negro      (0,0,0) → A =  2  → 1  (opaco)        ✓
      */}
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute', pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <defs>
          <filter id="penguin-chroma-key" x="0" y="0" width="100%" height="100%">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      2 -4 2 0 2"
            />
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

        .penguin-img {
          display: block;
          height: 110px;
          width: auto;
          /* Aplica el filtro de croma verde */
          filter: url(#penguin-chroma-key);
          /* Suaviza los bordes del recorte */
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
          0%   { transform: translateX(-130px) scaleX(1);  }
          48%  { transform: translateX(calc(100vw + 30px)) scaleX(1);  }
          50%  { transform: translateX(calc(100vw + 30px)) scaleX(-1); }
          98%  { transform: translateX(-130px) scaleX(-1); }
          100% { transform: translateX(-130px) scaleX(1);  }
        }

        /* ===== Responsive ===== */
        @media (max-width: 500px) {
          .penguin-img {
            height: 80px;
          }
        }
      `}</style>
    </>
  );
}
