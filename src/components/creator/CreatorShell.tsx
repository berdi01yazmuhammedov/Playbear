import type { ReactNode } from "react";
import { ArrowLeft, Check, ChevronDown, Eye, Sparkles } from "lucide-react";

interface CreatorShellProps {
  eyebrow: string;
  title: string;
  description: string;
  accent?: "violet" | "cyan" | "blue";
  onBack: () => void;
  onCreate: () => void;
  canCreate: boolean;
  previewVisible: boolean;
  onTogglePreview: () => void;
  children: ReactNode;
  preview: ReactNode;
  previewLabel?: string;
  createLabel?: string;
}

const accentStyles = {
  violet: {
    badge: "border-violet-300/10 bg-violet-300/[0.06] text-violet-200",
    dot: "bg-violet-400",
    glow: "bg-violet-500/[0.055]",
    line: "from-violet-400/0 via-violet-400/30 to-violet-400/0",
    icon: "border-violet-300/10 bg-violet-300/[0.06] text-violet-200",
  },

  cyan: {
    badge: "border-cyan-300/10 bg-cyan-300/[0.06] text-cyan-200",
    dot: "bg-cyan-400",
    glow: "bg-cyan-500/[0.05]",
    line: "from-cyan-400/0 via-cyan-400/30 to-cyan-400/0",
    icon: "border-cyan-300/10 bg-cyan-300/[0.06] text-cyan-200",
  },

  blue: {
    badge: "border-blue-300/10 bg-blue-300/[0.06] text-blue-200",
    dot: "bg-blue-400",
    glow: "bg-blue-500/[0.05]",
    line: "from-blue-400/0 via-blue-400/30 to-blue-400/0",
    icon: "border-blue-300/10 bg-blue-300/[0.06] text-blue-200",
  },
};

