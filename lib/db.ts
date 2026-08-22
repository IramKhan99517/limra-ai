import postgres from "postgres";

// DATABASE_URL works with a Neon or Supabase Postgres connection string —
// set it in .env.local locally, and in your Vercel project's Environment
// Variables in production. See README.md for setup steps.
//
// Uses postgres.js (plain TCP), which works reliably with Supabase's
// connection pooler (port 6543) as well as Neon.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    "[limra-ai] DATABASE_URL is not set. API routes and the dashboard will fail until it is configured."
  );
}

// Fall back to a syntactically valid placeholder so the client doesn't throw
// at import/build time when DATABASE_URL is missing. Any real query will
// still fail cleanly at request time, which the dashboard already handles.
export const sql = postgres(
  connectionString || "postgresql://user:pass@localhost:5432/db",
  {
    ssl: "require",
    prepare: false, // required for Supabase's transaction-mode pooler
  }
);
