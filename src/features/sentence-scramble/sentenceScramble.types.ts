export interface SentenceScrambleItem {
  id: string;
  sentence: string;
  hint?: string;
}

export interface SentenceScrambleDraft {
  title: string;
  instructions: string;
  items: SentenceScrambleItem[];
}

export interface SentenceToken {
  id: string;
  text: string;
  originalIndex: number;
}
