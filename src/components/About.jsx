const VALORES = [
  {
    title: 'Representación real',
    description:
      'Defendemos los intereses de todos los estudiantes con vocería activa en los espacios de decisión universitaria.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    ),
  },
  {
    title: 'Transparencia',
    description:
      'Rendimos cuentas claras sobre nuestras acciones, propuestas y el uso de los recursos estudiantiles.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
  },
  {
    title: 'Unidad estudiantil',
    description:
      'Trabajamos desde la diversidad de carreras y realidades, construyendo acuerdos que nos fortalezcan como comunidad.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    ),
  },
]

export default function About() {
  return (
    <section id="nosotros" className="py-20 sm:py-28">
      <div className="section-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">
            Quiénes somos
          </p>
          <h2 className="section-title mt-2">Un movimiento hecho por y para estudiantes</h2>
          <p className="section-subtitle mx-auto">
            Somos un movimiento estudiantil autónomo que nace de la necesidad de una
            representación genuina, cercana y eficaz. Creemos en la participación
            democrática como herramienta de transformación universitaria.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {VALORES.map((valor) => (
            <article
              key={valor.title}
              className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition group-hover:bg-primary-100">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {valor.icon}
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-primary-900">{valor.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{valor.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
