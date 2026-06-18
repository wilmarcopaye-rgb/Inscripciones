export default function LogoBanner() {
  return (
    <div
      className="relative mb-6 overflow-hidden rounded-2xl p-[3px]"
      style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 30%, #06b6d4 60%, #7c3aed 100%)',
      }}
    >
      <div
        className="flex items-center gap-4 rounded-2xl p-4"
        style={{
          background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 40%, #0ea5e9 70%, #6d28d9 100%)',
        }}
      >
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/10">
          <img src="/Dr.Charles1.jpg" alt="Dr. Charles" className="h-12 w-12 object-contain rounded-full" />
        </div>

        <div className="flex-1">
          <span className="font-bebas text-4xl leading-none text-yellow-400 drop-shadow-lg">
            TODOS
          </span>
          <div className="flex flex-wrap items-center gap-1">
            <span className="font-bebas text-2xl text-white">JUNTOS</span>
            <span className="font-poppins text-xs text-white/70">POR LA</span>
            <span className="font-bebas text-2xl text-yellow-400">UNA</span>
          </div>
        </div>

        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-yellow-400 bg-white">
          <span className="font-bebas text-3xl text-purple-700">1</span>
          <svg viewBox="0 0 50 50" className="absolute inset-0 h-full w-full p-0.5">
            <line x1="5" y1="5" x2="45" y2="45" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
            <line x1="45" y1="5" x2="5" y2="45" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="mt-2 text-center">
        <p className="font-poppins text-sm font-bold text-yellow-300">
          🗳️ ¡Marca la 1! Elecciones segunda vuelta: 2 de julio
        </p>
        <p className="font-poppins text-xs text-white/70">Tu voto es decisivo, elige con conciencia</p>
      </div>
    </div>
  )
}