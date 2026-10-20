import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Copy,
  Edit3,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import type { Activity, ActivityType } from "../../types/activity";
import { GamePreviewCarousel } from "./previews/GamePreviewCarousel";

interface ActivityLibraryProps {
  activities: Activity[];
  onCreate: () => void;
  onPlay: (activity: Activity) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
  onDuplicate: (activity: Activity) => void;
}

interface ActivityCardProps {
  activity: Activity;
  created?: boolean;
  onPlay: (activity: Activity) => void;
  onEdit?: (activity: Activity) => void;
  onDelete?: (activity: Activity) => void;
  onDuplicate?: (activity: Activity) => void;
}

type LibraryFilter = "all" | ActivityType;

const sampleActivities: Activity[] = [
  {
    id: "sample-food",
    type: "matching",
    title: "Food vocabulary",
    instructions: "Match each food word with its description.",
    items: [
      {
        id: "food-1",
        prompt: "Apple",
        answer: "A fruit",
      },
      {
        id: "food-2",
        prompt: "Carrot",
        answer: "A vegetable",
      },
      {
        id: "food-3",
        prompt: "Bread",
        answer: "A baked food",
      },
      {
        id: "food-4",
        prompt: "Cheese",
        answer: "A dairy product",
      },
      {
        id: "food-5",
        prompt: "Rice",
        answer: "A common grain",
      },
      {
        id: "food-6",
        prompt: "Chicken",
        answer: "A type of meat",
      },
    ],
  },
  {
    id: "sample-animals",
    type: "matching",
    title: "Animals",
    instructions: "Match each animal with its description.",
    items: [
      {
        id: "animal-1",
        prompt: "Elephant",
        answer: "A very large animal",
      },
      {
        id: "animal-2",
        prompt: "Dolphin",
        answer: "A sea mammal",
      },
      {
        id: "animal-3",
        prompt: "Eagle",
        answer: "A bird of prey",
      },
      {
        id: "animal-4",
        prompt: "Giraffe",
        answer: "An animal with a long neck",
      },
      {
        id: "animal-5",
        prompt: "Penguin",
        answer: "A flightless bird",
      },
      {
        id: "animal-6",
        prompt: "Tiger",
        answer: "A large wild cat",
      },
    ],
  },
  {
    id: "sample-daily-routines",
    type: "matching",
    title: "Daily routines",
    instructions: "Match each activity with its meaning.",
    items: [
      {
        id: "routine-1",
        prompt: "Wake up",
        answer: "Stop sleeping",
      },
      {
        id: "routine-2",
        prompt: "Have breakfast",
        answer: "Eat your first meal",
      },
      {
        id: "routine-3",
        prompt: "Go to work",
        answer: "Travel to your workplace",
      },
      {
        id: "routine-4",
        prompt: "Have lunch",
        answer: "Eat your midday meal",
      },
      {
        id: "routine-5",
        prompt: "Go home",
        answer: "Return to your house",
      },
      {
        id: "routine-6",
        prompt: "Go to bed",
        answer: "Go to sleep",
      },
    ],
  },
];

function getActivityIcon(type: Activity["type"]) {
  switch (type) {
    case "matching":
      return "↔";

    case "anagram":
      return "Aa";

    case "sentence-scramble":
      return "☷";

    default:
      return "✦";
  }
}

function getActivityTypeLabel(type: Activity["type"]) {
  switch (type) {
    case "matching":
      return "Matching";

    case "anagram":
      return "Anagram";

    case "sentence-scramble":
      return "Sentence scramble";

    default:
      return "Activity";
  }
}

function getActivityItemLabel(type: Activity["type"]) {
  switch (type) {
    case "matching":
      return "pair";

    case "anagram":
      return "word";

    case "sentence-scramble":
      return "sentence";

    default:
      return "item";
  }
}

function getActivityDescription(activity: Activity) {
  const count = activity.items.length;
  const label = getActivityItemLabel(activity.type);

  return `${count} ${count === 1 ? label : `${label}s`}`;
}

function getActivityAccent(type: Activity["type"]) {
  switch (type) {
    case "matching":
      return {
        icon: "border-violet-300/10 bg-violet-400/[0.08] text-violet-300",
        badge: "bg-violet-400/[0.08] text-violet-300",
        glow: "from-violet-500/[0.1] to-blue-500/[0.04]",
      };

    case "anagram":
      return {
        icon: "border-cyan-300/10 bg-cyan-400/[0.08] text-cyan-300",
        badge: "bg-cyan-400/[0.08] text-cyan-300",
        glow: "from-cyan-500/[0.09] to-blue-500/[0.04]",
      };

    case "sentence-scramble":
      return {
        icon: "border-blue-300/10 bg-blue-400/[0.08] text-blue-300",
        badge: "bg-blue-400/[0.08] text-blue-300",
        glow: "from-blue-500/[0.09] to-violet-500/[0.04]",
      };

    default:
      return {
        icon: "border-white/10 bg-white/[0.05] text-slate-300",
        badge: "bg-white/[0.05] text-slate-300",
        glow: "from-white/[0.05] to-transparent",
      };
  }
}

