import type { Activity } from "../../types/activity";
import type {
  SentenceScrambleDraft,
  SentenceToken,
} from "./sentenceScramble.types";

export function createEmptySentenceItem(index: number) {
  return {
    id: `sentence-item-${Date.now()}-${index}`,
    sentence: "",
    hint: "",
  };
}

export function createInitialSentenceScrambleDraft(): SentenceScrambleDraft {
  return {
    title: "",
    instructions: "Put the words in the correct order.",
    items: [
      createEmptySentenceItem(0),
      createEmptySentenceItem(1),
      createEmptySentenceItem(2),
    ],
  };
}

export function draftToSentenceScrambleActivity(
  draft: SentenceScrambleDraft,
): Activity {
  return {
    id: `activity-${Date.now()}`,
    type: "sentence-scramble",
    title: draft.title.trim(),
    instructions: draft.instructions.trim(),
    items: draft.items
      .filter((item) => item.sentence.trim())
      .map((item) => ({
        id: item.id,
        prompt: item.sentence.trim(),
        answer: item.hint?.trim() ?? "",
      })),
  };
}

export function tokenizeSentence(sentence: string): SentenceToken[] {
  const words = sentence.trim().match(/\S+/g) ?? [];

  return words.map((text, index) => ({
    id: `token-${index}-${Date.now()}-${Math.random()}`,
    text,
    originalIndex: index,
  }));
}

export function shuffleTokens(tokens: SentenceToken[]): SentenceToken[] {
  if (tokens.length < 2) {
    return [...tokens];
  }

  const result = [...tokens];

  for (let index = result.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  /*
   * Avoid returning the exact original order.
   */
  const unchanged = result.every(
    (token, index) => token.originalIndex === index,
  );

  if (unchanged) {
    [result[0], result[1]] = [result[1], result[0]];
  }

  return result;
}

export function normalizeSentence(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}
