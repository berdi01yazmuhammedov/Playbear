import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MousePointer2,
} from "lucide-react";

import { MatchingPreview } from "./MatchingPreview";
import { AnagramPreview } from "./AnagramPreview";
import { SentenceScramblePreview } from "./SentenceScramblePreview";

type PreviewType = "matching" | "anagram" | "sentence-scramble";

const previews: {
  type: PreviewType;
  label: string;
  eyebrow: string;
  description: string;
}[] = [
  {
    type: "matching",
    label: "Matching",
    eyebrow: "Connect ideas",
    description: "Match words, images, definitions and more.",
  },
  {
    type: "anagram",
    label: "Anagram",
    eyebrow: "Build vocabulary",
    description: "Unscramble letters to reveal the correct word.",
  },
  {
    type: "sentence-scramble",
    label: "Sentence Scramble",
    eyebrow: "Practice grammar",
    description: "Put words in the correct order to form a sentence.",
  },
];

export function GamePreviewCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const interactionTimeout = useRef<number | null>(null);

  const activePreview = previews[activeIndex];

  function goTo(index: number) {
    const nextIndex = (index + previews.length) % previews.length;

    setActiveIndex(nextIndex);
  }

  function next() {
    goTo(activeIndex + 1);
  }

  function previous() {
    goTo(activeIndex - 1);
  }

  function pauseTemporarily() {
    setPaused(true);

    if (interactionTimeout.current) {
      window.clearTimeout(interactionTimeout.current);
    }

    interactionTimeout.current = window.setTimeout(() => {
      setPaused(false);
    }, 5000);
  }

  useEffect(() => {
    if (paused) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % previews.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    return () => {
      if (interactionTimeout.current) {
        window.clearTimeout(interactionTimeout.current);
      }
    };
  }, []);

  return (
    <div
      className="w-full max-w-[610px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={pauseTemporarily}
    >
      {/* Main preview */}

      <div className="relative">
        {/* Background frame */}

        <div className="pointer-events-none absolute -inset-5 rounded-[42px] border border-white/[0.03] bg-white/[0.015] blur-[1px]" />

        <div className="relative">
          {activePreview.type === "matching" && <MatchingPreview />}

          {activePreview.type === "anagram" && <AnagramPreview />}

          {activePreview.type === "sentence-scramble" && (
            <SentenceScramblePreview />
          )}
        </div>
      </div>

      {/* Carousel controls */}

      <div className="mt-5 flex items-center justify-between gap-4">
        {/* Label */}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-violet-400/[0.08] text-violet-300">
              <MousePointer2 size={11} />
            </span>

            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-600">
              Interactive preview
            </span>
          </div>

          <div className="mt-1 flex min-w-0 items-center gap-2">
            <span className="truncate text-xs font-bold text-slate-300">
              {activePreview.eyebrow}
            </span>

            <span className="h-1 w-1 shrink-0 rounded-full bg-slate-700" />

            <span className="truncate text-[11px] text-slate-600">
              {activePreview.description}
            </span>
          </div>
        </div>

        {/* Navigation */}

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              previous();
              pauseTemporarily();
            }}
            aria-label="Previous game preview"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-500 transition hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white active:scale-95"
          >
            <ChevronLeft size={15} />
          </button>

          <button
            type="button"
            onClick={() => {
              next();
              pauseTemporarily();
            }}
            aria-label="Next game preview"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-500 transition hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white active:scale-95"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Game tabs */}

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {previews.map((preview, index) => {
            const active = index === activeIndex;

            return (
              <button
                key={preview.type}
                type="button"
                onClick={() => {
                  goTo(index);
                  pauseTemporarily();
                }}
                className={[
                  "min-h-8 shrink-0 rounded-lg px-2.5 text-[10px] font-bold transition-all",
                  active
                    ? "bg-white/[0.08] text-white"
                    : "text-slate-700 hover:bg-white/[0.04] hover:text-slate-400",
                ].join(" ")}
              >
                {preview.label}
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {previews.map((preview, index) => (
            <button
              key={preview.type}
              type="button"
              onClick={() => {
                goTo(index);
                pauseTemporarily();
              }}
              aria-label={`Show ${preview.label} preview`}
              className={[
                "h-1.5 rounded-full transition-all duration-300",
                index === activeIndex
                  ? "w-5 bg-violet-400"
                  : "w-1.5 bg-white/[0.12] hover:bg-white/[0.25]",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      {/* Tiny hint */}

      <div className="mt-3 hidden items-center justify-end gap-1.5 text-[9px] font-medium text-slate-700 sm:flex">
        <ArrowLeft size={10} />
        <span>Try it yourself</span>
        <ArrowRight size={10} />
      </div>
    </div>
  );
}
