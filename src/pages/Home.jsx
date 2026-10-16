import { useCallback, useMemo, useState } from "react";
import Shield from "../components/Shield.jsx";
import ChargeRow from "../components/ChargeRow.jsx";
import ChargeForm from "../components/ChargeForm.jsx";
import {
  cycleLabel, daysUntil, iso, isActiveTrial, money, monthlyCost, nextChargeDate, parseDate, startOfToday, summarize,
} from "../lib/subscriptions.js";

function whenText(n) {
  return n === 0 ? "today" : n === 1 ? "tomorrow" : `in ${n} days`;
}

export default function Home({ user, subs, setSubs, onSignOut }) {
  const [sort, setSort] = useState("date");
  const [openId, setOpenId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [confirmOut, setConfirmOut] = useState(false);
  const [editing, setEditing] = useState(null); // null = closed, "new" or a sub

  const { rows, canceledRows } = useMemo(() => {
    const live = subs
      .filter((s) => !s.canceled)
      .map((s) => {
        const date = nextChargeDate(s);
        return { s, date, days: daysUntil(date) };
      });
    live.sort(sort === "date" ? (a, b) => a.date - b.date : (a, b) => monthlyCost(b.s) - monthlyCost(a.s));
    const gone = subs
      .filter((s) => s.canceled)
      .map((s) => ({ s, date: parseDate(s.canceled), days: 0 }))
      .sort((a, b) => b.date - a.date);
    return { rows: live, canceledRows: gone };
  }, [subs, sort]);

  const totals = summarize(subs);
  const alerts = rows
    .filter(({ s, days }) => days >= 0 && (isActiveTrial(s) ? days <= 7 : days <= 3))
    .sort((a, b) => a.days - b.days);

  const closeForm = useCallback(() => setEditing(null), []);
  const save = (rec) => {
    if (editing && editing !== "new") {
      setSubs(subs.map((s) => (s.id === editing.id ? { ...s, ...rec, sample: false } : s)));
    } else {
      setSubs([...subs, { id: Date.now(), ...rec }]);
    }
    setEditing(null);
  };
  const cancel = (id) => {
    setSubs(subs.map((s) => (s.id === id ? { ...s, canceled: iso(startOfToday()) } : s)));
    setOpenId(null);
  };
  const restore = (id) => {
    setSubs(
      subs.map((s) => {
        if (s.id !== id) return s;
        const { canceled, ...rest } = s;
        return rest;
      })
    );
    setOpenId(null);
  };
  const remove = (id) => {
    setSubs(subs.filter((s) => s.id !== id));
    setOpenId(null);
    setConfirmId(null);
  };

  const rowProps = (s) => ({
    open: openId === s.id,
    confirming: confirmId === s.id,
    onToggle: () => { setOpenId(openId === s.id ? null : s.id); setConfirmId(null); },
    onEdit: () => setEditing(s),
    onCancel: () => cancel(s.id),
    onRestore: () => restore(s.id),
    onAskRemove: () => setConfirmId(s.id),
    onRemove: () => remove(s.id),
    onKeep: () => setConfirmId(null),
  });

  return (
    <>
      <div className="wrap home">
        <header>
          <h1><Shield />Subscription Guard</h1>
          <div className="who">
            <span>{user.name ? `Hi, ${user.name}` : "Guest"}</span>
            <button className="link" onClick={() => setConfirmOut(true)}>Sign out</button>
          </div>
          {confirmOut && (
            <div className="signout-confirm" role="alertdialog" aria-label="Confirm sign out">
              <p>Signing out removes your saved charges from this device.</p>
              <div className="actions">
                <button className="btn danger" onClick={onSignOut}>Sign out and clear</button>
                <button className="btn" onClick={() => setConfirmOut(false)}>Stay signed in</button>
              </div>
            </div>
          )}
        </header>

        <section className="summary" aria-label="Spending summary">
          <div>
            <div className="label">Recurring spend per month</div>
            <div className="big num">{money(totals.monthly)}</div>
            {totals.trialCount > 0 && (
              <div className="trialnote">
                + {money(totals.trialMonthly)}/mo if {totals.trialCount === 1 ? "your free trial converts" : `your ${totals.trialCount} free trials convert`}
              </div>
            )}
          </div>
          <div className="stats">
            <div><span className="label">Per year</span><span className="num">{money(totals.monthly * 12)}</span></div>
            <div><span className="label">Next 30 days</span><span className="num">{money(totals.next30)}</span></div>
            <div><span className="label">Active</span><span className="num">{totals.liveCount}</span></div>
          </div>
        </section>

        {alerts.length > 0 && (
          <section className="alerts" aria-label="Warnings">
            {alerts.map(({ s, days }) => (
              <div className="alert" key={s.id}>
                <span className="dot" />
                {isActiveTrial(s) ? (
                  <div><b>{s.name} trial converts {whenText(days)}</b> to {money(s.price)}{cycleLabel(s.cycle)}. Cancel now if you don't want it.</div>
                ) : (
                  <div><b>{s.name}</b> charges {money(s.price)} {whenText(days)}.</div>
                )}
              </div>
            ))}
          </section>
        )}

        <section className="listwrap">
          <div className="listhead">
            <h2>Charges</h2>
            <button className="btn primary" onClick={() => setEditing("new")}>+ Add charge</button>
          </div>
          <div className="seg" role="group" aria-label="Sort">
            <button aria-pressed={sort === "date"} onClick={() => setSort("date")}>By date</button>
            <button aria-pressed={sort === "cost"} onClick={() => setSort("cost")}>By cost</button>
          </div>
          <ul className="list">
            {rows.length === 0 && (
              <li className="empty">No charges yet. Tap <b>+ Add charge</b> to track your first subscription.</li>
            )}
            {rows.map(({ s, date, days }) => (
              <ChargeRow key={s.id} sub={s} date={date} days={days} {...rowProps(s)} />
            ))}
          </ul>
          <p className="note">
            {subs.some((s) => s.sample)
              ? "Sample charges shown. Remove them and add your own; your list stays in this browser."
              : "Your list is saved in this browser only."}
          </p>

          {canceledRows.length > 0 && (
            <div className="canceledwrap">
              <div className="listhead">
                <h2>Canceled ({canceledRows.length})</h2>
                <span className="saving">Saving {money(totals.savedMonthly * 12)}/yr</span>
              </div>
              <ul className="list is-canceled">
                {canceledRows.map(({ s, date }) => (
                  <ChargeRow key={s.id} sub={s} date={date} days={0} canceled {...rowProps(s)} />
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      {editing && <ChargeForm sub={editing === "new" ? null : editing} onSave={save} onClose={closeForm} />}
    </>
  );
}
