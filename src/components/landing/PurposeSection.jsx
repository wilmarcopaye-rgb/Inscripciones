export default function PurposeSection() {
  return (
    <section className="landing-section">
      <div className="landing-shell">
        <p className="landing-eyebrow text-[var(--blue)]">Nuestro propósito</p>
        <p className="landing-lede">
          Creemos en una <strong className="text-[var(--blue-deep)]">UNA que escuche a sus estudiantes</strong>,
          defienda la calidad académica y abra sus puertas a la investigación y la innovación.
        </p>
        <p className="mt-[18px] max-w-[560px] text-[15.5px] text-[var(--ink-2)]">
          «Todos juntos por la UNA» nace para representar a cada escuela profesional con propuestas
          serias, gestión transparente y trabajo cercano. Este 2026 decidimos el rumbo de nuestra
          universidad — hagámoslo juntos.
        </p>
      </div>

      {/* ========== ESTILOS NUEVOS (ajustar colores) ========== */}
      <style>{`
        .landing-section .landing-eyebrow {
          color: var(--accent-green) !important;
        }
        .landing-section .landing-eyebrow::before {
          background: var(--accent-green) !important;
        }
        .landing-section .landing-lede strong {
          color: var(--secondary-purple) !important; /* o el que prefieras */
        }
      `}</style>
    </section>
  );
}