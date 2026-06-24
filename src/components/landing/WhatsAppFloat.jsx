// src/components/landing/WhatsAppFloat.jsx
import { WHATSAPP_URL } from '../../lib/content';

export default function WhatsAppFloat() {
  return (
    <>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float"
        aria-label="Únete al grupo de WhatsApp"
        title="Únete al grupo de WhatsApp"
      >
        {/* Ícono SVG oficial de WhatsApp */}
        <svg
          className="wa-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="24" cy="24" r="24" fill="#25D366" />
          <path
            d="M34.6 13.4A14.84 14.84 0 0 0 24 9C16.27 9 10 15.27 10 23c0 2.5.65 4.94 1.9 7.1L10 39l9.1-1.87A14.93 14.93 0 0 0 24 39c7.73 0 14-6.27 14-14 0-3.74-1.46-7.26-3.4-11.6z"
            fill="#25D366"
          />
          <path
            d="M24 37c-2.34 0-4.63-.63-6.63-1.82l-.47-.28-4.9 1.01 1.04-4.76-.31-.49A12.94 12.94 0 0 1 11 23c0-7.18 5.82-13 13-13a12.93 12.93 0 0 1 9.19 3.81A12.93 12.93 0 0 1 37 23c0 7.18-5.82 13-13 13z"
            fill="white"
          />
          <path
            d="M30.73 26.27c-.36-.18-2.1-1.03-2.43-1.15-.32-.12-.56-.18-.79.18-.23.36-.9 1.15-1.1 1.38-.2.24-.41.27-.77.09-.36-.18-1.52-.56-2.9-1.78-1.07-.95-1.79-2.13-2-2.49-.2-.36-.02-.55.16-.73.16-.16.36-.41.54-.62.18-.2.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.79-1.9-1.08-2.6-.28-.68-.57-.59-.79-.6h-.67c-.23 0-.6.09-.92.45-.32.36-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.18.23 2.42 3.7 5.87 5.19.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2.1-.86 2.4-1.69.3-.83.3-1.55.21-1.7-.09-.15-.32-.24-.68-.42z"
            fill="#25D366"
          />
        </svg>

        {/* Tooltip */}
        <span className="wa-tooltip">¡Únete al grupo!</span>

        {/* Pulso animado */}
        <span className="wa-pulse" aria-hidden="true" />
      </a>

      <style>{`
        /* ===== Botón flotante WhatsApp ===== */
        .wa-float {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 81px;
          height: 81px;
          border-radius: 50%;
          background: #25D366;
          box-shadow: 0 6px 24px rgba(37, 211, 102, 0.45),
                      0 2px 8px rgba(0, 0, 0, 0.25);
          text-decoration: none;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.25s ease;
          cursor: pointer;
        }

        .wa-float:hover {
          transform: scale(1.12);
          box-shadow: 0 10px 32px rgba(37, 211, 102, 0.6),
                      0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .wa-float:hover .wa-tooltip {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
        }

        /* Ícono SVG */
        .wa-icon {
          width: 49px;
          height: 49px;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));
        }

        /* Tooltip */
        .wa-tooltip {
          position: absolute;
          right: 72px;
          background: #1a1a2e;
          color: #fff;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          padding: 7px 14px;
          border-radius: 8px;
          pointer-events: none;
          opacity: 0;
          transform: translateX(8px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 1px solid rgba(37, 211, 102, 0.3);
        }

        /* Flechita del tooltip */
        .wa-tooltip::after {
          content: '';
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 6px 0 6px 6px;
          border-style: solid;
          border-color: transparent transparent transparent #1a1a2e;
        }

        /* Anillo pulsante */
        .wa-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(37, 211, 102, 0.4);
          animation: wa-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          z-index: 1;
        }

        @keyframes wa-ping {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        /* ===== Responsive ===== */
        @media (max-width: 500px) {
          .wa-float {
            bottom: 18px;
            right: 18px;
            width: 70px;
            height: 70px;
          }

          .wa-icon {
            width: 42px;
            height: 42px;
          }

          .wa-tooltip {
            font-size: 12px;
            padding: 6px 11px;
            right: 62px;
          }
        }
      `}</style>
    </>
  );
}
