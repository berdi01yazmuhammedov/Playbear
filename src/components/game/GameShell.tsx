import type { ReactNode } from "react";
import { ArrowLeft, House } from "lucide-react";

interface GameShellProps {
  children: ReactNode;
  onHome?: () => void;
  onBack?: () => void;
  backLabel?: string;
}

export function GameShell({
  children,
  onHome,
  onBack,
  backLabel = "Edit",
}: GameShellProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-4 text-slate-100 sm:px-6 sm:py-6">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl">
        {(onHome || onBack) && (
          <header className="mb-4 flex min-h-12 items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              {onHome && (
                <button
                  type="button"
                  onClick={onHome}
                  className="flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-slate-300 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  aria-label="Go to home"
                >
                  <House size={16} />
                  <span>Home</span>
                </button>
              )}

              <div className="hidden h-5 w-px bg-white/10 sm:block" />

              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-bold text-white">
                  PlayBear
                </p>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">
                  Interactive activity
                </p>
              </div>
            </div>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-slate-300 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                <ArrowLeft size={16} />
                <span>{backLabel}</span>
              </button>
            )}
          </header>
        )}

        {children}
      </div>
    </main>
  );
}
