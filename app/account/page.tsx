"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";

export default function AccountPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [savedName, setSavedName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Local session (instant) + unblock render before the profile fetch, so neither
    // a network auth call nor a slow profile query can leave the page blank.
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        const user = session?.user;
        if (!user) {
          router.push("/login");
          return;
        }
        setEmail(user.email ?? "");
        setChecking(false);
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single()
          .then(({ data: profile }) => {
            setFullName(profile?.full_name ?? "");
            setSavedName(profile?.full_name ?? "");
          });
      })
      .catch(() => setChecking(false));
  }, [router]);

  async function handleSave() {
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (user) {
      await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
      setSavedName(fullName);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  if (checking) return null;

  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-md px-6 py-20">
        <p className="eyebrow">Your Profile</p>
        <h1 className="mt-3 font-display text-3xl">{savedName || "Welcome"}</h1>

        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-dune">Email</span>
            <input value={email} disabled className="input opacity-60" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-dune">Full name</span>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
          </label>

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-signal px-5 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft disabled:opacity-60"
          >
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
          </button>
        </div>
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
