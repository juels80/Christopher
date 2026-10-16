import { afterEach, describe, expect, it, vi } from "vitest";
import { isActiveTrial, sanitizeSubs, summarize } from "./subscriptions.js";

const at = (y, m, d) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(y, m - 1, d, 12, 0, 0));
};
const sub = (over) => ({ id: 1, name: "X", price: 10, cycle: 1, date: "2026-10-20", cat: "Other", trial: false, cancel: "", ...over });

afterEach(() => {
  vi.useRealTimers();
});

describe("summarize", () => {
  it("separates trials and excludes canceled charges", () => {
    at(2026, 10, 16);
    const t = summarize([
      sub({ id: 1, price: 10 }),
      sub({ id: 2, price: 120, cycle: 12 }),
      sub({ id: 3, price: 6, trial: true, date: "2026-10-18" }),
      sub({ id: 4, price: 50, canceled: "2026-10-01" }),
    ]);
    expect(t.liveCount).toBe(3);
    expect(t.monthly).toBe(20); // 10 + 120/12, trial and canceled left out
    expect(t.trialCount).toBe(1);
    expect(t.trialMonthly).toBe(6);
    expect(t.savedMonthly).toBe(50);
  });

  it("counts canceled items nowhere in the next 30 days", () => {
    at(2026, 10, 16);
    expect(summarize([sub({ price: 10 })]).next30).toBe(10);
    expect(summarize([sub({ price: 10, canceled: "2026-10-10" })]).next30).toBe(0);
  });

  it("includes a converted trial in the recurring total", () => {
    at(2026, 10, 16);
    expect(summarize([sub({ trial: true, date: "2026-10-10", price: 9 })]).monthly).toBe(9);
  });

  it("handles an empty list", () => {
    expect(summarize([])).toMatchObject({ liveCount: 0, monthly: 0, trialCount: 0, next30: 0, savedMonthly: 0 });
  });
});

describe("isActiveTrial", () => {
  it("is false once canceled", () => {
    at(2026, 10, 16);
    expect(isActiveTrial(sub({ trial: true, canceled: "2026-10-15" }))).toBe(false);
  });
});

describe("sanitizeSubs", () => {
  it("returns null when the saved value is not a list", () => {
    expect(sanitizeSubs(null)).toBeNull();
    expect(sanitizeSubs({})).toBeNull();
    expect(sanitizeSubs("x")).toBeNull();
  });

  it("keeps good records and drops malformed ones", () => {
    const good = sub({ id: 5, name: " Netflix ", cat: "Streaming" });
    const out = sanitizeSubs([
      good,
      null,
      sub({ id: 6, name: "" }),
      sub({ id: 7, price: NaN }),
      sub({ id: 8, price: -1 }),
      sub({ id: 9, cycle: 7 }),
      sub({ id: 10, date: "not-a-date" }),
      sub({ id: 11, date: "2026-13-45" }),
      { name: "No id", price: 1, cycle: 1, date: "2026-10-20" },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ id: 5, name: "Netflix", cat: "Streaming" });
  });

  it("normalizes unknown categories, long names and bad canceled dates", () => {
    const [s] = sanitizeSubs([sub({ cat: "Weird", name: "x".repeat(80), canceled: "nope" })]);
    expect(s.cat).toBe("Other");
    expect(s.name).toHaveLength(40);
    expect(s).not.toHaveProperty("canceled");
  });

  it("keeps a valid canceled date", () => {
    const [s] = sanitizeSubs([sub({ canceled: "2026-10-01" })]);
    expect(s.canceled).toBe("2026-10-01");
  });

  it("accepts an empty list", () => {
    expect(sanitizeSubs([])).toEqual([]);
  });
});
