import { useState } from "react";
import {
  Check,
  Cloud,
  LoaderCircle,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";

import type { Activity } from "../../types/activity";

import type { SentenceScrambleDraft } from "../../features/sentence-scramble/sentenceScramble.types";

import {
  createEmptySentenceItem,
  draftToSentenceScrambleActivity,
} from "../../features/sentence-scramble/sentenceScramble.creator";

import { SentenceScramblePreview } from "./SentenceScramblePreview";

import { CreatorShell } from "../creator/CreatorShell";
import { CreatorSection } from "../creator/CreatorSection";
import { CreatorInput } from "../creator/CreatorInput";

interface Props {
  draft: SentenceScrambleDraft;
  onDraftChange: (draft: SentenceScrambleDraft) => void;
  onBack: () => void;
  onCreate: (activity: Activity) => void;

  hasSavedDraft?: boolean;
  isSavingDraft?: boolean;
}

export function SentenceScrambleCreator({
  draft,
  onDraftChange,
  onBack,
  onCreate,
  hasSavedDraft = false,
  isSavingDraft = false,
}: Props) {
  const [previewVisible, setPreviewVisible] = useState(false);

  const [showRestoredBanner, setShowRestoredBanner] = useState(hasSavedDraft);

  const validCount = draft.items.filter((item) => item.sentence.trim()).length;

  const canCreate = draft.title.trim().length > 0 && validCount > 0;

  /*
   * --------------------------------------------------
   * DRAFT HELPER
   * --------------------------------------------------
   */

  function updateDraft(
    updater: (current: SentenceScrambleDraft) => SentenceScrambleDraft,
  ) {
    setShowRestoredBanner(false);

    onDraftChange(updater(draft));
  }

  /*
   * --------------------------------------------------
   * SENTENCE ACTIONS
   * --------------------------------------------------
   */

  function updateItem(
    id: string,
    changes: Partial<SentenceScrambleDraft["items"][number]>,
  ) {
    updateDraft((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id
          ? {
              ...item,
              ...changes,
            }
          : item,
      ),
    }));
  }

  function addSentence() {
    updateDraft((current) => ({
      ...current,
      items: [...current.items, createEmptySentenceItem(current.items.length)],
    }));
  }

  function removeSentence(id: string) {
    updateDraft((current) => {
      if (current.items.length <= 1) {
        return current;
      }

      return {
        ...current,
        items: current.items.filter((item) => item.id !== id),
      };
    });
  }

  function createActivity() {
    if (!canCreate) {
      return;
    }

    onCreate(draftToSentenceScrambleActivity(draft));
  }

  return (
    <CreatorShell
      eyebrow="Sentence scramble"
      title="Build a sentence-order activity."
      description="Add complete sentences and PlayBear turns them into an interactive word-order challenge."
      accent="cyan"
      onBack={onBack}
      onCreate={createActivity}
      canCreate={canCreate}
      previewVisible={previewVisible}
      onTogglePreview={() => setPreviewVisible((current) => !current)}
      preview={<SentenceScramblePreview draft={draft} />}
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
                    Your unfinished sentence scramble activity was restored
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
          description="Give students clear context before they start."
          count={`${validCount} ${validCount === 1 ? "sentence" : "sentences"}`}
        >
          <div className="space-y-5">
            <CreatorInput
              label="Activity title"
              value={draft.title}
              onChange={(event) =>
                updateDraft((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Daily routines"
            />

            <CreatorInput
              label="Instructions"
              value={draft.instructions}
              onChange={(event) =>
                updateDraft((current) => ({
                  ...current,
                  instructions: event.target.value,
                }))
              }
              placeholder="Put the words in the correct order."
            />
          </div>
        </CreatorSection>

        {/* ------------------------------------------------ */}
        {/* SENTENCES */}
        {/* ------------------------------------------------ */}

        <CreatorSection
          title="Sentences"
          description="Each sentence becomes one round of the game."
          count={`${validCount} ${validCount === 1 ? "sentence" : "sentences"}`}
        >
          <div className="space-y-3">
            {draft.items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/[0.06] bg-black/10 p-4 transition hover:border-white/[0.1] sm:p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-[10px] font-bold text-slate-500">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">
                        Sentence {index + 1}
                      </p>

                      <p className="text-[11px] text-slate-700">
                        One word-order round
                      </p>
                    </div>
                  </div>

                  {draft.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSentence(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-700 transition hover:bg-red-400/[0.08] hover:text-red-300"
                      aria-label={`Remove sentence ${index + 1}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                {/* SENTENCE */}

                <label className="block">
                  <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Sentence
                  </span>

                  <textarea
                    value={item.sentence}
                    onChange={(event) =>
                      updateItem(item.id, {
                        sentence: event.target.value,
                      })
                    }
                    rows={3}
                    placeholder="She goes to school every day."
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-black/10 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-300/25 focus:bg-white/[0.04] focus:ring-2 focus:ring-cyan-300/[0.05]"
                  />
                </label>

                {/* HINT */}

                <label className="mt-4 block">
                  <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Hint
                    <span className="ml-1 font-normal normal-case tracking-normal text-slate-700">
                      optional
                    </span>
                  </span>

                  <input
                    value={item.hint ?? ""}
                    onChange={(event) =>
                      updateItem(item.id, {
                        hint: event.target.value,
                      })
                    }
                    placeholder="Think about daily routines."
                    className="w-full rounded-xl border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-300/25 focus:bg-white/[0.04]"
                  />
                </label>
              </div>
            ))}
          </div>

          {/* ADD SENTENCE */}

          <button
            type="button"
            onClick={addSentence}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/[0.1] py-4 text-sm font-bold text-slate-500 transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.025] hover:text-cyan-300"
          >
            <Plus size={17} />
            Add another sentence
          </button>
        </CreatorSection>

        {/* ------------------------------------------------ */}
        {/* VALIDATION */}
        {/* ------------------------------------------------ */}

        {!canCreate && (
          <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.035] p-4">
            <p className="text-xs font-bold text-amber-200">Almost ready</p>

            <div className="mt-2 space-y-1 text-xs text-amber-200/50">
              {!draft.title.trim() && <p>• Add an activity title</p>}

              {validCount === 0 && <p>• Add at least one sentence</p>}
            </div>
          </div>
        )}
      </div>
    </CreatorShell>
  );
}
