import { CATEGORIES, cycleLabel, isActiveTrial, money, monthlyCost } from "../lib/subscriptions.js";

export default function ChargeRow({ sub, date, days, open, confirming, onToggle, onEdit, onAskRemove, onRemove, onKeep }) {
  const [bg, fg] = CATEGORIES[sub.cat] || CATEGORIES.Other;
  const steps = (sub.cancel || "").split("\n").filter(Boolean);
  const dateText = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const trial = isActiveTrial(sub);
  let pill;
  if (trial) pill = <span className="pill trial">Trial · {days}d left</span>;
  else if (days <= 3) pill = <span className="pill soon">{days === 0 ? "Today" : `${days}d`}</span>;
  else pill = <span className="pill">{days}d</span>;

  return (
    <li>
      <button className="row" aria-expanded={open} onClick={onToggle}>
        <span className="mono" style={{ background: bg, color: fg }}>{sub.name[0].toUpperCase()}</span>
        <span className="meta">
          <strong>{sub.name}</strong>
          <span>
            <span className="cat" style={{ background: bg, color: fg }}>{sub.cat}</span>
            {trial ? "first charge" : "next"} {dateText}
          </span>
        </span>
        <span className="price">
          <span className="num">{money(sub.price)}<span className="per">{cycleLabel(sub.cycle)}</span></span>
          {pill}
        </span>
      </button>
      {open && (
        <div className="detail">
          <div>
            <span className="label">How to cancel</span>
            {steps.length ? (
              <ol>{steps.map((t) => <li key={t}>{t}</li>)}</ol>
            ) : (
              <p className="muted">No steps saved. Edit to add them.</p>
            )}
          </div>
          <div>
            <span className="label">Costs you</span>{" "}
            <span className="num">{money(monthlyCost(sub))}</span>/month ·{" "}
            <span className="num">{money(monthlyCost(sub) * 12)}</span>/year
          </div>
          <div className="actions">
            {confirming ? (
              <>
                <button className="btn danger" onClick={onRemove}>Yes, remove it</button>
                <button className="btn" onClick={onKeep}>Keep</button>
              </>
            ) : (
              <>
                <button className="btn" onClick={onEdit}>Edit</button>
                <button className="btn danger" onClick={onAskRemove}>Mark canceled</button>
              </>
            )}
          </div>
        </div>
      )}
    </li>
  );
}
