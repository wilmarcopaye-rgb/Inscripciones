import { WHATSAPP_URL } from '../../lib/content'

const PERKS = [
  'Recibe información oficial y avisos del movimiento.',
  'Participa en actividades, propuestas y voluntariado.',
  'Suma tu voz por todas las escuelas profesionales.',
]

export default function SumateSection({ onOpenRegister }) {
  return (
    <section className="landing-signup" id="inscripcion">
      <div className="landing-shell">
        <div className="text-center">
          <p className="landing-eyebrow mx-auto justify-center text-[var(--blue)]">
            Súmate al movimiento
          </p>
          <h2 className="mb-3 font-[var(--serif)] text-[clamp(27px,7vw,36px)] font-semibold text-[var(--blue-deep)]">
            Inscríbete en dos pasos
          </h2>
          <p className="mx-auto max-w-[560px] text-[15.5px] text-[var(--ink-2)]">
            Únete a nuestro grupo de WhatsApp y completa tu registro. Así recibirás avisos y
            podrás participar activamente en el movimiento.
          </p>

          <ul className="mx-auto mt-6 grid max-w-[430px] gap-2.5 text-left">
            {PERKS.map((perk) => (
              <li key={perk} className="flex gap-3 text-sm text-[var(--ink-2)]">
                <svg
                  className="mt-0.5 h-[19px] w-[19px] shrink-0 stroke-[var(--azure-deep)] fill-none stroke-2"
                  viewBox="0 0 24 24"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-9 max-w-md">
          <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--azure)] bg-[var(--azure-soft)] text-sm font-bold text-[var(--azure-deep)]">
              1
            </div>
            <h3 className="mb-2 font-[var(--serif)] text-xl font-semibold text-[var(--blue-deep)]">
              Únete al grupo de WhatsApp
            </h3>
            <p className="mb-4 text-sm text-[var(--ink-2)]">
              Ahí compartimos avisos, actividades y novedades del movimiento.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-[11px] bg-[var(--teal)] px-5 py-3.5 text-sm font-bold text-white no-underline transition hover:bg-[var(--teal-deep)]"
            >
              <svg viewBox="0 0 24 24" className="h-[19px] w-[19px] fill-current">
                <path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4c-4.78 0-8.66 3.88-8.66 8.66 0 1.55.41 3.04 1.18 4.35L3.6 21.5l4.62-1.5a8.62 8.62 0 0 0 3.83.92h.01c4.78 0 8.66-3.88 8.66-8.66 0-2.32-.9-4.5-2.12-6.94zm-5.55 13.3h-.01a7.2 7.2 0 0 1-3.67-1l-.26-.16-2.73.88.89-2.66-.17-.27a7.18 7.18 0 0 1-1.1-3.85c0-3.98 3.24-7.22 7.23-7.22 1.93 0 3.74.75 5.1 2.12a7.18 7.18 0 0 1 2.12 5.11c0 3.98-3.24 7.22-7.4 7.05zm3.96-5.42c-.22-.11-1.29-.64-1.49-.71-.2-.07-.34-.11-.49.11-.15.22-.56.71-.69.85-.13.15-.25.16-.47.05-.22-.11-.93-.34-1.77-1.09-.65-.58-1.09-1.3-1.22-1.52-.13-.22-.01-.34.1-.45.1-.11.22-.27.34-.4.11-.13.15-.22.22-.37.07-.15.04-.27-.02-.38-.07-.11-.6-1.44-.82-1.97-.22-.53-.44-.46-.6-.46-.16-.01-.34-.01-.52-.01-.18 0-.47.07-.71.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.65 1.12 2.84.13.18 1.83 2.8 4.46 3.81 2.63 1 2.63.67 3.1.63.47-.04 1.52-.62 1.74-1.22.22-.6.22-1.11.15-1.22-.07-.11-.25-.18-.47-.29z" />
              </svg>
              Unirme al grupo de WhatsApp
            </a>
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--ink-3)] text-sm font-bold text-[var(--ink-3)]">
              2
            </div>
            <h3 className="mb-2 font-[var(--serif)] text-xl font-semibold text-[var(--blue-deep)]">
              Completa tu inscripción
            </h3>
            <p className="mb-5 text-sm text-[var(--ink-2)]">
              Registra tus datos y elige tu preferencia de lista en el formulario oficial.
            </p>
            <button
              onClick={onOpenRegister}
              className="landing-btn landing-btn-primary w-full text-center no-underline"
            >
              Ir al formulario de registro
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
