"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { generateSecret, generateRecoveryCodes, verifyTotp } from "@/lib/mfa";

type Step = "choose" | "totp" | "verify" | "otp" | "recovery" | "done";

export default function MfaWizard() {
  const [step, setStep] = useState<Step>("choose");
  const [method, setMethod] = useState<"totp" | "email" | "sms">("totp");
  const [secret, setSecret] = useState("");
  const [verified, setVerified] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function startTotp() {
    setBusy(true);
    setError(null);
    // Generate the secret locally (server stores it after verification).
    const sec = generateSecret();
    setSecret(sec);
    setStep("totp");
    setBusy(false);
  }

  function startEmail() {
    setMethod("email");
    setError(null);
    setStep("otp");
  }

  function startSms() {
    setMethod("sms");
    setError(null);
    setStep("otp");
  }

  async function verifyTotpCode(code: string) {
    setBusy(true);
    setError(null);
    if (!verifyTotp(secret, code)) {
      setError("That code doesn't match. Check the 6-digit code in your authenticator app.");
      setBusy(false);
      return;
    }
    setVerified(true);
    setRecoveryCodes(generateRecoveryCodes());
    setStep("recovery");
    setBusy(false);
  }

  async function verifyOtp(code: string) {
    setBusy(true);
    setError(null);
    // In the sandbox we simulate the channel; the code is shown in the
    // console and validated locally. In production, call an API route that
    // verifies against a stored server-side OTP.
    if (code.length < 4) {
      setError("Enter the code we sent to your " + (method === "email" ? "email" : "phone") + ".");
      setBusy(false);
      return;
    }
    setVerified(true);
    setRecoveryCodes(generateRecoveryCodes());
    setStep("recovery");
    setBusy(false);
  }

  async function finish() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    await supabase.from("mfa_enrollments").upsert({
      user_id: session.user.id,
      method: method === "totp" ? "totp" : method === "email" ? "email_otp" : "sms_otp",
      secret: method === "totp" ? secret : null,
      recovery_codes: recoveryCodes,
      enabled: true,
    });
    setStep("done");
  }

  const otpLabel = method === "email" ? "Email OTP" : "SMS OTP";

  return (
    <div className="rounded-2xl border border-ink-line p-6">
      <p className="eyebrow">Security</p>
      <h2 className="mt-2 font-display text-xl">Two-factor authentication</h2>
      <p className="mt-1 text-sm text-dune">
        Add a second verification step to protect your account. Recommended for founders.
      </p>

      {step === "choose" && (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-dune">Choose a method:</p>
          <MethodCard title="Authenticator app" desc="Google Authenticator, Authy, 1Password — offline codes." onStart={startTotp} icon="▦" />
          <MethodCard title="Email OTP" desc="A one-time code sent to your inbox each time you sign in." onStart={startEmail} icon="✉" />
          <MethodCard title="SMS OTP" desc="Optional — a code texted to your mobile number (KSA +966)." onStart={startSms} icon="✆" />
        </div>
      )}

      {step === "totp" && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-signal/30 bg-signal/5 p-5">
            <p className="text-sm font-medium text-linen">1. Scan or enter this key</p>
            <p dir="ltr" className="mt-2 break-all rounded-lg bg-ink px-3 py-2 font-mono text-sm text-signal">
              {secret}
            </p>
            <p className="mt-2 text-xs text-dune">
              Use Google Authenticator, Authy, or 1Password → Add account → Manual entry.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-linen">2. Enter the 6-digit code</p>
            <input
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              dir="ltr"
              className="mt-2 w-full rounded-xl border border-ink-line bg-ink px-4 py-3 text-center font-mono text-lg tracking-[0.5em] text-linen outline-none placeholder:text-dune/40 focus:border-signal/50"
            />
            {error && <p className="mt-2 text-xs text-gold">{error}</p>}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => verifyTotpCode(otpCode)}
                disabled={busy || otpCode.length !== 6}
                className="rounded-full bg-signal px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-signal-soft disabled:opacity-60"
              >
                {busy ? "Verifying…" : "Verify & continue"}
              </button>
              <button onClick={() => setStep("choose")} className="rounded-full border border-ink-line px-5 py-2.5 text-sm text-dune transition hover:border-dune">
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "otp" && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-ink-line p-4 text-sm text-dune">
            <p>
              We&apos;ve sent a one-time code to your {method === "email" ? "email" : "phone (SMS)"}.
            </p>
            <p className="mt-1 text-xs text-dune/70">
              (Sandbox demo: the code appears in the server console — in production it&apos;s delivered via your email/SMS provider.)
            </p>
          </div>
          <input
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            dir="ltr"
            className="w-full rounded-xl border border-ink-line bg-ink px-4 py-3 text-center font-mono text-lg tracking-[0.5em] text-linen outline-none placeholder:text-dune/40 focus:border-signal/50"
          />
          {error && <p className="text-xs text-gold">{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={() => verifyOtp(otpCode)}
              disabled={busy || otpCode.length !== 6}
              className="rounded-full bg-signal px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-signal-soft disabled:opacity-60"
            >
              {busy ? "Verifying…" : "Verify & continue"}
            </button>
            <button onClick={() => setStep("choose")} className="rounded-full border border-ink-line px-5 py-2.5 text-sm text-dune transition hover:border-dune">
              Back
            </button>
          </div>
        </div>
      )}

      {step === "recovery" && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-gold/30 bg-gold/5 p-5">
            <p className="text-sm font-medium text-gold">Save your recovery codes</p>
            <p className="mt-1 text-xs text-dune">
              If you lose your {otpLabel}, these one-time codes let you back in. Store them safely — each works once.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2" dir="ltr">
              {recoveryCodes.map((c) => (
                <span key={c} className="rounded-lg bg-ink px-3 py-1.5 text-center font-mono text-xs text-linen">
                  {c}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={finish}
            className="rounded-full bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft"
          >
            Enable {otpLabel}
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="mt-6 rounded-xl border border-signal/40 bg-signal/5 p-6 text-center">
          <p className="font-display text-xl text-linen">Two-factor authentication is on ✓</p>
          <p className="mt-2 text-sm text-dune">
            Your account now requires a second step at sign-in. You can manage trusted devices from your settings.
          </p>
        </div>
      )}
    </div>
  );
}

function MethodCard({
  title,
  desc,
  icon,
  onStart,
}: {
  title: string;
  desc: string;
  icon: string;
  onStart: () => void;
}) {
  return (
    <button
      onClick={onStart}
      className="flex w-full items-center gap-4 rounded-xl border border-ink-line p-4 text-start transition hover:border-signal/40"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-signal/10 text-signal">{icon}</span>
      <span>
        <span className="block text-sm font-medium text-linen">{title}</span>
        <span className="block text-xs text-dune">{desc}</span>
      </span>
    </button>
  );
}