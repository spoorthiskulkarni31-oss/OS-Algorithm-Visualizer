import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  CirclePlay,
  HardDrive,
  MoveHorizontal,
  Play,
  RotateCcw,
  Table2,
  Zap,
} from "lucide-react";
import {
  EmptyState,
  ErrorAlert,
  NeonButton,
  Panel,
  PanelTitle,
  PageHeader,
  StatCard,
} from "@/components/lab";
import { cLook, type CLookResult } from "@/lib/algorithms";

export const Route = createFileRoute("/c-look")({
  head: () => ({
    meta: [
      { title: "C-LOOK Disk Scheduling Visualizer – OS Algo Lab" },
      {
        name: "description",
        content:
          "Run a live C-LOOK disk scheduling simulation: animate the disk head across the cylinder track and see the servicing sequence, movement table and total head movement.",
      },
      { property: "og:title", content: "C-LOOK Disk Scheduling Visualizer – OS Algo Lab" },
      {
        property: "og:description",
        content:
          "Run a live C-LOOK disk scheduling simulation: animate the disk head across the cylinder track and see the servicing sequence, movement table and total head movement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CLookPage,
});

const DEFAULT_REQUESTS = [98, 183, 37, 122, 14, 124, 65, 67];
const DEFAULT_HEAD = 53;
const DEFAULT_MAX = 199;

function CLookPage() {
  const [requestsInput, setRequestsInput] = useState(DEFAULT_REQUESTS.join(", "));
  const [headInput, setHeadInput] = useState(String(DEFAULT_HEAD));
  const [minInput, setMinInput] = useState("0");
  const [maxInput, setMaxInput] = useState(String(DEFAULT_MAX));
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [result, setResult] = useState<CLookResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [animStep, setAnimStep] = useState(-1);

  // Animate the head through the servicing sequence whenever a new result arrives.
  useEffect(() => {
    if (!result) {
      setAnimStep(-1);
      return;
    }
    setAnimStep(-1);
    let step = -1;
    const timer = window.setInterval(() => {
      step += 1;
      setAnimStep(step);
      if (step >= result.steps.length - 1) window.clearInterval(timer);
    }, 900);
    return () => window.clearInterval(timer);
  }, [result]);

  const run = () => {
    const problems: string[] = [];
    const min = Number(minInput);
    const max = Number(maxInput);

    if (!Number.isInteger(min) || min < 0) problems.push("Minimum cylinder must be an integer of 0 or more.");
    if (!Number.isInteger(max) || max <= min) problems.push("Maximum cylinder must be an integer greater than the minimum.");

    const rawHead = Number(headInput);
    if (!Number.isInteger(rawHead)) problems.push("Head position must be an integer.");
    else if (Number.isInteger(min) && Number.isInteger(max) && max > min) {
      if (rawHead < min || rawHead > max)
        problems.push(`Head position ${rawHead} is outside the valid range ${min}–${max}.`);
    }

    const parsed = requestsInput
      .split(/[,\s]+/)
      .filter((s) => s !== "")
      .map(Number);
    if (parsed.length === 0) problems.push("Enter at least one disk request cylinder.");
    if (parsed.some((n) => !Number.isInteger(n)))
      problems.push("Every disk request must be an integer cylinder number (e.g. 98).");
    if (parsed.some((n) => Number.isInteger(n) && Number.isInteger(min) && Number.isInteger(max) && max > min && (n < min || n > max)))
      problems.push(`All requests must be within the valid range ${min}–${max}.`);

    setErrors(problems);
    if (problems.length > 0) {
      setResult(null);
      return;
    }
    setResult(cLook(parsed, rawHead, direction));
  };

  const reset = () => {
    setRequestsInput(DEFAULT_REQUESTS.join(", "));
    setHeadInput(String(DEFAULT_HEAD));
    setMinInput("0");
    setMaxInput(String(DEFAULT_MAX));
    setDirection("right");
    setResult(null);
    setErrors([]);
  };

  const clearRequests = () => {
    setRequestsInput("");
    setResult(null);
  };

  // ---- Visual track geometry ----
  const min = result ? Math.min(0, ...result.requests, result.initialHead) : 0;
  const max = result ? Math.max(...result.requests, result.initialHead) : 1;
  const trackMin = min;
  const trackMax = max + 1; // small right padding
  const X0 = 50;
  const X1 = 850;
  const xOf = (cyl: number) => X0 + ((cyl - trackMin) / (trackMax - trackMin)) * (X1 - X0);

  const headPos =
    result === null || animStep < 0
      ? result?.initialHead ?? 0
      : result.steps[Math.min(animStep, result.steps.length - 1)].to;

  const servicedCount = result === null || animStep < 0 ? 0 : Math.min(animStep + 1, result.steps.length);
  const wrapStepIndex = result?.steps.findIndex((s) => s.isWrap) ?? -1;
  const showWrapArc = result !== null && wrapStepIndex >= 0 && animStep >= wrapStepIndex;

  const tickStep = trackMax - trackMin > 60 ? 25 : trackMax - trackMin > 24 ? 10 : 5;
  const ticks: number[] = [];
  for (let t = Math.ceil(trackMin / tickStep) * tickStep; t <= trackMax; t += tickStep) ticks.push(t);

  const inputClass =
    "num w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring focus:outline-none";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageHeader
        kicker="Disk Scheduling"
        title="C-LOOK Scheduling"
        description="Enter disk request cylinders and the head position, then run C-LOOK. The head services requests in one direction in sorted order, jumps to the furthest pending request on the opposite side, and keeps sweeping — never travelling to the disk edge unless a request is there."
      />

      {/* Inputs */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelTitle icon={<HardDrive className="size-5 text-primary" aria-hidden />}>
            Disk Requests
          </PanelTitle>
          <p className="mt-2 text-xs text-muted-foreground">
            Comma or space separated cylinder numbers, e.g. 98, 183, 37.
          </p>
          <textarea
            value={requestsInput}
            onChange={(e) => setRequestsInput(e.target.value)}
            rows={2}
            placeholder="98, 183, 37, 122, 14, 124, 65, 67"
            aria-label="Disk request cylinders"
            className={`mt-3 resize-none ${inputClass}`}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <NeonButton variant="outline" size="sm" onClick={() => setRequestsInput(DEFAULT_REQUESTS.join(", "))}>
              <CirclePlay className="size-4" aria-hidden /> Load example
            </NeonButton>
            <NeonButton variant="ghost" size="sm" onClick={clearRequests}>
              Clear requests
            </NeonButton>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="font-display text-[11px] font-bold tracking-widest text-primary uppercase">
                Head position
              </span>
              <input
                type="number"
                value={headInput}
                onChange={(e) => setHeadInput(e.target.value)}
                aria-label="Initial head position"
                className={`mt-1.5 ${inputClass}`}
              />
            </label>
            <label className="block">
              <span className="font-display text-[11px] font-bold tracking-widest text-primary uppercase">
                Min cylinder
              </span>
              <input
                type="number"
                value={minInput}
                onChange={(e) => setMinInput(e.target.value)}
                aria-label="Minimum cylinder"
                className={`mt-1.5 ${inputClass}`}
              />
            </label>
            <label className="block">
              <span className="font-display text-[11px] font-bold tracking-widest text-primary uppercase">
                Max cylinder
              </span>
              <input
                type="number"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                aria-label="Maximum cylinder"
                className={`mt-1.5 ${inputClass}`}
              />
            </label>
          </div>
        </Panel>

        <Panel>
          <PanelTitle icon={<ArrowLeftRight className="size-5 text-accent" aria-hidden />}>
            Initial Direction
          </PanelTitle>
          <p className="mt-2 text-xs text-muted-foreground">
            Which way the head starts sweeping from its initial position.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {(["left", "right"] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => setDirection(dir)}
                aria-pressed={direction === dir}
                className={`font-display rounded-lg border px-3 py-3 text-sm font-bold tracking-wider uppercase transition-all ${
                  direction === dir
                    ? "border-primary/60 bg-primary/15 text-primary shadow-[0_0_20px_-6px_var(--neon-cyan)]"
                    : "border-border bg-secondary text-muted-foreground hover:bg-muted"
                }`}
              >
                {dir === "left" ? "← Left" : "Right →"}
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <NeonButton onClick={run} className="w-full">
              <Play className="size-4" aria-hidden /> Run C-LOOK
            </NeonButton>
            <NeonButton variant="ghost" onClick={reset} className="w-full">
              <RotateCcw className="size-4" aria-hidden /> Reset
            </NeonButton>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Example data is loaded by default — just press Run.
          </p>
        </Panel>
      </div>

      <div className="mt-4">
        <ErrorAlert messages={errors} />
      </div>

      {result === null ? (
        <div className="mt-8">
          <EmptyState title="No simulation yet">
            Keep the example requests or enter your own, choose a direction, and press{" "}
            <strong className="text-foreground">Run C-LOOK</strong> to animate the head and see the
            full servicing sequence and movement table.
          </EmptyState>
        </div>
      ) : (
        <>
          {/* Animated track */}
          <Panel className="mt-8">
            <PanelTitle icon={<MoveHorizontal className="size-5 text-primary" aria-hidden />}>
              Cylinder Track
              <span className="ml-2 text-xs font-semibold tracking-normal text-muted-foreground normal-case">
                {servicedCount}/{result.steps.length} requests serviced
              </span>
            </PanelTitle>
            <div className="mt-4 overflow-x-auto">
              <svg
                viewBox="0 0 900 190"
                className="w-full min-w-[680px]"
                role="img"
                aria-label="Animated C-LOOK disk head movement on the cylinder track"
              >
                {/* wrap arc */}
                {showWrapArc && (
                  <line
                    x1={xOf(result.steps[wrapStepIndex].from)}
                    y1={150}
                    x2={xOf(result.steps[wrapStepIndex].to)}
                    y2={150}
                    stroke="var(--neon-purple)"
                    strokeWidth="2.5"
                    strokeDasharray="6 5"
                  />
                )}
                {/* axis */}
                <line x1={X0 - 20} y1={100} x2={X1 + 20} y2={100} stroke="var(--border)" strokeWidth="2" />
                {ticks.map((t) => (
                  <g key={t}>
                    <line x1={xOf(t)} y1={94} x2={xOf(t)} y2={106} stroke="var(--border)" strokeWidth="1.5" />
                    <text
                      x={xOf(t)}
                      y={124}
                      textAnchor="middle"
                      className="num"
                      fontSize="11"
                      fill="var(--muted-foreground)"
                    >
                      {t}
                    </text>
                  </g>
                ))}
                {/* request markers */}
                {result.requests.map((req) => {
                  const servicedIdx = result.steps.findIndex((s) => s.to === req);
                  const isServiced = servicedIdx >= 0 && servicedIdx < servicedCount;
                  const isWrapTarget = wrapStepIndex >= 0 && result.steps[wrapStepIndex].to === req;
                  return (
                    <circle
                      key={req}
                      cx={xOf(req)}
                      cy={100}
                      r={9}
                      fill={isServiced ? (isWrapTarget ? "var(--neon-purple)" : "var(--neon-cyan)") : "var(--muted)"}
                      stroke="var(--background)"
                      strokeWidth="2"
                      style={{
                        filter: isServiced
                          ? `drop-shadow(0 0 6px ${isWrapTarget ? "var(--neon-purple)" : "var(--neon-cyan)"})`
                          : undefined,
                        transition: "fill 0.4s ease, filter 0.4s ease",
                      }}
                    />
                  );
                })}
                {/* initial head ghost */}
                <line
                  x1={xOf(result.initialHead)}
                  y1={62}
                  x2={xOf(result.initialHead)}
                  y2={100}
                  stroke="var(--neon-blue)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <text
                  x={xOf(result.initialHead)}
                  y={54}
                  textAnchor="middle"
                  className="num"
                  fontSize="11"
                  fill="var(--neon-blue)"
                >
                  start {result.initialHead}
                </text>
                {/* moving head */}
                <g
                  style={{
                    transform: `translateX(${xOf(headPos)}px)`,
                    transition: "transform 0.8s cubic-bezier(0.45, 0, 0.25, 1)",
                  }}
                >
                  <polygon points="0,58 -10,40 10,40" fill="var(--neon-cyan)" style={{ filter: "drop-shadow(0 0 8px var(--neon-cyan))" }} />
                  <line x1="0" y1="42" x2="0" y2="100" stroke="var(--neon-cyan)" strokeWidth="2" />
                  <text x="0" y="34" textAnchor="middle" className="num" fontSize="12" fontWeight="700" fill="var(--neon-cyan)">
                    {headPos}
                  </text>
                </g>
              </svg>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="inline-block size-3 rounded-full bg-primary shadow-[0_0_8px_var(--neon-cyan)]" />
                Serviced request
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block size-3 rounded-full bg-muted" />
                Pending request
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block size-3 rounded-full bg-accent shadow-[0_0_8px_var(--neon-purple)]" />
                Wraparound target
              </span>
            </div>
          </Panel>

          {/* Sequence + total */}
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total requests" value={result.requests.length} tone="cyan" />
            <StatCard label="Initial head" value={result.initialHead} tone="blue" />
            <StatCard
              label="Total head movement"
              value={result.totalHeadMovement}
              sub="cylinders travelled"
              tone="purple"
            />
            <StatCard
              label="Direction"
              value={result.direction === "right" ? "Right" : "Left"}
              sub="initial sweep"
              tone="green"
            />
          </div>

          <Panel className="mt-5">
            <PanelTitle icon={<Zap className="size-5 text-accent" aria-hidden />}>
              Servicing Sequence
            </PanelTitle>
            <p className="num mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span className="rounded-md border border-neon-blue/40 bg-neon-blue/10 px-2 py-1 font-bold text-neon-blue">
                {result.initialHead}
              </span>
              {result.steps.map((s) => (
                <span key={s.step} className="flex items-center gap-2">
                  <span className="text-muted-foreground">→</span>
                  <span
                    className={`rounded-md border px-2 py-1 font-bold ${
                      s.isWrap
                        ? "border-accent/50 bg-accent/10 text-accent"
                        : "border-primary/40 bg-primary/10 text-primary"
                    }`}
                  >
                    {s.to}
                  </span>
                </span>
              ))}
            </p>
          </Panel>

          {/* Movement table */}
          <Panel className="mt-5">
            <PanelTitle icon={<Table2 className="size-5 text-primary" aria-hidden />}>
              Movement Table
            </PanelTitle>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="font-display text-[11px] tracking-widest text-primary uppercase">
                    <th className="px-3 py-2">Step</th>
                    <th className="px-3 py-2">From</th>
                    <th className="px-3 py-2">To</th>
                    <th className="px-3 py-2">Distance</th>
                    <th className="px-3 py-2">Cumulative</th>
                    <th className="px-3 py-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {result.steps.map((s) => (
                    <tr
                      key={s.step}
                      className="border-t border-primary/10 transition-colors hover:bg-primary/5"
                    >
                      <td className="num px-3 py-2.5 font-bold">{s.step}</td>
                      <td className="num px-3 py-2.5">{s.from}</td>
                      <td className="num px-3 py-2.5 font-bold text-foreground">{s.to}</td>
                      <td className="num px-3 py-2.5">{s.distance}</td>
                      <td className="num px-3 py-2.5">{s.cumulative}</td>
                      <td className="px-3 py-2.5">
                        {s.isWrap ? (
                          <span className="font-display text-[11px] font-bold tracking-wider text-accent uppercase">
                            Wraparound jump
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {result.direction === "right" ? "sweeping right" : "sweeping left"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-primary/30">
                    <td colSpan={3} className="px-3 py-3 font-display text-[11px] font-bold tracking-widest text-primary uppercase">
                      Total head movement
                    </td>
                    <td className="num px-3 py-3 font-bold text-accent">{result.totalHeadMovement}</td>
                    <td colSpan={2} />
                  </tr>
                </tbody>
              </table>
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
