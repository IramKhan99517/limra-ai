"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main>
      <Nav />
      <section className="mx-auto flex max-w-md flex-col px-6 py-20">
        <p className="eyebrow">Welcome back</p>
        <h1 className="mt-3 font-display text-3xl">Log in to LIMRA AI</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-dune">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@company.com"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-dune">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Your password"
            />
          </label>

          {error && <p className="text-sm text-gold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-signal px-5 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <p className="text-center text-sm text-dune">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-signal hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </section>

      <style>{`
        .input {
          width: 100%;
          background: transparent;
          border: 1px solid #1B3527;
          border-radius: 0.5rem;
          padding: 0.6rem 0.9rem;
          color: #EFE7D8;
          font-size: 0.9rem;
        }
        .input:focus {
          outline: 2px solid #4FE6C4;
          outline-offset: 2px;
        }
      `}</style>
    </main>
  );
}
