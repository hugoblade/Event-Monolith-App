```markdown
# Timezone Clocks (React + TypeScript + Vite)

A minimal React app that shows a digital clock for multiple IANA time zones, with persistence and a 12/24-hour toggle.

Quick start:

1. Install dependencies
   npm install

2. Start dev server
   npm run dev

Open http://localhost:5173

Features
- Default list of common zones
- Add or remove zones by IANA name (e.g., "Europe/Berlin")
- 12/24-hour toggle (persisted)
- Persists chosen zones in localStorage

Notes
- Browser must support Intl and IANA time zones (modern browsers do).
- If validation fails adding a timezone, check for typos or consult the IANA tz database names.
```
