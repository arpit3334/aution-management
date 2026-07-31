import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // SPA fallback for the app's real path-based routes (/live-auction-room,
    // /ebid-list, /auction-reports, /questionnaire-templates, etc.) so a hard
    // refresh on a nested route doesn't 404 — Vite's dev server already does
    // this by default via appType: 'spa' (the default), so no extra config
    // is needed here for `npm run dev`.
  },
});
