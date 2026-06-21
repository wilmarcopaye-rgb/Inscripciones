export default function VoteCheckbox({ number, label, description, checked, onChange, color = 'purple' }) {
  const colorMap = {
    purple: {
      border: 'border-purple-500',
      bg: 'bg-purple-500/80', // opacidad para que el número se vea
      text: 'text-purple-500',
      hover: 'hover:border-purple-400',
    },
    cyan: {
      border: 'border-cyan-500',
      bg: 'bg-cyan-500/80',
      text: 'text-cyan-500',
      hover: 'hover:border-cyan-400',
    },
  };

  const colors = colorMap[color] || colorMap.purple;

  return (
    <div className="flex items-start gap-4 cursor-pointer group" onClick={onChange}>
      <div className="flex-shrink-0 relative">
        <div
          className={`
            w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all relative
            ${checked ? `${colors.bg} ${colors.border}` : `${colors.border} bg-transparent`}
            ${!checked && colors.hover}
          `}
        >
          {checked ? (
            <>
              {/* Número visible (blanco) */}
              <span className="font-bold text-lg text-white">{number}</span>
              {/* "X" semi-transparente superpuesta */}
              <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold leading-none opacity-60 pointer-events-none">
                ✕
              </span>
            </>
          ) : (
            <span className={`font-bold text-lg ${colors.text}`}>{number}</span>
          )}
        </div>
      </div>
      <div>
        <p className="font-poppins text-sm text-white font-medium">{label}</p>
        <p className="font-poppins text-xs text-white/50">{description}</p>
      </div>
    </div>
  );
}