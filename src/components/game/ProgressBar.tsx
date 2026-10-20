interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({
  current,
  total,
}: ProgressBarProps) {
  const percentage =
    total === 0 ? 0 : Math.min((current / total) * 100, 100);

  return (
    <div
      className="flex w-full items-center gap-3"
      aria-label={`Progress: ${current} of ${total}`}
    >
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span className="min-w-12 text-right text-sm font-semibold tabular-nums text-slate-300">
        {current}/{total}
      </span>
    </div>
  );
}