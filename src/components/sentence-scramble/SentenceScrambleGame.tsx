import { useEffect, useMemo, useState } from "react";

import {
  Check,
  Eraser,
  Home,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

import type { Activity } from "../../types/activity";

import {
  normalizeSentence,
  shuffleTokens,
  tokenizeSentence,
} from "../../features/sentence-scramble/sentenceScramble.creator";

import type { SentenceToken } from "../../features/sentence-scramble/sentenceScramble.types";

import { PlayBearButton } from "../ui/PlayBearButton";
import { PlayBearProgress } from "../ui/PlayBearProgress";
import { PlayBearGameHeader } from "../ui/PlayBearGameHeader";
import { PlayBearGameBackground } from "../ui/PlayBearGameBackground";

interface Props {
  activity: Activity;
  onBack?: () => void;
  onHome?: () => void;
}

type Feedback = "idle" | "correct" | "incorrect";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] px-3 py-4 sm:px-5 sm:py-5">
      <p className="text-2xl font-black text-white sm:text-3xl">{value}</p>

      <p className="mt-1 text-[11px] font-medium text-slate-600 sm:text-xs">
        {label}
      </p>
    </div>
  );
}

function Results({
  activity,
  correct,
  attempts,
  onAgain,
  onHome,
}: {
  activity: Activity;
  correct: number;
  attempts: number;
  onAgain: () => void;
  onHome: () => void;
}) {
  const total = activity.items.length;

  const accuracy = total ? Math.round((correct / total) * 100) : 0;

  const heading =
    accuracy === 100
      ? "Perfect!"
      : accuracy >= 80
        ? "Great work!"
        : accuracy >= 50
          ? "Nice effort!"
          : "Keep practicing!";

  return (
    <PlayBearGameBackground>
      <PlayBearGameHeader title={activity.title} subtitle="Activity complete" />

      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-2xl items-center px-4 py-10 sm:px-8 sm:py-12">
        <div className="w-full text-center">
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
            <div className="absolute inset-0 rounded-[2rem] bg-cyan-400/10 blur-3xl" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-200 shadow-[0_20px_60px_rgba(34,211,238,0.08)] sm:h-20 sm:w-20">
              <Trophy size={32} />
            </div>
          </div>

          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-700">
            Complete
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:mt-3 sm:text-5xl">
            {heading}
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            You solved{" "}
            <span className="font-bold text-slate-300">{correct}</span> of{" "}
            <span className="font-bold text-slate-300">{total}</span> sentences
            correctly.
          </p>

          <div className="mx-auto mt-7 grid max-w-md grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3">
            <Stat value={`${accuracy}%`} label="Accuracy" />

            <Stat value={`${attempts}`} label="Attempts" />
          </div>

          <div className="mx-auto mt-7 flex max-w-md flex-col gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
            <PlayBearButton
              fullWidth
              onClick={onAgain}
              icon={<RotateCcw size={16} />}
            >
              Play again
            </PlayBearButton>

            <PlayBearButton
              fullWidth
              variant="secondary"
              onClick={onHome}
              icon={<Home size={16} />}
            >
              Library
            </PlayBearButton>
          </div>
        </div>
      </main>
    </PlayBearGameBackground>
  );
}

function TokenButton({
  token,
  selected,
  onClick,
}: {
  token: SentenceToken;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={selected}
      onClick={onClick}
      className={[
        "min-h-11 max-w-full rounded-xl border px-3.5 py-2.5 text-sm font-bold",
        "break-words transition-all duration-200 sm:px-4 sm:py-3",
        "focus:outline-none focus:ring-2 focus:ring-cyan-300/20",
        selected
          ? "scale-90 border-white/[0.02] bg-white/[0.01] text-transparent opacity-15"
          : "border-white/[0.08] bg-white/[0.045] text-slate-100 hover:-translate-y-1 hover:border-white/[0.16] hover:bg-white/[0.08] active:scale-95",
      ].join(" ")}
    >
      {token.text}
    </button>
  );
}

