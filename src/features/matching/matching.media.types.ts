export type MatchingContentType =
  | "text"
  | "image";

export interface MatchingSide {
  type: MatchingContentType;
  value: string;
  alt?: string;
}

export interface MatchingMediaPair {
  id: string;
  left: MatchingSide;
  right: MatchingSide;
}