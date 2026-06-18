const PROPUESTAS = [
  {
    number: '01',
    title: 'Becas y acceso equitativo',
    description:
      'Impulsar políticas que garanticen becas reales, tarifas justas y apoyo a estudiantes en situación de vulnerabilidad.',
  },
  {
    number: '02',
    title: 'Infraestructura y servicios',
    description:
      'Exigir mejoras en aulas, laboratorios, bibliotecas, conectividad y servicios de salud estudiantil.',
  },
  {
    number: '03',
    title: 'Calidad académica',
    description:
      'Promover currículos actualizados, docentes capacitados y evaluación continua con participación estudiantil.',
  },
  {
    number: '04',
    title: 'Participación democrática',
    description:
      'Fortalecer asambleas, consejos y mecanismos de consulta donde cada voz sea escuchada y considerada.',
  },
]

const BENEFICIOS = [
  'Formar parte de una red organizada de estudiantes activos.',
  'Incidir directamente en las decisiones que afectan tu formación.',
  'Acceder a información clara sobre derechos y deberes estudiantiles.',
  'Contribuir a propuestas concretas con impacto en toda la universidad.',
  'Desarrollar liderazgo, oratoria y habilidades de organización colectiva.',
]

export default function Proposals() {
  return (
    <section id="propuestas" className="bg-white py-20 sm:py-28">
      <div className="section-container">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <div className="lg:w-1/2">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">
              Nuestras propuestas
            </p>
            <h2 className="section-title mt-2">Objetivos claros, acciones concretas</h2>
            <p className="section-subtitle">
              Trabajamos con una agenda definida que responde a las necesidades reales de
              la comunidad estudiantil.
            </p>

            <div className="mt-10 space-y-6">
              {PROPUESTAS.map((propuesta) => (
                <article
                  key={propuesta.number}
                  className="flex gap-5 rounded-xl border border-slate-100 bg-slate-50 p-5 transition hover:border-primary-200 hover:bg-primary-50/50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-700 text-sm font-bold text-white">
                    {propuesta.number}
                  </span>
                  <div>
                    <h3 className="font-semibold text-primary-900">{propuesta.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {propuesta.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="rounded-2xl bg-gradient-to-br from-primary-800 to-primary-900 p-8 text-white shadow-xl sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent-400">
                Beneficios
              </p>
              <h3 className="mt-2 text-2xl font-bold">¿Por qué participar?</h3>
              <p className="mt-3 text-sm leading-relaxed text-primary-100">
                Al inscribirte, te sumas a un esfuerzo colectivo que defiende tus derechos
                y construye una universidad más justa para todos.
              </p>

              <ul className="mt-8 space-y-4">
                {BENEFICIOS.map((beneficio) => (
                  <li key={beneficio} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500 text-primary-900">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span className="text-sm leading-relaxed text-primary-50">{beneficio}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#inscripcion"
                className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-accent-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-900 transition hover:bg-accent-400 sm:w-auto"
              >
                Súmate al movimiento
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
