import type { Activity } from "../../types/activity";

interface ResultsScreenProps {
  activity: Activity;
  score: number;
  matchedCount: number;
  attempts: number;
  onPlayAgain: () => void;
  onBack: () => void;
}

export function ResultsScreen({
  activity,
  score,
  matchedCount,
  attempts,
  onPlayAgain,
  onBack,
}: ResultsScreenProps) {
  const totalPairs = activity.items.length;
  const perfect = matchedCount === totalPairs;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-10 text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.08] blur-[140px]" />

        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/[0.05]" />

        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.025]" />
      </div>

      <section className="relative w-full max-w-xl animate-[pop-in_0.4s_ease-out]">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/40 backdrop-blur-xl">
          {/* Top accent */}
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-blue-500" />

          <div className="p-7 text-center sm:p-10">
            {/* Success icon */}
            <div className="relative mx-auto mb-7 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 animate-[success-ring_0.8s_ease-out] rounded-full bg-emerald-400/10" />

              <div className="relative flex h-20 w-20 animate-[success-pop_0.5s_ease-out] items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-4xl text-emerald-400 shadow-lg shadow-emerald-500/10">
                {perfect ? "✓" : "★"}
              </div>
            </div>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-violet-400">
              Activity complete
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {perfect ? "Great work!" : "Nice work!"}
            </h1>

            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-400">
              You matched{" "}
              <span className="font-semibold text-slate-200">
                {matchedCount}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-200">
                {totalPairs}
              </span>{" "}
              pairs in{" "}
              <span className="font-semibold text-slate-200">
                {activity.title}
              </span>
              .
            </p>

            {/* Stats */}
            <div className="mx-auto my-9 grid max-w-md grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
              <div className="border-r border-white/10 px-3 py-5 sm:px-5">
                <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                  Score
                </span>

                <strong className="mt-1 block text-2xl font-bold text-white sm:text-3xl">
                  {score}%
                </strong>
              </div>

              <div className="border-r border-white/10 px-3 py-5 sm:px-5">
                <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                  Matched
                </span>

                <strong className="mt-1 block text-2xl font-bold text-white sm:text-3xl">
                  {matchedCount}/{totalPairs}
                </strong>
              </div>

              <div className="px-3 py-5 sm:px-5">
                <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                  Attempts
                </span>

                <strong className="mt-1 block text-2xl font-bold text-white sm:text-3xl">
                  {attempts}
                </strong>
              </div>
            </div>

            {/* Performance message */}
            <div className="mb-8 rounded-2xl border border-violet-400/10 bg-violet-400/[0.04] px-5 py-4">
              <p className="text-sm font-medium text-slate-300">
                {perfect
                  ? "Perfect match! You got every pair."
                  : "Good job! Keep practising and you'll get even faster."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onPlayAgain}
                className="flex-1 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-white/10 transition hover:-translate-y-0.5 hover:bg-slate-100 active:translate-y-0"
              >
                ↻ Play again
              </button>

              <button
                type="button"
                onClick={onBack}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-slate-300 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08] hover:text-white active:translate-y-0"
              >
                ← Activities
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}