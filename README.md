# Auction Module — Standard Vite + React + TypeScript App

This is a normal, standard Node/React project (`package.json`, Vite, real
`lucide-react` dependency) — not the hand-rolled sandbox bundler from
earlier. Same app, same routing, same data, just built with ordinary
tooling this time.

## Why you need to run this yourself

This session runs in a sandboxed cloud environment with **no access to the
npm package registry** (an organization network policy blocks
`registry.npmjs.org` and every CDN mirror). That means `npm install` cannot
be run here, so this project has been prepared and syntax-checked but
**not actually installed or built** in this session — you'll need to run
the two commands below on your own machine, where normal internet access
works.

## Run it

    npm install
    npm run dev

Then open the URL Vite prints (defaults to **http://localhost:5173**).

- `npm run dev` — starts the Vite dev server (fast refresh, source maps).
- `npm run build` — type-checks with `tsc` then produces an optimized
  production build in `dist/`.
- `npm run preview` — serves that production build locally, so you can
  sanity-check the real build output.

Requires Node.js 18+ (Node 20/22 recommended) and npm.

## What's in here

- `src/AuctionModule.tsx` — the app shell, sidebar, hand-rolled History API
  routing (`/`, `/create`, `/ebid-list`, `/live-auction-room`,
  `/compare-bids`, `/auction-reports`, `/questionnaire-templates`,
  `/vendor-submit`, plus `/live-auction-room/<auctionId>`), and the original
  ported views (create / per-auction evaluation detail / evaluation gates /
  vendor portal). The original custom CSS design system (not Tailwind) is
  preserved and injected via a `<style>` tag.
- `src/Dashboard.tsx` — the `/` route: portfolio KPIs, by-status cards, and
  the upcoming-auctions table, matching the HTML's dashboard exactly.
- `src/eBidList.tsx` — the `/ebid-list` route ("Auction" in the sidebar):
  the full 29-row auction list with search/status/category filters.
- `src/LiveAuctionRoom.tsx` — the `/live-auction-room` route: all 9 auction
  formats (Dynamic reverse, Sealed bid, Two-envelope, Multi-attribute,
  Hybrid RFQ, BAFO, Negotiation, English, Dutch) as switchable "Preview
  format" tabs, each with its own live data sourced from the HTML.
- `src/CompareBids.tsx` — the `/compare-bids` route: the AUC-2025-0041 bid
  comparison detail page (5 tabs: supplier ranking, item-wise, bid history,
  auction progression, questionnaire comparison).
- `src/AuctionReports.tsx`, `src/QuestionnaireTemplates.tsx` — the
  `/auction-reports` and `/questionnaire-templates` routes.
- `src/main.tsx` — mounts the app into `#root`.
- Icons come from the real `lucide-react` package (listed in
  `package.json`) for everything with a standard lucide equivalent.
  `src/custom-icons.tsx` holds the handful of icons that aren't in
  lucide-react — 4 sidebar icons and 4 report-card icons — hand-authored as
  exact copies of the HTML's own inline SVGs so those shapes match pixel
  for pixel instead of using a "close enough" lucide substitute.
- All data across every page was cross-checked against
  `Auction_Module_v2_4_4.html` and against the user's own screenshots of the
  running prototype (dashboard, auction list, live auction, compare bids,
  reports, questionnaire templates, supplier view) to make sure the sidebar
  navigation and every number/row on screen match exactly.

## Routing note

There's no `react-router-dom` here on purpose — the app already had a
small, working hand-rolled router on the History API (`pushState` +
`popstate`) from earlier in this project, so it was kept as-is rather than
swapped out. Vite's dev server serves any path as `index.html` by default
(SPA fallback), so hard-refreshing a nested route like
`/live-auction-room/AUC-2025-0041` works out of the box with `npm run dev`.
If you deploy the `npm run build` output somewhere (Vercel, Netlify, nginx,
S3+CloudFront, etc.), make sure that platform's rewrite-to-index.html rule
is turned on for the same reason.

## Sandbox-only leftovers

The `auction-app/` folder from earlier in this conversation (hand-rolled
`build.js` bundler + `lucide-shim.tsx`) was a workaround for this sandbox's
network restriction and is no longer needed once you're running this
project locally — this Vite project supersedes it.
