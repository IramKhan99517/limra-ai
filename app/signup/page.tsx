"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  return (
    <main>
      <Nav />
      <section className="mx-auto flex max-w-md flex-col px-6 py-20">
        <p className="eyebrow">Create account</p>
        <h1 className="mt-3 font-display text-3xl">Start your LIMRA AI setup</h1>

        {done ? (
          <div className="mt-8 rounded-xl border border-signal/40 bg-signal/5 p-6 text-sm">
            <p className="text-linen">Check your email to confirm your account.</p>
            <p className="mt-2 text-dune">
              Once confirmed, you can{" "}
              <Link href="/login" className="text-signal hover:underline">
                log in
              </Link>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Field label="Full name">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Layla Al-Otaibi"
              />
            </Field>
            <Field label="Email">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@company.com"
              />
            </Field>
            <Field label="Password">
              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="At least 6 characters"
              />
            </Field>

            {error && <p className="text-sm text-gold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-signal px-5 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="text-center text-sm text-dune">
              Already have an account?{" "}
              <Link href="/login" className="text-signal hover:underline">
                Log in
              </Link>
            </p>
          </form>
        )}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-dune">{label}</span>
      {children}
    </label>
  );
}
