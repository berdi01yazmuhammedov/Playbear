import type { Activity } from "../../types/activity";
import type { MatchingLayout } from "./matching.types";
import type { MatchingSide } from "./matching.media.types";

export interface MatchingDraftItem {
  id: string;
  left: MatchingSide;
  right: MatchingSide;
}

export interface MatchingDraft {
  title: string;
  instructions: string;
  items: MatchingDraftItem[];
  layout: MatchingLayout;
}

export function createEmptyPair(index: number): MatchingDraftItem {
  return {
    id: `pair-${Date.now()}-${index}`,
    left: {
      type: "text",
      value: "",
    },
    right: {
      type: "text",
      value: "",
    },
  };
}

export function createInitialMatchingDraft(): MatchingDraft {
  return {
    title: "",
    instructions: "",
    items: [createEmptyPair(0), createEmptyPair(1)],
    layout: "grid",
  };
}

export function draftToActivity(draft: MatchingDraft): Activity {
  return {
    id: `activity-${Date.now()}`,
    type: "matching",
    title: draft.title.trim() || "Untitled matching game",
    instructions:
      draft.instructions.trim() || "Match each item with its correct answer.",
    items: draft.items
      .filter((item) => item.left.value.trim() && item.right.value.trim())
      .map((item) => ({
        id: item.id,

        // Keep these for backward compatibility.
        prompt: item.left.value.trim(),
        answer: item.right.value.trim(),

        // New media-aware content.
        promptContent: {
          type: item.left.type,
          value: item.left.value.trim(),
          alt: item.left.alt?.trim() || undefined,
        },

        answerContent: {
          type: item.right.type,
          value: item.right.value.trim(),
          alt: item.right.alt?.trim() || undefined,
        },
      })),
  };
}

export function parsePairs(input: string): MatchingDraftItem[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const separators = ["|", "—", "–", ":", "="];

      for (const separator of separators) {
        const separatorIndex = line.indexOf(separator);

        if (separatorIndex > 0) {
          const prompt = line.slice(0, separatorIndex).trim();

          const answer = line.slice(separatorIndex + separator.length).trim();

          if (prompt && answer) {
            return {
              id: `quick-${Date.now()}-${index}`,
              left: {
                type: "text",
                value: prompt,
              },
              right: {
                type: "text",
                value: answer,
              },
            };
          }
        }
      }

      const hyphenMatch = line.match(/^(.+?)\s+-\s+(.+)$/);

      if (hyphenMatch) {
        return {
          id: `quick-${Date.now()}-${index}`,
          left: {
            type: "text",
            value: hyphenMatch[1].trim(),
          },
          right: {
            type: "text",
            value: hyphenMatch[2].trim(),
          },
        };
      }

      return null;
    })
    .filter((item): item is MatchingDraftItem => item !== null);
}
