export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-primary-800 bg-primary-900 text-primary-100">
      <div className="section-container py-12 sm:py-16">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2.5 sm:justify-start">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500 text-sm font-bold text-primary-900">
                ME
              </span>
              <span className="text-sm font-semibold text-white">Movimiento Estudiantil</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary-300">
              Plataforma de inscripción oficial. Construyendo una universidad más justa,
              participativa y representativa.
            </p>
          </div>

          <nav aria-label="Enlaces del pie de página">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-end">
              {[
                { href: '#inicio', label: 'Inicio' },
                { href: '#nosotros', label: 'Nosotros' },
                { href: '#propuestas', label: 'Propuestas' },
                { href: '#inscripcion', label: 'Inscripción' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-300 transition hover:text-accent-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-primary-800 pt-8 sm:flex-row">
          <p className="text-xs text-primary-400">
            © {year} Movimiento Estudiantil. Todos los derechos reservados.
          </p>
          <p className="text-xs text-primary-500">
            Panel administrativo · Próximamente
          </p>
        </div>
      </div>
    </footer>
  )
}
