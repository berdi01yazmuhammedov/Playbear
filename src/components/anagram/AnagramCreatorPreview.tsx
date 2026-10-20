import { useMemo, useState } from "react";
import { Check, Eraser, Lightbulb, Sparkles } from "lucide-react";

import type { AnagramDraft } from "../../features/anagram/anagram.types";
import { scrambleWord } from "../../features/anagram/anagram.creator";

interface Props {
  draft: AnagramDraft;
}

export function AnagramCreatorPreview({ draft }: Props) {
  const playableItems = draft.items.filter((item) => item.word.trim());

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState<string[]>([]);

  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
    "idle",
  );

  const [showHint, setShowHint] = useState(false);

  const currentItem = playableItems[currentIndex];

  const scrambledLetters = useMemo(() => {
    if (!currentItem) {
      return [];
    }

    return [...scrambleWord(currentItem.word)];
  }, [currentItem?.id, currentItem?.word]);

  function selectLetter(letter: string, index: number) {
    if (feedback !== "idle" || selectedIndices.includes(index)) {
      return;
    }

    setAnswer((current) => [...current, letter]);

    setSelectedIndices((current) => [...current, index]);
  }

  function removeLetter(index: number) {
    if (feedback !== "idle") {
      return;
    }

    setAnswer((current) =>
      current.filter((_, letterIndex) => letterIndex !== index),
    );

    setSelectedIndices((current) =>
      current.filter((_, letterIndex) => letterIndex !== index),
    );
  }

  function clear() {
    if (feedback !== "idle") {
      return;
    }

    setAnswer([]);
    setSelectedIndices([]);
  }

  function checkAnswer() {
    if (!currentItem || answer.length === 0) {
      return;
    }

    const isCorrect =
      answer.join("").toLocaleLowerCase() ===
      currentItem.word.trim().toLocaleLowerCase();

    setFeedback(isCorrect ? "correct" : "incorrect");
  }

  function nextWord() {
    setCurrentIndex(
      (current) => (current + 1) % Math.max(playableItems.length, 1),
    );

    setAnswer([]);
    setSelectedIndices([]);
    setFeedback("idle");
    setShowHint(false);
  }

  function retry() {
    setAnswer([]);
    setSelectedIndices([]);
    setFeedback("idle");
  }

  if (playableItems.length === 0) {
    return (
      <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-slate-950 shadow-2xl">
        <PreviewHeader />

        <div className="flex min-h-[500px] items-center justify-center px-8">
          <div className="max-w-xs text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.04] text-slate-500">
              <Sparkles size={24} />
            </div>

            <h3 className="text-sm font-bold text-white">
              Your preview will appear here
            </h3>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Add at least one word to see how students will experience this
              activity.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-slate-950 shadow-2xl shadow-black/30">
      <PreviewHeader />

      <div className="border-b border-white/[0.05] bg-white/[0.015] px-5 py-4 sm:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              {draft.title.trim() || "Untitled activity"}
            </p>

            <p className="mt-1 truncate text-xs text-slate-500">
              {draft.instructions.trim() ||
                "Unscramble the letters to make a word."}
            </p>
          </div>

          <div className="shrink-0 rounded-full border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold text-slate-500">
            Preview
          </div>
        </div>
      </div>

      <div className="px-5 py-8 sm:px-7 sm:py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
              Question
            </p>

            <p className="mt-1 text-xs font-semibold text-slate-400">
              {currentIndex + 1} / {playableItems.length}
            </p>
          </div>

          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 transition-all duration-500"
              style={{
                width: `${((currentIndex + 1) / playableItems.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs font-medium text-slate-500">
            Unscramble the letters
          </p>

          {showHint && currentItem.hint && (
            <div className="mx-auto mt-3 inline-flex max-w-full items-center gap-2 rounded-xl border border-amber-300/10 bg-amber-300/[0.05] px-3 py-2 text-xs text-amber-200">
              <Lightbulb size={13} />
              <span>{currentItem.hint}</span>
            </div>
          )}
        </div>

        <div className="mt-7 rounded-2xl border border-white/[0.05] bg-black/10 p-4">
          <div className="flex min-h-[66px] flex-wrap items-center justify-center gap-1.5">
            {answer.length === 0 ? (
              <span className="text-[11px] text-slate-700">Your answer</span>
            ) : (
              answer.map((letter, index) => (
                <button
                  key={`${letter}-${index}`}
                  type="button"
                  onClick={() => removeLetter(index)}
                  className="flex h-10 w-9 animate-[previewAnswerIn_220ms_ease-out] items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] text-sm font-black uppercase text-cyan-100 transition-all hover:-translate-y-0.5 hover:bg-cyan-300/[0.12] active:scale-95"
                >
                  {letter}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {scrambledLetters.map((letter, index) => {
            const selected = selectedIndices.includes(index);

            return (
              <button
                key={`${letter}-${index}`}
                type="button"
                disabled={selected}
                onClick={() => selectLetter(letter, index)}
                className={[
                  "flex h-11 w-10 items-center justify-center rounded-xl border",
                  "text-sm font-black uppercase transition-all duration-200",
                  selected
                    ? "scale-90 border-white/[0.02] bg-white/[0.01] text-transparent opacity-20"
                    : "border-white/[0.08] bg-white/[0.045] text-white hover:-translate-y-1 hover:border-white/[0.15] hover:bg-white/[0.08] active:scale-95",
                ].join(" ")}
              >
                {letter}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={clear}
            disabled={answer.length === 0 || feedback !== "idle"}
            className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 text-[11px] font-semibold text-slate-400 transition-all hover:bg-white/[0.06] hover:text-white disabled:pointer-events-none disabled:opacity-30"
          >
            <Eraser size={13} />
            Clear
          </button>

          <button
            type="button"
            onClick={() => setShowHint((current) => !current)}
            disabled={!currentItem.hint}
            className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 text-[11px] font-semibold text-slate-400 transition-all hover:bg-white/[0.06] hover:text-white disabled:pointer-events-none disabled:opacity-30"
          >
            <Lightbulb size={13} />
            Hint
          </button>

          <button
            type="button"
            onClick={checkAnswer}
            disabled={answer.length === 0 || feedback !== "idle"}
            className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-white px-3 text-[11px] font-bold text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-slate-100 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-30"
          >
            <Check size={13} />
            Check
          </button>
        </div>

        {feedback === "correct" && (
          <div className="mt-5 animate-[previewFeedbackIn_250ms_ease-out] rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                  <Check size={15} />
                </div>

                <div>
                  <p className="text-xs font-bold text-emerald-200">Correct!</p>

                  <p className="text-[10px] text-emerald-300/50">
                    That's exactly right.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={nextWord}
                className="rounded-lg bg-emerald-400 px-3 py-2 text-[10px] font-bold text-emerald-950 transition hover:bg-emerald-300"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {feedback === "incorrect" && (
          <div className="mt-5 animate-[previewFeedbackIn_250ms_ease-out] rounded-2xl border border-red-400/15 bg-red-400/[0.06] p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-red-200">Not quite</p>

                <p className="mt-0.5 text-[10px] text-red-300/50">
                  Try arranging the letters again.
                </p>
              </div>

              <button
                type="button"
                onClick={retry}
                className="rounded-lg border border-red-300/10 bg-red-400/[0.08] px-3 py-2 text-[10px] font-bold text-red-200 transition hover:bg-red-400/[0.12]"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-[10px] font-medium text-slate-700">
          This preview is interactive — test the activity before creating it.
        </p>
      </div>

      <div className="border-t border-white/[0.05] bg-white/[0.015] px-5 py-3">
        <div className="flex items-center justify-center gap-2 text-[10px] font-medium text-slate-700">
          <Sparkles size={11} />
          <span>PlayBear student experience</span>
        </div>
      </div>
    </div>
  );
}

function PreviewHeader() {
  return (
    <div className="flex h-11 items-center gap-1.5 border-b border-white/[0.06] bg-white/[0.025] px-4">
      <span className="h-2.5 w-2.5 rounded-full bg-red-400/50" />
      <span className="h-2.5 w-2.5 rounded-full bg-amber-300/50" />
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/50" />

      <div className="ml-3 flex h-6 flex-1 items-center rounded-md border border-white/[0.05] bg-black/10 px-3">
        <span className="text-[9px] font-medium text-slate-700">
          playbear.app / preview
        </span>
      </div>
    </div>
  );
}