export function CreatorShell({
  eyebrow,
  title,
  description,
  accent = "violet",
  onBack,
  onCreate,
  canCreate,
  previewVisible,
  onTogglePreview,
  children,
  preview,
  previewLabel = "Live preview",
  createLabel = "Create activity",
}: CreatorShellProps) {
  const styles = accentStyles[accent];

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white selection:bg-white/10">
      {/* ================================================== */}
      {/* AMBIENT BACKGROUND */}
      {/* ================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={[
            "absolute -left-52 -top-48 h-[520px] w-[520px]",
            "rounded-full blur-[140px]",
            styles.glow,
          ].join(" ")}
        />

        <div className="absolute -right-64 top-[8%] h-[650px] w-[650px] rounded-full bg-violet-500/[0.04] blur-[160px]" />

        <div className="absolute -bottom-72 left-[20%] h-[600px] w-[600px] rounded-full bg-sky-500/[0.025] blur-[150px]" />
      </div>

      {/* Very subtle top edge */}
      <div
        className={[
          "pointer-events-none fixed left-0 right-0 top-0 z-[60] h-px",
          "bg-gradient-to-r",
          styles.line,
        ].join(" ")}
      />

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/[0.055] bg-slate-950/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-3 px-3.5 sm:h-[72px] sm:px-6 lg:px-8">
          {/* Back / Brand */}

          <button
            type="button"
            onClick={onBack}
            className="group flex min-w-0 items-center gap-2.5 rounded-2xl p-1.5 pr-3 transition hover:bg-white/[0.035] focus:outline-none focus:ring-2 focus:ring-white/10 sm:gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-slate-400 transition-all group-hover:border-white/[0.14] group-hover:bg-white/[0.055] group-hover:text-white sm:h-10 sm:w-10">
              <ArrowLeft
                size={17}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />
            </div>

            <div className="hidden min-w-0 text-left xs:block sm:block">
              <p className="truncate text-sm font-black tracking-tight text-white">
                PlayBear
              </p>

              <p className="truncate text-[10px] font-medium text-slate-600">
                Activity creator
              </p>
            </div>
          </button>

          {/* Actions */}

          <div className="flex items-center gap-2">
            {/* Preview */}

            <button
              type="button"
              onClick={onTogglePreview}
              aria-expanded={previewVisible}
              className={[
                "inline-flex min-h-10 items-center justify-center gap-2",
                "rounded-xl border",
                "border-white/[0.08] bg-white/[0.035]",
                "px-3 text-xs font-bold text-slate-400",
                "transition-all",
                "hover:border-white/[0.12] hover:bg-white/[0.065] hover:text-white",
                "active:scale-[0.98]",
                "focus:outline-none focus:ring-2 focus:ring-white/10",
                previewVisible
                  ? "border-white/[0.12] bg-white/[0.07] text-white"
                  : "",
              ].join(" ")}
            >
              <Eye size={15} />

              <span className="hidden sm:inline">
                {previewVisible ? "Hide preview" : "Preview"}
              </span>

              <ChevronDown
                size={13}
                className={[
                  "hidden transition-transform sm:block",
                  previewVisible ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>

            {/* Create */}

            <button
              type="button"
              onClick={onCreate}
              disabled={!canCreate}
              className={[
                "inline-flex min-h-10 items-center justify-center gap-2",
                "rounded-xl px-3.5 sm:px-4",
                "text-xs font-bold transition-all",
                "active:scale-[0.98]",
                "focus:outline-none focus:ring-2 focus:ring-white/10",
                canCreate
                  ? "bg-white text-slate-950 shadow-lg shadow-white/[0.07] hover:-translate-y-0.5 hover:bg-slate-100"
                  : "cursor-not-allowed bg-white/[0.08] text-slate-600",
              ].join(" ")}
            >
              <Check size={15} />

              <span className="hidden sm:inline">{createLabel}</span>

              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================================================== */}
      {/* MAIN */}
      {/* ================================================== */}

      <main className="relative z-10 mx-auto w-full max-w-7xl px-3.5 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-9 lg:px-8 lg:pt-10">
        {/* ================================================== */}
        {/* HEADING */}
        {/* ================================================== */}

        <div className="mb-7 max-w-3xl sm:mb-9">
          {/* Eyebrow */}

          <div
            className={[
              "mb-4 inline-flex items-center gap-2 rounded-full",
              "border px-3 py-1.5",
              styles.badge,
            ].join(" ")}
          >
            <span
              className={["h-1.5 w-1.5 rounded-full", styles.dot].join(" ")}
            />

            <span className="text-[9px] font-black uppercase tracking-[0.2em] sm:text-[10px]">
              {eyebrow}
            </span>
          </div>

          {/* Title */}

          <h1 className="max-w-2xl text-[2rem] font-black leading-[1.08] tracking-[-0.035em] text-white sm:text-4xl lg:text-[2.7rem]">
            {title}
          </h1>

          {/* Description */}

          <p className="mt-3 max-w-2xl text-[13px] leading-6 text-slate-500 sm:mt-3.5 sm:text-[15px] sm:leading-6">
            {description}
          </p>
        </div>

        {/* ================================================== */}
        {/* MOBILE PREVIEW */}
        {/* ================================================== */}

        <div
          className={[
            "mb-6 lg:hidden",
            previewVisible ? "block" : "hidden",
          ].join(" ")}
        >
          <div className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.018] shadow-2xl shadow-black/20">
            {/* Preview header */}

            <div className="flex items-center justify-between border-b border-white/[0.055] px-4 py-3.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                  {previewLabel}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-700">
                <Sparkles size={11} />

                <span>Interactive</span>
              </div>
            </div>

            {/* Preview */}

            <div className="p-3 sm:p-4">{preview}</div>
          </div>
        </div>

        {/* ================================================== */}
        {/* WORKSPACE */}
        {/* ================================================== */}

        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-7 xl:grid-cols-[minmax(0,1fr)_440px] xl:gap-8">
          {/* Editor */}

          <section className="min-w-0">{children}</section>

          {/* Desktop Preview */}

          <aside className="hidden min-w-0 lg:sticky lg:top-[92px] lg:block lg:self-start">
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">
                  {previewLabel}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-700">
                <Sparkles size={11} />

                <span>Interactive</span>
              </div>
            </div>

            <div className="min-w-0">{preview}</div>
          </aside>
        </div>
      </main>

      {/* ================================================== */}
      {/* MOBILE BOTTOM ACTION BAR */}
      {/* ================================================== */}

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-3 lg:hidden">
        <div className="pointer-events-auto mx-auto flex max-w-lg items-center gap-2 rounded-2xl border border-white/[0.08] bg-slate-900/90 p-2 shadow-2xl shadow-black/40 backdrop-blur-2xl">
          {/* Mobile preview */}

          <button
            type="button"
            onClick={onTogglePreview}
            className={[
              "flex min-h-11 flex-1 items-center justify-center gap-2",
              "rounded-xl border border-white/[0.06]",
              "bg-white/[0.035]",
              "text-xs font-bold transition",
              "active:scale-[0.98]",
              previewVisible ? "text-white" : "text-slate-400",
            ].join(" ")}
          >
            <Eye size={15} />

            {previewVisible ? "Hide preview" : "Preview"}
          </button>

          {/* Mobile create */}

          <button
            type="button"
            onClick={onCreate}
            disabled={!canCreate}
            className={[
              "flex min-h-11 flex-[1.25] items-center justify-center gap-2",
              "rounded-xl px-4",
              "text-xs font-black transition",
              "active:scale-[0.98]",
              canCreate
                ? "bg-white text-slate-950 shadow-lg shadow-white/[0.08]"
                : "cursor-not-allowed bg-white/[0.08] text-slate-600",
            ].join(" ")}
          >
            <Check size={15} />

            {createLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
