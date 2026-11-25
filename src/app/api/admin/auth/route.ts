import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "fppi_admin_session";
const SESSION_MAX_AGE_SEC = 8 * 60 * 60; // 8 jam

// Rate limiter sederhana di memori server per IP
const attemptStore = new Map<string, { count: number; lockedUntil: number | null }>();

function getAdminPin(): string {
  return process.env.ADMIN_PIN || process.env.NEXT_PUBLIC_ADMIN_PIN || "";
}

function getSigningSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || getAdminPin() || "fppi_fallback_secret";
}

function signToken(expiresAt: number): string {
  const payload = String(expiresAt);
  const sig = crypto
    .createHmac("sha256", getSigningSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const expectedSig = crypto
    .createHmac("sha256", getSigningSecret())
    .update(payload)
    .digest("hex");

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expectedBuf);
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const authenticated = verifyToken(token);
  return NextResponse.json({ authenticated });
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const record = attemptStore.get(ip) || { count: 0, lockedUntil: null };
  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    const remaining = Math.ceil((record.lockedUntil - Date.now()) / 1000);
    return NextResponse.json(
      { error: `Terlalu banyak percobaan salah. Coba lagi dalam ${remaining} detik.` },
      { status: 429 }
    );
  }

  const configuredPin = getAdminPin();
  if (!configuredPin || configuredPin === "UNCONFIGURED") {
    return NextResponse.json(
      { error: "Admin PIN belum dikonfigurasi di server. Hubungi administrator." },
      { status: 500 }
    );
  }

  let body: { pin?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const pin = typeof body.pin === "string" ? body.pin : "";
  if (!safeCompare(pin, configuredPin)) {
    const newCount = record.count + 1;
    if (newCount >= 5) {
      attemptStore.set(ip, { count: newCount, lockedUntil: Date.now() + 30_000 });
      return NextResponse.json(
        { error: "Terlalu banyak percobaan salah. Akun dikunci selama 30 detik." },
        { status: 429 }
      );
    }
    attemptStore.set(ip, { count: newCount, lockedUntil: null });
    return NextResponse.json(
      { error: `PIN yang Anda masukkan salah! (${5 - newCount} percobaan tersisa)` },
      { status: 401 }
    );
  }

  // Login berhasil — reset rate limit & terbitkan cookie HttpOnly
  attemptStore.delete(ip);
  const expiresAt = Date.now() + SESSION_MAX_AGE_SEC * 1000;
  const token = signToken(expiresAt);

  const res = NextResponse.json({ authenticated: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ authenticated: false });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
