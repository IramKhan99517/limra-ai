import { neon } from "@neondatabase/serverless";

// DATABASE_URL works with either a Neon or a Supabase Postgres connection
// string — set it in .env.local locally, and in your Vercel project's
// Environment Variables in production. See README.md for setup steps.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    "[limra-ai] DATABASE_URL is not set. API routes and the dashboard will fail until it is configured."
  );
}

// Fall back to a syntactically valid placeholder so neon() doesn't throw at
// import/build time when DATABASE_URL is missing. Any real query will still
// fail cleanly at request time, which the dashboard already handles.
export const sql = neon(
  connectionString || "postgresql://user:pass@localhost:5432/db"
);

export type Entity = {
  id: number;
  name: string;
  owner: string;
  status: "active" | "pending" | "suspended";
  saudization_score: number;
  created_at: string;
};

export type License = {
  id: number;
  entity_id: number;
  type: string;
  status: "approved" | "in_review" | "expiring" | "expired";
  issue_date: string | null;
  expiry_date: string | null;
};

export type Filing = {
  id: number;
  entity_id: number;
  title: string;
  due_date: string;
  status: "pending" | "submitted" | "overdue";
};
