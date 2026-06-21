import { useState } from 'react';
import { CARRUSEL_SLIDES } from '../../lib/content';

export default function Carousel() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + CARRUSEL_SLIDES.length) % CARRUSEL_SLIDES.length);
  const next = () => setIndex((i) => (i + 1) % CARRUSEL_SLIDES.length);

  return (
    <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {CARRUSEL_SLIDES.map((slide) => (
          <div
            key={slide.caption}
            className="relative flex h-[clamp(210px,56vw,330px)] min-w-full items-end"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <span className="absolute left-3.5 top-3.5 max-w-[82%] rounded-full bg-[rgba(8,22,38,0.55)] px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              {slide.caption}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-none bg-[rgba(8,22,38,0.45)] text-xl text-white backdrop-blur-sm"
        onClick={prev}
        aria-label="Imagen anterior"
      >
        ‹
      </button>
      <button
        type="button"
        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-none bg-[rgba(8,22,38,0.45)] text-xl text-white backdrop-blur-sm"
        onClick={next}
        aria-label="Imagen siguiente"
      >
        ›
      </button>

      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {CARRUSEL_SLIDES.map((slide, i) => (
          <button
            key={slide.caption}
            type="button"
            aria-label={`Imagen ${i + 1}`}
            className={`h-2 rounded-full border-none p-0 transition-all ${
              i === index ? 'w-5 bg-[var(--accent-green)]' : 'w-2 bg-white/55' // NUEVO: usa --accent-green
            }`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}