// ProgressBar component
export default function ProgressBar({ value, total, label }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs text-slate">{label}</span>
        <span className="text-xs font-semibold text-ink">{value}/{total}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-line/60 overflow-hidden">
        <div
          className="h-full rounded-full bg-forest transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
