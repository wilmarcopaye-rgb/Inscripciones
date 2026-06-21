export default function LogoBanner() {
  return (
    <div
      className="relative mb-6 overflow-hidden rounded-2xl p-4"
      style={{
        background: '#2d1b69',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg overflow-hidden">
            <img src="/Dr.Charles1.jpg" alt="Dr. Charles" className="h-14 w-14 object-cover" />
          </div>
          <div className="flex-1">
            <p className="font-bebas text-xl text-white leading-tight">Inscripción Estudiantil</p>
            <p className="font-poppins text-xs text-white/70">El 2 de julio apoya al TODOS UNA</p>
          </div>
        </div>

        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white border-2 border-white">
          <span className="font-bebas text-2xl text-purple-600">1</span>
          <svg viewBox="0 0 50 50" className="absolute inset-0 h-full w-full p-0.5">
            <line x1="8" y1="8" x2="42" y2="42" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
            <line x1="42" y1="8" x2="8" y2="42" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}