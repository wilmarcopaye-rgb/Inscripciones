export default function VoteCheckbox({ number, label, description, checked, onChange, color = 'purple', emoji = '😊' }) {
  const colorMap = {
    purple: {
      border: 'border-purple-500',
      bg: 'bg-purple-500/80',
      text: 'text-purple-500',
      checkBg: 'bg-purple-500',
      checkBorder: 'border-purple-500',
      xColor: 'text-purple-500', // X morada
    },
    red: {
      border: 'border-red-500',
      bg: 'bg-red-500/80',
      text: 'text-red-500',
      checkBg: 'bg-red-500',
      checkBorder: 'border-red-500',
      xColor: 'text-red-500', // X roja
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
            bg-white/10
          `}
        >
          {/* Número más grande */}
          <span className={checked ? 'text-white text-4xl font-bold' : `font-bold text-2xl ${colors.text}`}>
            {number}
          </span>
          {/* X más grande, más gruesa, redondeada */}
          {checked && (
            <span className={`absolute inset-0 flex items-center justify-center ${colors.xColor} text-5xl font-black leading-none pointer-events-none`}>
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

      {/* Carita (check) a la derecha */}
      <div className="flex-shrink-0 text-3xl">
        {checked ? (
          <span>{emoji}</span>
        ) : (
          <div className="w-6 h-6 rounded-md border-2 border-white/30 bg-transparent transition-all"></div>
        )}
      </div>
    </div>
  );
}