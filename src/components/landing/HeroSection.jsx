import Carousel from './Carousel'

export default function HeroSection({ onOpenRegister }) {
  return (
    <section className="landing-hero">
      <div className="landing-shell relative z-[2]">
        <p className="landing-eyebrow">Movimiento estudiantil · UNA Puno</p>
        <h1>
          Todos juntos
          <br />
          por la <em>UNA</em>
        </h1>
        <p className="mb-8 max-w-[520px] text-[clamp(15.5px,4.2vw,18px)] leading-relaxed text-[var(--on-navy-2)]">
          Una sola voz estudiantil rumbo a las elecciones a Rectorado 2026 de la Universidad
          Nacional del Altiplano. Súmate al movimiento que une a todas las escuelas
          profesionales por una universidad mejor.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenRegister}
            className="landing-btn landing-btn-primary"
          >
            Quiero inscribirme
          </button>
          <a href="#propuestas" className="landing-btn landing-btn-ghost">
            Ver nuestras propuestas
          </a>
        </div>

        {/* Solo el carrusel */}
        <Carousel />
      </div>
    </section>
  )
}