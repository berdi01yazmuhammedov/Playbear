import type { ActivityContent, ActivityItem } from "../../types/activity";

export type MatchSide = "prompt" | "answer";

export type MatchingLayout = "grid" | "columns";

export interface MatchingCard {
  id: string;
  pairId: string;
  side: MatchSide;
  content: ActivityContent;
}

export interface MatchingState {
  selectedCardId: string | null;
  matchedPairIds: Set<string>;
  incorrectCardIds: string[];
  attempts: number;
}

export interface MatchingResult {
  correct: boolean;
  completed: boolean;
  score: number;
}

export interface MatchingActivityData {
  items: ActivityItem[];
}
