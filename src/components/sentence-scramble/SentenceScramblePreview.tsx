import { useMemo, useState } from "react";
import { Check, RotateCcw, Sparkles } from "lucide-react";

import type { SentenceScrambleDraft } from "../../features/sentence-scramble/sentenceScramble.types";

import {
  normalizeSentence,
  shuffleTokens,
  tokenizeSentence,
} from "../../features/sentence-scramble/sentenceScramble.creator";

interface Props {
  draft: SentenceScrambleDraft;
}

export function SentenceScramblePreview({ draft }: Props) {
  const items = draft.items.filter((item) => item.sentence.trim());

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
    "idle",
  );

  const current = items[currentIndex];

  const tokens = useMemo(() => {
    if (!current) return [];

    return tokenizeSentence(current.sentence);
  }, [current?.id, current?.sentence]);

  const shuffledTokens = useMemo(() => {
    return shuffleTokens(tokens);
  }, [current?.id, current?.sentence]);

  const selectedTokens = selectedIds
    .map((id) => tokens.find((token) => token.id === id))
    .filter(Boolean);

  function chooseWord(id: string) {
    if (feedback !== "idle") return;

    setSelectedIds((currentIds) => [...currentIds, id]);
  }

  function removeWord(id: string) {
    if (feedback !== "idle") return;

    setSelectedIds((currentIds) =>
      currentIds.filter((currentId) => currentId !== id),
    );
  }

  function clear() {
    setSelectedIds([]);
    setFeedback("idle");
  }

  function checkAnswer() {
    if (!current || selectedIds.length === 0) {
      return;
    }

    const answer = selectedTokens.map((token) => token?.text).join(" ");

    if (normalizeSentence(answer) === normalizeSentence(current.sentence)) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
  }

  function nextSentence() {
    setCurrentIndex((value) => (value + 1) % items.length);

    setSelectedIds([]);
    setFeedback("idle");
  }

  if (!current) {
    return (
      <PreviewShell>
        <div className="flex min-h-[460px] flex-col items-center justify-center px-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-slate-600">
            <Sparkles size={23} />
          </div>

          <h3 className="mt-5 text-sm font-bold text-white">
            Your preview will appear here
          </h3>

          <p className="mt-2 max-w-xs text-xs leading-5 text-slate-600">
            Add a sentence to see the student experience.
          </p>
        </div>
      </PreviewShell>
    );
  }

  return (
    <PreviewShell>
      {/* Browser header */}

      <div className="border-b border-white/[0.05] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              {draft.title || "Untitled activity"}
            </p>

            <p className="mt-1 truncate text-xs text-slate-600">
              {draft.instructions || "Put the words in the correct order."}
            </p>
          </div>

          <div className="shrink-0 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[9px] font-bold text-slate-600">
            {currentIndex + 1} / {items.length}
          </div>
        </div>
      </div>

      <div className="px-5 py-6">
        <div className="mb-6 text-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
            Student preview
          </span>

          <h3 className="mt-2 text-lg font-black text-white">
            Build the sentence
          </h3>

          <p className="mt-1 text-[11px] text-slate-600">
            Tap the words in the correct order.
          </p>
        </div>

        {/* Answer area */}

        <div className="rounded-2xl border border-white/[0.06] bg-black/10 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-700">
              Your sentence
            </span>

            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={clear}
                className="text-[9px] font-bold text-slate-600 transition hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex min-h-[74px] flex-wrap content-start gap-2">
            {selectedTokens.length === 0 ? (
              <div className="flex w-full items-center justify-center text-[10px] text-slate-700">
                Tap words below
              </div>
            ) : (
              selectedTokens.map((token, index) => (
                <button
                  key={token!.id}
                  type="button"
                  onClick={() => removeWord(token!.id)}
                  className="animate-[sentenceWordIn_220ms_cubic-bezier(.16,1,.3,1)] rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-2 text-[11px] font-bold text-cyan-100 transition-all hover:-translate-y-0.5 hover:bg-cyan-300/[0.12] active:scale-95"
                  style={{
                    animationDelay: `${index * 20}ms`,
                  }}
                >
                  {token!.text}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Word bank */}

        <div className="mt-5">
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-700">
            Word bank
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {shuffledTokens.map((token) => {
              const selected = selectedIds.includes(token.id);

              return (
                <button
                  key={token.id}
                  type="button"
                  disabled={selected || feedback !== "idle"}
                  onClick={() => chooseWord(token.id)}
                  className={[
                    "rounded-xl border px-3 py-2 text-[11px] font-bold transition-all duration-200",
                    selected
                      ? "scale-90 border-white/[0.02] bg-white/[0.01] text-transparent opacity-20"
                      : "border-white/[0.08] bg-white/[0.045] text-slate-100 hover:-translate-y-1 hover:border-white/[0.15] hover:bg-white/[0.08] active:scale-95",
                  ].join(" ")}
                >
                  {token.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}

        <div className="mt-6">
          {feedback === "idle" && (
            <button
              type="button"
              disabled={!selectedIds.length}
              onClick={checkAnswer}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-[11px] font-bold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Check size={13} />
              Check answer
            </button>
          )}

          {feedback === "correct" && (
            <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-200">Perfect!</p>

                  <p className="mt-0.5 text-[10px] text-emerald-300/50">
                    The sentence is correct.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={nextSentence}
                  className="rounded-lg bg-emerald-400 px-3 py-2 text-[10px] font-bold text-emerald-950 transition hover:bg-emerald-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {feedback === "incorrect" && (
            <div className="rounded-xl border border-red-400/15 bg-red-400/[0.06] p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-red-200">Not quite</p>

                  <p className="mt-0.5 text-[10px] text-red-300/50">
                    Try arranging the words again.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clear}
                  className="flex items-center gap-1.5 rounded-lg border border-red-300/10 px-3 py-2 text-[10px] font-bold text-red-200 transition hover:bg-red-400/10"
                >
                  <RotateCcw size={12} />
                  Try again
                </button>
              </div>
            </div>
          )}
        </div>

        {items.length > 1 && (
          <button
            type="button"
            onClick={nextSentence}
            className="mt-5 block w-full text-center text-[9px] font-bold text-slate-700 transition hover:text-slate-400"
          >
            Try another sentence →
          </button>
        )}
      </div>

      <div className="border-t border-white/[0.05] px-5 py-3 text-center text-[9px] text-slate-700">
        <Sparkles size={10} className="mr-1 inline" />
        PlayBear student experience
      </div>

      <style>{`
        @keyframes sentenceWordIn {
          from {
            opacity: 0;
            transform: translateY(6px) scale(.9);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </PreviewShell>
  );
}

function PreviewShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-slate-950 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
      <div className="flex h-10 items-center gap-1.5 border-b border-white/[0.06] bg-white/[0.025] px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/40" />

        <div className="ml-3 flex h-5 flex-1 items-center rounded-md border border-white/[0.05] bg-black/10 px-2.5 text-[8px] text-slate-700">
          playbear.app / activity
        </div>
      </div>

      {children}
    </div>
  );
}
