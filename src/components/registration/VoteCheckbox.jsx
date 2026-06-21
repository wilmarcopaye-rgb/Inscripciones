// src/components/registration/VoteCheckbox.jsx
export default function VoteCheckbox({ number, label, description, checked, onChange, color = 'purple' }) {
  const colorMap = {
    purple: {
      border: 'border-purple-500',
      bg: 'bg-purple-500/80',
      text: 'text-purple-500',
      checkBg: 'bg-purple-500',
      checkBorder: 'border-purple-500',
    },
    red: {
      border: 'border-red-500',
      bg: 'bg-red-500/80',
      text: 'text-red-500',
      checkBg: 'bg-red-500',
      checkBorder: 'border-red-500',
    },
  };

  const colors = colorMap[color] || colorMap.purple;

  return (
    <div className="flex items-center gap-4 cursor-pointer group" onClick={onChange}>
      {/* Cuadrado con número y X superpuesta */}
      <div className="flex-shrink-0">
        <div
          className={`
            w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all relative
            ${checked ? `${colors.bg} ${colors.border}` : `${colors.border} bg-transparent`}
            ${!checked && colors.hover}
          `}
        >
          <span className={checked ? 'text-white text-2xl font-bold' : `font-bold text-2xl ${colors.text}`}>
            {number}
          </span>
          {checked && (
            <span className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold leading-none opacity-70 pointer-events-none">
              ✕
            </span>
          )}
        </div>
      </div>

      {/* Texto de la opción */}
      <div className="flex-1">
        <p className="font-poppins text-sm text-white font-medium">{label}</p>
        <p className="font-poppins text-xs text-white/50">{description}</p>
      </div>

      {/* Check circular a la derecha */}
      <div className="flex-shrink-0">
        {checked ? (
          <div className={`w-6 h-6 rounded-full ${colors.checkBg} border-2 ${colors.checkBorder} flex items-center justify-center`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-white/30 bg-transparent"></div>
        )}
      </div>
    </div>
  );
}