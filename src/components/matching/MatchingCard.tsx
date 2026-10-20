import type { MatchingCard as MatchingCardType } from "../../features/matching/matching.types";

interface MatchingCardProps {
  card: MatchingCardType;
  selected: boolean;
  matched: boolean;
  incorrect: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function MatchingCard({
  card,
  selected,
  matched,
  incorrect,
  disabled,
  onClick,
}: MatchingCardProps) {
  const isPrompt = card.side === "prompt";

  const ariaLabel =
    card.content.type === "image"
      ? `${isPrompt ? "Word" : "Match"}: ${card.content.alt || "Image"}`
      : `${isPrompt ? "Word" : "Match"}: ${card.content.value}`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || matched}
      aria-label={ariaLabel}
      className={[
        "group relative flex h-36 w-full items-center justify-center overflow-hidden rounded-2xl border p-3 text-center",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        "sm:h-40 sm:p-4",

        matched
          ? [
              "cursor-default",
              "border-emerald-400/20",
              "bg-emerald-400/[0.07]",
              "text-emerald-200",
              "shadow-[0_0_30px_rgba(52,211,153,0.06)]",
            ].join(" ")
          : incorrect
            ? [
                "border-rose-400/40",
                "bg-rose-400/[0.08]",
                "text-rose-200",
                "animate-[card-shake_0.4s_ease-in-out]",
              ].join(" ")
            : selected
              ? [
                  isPrompt
                    ? "border-violet-400/60 bg-violet-500/[0.13]"
                    : "border-blue-400/60 bg-blue-500/[0.13]",
                  "text-white",
                  "shadow-lg",
                  "scale-[1.015]",
                ].join(" ")
              : [
                  "border-white/10",
                  "bg-white/[0.045]",
                  "text-slate-300",
                  "shadow-lg shadow-black/5",
                  "hover:-translate-y-1",
                  "hover:border-white/20",
                  "hover:bg-white/[0.07]",
                  "hover:text-white",
                  "hover:shadow-xl hover:shadow-black/10",
                  "active:translate-y-0 active:scale-[0.985]",
                ].join(" "),

        disabled && !matched && !incorrect ? "cursor-default" : "",
      ].join(" ")}
    >
      {/* Soft hover glow */}
      {!matched && !incorrect && (
        <span
          aria-hidden="true"
          className={[
            "pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-opacity duration-300",
            isPrompt ? "bg-violet-400/10" : "bg-blue-400/10",
            selected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          ].join(" ")}
        />
      )}

      {/* Accent line */}
      {!matched && (
        <span
          aria-hidden="true"
          className={[
            "absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full transition-all duration-300",
            isPrompt ? "bg-violet-400" : "bg-blue-400",
            selected
              ? "w-12 opacity-100"
              : "w-0 opacity-0 group-hover:w-8 group-hover:opacity-60",
          ].join(" ")}
        />
      )}

      {/* Content */}
      <span className="relative z-10 flex h-full w-full items-center justify-center">
        {card.content.type === "image" ? (
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl">
            <img
              src={card.content.value}
              alt={card.content.alt || "Matching image"}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : (
          <span
            className={[
              "max-w-full break-words text-sm font-semibold leading-6 sm:text-[15px]",
              matched ? "line-through decoration-emerald-400/50" : "",
            ].join(" ")}
          >
            {card.content.value}
          </span>
        )}
      </span>

      {/* Matched check */}
      {matched && (
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 flex h-5 w-5 animate-[success-pop_0.3s_ease-out] items-center justify-center rounded-full bg-emerald-400/15 text-[11px] font-bold text-emerald-400"
        >
          ✓
        </span>
      )}

      {/* Incorrect indicator */}
      {incorrect && (
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-rose-400/15 text-[11px] font-bold text-rose-400"
        >
          ×
        </span>
      )}
    </button>
  );
}
