import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";

type MatchCard = {
  id: string;
  pairId: string;
  content: string;
  kind: "word" | "emoji";
};

const CARD_DATA: MatchCard[] = [
  {
    id: "apple-word",
    pairId: "apple",
    content: "Apple",
    kind: "word",
  },
  {
    id: "apple-emoji",
    pairId: "apple",
    content: "🍎",
    kind: "emoji",
  },
  {
    id: "sun-word",
    pairId: "sun",
    content: "Sun",
    kind: "word",
  },
  {
    id: "sun-emoji",
    pairId: "sun",
    content: "☀️",
    kind: "emoji",
  },
  {
    id: "dog-word",
    pairId: "dog",
    content: "Dog",
    kind: "word",
  },
  {
    id: "dog-emoji",
    pairId: "dog",
    content: "🐶",
    kind: "emoji",
  },
];

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function MatchingPreview() {
  const [cards, setCards] = useState<MatchCard[]>(() => shuffle(CARD_DATA));
  const [selected, setSelected] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);

  const completed = matched.length === 3;

  const progress = useMemo(
    () => Math.round((matched.length / 3) * 100),
    [matched.length],
  );

  function reset() {
    setCards(shuffle(CARD_DATA));
    setSelected([]);
    setMatched([]);
    setWrong([]);
  }

  useEffect(() => {
    if (selected.length !== 2) {
      return;
    }

    const [firstId, secondId] = selected;

    const first = cards.find((card) => card.id === firstId);
    const second = cards.find((card) => card.id === secondId);

    if (!first || !second) {
      return;
    }

    if (first.pairId === second.pairId) {
      const timer = window.setTimeout(() => {
        setMatched((current) => [...current, first.pairId]);
        setSelected([]);
      }, 350);

      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setWrong(selected);
      setSelected([]);

      window.setTimeout(() => {
        setWrong([]);
      }, 450);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [selected, cards]);

  function handleCardClick(card: MatchCard) {
    if (
      selected.includes(card.id) ||
      matched.includes(card.pairId) ||
      selected.length >= 2 ||
      wrong.length > 0
    ) {
      return;
    }

    setSelected((current) => [...current, card.id]);
  }

  return (
    <div className="relative w-full max-w-[540px]">
      {/* Decorative glow */}

      <div className="pointer-events-none absolute -inset-8 rounded-[48px] bg-violet-500/[0.08] blur-3xl" />

      <div className="relative overflow-hidden rounded-[30px] border border-white/[0.09] bg-slate-900/90 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-5">
        {/* Header */}

        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/[0.08] text-violet-300">
              <Sparkles size={17} />
            </div>

            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-300">
                Matching
              </div>

              <div className="mt-0.5 truncate text-sm font-bold text-white">
                Match the pairs
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={reset}
            aria-label="Restart matching preview"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-500 transition hover:bg-white/[0.07] hover:text-white"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Progress */}

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-[10px] font-semibold">
            <span className="text-slate-600">Progress</span>

            <span className="text-slate-400">{matched.length} / 3</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Cards */}

        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {cards.map((card) => {
            const isSelected = selected.includes(card.id);
            const isMatched = matched.includes(card.pairId);
            const isWrong = wrong.includes(card.id);

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCardClick(card)}
                disabled={isMatched}
                aria-label={`Select ${card.content}`}
                className={[
                  "relative aspect-[1.08] overflow-hidden rounded-2xl border",
                  "flex flex-col items-center justify-center",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-violet-400/30",
                  isMatched
                    ? "border-emerald-400/20 bg-emerald-400/[0.08] opacity-80"
                    : isWrong
                      ? "border-rose-400/30 bg-rose-400/[0.08] animate-[shake_0.35s_ease-in-out]"
                      : isSelected
                        ? "border-violet-400/40 bg-violet-400/[0.12] shadow-lg shadow-violet-500/10"
                        : "border-white/[0.07] bg-white/[0.025] hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.05]",
                ].join(" ")}
              >
                {isMatched && (
                  <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-slate-950">
                    ✓
                  </span>
                )}

                <span
                  className={
                    card.kind === "emoji"
                      ? "text-2xl sm:text-3xl"
                      : "text-xs font-bold text-slate-200 sm:text-sm"
                  }
                >
                  {card.content}
                </span>

                {isSelected && !isMatched && (
                  <span className="absolute bottom-2 h-1 w-1 rounded-full bg-violet-300" />
                )}
              </button>
            );
          })}
        </div>

        {/* Completion */}

        <div
          className={[
            "mt-4 overflow-hidden transition-all duration-300",
            completed ? "max-h-20 opacity-100" : "max-h-10 opacity-100",
          ].join(" ")}
        >
          {completed ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.06] px-3 py-2.5 text-xs font-bold text-emerald-300">
              <span>✓</span>
              All pairs matched!
            </div>
          ) : (
            <div className="rounded-xl bg-white/[0.02] px-3 py-2.5 text-center text-[10px] font-medium text-slate-600">
              Click two cards to find a match
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
