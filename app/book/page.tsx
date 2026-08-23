"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Nav } from "@/components/Nav";

function BookForm() {
  const params = useSearchParams();
  const expertName = params.get("expert") ?? "an expert";

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expert_name: expertName,
          client_name: clientName,
          client_email: clientEmail,
          preferred_date: preferredDate || null,
          message: message || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Something went wrong");
      setDone(true);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <Nav />
      <section className="mx-auto flex max-w-md flex-col px-6 py-20">
        <p className="eyebrow">Book a consultation</p>
        <h1 className="mt-3 font-display text-3xl">Request time with {expertName}</h1>

        {done ? (
          <div className="mt-8 rounded-xl border border-signal/40 bg-signal/5 p-6 text-sm">
            <p className="text-linen">Request sent.</p>
            <p className="mt-2 text-dune">
              {expertName} will reach out to {clientEmail} to confirm a time.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wide text-dune">Your name</span>
              <input required value={clientName} onChange={(e) => setClientName(e.target.value)} className="input" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wide text-dune">Your email</span>
              <input required type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="input" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wide text-dune">Preferred date</span>
              <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className="input" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wide text-dune">What do you need help with?</span>
              <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="input" />
            </label>

            {error && <p className="text-sm text-gold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-signal px-5 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send request"}
            </button>
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

export default function BookPage() {
  return (
    <Suspense fallback={null}>
      <BookForm />
    </Suspense>
  );
}