function ActivityCard({
  activity,
  created = false,
  onPlay,
  onEdit,
  onDelete,
  onDuplicate,
}: ActivityCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const accent = getActivityAccent(activity.type);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleDeleteClick() {
    setMenuOpen(false);
    setConfirmDelete(true);
  }

  function confirmDeleteActivity() {
    onDelete?.(activity);
    setConfirmDelete(false);
  }

  return (
    <>
      <article className="group relative overflow-visible rounded-[26px] border border-white/[0.07] bg-white/[0.025] p-4 transition-all duration-300 sm:p-5 sm:hover:-translate-y-1 sm:hover:border-white/[0.13] sm:hover:bg-white/[0.045] sm:hover:shadow-2xl sm:hover:shadow-black/20">
        {/* Card glow */}

        <div
          className={[
            "pointer-events-none absolute -inset-px rounded-[26px]",
            "bg-gradient-to-br opacity-0 transition-opacity duration-500",
            "group-hover:opacity-100",
            accent.glow,
          ].join(" ")}
        />

        <div className="relative">
          {/* Top */}

          <div className="mb-5 flex items-start justify-between gap-3">
            <div
              className={[
                "relative flex h-11 w-11 shrink-0",
                "items-center justify-center rounded-2xl",
                "border text-base font-black",
                "shadow-inner sm:h-12 sm:w-12 sm:text-lg",
                accent.icon,
              ].join(" ")}
            >
              {getActivityIcon(activity.type)}

              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-white/[0.02] blur-md" />
            </div>

            {created && (
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-label="Activity options"
                  aria-expanded={menuOpen}
                  className={[
                    "flex h-9 w-9 items-center",
                    "justify-center rounded-xl",
                    "text-slate-500 transition-all",
                    "hover:bg-white/[0.06] hover:text-white",
                    "focus:outline-none focus:ring-2 focus:ring-white/10",
                    menuOpen ? "bg-white/[0.07] text-white" : "",
                  ].join(" ")}
                >
                  <MoreHorizontal size={18} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-11 z-50 w-52 overflow-hidden rounded-2xl border border-white/[0.09] bg-slate-900/95 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-2xl">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit?.(activity);
                      }}
                      className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <Edit3 size={14} className="text-slate-500" />
                      Edit activity
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onDuplicate?.(activity);
                      }}
                      className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <Copy size={14} className="text-slate-500" />
                      Duplicate
                    </button>

                    <div className="my-1 border-t border-white/[0.06]" />

                    <button
                      type="button"
                      onClick={handleDeleteClick}
                      className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-rose-400 transition hover:bg-rose-500/10"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content */}

          <div className="mb-5 min-w-0">
            <div className="mb-2.5 flex min-w-0 flex-wrap items-center gap-2">
              <span
                className={[
                  "max-w-full rounded-md px-2 py-1",
                  "text-[9px] font-black uppercase",
                  "tracking-[0.13em]",
                  accent.badge,
                ].join(" ")}
              >
                {getActivityTypeLabel(activity.type)}
              </span>

              {created && (
                <span className="rounded-md bg-emerald-400/[0.08] px-2 py-1 text-[9px] font-black uppercase tracking-[0.13em] text-emerald-300">
                  Yours
                </span>
              )}
            </div>

            <h3 className="break-words text-[17px] font-bold leading-6 tracking-tight text-white sm:text-lg">
              {activity.title}
            </h3>

            <p className="mt-2 line-clamp-2 min-h-[40px] text-[13px] leading-5 text-slate-500">
              {activity.instructions}
            </p>
          </div>

          {/* Metadata */}

          <div className="mb-4 flex min-w-0 items-center justify-between gap-3 border-t border-white/[0.055] pt-4">
            <span className="truncate text-xs font-medium text-slate-500">
              {getActivityDescription(activity)}
            </span>

            <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-semibold text-slate-600 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
              Ready
            </span>
          </div>

          {/* Play */}

          <button
            type="button"
            onClick={() => onPlay(activity)}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white/[0.07] px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-violet-400/20"
          >
            <Play size={13} fill="currentColor" />
            Play activity
            <ArrowRight
              size={14}
              className="ml-0.5 opacity-50 transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </article>

      {/* ================================================== */}
      {/* DELETE MODAL */}
      {/* ================================================== */}

      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/65 p-3 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="w-full max-w-md rounded-[26px] border border-white/[0.09] bg-slate-900 p-5 shadow-2xl shadow-black/60 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-400/10 bg-rose-500/[0.08] text-rose-400">
                <Trash2 size={18} />
              </div>

              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white/[0.05] hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <h3 className="mt-5 text-lg font-bold tracking-tight text-white sm:text-xl">
              Delete activity?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              <span className="font-semibold text-slate-200">
                {activity.title}
              </span>{" "}
              will be permanently removed from your library.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="min-h-11 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-sm font-bold text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteActivity}
                className="min-h-11 rounded-xl bg-rose-500 px-4 text-sm font-bold text-white transition hover:bg-rose-400 active:scale-[0.98]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function ActivityLibrary({
  activities,
  onCreate,
  onPlay,
  onEdit,
  onDelete,
  onDuplicate,
}: ActivityLibraryProps) {
  const hasActivities = activities.length > 0;

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<LibraryFilter>("all");

  const filteredActivities = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return activities.filter((activity) => {
      const matchesFilter = filter === "all" || activity.type === filter;

      if (!matchesFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableText = [
        activity.title,
        activity.instructions,
        getActivityTypeLabel(activity.type),
        ...activity.items.flatMap((item) => [item.prompt, item.answer]),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [activities, filter, search]);

  const filterOptions: {
    value: LibraryFilter;
    label: string;
  }[] = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "matching",
      label: "Matching",
    },
    {
      value: "anagram",
      label: "Anagram",
    },
    {
      value: "sentence-scramble",
      label: "Sentence scramble",
    },
  ];

  const hasActiveFilters = search.trim().length > 0 || filter !== "all";

  function clearFilters() {
    setSearch("");
    setFilter("all");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white selection:bg-violet-400/10">
      {/* ================================================== */}
      {/* AMBIENT BACKGROUND */}
      {/* ================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-52 -top-48 h-[520px] w-[520px] rounded-full bg-violet-600/[0.07] blur-[140px]" />

        <div className="absolute -right-64 top-[10%] h-[600px] w-[600px] rounded-full bg-blue-600/[0.05] blur-[150px]" />

        <div className="absolute -bottom-72 left-[30%] h-[550px] w-[550px] rounded-full bg-violet-500/[0.03] blur-[150px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-3.5 pb-8 pt-4 sm:px-6 sm:pb-12 sm:pt-6 lg:px-8 lg:pt-7">
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <header className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-black shadow-lg shadow-violet-500/20 sm:h-10 sm:w-10">
              P
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-white/[0.08]" />
            </div>

            <div className="min-w-0">
              <span className="block truncate text-[15px] font-black tracking-tight sm:text-lg">
                Play
                <span className="text-violet-400">Bear</span>
              </span>

              <span className="hidden text-[10px] font-medium text-slate-700 sm:block">
                Teacher workspace
              </span>
            </div>
          </div>

          {/* Desktop / tablet create */}

          <button
            type="button"
            onClick={onCreate}
            className="hidden min-h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-slate-950 shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:bg-violet-100 hover:shadow-xl sm:flex"
          >
            <Plus size={16} />
            Create activity
          </button>

          {/* Mobile create */}

          <button
            type="button"
            onClick={onCreate}
            aria-label="Create activity"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950 shadow-lg transition hover:bg-violet-100 active:scale-95 sm:hidden"
          >
            <Plus size={19} />
          </button>
        </header>

        {/* ================================================== */}
        {/* HERO */}
        {/* ================================================== */}

        <section className="relative pb-12 pt-14 sm:pb-16 sm:pt-20 lg:pb-20 lg:pt-28">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            {/* Left */}

            <div className="relative z-10 max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/10 bg-violet-400/[0.06] px-3 py-1.5 text-[10px] font-bold text-violet-300 sm:mb-6 sm:text-xs">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />

                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
                </span>
                Teacher workspace
              </div>

              <h1 className="max-w-3xl text-[2.45rem] font-black leading-[1.02] tracking-[-0.055em] text-white sm:text-5xl sm:leading-[1.02] lg:text-6xl">
                Make English practice
                <br />
                <span className="bg-gradient-to-r from-violet-300 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                  feel like play.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-[14px] leading-6 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8">
                Build interactive activities your students actually want to play
                — then use them again and again in your classroom.
              </p>

              {!hasActivities && (
                <div className="mt-7 sm:mt-9">
                  <button
                    type="button"
                    onClick={onCreate}
                    className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl bg-violet-500 px-5 text-sm font-bold text-white shadow-xl shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-400 hover:shadow-2xl hover:shadow-violet-500/30 active:scale-[0.98] sm:w-auto sm:px-6"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 text-base transition-transform duration-300 group-hover:rotate-90">
                      <Plus size={15} />
                    </span>
                    Create your first activity
                    <ArrowRight
                      size={15}
                      className="text-violet-200 transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </button>

                  <p className="mt-3 text-center text-[11px] text-slate-600 sm:text-left sm:text-xs">
                    Start with Matching, Anagram, or Sentence Scramble.
                  </p>
                </div>
              )}
            </div>

            {/* Right */}

            <div className="relative flex min-h-[300px] items-center justify-center sm:min-h-[400px] lg:min-h-[500px] lg:justify-end">
              <GamePreviewCarousel />
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* LIBRARY */}
        {/* ================================================== */}

        {hasActivities && (
          <section className="pb-14 sm:pb-20">
            {/* Section heading */}

            <div className="mb-6 sm:mb-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 sm:text-xs">
                      Your library
                    </p>

                    <span className="h-1 w-1 rounded-full bg-slate-700" />

                    <span className="text-[10px] font-medium text-slate-700 sm:text-xs">
                      {activities.length}{" "}
                      {activities.length === 1 ? "activity" : "activities"}
                    </span>
                  </div>

                  <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                    Your activities
                  </h2>

                  <p className="mt-1.5 text-xs leading-5 text-slate-600 sm:text-sm">
                    Create, organize and play your classroom activities.
                  </p>
                </div>
              </div>

              {/* Search + filters */}

              <div className="mt-5 space-y-2.5 sm:mt-6 lg:flex lg:items-center lg:gap-3 lg:space-y-0">
                {/* Search */}

                <div className="relative min-w-0 flex-1">
                  <Search
                    aria-hidden="true"
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search activities..."
                    className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-violet-400/30 focus:bg-white/[0.04] focus:ring-2 focus:ring-violet-400/[0.04]"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                      className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Filters */}

                <div className="w-full overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02] lg:w-auto">
                  <div className="flex max-w-full gap-1 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {filterOptions.map((option) => {
                      const active = filter === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFilter(option.value)}
                          className={[
                            "min-h-9 shrink-0 rounded-lg px-3 text-[11px] font-bold transition-all sm:px-3.5 sm:text-xs",
                            active
                              ? "bg-white text-slate-950 shadow-sm"
                              : "text-slate-600 hover:bg-white/[0.04] hover:text-slate-300",
                          ].join(" ")}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Results info */}

            {hasActiveFilters && (
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-[11px] text-slate-600">
                  Showing{" "}
                  <span className="font-semibold text-slate-500">
                    {filteredActivities.length}
                  </span>{" "}
                  {filteredActivities.length === 1 ? "activity" : "activities"}
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="shrink-0 text-[11px] font-bold text-slate-500 transition hover:text-white"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Results */}

            {filteredActivities.length > 0 ? (
              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    created
                    onPlay={onPlay}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[26px] border border-dashed border-white/[0.08] bg-white/[0.015] px-5 py-14 text-center sm:px-6 sm:py-16">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-slate-600">
                  <Search size={21} />
                </div>

                <h3 className="mt-5 text-sm font-bold text-slate-300">
                  No activities found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-600">
                  Try a different search term or change the activity filter.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 min-h-10 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 text-xs font-bold text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>
        )}

        {/* ================================================== */}
        {/* EXAMPLES */}
        {/* ================================================== */}

        <section className="pb-14 sm:pb-20">
          <div className="mb-6 flex items-end justify-between sm:mb-7">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 sm:text-xs">
                  Examples
                </p>

                <Sparkles size={12} className="text-slate-700" />
              </div>

              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                {hasActivities ? "Need some inspiration?" : "Try an example"}
              </h2>
            </div>

            {!hasActivities && (
              <span className="hidden text-xs font-medium text-slate-700 sm:block">
                Ready-made activities
              </span>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {sampleActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onPlay={onPlay}
              />
            ))}
          </div>
        </section>

        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}

        <footer className="border-t border-white/[0.05] pb-6 pt-6 sm:pb-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs font-bold text-slate-700">PlayBear</span>

            <span className="text-[11px] text-slate-700 sm:text-xs">
              Make learning feel like play.
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}
