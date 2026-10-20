import type { Activity } from "../types/activity";

const STORAGE_KEY =
  "playenglish.activities";

export function loadActivities(): Activity[] {
  try {
    const stored =
      localStorage.getItem(
        STORAGE_KEY,
      );

    if (!stored) {
      return [];
    }

    const parsed: unknown =
      JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is Activity =>
        Boolean(
          item &&
            typeof item ===
              "object" &&
            "id" in item &&
            "type" in item &&
            "title" in item &&
            "instructions" in
              item &&
            "items" in item,
        ),
    );
  } catch {
    return [];
  }
}

export function saveActivities(
  activities: Activity[],
): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(activities),
    );
  } catch {
    // Ignore storage errors for now.
  }
}

export function clearActivities(): void {
  try {
    localStorage.removeItem(
      STORAGE_KEY,
    );
  } catch {
    // Ignore storage errors for now.
  }
}