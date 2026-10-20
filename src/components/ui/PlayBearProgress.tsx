interface PlayBearProgressProps {
  current: number;
  total: number;
  label?: string;
}

export function PlayBearProgress({
  current,
  total,
  label = "Progress",
}: PlayBearProgressProps) {
  const safeTotal = Math.max(total, 1);
  const percentage = Math.min(100, Math.max(0, (current / safeTotal) * 100));

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-400">{label}</span>

        <span className="font-semibold text-slate-300">
          {current} / {total}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 transition-[width] duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
