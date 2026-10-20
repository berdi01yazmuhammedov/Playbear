import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

import type { Activity, ActivityType } from "./types/activity";

import type { MatchingDraft } from "./features/matching/matching.creator";
import type { MatchingLayout } from "./features/matching/matching.types";
import type { AnagramDraft } from "./features/anagram/anagram.types";
import type { SentenceScrambleDraft } from "./features/sentence-scramble/sentenceScramble.types";

import { createInitialMatchingDraft } from "./features/matching/matching.creator";
import { createInitialAnagramDraft } from "./features/anagram/anagram.creator";
import { createInitialSentenceScrambleDraft } from "./features/sentence-scramble/sentenceScramble.creator";

import { loadActivities, saveActivities } from "./lib/activityStorage";

import { ActivityLibrary } from "./components/home/ActivityLibrary";
import { ActivityTypeChooser } from "./components/home/ActivityTypeChooser";

import { MatchingCreator } from "./components/matching/MatchingCreator";
import { MatchingGame } from "./components/matching/MatchingGame";

import { AnagramCreator } from "./components/anagram/AnagramCreator";
import { AnagramGame } from "./components/anagram/AnagramGame";

import { SentenceScrambleCreator } from "./components/sentence-scramble/SentenceScrambleCreator";
import { SentenceScrambleGame } from "./components/sentence-scramble/SentenceScrambleGame";

import { useActivityDraft } from "./hooks/useActivityDraft";

/* =========================================================
   ROOT
========================================================= */

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

/* =========================================================
   APP STATE
========================================================= */

