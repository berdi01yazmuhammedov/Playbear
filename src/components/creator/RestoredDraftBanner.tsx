import { RotateCcw, X } from "lucide-react";

interface RestoredDraftBannerProps {
  onDiscard: () => void;
}

export function RestoredDraftBanner({ onDiscard }: RestoredDraftBannerProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.035] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.06]">
          <RotateCcw size={15} className="text-cyan-200" />
        </div>

        <div>
          <p className="text-sm font-bold text-slate-200">Draft restored</p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            We restored your unfinished activity from your previous session.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onDiscard}
        className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-2 text-xs font-bold text-slate-400 transition hover:border-red-300/10 hover:bg-red-300/[0.04] hover:text-red-200"
      >
        <X size={13} />
        Discard draft
      </button>
    </div>
  );
}
