import { PILARES } from '../../lib/content'

const ICONS = {
  book: (
    <>
      <path d="M4 5a2 2 0 0 1 2-2h7v16H6a2 2 0 0 0-2 2V5z" />
      <path d="M20 3v18a2 2 0 0 0-2-2h-5V3h5a2 2 0 0 1 2 2z" />
    </>
  ),
  heart: (
    <>
      <path d="M12 21s-7-4.4-7-10a7 7 0 0 1 14 0c0 5.6-7 10-7 10z" />
      <circle cx="12" cy="11" r="2.4" />
    </>
  ),
  lab: (
    <>
      <path d="M9 3v6l-5 9a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3l-5-9V3" />
      <path d="M7 3h10" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3v18" />
      <path d="M5 7h14" />
      <path d="M5 7l-2 6a3 3 0 0 0 6 0L7 7" />
      <path d="M17 7l-2 6a3 3 0 0 0 6 0l-2-6" />
    </>
  ),
}

export default function PillarsSection() {
  return (
    <section className="landing-section tint" id="propuestas">
      <div className="landing-shell">
        <p className="landing-eyebrow text-[var(--blue)]">Nuestros ejes</p>
        <p className="landing-lede mb-8">
          Cuatro compromisos que guían nuestro trabajo por la universidad.
        </p>
        <div className="grid gap-3.5 sm:grid-cols-2">
          {PILARES.map((pillar) => (
            <article key={pillar.title} className="landing-pillar">
              <div className="mb-3.5 flex h-[42px] w-[42px] items-center justify-center rounded-[11px] bg-[var(--navy)]">
                <svg
                  className="h-[21px] w-[21px] stroke-[var(--sky)] fill-none stroke-[1.8]"
                  viewBox="0 0 24 24"
                >
                  {ICONS[pillar.icon]}
                </svg>
              </div>
              <h3 className="mb-1.5 font-[var(--serif)] text-lg font-semibold text-[var(--blue-deep)]">
                {pillar.title}
              </h3>
              <p className="m-0 text-[13.8px] leading-relaxed text-[var(--ink-2)]">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
