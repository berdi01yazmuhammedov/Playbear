import type { Activity } from "../../types/activity";
import type { AnagramDraft } from "./anagram.types";

export function createEmptyAnagramItem(index: number) {
  return {
    id: `anagram-item-${Date.now()}-${index}`,
    word: "",
    hint: "",
  };
}

export function createInitialAnagramDraft(): AnagramDraft {
  return {
    title: "",
    instructions: "Unscramble the letters to make a word.",
    items: [
      createEmptyAnagramItem(0),
      createEmptyAnagramItem(1),
      createEmptyAnagramItem(2),
    ],
  };
}

export function draftToAnagramActivity(draft: AnagramDraft): Activity {
  return {
    id: `activity-${Date.now()}`,
    type: "anagram",
    title: draft.title.trim(),
    instructions: draft.instructions.trim(),
    items: draft.items
      .filter((item) => item.word.trim())
      .map((item) => ({
        id: item.id,
        prompt: item.word.trim(),
        answer: item.hint?.trim() ?? "",
      })),
  };
}

export function scrambleWord(word: string): string {
  const cleanWord = word.trim();

  if (cleanWord.length < 2) {
    return cleanWord;
  }

  const characters = [...cleanWord];

  const original = cleanWord.toLocaleLowerCase();

  for (let attempt = 0; attempt < 100; attempt++) {
    const shuffled = [...characters];

    for (let index = shuffled.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));

      [shuffled[index], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[index],
      ];
    }

    const result = shuffled.join("");

    if (result.toLocaleLowerCase() !== original) {
      return result;
    }
  }

  // Reliable fallback.
  // Move the first character to the end.
  const rotated = characters.slice(1).join("") + characters[0];

  if (rotated.toLocaleLowerCase() !== original) {
    return rotated;
  }

  // Last resort for words where every character
  // is identical, e.g. "aaa".
  return characters.reverse().join("");
}
