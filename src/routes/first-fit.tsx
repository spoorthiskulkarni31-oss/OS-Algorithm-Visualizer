import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CircleMinus,
  CirclePlus,
  MemoryStick,
  Play,
  RotateCcw,
  Table2,
  TrendingUp,
} from "lucide-react";
import {
  EmptyState,
  ErrorAlert,
  NeonButton,
  Panel,
  PanelTitle,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/lab";
import { firstFit, type FirstFitResult } from "@/lib/algorithms";

export const Route = createFileRoute("/first-fit")({
  head: () => ({
    meta: [
      { title: "First-Fit Memory Allocation Visualizer – OS Algo Lab" },
      {
        name: "description",
        content:
          "Run a live First-Fit memory allocation simulation: allocate processes to memory blocks, see fragmentation, allocation tables and statistics.",
      },
      { property: "og:title", content: "First-Fit Memory Allocation Visualizer – OS Algo Lab" },
      {
        property: "og:description",
        content:
          "Run a live First-Fit memory allocation simulation: allocate processes to memory blocks, see fragmentation, allocation tables and statistics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FirstFitPage,
});

interface Item {
  id: number;
  size: number;
}

const DEFAULT_BLOCKS = [100, 500, 200, 300, 600];
const DEFAULT_PROCESSES = [212, 417, 112, 426];
let nextId = 1;
const makeItems = (sizes: number[]): Item[] =>
  sizes.map((size) => ({ id: nextId++, size }));

function FirstFitPage() {
  const [blocks, setBlocks] = useState<Item[]>(() => makeItems(DEFAULT_BLOCKS));
  const [processes, setProcesses] = useState<Item[]>(() => makeItems(DEFAULT_PROCESSES));
  const [result, setResult] = useState<FirstFitResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const setSize = (
    list: Item[],
    setList: (updater: (prev: Item[]) => Item[]) => void,
    id: number,
    raw: string,
  ) => {
    const size = raw === "" ? 0 : Math.max(0, Math.floor(Number(raw) || 0));
    setList(list.map((item) => (item.id === id ? { ...item, size } : item)));
  };

  const run = () => {
    const problems: string[] = [];
    if (blocks.length === 0) problems.push("Add at least one memory block.");
    if (processes.length === 0) problems.push("Add at least one process.");
    blocks.forEach((b) => {
      if (b.size <= 0) problems.push(`Memory block with an invalid size — every block needs a positive size.`);
    });
    processes.forEach((p) => {
      if (p.size <= 0) problems.push(`Process with an invalid size — every process needs a positive size.`);
    });
    setErrors(problems);
    if (problems.length > 0) {
      setResult(null);
      return;
    }
    setResult(firstFit(blocks.map((b) => b.size), processes.map((p) => p.size)));
  };

  const reset = () => {
    setBlocks(makeItems(DEFAULT_BLOCKS));
    setProcesses(makeItems(DEFAULT_PROCESSES));
    setResult(null);
    setErrors([]);
  };

  const totalMemory = blocks.reduce((sum, b) => sum + b.size, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageHeader
        kicker="Memory Management"
        title="First-Fit Allocation"
        description="Enter memory blocks and process sizes, then run the algorithm. First-Fit scans blocks from the beginning and gives each process the first block big enough to hold it — one process per block."
      />

      {/* Inputs */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <div className="flex items-center justify-between gap-3">
            <PanelTitle icon={<MemoryStick className="size-5 text-primary" aria-hidden />}>
              Memory Blocks
            </PanelTitle>
            <NeonButton
              variant="outline"
              size="sm"
              onClick={() => setBlocks([...blocks, { id: nextId++, size: 100 }])}
            >
              <CirclePlus className="size-4" aria-hidden /> Add block
            </NeonButton>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Sizes in KB, largest-to-smallest order does not matter — blocks are scanned in the order
            listed.
          </p>
          <ul className="mt-4 space-y-2">
            {blocks.map((block, idx) => (
              <li key={block.id} className="flex items-center gap-2">
                <span className="num w-20 shrink-0 rounded-md border border-primary/25 bg-primary/10 px-2 py-2 text-center text-xs font-bold text-primary">
                  B{idx + 1}
                </span>
                <input
                  type="number"
                  min={1}
                  value={block.size === 0 ? "" : block.size}
                  onChange={(e) => setSize(blocks, setBlocks, block.id, e.target.value)}
                  placeholder="Size (KB)"
                  aria-label={`Memory block ${idx + 1} size in KB`}
                  className="num w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring focus:outline-none"
                />
                <button
                  onClick={() => setBlocks(blocks.filter((b) => b.id !== block.id))}
                  aria-label={`Remove memory block ${idx + 1}`}
                  className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                >
                  <CircleMinus className="size-5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
          {blocks.length === 0 && (
            <p className="mt-3 text-sm text-destructive">No memory blocks — add one to begin.</p>
          )}
        </Panel>

        <Panel>
          <div className="flex items-center justify-between gap-3">
            <PanelTitle icon={<Play className="size-5 text-accent" aria-hidden />}>
              Processes
            </PanelTitle>
            <NeonButton
              variant="outline"
              size="sm"
              onClick={() => setProcesses([...processes, { id: nextId++, size: 64 }])}
            >
              <CirclePlus className="size-4" aria-hidden /> Add process
            </NeonButton>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Each process needs one whole block; a block cannot be shared between processes.
          </p>
          <ul className="mt-4 space-y-2">
            {processes.map((proc, idx) => (
              <li key={proc.id} className="flex items-center gap-2">
                <span className="num w-20 shrink-0 rounded-md border border-accent/35 bg-accent/10 px-2 py-2 text-center text-xs font-bold text-accent">
                  P{idx + 1}
                </span>
                <input
                  type="number"
                  min={1}
                  value={proc.size === 0 ? "" : proc.size}
                  onChange={(e) => setSize(processes, setProcesses, proc.id, e.target.value)}
                  placeholder="Size (KB)"
                  aria-label={`Process ${idx + 1} size in KB`}
                  className="num w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring focus:outline-none"
                />
                <button
                  onClick={() => setProcesses(processes.filter((p) => p.id !== proc.id))}
                  aria-label={`Remove process ${idx + 1}`}
                  className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                >
                  <CircleMinus className="size-5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
          {processes.length === 0 && (
            <p className="mt-3 text-sm text-destructive">No processes — add one to begin.</p>
          )}
        </Panel>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <NeonButton onClick={run}>
          <Play className="size-4" aria-hidden /> Run First-Fit
        </NeonButton>
        <NeonButton variant="ghost" onClick={reset}>
          <RotateCcw className="size-4" aria-hidden /> Reset
        </NeonButton>
        <span className="text-xs text-muted-foreground">
          Example data is loaded by default — press Run to see it work instantly.
        </span>
      </div>

      <div className="mt-4">
        <ErrorAlert messages={errors} />
      </div>

      {/* Results */}
      {result === null ? (
        <div className="mt-8">
          <EmptyState title="No simulation yet">
            Configure the memory blocks and processes above (or keep the example data) and press{" "}
            <strong className="text-foreground">Run First-Fit</strong> to see the allocation, the
            memory layout, the result table and statistics.
          </EmptyState>
        </div>
      ) : (
        <>
          {/* Memory layout */}
          <Panel className="mt-8">
            <PanelTitle icon={<MemoryStick className="size-5 text-primary" aria-hidden />}>
              Memory Layout
            </PanelTitle>
            <div className="mt-4 flex min-w-0 flex-wrap gap-1.5">
              {blocks.map((block, idx) => {
                const occupant = result.blockOccupancy[idx];
                const procRow = occupant ? result.rows[occupant - 1] : null;
                const fillPct = procRow ? Math.min(100, (procRow.processSize / block.size) * 100) : 0;
                return (
                  <div
                    key={block.id}
                    style={{ width: `max(${(block.size / Math.max(totalMemory, 1)) * 100}% , 8rem)` }}
                    className="flex flex-col"
                  >
                    <span className="num mb-1 text-[11px] font-bold text-primary">
                      B{idx + 1} · {block.size} KB
                    </span>
                    <div className="striped-free relative h-16 overflow-hidden rounded-lg border border-neon-blue/40 bg-secondary">
                      {procRow && (
                        <div
                          style={{ width: `${fillPct}%` }}
                          className="absolute inset-y-0 left-0 flex items-center justify-center overflow-hidden bg-gradient-to-r from-primary to-accent text-[11px] font-bold text-primary-foreground transition-all duration-700"
                        >
                          <span className="truncate px-1">
                            P{occupant} · {procRow.processSize} KB
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="mt-1 text-[11px] text-muted-foreground">
                      {procRow
                        ? `${Math.round(100 - fillPct)}% free · ${procRow.unusedSpace} KB unused`
                        : "Free"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="inline-block h-3 w-6 rounded bg-gradient-to-r from-primary to-accent" />
                Occupied
              </span>
              <span className="flex items-center gap-2">
                <span className="striped-free inline-block h-3 w-6 rounded border border-neon-blue/40" />
                Free space
              </span>
            </div>
          </Panel>

          {/* Result table */}
          <Panel className="mt-5">
            <PanelTitle icon={<Table2 className="size-5 text-primary" aria-hidden />}>
              Allocation Result
            </PanelTitle>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="font-display text-[11px] tracking-widest text-primary uppercase">
                    <th className="px-3 py-2">Process</th>
                    <th className="px-3 py-2">Size (KB)</th>
                    <th className="px-3 py-2">Block</th>
                    <th className="px-3 py-2">Block size (KB)</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Unused space (KB)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row) => (
                    <tr
                      key={row.processNumber}
                      className="border-t border-primary/10 transition-colors hover:bg-primary/5"
                    >
                      <td className="num px-3 py-2.5 font-bold text-foreground">
                        P{row.processNumber}
                      </td>
                      <td className="num px-3 py-2.5">{row.processSize}</td>
                      <td className="num px-3 py-2.5">
                        {row.blockNumber ? `B${row.blockNumber}` : "—"}
                      </td>
                      <td className="num px-3 py-2.5">{row.blockSize ?? "—"}</td>
                      <td className="px-3 py-2.5">
                        {row.allocated ? (
                          <StatusBadge tone="success">Allocated</StatusBadge>
                        ) : (
                          <StatusBadge tone="error">Not allocated</StatusBadge>
                        )}
                      </td>
                      <td className="num px-3 py-2.5">
                        {row.unusedSpace ?? "—"}
                        {row.allocated && row.unusedSpace === 0 ? " (exact fit)" : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total processes" value={result.totalProcesses} tone="cyan" />
            <StatCard label="Allocated" value={result.allocatedProcesses} tone="green" />
            <StatCard label="Unallocated" value={result.unallocatedProcesses} tone="red" />
            <StatCard
              label="Success rate"
              value={`${result.successRate}%`}
              sub="of processes placed"
              tone="purple"
            />
          </div>

          <Panel className="mt-5">
            <PanelTitle icon={<TrendingUp className="size-5 text-primary" aria-hidden />}>
              What happened?
            </PanelTitle>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {result.allocatedProcesses === result.totalProcesses && result.totalProcesses > 0 ? (
                <>
                  Every process found a home. Notice how First-Fit always picks the{" "}
                  <em>first</em> block that is big enough — earlier, smaller blocks stay untouched
                  even when they could hold a later small process.
                </>
              ) : (
                <>
                  {result.unallocatedProcesses} process
                  {result.unallocatedProcesses === 1 ? " could" : "es could"} not be placed: no
                  single free block was large enough once earlier processes had claimed the bigger
                  blocks. Try smaller process sizes, larger blocks, or more blocks and rerun to see
                  the difference.
                </>
              )}
            </p>
          </Panel>
        </>
      )}
    </div>
  );
}
