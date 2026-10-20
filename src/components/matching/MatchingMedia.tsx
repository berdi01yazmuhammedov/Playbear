import type { MatchingSide } from "../../features/matching/matching.media.types";

interface MatchingMediaProps {
  content: MatchingSide;
  className?: string;
}

export function MatchingMedia({ content, className = "" }: MatchingMediaProps) {
  if (content.type === "image") {
    return (
      <div
        className={[
          "relative flex items-center justify-center overflow-hidden rounded-xl",
          "border border-white/[0.08]",
          "bg-white/[0.035]",
          className,
        ].join(" ")}
      >
        <img
          src={content.value}
          alt={content.alt || "Matching image"}
          className="block max-h-full max-w-full object-contain"
        />
      </div>
    );
  }

  return (
    <span className={["break-words", className].join(" ")}>
      {content.value}
    </span>
  );
}
