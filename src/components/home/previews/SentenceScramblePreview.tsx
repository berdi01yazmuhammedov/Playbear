import { useState } from "react";
import { RotateCcw } from "lucide-react";

const WORDS = ["students", "enjoy", "learning", "English"];

const CORRECT_ORDER = ["Students", "enjoy", "learning", "English"];

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function SentenceScramblePreview() {
  const [words, setWords] = useState<string[]>(() => shuffle(WORDS));
  const [answer, setAnswer] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);

//   const answerText = useMemo(() => answer.join(" "), [answer]);

  function reset() {
    setWords(shuffle(WORDS));
    setAnswer([]);
    setComplete(false);
  }

  function selectWord(word: string) {
    if (answer.includes(word) || complete) {
      return;
    }

    const nextAnswer = [...answer, word];

    setAnswer(nextAnswer);

    const normalized = nextAnswer.map((item) => item.toLowerCase()).join(" ");

    const correct = CORRECT_ORDER.map((item) => item.toLowerCase()).join(" ");

    if (normalized === correct) {
      setComplete(true);
    }
  }

  function removeWord(word: string) {
    if (complete) {
      return;
    }

    setAnswer((current) => current.filter((item) => item !== word));
  }

  return (
    <div className="relative w-full max-w-[540px]">
      <div className="pointer-events-none absolute -inset-8 rounded-[48px] bg-blue-500/[0.07] blur-3xl" />

      <div className="relative overflow-hidden rounded-[30px] border border-white/[0.09] bg-slate-900/90 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-5">
        {/* Header */}

        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-400/[0.08] text-lg font-black text-blue-300">
              ☷
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-300">
                Sentence scramble
              </div>

              <div className="mt-0.5 text-sm font-bold text-white">
                Build the sentence
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={reset}
            aria-label="Restart sentence scramble preview"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-500 transition hover:bg-white/[0.07] hover:text-white"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Prompt */}

        <div className="mb-4">
          <div className="mb-2 text-[9px] font-black uppercase tracking-[0.16em] text-slate-600">
            Put the words in order
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-sm font-medium leading-6 text-slate-400">
            Students enjoy learning English.
          </div>
        </div>

        {/* Answer area */}

        <div className="mb-5 min-h-[84px] rounded-2xl border border-dashed border-white/[0.09] bg-black/10 p-3">
          {answer.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {answer.map((word) => (
                <button
                  key={word}
                  type="button"
                  onClick={() => removeWord(word)}
                  className="rounded-xl border border-blue-400/20 bg-blue-400/[0.09] px-3 py-2 text-xs font-bold text-blue-200 transition hover:bg-blue-400/[0.15]"
                >
                  {word}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[58px] items-center justify-center text-xs font-medium text-slate-700">
              Build your sentence here
            </div>
          )}
        </div>

        {/* Word bank */}

        <div className="flex flex-wrap justify-center gap-2">
          {words.map((word) => {
            const used = answer.includes(word);

            return (
              <button
                key={word}
                type="button"
                disabled={used || complete}
                onClick={() => selectWord(word)}
                className={[
                  "rounded-xl border px-3 py-2.5 text-xs font-bold transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-400/20",
                  used
                    ? "border-white/[0.04] bg-white/[0.015] text-slate-800"
                    : "border-white/[0.08] bg-white/[0.04] text-slate-200 hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-blue-400/[0.08]",
                ].join(" ")}
              >
                {word}
              </button>
            );
          })}
        </div>

        {/* Status */}

        <div className="mt-4">
          {complete ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.06] px-3 py-2.5 text-xs font-bold text-emerald-300">
              <span>✓</span>
              Perfect sentence!
            </div>
          ) : (
            <div className="rounded-xl bg-white/[0.02] px-3 py-2.5 text-center text-[10px] font-medium text-slate-600">
              Tap each word to build the sentence
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
