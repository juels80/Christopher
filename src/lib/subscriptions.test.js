import { afterEach, describe, expect, it, vi } from "vitest";
import {
  daysUntil, dueInNext30, isActiveTrial, iso, monthlyCost, nextChargeDate, plusDays,
} from "./subscriptions.js";

// Pin "today" to local noon so tests don't depend on when they run.
const at = (y, m, d) => vi.setSystemTime(new Date(y, m - 1, d, 12, 0, 0));
const next = (date, cycle, trial = false) => iso(nextChargeDate({ date, cycle, trial }));

afterEach(() => {
  vi.useRealTimers();
});

describe("month-end billing", () => {
  it("clamps to month end without drifting", () => {
    vi.useFakeTimers();
    at(2026, 2, 1);
    expect(next("2026-01-31", 1)).toBe("2026-02-28");
    at(2026, 3, 1);
    expect(next("2026-01-31", 1)).toBe("2026-03-31");
    at(2026, 4, 1);
    expect(next("2026-01-31", 1)).toBe("2026-04-30");
  });

  it("handles quarterly and leap-day yearly plans", () => {
    vi.useFakeTimers();
    at(2026, 2, 1);
    expect(next("2026-01-31", 3)).toBe("2026-04-30");
    at(2025, 1, 1);
    expect(next("2024-02-29", 12)).toBe("2025-02-28");
    at(2028, 1, 1);
    expect(next("2024-02-29", 12)).toBe("2028-02-29");
  });

  it("returns a future date unchanged and today as today", () => {
    vi.useFakeTimers();
    at(2026, 10, 16);
    expect(next("2026-12-25", 1)).toBe("2026-12-25");
    expect(next("2026-10-16", 1)).toBe("2026-10-16");
  });

  it("rolls weekly plans in 7-day steps", () => {
    vi.useFakeTimers();
    at(2026, 10, 16);
    expect(next("2026-10-01", 0.25)).toBe("2026-10-22");
  });
});

describe("monthlyCost", () => {
  it("converts each cycle to a monthly figure", () => {
    expect(monthlyCost({ price: 10, cycle: 1 })).toBe(10);
    expect(monthlyCost({ price: 120, cycle: 12 })).toBe(10);
    expect(monthlyCost({ price: 30, cycle: 3 })).toBe(10);
    expect(monthlyCost({ price: 10, cycle: 0.25 })).toBeCloseTo(43.3333, 3);
  });
});

describe("trials", () => {
  it("is active only until its first-charge date has passed", () => {
    vi.useFakeTimers();
    at(2026, 10, 16);
    expect(isActiveTrial({ trial: true, date: "2026-10-18" })).toBe(true);
    expect(isActiveTrial({ trial: true, date: "2026-10-16" })).toBe(true);
    expect(isActiveTrial({ trial: true, date: "2026-10-13" })).toBe(false);
    expect(isActiveTrial({ trial: false, date: "2026-10-18" })).toBe(false);
  });

  it("rolls a converted trial forward instead of reporting negative days", () => {
    vi.useFakeTimers();
    at(2026, 10, 16);
    const d = nextChargeDate({ trial: true, date: "2026-10-13", cycle: 1 });
    expect(iso(d)).toBe("2026-11-13");
    expect(daysUntil(d)).toBeGreaterThan(0);
  });
});

describe("dueInNext30", () => {
  it("counts every occurrence in the window", () => {
    vi.useFakeTimers();
    at(2026, 10, 16);
    const subs = [
      { price: 10, cycle: 0.25, date: "2026-10-17" }, // 17, 24, 31, Nov 7, Nov 14 = 5
      { price: 5, cycle: 1, date: "2026-01-31" },     // Oct 31 = 1
      { price: 100, cycle: 12, date: "2026-12-01" },  // outside window
    ];
    expect(dueInNext30(subs)).toBe(55);
  });

  it("counts a converted trial once, at its next charge, not its past date", () => {
    vi.useFakeTimers();
    at(2026, 10, 16);
    expect(dueInNext30([{ trial: true, price: 12, cycle: 1, date: "2026-10-10" }])).toBe(12); // Nov 10 only
  });
});

// The old iso() used toISOString (UTC), which shifted dates in zones ahead of UTC.
describe.each(["Pacific/Auckland", "Asia/Kolkata", "America/Los_Angeles", "UTC"])("timezone %s", (tz) => {
  it("keeps local calendar dates", () => {
    const prev = process.env.TZ;
    process.env.TZ = tz;
    try {
      vi.useFakeTimers();
      at(2026, 10, 16);
      expect(plusDays(0)).toBe("2026-10-16");
      expect(plusDays(4)).toBe("2026-10-20");
      expect(iso(nextChargeDate({ date: "2026-10-16", cycle: 1 }))).toBe("2026-10-16");
    } finally {
      if (prev === undefined) delete process.env.TZ;
      else process.env.TZ = prev;
    }
  });
});

describe("DST", () => {
  it("plusDays stays on the right date across a DST change", () => {
    vi.useFakeTimers();
    const prev = process.env.TZ;
    process.env.TZ = "America/New_York";
    try {
      at(2026, 10, 30);
      expect(plusDays(3)).toBe("2026-11-02"); // clocks fall back Nov 1
    } finally {
      if (prev === undefined) delete process.env.TZ;
      else process.env.TZ = prev;
    }
  });
});
