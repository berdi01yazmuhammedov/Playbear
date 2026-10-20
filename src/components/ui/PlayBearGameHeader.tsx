import { ArrowLeft, Home, Sparkles } from "lucide-react";
import { PlayBearButton } from "./PlayBearButton";

interface PlayBearGameHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onHome?: () => void;
}

export function PlayBearGameHeader({
  title,
  subtitle,
  onBack,
  onHome,
}: PlayBearGameHeaderProps) {
  return (
    <header className="relative z-10 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-8 sm:py-4">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          {onBack && (
            <PlayBearButton
              variant="ghost"
              onClick={onBack}
              aria-label="Edit activity"
              className="h-10 min-h-10 w-10 shrink-0 rounded-xl p-0"
              icon={<ArrowLeft size={18} />}
            >
              <span className="sr-only">Edit activity</span>
            </PlayBearButton>
          )}

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-950 shadow-lg">
              <Sparkles size={17} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{title}</p>

              {subtitle && (
                <p className="truncate text-xs text-slate-500">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {onHome && (
            <PlayBearButton
              variant="ghost"
              onClick={onHome}
              aria-label="Go to library"
              className="h-10 min-h-10 rounded-xl px-3"
              icon={<Home size={16} />}
            >
              <span className="hidden sm:inline">Home</span>
            </PlayBearButton>
          )}

          <div className="hidden items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

            <span className="text-[11px] font-medium text-slate-400">
              PlayBear
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
