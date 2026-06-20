export default function Topbar({ onOpenRegister }) {
  return (
    <header className="landing-topbar">
      <div className="landing-shell flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/unap.png" alt="UNAP" className="h-10 w-auto" />
          <span className="font-bebas text-2xl text-white">TODOS JUNTOS</span>
        </div>
        <nav className="flex items-center gap-6">
          <button
            onClick={onOpenRegister}
            className="landing-btn landing-btn-primary text-sm"
          >
            Inscribirme
          </button>
        </nav>
      </div>
    </header>
  )
}