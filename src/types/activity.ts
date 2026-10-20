export type ActivityType = "matching" | "anagram" | "sentence-scramble";

export type ActivityContentType = "text" | "image";

export interface ActivityContent {
  type: ActivityContentType;
  value: string;
  alt?: string;
}

export interface ActivityItem {
  id: string;

  // Existing text representation.
  // Keep these so old activities continue to work.
  prompt: string;
  answer: string;

  // New optional media representation.
  promptContent?: ActivityContent;
  answerContent?: ActivityContent;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  instructions: string;
  items: ActivityItem[];
}
