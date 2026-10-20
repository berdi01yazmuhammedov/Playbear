export interface AnagramItem {
  id: string;
  word: string;
  hint?: string;
}

export interface AnagramDraft {
  title: string;
  instructions: string;
  items: AnagramItem[];
}

export interface AnagramGameState {
  currentIndex: number;
  answers: string[];
  correctCount: number;
  attempts: number;
}