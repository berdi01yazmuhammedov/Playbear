import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  Check,
  Cloud,
  LoaderCircle,
  Plus,
  RotateCcw,
  Trash2,
  WandSparkles,
  X,
} from "lucide-react";

import type { Activity } from "../../types/activity";
import type { AnagramDraft } from "../../features/anagram/anagram.types";

import {
  createEmptyAnagramItem,
  draftToAnagramActivity,
} from "../../features/anagram/anagram.creator";

import { AnagramCreatorPreview } from "./AnagramCreatorPreview";

import { CreatorShell } from "../creator/CreatorShell";
import { CreatorSection } from "../creator/CreatorSection";
import { CreatorInput } from "../creator/CreatorInput";

interface AnagramCreatorProps {
  draft: AnagramDraft;
  onDraftChange: Dispatch<SetStateAction<AnagramDraft>>;
  onBack: () => void;
  onCreate: (activity: Activity) => void;

  hasSavedDraft?: boolean;
  isSavingDraft?: boolean;
}

export function AnagramCreator({
  draft,
  onDraftChange,
  onBack,
  onCreate,
  hasSavedDraft = false,
  isSavingDraft = false,
}: AnagramCreatorProps) {
  const [previewVisible, setPreviewVisible] = useState(false);

  const [showRestoredBanner, setShowRestoredBanner] = useState(hasSavedDraft);

  /*
   * --------------------------------------------------
   * WORDS / VALIDATION
   * --------------------------------------------------
   */

  const words = draft.items.map((item) => item.word.trim()).filter(Boolean);

  const duplicateWords = useMemo(() => {
    const normalized = words.map((word) => word.toLocaleLowerCase());

    return new Set(
      normalized.filter((word, index) => normalized.indexOf(word) !== index),
    );
  }, [words]);

  const hasDuplicates = duplicateWords.size > 0;

  const canCreate =
    draft.title.trim().length > 0 && words.length >= 2 && !hasDuplicates;

  /*
   * --------------------------------------------------
   * DRAFT HELPERS
   * --------------------------------------------------
   */

  function updateDraft(updater: (current: AnagramDraft) => AnagramDraft) {
    setShowRestoredBanner(false);

    onDraftChange(updater);
  }

  function updateItem(id: string, field: "word" | "hint", value: string) {
    updateDraft((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  }

  function addItem() {
    updateDraft((current) => ({
      ...current,
      items: [...current.items, createEmptyAnagramItem(current.items.length)],
    }));
  }

  function removeItem(id: string) {
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

  function handleCreate() {
    if (!canCreate) {
      return;
    }

    onCreate(draftToAnagramActivity(draft));
  }

  return (
    <CreatorShell
      eyebrow="Anagram"
      title="Build an anagram activity."
      description="Add words and optional hints. PlayBear turns them into a fast letter-unscrambling game for your students."
      accent="cyan"
      onBack={onBack}
      onCreate={handleCreate}
      canCreate={canCreate}
      previewVisible={previewVisible}
      onTogglePreview={() => setPreviewVisible((current) => !current)}
      preview={<AnagramCreatorPreview draft={draft} />}
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
                    Your unfinished anagram activity was restored automatically.
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
        >
          <div className="space-y-5">
            <CreatorInput
              id="anagram-title"
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
              id="anagram-instructions"
              label="Instructions"
              value={draft.instructions}
              onChange={(event) =>
                updateDraft((current) => ({
                  ...current,
                  instructions: event.target.value,
                }))
              }
              placeholder="Unscramble the letters to make a word."
            />
          </div>
        </CreatorSection>

        {/* ------------------------------------------------ */}
        {/* WORDS */}
        {/* ------------------------------------------------ */}

        <CreatorSection
          title="Words"
          description="Each word becomes one round."
          count={`${words.length} ${words.length === 1 ? "word" : "words"}`}
        >
          <div className="space-y-3">
            {draft.items.map((item, index) => {
              const normalizedWord = item.word.trim().toLocaleLowerCase();

              const isDuplicate =
                normalizedWord.length > 0 && duplicateWords.has(normalizedWord);

              return (
                <div
                  key={item.id}
                  className={[
                    "rounded-2xl border p-4 transition-all sm:p-5",
                    isDuplicate
                      ? "border-red-400/20 bg-red-400/[0.025]"
                      : "border-white/[0.06] bg-black/10 hover:border-white/[0.1]",
                  ].join(" ")}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-[10px] font-bold text-slate-500">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">
                          Word {index + 1}
                        </p>

                        <p className="text-[11px] text-slate-700">
                          One unscrambling round
                        </p>
                      </div>
                    </div>

                    {draft.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-700 transition hover:bg-red-400/[0.08] hover:text-red-300"
                        aria-label={`Remove word ${index + 1}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* WORD */}

                    <div>
                      <label
                        htmlFor={`word-${item.id}`}
                        className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500"
                      >
                        Word
                      </label>

                      <input
                        id={`word-${item.id}`}
                        value={item.word}
                        onChange={(event) =>
                          updateItem(item.id, "word", event.target.value)
                        }
                        placeholder="APPLE"
                        className={[
                          "w-full rounded-xl border bg-black/10",
                          "px-4 py-3 text-sm font-bold uppercase",
                          "tracking-wide text-white outline-none",
                          "placeholder:font-normal placeholder:tracking-normal",
                          "placeholder:text-slate-700 transition",
                          isDuplicate
                            ? "border-red-400/30 focus:border-red-400/40"
                            : "border-white/[0.08] focus:border-cyan-300/25",
                        ].join(" ")}
                      />

                      {isDuplicate && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-red-300">
                          <X size={13} />
                          This word has already been added.
                        </p>
                      )}
                    </div>

                    {/* HINT */}

                    <div>
                      <label
                        htmlFor={`hint-${item.id}`}
                        className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500"
                      >
                        Hint
                        <span className="ml-1 font-normal normal-case tracking-normal text-slate-700">
                          optional
                        </span>
                      </label>

                      <input
                        id={`hint-${item.id}`}
                        value={item.hint ?? ""}
                        onChange={(event) =>
                          updateItem(item.id, "hint", event.target.value)
                        }
                        placeholder="A fruit"
                        className="w-full rounded-xl border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300/20 focus:bg-white/[0.04] placeholder:text-slate-700"
                      />

                      <p className="mt-2 text-[11px] text-slate-700">
                        Students can reveal this during the game.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ADD WORD */}

          <button
            type="button"
            onClick={addItem}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/[0.1] py-4 text-sm font-bold text-slate-500 transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.025] hover:text-cyan-300"
          >
            <Plus size={17} />
            Add another word
          </button>
        </CreatorSection>

        {/* ------------------------------------------------ */}
        {/* VALIDATION */}
        {/* ------------------------------------------------ */}

        {!canCreate && (
          <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.035] p-4">
            <div className="flex gap-3">
              <WandSparkles
                size={15}
                className="mt-0.5 shrink-0 text-amber-300"
              />

              <div>
                <p className="text-xs font-bold text-amber-200">Almost ready</p>

                <div className="mt-2 space-y-1 text-xs text-amber-200/50">
                  {!draft.title.trim() && <p>• Add an activity title</p>}

                  {words.length < 2 && <p>• Add at least 2 words</p>}

                  {hasDuplicates && <p>• Remove duplicate words</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CreatorShell>
  );
}
