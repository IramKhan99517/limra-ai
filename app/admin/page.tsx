"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";

type Booking = {
  id: number;
  expert_name: string;
  client_name: string;
  client_email: string;
  message: string | null;
  preferred_date: string | null;
  status: string;
  created_at: string;
};

type Entity = {
  id: number;
  name: string;
  owner: string;
  status: string;
  saudization_score: string;
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      setAllowed(true);
      setChecking(false);

      const [bookingsRes, entitiesRes] = await Promise.all([
        fetch("/api/bookings").then((r) => (r.ok ? r.json() : [])),
        fetch("/api/entities").then((r) => (r.ok ? r.json() : [])),
      ]);
      setBookings(bookingsRes);
      setEntities(entitiesRes);
    }
    check();
  }, [router]);

  if (checking || !allowed) return null;

  return (
    <main>
      <Nav />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow">Platform Admin</p>
            <h1 className="mt-3 font-display text-3xl md:text-4xl">All activity across LIMRA AI</h1>
          </Reveal>

          <Reveal delay={0.05} className="mt-10">
            <div className="overflow-x-auto rounded-xl border border-ink-line p-6">
              <h2 className="font-display text-lg">Booking requests ({bookings.length})</h2>
              <table className="mt-4 w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-ink-line text-left text-dune">
                    <th className="pb-3 font-normal">Expert</th>
                    <th className="pb-3 font-normal">Client</th>
                    <th className="pb-3 font-normal">Email</th>
                    <th className="pb-3 font-normal">Preferred date</th>
                    <th className="pb-3 font-normal">Status</th>
                    <th className="pb-3 font-normal">Requested</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-ink-line/60">
                      <td className="py-3 text-linen">{b.expert_name}</td>
                      <td className="py-3 text-dune">{b.client_name}</td>
                      <td className="py-3 text-dune">{b.client_email}</td>
                      <td className="py-3 text-dune">
                        {b.preferred_date ? new Date(b.preferred_date).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3 text-signal capitalize">{b.status}</td>
                      <td className="py-3 text-dune">{new Date(b.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-dune">
                        No booking requests yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <div className="overflow-x-auto rounded-xl border border-ink-line p-6">
              <h2 className="font-display text-lg">All entities ({entities.length})</h2>
              <table className="mt-4 w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-ink-line text-left text-dune">
                    <th className="pb-3 font-normal">Entity</th>
                    <th className="pb-3 font-normal">Owner</th>
                    <th className="pb-3 font-normal">Status</th>
                    <th className="pb-3 font-normal">Saudization</th>
                    <th className="pb-3 font-normal">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {entities.map((e) => (
                    <tr key={e.id} className="border-b border-ink-line/60">
                      <td className="py-3 text-linen">{e.name}</td>
                      <td className="py-3 text-dune">{e.owner}</td>
                      <td className="py-3 text-dune capitalize">{e.status}</td>
                      <td className="py-3 font-mono text-signal">{e.saudization_score}%</td>
                      <td className="py-3 text-dune">{new Date(e.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
