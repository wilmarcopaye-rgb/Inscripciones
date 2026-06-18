import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#propuestas', label: 'Propuestas' },
  { href: '#inscripcion', label: 'Inscripción' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = () => setMenuOpen(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-primary-100 bg-white/95 shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="section-container flex h-16 items-center justify-between sm:h-20">
        <a
          href="#inicio"
          className="group flex items-center gap-2.5"
          onClick={handleNavClick}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-sm font-bold text-white shadow-md transition group-hover:bg-primary-600">
            ME
          </span>
          <span
            className={`hidden text-sm font-semibold sm:block ${
              scrolled ? 'text-primary-900' : 'text-white'
            }`}
          >
            Movimiento Estudiantil
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-sm font-medium transition hover:text-accent-500 ${
                  scrolled ? 'text-slate-700' : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#inscripcion"
          className="hidden rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-primary-900 shadow-md transition hover:bg-accent-400 md:inline-flex"
        >
          Súmate
        </a>

        <button
          type="button"
          className={`inline-flex rounded-lg p-2 md:hidden ${
            scrolled ? 'text-primary-900' : 'text-white'
          }`}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-primary-100 bg-white px-4 pb-4 pt-2 shadow-lg md:hidden">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-primary-50"
                  onClick={handleNavClick}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#inscripcion"
                className="block rounded-full bg-accent-500 px-4 py-2.5 text-center text-sm font-semibold text-primary-900"
                onClick={handleNavClick}
              >
                Súmate al movimiento
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
