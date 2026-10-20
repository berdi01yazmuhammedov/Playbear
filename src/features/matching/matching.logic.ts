import type {
  MatchingCard,
  MatchingResult,
  MatchingState,
} from "./matching.types";

export function createInitialMatchingState(): MatchingState {
  return {
    selectedCardId: null,
    matchedPairIds: new Set<string>(),
    incorrectCardIds: [],
    attempts: 0,
  };
}

export function isCardMatched(
  card: MatchingCard,
  state: MatchingState,
): boolean {
  return state.matchedPairIds.has(card.pairId);
}

export function canSelectCard(
  card: MatchingCard,
  state: MatchingState,
): boolean {
  if (isCardMatched(card, state)) {
    return false;
  }

  if (state.selectedCardId === card.id) {
    return false;
  }

  return true;
}

export function isCorrectMatch(
  first: MatchingCard,
  second: MatchingCard,
): boolean {
  return first.pairId === second.pairId;
}

export function calculateScore(
  totalPairs: number,
  attempts: number,
): number {
  if (totalPairs === 0 || attempts === 0) {
    return 0;
  }

  const correctPairs = totalPairs;

  const accuracy = correctPairs / attempts;

  return Math.max(
    0,
    Math.round(accuracy * 100),
  );
}

export function resolveMatch(
  first: MatchingCard,
  second: MatchingCard,
  state: MatchingState,
  totalPairs: number,
): MatchingResult {
  const attempts = state.attempts + 1;
  const correct = isCorrectMatch(first, second);

  if (!correct) {
    return {
      correct: false,
      completed: false,
      score: calculateScore(totalPairs, attempts),
    };
  }

  const matchedPairIds = new Set(state.matchedPairIds);

  matchedPairIds.add(first.pairId);

  const completed =
    matchedPairIds.size === totalPairs;

  return {
    correct: true,
    completed,
    score: calculateScore(totalPairs, attempts),
  };
}