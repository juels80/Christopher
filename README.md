# Subscription Guard (React)

Track recurring charges, see monthly and yearly totals, get warned before free trials convert, and keep cancel steps for every service.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

## Structure

```
src/
  App.jsx                 page switching (Sign up / Home / Help) and saved state
  main.jsx                entry point
  styles.css              cobalt theme and all component styles
  lib/subscriptions.js    date math, totals, categories, sample data, storage
  pages/
    SignUp.jsx            account form with validation and password meter
    Home.jsx              summary, alerts, charge list, sorting
    Help.jsx              searchable FAQ and support contact
  components/
    ChargeRow.jsx         one charge, expandable with cancel steps
    ChargeForm.jsx        add / edit bottom sheet
    TabBar.jsx            bottom navigation
    Shield.jsx            logo
```

## Notes

- Data is saved in `localStorage` (keys `subguard.v1` and `subguard.user`). Sign up is a front-end prototype; connect a real auth service before launch.
- Theme colors live at the top of `styles.css`: cobalt `#1f55d1`, background `#f3f6ff`, text `#14203d`.
