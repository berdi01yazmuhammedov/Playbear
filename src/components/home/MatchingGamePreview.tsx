import { useEffect, useState } from "react";

type PreviewCard = {
  id: string;
  pairId: number;
  content: string;
  type: "emoji" | "word";
};

const cards: PreviewCard[] = [
  {
    id: "apple-emoji",
    pairId: 1,
    content: "🍎",
    type: "emoji",
  },
  {
    id: "dog-word",
    pairId: 2,
    content: "Dog",
    type: "word",
  },
  {
    id: "sun-emoji",
    pairId: 3,
    content: "☀️",
    type: "emoji",
  },
  {
    id: "apple-word",
    pairId: 1,
    content: "Apple",
    type: "word",
  },
  {
    id: "sun-word",
    pairId: 3,
    content: "Sun",
    type: "word",
  },
  {
    id: "dog-emoji",
    pairId: 2,
    content: "🐶",
    type: "emoji",
  },
];

const animationSequence = [
  { pair: 1, delay: 900 },
  { pair: 2, delay: 850 },
  { pair: 3, delay: 850 },
];

export function MatchingGamePreview() {
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [activePair, setActivePair] = useState<number | null>(null);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const play = async () => {
      setMatchedPairs([]);
      setActivePair(null);

      await sleep(900);

      for (const step of animationSequence) {
        if (cancelled) return;

        setActivePair(step.pair);

        await sleep(step.delay);

        if (cancelled) return;

        setMatchedPairs((current) => [...current, step.pair]);
        setActivePair(null);

        await sleep(500);
      }

      if (cancelled) return;

      await sleep(2200);

      if (cancelled) return;

      setCycle((value) => value + 1);
    };

    play();

    return () => {
      cancelled = true;
    };
  }, [cycle]);

  const progress = (matchedPairs.length / 3) * 100;
  const completed = matchedPairs.length === 3;

  return (
    <div className="relative w-full max-w-[570px]">
      {/* Large ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.12] blur-[120px]" />

      {/* Decorative floating dots */}
      <div className="absolute left-3 top-10 h-2 w-2 rounded-full bg-violet-300/50 shadow-lg shadow-violet-400/40" />
      <div className="absolute bottom-20 right-2 h-2.5 w-2.5 rounded-full bg-blue-300/40 shadow-lg shadow-blue-400/30" />

      {/* Floating badge */}
      <div className="absolute -right-1 top-2 z-30 hidden rotate-6 items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/90 px-3 py-2.5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:flex">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10 text-sm text-emerald-300">
          ✓
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Live activity
          </p>
          <p className="text-xs font-semibold text-white">
            Students can play
          </p>
        </div>
      </div>

      {/* Main tilted product */}
      <div className="relative rotate-[2.2deg] transition-transform duration-700 hover:rotate-[0.8deg]">
        {/* Back layer */}
        <div className="absolute inset-3 translate-y-5 rounded-[2.2rem] border border-white/[0.04] bg-white/[0.015] shadow-2xl" />

        {/* Main window */}
        <div className="relative overflow-hidden rounded-[2.2rem] border border-white/[0.1] bg-[#16141e] p-2 shadow-[0_40px_100px_rgba(0,0,0,0.5)] sm:p-3">
          {/* Top bar */}
          <div className="flex h-12 items-center justify-between rounded-[1.5rem] border border-white/[0.05] bg-white/[0.035] px-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 text-[9px] font-black text-white">
                P
              </div>

              <span className="text-[11px] font-semibold text-white/50">
                PlayBear
              </span>
            </div>

            <div className="w-[50px]" />
          </div>

          {/* Game surface */}
          <div className="mt-2 rounded-[1.8rem] bg-[#0d0c12] p-5 sm:p-7">
            {/* Game heading */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-violet-400/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-violet-300">
                    Matching
                  </span>

                  {completed && (
                    <span className="rounded-lg bg-emerald-400/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                      Complete
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-lg font-bold tracking-tight text-white sm:text-xl">
                  Match the words
                </h3>

                <p className="mt-1 text-[11px] text-white/30 sm:text-xs">
                  Find the pairs that belong together
                </p>
              </div>

              {/* Score */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] px-3.5 py-2.5 text-right">
                <div className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/25">
                  Pairs
                </div>

                <div className="mt-0.5 text-sm font-bold text-white">
                  {matchedPairs.length}
                  <span className="text-white/20"> / 3</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-5">
              <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Matching cards */}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
              {cards.map((card, index) => {
                const isMatched = matchedPairs.includes(card.pairId);
                const isActive = activePair === card.pairId;

                return (
                  <div
                    key={card.id}
                    className={[
                      "group relative flex min-h-[76px] items-center justify-center overflow-hidden rounded-[1.15rem] border transition-all duration-500 sm:min-h-[86px]",
                      isMatched
                        ? "border-emerald-400/25 bg-emerald-400/[0.07] shadow-[0_8px_25px_rgba(52,211,153,0.07)]"
                        : isActive
                          ? "-translate-y-1 border-violet-400/50 bg-violet-400/[0.1] shadow-[0_14px_30px_rgba(139,92,246,0.16)]"
                          : "border-white/[0.07] bg-white/[0.025] hover:border-white/[0.12]",
                    ].join(" ")}
                    style={{
                      transitionDelay: `${index * 35}ms`,
                    }}
                  >
                    {/* Inner highlight */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.055] via-transparent to-transparent" />

                    {/* Animated active glow */}
                    {isActive && (
                      <div className="pointer-events-none absolute inset-0 animate-pulse bg-violet-400/[0.04]" />
                    )}

                    <span
                      className={[
                        "relative transition-all duration-500",
                        card.type === "emoji"
                          ? "text-3xl sm:text-4xl"
                          : "text-sm font-bold tracking-tight sm:text-base",
                        isMatched
                          ? "scale-90 opacity-70"
                          : isActive
                            ? "scale-110 text-white"
                            : "text-white/75",
                      ].join(" ")}
                    >
                      {card.content}
                    </span>

                    {/* Success indicator */}
                    {isMatched && (
                      <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/15 text-[8px] font-bold text-emerald-300">
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom info */}
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />

                <span className="text-[10px] font-medium text-white/25">
                  Interactive activity
                </span>
              </div>

              <span className="rounded-lg bg-white/[0.035] px-2.5 py-1.5 text-[9px] font-medium text-white/25">
                6 cards
              </span>
            </div>
          </div>
        </div>

        {/* Ground shadow */}
        <div className="absolute -bottom-10 left-[8%] right-[8%] -z-10 h-20 rounded-full bg-black/60 blur-3xl" />
      </div>

      {/* Floating completion card */}
      <div
        className={[
          "absolute -bottom-5 -left-3 z-30 hidden items-center gap-3 rounded-2xl border px-3.5 py-3 shadow-2xl backdrop-blur-xl transition-all duration-700 sm:flex",
          completed
            ? "translate-y-0 border-emerald-400/20 bg-slate-900/95 opacity-100"
            : "translate-y-3 border-white/5 bg-slate-900/80 opacity-0",
        ].join(" ")}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-lg">
          🎉
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-300">
            Nice work!
          </p>

          <p className="mt-0.5 text-xs font-semibold text-white">
            All pairs matched
          </p>
        </div>
      </div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}