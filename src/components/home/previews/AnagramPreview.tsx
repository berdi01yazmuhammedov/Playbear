import { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";

const WORD = "LEARN";
const LETTERS = ["L", "E", "A", "R", "N"];

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function AnagramPreview() {
  const [letters, setLetters] = useState<string[]>(() => shuffle(LETTERS));
  const [answer, setAnswer] = useState<number[]>([]);
  const [complete, setComplete] = useState(false);

  const answerText = useMemo(
    () => answer.map((index) => letters[index]).join(""),
    [answer, letters],
  );

  function reset() {
    setLetters(shuffle(LETTERS));
    setAnswer([]);
    setComplete(false);
  }

  function selectLetter(index: number) {
    if (answer.includes(index) || complete) {
      return;
    }

    const nextAnswer = [...answer, index];

    setAnswer(nextAnswer);

    const nextText = nextAnswer
      .map((letterIndex) => letters[letterIndex])
      .join("");

    if (nextText === WORD) {
      setComplete(true);
    }
  }

  function removeLetter(index: number) {
    if (complete) {
      return;
    }

    setAnswer((current) => current.filter((item) => item !== index));
  }

  useEffect(() => {
    if (answer.length === WORD.length && answerText !== WORD) {
      const timer = window.setTimeout(() => {
        setAnswer([]);
      }, 650);

      return () => window.clearTimeout(timer);
    }
  }, [answer.length, answerText]);

  return (
    <div className="relative w-full max-w-[540px]">
      <div className="pointer-events-none absolute -inset-8 rounded-[48px] bg-cyan-500/[0.07] blur-3xl" />

      <div className="relative overflow-hidden rounded-[30px] border border-white/[0.09] bg-slate-900/90 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-5">
        {/* Header */}

        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.08] text-sm font-black text-cyan-300">
              Aa
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
                Anagram
              </div>

              <div className="mt-0.5 text-sm font-bold text-white">
                Unscramble the word
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={reset}
            aria-label="Restart anagram preview"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-500 transition hover:bg-white/[0.07] hover:text-white"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Hint */}

        <div className="mb-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
          <div className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-600">
            Hint
          </div>

          <div className="mt-1 text-sm font-semibold text-slate-300">
            Something you do when you gain knowledge
          </div>
        </div>

        {/* Answer */}

        <div className="mb-5 flex min-h-[62px] items-center justify-center rounded-2xl border border-dashed border-white/[0.09] bg-black/10 px-3">
          {answer.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-1.5">
              {answer.map((letterIndex) => (
                <button
                  key={letterIndex}
                  type="button"
                  onClick={() => removeLetter(letterIndex)}
                  aria-label={`Remove ${letters[letterIndex]}`}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.09] text-sm font-black text-cyan-200 transition hover:bg-cyan-400/[0.15]"
                >
                  {letters[letterIndex]}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-xs font-medium text-slate-700">
              Build the word here
            </span>
          )}
        </div>

        {/* Letters */}

        <div className="flex flex-wrap justify-center gap-2">
          {letters.map((letter, index) => {
            const used = answer.includes(index);

            return (
              <button
                key={`${letter}-${index}`}
                type="button"
                onClick={() => selectLetter(index)}
                disabled={used || complete}
                className={[
                  "flex h-11 w-11 items-center justify-center rounded-xl",
                  "border text-sm font-black transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-cyan-400/20",
                  used
                    ? "border-white/[0.04] bg-white/[0.015] text-slate-800"
                    : "border-white/[0.08] bg-white/[0.04] text-white hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-cyan-400/[0.08]",
                ].join(" ")}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Status */}

        <div className="mt-4">
          {complete ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.06] px-3 py-2.5 text-xs font-bold text-emerald-300">
              <span>✓</span>
              Correct! You got it.
            </div>
          ) : (
            <div className="rounded-xl bg-white/[0.02] px-3 py-2.5 text-center text-[10px] font-medium text-slate-600">
              Tap the letters in the correct order
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
