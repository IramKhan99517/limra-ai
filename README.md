# LIMRA AI

Full-stack rebuild of the LIMRA AI landing page + live Command Dashboard, backed by a
real Postgres database. Everything below is free-tier.

- **Frontend:** Next.js 14 (App Router) + Tailwind, with animated hero and scroll reveals.
- **Backend:** Next.js API routes (`/app/api/*`) + Postgres via the Neon serverless driver
  (works with either a free Neon or free Supabase database — it's just a `DATABASE_URL`).
- **Dashboard:** `/dashboard` is a server component that queries the database directly, so
  the numbers you see are real, not mock data.

## 1. Push this to GitHub

```bash
cd limra-ai
git init
git add .
git commit -m "Initial commit: LIMRA AI full-stack rebuild"
git branch -M main
git remote add origin https://github.com/<your-username>/limra-ai.git
git push -u origin main
```

(Or use GitHub's "Upload files" web UI if you'd rather not use the command line — just
drag the whole unzipped folder in, minus `node_modules` which doesn't exist yet anyway.)

## 2. Create a free Postgres database

Pick one — both work identically here since the app just needs a `DATABASE_URL`:

**Option A — Neon (recommended, made for serverless/Vercel)**
1. Go to [neon.tech](https://neon.tech) → sign up free → "Create a project."
2. Copy the connection string shown (starts with `postgresql://...`).

**Option B — Supabase**
1. Go to [supabase.com](https://supabase.com) → sign up free → "New project."
2. Project Settings → Database → Connection string → URI. Copy it.

## 3. Set up the schema and sample data

Locally:

```bash
npm install
cp .env.example .env.local
# paste your DATABASE_URL into .env.local

psql "$DATABASE_URL" -f lib/schema.sql   # creates tables
npm run seed                              # fills them with sample data
```

(No `psql` installed? Neon and Supabase both have a SQL editor in their dashboard —
paste the contents of `lib/schema.sql` there instead, then run `npm run seed` locally
with `DATABASE_URL` set.)

## 4. Deploy on Vercel (free)

1. [vercel.com](https://vercel.com) → "Add New Project" → import your `limra-ai` GitHub repo.
2. In the import screen (or Project Settings → Environment Variables after), add:
   - `DATABASE_URL` = the same connection string from step 2.
3. Deploy. Vercel will auto-redeploy on every push to `main` from now on.

## 5. Verify

- `/` — the marketing site.
- `/dashboard` — live data. If it shows a "Database not connected" notice, double-check
  `DATABASE_URL` is set in Vercel and that you ran the schema + seed script.

## Project structure

```
app/
  page.tsx              landing page
  dashboard/page.tsx     live dashboard (server component, queries DB directly)
  api/
    summary/route.ts     GET aggregate dashboard stats
    licenses/route.ts     GET/POST/PATCH licenses
    filings/route.ts       GET/POST/PATCH compliance filings
components/              Nav, Reveal (scroll animation), RadarSignature (hero animation), Calculator
lib/
  db.ts                  Postgres client (Neon serverless driver)
  schema.sql             table definitions
scripts/seed.ts          sample data matching the original dashboard numbers
```

## Extending the API

`POST /api/licenses` and `POST /api/filings` accept JSON bodies to create new rows;
`PATCH` with `{ id, status }` updates a status. Wire these up to forms in the dashboard
whenever you're ready to make it fully editable from the UI — the routes are already
there.
