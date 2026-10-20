import type { ActivityType } from "../../types/activity";

interface ActivityTypeChooserProps {
  onSelect: (type: ActivityType) => void;
  onClose: () => void;
}

const types: {
  type: ActivityType;
  icon: string;
  title: string;
  description: string;
}[] = [
  {
    type: "matching",
    icon: "↔",
    title: "Matching",
    description:
      "Connect words with their meanings, translations, or definitions.",
  },
  {
    type: "anagram",
    icon: "Aa",
    title: "Anagram",
    description:
      "Unscramble letters to discover the correct word.",
  },
  {
    type: "sentence-scramble",
    icon: "☷",
    title: "Sentence Scramble",
    description:
      "Put words in the correct order to build a sentence.",
  },
];

export function ActivityTypeChooser({
  onSelect,
  onClose,
}: ActivityTypeChooserProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-950 shadow-2xl shadow-black/60">
        <div className="border-b border-white/[0.06] px-6 py-6 sm:px-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-400">
                Create activity
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
                What do you want to make?
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Choose an activity type to get started.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-lg text-slate-600 transition hover:bg-white/[0.06] hover:text-white"
            >
              ×
            </button>
          </div>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-6">
          {types.map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => onSelect(item.type)}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-violet-400/[0.04] hover:shadow-xl hover:shadow-violet-500/[0.06]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/[0.08] text-lg font-bold text-violet-300 transition-transform duration-300 group-hover:scale-105">
                {item.icon}
              </div>

              <h3 className="mt-5 font-semibold text-white">
                {item.title}
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                {item.description}
              </p>

              <div className="mt-5 text-xs font-semibold text-violet-400 opacity-0 transition group-hover:opacity-100">
                Create →
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}