import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MISSIONS, type Mission } from "~/data/missions";
import {
  ArrowIcon,
  CheckIcon,
  CrossIcon,
  ExhibitGlyph,
  ExternalIcon,
  Rule,
} from "~/components/icons";

export const Route = createFileRoute("/")({
  component: MuseumQuest,
});

type Screen = "welcome" | "playing" | "complete";

const TOTAL = MISSIONS.length;

export function MuseumQuest() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [missionIndex, setMissionIndex] = useState(0);
  /** Player's choice per mission; null = not answered yet. */
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    MISSIONS.map(() => null),
  );

  const score = useMemo(
    () =>
      answers.reduce<number>(
        (sum, choice, i) =>
          choice !== null && choice === MISSIONS[i].correctIndex ? sum + 1 : sum,
        0,
      ),
    [answers],
  );

  const answeredCount = answers.filter((a) => a !== null).length;
  const allAnswered = answeredCount === TOTAL;

  const choose = useCallback(
    (choice: number) => {
      setAnswers((prev) => {
        if (prev[missionIndex] !== null) return prev;
        const next = [...prev];
        next[missionIndex] = choice;
        return next;
      });
    },
    [missionIndex],
  );

  const advance = useCallback(() => {
    if (missionIndex + 1 >= TOTAL) {
      setScreen("complete");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setMissionIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [missionIndex]);

  const playAgain = useCallback(() => {
    setAnswers(MISSIONS.map(() => null));
    setMissionIndex(0);
    setScreen("playing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const start = useCallback(() => {
    setAnswers(MISSIONS.map(() => null));
    setMissionIndex(0);
    setScreen("playing");
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-paper paper-grain text-carbon">
      <a
        href="#game"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-carbon focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-paper"
      >
        Skip to the game
      </a>

      <Masthead screen={screen} score={score} answeredCount={answeredCount} />

      <main id="game" className="flex-1 px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
        <div className="mx-auto w-full max-w-3xl">
          {screen === "welcome" && <Welcome onStart={start} />}
          {screen === "playing" && (
            <MissionView
              mission={MISSIONS[missionIndex]}
              index={missionIndex}
              choice={answers[missionIndex]}
              answers={answers}
              onChoose={choose}
              onAdvance={advance}
            />
          )}
          {screen === "complete" && (
            <Completion
              score={score}
              answers={answers}
              onPlayAgain={playAgain}
            />
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Masthead                                                            */
/* ------------------------------------------------------------------ */

function Masthead({
  screen,
  score,
  answeredCount,
}: {
  screen: Screen;
  score: number;
  answeredCount: number;
}) {
  const pct = Math.round((answeredCount / TOTAL) * 100);

  return (
    <header className="border-b border-carbon/15 bg-carbon px-4 py-3 text-paper sm:px-6 sm:py-4">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-brass-light/50 text-brass-light"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M3 9 12 4l9 5M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 18h18M2 21h20" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="font-display text-xl leading-none tracking-tight sm:text-2xl">
              Museum Quest
            </p>
            <p className="mt-1 text-[0.68rem] uppercase tracking-[0.18em] text-paper/60">
              A demonstration exhibition
            </p>
          </div>
        </div>

        {screen !== "welcome" && (
          <div className="flex w-full min-w-0 flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <div
              className="w-fit shrink-0 rounded-sm border border-paper/25 px-3 py-1.5 text-sm font-semibold tabular-nums text-paper"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="text-paper/65">Score </span>
              {score}
              <span className="text-paper/50"> / {TOTAL}</span>
            </div>
            <div className="w-full min-w-0 sm:w-52 sm:flex-none">
              <div className="mb-1 flex items-center justify-between gap-2 text-[0.66rem] uppercase tracking-[0.16em] text-paper/60">
                <span className="truncate">Progress</span>
                <span className="shrink-0 whitespace-nowrap tabular-nums">
                  {answeredCount} of {TOTAL}
                </span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-paper/20"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={TOTAL}
                aria-valuenow={answeredCount}
                aria-valuetext={`${answeredCount} of ${TOTAL} missions completed`}
                aria-label="Missions completed"
              >
                <div
                  className="mq-grow h-full rounded-full bg-brass-light"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/* Mission markers derive their state from the per-mission answers array. */

function MissionMarkers({
  current,
  answers,
  tone = "light",
}: {
  current: number;
  answers: ("done" | "todo")[];
  tone?: "light" | "dark";
}) {
  return (
    <ol className="flex items-center gap-2" aria-label="Mission progress">
      {Array.from({ length: TOTAL }, (_, i) => {
        const done = answers[i] === "done";
        const isCurrent = i === current;
        const base =
          "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.12em]";
        const style = isCurrent
          ? "border-brass bg-brass text-carbon"
          : done
            ? tone === "dark"
              ? "border-paper/30 bg-paper/15 text-paper"
              : "border-carbon/25 bg-carbon/8 text-carbon"
            : tone === "dark"
              ? "border-paper/20 text-paper/50"
              : "border-carbon/15 text-carbon/45";
        return (
          <li key={i} className="min-w-0">
            <span className={`${base} ${style}`}>
              {done && !isCurrent ? (
                <CheckIcon className="h-3 w-3" />
              ) : (
                <span className="tabular-nums">{i + 1}</span>
              )}
              <span className="hidden sm:inline">
                {isCurrent ? "Current" : done ? "Restored" : "Locked"}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Welcome                                                             */
/* ------------------------------------------------------------------ */

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <section className="mq-rise">
      <div className="exhibit-card overflow-hidden">
        <div className="border-b border-carbon/12 bg-carbon/[0.03] px-5 py-4 sm:px-8">
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brass">
            A short historical mystery · 3 missions · about 3 minutes
          </p>
        </div>

        <div className="px-5 py-8 sm:px-8 sm:py-12">
          <h1 className="text-[2.15rem] leading-[1.05] sm:text-6xl">
            Museum Quest
          </h1>
          <p className="mt-4 max-w-xl text-lg text-graphite sm:text-xl">
            Three labels have fallen off three objects in the gallery. Answer
            three questions, restore the labels, and find out what each object
            really is.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <span className="hidden text-[0.68rem] uppercase tracking-[0.2em] text-carbon/50 sm:inline">
              From the curator
            </span>
            <span className="h-px flex-1 bg-carbon/12" />
          </div>

          <div className="mt-4 max-w-xl border-l-2 border-brass pl-4 text-base text-graphite sm:text-[1.0625rem]">
            <p>
              &ldquo;I came in this morning and found three blank plinths. The
              objects are fine — every label is gone. Until they are written
              again, visitors are guessing at what they are looking at. Would
              you take a look and tell me what you see?&rdquo;
            </p>
            <p className="mt-2 text-sm italic text-carbon/60">
              — Gallery Office, before opening
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {MISSIONS.map((m, i) => (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-sm border border-carbon/12 bg-paper/70 px-3 py-3"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-brass/40 text-brass">
                  <ExhibitGlyph kind={m.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.62rem] uppercase tracking-[0.16em] text-carbon/45">
                    Label {i + 1}
                  </span>
                  <span className="block truncate text-sm font-semibold text-carbon">
                    {m.object}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            data-testid="start-game"
            onClick={onStart}
            className="mt-9 inline-flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-sm bg-carbon px-7 text-base font-semibold text-paper transition-colors hover:bg-graphite active:translate-y-px sm:w-auto sm:text-lg"
          >
            Start Game
            <ArrowIcon className="h-5 w-5" />
          </button>

          <p className="mt-8 rounded-sm border border-wrong/35 bg-wrong/[0.06] px-4 py-3 text-sm font-semibold text-wrong">
            Demonstration — not an official museum product.
          </p>
          <p className="mt-2 text-sm text-carbon/60">
            Museum Quest is a sample game made for demonstration purposes only.
            Facts and links are drawn from the institutions credited after each
            answer.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Mission                                                             */
/* ------------------------------------------------------------------ */

function MissionView({
  mission,
  index,
  choice,
  answers,
  onChoose,
  onAdvance,
}: {
  mission: Mission;
  index: number;
  choice: number | null;
  answers: (number | null)[];
  onChoose: (choice: number) => void;
  onAdvance: () => void;
}) {
  const answered = choice !== null;
  const isCorrect = answered && choice === mission.correctIndex;
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const questionRef = useRef<HTMLHeadingElement | null>(null);
  const firstRender = useRef(true);

  // Move focus to the Next button after answering, and to the question
  // heading when a new mission appears — keyboard users stay oriented.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (answered) {
      nextRef.current?.focus();
    } else {
      questionRef.current?.focus();
    }
  }, [answered, index]);

  const markers = answers.map(
    (a, i) => (a !== null ? ("done" as const) : ("todo" as const)),
  );

  return (
    <section className="mq-rise" aria-labelledby="mission-heading">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[0.68rem] uppercase tracking-[0.2em] text-brass">
          Mission {index + 1} of {TOTAL} · {mission.kicker}
        </p>
        <MissionMarkers current={index} answers={markers} />
      </div>

      <div className="exhibit-card overflow-hidden">
        <div className="flex items-start gap-4 border-b border-carbon/12 bg-carbon/[0.03] px-5 py-5 sm:px-8">
         {mission.imageUrl ? (
  <img
    src={mission.imageUrl}
    alt={mission.object}
    className="h-24 w-24 shrink-0 rounded-sm border border-carbon/15 bg-parchment object-contain sm:h-32 sm:w-32"
    loading="lazy"
  />
) : (
  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-sm border border-brass/45 bg-parchment text-brass">
    <ExhibitGlyph kind={mission.icon} className="h-7 w-7" />
  </span>
)}
          <div className="min-w-0">
            <h2
              id="mission-heading"
              className="text-2xl leading-tight text-carbon sm:text-3xl"
            >
              {mission.title}
            </h2>
            <p className="mt-1 text-sm font-medium uppercase tracking-[0.14em] text-carbon/50">
              Blank label · {mission.object}
            </p>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-carbon/45">
            Question {index + 1}
          </p>
          <h3
            ref={questionRef}
            tabIndex={-1}
            className="mt-2 text-xl leading-snug text-carbon outline-none sm:text-2xl"
          >
            {mission.question}
          </h3>

          <div
            role="group"
            aria-labelledby="mission-heading"
            className="mt-5 grid gap-2.5 sm:gap-3"
          >
            {mission.options.map((option, i) => {
              const isAnswerKey = i === mission.correctIndex;
              const isChosen = choice === i;
              const revealedCorrect = answered && isAnswerKey;
              const revealedWrong = answered && isChosen && !isAnswerKey;

              let tone =
                "border-carbon/20 bg-parchment hover:border-carbon/40 hover:bg-paper";
              if (revealedCorrect)
                tone = "border-correct bg-correct/[0.09] text-carbon";
              else if (revealedWrong)
                tone = "border-wrong bg-wrong/[0.07] text-carbon";
              else if (answered)
                tone = "border-carbon/12 bg-parchment text-carbon/55";

              return (
                <button
                  key={option}
                  type="button"
                  data-testid={`option-${i}`}
                  disabled={answered}
                  aria-disabled={answered}
                  onClick={() => onChoose(i)}
                  className={`flex min-h-[56px] w-full items-start gap-3 rounded-sm border px-4 py-3.5 text-left text-base leading-snug transition-colors ${tone} ${
                    answered ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[0.72rem] font-bold ${
                      revealedCorrect
                        ? "border-correct bg-correct text-paper"
                        : revealedWrong
                          ? "border-wrong bg-wrong text-paper"
                          : "border-carbon/30 text-carbon/70"
                    }`}
                  >
                    {revealedCorrect ? (
                      <CheckIcon className="h-3.5 w-3.5" />
                    ) : revealedWrong ? (
                      <CrossIcon className="h-3.5 w-3.5" />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block break-words">{option}</span>
                    {revealedCorrect && (
                      <span className="mt-1 block text-[0.72rem] font-bold uppercase tracking-[0.12em] text-correct">
                        {isChosen ? "Correct — your answer" : "Correct answer"}
                      </span>
                    )}
                    {revealedWrong && (
                      <span className="mt-1 block text-[0.72rem] font-bold uppercase tracking-[0.12em] text-wrong">
                        Your answer — not quite
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div aria-live="polite" aria-atomic="false">
            {answered && (
              <div className="mq-rise mt-6">
                <Rule />
                <div
                  className={`mt-5 rounded-sm border-l-4 ${
                    isCorrect ? "border-correct" : "border-wrong"
                  } bg-carbon/[0.03] px-4 py-4 sm:px-5`}
                >
                  <p
                    className={`flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] ${
                      isCorrect ? "text-correct" : "text-wrong"
                    }`}
                  >
                    {isCorrect ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <CrossIcon className="h-4 w-4" />
                    )}
                    {isCorrect ? "Correct" : "Not quite"}
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-graphite sm:text-[1.0625rem]">
                    {isCorrect
                      ? mission.explanationCorrect
                      : mission.explanationWrong}
                  </p>

                  <div className="mt-4 text-sm text-carbon/80">
                    <span className="block font-semibold uppercase tracking-[0.12em] text-[0.68rem] text-carbon/50">
                      Source:
                    </span>
                    <div className="mt-1.5 flex flex-col items-start gap-1.5">
                      <a
                        href={mission.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex max-w-full min-h-[24px] items-center gap-1.5 font-semibold text-brass underline decoration-brass/50 decoration-2 underline-offset-2 hover:decoration-brass"
                      >
                        <span className="min-w-0 break-words">
                          {mission.sourceName}
                        </span>
                        <ExternalIcon className="h-3.5 w-3.5 shrink-0" />
                      </a>
                      {mission.extraSource && (
                        <a
                          href={mission.extraSource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex max-w-full min-h-[24px] items-center gap-1.5 font-semibold text-brass underline decoration-brass/50 decoration-2 underline-offset-2 hover:decoration-brass"
                        >
                          <span className="min-w-0 break-words">
                            {mission.extraSource.name}
                          </span>
                          <ExternalIcon className="h-3.5 w-3.5 shrink-0" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    ref={nextRef}
                    type="button"
                    data-testid="next"
                    onClick={onAdvance}
                    className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-sm bg-carbon px-6 text-base font-semibold text-paper transition-colors hover:bg-graphite sm:w-auto"
                  >
                    {index + 1 === TOTAL ? "See Results" : "Next Mission"}
                    <ArrowIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {!answered && (
            <p className="mt-5 text-sm text-carbon/55">
              Choose one answer to restore this label.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Completion                                                          */
/* ------------------------------------------------------------------ */

function Completion({
  score,
  answers,
  onPlayAgain,
}: {
  score: number;
  answers: (number | null)[];
  onPlayAgain: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const sources = MISSIONS.flatMap((m) => [
    { name: m.sourceName, url: m.sourceUrl, object: m.object },
    ...(m.extraSource
      ? [{ name: m.extraSource.name, url: m.extraSource.url, object: m.object }]
      : []),
  ]);

  const verdict =
    score === TOTAL
      ? "All three labels restored — the gallery is ready to open."
      : score === 0
        ? "The labels are back up — and the objects are the real prize."
        : "The labels are back on the plinths. Here is what they say.";

  return (
    <section className="mq-rise" aria-labelledby="results-heading">
      <div className="exhibit-card overflow-hidden">
        <div className="border-b border-carbon/12 bg-carbon px-5 py-8 text-paper sm:px-8 sm:py-10">
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brass-light">
            Exhibition complete
          </p>
          <h2
            ref={headingRef}
            tabIndex={-1}
            id="results-heading"
            className="mt-3 text-3xl leading-tight outline-none sm:text-5xl"
          >
            Your final score: {score} / {TOTAL}
          </h2>
          <p className="mt-3 max-w-xl text-base text-paper/75 sm:text-lg">
            {verdict}
          </p>
          <div className="mt-5 flex gap-1.5" aria-hidden>
            {MISSIONS.map((m, i) => {
              const right = answers[i] === m.correctIndex;
              return (
                <span
                  key={m.id}
                  className={`grid h-9 w-9 place-items-center rounded-sm border ${
                    right
                      ? "border-correct bg-correct/25 text-paper"
                      : "border-paper/25 text-paper/50"
                  }`}
                >
                  {right ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-bold tabular-nums">
                      {i + 1}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>

        <div className="px-5 py-7 sm:px-8 sm:py-9">
          <h3 className="text-2xl text-carbon sm:text-3xl">What you learned</h3>
          <ol className="mt-4 grid gap-3">
            {MISSIONS.map((m, i) => {
              const right = answers[i] === m.correctIndex;
              return (
                <li
                  key={m.id}
                  className="flex items-start gap-3 rounded-sm border border-carbon/12 bg-paper/70 px-4 py-3.5"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border border-brass/40 text-sm font-bold text-brass tabular-nums">
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold uppercase tracking-[0.1em] text-carbon/55">
                      {m.object}
                      <span className="ml-2 normal-case tracking-normal text-carbon/40">
                        · {right ? "answered correctly" : "read on the label"}
                      </span>
                    </span>
                    <span className="mt-1 block break-words text-base leading-relaxed text-carbon">
                      {m.learned}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="mt-8">
            <Rule />
          </div>

          <h3 className="mt-6 text-2xl text-carbon sm:text-3xl">Sources</h3>
          <ul className="mt-3 grid gap-2">
            {sources.map((s) => (
              <li key={s.url} className="min-w-0">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex max-w-full min-h-[44px] items-start gap-2 py-2 text-base font-semibold leading-snug text-brass underline decoration-brass/50 decoration-2 underline-offset-2 hover:decoration-brass"
                >
                  <ExternalIcon className="mt-1 h-4 w-4 shrink-0" />
                  <span className="min-w-0 break-words">
                    {s.name}
                    <span className="ml-2 font-normal text-carbon/50">
                      — {s.object}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <button
              type="button"
              data-testid="play-again"
              onClick={onPlayAgain}
              className="inline-flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-sm bg-brass px-7 text-base font-semibold text-carbon transition-colors hover:bg-brass-light sm:w-auto sm:text-lg"
            >
              <ArrowIcon className="h-5 w-5 rotate-180" />
              Play Again
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function SiteFooter() {
  return (
    <footer className="border-t border-carbon/15 px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 text-sm text-carbon/60 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-carbon/75">
          Demonstration — not an official museum product.
        </p>
        <p>Sample game · facts credited to the institutions linked above.</p>
      </div>
    </footer>
  );
}
