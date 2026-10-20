import { useMemo, useState } from "react";

import type { Activity } from "../../types/activity";

import { shuffle } from "../../utils/shuffle";

import {
  calculateScore,
  createInitialMatchingState,
  isCorrectMatch,
} from "../../features/matching/matching.logic";

import type {
  MatchingCard,
  MatchingLayout,
  MatchingState,
} from "../../features/matching/matching.types";

import { ProgressBar } from "../game/ProgressBar";
import { ScoreBadge } from "../game/ScoreBadge";
import { MatchingCard as Card } from "./MatchingCard";
import { MatchFeedback } from "./MatchFeedback";
import { ResultsScreen } from "./ResultsScreen";
import { PlayBearGameBackground } from "../ui/PlayBearGameBackground";
import { PlayBearGameHeader } from "../ui/PlayBearGameHeader";

interface MatchingGameProps {
  activity: Activity;
  initialLayout?: MatchingLayout;
  onBack?: () => void;
  onHome?: () => void;
}

export function MatchingGame({
  activity,
  initialLayout = "grid",
  onBack,
  onHome,
}: MatchingGameProps) {
  const [layout, setLayout] = useState<MatchingLayout>(initialLayout);
  const [shuffleKey, setShuffleKey] = useState(0);

  const cards = useMemo<MatchingCard[]>(() => {
    const generatedCards = activity.items.flatMap((item) => [
      {
        id: `${item.id}-prompt`,
        pairId: item.id,
        side: "prompt" as const,
        content: item.promptContent ?? {
          type: "text" as const,
          value: item.prompt,
        },
      },
      {
        id: `${item.id}-answer`,
        pairId: item.id,
        side: "answer" as const,
        content: item.answerContent ?? {
          type: "text" as const,
          value: item.answer,
        },
      },
    ]);

    return shuffle(generatedCards);
  }, [activity, shuffleKey]);

  const promptCards = useMemo(
    () => cards.filter((card) => card.side === "prompt"),
    [cards],
  );

  const answerCards = useMemo(
    () => shuffle(cards.filter((card) => card.side === "answer")),
    [cards],
  );

  const [state, setState] = useState<MatchingState>(
    createInitialMatchingState(),
  );

  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );

  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const matchedCount = state.matchedPairIds.size;

  const progress =
    activity.items.length > 0
      ? (matchedCount / activity.items.length) * 100
      : 0;

  function handleCardClick(card: MatchingCard) {
    if (completed || isChecking || state.matchedPairIds.has(card.pairId)) {
      return;
    }

    if (!state.selectedCardId) {
      setState((current) => ({
        ...current,
        selectedCardId: card.id,
        incorrectCardIds: [],
      }));

      setFeedback(null);
      return;
    }

    if (state.selectedCardId === card.id) {
      return;
    }

    const firstCard = cards.find((item) => item.id === state.selectedCardId);

    if (!firstCard) {
      return;
    }

    const correct = isCorrectMatch(firstCard, card);
    const nextAttempts = state.attempts + 1;

    if (correct) {
      const nextMatchedPairs = new Set(state.matchedPairIds);

      nextMatchedPairs.add(card.pairId);

      const nextScore = calculateScore(activity.items.length, nextAttempts);

      const isComplete = nextMatchedPairs.size === activity.items.length;

      setState({
        selectedCardId: null,
        matchedPairIds: nextMatchedPairs,
        incorrectCardIds: [],
        attempts: nextAttempts,
      });

      setFeedback("correct");
      setScore(nextScore);

      if (isComplete) {
        window.setTimeout(() => {
          setCompleted(true);
        }, 550);
      }

      return;
    }

    setState((current) => ({
      ...current,
      selectedCardId: null,
      incorrectCardIds: [firstCard.id, card.id],
      attempts: nextAttempts,
    }));

    setFeedback("incorrect");
    setIsChecking(true);

    window.setTimeout(() => {
      setState((current) => ({
        ...current,
        incorrectCardIds: [],
      }));

      setIsChecking(false);
    }, 700);
  }

  function restart() {
    setState(createInitialMatchingState());
    setFeedback(null);
    setScore(0);
    setCompleted(false);
    setIsChecking(false);
    setShuffleKey((value) => value + 1);
  }

  if (completed) {
    return (
      <ResultsScreen
        activity={activity}
        score={score}
        matchedCount={matchedCount}
        attempts={state.attempts}
        onPlayAgain={restart}
        onBack={onHome ?? onBack ?? (() => {})}
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
      <section className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-8 sm:py-12">
        

        {/* Matching header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400 sm:text-xs">
                  PlayBear
                </p>
              </div>

              <h1 className="break-words text-2xl font-bold tracking-tight text-white sm:text-4xl">
                {activity.title}
              </h1>

              <p className="mt-2.5 max-w-2xl break-words text-sm leading-6 text-slate-400 sm:mt-3 sm:text-base sm:leading-7">
                {activity.instructions}
              </p>
            </div>

            <div className="self-start sm:shrink-0">
              <ScoreBadge score={score} />
            </div>
          </div>
        </header>

        {/* Progress + layout */}
        <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.035] p-3.5 shadow-lg shadow-black/5 sm:mb-6 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">
                    Progress
                  </span>
                </div>

                <ProgressBar
                  current={matchedCount}
                  total={activity.items.length}
                />

                <div className="mt-1 h-px overflow-hidden rounded-full bg-transparent">
                  <div
                    className="h-full bg-violet-400/30 transition-all duration-500 ease-out"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>

              <div className="hidden shrink-0 border-l border-white/10 pl-4 sm:block">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Attempts
                </span>

                <span className="mt-0.5 block text-sm font-bold text-slate-300">
                  {state.attempts}
                </span>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 rounded-xl border border-white/10 bg-slate-950/60 p-1 sm:w-auto">
              <button
                type="button"
                onClick={() => setLayout("grid")}
                className={[
                  "min-h-10 rounded-lg px-3 py-2 text-xs font-semibold transition sm:min-h-0 sm:px-4",
                  layout === "grid"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-200",
                ].join(" ")}
              >
                Grid
              </button>

              <button
                type="button"
                onClick={() => setLayout("columns")}
                className={[
                  "min-h-10 rounded-lg px-3 py-2 text-xs font-semibold transition sm:min-h-0 sm:px-4",
                  layout === "columns"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-200",
                ].join(" ")}
              >
                Two columns
              </button>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="mb-4 min-h-[32px] sm:mb-5">
          <MatchFeedback type={feedback} />
        </div>

        {/* Cards */}
        <div
          className={[
            "transition-opacity duration-200",
            isChecking ? "opacity-95" : "opacity-100",
          ].join(" ")}
        >
          {layout === "grid" ? (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  className="min-w-0 animate-[card-enter_0.35s_ease-out_both]"
                  style={{
                    animationDelay: `${Math.min(index * 35, 250)}ms`,
                  }}
                >
                  <Card
                    card={card}
                    selected={state.selectedCardId === card.id}
                    matched={state.matchedPairIds.has(card.pairId)}
                    incorrect={state.incorrectCardIds.includes(card.id)}
                    disabled={
                      isChecking ||
                      (state.selectedCardId !== null &&
                        state.selectedCardId === card.id)
                    }
                    onClick={() => handleCardClick(card)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-6">
              <div className="min-w-0 space-y-2.5 sm:space-y-4">
                <div className="flex items-center gap-2 px-1.5 sm:px-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />

                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-400 sm:text-xs">
                    Words
                  </div>
                </div>

                {promptCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="min-w-0 animate-[card-enter_0.35s_ease-out_both]"
                    style={{
                      animationDelay: `${Math.min(index * 40, 250)}ms`,
                    }}
                  >
                    <Card
                      card={card}
                      selected={state.selectedCardId === card.id}
                      matched={state.matchedPairIds.has(card.pairId)}
                      incorrect={state.incorrectCardIds.includes(card.id)}
                      disabled={
                        isChecking ||
                        (state.selectedCardId !== null &&
                          state.selectedCardId === card.id)
                      }
                      onClick={() => handleCardClick(card)}
                    />
                  </div>
                ))}
              </div>

              <div className="min-w-0 space-y-2.5 sm:space-y-4">
                <div className="flex items-center gap-2 px-1.5 sm:px-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />

                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-400 sm:text-xs">
                    Matches
                  </div>
                </div>

                {answerCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="min-w-0 animate-[card-enter_0.35s_ease-out_both]"
                    style={{
                      animationDelay: `${Math.min(index * 40, 250)}ms`,
                    }}
                  >
                    <Card
                      card={card}
                      selected={state.selectedCardId === card.id}
                      matched={state.matchedPairIds.has(card.pairId)}
                      incorrect={state.incorrectCardIds.includes(card.id)}
                      disabled={
                        isChecking ||
                        (state.selectedCardId !== null &&
                          state.selectedCardId === card.id)
                      }
                      onClick={() => handleCardClick(card)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="hidden text-xs text-slate-600 sm:block">
            Select a word, then choose its matching answer.
          </p>

          <p className="text-center text-[11px] text-slate-600 sm:hidden">
            Select an item, then select its match.
          </p>

          <button
            type="button"
            className="min-h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-400 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08] hover:text-white active:translate-y-0 sm:ml-auto sm:w-auto"
            onClick={restart}
          >
            Restart
          </button>
        </div>
      </section>
    </PlayBearGameBackground>
  );
}
