// Details shown in the Terms and Privacy Policy. Set these in .env (see .env.example).
// Anything left empty is simply left out of the text rather than showing a placeholder.
export const LEGAL = {
  updated: "October 16, 2026",
  // Who operates the app. Use your own name or business name.
  name: import.meta.env.VITE_LEGAL_NAME || "Subscription Guard",
  // Where people can reach you about these documents.
  email: import.meta.env.VITE_SUPPORT_EMAIL || "",
  // e.g. "the State of Texas, USA". If empty, no governing-law clause is shown.
  law: import.meta.env.VITE_GOVERNING_LAW || "",
};
