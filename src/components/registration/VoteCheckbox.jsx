export default function VoteCheckbox({ number, label, description, checked, onChange, color = 'purple', emoji = '😊' }) {
  const colorMap = {
    purple: {
      border: 'border-purple-500',
      text: 'text-purple-500',
      xColor: 'text-purple-500',
      hover: 'hover:border-purple-400',
    },
    red: {
      border: 'border-red-500',
      text: 'text-red-500',
      xColor: 'text-red-500',
      hover: 'hover:border-red-400',
    },
  };

  const colors = colorMap[color] || colorMap.purple;

  return (
    <div className="flex items-center gap-4 cursor-pointer group" onClick={onChange}>
      {/* Cuadrado con fondo blanco siempre */}
      <div className="flex-shrink-0">
        <div
          className={`
            w-20 h-20 rounded-xl border-2 flex items-center justify-center transition-all relative
            ${checked ? `${colors.border}` : `${colors.border}`}
            ${!checked && colors.hover}
            bg-white
          `}
        >
          {/* Número SIEMPRE en su color (morado o rojo) */}
          <span className={`font-bold text-4xl ${colors.text}`}>
            {number}
          </span>
          {/* X superpuesta (solo cuando está seleccionado) */}
          {checked && (
            <span className={`absolute inset-0 flex items-center justify-center ${colors.xColor} text-6xl font-black leading-none opacity-60 pointer-events-none`}>
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

      {/* Carita a la derecha */}
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