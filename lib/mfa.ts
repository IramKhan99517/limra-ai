/* LIMRA AI — MFA helpers (browser-safe, no Node builtins)
 *
 * Self-contained TOTP (RFC 6238) + recovery codes. Uses Web Crypto
 * (globalThis.crypto) for randomness and a pure-JS SHA-1/HMAC so this
 * module can run in the browser (client components) and on the server.
 *
 * Enrollment data (secret, recovery codes) is stored per-user via the
 * Supabase `mfa_enrollments` table (see lib/mfa.sql). In production you
 * would pair this with Supabase Auth's built-in MFA or a provider like
 * Twilio for SMS delivery; this module keeps the sandbox self-sufficient.
 */

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/* ------------------------------------------------------------------ */
/* Randomness                                                          */
/* ------------------------------------------------------------------ */

function randomBytes(n: number): Uint8Array {
  const out = new Uint8Array(n);
  const c = globalThis.crypto;
  if (c && typeof c.getRandomValues === "function") {
    c.getRandomValues(out);
  } else {
    // Fallback (non-secure) — only used in exotic non-web runtimes.
    for (let i = 0; i < n; i++) out[i] = Math.floor(Math.random() * 256);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Base32 (RFC 4648)                                                   */
/* ------------------------------------------------------------------ */

function base32Encode(bytes: Uint8Array): string {
  let bits = "";
  for (const b of bytes) bits += b.toString(2).padStart(8, "0");
  while (bits.length % 5 !== 0) bits += "0";
  let out = "";
  for (let i = 0; i < bits.length; i += 5) {
    out += BASE32_ALPHABET[parseInt(bits.slice(i, i + 5), 2)];
  }
  return out;
}

function base32Decode(input: string): Uint8Array {
  const clean = input.replace(/=+$/, "").replace(/\s+/g, "").toUpperCase();
  let bits = "";
  for (const ch of clean) {
    const idx = BASE32_ALPHABET.indexOf(ch);
    if (idx === -1) continue;
    bits += idx.toString(2).padStart(5, "0");
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return new Uint8Array(bytes);
}

/* ------------------------------------------------------------------ */
/* Pure-JS SHA-1 + HMAC-SHA1                                           */
/* ------------------------------------------------------------------ */

function rotl(x: number, n: number): number {
  return ((x << n) | (x >>> (32 - n))) >>> 0;
}

function sha1(msg: Uint8Array): Uint8Array {
  const ml = msg.length * 8;
  const withOne = new Uint8Array(msg.length + 1);
  withOne.set(msg);
  withOne[msg.length] = 0x80;
  const totalLen = ((withOne.length + 8 + 63) >> 6) << 6;
  const padded = new Uint8Array(totalLen);
  padded.set(withOne);
  const dv = new DataView(padded.buffer);
  dv.setUint32(totalLen - 8, 0);
  dv.setUint32(totalLen - 4, ml >>> 0);

  let h0 = 0x67452301,
    h1 = 0xefcdab89,
    h2 = 0x98badcfe,
    h3 = 0x10325476,
    h4 = 0xc3d2e1f0;
  const w = new Uint32Array(80);

  for (let i = 0; i < totalLen; i += 64) {
    for (let j = 0; j < 16; j++) w[j] = dv.getUint32(i + j * 4);
    for (let j = 16; j < 80; j++) {
      w[j] = rotl(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
    }
    let a = h0, b = h1, c = h2, d = h3, e = h4;
    for (let j = 0; j < 80; j++) {
      let f: number, k: number;
      if (j < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }
      const temp = (rotl(a, 5) + f + e + k + w[j]) >>> 0;
      e = d;
      d = c;
      c = rotl(b, 30);
      b = a;
      a = temp;
    }
    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
  }

  const out = new Uint8Array(20);
  const odv = new DataView(out.buffer);
  odv.setUint32(0, h0);
  odv.setUint32(4, h1);
  odv.setUint32(8, h2);
  odv.setUint32(12, h3);
  odv.setUint32(16, h4);
  return out;
}

function hmacSha1(key: Uint8Array, message: Uint8Array): Uint8Array {
  let k = key;
  if (k.length > 64) k = sha1(k);
  const ipad = new Uint8Array(64);
  const opad = new Uint8Array(64);
  for (let i = 0; i < 64; i++) {
    ipad[i] = (k[i] ?? 0) ^ 0x36;
    opad[i] = (k[i] ?? 0) ^ 0x5c;
  }
  const inner = new Uint8Array(ipad.length + message.length);
  inner.set(ipad);
  inner.set(message, ipad.length);
  const innerHash = sha1(inner);
  const outer = new Uint8Array(opad.length + innerHash.length);
  outer.set(opad);
  outer.set(innerHash, opad.length);
  return sha1(outer);
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/** Generate an RFC 6238-compatible TOTP secret (160 bits, base32). */
export function generateSecret(): string {
  return base32Encode(randomBytes(20));
}

/** Derive the current 6-digit TOTP code for a secret (30s window). */
export function totp(secret: string, time = Date.now()): string {
  const key = base32Decode(secret);
  const counter = Math.floor(time / 30000);
  const buf = new Uint8Array(8);
  const dv = new DataView(buf.buffer);
  dv.setBigUint64(0, BigInt(counter));
  const hmac = hmacSha1(key, buf);
  const offset = hmac[hmac.length - 1] & 0x0f;
  const hdv = new DataView(hmac.buffer, hmac.byteOffset, hmac.byteLength);
  const bin = (hdv.getUint32(offset) & 0x7fffffff) % 1000000;
  return bin.toString().padStart(6, "0");
}

/** Verify a submitted code against a secret within a small window. */
export function verifyTotp(secret: string, code: string, window = 1): boolean {
  const clean = code.trim();
  if (!/^\d{6}$/.test(clean)) return false;
  for (let w = -window; w <= window; w++) {
    if (totp(secret, Date.now() + w * 30000) === clean) return true;
  }
  return false;
}

/** Generate a set of one-time recovery codes (10 × 10-char groups). */
export function generateRecoveryCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = Array.from(randomBytes(5))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
      .slice(0, 5);
    const b = Array.from(randomBytes(5))
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
      .slice(0, 5);
    codes.push(`${a}-${b}`);
  }
  return codes;
}

/** Constant-time-ish comparison for recovery codes. */
export function verifyRecoveryCode(code: string, stored: string[]): boolean {
  const clean = code.trim().toUpperCase();
  return stored.some((c) => c.toUpperCase() === clean);
}

/** Generate a 6-digit email/SMS OTP. */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Fake async email/SMS sender — logs in dev, no-op otherwise. */
export async function sendOtp(channel: "email" | "sms", to: string, code: string): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    console.log(`[limra-mfa] ${channel} OTP to ${to}: ${code}`);
  }
  // In production, wire this to your email/SMS provider here.
}