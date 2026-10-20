interface MatchFeedbackProps {
  type: "correct" | "incorrect" | null;
}

export function MatchFeedback({
  type,
}: MatchFeedbackProps) {
  if (!type) {
    return (
      <p className="flex min-h-6 items-center justify-center text-sm font-medium text-slate-500">
        Choose a word and its match.
      </p>
    );
  }

  if (type === "correct") {
    return (
      <p
        className="flex min-h-6 items-center justify-center text-sm font-semibold text-emerald-400"
        role="status"
      >
        <span className="mr-1.5 text-base">✓</span>
        Nice match!
      </p>
    );
  }

  return (
    <p
      className="flex min-h-6 items-center justify-center text-sm font-semibold text-rose-400"
      role="status"
    >
      Not quite — try again.
    </p>
  );
}