export function SentenceScrambleGame({ activity, onBack, onHome }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [feedback, setFeedback] = useState<Feedback>("idle");

  const [attempts, setAttempts] = useState(0);

  const [correctCount, setCorrectCount] = useState(0);

  const [showHint, setShowHint] = useState(false);

  const [shake, setShake] = useState(false);

  const current = activity.items[currentIndex];

  const tokens = useMemo(() => {
    if (!current) {
      return [];
    }

    return tokenizeSentence(current.prompt);
  }, [current?.id, current?.prompt]);

  const shuffledTokens = useMemo(() => {
    return shuffleTokens(tokens);
  }, [current?.id, current?.prompt]);

  const selectedTokens = selectedIds
    .map((id) => tokens.find((token) => token.id === id))
    .filter(Boolean) as SentenceToken[];

  const answer = selectedTokens.map((token) => token.text).join(" ");

  function selectToken(token: SentenceToken) {
    if (feedback !== "idle" || selectedIds.includes(token.id)) {
      return;
    }

    setSelectedIds((value) => [...value, token.id]);
  }

  function removeToken(id: string) {
    if (feedback !== "idle") {
      return;
    }

    setSelectedIds((value) => value.filter((item) => item !== id));
  }

  function clear() {
    if (feedback !== "idle") {
      return;
    }

    setSelectedIds([]);
  }

  function checkAnswer() {
    if (!current || selectedIds.length === 0) {
      return;
    }

    setAttempts((value) => value + 1);

    const isCorrect =
      normalizeSentence(answer) === normalizeSentence(current.prompt);

    if (isCorrect) {
      setCorrectCount((value) => value + 1);

      setFeedback("correct");

      return;
    }

    setFeedback("incorrect");

    setShake(true);

    window.setTimeout(() => setShake(false), 450);
  }

  function next() {
    setCurrentIndex((value) => value + 1);

    setSelectedIds([]);
    setFeedback("idle");
    setShowHint(false);
    setShake(false);
  }

  function retry() {
    setSelectedIds([]);
    setFeedback("idle");
    setShake(false);
  }

  function restart() {
    setCurrentIndex(0);
    setSelectedIds([]);
    setFeedback("idle");
    setAttempts(0);
    setCorrectCount(0);
    setShowHint(false);
    setShake(false);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!current) {
        return;
      }

      if (feedback !== "idle") {
        if (event.key === "Enter") {
          event.preventDefault();

          if (feedback === "correct") {
            next();
          } else {
            retry();
          }
        }

        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();

        const last = selectedIds.at(-1);

        if (last) {
          removeToken(last);
        }

        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        clear();

        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        checkAnswer();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [current, feedback, selectedIds]);

  if (activity.items.length === 0) {
    return (
      <PlayBearGameBackground>
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
          <div className="w-full max-w-md rounded-3xl border border-white/[0.07] bg-white/[0.035] p-6 text-center sm:p-8">
            <Sparkles className="mx-auto text-slate-600" size={25} />

            <h2 className="mt-4 text-xl font-bold text-white">
              Nothing to play yet
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Add some sentences first.
            </p>

            {onHome && (
              <div className="mt-6">
                <PlayBearButton
                  fullWidth
                  onClick={onHome}
                  icon={<Home size={16} />}
                >
                  Back to library
                </PlayBearButton>
              </div>
            )}
          </div>
        </div>
      </PlayBearGameBackground>
    );
  }

  if (currentIndex >= activity.items.length) {
    return (
      <Results
        activity={activity}
        correct={correctCount}
        attempts={attempts}
        onAgain={restart}
        onHome={onHome ?? onBack ?? (() => {})}
      />
    );
  }

  return (
    <PlayBearGameBackground>
      <PlayBearGameHeader
        title={activity.title}
        subtitle={activity.instructions}
        onBack={onBack}
        onHome={onHome}
      />

      <main className="mx-auto max-w-4xl px-4 py-7 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <PlayBearProgress
            current={currentIndex}
            total={activity.items.length}
            label="Your progress"
          />

          <div className="mt-7 text-center sm:mt-8">
            <span className="inline-flex items-center rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1.5 text-[11px] font-semibold text-slate-500 sm:text-xs">
              Sentence {currentIndex + 1}
            </span>

            <h1 className="mt-4 text-2xl font-black tracking-tight text-white sm:mt-5 sm:text-3xl">
              Build the sentence
            </h1>

            <p className="mt-2 text-xs text-slate-600 sm:text-sm">
              Tap the words in the correct order.
            </p>
          </div>

          <section
            className={[
              "mt-7 rounded-[1.5rem] border border-white/[0.07] bg-white/[0.035] p-3.5 shadow-[0_30px_100px_rgba(0,0,0,0.25)] sm:mt-9 sm:rounded-[2rem] sm:p-8",
              shake ? "animate-[sentenceShake_420ms_ease-in-out]" : "",
            ].join(" ")}
          >
            <div className="min-h-[135px] rounded-2xl border border-white/[0.05] bg-black/10 p-3.5 sm:min-h-[145px] sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-700 sm:text-[10px]">
                  Your sentence
                </p>

                {selectedIds.length > 0 && (
                  <button
                    type="button"
                    onClick={clear}
                    className="flex min-h-8 shrink-0 items-center gap-1.5 rounded-lg px-2 text-[10px] font-bold text-slate-600 transition hover:bg-white/[0.04] hover:text-white"
                  >
                    <Eraser size={12} />
                    Clear
                  </button>
                )}
              </div>

              <div className="flex min-h-[78px] flex-wrap content-start gap-1.5 sm:gap-2">
                {selectedTokens.length === 0 ? (
                  <div className="flex w-full items-center justify-center py-5 text-center text-[11px] text-slate-700 sm:text-xs">
                    Tap words below to build your sentence
                  </div>
                ) : (
                  selectedTokens.map((token, index) => (
                    <button
                      key={token.id}
                      type="button"
                      onClick={() => removeToken(token.id)}
                      className="animate-[sentenceTileIn_220ms_cubic-bezier(.16,1,.3,1)] max-w-full break-words rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] px-2.5 py-2 text-xs font-bold text-cyan-100 transition-all hover:-translate-y-1 hover:bg-cyan-300/[0.12] active:scale-95 sm:px-3.5 sm:py-2.5 sm:text-sm"
                      style={{
                        animationDelay: `${index * 18}ms`,
                      }}
                    >
                      {token.text}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6 sm:mt-7">
              <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-700 sm:text-[10px]">
                Word bank
              </p>

              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2.5">
                {shuffledTokens.map((token) => (
                  <TokenButton
                    key={token.id}
                    token={token}
                    selected={selectedIds.includes(token.id)}
                    onClick={() => selectToken(token)}
                  />
                ))}
              </div>
            </div>

            {current.answer && showHint && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-300/10 bg-amber-300/[0.05] p-3.5 sm:mt-6 sm:p-4">
                <Lightbulb
                  size={16}
                  className="mt-0.5 shrink-0 text-amber-200"
                />

                <div className="min-w-0">
                  <p className="text-xs font-bold text-amber-100">Hint</p>

                  <p className="mt-1 break-words text-xs leading-5 text-amber-200/60">
                    {current.answer}
                  </p>
                </div>
              </div>
            )}

            {feedback === "idle" && (
              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-7 sm:grid-cols-[auto_auto_1fr]">
                <PlayBearButton
                  variant="ghost"
                  disabled={!selectedIds.length}
                  onClick={clear}
                  icon={<Eraser size={15} />}
                  className="w-full"
                >
                  Clear
                </PlayBearButton>

                <PlayBearButton
                  variant="secondary"
                  disabled={!current.answer}
                  onClick={() => setShowHint((value) => !value)}
                  icon={<Lightbulb size={15} />}
                  className="w-full"
                >
                  {showHint ? "Hide hint" : "Hint"}
                </PlayBearButton>

                <div className="col-span-2 sm:col-span-1">
                  <PlayBearButton
                    disabled={!selectedIds.length}
                    onClick={checkAnswer}
                    icon={<Check size={15} />}
                    className="w-full"
                  >
                    Check answer
                  </PlayBearButton>
                </div>
              </div>
            )}

            {feedback === "correct" && (
              <div className="mt-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-3.5 sm:mt-7 sm:p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                      <Check size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-emerald-200">
                        Correct!
                      </p>

                      <p className="mt-0.5 text-xs text-emerald-300/50">
                        Excellent word order.
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto">
                    <PlayBearButton fullWidth onClick={next}>
                      {currentIndex + 1 < activity.items.length
                        ? "Next"
                        : "Results"}
                    </PlayBearButton>
                  </div>
                </div>
              </div>
            )}

            {feedback === "incorrect" && (
              <div className="mt-6 rounded-2xl border border-red-400/15 bg-red-400/[0.06] p-3.5 sm:mt-7 sm:p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
                      <X size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-red-200">
                        Not quite
                      </p>

                      <p className="mt-0.5 text-xs text-red-300/50">
                        Try arranging the words again.
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto">
                    <PlayBearButton
                      fullWidth
                      variant="danger"
                      onClick={retry}
                      icon={<RotateCcw size={14} />}
                    >
                      Try again
                    </PlayBearButton>
                  </div>
                </div>
              </div>
            )}
          </section>

          <p className="mt-5 hidden text-center text-[10px] text-slate-700 sm:block">
            Enter checks your answer · Backspace removes the last word · Escape
            clears
          </p>

          <p className="mt-5 text-center text-[10px] text-slate-700 sm:hidden">
            Tap a selected word to remove it
          </p>
        </div>
      </main>
    </PlayBearGameBackground>
  );
}
