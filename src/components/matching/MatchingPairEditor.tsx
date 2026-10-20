import type { MatchingDraftItem } from "../../features/matching/matching.creator";
import { MatchingMediaPairEditor } from "./MatchingMediaPairEditor";

interface MatchingPairEditorProps {
  items: MatchingDraftItem[];
  onChange: (
    id: string,
    side: "left" | "right",
    value: MatchingDraftItem["left"],
  ) => void;
  onRemove: (id: string) => void;
}

export function MatchingPairEditor({
  items,
  onChange,
  onRemove,
}: MatchingPairEditorProps) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const hasLeft = Boolean(item.left.value.trim());
        const hasRight = Boolean(item.right.value.trim());

        const incomplete = (hasLeft && !hasRight) || (!hasLeft && hasRight);

        const complete = hasLeft && hasRight;

        return (
          <div
            key={item.id}
            className={[
              "group relative rounded-2xl border p-4 transition-all duration-200",
              incomplete
                ? "border-amber-400/20 bg-amber-400/[0.025]"
                : complete
                  ? "border-white/8 bg-white/[0.035] hover:border-white/15 hover:bg-white/[0.05]"
                  : "border-white/8 bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.04]",
            ].join(" ")}
          >
            <div className="mb-3 flex items-center justify-between">
              <div
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                  complete
                    ? "bg-emerald-400/10 text-emerald-400"
                    : incomplete
                      ? "bg-amber-400/10 text-amber-400"
                      : "bg-white/[0.06] text-slate-500",
                ].join(" ")}
              >
                {complete ? "✓" : String(index + 1).padStart(2, "0")}
              </div>

              <button
                type="button"
                onClick={() => onRemove(item.id)}
                disabled={items.length <= 2}
                aria-label={`Remove pair ${index + 1}`}
                title={
                  items.length <= 2
                    ? "At least two pairs are required"
                    : "Remove pair"
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl text-lg text-slate-600 transition-all hover:bg-rose-500/10 hover:text-rose-400 active:scale-90 disabled:cursor-not-allowed disabled:opacity-20"
              >
                ×
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <MatchingMediaPairEditor
                side={item.left}
                label="Word"
                onChange={(side) => onChange(item.id, "left", side)}
              />

              <MatchingMediaPairEditor
                side={item.right}
                label="Match"
                onChange={(side) => onChange(item.id, "right", side)}
              />
            </div>

            {incomplete && (
              <div className="mt-3 flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-amber-400" />

                <span className="text-[10px] font-medium text-amber-400/70">
                  Complete this pair before playing
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
