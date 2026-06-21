const COLORS = {
  purple: {
    border: 'border-purple-500/50',
    active: 'border-purple-500 bg-purple-500/10 ring-purple-500/30',
    badge: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white',
  },
  cyan: {
    border: 'border-cyan-400/50',
    active: 'border-cyan-400 bg-cyan-400/10 ring-cyan-400/30',
    badge: 'bg-cyan-400 text-slate-900',
  },
}

export default function VoteCheckbox({ number, label, description, checked, onChange, color = 'purple' }) {
  const palette = COLORS[color] ?? COLORS.purple

  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition ${
        checked ? `${palette.active} ring-2` : `${palette.border} bg-white/5 hover:bg-white/10`
      }`}
    >
      <input
        type="radio"
        name="preferencia"
        checked={checked}
        onChange={() => onChange(true)}
        className="mt-1 h-4 w-4 shrink-0"
      />
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bebas text-lg font-bold ${palette.badge}`}
      >
        {checked ? '✕' : number}
      </span>
      <span>
        <span className="block font-poppins text-sm font-semibold text-white">{label}</span>
        <span className="mt-0.5 block font-poppins text-xs text-white/60">{description}</span>
      </span>
    </label>
  )
}
