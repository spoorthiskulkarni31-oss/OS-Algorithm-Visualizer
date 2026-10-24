/**
 * Real algorithm implementations for OS ALGO LAB.
 * Pure functions — no UI, no side effects — so they can be unit tested.
 */

// ---------------------------------------------------------------------------
// First-Fit memory allocation
// ---------------------------------------------------------------------------

export interface FirstFitRow {
  /** Process number, 1-based (P1, P2, ...). */
  processNumber: number;
  processSize: number;
  /** 1-based block number, or null when the process could not be allocated. */
  blockNumber: number | null;
  blockSize: number | null;
  allocated: boolean;
  /** Internal fragmentation: block size − process size. Null when unallocated. */
  unusedSpace: number | null;
}

export interface FirstFitResult {
  rows: FirstFitRow[];
  /** blockIndex -> processNumber (1-based) that occupies it, if any. */
  blockOccupancy: (number | null)[];
  totalProcesses: number;
  allocatedProcesses: number;
  unallocatedProcesses: number;
  successRate: number; // 0–100
}

/**
 * First-Fit: for each process, scan memory blocks from the beginning and
 * allocate to the FIRST block large enough to hold the process. Each block
 * holds at most one process in this simulation.
 */
export function firstFit(blocks: number[], processes: number[]): FirstFitResult {
  const blockOccupancy: (number | null)[] = blocks.map(() => null);
  const rows: FirstFitRow[] = [];

  processes.forEach((processSize, pIdx) => {
    let allocatedBlock: number | null = null;

    for (let bIdx = 0; bIdx < blocks.length; bIdx++) {
      if (blockOccupancy[bIdx] === null && blocks[bIdx] >= processSize) {
        allocatedBlock = bIdx;
        blockOccupancy[bIdx] = pIdx + 1;
        break;
      }
    }

    rows.push({
      processNumber: pIdx + 1,
      processSize,
      blockNumber: allocatedBlock === null ? null : allocatedBlock + 1,
      blockSize: allocatedBlock === null ? null : blocks[allocatedBlock],
      allocated: allocatedBlock !== null,
      unusedSpace: allocatedBlock === null ? null : blocks[allocatedBlock] - processSize,
    });
  });

  const allocatedProcesses = rows.filter((r) => r.allocated).length;
  const totalProcesses = rows.length;

  return {
    rows,
    blockOccupancy,
    totalProcesses,
    allocatedProcesses,
    unallocatedProcesses: totalProcesses - allocatedProcesses,
    successRate: totalProcesses === 0 ? 0 : Math.round((allocatedProcesses / totalProcesses) * 100),
  };
}

// ---------------------------------------------------------------------------
// C-LOOK disk scheduling
// ---------------------------------------------------------------------------

export interface CLookStep {
  /** 1-based step number. */
  step: number;
  from: number;
  to: number;
  distance: number;
  cumulative: number;
  /** True when this step is the wraparound move to the opposite side. */
  isWrap: boolean;
}

export interface CLookResult {
  /** Cylinder numbers in the exact order they are serviced. */
  sequence: number[];
  steps: CLookStep[];
  totalHeadMovement: number;
  initialHead: number;
  direction: "left" | "right";
  requests: number[];
}

/**
 * C-LOOK: service requests in the chosen direction in sorted order; after the
 * last pending request in that direction, jump to the FURTHEST pending request
 * on the opposite side and keep servicing in the same direction of travel.
 * The head never travels to the physical disk boundary unless a request sits
 * there.
 */
export function cLook(
  requests: number[],
  initialHead: number,
  direction: "left" | "right",
): CLookResult {
  const above = requests.filter((r) => r >= initialHead);
  const below = requests.filter((r) => r < initialHead);

  const ordered =
    direction === "right"
      ? [...above.sort((a, b) => a - b), ...below.sort((a, b) => a - b)]
      : [...above.sort((a, b) => b - a), ...below.sort((a, b) => b - a)];

  const steps: CLookStep[] = [];
  let current = initialHead;
  let cumulative = 0;

  ordered.forEach((to, i) => {
    const distance = Math.abs(to - current);
    cumulative += distance;
    steps.push({
      step: i + 1,
      from: current,
      to,
      distance,
      cumulative,
      isWrap: direction === "right" ? i === above.length : i === above.length,
    });
    current = to;
  });

  return {
    sequence: ordered,
    steps,
    totalHeadMovement: cumulative,
    initialHead,
    direction,
    requests,
  };
}
