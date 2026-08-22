import { neon } from "@neondatabase/serverless";

// DATABASE_URL works with either a Neon or a Supabase Postgres connection
// string — set it in .env.local locally, and in your Vercel project's
// Environment Variables in production. See README.md for setup steps.
if (!process.env.DATABASE_URL) {
  console.warn(
    "[limra-ai] DATABASE_URL is not set. API routes and the dashboard will fail until it is configured."
  );
}

export const sql = neon(process.env.DATABASE_URL ?? "");

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
