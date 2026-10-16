import { useCallback, useMemo, useState } from "react";
import Shield from "../components/Shield.jsx";
import ChargeRow from "../components/ChargeRow.jsx";
import ChargeForm from "../components/ChargeForm.jsx";
import { cycleLabel, daysUntil, dueInNext30, isActiveTrial, money, monthlyCost, nextChargeDate } from "../lib/subscriptions.js";

function whenText(n) {
  return n === 0 ? "today" : n === 1 ? "tomorrow" : `in ${n} days`;
}

export default function Home({ user, subs, setSubs, onSignOut }) {
  const [sort, setSort] = useState("date");
  const [openId, setOpenId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [editing, setEditing] = useState(null); // null = closed, "new" or a sub

  const rows = useMemo(() => {
    const r = subs.map((s) => {
      const date = nextChargeDate(s);
      return { s, date, days: daysUntil(date) };
    });
    r.sort(sort === "date" ? (a, b) => a.date - b.date : (a, b) => monthlyCost(b.s) - monthlyCost(a.s));
    return r;
  }, [subs, sort]);

  const monthly = subs.reduce((a, s) => a + monthlyCost(s), 0);
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
  const remove = (id) => {
    setSubs(subs.filter((s) => s.id !== id));
    setOpenId(null);
    setConfirmId(null);
  };

  return (
    <>
      <div className="wrap home">
        <header>
          <h1><Shield />Subscription Guard</h1>
          <div className="who">
            <span>{user.name ? `Hi, ${user.name}` : "Guest"}</span>
            <button className="link" onClick={onSignOut}>Sign out</button>
          </div>
        </header>

        <section className="summary" aria-label="Spending summary">
          <div>
            <div className="label">Recurring spend per month</div>
            <div className="big num">{money(monthly)}</div>
          </div>
          <div className="stats">
            <div><span className="label">Per year</span><span className="num">{money(monthly * 12)}</span></div>
            <div><span className="label">Next 30 days</span><span className="num">{money(dueInNext30(subs))}</span></div>
            <div><span className="label">Active</span><span className="num">{subs.length}</span></div>
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
              <ChargeRow
                key={s.id}
                sub={s}
                date={date}
                days={days}
                open={openId === s.id}
                confirming={confirmId === s.id}
                onToggle={() => { setOpenId(openId === s.id ? null : s.id); setConfirmId(null); }}
                onEdit={() => setEditing(s)}
                onAskRemove={() => setConfirmId(s.id)}
                onRemove={() => remove(s.id)}
                onKeep={() => setConfirmId(null)}
              />
            ))}
          </ul>
          <p className="note">
            {subs.some((s) => s.sample)
              ? "Sample charges shown. Remove them and add your own; your list stays in this browser."
              : "Your list is saved in this browser only."}
          </p>
        </section>
      </div>

      {editing && <ChargeForm sub={editing === "new" ? null : editing} onSave={save} onClose={closeForm} />}
    </>
  );
}
