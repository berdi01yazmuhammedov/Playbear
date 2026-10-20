import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Check, Cloud, LoaderCircle, RotateCcw } from "lucide-react";

import {
  createEmptyPair,
  draftToActivity,
  parsePairs,
  type MatchingDraft,
} from "../../features/matching/matching.creator";

import type { MatchingLayout } from "../../features/matching/matching.types";

import { MatchingMediaPairEditor } from "./MatchingMediaPairEditor";
import { MatchingQuickInput } from "./MatchingQuickInput";
import { MatchingCreatorPreview } from "./MatchingCreatorPreview";

import { CreatorShell } from "../creator/CreatorShell";
import { CreatorSection } from "../creator/CreatorSection";
import { CreatorInput } from "../creator/CreatorInput";

interface MatchingCreatorProps {
  draft: MatchingDraft;
  onDraftChange: Dispatch<SetStateAction<MatchingDraft>>;
  onBack: () => void;
  onCreate: (
    activity: ReturnType<typeof draftToActivity>,
    layout: MatchingLayout,
  ) => void;

  hasSavedDraft?: boolean;
  isSavingDraft?: boolean;
}

export function MatchingCreator({
  draft,
  onDraftChange,
  onBack,
  onCreate,
  hasSavedDraft = false,
  isSavingDraft = false,
}: MatchingCreatorProps) {
  const [previewVisible, setPreviewVisible] = useState(false);

  /*
   * --------------------------------------------------
   * DRAFT RESTORE STATE
   * --------------------------------------------------
   */

  const [showRestoredBanner, setShowRestoredBanner] = useState(hasSavedDraft);

  /*
   * --------------------------------------------------
   * VALIDATION
   * --------------------------------------------------
   */

  const completedPairs = useMemo(
    () =>
      draft.items.filter(
        (item) => item.left.value.trim() && item.right.value.trim(),
      ).length,
    [draft.items],
  );

  const incompletePairs = useMemo(
    () =>
      draft.items.filter((item) => {
        const hasLeft = Boolean(item.left.value.trim());

        const hasRight = Boolean(item.right.value.trim());

        return hasLeft !== hasRight;
      }),
    [draft.items],
  );

  const duplicatePrompts = useMemo(() => {
    const prompts = draft.items
      .map((item) => item.left.value.trim().toLowerCase())
      .filter(Boolean);

    return new Set(
      prompts.filter((prompt, index) => prompts.indexOf(prompt) !== index),
    );
  }, [draft.items]);

  const duplicateAnswers = useMemo(() => {
    const answers = draft.items
      .map((item) => item.right.value.trim().toLowerCase())
      .filter(Boolean);

    return new Set(
      answers.filter((answer, index) => answers.indexOf(answer) !== index),
    );
  }, [draft.items]);

  const hasErrors =
    incompletePairs.length > 0 ||
    duplicatePrompts.size > 0 ||
    duplicateAnswers.size > 0;

  const canCreate =
    draft.title.trim().length > 0 && completedPairs >= 2 && !hasErrors;

  /*
   * --------------------------------------------------
   * DRAFT UPDATE HELPERS
   * --------------------------------------------------
   */

  function updateSide(
    id: string,
    side: "left" | "right",
    value: MatchingDraft["items"][number]["left"],
  ) {
    setShowRestoredBanner(false);

    onDraftChange((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id
          ? {
              ...item,
              [side]: value,
            }
          : item,
      ),
    }));
  }

  function updateDraft(updater: (current: MatchingDraft) => MatchingDraft) {
    setShowRestoredBanner(false);

    onDraftChange(updater);
  }

  function addPair() {
    updateDraft((current) => ({
      ...current,
      items: [...current.items, createEmptyPair(current.items.length)],
    }));
  }

  function removePair(id: string) {
    updateDraft((current) => {
      if (current.items.length <= 2) {
        return current;
      }

      return {
        ...current,
        items: current.items.filter((item) => item.id !== id),
      };
    });
  }

  function addQuickPairs(input: string) {
    const parsed = parsePairs(input);

    if (parsed.length === 0) {
      return;
    }

    updateDraft((current) => {
      const existingComplete = current.items.filter(
        (item) => item.left.value.trim() || item.right.value.trim(),
      );

      return {
        ...current,
        items: [...existingComplete, ...parsed],
      };
    });
  }

  function changeLayout(layout: MatchingLayout) {
    updateDraft((current) => ({
      ...current,
      layout,
    }));
  }

  function handleCreate() {
    if (!canCreate) {
      return;
    }

    onCreate(draftToActivity(draft), draft.layout);
  }

  return (
    <CreatorShell
      eyebrow="Matching"
      title="Build a matching game."
      description="Create pairs your students can connect. Add text or images, choose a play style, and see the activity update instantly."
      accent="violet"
      onBack={onBack}
      onCreate={handleCreate}
      canCreate={canCreate}
      previewVisible={previewVisible}
      onTogglePreview={() => setPreviewVisible((current) => !current)}
      preview={<MatchingCreatorPreview draft={draft} />}
    >
      <div className="space-y-6">
        {/* ------------------------------------------------ */}
        {/* DRAFT STATUS */}
        {/* ------------------------------------------------ */}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isSavingDraft ? (
              <>
                <LoaderCircle
                  size={13}
                  className="animate-spin text-slate-500"
                />

                <span className="text-xs font-medium text-slate-500">
                  Saving draft…
                </span>
              </>
            ) : hasSavedDraft ? (
              <>
                <div className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-300/15 bg-emerald-300/[0.06]">
                  <Check size={11} className="text-emerald-300" />
                </div>

                <span className="text-xs font-medium text-slate-500">
                  Draft saved automatically
                </span>
              </>
            ) : (
              <>
                <Cloud size={13} className="text-slate-600" />

                <span className="text-xs font-medium text-slate-600">
                  Autosave enabled
                </span>
              </>
            )}
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* RESTORED DRAFT */}
        {/* ------------------------------------------------ */}

        {showRestoredBanner && (
          <div className="relative overflow-hidden rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.035]">
            <div className="absolute inset-y-0 left-0 w-1 bg-cyan-300/30" />

            <div className="flex flex-col gap-4 p-4 pl-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.06]">
                  <RotateCcw size={15} className="text-cyan-200" />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-200">
                    Draft restored
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your unfinished matching activity was restored
                    automatically.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRestoredBanner(false)}
                className="shrink-0 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-2 text-xs font-bold text-slate-400 transition hover:border-cyan-300/15 hover:bg-cyan-300/[0.04] hover:text-cyan-200"
              >
                Continue editing
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------ */}
        {/* ACTIVITY DETAILS */}
        {/* ------------------------------------------------ */}

        <CreatorSection
          title="Activity details"
          description="Give your activity a clear identity."
        >
          <div className="space-y-5">
            <CreatorInput
              id="matching-title"
              label="Activity title"
              value={draft.title}
              onChange={(event) =>
                updateDraft((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Food vocabulary"
            />

            <CreatorInput
              id="matching-instructions"
              label="Instructions"
              value={draft.instructions}
              onChange={(event) =>
                updateDraft((current) => ({
                  ...current,
                  instructions: event.target.value,
                }))
              }
              placeholder="Match each word with its meaning."
            />
          </div>
        </CreatorSection>

        {/* ------------------------------------------------ */}
        {/* PLAY STYLE */}
        {/* ------------------------------------------------ */}

        <CreatorSection
          title="Play style"
          description="Choose how students will interact with the cards."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => changeLayout("grid")}
              className={[
                "group rounded-2xl border p-4 text-left",
                "transition-all",
                draft.layout === "grid"
                  ? "border-violet-400/40 bg-violet-400/[0.07] shadow-lg shadow-violet-500/[0.05]"
                  : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.13] hover:bg-white/[0.04]",
              ].join(" ")}
            >
              <div
                className={[
                  "mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-lg",
                  draft.layout === "grid"
                    ? "bg-violet-400/10 text-violet-300"
                    : "bg-white/[0.05] text-slate-500",
                ].join(" ")}
              >
                ▦
              </div>

              <p className="text-sm font-bold text-white">Grid</p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                All cards are shuffled together.
              </p>
            </button>

            <button
              type="button"
              onClick={() => changeLayout("columns")}
              className={[
                "group rounded-2xl border p-4 text-left",
                "transition-all",
                draft.layout === "columns"
                  ? "border-blue-400/40 bg-blue-400/[0.07] shadow-lg shadow-blue-500/[0.05]"
                  : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.13] hover:bg-white/[0.04]",
              ].join(" ")}
            >
              <div
                className={[
                  "mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-lg",
                  draft.layout === "columns"
                    ? "bg-blue-400/10 text-blue-300"
                    : "bg-white/[0.05] text-slate-500",
                ].join(" ")}
              >
                ⇄
              </div>

              <p className="text-sm font-bold text-white">Two columns</p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Words and matches stay separated.
              </p>
            </button>
          </div>
        </CreatorSection>

        {/* ------------------------------------------------ */}
        {/* MATCHING PAIRS */}
        {/* ------------------------------------------------ */}

        <CreatorSection
          title="Matching pairs"
          description="Connect each item with its correct match."
          count={`${completedPairs} ${completedPairs === 1 ? "pair" : "pairs"}`}
        >
          <div className="mb-3 hidden grid-cols-[32px_1fr_1fr_40px] gap-3 px-3 sm:grid">
            <span />

            <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-violet-400">
              Word
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-blue-400">
              Match
            </span>

            <span />
          </div>

          <div className="space-y-3">
            {draft.items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/[0.06] bg-black/10 p-3 sm:p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-[10px] font-bold text-slate-500">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <span className="text-xs font-bold text-slate-500">
                      Pair {index + 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removePair(item.id)}
                    disabled={draft.items.length <= 2}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-700 transition hover:bg-red-400/[0.08] hover:text-red-300 disabled:pointer-events-none disabled:opacity-20"
                    aria-label={`Remove pair ${index + 1}`}
                  >
                    ×
                  </button>
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  <MatchingMediaPairEditor
                    side={item.left}
                    label="Word"
                    onChange={(side) => updateSide(item.id, "left", side)}
                  />

                  <MatchingMediaPairEditor
                    side={item.right}
                    label="Match"
                    onChange={(side) => updateSide(item.id, "right", side)}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addPair}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/[0.1] py-4 text-sm font-bold text-slate-500 transition hover:border-violet-300/25 hover:bg-violet-300/[0.025] hover:text-violet-300"
          >
            <span className="text-lg">+</span>
            Add another pair
          </button>
        </CreatorSection>

        {/* ------------------------------------------------ */}
        {/* QUICK INPUT */}
        {/* ------------------------------------------------ */}

        <MatchingQuickInput onAdd={addQuickPairs} />

        {/* ------------------------------------------------ */}
        {/* VALIDATION */}
        {/* ------------------------------------------------ */}

        {!canCreate && (
          <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.035] p-4">
            <p className="text-xs font-bold text-amber-200">Almost ready</p>

            <div className="mt-2 space-y-1 text-xs text-amber-200/50">
              {!draft.title.trim() && <p>• Add an activity title</p>}

              {completedPairs < 2 && <p>• Add at least 2 complete pairs</p>}

              {incompletePairs.length > 0 && (
                <p>• Complete every partially filled pair</p>
              )}

              {duplicatePrompts.size > 0 && <p>• Remove duplicate words</p>}

              {duplicateAnswers.size > 0 && <p>• Remove duplicate matches</p>}
            </div>
          </div>
        )}
      </div>
    </CreatorShell>
  );
}
