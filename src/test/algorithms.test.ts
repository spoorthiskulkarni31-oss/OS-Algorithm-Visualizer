import { describe, expect, it } from "vitest";
import { cLook, firstFit } from "@/lib/algorithms";

describe("firstFit", () => {
  it("allocates each process to the first block large enough", () => {
    const result = firstFit([100, 500, 200, 300, 600], [212, 417, 112, 426]);

    expect(result.rows.map((r) => r.blockNumber)).toEqual([2, 5, 3, null]);
    expect(result.rows[0]).toMatchObject({ unusedSpace: 288, allocated: true });
    expect(result.rows[1]).toMatchObject({ unusedSpace: 183, allocated: true });
    expect(result.rows[2]).toMatchObject({ unusedSpace: 88, allocated: true });
    expect(result.rows[3]).toMatchObject({ allocated: false, blockNumber: null, unusedSpace: null });
    expect(result.allocatedProcesses).toBe(3);
    expect(result.unallocatedProcesses).toBe(1);
    expect(result.successRate).toBe(75);
  });

  it("never reuses a block for a second process", () => {
    // Two processes both fit in block 1; the second must go to block 2.
    const result = firstFit([500, 500], [100, 100]);
    expect(result.rows.map((r) => r.blockNumber)).toEqual([1, 2]);
    expect(result.blockOccupancy).toEqual([1, 2]);
  });

  it("returns zero success rate for an empty process list", () => {
    const result = firstFit([100], []);
    expect(result.totalProcesses).toBe(0);
    expect(result.successRate).toBe(0);
  });
});

describe("cLook", () => {
  const requests = [98, 183, 37, 122, 14, 124, 65, 67];

  it("services right then wraps to the lowest remaining request", () => {
    const result = cLook(requests, 53, "right");

    expect(result.sequence).toEqual([65, 67, 98, 122, 124, 183, 14, 37]);
    expect(result.totalHeadMovement).toBe(322);
    // The wrap happens on the step that jumps 183 -> 14.
    const wrapStep = result.steps.find((s) => s.isWrap);
    expect(wrapStep).toMatchObject({ from: 183, to: 14, distance: 169 });
  });

  it("services left then wraps to the highest remaining request", () => {
    const result = cLook(requests, 53, "left");

    expect(result.sequence).toEqual([37, 14, 183, 124, 122, 98, 67, 65]);
    expect(result.totalHeadMovement).toBe(326);
    const wrapStep = result.steps.find((s) => s.isWrap);
    expect(wrapStep).toMatchObject({ from: 14, to: 183, distance: 169 });
  });

  it("handles a request at the head position with zero movement", () => {
    const result = cLook([53, 60], 53, "right");
    expect(result.sequence).toEqual([53, 60]);
    expect(result.totalHeadMovement).toBe(7);
  });

  it("handles a single request", () => {
    const result = cLook([10], 50, "left");
    expect(result.sequence).toEqual([10]);
    expect(result.totalHeadMovement).toBe(40);
  });
});
