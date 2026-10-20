import { useEffect, useRef, useState } from "react";

type DraftType = "matching" | "anagram" | "sentence-scramble";

interface UseActivityDraftOptions<T> {
  type: DraftType;
  initialDraft: T;
}

interface UseActivityDraftResult<T> {
  draft: T;
  setDraft: React.Dispatch<React.SetStateAction<T>>;
  clearDraft: () => void;
  hasSavedDraft: boolean;
  isSaving: boolean;
  restored: boolean;
  dismissRestored: () => void;
}

const STORAGE_PREFIX = "playbear.draft.";

function getStorageKey(type: DraftType) {
  return `${STORAGE_PREFIX}${type}`;
}

export function useActivityDraft<T>({
  type,
  initialDraft,
}: UseActivityDraftOptions<T>): UseActivityDraftResult<T> {
  const [draft, setDraft] = useState<T>(initialDraft);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [restored, setRestored] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const saveTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimeout.current !== null) {
        window.clearTimeout(saveTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    setIsSaving(true);

    if (saveTimeout.current !== null) {
      window.clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = window.setTimeout(() => {
      try {
        localStorage.setItem(getStorageKey(type), JSON.stringify(draft));

        setHasSavedDraft(true);
        setIsSaving(false);
      } catch {
        setIsSaving(false);
      }
    }, 400);

    return () => {
      if (saveTimeout.current !== null) {
        window.clearTimeout(saveTimeout.current);
      }
    };
  }, [draft, type]);

  function clearDraft() {
    if (saveTimeout.current !== null) {
      window.clearTimeout(saveTimeout.current);
    }

    localStorage.removeItem(getStorageKey(type));

    setDraft(initialDraft);
    setHasSavedDraft(false);
    setRestored(false);
    setIsSaving(false);
  }

  function dismissRestored() {
    setRestored(false);
  }

  return {
    draft,
    setDraft,
    clearDraft,
    hasSavedDraft,
    isSaving,
    restored,
    dismissRestored,
  };
}
