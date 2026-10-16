// Date, money and storage helpers shared by every page.
export const DAY = 864e5;

export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

const pad = (n) => String(n).padStart(2, "0");
// Local calendar date (toISOString would shift it by the UTC offset).
export const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const plusDays = (n) => {
  const d = startOfToday();
  d.setDate(d.getDate() + n);
  return iso(d);
};

export const money = (n) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// cycle is in months: 1 monthly, 3 quarterly, 12 yearly, 0.25 weekly
const WEEKLY = 0.25;
export const monthlyCost = (s) => (s.cycle === WEEKLY ? (s.price * 52) / 12 : s.price / s.cycle);
export const cycleLabel = (c) => ({ 1: "/mo", 12: "/yr", 3: "/3 mo", 0.25: "/wk" }[c] || "");

export const parseDate = (str) => new Date(str + "T00:00:00");

// The nth charge after `start`, always counted from the original date so a
// 31st-of-the-month bill clamps to month end instead of drifting (Jan 31 -> Feb 28 -> Mar 31).
function nthCharge(start, cycle, n) {
  if (cycle === WEEKLY) {
    const d = new Date(start);
    d.setDate(d.getDate() + 7 * n);
    return d;
  }
  const d = new Date(start.getFullYear(), start.getMonth() + cycle * n, 1);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(start.getDate(), lastDay));
  return d;
}

// A trial whose first-charge date hasn't passed yet (and that isn't canceled).
export const isActiveTrial = (s) => !s.canceled && s.trial && parseDate(s.date) >= startOfToday();

// First charge on or after today, plus its index in the series.
function firstUpcoming(s) {
  const today = startOfToday();
  const start = parseDate(s.date);
  let n = 0;
  let d = start;
  while (d < today && n < 600) d = nthCharge(start, s.cycle, ++n);
  return { start, n, d };
}

// Rolls a past date forward to the next upcoming charge. A trial whose date has
// passed has converted, so it rolls forward like any other subscription.
export const nextChargeDate = (s) => firstUpcoming(s).d;

export const daysUntil = (d) => Math.round((d - startOfToday()) / DAY);

export function dueInNext30(subs) {
  const end = new Date(startOfToday().getTime() + 30 * DAY);
  let total = 0;
  subs.forEach((s) => {
    let { start, n, d } = firstUpcoming(s);
    for (let i = 0; d <= end && i < 10; i++) {
      total += s.price;
      d = nthCharge(start, s.cycle, ++n);
    }
  });
  return total;
}

// Totals shown on Home. Canceled charges are excluded; unconverted trials are
// reported separately so they don't inflate the recurring figure.
export function summarize(subs) {
  const live = subs.filter((s) => !s.canceled);
  const trials = live.filter(isActiveTrial);
  const paying = live.filter((s) => !isActiveTrial(s));
  const sum = (list) => list.reduce((a, s) => a + monthlyCost(s), 0);
  return {
    liveCount: live.length,
    monthly: sum(paying),
    trialCount: trials.length,
    trialMonthly: sum(trials),
    next30: dueInNext30(live),
    savedMonthly: sum(subs.filter((s) => s.canceled)),
  };
}

export const CATEGORIES = {
  Streaming: ["#ffe3ea", "#b0123a"],
  Software: ["#e7e1ff", "#4a2fc0"],
  Music: ["#dcf6ec", "#0d7a55"],
  Fitness: ["#ffefd9", "#a34a00"],
  News: ["#d9f4ff", "#0b5f86"],
  Utilities: ["#fff6c7", "#7a5a00"],
  Other: ["#eceaf3", "#4a4766"],
};

export const SAMPLE_SUBS = () => [
  { id: 1, name: "Netflix", price: 15.49, cycle: 1, date: plusDays(4), cat: "Streaming", trial: false, cancel: "Account › Membership › Cancel membership", sample: true },
  { id: 2, name: "Adobe Creative Cloud", price: 59.99, cycle: 1, date: plusDays(12), cat: "Software", trial: false, cancel: "account.adobe.com › Plans › Manage plan › Cancel your plan\nWatch for the early-termination fee on annual plans", sample: true },
  { id: 3, name: "Figma Professional", price: 144, cycle: 12, date: plusDays(57), cat: "Software", trial: false, cancel: "Team settings › Billing › Downgrade to Starter", sample: true },
  { id: 4, name: "Peloton App", price: 12.99, cycle: 1, date: plusDays(2), cat: "Fitness", trial: true, cancel: "Settings › Subscriptions › Cancel before trial ends", sample: true },
  { id: 5, name: "Spotify Premium", price: 11.99, cycle: 1, date: plusDays(19), cat: "Music", trial: false, cancel: "spotify.com/account › Manage plan › Cancel Premium", sample: true },
];

const CYCLES = [1, 3, 12, 0.25];
const DATE_RE = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
// Also rejects impossible dates like 2026-02-31, which Date would silently roll over.
const validDate = (s) => typeof s === "string" && DATE_RE.test(s) && iso(parseDate(s)) === s;

// Drops malformed entries from saved data so a bad record can't break the page.
// Returns null when the saved value isn't a list at all.
export function sanitizeSubs(list) {
  if (!Array.isArray(list)) return null;
  return list
    .filter(
      (s) =>
        s &&
        typeof s.name === "string" &&
        s.name.trim() &&
        Number.isFinite(s.price) &&
        s.price >= 0 &&
        CYCLES.includes(s.cycle) &&
        validDate(s.date) &&
        Number.isFinite(s.id)
    )
    .map((s) => ({
      id: s.id,
      name: s.name.trim().slice(0, 40),
      price: s.price,
      cycle: s.cycle,
      date: s.date,
      cat: s.cat in CATEGORIES ? s.cat : "Other",
      trial: Boolean(s.trial),
      cancel: typeof s.cancel === "string" ? s.cancel : "",
      ...(s.sample ? { sample: true } : {}),
      ...(validDate(s.canceled) ? { canceled: s.canceled } : {}),
    }));
}

// localStorage wrapper that never throws (private mode, blocked storage).
export const store = {
  get(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};
