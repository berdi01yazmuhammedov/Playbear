import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import {
  Check,
  ChevronRight,
  Eraser,
  Home,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

import type { Activity } from "../../types/activity";

import { scrambleWord } from "../../features/anagram/anagram.creator";

import { PlayBearButton } from "../ui/PlayBearButton";
import { PlayBearProgress } from "../ui/PlayBearProgress";
import { PlayBearGameHeader } from "../ui/PlayBearGameHeader";
import { PlayBearGameBackground } from "../ui/PlayBearGameBackground";

interface AnagramGameProps {
  activity: Activity;
  onBack?: () => void;
  onHome?: () => void;
}

type FeedbackState = "idle" | "correct" | "incorrect";

interface FeedbackMessageProps {
  type: "correct" | "incorrect";
  children: ReactNode;
  action?: ReactNode;
}

function FeedbackMessage({ type, children, action }: FeedbackMessageProps) {
  const isCorrect = type === "correct";

  return (
    <div
      className={[
        "mt-5 overflow-hidden rounded-2xl border px-3.5 py-3 sm:mt-6 sm:px-4",
        "animate-[feedbackIn_250ms_ease-out]",
        isCorrect
          ? "border-emerald-400/20 bg-emerald-400/[0.08]"
          : "border-red-400/20 bg-red-400/[0.07]",
      ].join(" ")}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              isCorrect
                ? "bg-emerald-400/15 text-emerald-300"
                : "bg-red-400/15 text-red-300",
            ].join(" ")}
          >
            {isCorrect ? (
              <Check size={18} strokeWidth={2.5} />
            ) : (
              <X size={18} strokeWidth={2.5} />
            )}
          </div>

          <p
            className={[
              "text-sm font-semibold",
              isCorrect ? "text-emerald-200" : "text-red-200",
            ].join(" ")}
          >
            {children}
          </p>
        </div>

        {action && <div className="w-full sm:w-auto">{action}</div>}
      </div>
    </div>
  );
}

function EmptyState({ onHome }: { onHome?: () => void }) {
  return (
    <PlayBearGameBackground>
      <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-5">
        <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6 text-center shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06] text-slate-400 sm:h-16 sm:w-16">
            <Sparkles size={26} />
          </div>

          <h2 className="text-xl font-bold text-white">Nothing to play yet</h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            This activity does not contain any words.
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

function ResultsScreen({
  activity,
  correctCount,
  attempts,
  onPlayAgain,
  onHome,
}: {
  activity: Activity;
  correctCount: number;
  attempts: number;
  onPlayAgain: () => void;
  onHome: () => void;
}) {
  const total = activity.items.length;

  const percentage = total === 0 ? 0 : Math.round((correctCount / total) * 100);

  const message =
    percentage === 100
      ? "Perfect score!"
      : percentage >= 80
        ? "Great work!"
        : percentage >= 60
          ? "Nice effort!"
          : "Keep practicing!";

  return (
    <PlayBearGameBackground>
      <PlayBearGameHeader title={activity.title} subtitle="Activity complete" />

      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-3xl items-center justify-center px-4 py-10 sm:px-8 sm:py-12">
        <div className="w-full text-center">
          <div className="relative mx-auto mb-7 flex h-24 w-24 items-center justify-center sm:mb-8 sm:h-28 sm:w-28">
            <div className="absolute inset-0 rounded-[2rem] bg-emerald-400/10 blur-2xl" />

            <div className="relative flex h-20 w-20 animate-[resultPop_450ms_cubic-bezier(.16,1,.3,1)] items-center justify-center rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300 shadow-2xl sm:h-24 sm:w-24 sm:rounded-[2rem]">
              <Trophy size={34} strokeWidth={1.8} className="sm:hidden" />
              <Trophy size={42} strokeWidth={1.8} className="hidden sm:block" />
            </div>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-sm">
            Complete
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:mt-3 sm:text-5xl">
            {message}
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
            You solved {correctCount} of {total} words correctly.
          </p>

          <div className="mx-auto mt-7 grid max-w-lg grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] px-3 py-4 sm:px-5 sm:py-5">
              <p className="text-2xl font-black text-white sm:text-3xl">
                {percentage}%
              </p>

              <p className="mt-1 text-[11px] font-medium text-slate-500 sm:text-xs">
                Accuracy
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] px-3 py-4 sm:px-5 sm:py-5">
              <p className="text-2xl font-black text-white sm:text-3xl">
                {attempts}
              </p>

              <p className="mt-1 text-[11px] font-medium text-slate-500 sm:text-xs">
                Attempts
              </p>
            </div>
          </div>

          <div className="mx-auto mt-7 flex max-w-lg flex-col gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
            <PlayBearButton
              fullWidth
              onClick={onPlayAgain}
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
              Back to library
            </PlayBearButton>
          </div>
        </div>
      </main>
    </PlayBearGameBackground>
  );
}

