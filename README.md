# BlogSphere

A lightweight full-stack blogging platform. Browse, search, and filter articles by
category, publish new posts with a cover image, and edit or delete your own posts.

**Live URL:** `<add your deployed frontend URL here after deploying>`
**API URL:** `<add your deployed backend URL here after deploying>`

---

## Architecture overview

```
blogsphere/
├── backend/     Express + MongoDB REST API
└── frontend/    React (Vite) SPA
```

- **Frontend** — React 18 + Vite, React Router for client-side routing, Axios for API
  calls, `react-helmet-async` for per-page SEO tags. Deployed as a static build.
- **Backend** — Node.js + Express + Mongoose (MongoDB). Handles post CRUD and cover
  image uploads (Multer, stored under `/uploads`). Deployed as a Node web service.
- **Data flow:** Frontend calls the backend via `VITE_API_URL` → Express routes →
  MongoDB (Atlas). Images are served statically from the backend with a 30-day cache
  header.

Frontend and backend are deployed **separately**: frontend as a static site
(e.g. Vercel), backend as a Node web service (e.g. Railway, Render, Fly.io — any
host that runs a persistent Node process).

---

## Setup instructions (local development)

### Backend

```bash
cd backend
cp .env.example .env     # fill in MONGO_URI, CLIENT_URL
npm install
npm run dev               # http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env     # set VITE_API_URL to your backend URL
npm install
npm run dev               # http://localhost:5173
```

---

## Deployment

### Frontend → Vercel

1. Push this repo to GitHub.
2. In Vercel: **New Project → Import** the repo, set **Root Directory** to `frontend`.
3. Framework preset: **Vite**. Build command `npm run build`, output dir `dist`
   (auto-detected).
4. Add environment variable: `VITE_API_URL` = your deployed backend URL + `/api`.
5. Deploy. `vercel.json` already handles SPA rewrites and long-term asset caching.

### Backend → any Node host (Railway / Render / Fly.io / your own VPS)

1. Set the root/start directory to `backend`, start command `npm start`.
2. Environment variables to configure:
   - `MONGO_URI` — MongoDB Atlas connection string
   - `CLIENT_URL` — your deployed Vercel frontend URL (for CORS)
   - `PORT` — provided by the host automatically in most cases
   - `NODE_ENV=production`
3. Make sure the `uploads/` folder persists (use a volume, or switch to
   Cloudinary/S3 if your host has an ephemeral filesystem — Railway/Render's
   default filesystem resets on redeploy).
4. Deploy, then update the frontend's `VITE_API_URL` to point at this backend
   and redeploy the frontend.

---

## Performance pass (Lighthouse / PageSpeed)

Baseline issues you'll typically see on an unoptimized deploy, and what's already
fixed in this codebase to address them:

| Lighthouse flag | Fix applied |
|---|---|
| **Enable text compression** | `compression()` middleware on the API responses, and `vite-plugin-compression2` pre-compresses (brotli + gzip) the frontend build output |
| **Reduce unused JavaScript / avoid enormous payloads** | Route-level code splitting via `React.lazy` (Home, PostDetail, PostForm, NotFound each ship as separate chunks) + a dedicated `vendor` chunk so React/Router don't get re-downloaded per route |
| **Efficiently encode / lazy-load images** | All post images use `loading="lazy"`, `decoding="async"`, and explicit `width`/`height` to reserve layout space (prevents cumulative layout shift) |
| **Minify JavaScript / strip console output** | Terser minification in production build with `drop_console` / `drop_debugger` |
| **Serve static assets with an efficient cache policy** | Uploaded images cached 30 days (`immutable`) on the backend; built JS/CSS cached for 1 year via `vercel.json` headers |
| **Missing meta description / document title** | Every route sets a unique `<title>` and meta description via the shared `<Seo />` component |

### How to run the audit yourself

1. After deploying, open the live URL in Chrome → DevTools → **Lighthouse** tab →
   run **Mobile** and **Desktop** reports (or use
   [PageSpeed Insights](https://pagespeed.web.dev/)).
2. Save the "before" report (first deploy).
3. Apply/verify the fixes above are live, redeploy, re-run the audit, save the
   "after" report.
4. Screenshot both score panels for your demo video.

---

## SEO essentials checklist

- [x] Unique `<title>` per page (Home, Post detail, Create/Edit, 404)
- [x] Unique meta description per page
- [x] `alt` text required on every uploaded image (enforced in the post form)
- [x] `robots.txt` present
- [x] Open Graph title/description tags for link previews

---

## Mobile & desktop verification checklist

After deploying, manually confirm:

- [ ] Home page loads and posts render on a real phone (or Chrome DevTools device
      toolbar) at 375px width — no horizontal scroll, chips/search usable
- [ ] Post detail images scale correctly and don't overflow on mobile
- [ ] Create/Edit post form is usable on-screen keyboard (inputs not clipped)
- [ ] Desktop layout (≥1024px) uses the grid correctly, no excessive whitespace
- [ ] Navigation and buttons have adequate tap target size on touch devices

---

## Tech stack

React 18 · Vite · React Router · Axios · react-helmet-async · Node.js · Express ·
MongoDB/Mongoose · Multer · Helmet · compression
