import { Check, Cloud, LoaderCircle } from "lucide-react";

interface DraftSaveStatusProps {
  isSaving: boolean;
  hasSavedDraft: boolean;
}

export function DraftSaveStatus({
  isSaving,
  hasSavedDraft,
}: DraftSaveStatusProps) {
  if (isSaving) {
    return (
      <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
        <LoaderCircle size={13} className="animate-spin" />

        <span>Saving draft</span>
      </div>
    );
  }

  if (hasSavedDraft) {
    return (
      <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-300/15 bg-emerald-300/[0.06]">
          <Check size={11} className="text-emerald-300" />
        </div>

        <span>Draft saved</span>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 text-xs text-slate-600 sm:flex">
      <Cloud size={13} />

      <span>Autosave on</span>
    </div>
  );
}
