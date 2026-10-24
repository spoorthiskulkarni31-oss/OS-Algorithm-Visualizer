import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import {
  NeonButton,
  Panel,
  PanelTitle,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/lab";
import { QUIZ_QUESTIONS } from "@/lib/quiz-data";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "OS Algorithms Quiz – First-Fit & C-LOOK | OS Algo Lab" },
      {
        name: "description",
        content:
          "Test your understanding of First-Fit memory allocation and C-LOOK disk scheduling with a 12-question interactive quiz featuring instant explanations.",
      },
      { property: "og:title", content: "OS Algorithms Quiz – First-Fit & C-LOOK | OS Algo Lab" },
      {
        property: "og:description",
        content:
          "Test your understanding of First-Fit memory allocation and C-LOOK disk scheduling with a 12-question interactive quiz featuring instant explanations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = QUIZ_QUESTIONS.length;
  const question = QUIZ_QUESTIONS[index];

  const submit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
    if (selected === question.correctIndex) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex(index + 1);
      setSelected(null);
      setSubmitted(false);
    }
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / total) * 100);
    const verdict =
      pct === 100
        ? "Perfect run — you have mastered both algorithms!"
        : pct >= 75
          ? "Great job — you clearly understand how these algorithms work."
          : pct >= 50
            ? "Solid effort — revisit the simulators for the questions you missed."
            : "Keep learning — run both simulators again and watch each step, then retry the quiz.";
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Panel className="text-center">
          <Trophy className="mx-auto size-12 text-warning" aria-hidden />
          <h1 className="mt-4 text-2xl font-extrabold text-foreground">
            Quiz <span className="neon-text">Complete</span>
          </h1>
          <p className="num mt-6 text-6xl font-extrabold neon-text">
            {score}
            <span className="text-3xl text-muted-foreground">/{total}</span>
          </p>
          <p className="mt-4 text-base text-muted-foreground">{verdict}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <NeonButton onClick={restart}>
              <RotateCcw className="size-4" aria-hidden /> Restart Quiz
            </NeonButton>
          </div>
        </Panel>
      </div>
    );
  }

  const isCorrect = selected === question.correctIndex;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <PageHeader
        kicker="Knowledge Check"
        title="OS Algorithms Quiz"
        description="Twelve questions across First-Fit memory allocation and C-LOOK disk scheduling. Pick an answer, submit, and read the explanation before moving on."
      />

      {/* Progress */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="font-display text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Question {index + 1} / {total}
        </span>
        <div className="flex items-center gap-2">
          <StatusBadge tone="purple">{question.topic}</StatusBadge>
          <span className="num rounded-full border border-primary/40 bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
            Score {score}
          </span>
        </div>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${((index + (submitted ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <Panel>
        <PanelTitle icon={<BrainCircuit className="size-5 text-primary" aria-hidden />}>
          Question {index + 1}
        </PanelTitle>
        <p className="mt-4 text-lg font-semibold leading-relaxed text-foreground">
          {question.question}
        </p>

        <div className="mt-5 space-y-2.5" role="radiogroup" aria-label="Answer choices">
          {question.options.map((option, optIdx) => {
            const isSelected = selected === optIdx;
            const isCorrectOption = optIdx === question.correctIndex;
            let stateClass =
              "border-border bg-secondary/60 hover:border-primary/50 hover:bg-primary/10";
            if (submitted) {
              if (isCorrectOption) stateClass = "border-success/60 bg-success/10 text-success";
              else if (isSelected) stateClass = "border-destructive/60 bg-destructive/10 text-destructive";
              else stateClass = "border-border bg-secondary/40 opacity-60";
            } else if (isSelected) {
              stateClass = "border-primary/70 bg-primary/15 text-primary shadow-[0_0_18px_-6px_var(--neon-cyan)]";
            }
            return (
              <button
                key={optIdx}
                role="radio"
                aria-checked={isSelected}
                disabled={submitted}
                onClick={() => setSelected(optIdx)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${stateClass}`}
              >
                <span>
                  <span className="num mr-2 font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                  {option}
                </span>
                {submitted && isCorrectOption && <CheckCircle2 className="size-5 shrink-0" aria-hidden />}
                {submitted && isSelected && !isCorrectOption && (
                  <XCircle className="size-5 shrink-0" aria-hidden />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {submitted && (
          <div
            className={`mt-5 rounded-xl border px-4 py-3 ${
              isCorrect
                ? "border-success/50 bg-success/10"
                : "border-destructive/50 bg-destructive/10"
            }`}
          >
            <p
              className={`font-display flex items-center gap-2 text-sm font-bold tracking-wider uppercase ${
                isCorrect ? "text-success" : "text-destructive"
              }`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="size-4" aria-hidden /> Correct!
                </>
              ) : (
                <>
                  <XCircle className="size-4" aria-hidden /> Not quite
                </>
              )}
            </p>
            <p className="mt-2 flex gap-2 text-sm leading-relaxed text-muted-foreground">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
              {question.explanation}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {!submitted ? (
            <NeonButton onClick={submit} disabled={selected === null}>
              Submit Answer
            </NeonButton>
          ) : (
            <NeonButton onClick={next}>
              {index + 1 >= total ? "See Final Score" : "Next Question"}
              <ChevronRight className="size-4" aria-hidden />
            </NeonButton>
          )}
          <NeonButton variant="ghost" onClick={restart}>
            <RotateCcw className="size-4" aria-hidden /> Restart Quiz
          </NeonButton>
        </div>
      </Panel>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <StatCard label="Answered" value={index + (submitted ? 1 : 0)} tone="cyan" />
        <StatCard label="Correct" value={score} tone="green" />
        <StatCard
          label="Remaining"
          value={total - index - (submitted ? 1 : 0)}
          tone="purple"
        />
      </div>
    </div>
  );
}
