# Subscription Guard (React)

Track recurring charges, see monthly and yearly totals, get warned before free trials convert, and keep cancel steps for every service. Built mobile-first; it also lays out in two columns on desktop.

## Run it

Requires Node 20.19+ or 22.12+ (Vite 8).

```bash
npm install
npm run dev      # local dev server
npm test         # unit tests (date math, totals, saved-data checks)
npm run build    # production build in dist/
```

## Structure

```
src/
  App.jsx                 page switching (Sign up / Home / Help) and saved state
  main.jsx                entry point, bundled fonts
  styles.css              cobalt theme, component styles, breakpoints
  lib/subscriptions.js    date math, totals, categories, sample data, saved-data checks, storage
  lib/*.test.js           Vitest tests
  pages/
    SignUp.jsx            account form with validation and password meter
    Home.jsx              summary, alerts, charge list, canceled list, sorting
    Help.jsx              searchable FAQ and support contact
    Legal.jsx, Terms.jsx, Privacy.jsx   terms and privacy policy pages
  components/
    ChargeRow.jsx         one charge, expandable with cancel steps
    ChargeForm.jsx        add / edit bottom sheet
    TabBar.jsx            bottom navigation
    Shield.jsx            logo
```

## How totals work

- Yearly plans are divided by 12, quarterly by 3, weekly plans use 52 / 12 months.
- Recurring spend counts active charges only. Free trials that haven't converted are shown separately ("+ $X/mo if your trial converts"), and canceled charges are left out and counted as savings.
- A trial whose first-charge date has passed is treated as a regular subscription.
- Monthly bills on the 29th-31st clamp to the last day of shorter months without drifting.

## Notes

- Data is saved in `localStorage` (keys `subguard.v1` and `subguard.user`). Signing out clears it. Malformed saved records are dropped on load. Sign up is a front-end prototype; connect a real auth service before launch.
- Fonts are bundled with the app (`@fontsource`), so the page makes no third-party requests.
- The Help page shows a support email only when `VITE_SUPPORT_EMAIL` is set. Copy `.env.example` to `.env` and fill it in.
- `Terms of Service` and `Privacy Policy` pages (`src/pages/Terms.jsx`, `Privacy.jsx`) are linked from sign-up and Help. They describe the app as it works today (everything stays on the device). **Have a lawyer review them before a commercial launch, and rewrite them if you add accounts, sync, analytics, payments or bank connections.**
- Set `VITE_LEGAL_NAME`, `VITE_SUPPORT_EMAIL` and optionally `VITE_GOVERNING_LAW` in `.env` to put your name, contact and governing law into those pages. Anything left empty is omitted.
- Theme colors live at the top of `styles.css`: cobalt `#1f55d1`, background `#f3f6ff`, text `#14203d`.