function AppRoutes() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState<Activity[]>(() =>
    loadActivities(),
  );

  const [showActivityChooser, setShowActivityChooser] = useState(false);

  const {
    draft: matchingDraft,
    setDraft: setMatchingDraft,
    clearDraft: clearMatchingDraft,
    isSaving: isSavingMatchingDraft,
  } = useActivityDraft({
    type: "matching",
    initialDraft: createInitialMatchingDraft(),
  });

  const {
    draft: anagramDraft,
    setDraft: setAnagramDraft,
    clearDraft: clearAnagramDraft,
    isSaving: isSavingAnagramDraft,
  } = useActivityDraft({
    type: "anagram",
    initialDraft: createInitialAnagramDraft(),
  });

  const {
    draft: sentenceScrambleDraft,
    setDraft: setSentenceScrambleDraft,
    clearDraft: clearSentenceScrambleDraft,
    isSaving: isSavingSentenceScrambleDraft,
  } = useActivityDraft({
    type: "sentence-scramble",
    initialDraft: createInitialSentenceScrambleDraft(),
  });

  useEffect(() => {
    saveActivities(activities);
  }, [activities]);

  /* =======================================================
     HELPERS
  ======================================================= */

  function findActivity(id?: string) {
    if (!id) {
      return null;
    }

    return activities.find((activity) => activity.id === id) ?? null;
  }

  function upsertActivity(activity: Activity) {
    setActivities((current) => {
      const exists = current.some((item) => item.id === activity.id);

      if (!exists) {
        return [...current, activity];
      }

      return current.map((item) => (item.id === activity.id ? activity : item));
    });
  }

  function goHome() {
    setShowActivityChooser(false);
    navigate("/");
  }

  /* =======================================================
     LIBRARY ACTIONS
  ======================================================= */

  function handleCreate() {
    setShowActivityChooser(true);
  }

  function handleSelectActivityType(type: ActivityType) {
    setShowActivityChooser(false);

    if (type === "matching") {
      clearMatchingDraft();
      navigate("/create/matching");
      return;
    }

    if (type === "anagram") {
      clearAnagramDraft();
      navigate("/create/anagram");
      return;
    }

    clearSentenceScrambleDraft();
    navigate("/create/sentence-scramble");
  }

  function handlePlay(activity: Activity) {
    navigate(`/play/${activity.id}`);
  }

  function handleEdit(activity: Activity) {
    navigate(`/edit/${activity.id}`);
  }

  function handleDelete(activity: Activity) {
    setActivities((current) =>
      current.filter((item) => item.id !== activity.id),
    );
  }

  function handleDuplicate(activity: Activity) {
    const timestamp = Date.now();

    const duplicate: Activity = {
      ...activity,
      id: `activity-${timestamp}`,
      title: `${activity.title} — Copy`,
      items: activity.items.map((item, index) => ({
        ...item,
        id: `item-${timestamp}-${index}`,
      })),
    };

    setActivities((current) => [...current, duplicate]);
  }

  /* =======================================================
     CREATE
  ======================================================= */

  function createMatching(activity: Activity, _layout: MatchingLayout) {
    upsertActivity(activity);
    clearMatchingDraft();

    navigate(`/play/${activity.id}`);
  }

  function createAnagram(activity: Activity) {
    upsertActivity(activity);
    clearAnagramDraft();

    navigate(`/play/${activity.id}`);
  }

  function createSentenceScramble(activity: Activity) {
    upsertActivity(activity);
    clearSentenceScrambleDraft();

    navigate(`/play/${activity.id}`);
  }

  /* =======================================================
     ROUTES
  ======================================================= */

  return (
    <Routes>
      {/* HOME */}

      <Route
        path="/"
        element={
          <>
            <ActivityLibrary
              activities={activities}
              onCreate={handleCreate}
              onPlay={handlePlay}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />

            {showActivityChooser && (
              <ActivityTypeChooser
                onSelect={handleSelectActivityType}
                onClose={() => setShowActivityChooser(false)}
              />
            )}
          </>
        }
      />

      {/* CREATE */}

      <Route
        path="/create/matching"
        element={
          <MatchingCreator
            draft={matchingDraft}
            onDraftChange={setMatchingDraft}
            onBack={goHome}
            onCreate={createMatching}
            hasSavedDraft={false}
            isSavingDraft={isSavingMatchingDraft}
          />
        }
      />

      <Route
        path="/create/anagram"
        element={
          <AnagramCreator
            draft={anagramDraft}
            onDraftChange={setAnagramDraft}
            onBack={goHome}
            onCreate={createAnagram}
            hasSavedDraft={false}
            isSavingDraft={isSavingAnagramDraft}
          />
        }
      />

      <Route
        path="/create/sentence-scramble"
        element={
          <SentenceScrambleCreator
            draft={sentenceScrambleDraft}
            onDraftChange={setSentenceScrambleDraft}
            onBack={goHome}
            onCreate={createSentenceScramble}
            hasSavedDraft={false}
            isSavingDraft={isSavingSentenceScrambleDraft}
          />
        }
      />

      {/* EDIT */}

      <Route
        path="/edit/:id"
        element={
          <EditRoute
            activities={activities}
            matchingDraft={matchingDraft}
            setMatchingDraft={setMatchingDraft}
            clearMatchingDraft={clearMatchingDraft}
            isSavingMatchingDraft={isSavingMatchingDraft}
            anagramDraft={anagramDraft}
            setAnagramDraft={setAnagramDraft}
            clearAnagramDraft={clearAnagramDraft}
            isSavingAnagramDraft={isSavingAnagramDraft}
            sentenceScrambleDraft={sentenceScrambleDraft}
            setSentenceScrambleDraft={setSentenceScrambleDraft}
            clearSentenceScrambleDraft={clearSentenceScrambleDraft}
            isSavingSentenceScrambleDraft={isSavingSentenceScrambleDraft}
            upsertActivity={upsertActivity}
          />
        }
      />

      {/* PLAY */}

      <Route
        path="/play/:id"
        element={<PlayRoute activities={activities} onHome={goHome} />}
      />

      {/* FALLBACK */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/* =========================================================
   EDIT ROUTE
========================================================= */

interface EditRouteProps {
  activities: Activity[];

  matchingDraft: MatchingDraft;
  setMatchingDraft: React.Dispatch<React.SetStateAction<MatchingDraft>>;
  clearMatchingDraft: () => void;
  isSavingMatchingDraft: boolean;

  anagramDraft: AnagramDraft;
  setAnagramDraft: React.Dispatch<React.SetStateAction<AnagramDraft>>;
  clearAnagramDraft: () => void;
  isSavingAnagramDraft: boolean;

  sentenceScrambleDraft: SentenceScrambleDraft;
  setSentenceScrambleDraft: (
    updater: React.SetStateAction<SentenceScrambleDraft>,
  ) => void;
  clearSentenceScrambleDraft: () => void;
  isSavingSentenceScrambleDraft: boolean;

  upsertActivity: (activity: Activity) => void;
}

function EditRoute({
  activities,
  matchingDraft,
  setMatchingDraft,
  clearMatchingDraft,
  isSavingMatchingDraft,
  anagramDraft,
  setAnagramDraft,
  clearAnagramDraft,
  isSavingAnagramDraft,
  sentenceScrambleDraft,
  setSentenceScrambleDraft,
  clearSentenceScrambleDraft,
  isSavingSentenceScrambleDraft,
  upsertActivity,
}: EditRouteProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const activity = activities.find((item) => item.id === id) ?? null;

  if (!activity) {
    return <Navigate to="/" replace />;
  }

  if (activity.type === "matching") {
    return (
      <MatchingEditRoute
        activity={activity}
        draft={matchingDraft}
        setDraft={setMatchingDraft}
        clearDraft={clearMatchingDraft}
        isSavingDraft={isSavingMatchingDraft}
        onSave={(updatedActivity) => {
          upsertActivity({
            ...updatedActivity,
            id: activity.id,
          });

          clearMatchingDraft();
          navigate(`/play/${activity.id}`);
        }}
        onBack={() => navigate(`/play/${activity.id}`)}
      />
    );
  }

  if (activity.type === "anagram") {
    return (
      <AnagramEditRoute
        activity={activity}
        draft={anagramDraft}
        setDraft={setAnagramDraft}
        clearDraft={clearAnagramDraft}
        isSavingDraft={isSavingAnagramDraft}
        onSave={(updatedActivity) => {
          upsertActivity({
            ...updatedActivity,
            id: activity.id,
          });

          clearAnagramDraft();
          navigate(`/play/${activity.id}`);
        }}
        onBack={() => navigate(`/play/${activity.id}`)}
      />
    );
  }

  return (
    <SentenceScrambleEditRoute
      activity={activity}
      draft={sentenceScrambleDraft}
      setDraft={setSentenceScrambleDraft}
      clearDraft={clearSentenceScrambleDraft}
      isSavingDraft={isSavingSentenceScrambleDraft}
      onSave={(updatedActivity) => {
        upsertActivity({
          ...updatedActivity,
          id: activity.id,
        });

        clearSentenceScrambleDraft();
        navigate(`/play/${activity.id}`);
      }}
      onBack={() => navigate(`/play/${activity.id}`)}
    />
  );
}

/* =========================================================
   MATCHING EDIT
========================================================= */

interface MatchingEditRouteProps {
  activity: Activity;
  draft: MatchingDraft;
  setDraft: React.Dispatch<React.SetStateAction<MatchingDraft>>;
  clearDraft: () => void;
  isSavingDraft: boolean;
  onSave: (activity: Activity) => void;
  onBack: () => void;
}

function MatchingEditRoute({
  activity,
  draft,
  setDraft,
  clearDraft,
  isSavingDraft,
  onSave,
  onBack,
}: MatchingEditRouteProps) {
  const [initializedId, setInitializedId] = useState<string | null>(null);

  useEffect(() => {
    if (initializedId === activity.id) {
      return;
    }

    setDraft({
      title: activity.title,
      instructions: activity.instructions,
      layout: "grid",
      items: activity.items.map((item) => ({
        id: item.id,
        left: item.promptContent ?? {
          type: "text",
          value: item.prompt,
        },
        right: item.answerContent ?? {
          type: "text",
          value: item.answer,
        },
      })),
    });

    setInitializedId(activity.id);
  }, [activity, initializedId, setDraft]);

  return (
    <MatchingCreator
      draft={draft}
      onDraftChange={setDraft}
      onBack={onBack}
      onCreate={(updatedActivity) => onSave(updatedActivity)}
      hasSavedDraft={false}
      isSavingDraft={isSavingDraft}
    />
  );
}

/* =========================================================
   ANAGRAM EDIT
========================================================= */

interface AnagramEditRouteProps {
  activity: Activity;
  draft: AnagramDraft;
  setDraft: React.Dispatch<React.SetStateAction<AnagramDraft>>;
  clearDraft: () => void;
  isSavingDraft: boolean;
  onSave: (activity: Activity) => void;
  onBack: () => void;
}

function AnagramEditRoute({
  activity,
  draft,
  setDraft,
  isSavingDraft,
  onSave,
  onBack,
}: AnagramEditRouteProps) {
  const [initializedId, setInitializedId] = useState<string | null>(null);

  useEffect(() => {
    if (initializedId === activity.id) {
      return;
    }

    setDraft({
      title: activity.title,
      instructions: activity.instructions,
      items: activity.items.map((item) => ({
        id: item.id,
        word: item.prompt,
        hint: item.answer,
      })),
    });

    setInitializedId(activity.id);
  }, [activity, initializedId, setDraft]);

  return (
    <AnagramCreator
      draft={draft}
      onDraftChange={setDraft}
      onBack={onBack}
      onCreate={onSave}
      hasSavedDraft={false}
      isSavingDraft={isSavingDraft}
    />
  );
}

/* =========================================================
   SENTENCE SCRAMBLE EDIT
========================================================= */

interface SentenceScrambleEditRouteProps {
  activity: Activity;
  draft: SentenceScrambleDraft;
  setDraft: React.Dispatch<React.SetStateAction<SentenceScrambleDraft>>;
  clearDraft: () => void;
  isSavingDraft: boolean;
  onSave: (activity: Activity) => void;
  onBack: () => void;
}

function SentenceScrambleEditRoute({
  activity,
  draft,
  setDraft,
  isSavingDraft,
  onSave,
  onBack,
}: SentenceScrambleEditRouteProps) {
  const [initializedId, setInitializedId] = useState<string | null>(null);

  useEffect(() => {
    if (initializedId === activity.id) {
      return;
    }

    setDraft({
      title: activity.title,
      instructions: activity.instructions,
      items: activity.items.map((item) => ({
        id: item.id,
        sentence: item.prompt,
        hint: item.answer,
      })),
    });

    setInitializedId(activity.id);
  }, [activity, initializedId, setDraft]);

  return (
    <SentenceScrambleCreator
      draft={draft}
      onDraftChange={setDraft}
      onBack={onBack}
      onCreate={onSave}
      hasSavedDraft={false}
      isSavingDraft={isSavingDraft}
    />
  );
}

/* =========================================================
   PLAY ROUTE
========================================================= */

interface PlayRouteProps {
  activities: Activity[];
  onHome: () => void;
}

function PlayRoute({ activities, onHome }: PlayRouteProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const activity = activities.find((item) => item.id === id);

  if (!activity) {
    return <Navigate to="/" replace />;
  }

  function goToEdit() {
    navigate(`/edit/${id}`);
  }

  if (activity.type === "matching") {
    return (
      <MatchingGame
        activity={activity}
        initialLayout="grid"
        onBack={goToEdit}
        onHome={onHome}
      />
    );
  }

  if (activity.type === "anagram") {
    return (
      <AnagramGame activity={activity} onBack={goToEdit} onHome={onHome} />
    );
  }

  return (
    <SentenceScrambleGame
      activity={activity}
      onBack={goToEdit}
      onHome={onHome}
    />
  );
}
