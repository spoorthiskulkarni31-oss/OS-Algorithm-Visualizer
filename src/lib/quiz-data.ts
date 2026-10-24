export interface QuizQuestion {
  id: number;
  topic: "First-Fit" | "C-LOOK";
  question: string;
  options: [string, string, string, string];
  /** Index (0–3) of the correct option. */
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: "First-Fit",
    question:
      "Memory blocks of sizes 100 KB, 500 KB, 200 KB and 300 KB are free, in that order. Using First-Fit, which block gets a 212 KB process?",
    options: ["Block 1 (100 KB)", "Block 2 (500 KB)", "Block 3 (200 KB)", "Block 4 (300 KB)"],
    correctIndex: 1,
    explanation:
      "First-Fit scans blocks from the beginning and allocates to the first block large enough. Block 1 (100 KB) and Block 3 (200 KB) are too small, so the 212 KB process lands in Block 2 (500 KB).",
  },
  {
    id: 2,
    topic: "First-Fit",
    question: "In First-Fit allocation, where does the scan for a free block always start?",
    options: [
      "From the block with the largest size",
      "From the most recently allocated block",
      "From the beginning of the memory list",
      "From a randomly chosen block",
    ],
    correctIndex: 2,
    explanation:
      "First-Fit always starts scanning from the beginning of the memory block list and takes the first hole that is big enough — that is what distinguishes it from Best-Fit and Worst-Fit.",
  },
  {
    id: 3,
    topic: "First-Fit",
    question:
      "A 120 KB process is allocated to a 500 KB block under First-Fit. What is the internal fragmentation of that allocation?",
    options: ["620 KB", "380 KB", "500 KB", "120 KB"],
    correctIndex: 1,
    explanation:
      "Internal fragmentation is the unused space inside the allocated block: 500 − 120 = 380 KB. The process occupies part of the block and the rest stays wasted until the block is freed.",
  },
  {
    id: 4,
    topic: "First-Fit",
    question: "In this First-Fit simulation, how many processes can occupy one memory block at the same time?",
    options: ["Exactly one", "Two, if they fit", "As many as fit", "Depends on the block size"],
    correctIndex: 0,
    explanation:
      "In this simulation each block can hold only one process. Once a block is allocated, later processes skip it even if there would be leftover space in it.",
  },
  {
    id: 5,
    topic: "First-Fit",
    question: "What is a known drawback of the First-Fit strategy over repeated use?",
    options: [
      "It is always slower than Best-Fit",
      "It tends to fragment the low end of memory with many small leftover holes",
      "It allocates to the largest available block first",
      "It never allocates memory to small processes",
    ],
    correctIndex: 1,
    explanation:
      "Because First-Fit always grabs the earliest big-enough hole, the low end of memory fills with small leftover holes (external fragmentation). Next-Fit was invented partly to reduce this.",
  },
  {
    id: 6,
    topic: "First-Fit",
    question: "Compared with Best-Fit, what is the main practical advantage of First-Fit?",
    options: [
      "It never creates fragmentation",
      "It is faster because it stops searching as soon as a hole fits",
      "It always uses memory more efficiently",
      "It requires sorted memory blocks",
    ],
    correctIndex: 1,
    explanation:
      "First-Fit stops at the first suitable hole, so on average it searches far fewer blocks than Best-Fit, which must inspect every hole to find the smallest one that fits.",
  },
  {
    id: 7,
    topic: "C-LOOK",
    question:
      "In C-LOOK moving right, after servicing the last (highest) request on the right side, where does the head go next?",
    options: [
      "To the highest-numbered cylinder of the disk",
      "To cylinder 0",
      "To the lowest-numbered pending request, then continues servicing rightward",
      "It stops and waits for new requests",
    ],
    correctIndex: 2,
    explanation:
      "C-LOOK jumps from the last serviced request in the current direction to the furthest pending request on the opposite side (the lowest cylinder when moving right), then keeps servicing in the same direction of travel.",
  },
  {
    id: 8,
    topic: "C-LOOK",
    question: "How does C-LOOK differ from C-SCAN at the end of a scan pass?",
    options: [
      "C-LOOK does not travel to the physical end of the disk unless a request is there",
      "C-LOOK reverses direction and services in the opposite order",
      "C-SCAN stops at the last request; C-LOOK goes to the disk end",
      "They behave identically at the disk edge",
    ],
    correctIndex: 0,
    explanation:
      "C-SCAN always travels to the end of the disk (and back to the other end) to keep scans uniform. C-LOOK only moves as far as the last pending request, which makes it faster but with slightly less uniform wait times.",
  },
  {
    id: 9,
    topic: "C-LOOK",
    question:
      "The head is at cylinder 53 and the queue contains 98, 183, 37, 122, 14, 124, 65, 67. With C-LOOK moving right, which request is serviced FIRST?",
    options: ["98", "65", "67", "37"],
    correctIndex: 1,
    explanation:
      "Moving right, C-LOOK services the nearest request at or above the head in sorted order: 65 comes first (53 → 65), then 67, 98, 122, 124, 183, then the wrap to 14 and 37.",
  },
  {
    id: 10,
    topic: "C-LOOK",
    question: "How is the total head movement of a C-LOOK schedule computed?",
    options: [
      "The highest request minus the lowest request",
      "The sum of absolute differences between consecutive head positions in the servicing sequence",
      "Twice the distance from cylinder 0 to the last cylinder",
      "The distance from the initial head to the final request only",
    ],
    correctIndex: 1,
    explanation:
      "Total head movement is the sum of |destination − source| for every move, including the wraparound jump. Every cylinder the head travels counts, one pass in each direction of travel.",
  },
  {
    id: 11,
    topic: "C-LOOK",
    question: "Why is the wraparound move in C-LOOK usually considered a 'fast' return?",
    options: [
      "It skips over cylinders with no pending requests in one jump",
      "The disk spins faster at low cylinder numbers",
      "It only moves one cylinder",
      "The OS doubles the transfer rate after a wrap",
    ],
    correctIndex: 0,
    explanation:
      "C-LOOK jumps directly to the furthest pending request on the other side instead of sweeping across the empty middle of the disk, skipping cylinders that hold no requests.",
  },
  {
    id: 12,
    topic: "C-LOOK",
    question: "A key benefit of C-LOOK (and C-SCAN) over SSTF is:",
    options: [
      "Lower total seek distance than any other algorithm",
      "More uniform waiting time, since requests are serviced in one sweeping direction",
      "It never moves the head more than once",
      "It requires no knowledge of the request queue",
    ],
    correctIndex: 1,
    explanation:
      "Shortest-Seek-Time-First can starve far requests because it always chases the nearest one. C-LOOK sweeps in one direction, so every request is guaranteed to be serviced within one pass — wait times stay bounded and uniform.",
  },
];
