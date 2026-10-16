import { useEffect, useRef, useState } from "react";
import { CATEGORIES, iso, nextChargeDate, plusDays } from "../lib/subscriptions.js";

function initial(sub) {
  if (!sub) return { name: "", price: "", cycle: "1", date: plusDays(7), cat: "Streaming", trial: false, cancel: "" };
  return {
    name: sub.name,
    price: String(sub.price),
    cycle: String(sub.cycle),
    date: iso(nextChargeDate(sub)),
    cat: sub.cat,
    trial: sub.trial,
    cancel: (sub.cancel || "").replace(/\n/g, " | "),
  };
}

export default function ChargeForm({ sub, onSave, onClose }) {
  const [f, setF] = useState(() => initial(sub));
  const [error, setError] = useState("");
  const nameRef = useRef(null);
  const sheetRef = useRef(null);
  const start = useRef(f);
  const dirty = JSON.stringify(f) !== JSON.stringify(start.current);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  useEffect(() => {
    const opener = document.activeElement;
    nameRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !sheetRef.current) return;
      // Keep Tab inside the dialog.
      const items = [...sheetRef.current.querySelectorAll("input,select,button")].filter((x) => !x.disabled);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    const name = f.name.trim();
    const price = parseFloat(f.price);
    if (!name) return setError("Enter the service name.");
    if (!(price > 0) || !Number.isFinite(price)) return setError("Enter the price as a number above 0, like 15.49.");
    if (!f.date) return setError("Pick the date of the next charge.");
    onSave({
      name,
      price,
      cycle: parseFloat(f.cycle),
      date: f.date,
      cat: f.cat,
      trial: f.trial,
      cancel: f.cancel.split("|").map((x) => x.trim()).filter(Boolean).join("\n"),
    });
  };

  return (
    <div className="scrim" onClick={(e) => e.target === e.currentTarget && !dirty && onClose()}>
      <form className="sheet" ref={sheetRef} role="dialog" aria-modal="true" aria-labelledby="sheet-title" onSubmit={submit} noValidate>
        <h2 id="sheet-title">{sub ? "Edit charge" : "Add a charge"}</h2>
        <div className="fields">
          <label className="f full">Service name<input ref={nameRef} id="f-name" maxLength={40} placeholder="e.g. Netflix" value={f.name} onChange={set("name")} /></label>
          <label className="f">Price ($)<input id="f-price" type="number" step="0.01" min="0" inputMode="decimal" placeholder="15.49" value={f.price} onChange={set("price")} /></label>
          <label className="f">Billing
            <select id="f-cycle" value={f.cycle} onChange={set("cycle")}>
              <option value="1">Monthly</option>
              <option value="12">Yearly</option>
              <option value="3">Every 3 months</option>
              <option value="0.25">Weekly</option>
            </select>
          </label>
          <label className="f">Next charge date<input id="f-date" type="date" value={f.date} onChange={set("date")} /></label>
          <label className="f">Category
            <select id="f-cat" value={f.cat} onChange={set("cat")}>
              {Object.keys(CATEGORIES).map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="check full"><input type="checkbox" id="f-trial" checked={f.trial} onChange={set("trial")} /> This is a free trial (first charge on the date above)</label>
          <label className="f full">How to cancel (optional, separate steps with |)<input id="f-cancel" placeholder="Account | Membership | Cancel" value={f.cancel} onChange={set("cancel")} /></label>
        </div>
        <p className="err" role="alert">{error}</p>
        <div className="actions">
          <button type="submit" className="btn primary">Save charge</button>
          <button type="button" className="btn" onClick={onClose}>Close</button>
        </div>
      </form>
    </div>
  );
}
