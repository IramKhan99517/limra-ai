"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { DOCUMENT_TYPES } from "@/lib/documentTypes";

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

type Template = {
  id: number;
  document_type_id: string;
  file_name: string;
  file_path: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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

      const { data: { session } } = await supabase.auth.getSession();
      const authHeader = { Authorization: `Bearer ${session?.access_token}` };

      const [bookingsRes, entitiesRes] = await Promise.all([
        fetch("/api/bookings", { headers: authHeader }).then((r) => (r.ok ? r.json() : [])),
        fetch("/api/entities", { headers: authHeader }).then((r) => (r.ok ? r.json() : [])),
      ]);
      setBookings(bookingsRes);
      setEntities(entitiesRes);
      loadTemplates();
    }
    check();
  }, [router]);

  async function loadTemplates() {
    const { data } = await supabase.from("document_templates").select("*");
    setTemplates(data ?? []);
  }

  async function handleTemplateUpload(documentTypeId: string, file: File) {
    setUploadingId(documentTypeId);
    const path = `${documentTypeId}-${Date.now()}-${file.name}`;

    const existing = templates.find((t) => t.document_type_id === documentTypeId);
    if (existing) {
      await supabase.storage.from("templates").remove([existing.file_path]);
      await supabase.from("document_templates").delete().eq("id", existing.id);
    }

    const { error: uploadError } = await supabase.storage.from("templates").upload(path, file);
    if (!uploadError) {
      await supabase.from("document_templates").insert({
        document_type_id: documentTypeId,
        file_name: file.name,
        file_path: path,
      });
    }
    await loadTemplates();
    setUploadingId(null);
  }

  async function handleTemplateRemove(template: Template) {
    await supabase.storage.from("templates").remove([template.file_path]);
    await supabase.from("document_templates").delete().eq("id", template.id);
    await loadTemplates();
  }

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

          <Reveal delay={0.02}>
            <div className="mt-4 rounded-lg border border-gold/30 bg-gold/5 px-4 py-2 text-xs text-gold">
              Entities below include seeded sample data alongside real bookings.
            </div>
          </Reveal>

          <Reveal delay={0.05} className="mt-10">
            <div className="rounded-xl border border-ink-line p-6">
              <h2 className="font-display text-lg">Document templates</h2>
              <p className="mt-1 text-sm text-dune">
                Upload the real government form for each document type. Once uploaded, every user
                sees a &quot;Download Form&quot; button in their Vault.
              </p>
              <div className="mt-4 space-y-2">
                {DOCUMENT_TYPES.map((dt) => {
                  const template = templates.find((t) => t.document_type_id === dt.id);
                  return (
                    <div
                      key={dt.id}
                      className="flex flex-col gap-2 rounded-lg border border-ink-line p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm text-linen">{dt.name}</p>
                        <p className="text-xs text-dune">
                          {template ? `Uploaded: ${template.file_name}` : "No template uploaded yet"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          ref={(el) => { fileInputRefs.current[dt.id] = el; }}
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleTemplateUpload(dt.id, file);
                          }}
                        />
                        <button
                          onClick={() => fileInputRefs.current[dt.id]?.click()}
                          disabled={uploadingId === dt.id}
                          className="rounded-full bg-signal px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-signal-soft disabled:opacity-60"
                        >
                          {uploadingId === dt.id ? "Uploading..." : template ? "Replace" : "Upload"}
                        </button>
                        {template && (
                          <button
                            onClick={() => handleTemplateRemove(template)}
                            className="rounded-full border border-ink-line px-3 py-1.5 text-xs text-dune transition hover:border-gold hover:text-gold"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="mt-8">
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
