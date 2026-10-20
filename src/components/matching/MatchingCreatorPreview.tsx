import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";

import type { MatchingDraft } from "../../features/matching/matching.creator";
import { MatchingMedia } from "./MatchingMedia";

interface MatchingCreatorPreviewProps {
  draft: MatchingDraft;
}

interface PreviewItem {
  id: string;
  left: {
    type: "text" | "image";
    value: string;
    alt?: string;
  };
  right: {
    type: "text" | "image";
    value: string;
    alt?: string;
  };
}

interface PreviewCard {
  id: string;
  pairId: string;
  side: "left" | "right";
  content: PreviewItem["left"];
}

export function MatchingCreatorPreview({ draft }: MatchingCreatorPreviewProps) {
  const completeItems = useMemo<PreviewItem[]>(
    () =>
      draft.items
        .filter((item) => item.left.value.trim() && item.right.value.trim())
        .slice(0, 8)
        .map((item) => ({
          id: item.id,
          left: item.left,
          right: item.right,
        })),
    [draft.items],
  );

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [incorrectCards, setIncorrectCards] = useState<string[]>([]);

  const cards = useMemo<PreviewCard[]>(() => {
    const generated = completeItems.flatMap((item) => [
      {
        id: `${item.id}-left`,
        pairId: item.id,
        side: "left" as const,
        content: item.left,
      },
      {
        id: `${item.id}-right`,
        pairId: item.id,
        side: "right" as const,
        content: item.right,
      },
    ]);

    return [...generated].sort(() => Math.random() - 0.5);
  }, [completeItems]);

  const matchedCount = matchedPairs.length;

  function reset() {
    setSelectedCard(null);
    setMatchedPairs([]);
    setIncorrectCards([]);
  }

  function handleCardClick(card: PreviewCard) {
    if (matchedPairs.includes(card.pairId) || incorrectCards.length > 0) {
      return;
    }

    if (!selectedCard) {
      setSelectedCard(card.id);
      return;
    }

    if (selectedCard === card.id) {
      return;
    }

    const firstCard = cards.find((item) => item.id === selectedCard);

    if (!firstCard) {
      return;
    }

    const isCorrect =
      firstCard.pairId === card.pairId && firstCard.side !== card.side;

    if (isCorrect) {
      setMatchedPairs((current) => [...current, card.pairId]);

      setSelectedCard(null);
      return;
    }

    setIncorrectCards([firstCard.id, card.id]);

    window.setTimeout(() => {
      setIncorrectCards([]);
      setSelectedCard(null);
    }, 600);
  }

  if (completeItems.length === 0) {
    return (
      <div className="flex h-full min-h-[520px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/20">
        <PreviewHeader draft={draft} />

        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-xl text-slate-600">
            ↔
          </div>

          <h3 className="mt-5 text-sm font-bold text-slate-400">
            Your game will appear here
          </h3>

          <p className="mt-2 max-w-xs text-xs leading-5 text-slate-600">
            Add at least one complete matching pair to play the preview.
          </p>
        </div>

        <PreviewFooter pairCount={0} layout={draft.layout} />
      </div>
    );
  }

  const isComplete = matchedCount === completeItems.length;

  return (
    <div className="flex h-full min-h-[520px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/20">
      <PreviewHeader draft={draft} onReset={reset} />

      <div className="flex-1 overflow-auto p-4 sm:p-5">
        {isComplete ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-2xl">
              ✓
            </div>

            <h3 className="mt-5 text-lg font-bold text-white">Nice work!</h3>

            <p className="mt-2 text-sm text-slate-500">
              You matched all {completeItems.length} pairs.
            </p>

            <button
              type="button"
              onClick={reset}
              className="mt-5 flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <RotateCcw size={15} />
              Play again
            </button>
          </div>
        ) : draft.layout === "columns" ? (
          <ColumnsPreview
            items={completeItems}
            cards={cards}
            selectedCard={selectedCard}
            matchedPairs={matchedPairs}
            incorrectCards={incorrectCards}
            onCardClick={handleCardClick}
          />
        ) : (
          <GridPreview
            cards={cards}
            selectedCard={selectedCard}
            matchedPairs={matchedPairs}
            incorrectCards={incorrectCards}
            onCardClick={handleCardClick}
          />
        )}
      </div>

      <PreviewFooter
        pairCount={completeItems.length}
        matchedCount={matchedCount}
        layout={draft.layout}
      />
    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */

interface PreviewHeaderProps {
  draft: MatchingDraft;
  onReset?: () => void;
}

function PreviewHeader({ draft, onReset }: PreviewHeaderProps) {
  return (
    <div className="border-b border-white/[0.06] bg-white/[0.025] px-5 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-400">
            Live preview
          </p>

          <h2 className="mt-1 truncate text-sm font-bold text-white">
            {draft.title.trim() || "Your matching game"}
          </h2>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

            <span className="text-[10px] font-semibold text-slate-500">
              Playable
            </span>
          </div>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              aria-label="Restart preview"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-500 transition hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">
        {draft.instructions.trim() ||
          "Match each item with its correct answer."}
      </p>
    </div>
  );
}

/* =========================================================
   GRID
========================================================= */

interface GridPreviewProps {
  cards: PreviewCard[];
  selectedCard: string | null;
  matchedPairs: string[];
  incorrectCards: string[];
  onCardClick: (card: PreviewCard) => void;
}

function GridPreview({
  cards,
  selectedCard,
  matchedPairs,
  incorrectCards,
  onCardClick,
}: GridPreviewProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {cards.map((card) => (
        <PreviewCard
          key={card.id}
          card={card}
          selected={selectedCard === card.id}
          matched={matchedPairs.includes(card.pairId)}
          incorrect={incorrectCards.includes(card.id)}
          onClick={() => onCardClick(card)}
        />
      ))}
    </div>
  );
}

