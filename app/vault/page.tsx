"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { DOCUMENT_TYPES, DOCUMENT_CATEGORIES, documentsForActivity, BUSINESS_ACTIVITIES } from "@/lib/documentTypes";
import { useI18n } from "@/lib/i18n";

type StoredDoc = {
  id: number;
  document_type_id: string;
  file_name: string;
  file_path: string;
  status: string;
  uploaded_at: string;
};

type Template = {
  document_type_id: string;
  file_path: string;
  file_name: string;
};

export default function VaultPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [userId, setUserId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [docs, setDocs] = useState<StoredDoc[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activity, setActivity] = useState<string | null>(null);
  const [ownership, setOwnership] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    // Use the LOCAL session (instant) to unblock rendering — getUser() hits the
    // network and can hang, leaving the page stuck blank.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user;
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);
      setChecking(false);
      loadDocs(user.id);
      loadTemplates();
      const { data: entity } = await supabase
        .from("entities")
        .select("activity, ownership")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setActivity(entity?.activity ?? null);
      setOwnership(entity?.ownership ?? null);
    }).catch(() => setChecking(false)); // never leave the page stuck blank
  }, [router]);

  async function loadTemplates() {
    const { data } = await supabase.from("document_templates").select("document_type_id, file_path, file_name");
    setTemplates(data ?? []);
  }

  function handleDownloadTemplate(template: Template) {
    const { data } = supabase.storage.from("templates").getPublicUrl(template.file_path);
    window.open(data.publicUrl, "_blank");
  }

  async function loadDocs(uid: string) {
    const { data } = await supabase
      .from("user_documents")
      .select("*")
      .eq("user_id", uid);
    setDocs(data ?? []);
  }

  async function handleUpload(docTypeId: string, file: File) {
    if (!userId) return;
    setUploadingId(docTypeId);
    setError(null);

    const path = `${userId}/${docTypeId}-${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.from("vault").upload(path, file);
    if (uploadError) {
      setError(uploadError.message);
      setUploadingId(null);
      return;
    }

    const { error: dbError } = await supabase.from("user_documents").insert({
      user_id: userId,
      document_type_id: docTypeId,
      file_name: file.name,
      file_path: path,
      status: "uploaded",
    });
    if (dbError) setError(dbError.message);

    await loadDocs(userId);
    setUploadingId(null);
  }

  async function handleDownload(doc: StoredDoc) {
    const { data, error } = await supabase.storage.from("vault").createSignedUrl(doc.file_path, 60);
    if (error || !data) {
      setError(t("vault.downloadError"));
      return;
    }
    window.open(data.signedUrl, "_blank");
  }

  async function handleRemove(doc: StoredDoc) {
    await supabase.storage.from("vault").remove([doc.file_path]);
    await supabase.from("user_documents").delete().eq("id", doc.id);
    if (userId) await loadDocs(userId);
  }

  if (checking) return null;

  const relevantDocs = documentsForActivity(activity, ownership);
  const completedCount = relevantDocs.filter((dt) =>
    docs.some((d) => d.document_type_id === dt.id)
  ).length;

  return (
    <main>
      <Nav />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="eyebrow">{t("vault.eyebrow")}</p>
            <h1 className="mt-3 font-display text-3xl md:text-4xl">{t("vault.title")}</h1>
            <p className="mt-3 text-dune">{t("vault.sub")}</p>
            {activity ? (
              <p className="mt-2 text-xs text-signal">
                {t("vault.showingFor")} {BUSINESS_ACTIVITIES.find((a) => a.id === activity)?.label ?? activity}
              </p>
            ) : (
              <p className="mt-2 text-xs text-gold">
                {t("vault.noBusiness")}{" "}
                <a href="/onboarding" className="underline">
                  {t("vault.setupBusiness")}
                </a>{" "}
                {t("vault.seeSpecific")}
              </p>
            )}
          </Reveal>

          <Reveal delay={0.05} className="mt-8">
            <div className="rounded-xl border border-ink-line p-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dune">{t("vault.progress")}</span>
                <span className="font-mono text-signal">
                  {completedCount} / {relevantDocs.length}
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-line">
                <div
                  className="h-full bg-signal transition-all"
                  style={{ width: `${relevantDocs.length ? (completedCount / relevantDocs.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </Reveal>

          {error && (
            <div className="mt-6 rounded-lg border border-gold/40 bg-gold/5 p-4 text-sm text-gold">
              {error}
            </div>
          )}

          <div className="mt-10 space-y-10">
            {DOCUMENT_CATEGORIES.map((category, ci) => (
              <Reveal key={category} delay={ci * 0.05}>
                <h2 className="font-display text-xl">{category}</h2>
                <div className="mt-4 space-y-3">
                  {relevantDocs.filter((dt) => dt.category === category).map((dt) => {
                    const uploaded = docs.find((d) => d.document_type_id === dt.id);
                    return (
                      <div
                        key={dt.id}
                        className="flex flex-col gap-3 rounded-lg border border-ink-line p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-linen">{dt.name}</p>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                                uploaded ? "bg-signal/15 text-signal" : "bg-ink-line text-dune"
                              }`}
                            >
                              {uploaded ? uploaded.status : t("vault.notStarted")}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-dune">{dt.description}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-3">
                            {templates.find((t) => t.document_type_id === dt.id) ? (
                              <button
                                onClick={() =>
                                  handleDownloadTemplate(templates.find((t) => t.document_type_id === dt.id)!)
                                }
                                className="text-xs text-signal hover:underline"
                              >
                                {t("vault.downloadForm")}
                              </button>
                            ) : (
                              <a
                                href={dt.portalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-signal hover:underline"
                              >
                                {t("vault.formFrom")} {dt.portalName} →
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {uploaded ? (
                            <>
                              <button
                                onClick={() => handleDownload(uploaded)}
                                className="rounded-full border border-ink-line px-3 py-1.5 text-xs text-linen transition hover:border-dune"
                              >
                                {t("vault.view")}
                              </button>
                              <button
                                onClick={() => handleRemove(uploaded)}
                                className="rounded-full border border-ink-line px-3 py-1.5 text-xs text-dune transition hover:border-gold hover:text-gold"
                              >
                                {t("vault.remove")}
                              </button>
                            </>
                          ) : (
                            <>
                              <input
                                ref={(el) => { fileInputRefs.current[dt.id] = el; }}
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleUpload(dt.id, file);
                                }}
                              />
                              <button
                                onClick={() => fileInputRefs.current[dt.id]?.click()}
                                disabled={uploadingId === dt.id}
                                className="rounded-full bg-signal px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-signal-soft disabled:opacity-60"
                              >
                                {uploadingId === dt.id ? t("vault.uploading") : t("vault.upload")}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
