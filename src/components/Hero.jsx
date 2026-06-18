export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 pb-24 pt-32 sm:pb-32 sm:pt-40"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(232,168,32,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 40%)',
        }}
      />

      <div className="section-container relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-accent-400 backdrop-blur-sm animate-fade-in">
            Tu voz importa
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl animate-slide-up">
            Construyamos juntos el futuro de nuestra universidad
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-primary-100 sm:text-lg animate-slide-up">
            Un movimiento estudiantil independiente, organizado y comprometido con la
            representación real, la transparencia y el bienestar de toda la comunidad
            universitaria.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up">
            <a
              href="#inscripcion"
              className="inline-flex w-full items-center justify-center rounded-full bg-accent-500 px-8 py-4 text-sm font-bold uppercase tracking-wide text-primary-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-accent-400 hover:shadow-xl sm:w-auto"
            >
              Súmate al movimiento
            </a>
            <a
              href="#nosotros"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/30 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              Conoce más
            </a>
          </div>

          <dl className="mt-16 grid grid-cols-3 gap-4 border-t border-white/10 pt-10 sm:gap-8">
            {[
              { value: '100%', label: 'Representación estudiantil' },
              { value: '+500', label: 'Estudiantes comprometidos' },
              { value: '24/7', label: 'Plataforma de inscripción' },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="text-2xl font-bold text-accent-400 sm:text-3xl">{stat.value}</dt>
                <dd className="mt-1 text-xs text-primary-200 sm:text-sm">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