/* =========================================================
   COLUMNS
========================================================= */

interface ColumnsPreviewProps {
  items: PreviewItem[];
  cards: PreviewCard[];
  selectedCard: string | null;
  matchedPairs: string[];
  incorrectCards: string[];
  onCardClick: (card: PreviewCard) => void;
}

function ColumnsPreview({
  items,
  cards,
  selectedCard,
  matchedPairs,
  incorrectCards,
  onCardClick,
}: ColumnsPreviewProps) {
  const leftCards = cards.filter((card) => card.side === "left");

  const rightCards = cards
    .filter((card) => card.side === "right")
    .sort(() => Math.random() - 0.5);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <div className="min-w-0 space-y-2.5">
        <p className="px-1 text-[9px] font-bold uppercase tracking-[0.16em] text-violet-400">
          Words
        </p>

        {items.map((item) => {
          const card = leftCards.find(
            (candidate) => candidate.pairId === item.id,
          );

          if (!card) return null;

          return (
            <PreviewCard
              key={card.id}
              card={card}
              selected={selectedCard === card.id}
              matched={matchedPairs.includes(card.pairId)}
              incorrect={incorrectCards.includes(card.id)}
              onClick={() => onCardClick(card)}
            />
          );
        })}
      </div>

      <div className="min-w-0 space-y-2.5">
        <p className="px-1 text-[9px] font-bold uppercase tracking-[0.16em] text-blue-400">
          Matches
        </p>

        {rightCards.map((card) => (
          <PreviewCard
            key={card.id}
            card={card}
            selected={selectedCard === card.id}
            matched={matchedPairs.includes(card.pairId)}
            incorrect={incorrectCards.includes(card.id)}
            onClick={() => onCardClick(card)}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   CARD
========================================================= */

interface PreviewCardProps {
  card: PreviewCard;
  selected: boolean;
  matched: boolean;
  incorrect: boolean;
  onClick: () => void;
}

function PreviewCard({
  card,
  selected,
  matched,
  incorrect,
  onClick,
}: PreviewCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={matched}
      aria-label={`Select ${card.content.value}`}
      className={[
        "flex min-h-[82px] w-full items-center justify-center overflow-hidden rounded-2xl border p-3 text-center transition",
        "focus:outline-none focus:ring-2 focus:ring-violet-400",
        matched
          ? "border-emerald-400/30 bg-emerald-400/[0.08] opacity-60"
          : incorrect
            ? "border-red-400/40 bg-red-400/[0.08]"
            : selected
              ? "border-violet-400/60 bg-violet-400/[0.12] shadow-lg shadow-violet-950/20"
              : "border-white/[0.07] bg-white/[0.035] hover:border-white/[0.16] hover:bg-white/[0.06]",
      ].join(" ")}
    >
      {card.content.type === "image" ? (
        <MatchingMedia
          content={card.content}
          className="h-full min-h-[82px] w-full"
        />
      ) : (
        <span
          className={[
            "break-words text-xs font-semibold leading-5 sm:text-sm",
            matched
              ? "text-emerald-300"
              : selected
                ? "text-white"
                : "text-slate-300",
          ].join(" ")}
        >
          {card.content.value}
        </span>
      )}
    </button>
  );
}

/* =========================================================
   FOOTER
========================================================= */

interface PreviewFooterProps {
  pairCount: number;
  matchedCount?: number;
  layout: MatchingDraft["layout"];
}

function PreviewFooter({
  pairCount,
  matchedCount = 0,
  layout,
}: PreviewFooterProps) {
  return (
    <div className="border-t border-white/[0.06] bg-white/[0.015] px-5 py-3">
      <div className="flex items-center justify-between gap-4 text-[10px]">
        <span className="font-medium text-slate-600">
          {matchedCount > 0
            ? `${matchedCount}/${pairCount} matched`
            : `${pairCount} ${pairCount === 1 ? "pair" : "pairs"}`}
        </span>

        <span className="font-semibold text-slate-700">
          {layout === "grid" ? "Grid" : "Two columns"}
        </span>
      </div>
    </div>
  );
}
