import { useState } from "react";
import Shield from "../components/Shield.jsx";

const HINTS = ["Use 8+ characters with a number.", "Weak password", "Okay password", "Strong password", "Very strong password"];

function scorePassword(v) {
  return (v.length >= 8) + /\d/.test(v) + /[A-Z]/.test(v) + /[^\w]/.test(v);
}

export default function SignUp({ onDone }) {
  const [form, setForm] = useState({ name: "", email: "", pass: "", terms: false });
  const [error, setError] = useState("");
  const score = scorePassword(form.pass);
  const meterColor = score >= 3 ? "var(--ok)" : score === 2 ? "var(--warn)" : "var(--danger)";
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return setError("Enter your first name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) return setError("Enter a valid email, like you@example.com.");
    if (form.pass.length < 8 || !/\d/.test(form.pass)) return setError("Use at least 8 characters, including a number.");
    if (!form.terms) return setError("Agree to the Terms to continue.");
    onDone({ name });
  };

  return (
    <div className="auth">
      <div className="authcard">
        <div className="brand"><Shield size={26} />Subscription Guard</div>
        <div className="hero">
          <h1 className="h-big">Stop paying for things you forgot about.</h1>
          <p>Track every recurring charge, get warned before free trials convert, and keep cancel steps in one place.</p>
          <div className="perks"><span>Trial alerts</span><span>Monthly totals</span><span>Cancel guides</span></div>
        </div>
        <form className="signup" onSubmit={submit} noValidate>
          <h2>Create your account</h2>
          <label className="f">First name<input id="su-name" autoComplete="given-name" placeholder="Chris" value={form.name} onChange={set("name")} /></label>
          <label className="f">Email<input id="su-email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set("email")} /></label>
          <label className="f">Password<input id="su-pass" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={form.pass} onChange={set("pass")} /></label>
          <div className="meter" aria-hidden="true"><i style={{ width: `${score * 25}%`, background: meterColor }} /></div>
          <span className="hint">{HINTS[score]}</span>
          <label className="check"><input type="checkbox" id="su-terms" checked={form.terms} onChange={set("terms")} /> I agree to the Terms and Privacy Policy</label>
          <p className="err" role="alert">{error}</p>
          <button className="btn primary wide" type="submit">Create account</button>
          <button className="btn wide" type="button" onClick={() => onDone({ name: "" })}>Explore with sample data</button>
          <p className="note">Prototype: your details stay on this device and no account is created on a server.</p>
        </form>
      </div>
    </div>
  );
}
