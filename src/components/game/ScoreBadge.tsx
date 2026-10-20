interface ScoreBadgeProps {
  score: number;
}

export function ScoreBadge({
  score,
}: ScoreBadgeProps) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 shadow-lg shadow-black/10 backdrop-blur-sm">
      <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
        Score
      </span>

      <span className="text-xl font-bold tabular-nums text-white">
        {score}%
      </span>
    </div>
  );
}