function LetterTile({
  letter,
  index,
  selected,
  onClick,
}: {
  letter: string;
  index: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={selected}
      aria-label={`Letter ${letter}`}
      className={[
        "relative flex h-12 w-10 shrink-0 items-center justify-center rounded-xl",
        "border text-base font-black uppercase sm:h-14 sm:w-12 sm:rounded-2xl sm:text-lg",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-cyan-300/30",
        selected
          ? "pointer-events-none scale-90 border-white/[0.03] bg-white/[0.015] text-transparent opacity-30"
          : "border-white/[0.09] bg-white/[0.055] text-white shadow-lg hover:-translate-y-1 hover:border-white/[0.16] hover:bg-white/[0.09] hover:shadow-xl active:scale-95",
      ].join(" ")}
      style={{
        animationDelay: `${index * 35}ms`,
      }}
    >
      {!selected && (
        <span className="animate-[tileIn_350ms_cubic-bezier(.16,1,.3,1)]">
          {letter}
        </span>
      )}
    </button>
  );
}

function AnswerTile({
  letter,
  index,
  onClick,
}: {
  letter: string;
  index: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Remove ${letter}`}
      className="group flex h-12 w-10 shrink-0 animate-[answerIn_250ms_cubic-bezier(.16,1,.3,1)] items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] text-base font-black uppercase text-cyan-100 shadow-[0_8px_30px_rgba(34,211,238,0.08)] transition-all duration-200 hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-cyan-300/[0.13] active:scale-95 sm:h-14 sm:w-12 sm:rounded-2xl sm:text-lg"
      style={{
        animationDelay: `${index * 20}ms`,
      }}
    >
      <span className="transition-transform duration-200 group-hover:scale-110">
        {letter}
      </span>
    </button>
  );
}

export function AnagramGame({ activity, onBack, onHome }: AnagramGameProps) {
  const items = activity.items;

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState<string[]>([]);

  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const [feedback, setFeedback] = useState<FeedbackState>("idle");

  const [attempts, setAttempts] = useState(0);

  const [correctCount, setCorrectCount] = useState(0);

  const [showHint, setShowHint] = useState(false);

  const [shake, setShake] = useState(false);

  const [celebrate, setCelebrate] = useState(false);

  const currentItem = items[currentIndex];

  const scrambledLetters = useMemo(() => {
    if (!currentItem) {
      return [];
    }

    return [...scrambleWord(currentItem.prompt)];
  }, [currentIndex, currentItem?.id, currentItem?.prompt]);

  const normalizedAnswer = answer.join("").toLocaleLowerCase();

  const normalizedCorrect = currentItem?.prompt.toLocaleLowerCase() ?? "";

  const isComplete = currentIndex >= items.length;

  function selectLetter(letter: string, index: number) {
    if (feedback !== "idle") {
      return;
    }

    if (selectedIndices.includes(index)) {
      return;
    }

    setAnswer((current) => [...current, letter]);

    setSelectedIndices((current) => [...current, index]);
  }

  function removeLetter(answerIndex: number) {
    if (feedback !== "idle") {
      return;
    }

    setAnswer((current) => current.filter((_, index) => index !== answerIndex));

    setSelectedIndices((current) =>
      current.filter((_, index) => index !== answerIndex),
    );
  }

  function clearAnswer() {
    if (feedback !== "idle") {
      return;
    }

    setAnswer([]);
    setSelectedIndices([]);
  }

  function submitAnswer() {
    if (!currentItem || feedback !== "idle") {
      return;
    }

    if (answer.length !== currentItem.prompt.length) {
      setShake(true);

      window.setTimeout(() => {
        setShake(false);
      }, 450);

      return;
    }

    setAttempts((current) => current + 1);

    if (normalizedAnswer === normalizedCorrect) {
      setCorrectCount((current) => current + 1);

      setFeedback("correct");
      setCelebrate(true);

      window.setTimeout(() => {
        setCelebrate(false);
      }, 800);

      return;
    }

    setFeedback("incorrect");

    setShake(true);

    window.setTimeout(() => {
      setShake(false);
    }, 450);
  }

  function continueToNext() {
    setAnswer([]);
    setSelectedIndices([]);
    setFeedback("idle");
    setShowHint(false);
    setShake(false);

    setCurrentIndex((current) => current + 1);
  }

  function retryCurrent() {
    setAnswer([]);
    setSelectedIndices([]);
    setFeedback("idle");
    setShowHint(false);
    setShake(false);
  }

  function restart() {
    setCurrentIndex(0);
    setAnswer([]);
    setSelectedIndices([]);
    setFeedback("idle");
    setAttempts(0);
    setCorrectCount(0);
    setShowHint(false);
    setShake(false);
    setCelebrate(false);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isComplete || !currentItem) {
        return;
      }

      if (feedback !== "idle") {
        if (event.key === "Enter") {
          event.preventDefault();

          if (feedback === "correct") {
            continueToNext();
          } else {
            retryCurrent();
          }
        }

        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();

        if (answer.length > 0) {
          removeLetter(answer.length - 1);
        }

        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        clearAnswer();

        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        submitAnswer();

        return;
      }

      if (event.key.length === 1 && /^[a-zA-Z]$/.test(event.key)) {
        const targetLetter = event.key.toLocaleLowerCase();

        const nextIndex = scrambledLetters.findIndex(
          (letter, index) =>
            letter.toLocaleLowerCase() === targetLetter &&
            !selectedIndices.includes(index),
        );

        if (nextIndex !== -1) {
          selectLetter(scrambledLetters[nextIndex], nextIndex);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    answer,
    currentItem,
    feedback,
    isComplete,
    scrambledLetters,
    selectedIndices,
  ]);

  if (items.length === 0) {
    return <EmptyState onHome={onHome} />;
  }

  if (isComplete) {
    return (
      <ResultsScreen
        activity={activity}
        correctCount={correctCount}
        attempts={attempts}
        onPlayAgain={restart}
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
        <div className="mx-auto max-w-2xl">
          <PlayBearProgress
            current={currentIndex}
            total={items.length}
            label="Your progress"
          />

          <div className="mt-7 text-center sm:mt-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1.5 text-[11px] font-semibold text-slate-400 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              Word {currentIndex + 1}
            </div>

            <h1 className="mt-4 text-2xl font-black tracking-tight text-white sm:mt-5 sm:text-3xl">
              Unscramble the word
            </h1>

            <p className="mt-2 text-xs text-slate-500 sm:text-sm">
              {showHint && currentItem.answer
                ? currentItem.answer
                : "Tap the letters in the correct order"}
            </p>
          </div>

          <div
            className={[
              "mt-7 rounded-[1.5rem] border border-white/[0.07]",
              "bg-white/[0.035] p-3.5 shadow-2xl backdrop-blur-xl sm:mt-10 sm:rounded-[2rem] sm:p-8",
              shake ? "animate-[shake_420ms_ease-in-out]" : "",
              celebrate ? "animate-[correctPulse_650ms_ease-out]" : "",
            ].join(" ")}
          >
            <div className="flex min-h-[82px] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.05] bg-black/10 px-2 py-4 sm:min-h-[92px] sm:px-3">
              <div className="flex max-w-full flex-wrap justify-center gap-1.5 sm:gap-2">
                {answer.length === 0 ? (
                  <div className="flex items-center text-center text-xs text-slate-600 sm:text-sm">
                    <span className="hidden sm:inline">
                      Your answer will appear here
                    </span>

                    <span className="sm:hidden">Tap letters below</span>
                  </div>
                ) : (
                  answer.map((letter, index) => (
                    <AnswerTile
                      key={`${letter}-${index}`}
                      letter={letter}
                      index={index}
                      onClick={() => removeLetter(index)}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-1.5 sm:mt-6 sm:gap-2.5">
              {scrambledLetters.map((letter, index) => (
                <LetterTile
                  key={`${letter}-${index}`}
                  letter={letter}
                  index={index}
                  selected={selectedIndices.includes(index)}
                  onClick={() => selectLetter(letter, index)}
                />
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-7 sm:flex sm:flex-row sm:gap-3">
              <PlayBearButton
                variant="ghost"
                onClick={clearAnswer}
                disabled={answer.length === 0 || feedback !== "idle"}
                icon={<Eraser size={16} />}
                className="w-full"
              >
                Clear
              </PlayBearButton>

              <PlayBearButton
                variant="secondary"
                onClick={() => setShowHint((current) => !current)}
                disabled={!currentItem.answer || feedback !== "idle"}
                icon={<Lightbulb size={16} />}
                className="w-full sm:flex-1"
              >
                {showHint ? "Hide hint" : "Show hint"}
              </PlayBearButton>

              <div className="col-span-2 sm:flex-1">
                <PlayBearButton
                  onClick={submitAnswer}
                  disabled={answer.length === 0 || feedback !== "idle"}
                  icon={<Check size={16} />}
                  className="w-full"
                >
                  Check answer
                </PlayBearButton>
              </div>
            </div>

            <div className="mt-5 hidden items-center justify-center gap-4 text-[11px] font-medium text-slate-600 sm:flex">
              <span>
                <kbd className="mr-1 rounded-md border border-white/[0.07] bg-white/[0.04] px-1.5 py-0.5 text-slate-500">
                  Enter
                </kbd>
                check
              </span>

              <span>
                <kbd className="mr-1 rounded-md border border-white/[0.07] bg-white/[0.04] px-1.5 py-0.5 text-slate-500">
                  Backspace
                </kbd>
                remove
              </span>

              <span>
                <kbd className="mr-1 rounded-md border border-white/[0.07] bg-white/[0.04] px-1.5 py-0.5 text-slate-500">
                  Esc
                </kbd>
                clear
              </span>
            </div>

            {feedback === "correct" && (
              <FeedbackMessage
                type="correct"
                action={
                  <PlayBearButton
                    variant="success"
                    fullWidth
                    onClick={continueToNext}
                    icon={<ChevronRight size={16} />}
                  >
                    Continue
                  </PlayBearButton>
                }
              >
                Correct! Great job.
              </FeedbackMessage>
            )}

            {feedback === "incorrect" && (
              <FeedbackMessage
                type="incorrect"
                action={
                  <PlayBearButton
                    variant="danger"
                    fullWidth
                    onClick={retryCurrent}
                    icon={<RotateCcw size={15} />}
                  >
                    Try again
                  </PlayBearButton>
                }
              >
                Not quite. Give it another try.
              </FeedbackMessage>
            )}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-center text-[10px] text-slate-600 sm:text-xs">
            <Sparkles size={13} className="shrink-0" />

            <span>Tap a selected letter to remove it</span>
          </div>
        </div>
      </main>
    </PlayBearGameBackground>
  );
}
