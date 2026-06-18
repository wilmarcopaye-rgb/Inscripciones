export default function SuccessMessage({ nombre, onNuevaInscripcion }) {
  return (
    <div
      className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center sm:p-10"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <svg
          className="h-8 w-8 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h3 className="mt-6 text-2xl font-bold text-emerald-900">¡Inscripción exitosa!</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-emerald-800">
        Gracias, <strong>{nombre}</strong>. Tu registro ha sido guardado correctamente.
        Pronto nos pondremos en contacto contigo con más información del movimiento.
      </p>

      <button
        type="button"
        onClick={onNuevaInscripcion}
        className="mt-8 rounded-full border border-emerald-300 bg-white px-6 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
      >
        Registrar otra inscripción
      </button>
    </div>
  )
}
