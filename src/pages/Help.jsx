import { useState } from "react";
import Shield from "../components/Shield.jsx";

const FAQ = [
  ["Getting started", "How do I add a subscription?", "Tap + Add charge on Home. Enter the service name, price, how often it bills and the date of the next charge. Tick the free-trial box if you haven't paid yet."],
  ["Trials", "When will I be warned about a free trial?", "Trials show in the warning strip 7 days before they convert, with a countdown on the charge itself. Cancel inside the service before that date to avoid paying."],
  ["Trials", "What happens after a trial converts?", "Nothing to do. Once the first-charge date passes, it is treated as a regular subscription and rolls forward every billing cycle. You can also edit it and untick the free-trial box to tidy it up."],
  ["Canceling", "How do I cancel a subscription?", "Tap the charge on Home to see its saved cancel steps. Subscription Guard can't cancel for you; follow the steps in the service's own app or website, then tap Mark canceled. It moves to your Canceled list, drops out of your totals and counts toward what you're saving. You can restore or delete it from there."],
  ["Canceling", "Where do I find cancel steps for a service?", "Most services keep it under Account, Billing or Membership. Search the service's help site for 'cancel', then save the steps with Edit so they're ready next time."],
  ["Totals", "How is my monthly total calculated?", "Yearly plans are divided by 12, quarterly by 3 and weekly charges are converted to an average month (52 weeks / 12). Canceled charges and free trials that haven't converted yet are left out; trials are shown separately as what you'd pay if they convert. The yearly figure is the monthly total times 12."],
  ["Totals", "What does 'Next 30 days' include?", "Every active charge due in the next 30 days, counted each time it bills, including the first charge of a free trial. A weekly plan can appear four or five times."],
  ["Account", "Is my data private?", "In this prototype your list and name stay in this browser on this device. Nothing is sent to a server and no third-party fonts or trackers are loaded. Signing out or clearing site data removes it."],
  ["Account", "Does it connect to my bank?", "Not yet. You add charges by hand, so we never see your bank login or card numbers."],
];

// Set VITE_SUPPORT_EMAIL (see .env.example) to show a support address.
const EMAIL = import.meta.env.VITE_SUPPORT_EMAIL;

export default function Help() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");
  const q = query.trim().toLowerCase();
  const hits = FAQ.filter((f) => !q || f.join(" ").toLowerCase().includes(q));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied("Copied");
    } catch {
      setCopied("Select the email to copy it");
    }
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="wrap">
      <header><h1><Shield />Help</h1></header>
      <section className="helphero">
        <h2>How can we help?</h2>
        <input id="h-search" type="search" placeholder="Search questions, e.g. trial" value={query} onChange={(e) => setQuery(e.target.value)} />
      </section>
      <section className="qs">
        {hits.map(([cat, question, answer]) => (
          <details key={question}>
            <summary><span><span className="qcat">{cat}</span><br />{question}</span></summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>
      {hits.length === 0 && <p className="empty">No matching questions. Try another word or contact us below.</p>}
      <section className="contact">
        <h2>Still stuck?</h2>
        {EMAIL ? (
          <>
            <p>Email our support team.</p>
            <div className="copyrow">
              <a className="num selectable" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <button className="btn" onClick={copy}>{copied || "Copy email"}</button>
            </div>
          </>
        ) : (
          <p>Support contact isn't set up yet. Check the questions above.</p>
        )}
      </section>
    </div>
  );
}
