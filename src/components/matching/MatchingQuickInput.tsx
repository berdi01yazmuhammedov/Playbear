import { useMemo, useState } from "react";

interface ParsedPair {
  prompt: string;
  answer: string;
}

interface MatchingQuickInputProps {
  onAdd: (input: string) => void;
}

function parseInput(input: string): ParsedPair[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separators = ["|", "—", "–", ":", "="];

      for (const separator of separators) {
        const index = line.indexOf(separator);

        if (index > 0) {
          const prompt = line.slice(0, index).trim();
          const answer = line.slice(index + separator.length).trim();

          if (prompt && answer) {
            return {
              prompt,
              answer,
            };
          }
        }
      }

      /*
       * Also support a normal hyphen, but only when there
       * are spaces around it so words like "well-known"
       * don't get split accidentally.
       */
      const hyphenMatch = line.match(/^(.+?)\s+-\s+(.+)$/);

      if (hyphenMatch) {
        return {
          prompt: hyphenMatch[1].trim(),
          answer: hyphenMatch[2].trim(),
        };
      }

      return null;
    })
    .filter((pair): pair is ParsedPair => pair !== null);
}

export function MatchingQuickInput({
  onAdd,
}: MatchingQuickInputProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [added, setAdded] = useState(false);

  const parsedPairs = useMemo(
    () => parseInput(input),
    [input],
  );

  const invalidLineCount = useMemo(() => {
    const lines = input
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    return Math.max(lines.length - parsedPairs.length, 0);
  }, [input, parsedPairs.length]);

  const duplicateCount = useMemo(() => {
    const seen = new Set<string>();
    let duplicates = 0;

    for (const pair of parsedPairs) {
      const key = `${pair.prompt.toLowerCase()}::${pair.answer.toLowerCase()}`;

      if (seen.has(key)) {
        duplicates += 1;
      } else {
        seen.add(key);
      }
    }

    return duplicates;
  }, [parsedPairs]);

  function handleAdd() {
    if (parsedPairs.length === 0) {
      return;
    }

    onAdd(input);

    setInput("");
    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1800);
  }

  function handleExample() {
    setInput(
      [
        "apple — a fruit",
        "carrot — a vegetable",
        "bread — a baked food",
        "cheese — a dairy product",
      ].join("\n"),
    );

    setAdded(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025]">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.025]"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/[0.07] text-violet-300">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7h12M4 7h.01M8 12h12M4 12h.01M8 17h12M4 17h.01"
              />
            </svg>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-white">
                Quick add
              </p>

              <span className="rounded-md border border-violet-400/10 bg-violet-400/[0.06] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-300">
                Fast
              </span>
            </div>

            <p className="mt-0.5 truncate text-xs text-slate-600">
              Paste multiple pairs at once
            </p>
          </div>
        </div>

        <span
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-all",
            "group-hover:bg-white/[0.05] group-hover:text-slate-300",
            open ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        >
          ↓
        </span>
      </button>

      {/* Content */}
      {open && (
        <div className="border-t border-white/8 p-5">
          {/* Instructions */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Paste your pairs
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                One pair per line. Separate the word and answer with
                a dash, colon, pipe, or equals sign.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExample}
              className="shrink-0 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold text-slate-500 transition hover:border-white/15 hover:bg-white/[0.05] hover:text-slate-300"
            >
              Use example
            </button>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setAdded(false);
              }}
              placeholder={`apple — a fruit
banana — a yellow fruit
carrot — a vegetable`}
              rows={6}
              spellCheck={false}
              className={[
                "w-full resize-none rounded-2xl border bg-slate-950/70 px-4 py-4 pr-4",
                "font-mono text-sm leading-7 text-slate-200",
                "outline-none transition-all",
                "placeholder:text-slate-700",
                input.length > 0
                  ? "border-violet-400/20 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-400/[0.05]"
                  : "border-white/8 focus:border-violet-400/40 focus:ring-4 focus:ring-violet-400/[0.04]",
              ].join(" ")}
            />

            {input.length > 0 && (
              <div className="pointer-events-none absolute bottom-3 right-3 rounded-lg border border-white/8 bg-slate-950/90 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                {input.split(/\r?\n/).filter((line) => line.trim()).length}{" "}
                lines
              </div>
            )}
          </div>

          {/* Detection status */}
          <div className="mt-4">
            {input.trim() === "" ? (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                Waiting for pairs...
              </div>
            ) : parsedPairs.length > 0 ? (
              <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.035] p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-bold text-emerald-400">
                      ✓
                    </div>

                    <div>
                      <p className="text-xs font-bold text-emerald-400">
                        {parsedPairs.length}{" "}
                        {parsedPairs.length === 1
                          ? "pair"
                          : "pairs"}{" "}
                        detected
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-600">
                        Ready to add to your activity.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {invalidLineCount > 0 && (
                      <span className="rounded-lg border border-amber-400/10 bg-amber-400/[0.04] px-2.5 py-1 text-[10px] font-semibold text-amber-400/80">
                        {invalidLineCount} skipped
                      </span>
                    )}

                    {duplicateCount > 0 && (
                      <span className="rounded-lg border border-amber-400/10 bg-amber-400/[0.04] px-2.5 py-1 text-[10px] font-semibold text-amber-400/80">
                        {duplicateCount} duplicate
                        {duplicateCount === 1 ? "" : "s"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-amber-400/10 bg-amber-400/[0.025] px-3 py-2.5 text-xs text-amber-400/70">
                <span className="font-bold">!</span>
                No complete pairs detected yet.
              </div>
            )}
          </div>

          {/* Preview */}
          {parsedPairs.length > 0 && (
            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                  Preview
                </p>

                <p className="text-[10px] text-slate-700">
                  {parsedPairs.length} pairs
                </p>
              </div>

              <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                {parsedPairs.map((pair, index) => (
                  <div
                    key={`${pair.prompt}-${pair.answer}-${index}`}
                    className="grid grid-cols-[1fr_24px_1fr] items-center gap-2 rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-300">
                        {pair.prompt}
                      </p>
                    </div>

                    <div className="text-center text-xs text-slate-700">
                      →
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-400">
                        {pair.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action */}
          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] leading-5 text-slate-700">
              Tip: you can paste a whole vocabulary list at once.
            </p>

            <button
              type="button"
              onClick={handleAdd}
              disabled={parsedPairs.length === 0}
              className={[
                "group flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all",
                "active:scale-[0.98]",
                parsedPairs.length === 0
                  ? "cursor-not-allowed bg-white/[0.05] text-slate-700"
                  : added
                    ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/10"
                    : "bg-white text-slate-950 shadow-lg shadow-white/10 hover:-translate-y-0.5 hover:bg-slate-100",
              ].join(" ")}
            >
              {added ? (
                <>
                  <span>✓</span>
                  Added successfully
                </>
              ) : (
                <>
                  Add {parsedPairs.length || ""}{" "}
                  {parsedPairs.length === 1
                    ? "pair"
                    : "pairs"}

                  <span className="text-base transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}