import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Blocks,
  BrainCircuit,
  HardDrive,
  Lightbulb,
  ListChecks,
  MemoryStick,
  Play,
} from "lucide-react";
import { Panel } from "@/components/lab";
import heroCyber from "@/assets/hero-cyber.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OS Algorithm Visualizer – Learn First-Fit & C-LOOK" },
      {
        name: "description",
        content:
          "Interactively learn how operating systems manage memory (First-Fit allocation) and disk requests (C-LOOK scheduling) with live simulations and a quiz.",
      },
      { property: "og:title", content: "OS Algorithm Visualizer – Learn First-Fit & C-LOOK" },
      {
        property: "og:description",
        content:
          "Interactively learn how operating systems manage memory (First-Fit allocation) and disk requests (C-LOOK scheduling) with live simulations and a quiz.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FEATURE_CARDS = [
  {
    to: "/first-fit",
    icon: MemoryStick,
    title: "First-Fit Memory Allocation",
    description:
      "Load memory blocks and processes, run the First-Fit algorithm, and watch each process claim the first block that fits — with fragmentation and success stats.",
    accent: "text-primary",
    cta: "Open simulator",
  },
  {
    to: "/c-look",
    icon: HardDrive,
    title: "C-LOOK Disk Scheduling",
    description:
      "Set disk requests and the head position, then follow the head as it sweeps one direction, wraps around, and reports its exact total head movement.",
    accent: "text-accent",
    cta: "Open simulator",
  },
  {
    to: "/quiz",
    icon: BrainCircuit,
    title: "Quiz: Test Your Understanding",
    description:
      "Twelve multiple-choice questions across both topics with instant feedback, explanations, and a score at the end.",
    accent: "text-neon-blue",
    cta: "Start quiz",
  },
] as const;

function Index() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Hero */}
      <div className="scanline relative overflow-hidden rounded-3xl border border-primary/25">
        <img
          src={heroCyber}
          alt=""
          aria-hidden
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        <div className="relative px-6 py-14 sm:px-12 sm:py-20">
          <p className="font-display text-xs font-bold tracking-[0.35em] text-primary/90 uppercase">
            Interactive OS Lab
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold text-foreground sm:text-5xl">
            OS Algorithm <span className="neon-text">Visualizer</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground sm:text-xl">
            Learn how operating systems manage memory and disk requests — interactively. Run real
            simulations of First-Fit memory allocation and C-LOOK disk scheduling, step through the
            results, and test yourself with a quiz.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/first-fit"
              className="font-display inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold tracking-wider text-primary-foreground uppercase shadow-[0_0_26px_-6px_var(--neon-cyan)] transition-all hover:shadow-[0_0_34px_-2px_var(--neon-cyan)] hover:brightness-110"
            >
              <Play className="size-4" aria-hidden />
              Explore Algorithms
            </Link>
            <Link
              to="/quiz"
              className="font-display inline-flex items-center gap-2 rounded-lg border border-accent/50 bg-accent/15 px-6 py-3 text-sm font-bold tracking-wider text-accent uppercase transition-all hover:bg-accent/25 hover:shadow-[0_0_26px_-6px_var(--neon-purple)]"
            >
              <BrainCircuit className="size-4" aria-hidden />
              Start Quiz
            </Link>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {FEATURE_CARDS.map(({ to, icon: Icon, title, description, accent, cta }) => (
          <Link key={to} to={to} className="group">
            <article className="glow-card flex h-full flex-col rounded-2xl p-6">
              <span
                className={`grid size-12 place-items-center rounded-xl border border-primary/30 bg-primary/10 ${accent}`}
              >
                <Icon className="size-6" aria-hidden />
              </span>
              <h2 className="mt-4 text-lg font-bold text-foreground">{title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
              <span className="font-display mt-4 inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary uppercase">
                {cta}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </article>
          </Link>
        ))}
      </div>

      {/* Why this matters */}
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <Panel>
          <h2 className="flex items-center gap-2 text-base font-bold tracking-[0.12em] uppercase">
            <MemoryStick className="size-5 text-primary" aria-hidden />
            How the OS manages memory
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            When processes need main memory, the operating system must decide which free memory
            block to give them. <strong className="text-foreground">First-Fit</strong> scans memory
            from the very first block and allocates the process to the first block large enough to
            hold it. It is fast because it stops searching early, but repeated use leaves many small
            unused gaps — the leftover space inside an allocated block is called{" "}
            <em>internal fragmentation</em>.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            In the simulator you control the block sizes and process sizes, run the algorithm, and
            see exactly which process went where, how much space was wasted, and how many processes
            could not be placed at all.
          </p>
        </Panel>
        <Panel>
          <h2 className="flex items-center gap-2 text-base font-bold tracking-[0.12em] uppercase">
            <HardDrive className="size-5 text-accent" aria-hidden />
            How the OS schedules disk requests
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Disk read/write requests arrive for cylinders scattered across the platter, and the
            read/write head can only be in one place at a time.{" "}
            <strong className="text-foreground">C-LOOK</strong> services requests in one direction
            in sorted order; after the last pending request in that direction, the head jumps
            straight to the furthest pending request on the opposite side and keeps sweeping — never
            travelling to the physical disk edge unless a request is there.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The simulator animates the head on a cylinder track, lists every move including the
            wraparound jump, and totals the head movement so you can compare schedules.
          </p>
        </Panel>
      </div>

      {/* First-time-user guide */}
      <Panel className="mt-12">
        <h2 className="flex items-center gap-2 text-base font-bold tracking-[0.12em] uppercase">
          <Lightbulb className="size-5 text-primary" aria-hidden />
          New here? Start in three steps
        </h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Blocks,
              title: "1. Run a simulation",
              text: "Open First-Fit or C-LOOK — both come pre-loaded with example data, so just press Run.",
            },
            {
              icon: ListChecks,
              title: "2. Experiment",
              text: "Change the blocks, processes, requests or head position and rerun to see how the outcome changes.",
            },
            {
              icon: BrainCircuit,
              title: "3. Take the quiz",
              text: "When the results make sense, prove it: 12 questions with instant explanations.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-xl border border-primary/20 bg-card/60 p-4">
              <Icon className="size-5 text-primary" aria-hidden />
              <p className="font-display mt-2 text-sm font-bold tracking-wider text-foreground uppercase">
                {title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}
