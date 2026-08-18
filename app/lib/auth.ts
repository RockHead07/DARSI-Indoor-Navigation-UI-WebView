// Auth client — MOCK implementation. Real auth login/register milik host MyRSIy
// (Flutter) yang meng-inject `window.__DARSI_USER__` saat WebView di-load
// (ADR-017). Halaman login/register/forgot di repo ini adalah SEAM PEMBANGUNAN UI
// supaya flow bisa dites/didemokan sebelum koneksi ke backend auth turun.
//
// Saat backend auth real tersedia, ganti isi tiap fungsi dengan fetch beneran —
// kontrak bentuk fungsi (argumen → Promise<{ ok, message, ... }>) TIDAK berubah
// supaya UI tidak perlu dirombak.
//
// Demo identity: hasil login/register di-persist ke `window.__DARSI_USER__` supaya
// gating login-only (Cari Teman, ADR-017) ikut menyala saat dites preview. Juga
// di-post ke `window.ProfileBridge` (kontrak: docs/AUTH_INTEGRATION.md di repo
// My-eRSIy-CopyCat-) supaya host Flutter ikut update HomeHeader dari "Tamu".
// TODO(T0.8 / backend auth): hapus persist manual ini — host yang set header WebView.

import { getCurrentUser } from "./user";

declare global {
  interface Window {
    ProfileBridge?: { postMessage: (message: string) => void };
  }
}

const delay = (ms = 700) => new Promise((r) => setTimeout(r, ms)); // simulasi latency network

let demoUserCounter = 0;

export type AuthResult = { ok: boolean; message: string };

// Demo tetap (bukan dari database) -- username ini selalu tampil sebagai nama
// lengkap alih-alih tamu/handle generik. Cuma buat preview/demo, tidak menyentuh
// Supabase sama sekali (lihat pembahasan "perlu tabel Supabase?").
const HARDCODED_DEMO_USERS: Record<string, { name: string; email: string }> = {
  rockhead07: { name: "Bagus Insan Pradana", email: "dana.bagus07@gmail.com" },
};

// "Sudah terdaftar" versi mock -- in-memory, reset tiap reload, BUKAN tabel
// Supabase (sengaja, lihat ADR-017 + diskusi). Cukup buat nunjukkin alur
// disclaimer "username/email sudah dipakai" tanpa backend sungguhan.
const registeredUsernames = new Set<string>(Object.keys(HARDCODED_DEMO_USERS));
const registeredEmails = new Set<string>(
  Object.values(HARDCODED_DEMO_USERS).map((u) => u.email.toLowerCase())
);

function postToProfileBridge(
  event: "LOGIN_SUCCESS" | "REGISTER_SUCCESS" | "LOGOUT",
  user?: { fullName: string; email?: string }
): void {
  if (typeof window === "undefined" || !window.ProfileBridge) return;
  window.ProfileBridge.postMessage(JSON.stringify({ event, user }));
}

/**
 * POST /api/auth/login — mock: kombinasi email/username terserah, password apa
 * pun diterima (≥6 karakter). Demo identity dipersist ke window.__DARSI_USER__
 * dan di-post ke window.ProfileBridge (host Flutter).
 */
export async function login(identifier: string, password: string): Promise<AuthResult> {
  await delay();
  const id = identifier.trim().toLowerCase();
  if (!id) return { ok: false, message: "Email atau username tidak boleh kosong." };
  if (!password) return { ok: false, message: "Password tidak boleh kosong." };
  if (password.length < 6) return { ok: false, message: "Password minimal 6 karakter." };

  const { handle, name, email } = persistDemoUser(id);
  postToProfileBridge("LOGIN_SUCCESS", { fullName: name ?? handle, email });
  return { ok: true, message: "Login berhasil." };
}

/**
 * POST /api/auth/register — mock: validasi ringan standar + cek username/email
 * sudah dipakai (di antara data demo tetap + siapa pun yang register di sesi
 * ini), lalu persist demo identity supaya gating login ikut aktif.
 */
export async function register(input: {
  username: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  confirm: string;
}): Promise<AuthResult> {
  await delay(900);
  const { username, name, phone, email, password, confirm } = input;
  if (!username.trim()) return { ok: false, message: "Nickname/username tidak boleh kosong." };
  if (!name.trim()) return { ok: false, message: "Nama lengkap tidak boleh kosong." };
  if (phone.replace(/\D/g, "").length < 9) return { ok: false, message: "Nomor telepon tidak valid." };
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return { ok: false, message: "Format email tidak valid." };
  if (password.length < 6) return { ok: false, message: "Password minimal 6 karakter." };
  if (password !== confirm) return { ok: false, message: "Konfirmasi password tidak cocok." };

  const idUsername = username.trim().toLowerCase();
  const idEmail = email.trim().toLowerCase();
  if (registeredUsernames.has(idUsername)) {
    return {
      ok: false,
      message: "Username ini sudah dipakai. Kalau ini akunmu, coba \"Lupa password?\" saja.",
    };
  }
  if (registeredEmails.has(idEmail)) {
    return {
      ok: false,
      message: "Email ini sudah terdaftar. Kalau ini akunmu, coba \"Lupa password?\" saja.",
    };
  }

  registeredUsernames.add(idUsername);
  registeredEmails.add(idEmail);

  const { handle, name: resolvedName, email: resolvedEmail } = persistDemoUser(idUsername, {
    name: name.trim(),
    email: idEmail,
  });
  postToProfileBridge("REGISTER_SUCCESS", { fullName: resolvedName ?? handle, email: resolvedEmail });
  return { ok: true, message: "Akun berhasil dibuat." };
}

/**
 * POST /api/auth/forgot — mock: selalu sukses (simulasi email reset terkirim).
 */
export async function requestPasswordReset(email: string): Promise<AuthResult> {
  await delay(900);
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return { ok: false, message: "Format email tidak valid." };
  return { ok: true, message: "Email pemulihan terkirim." };
}

/** Logout — reset identity lokal + kabari host Flutter (kontrak AUTH_INTEGRATION.md). */
export function logout(): void {
  if (typeof window !== "undefined") window.__DARSI_USER__ = null;
  postToProfileBridge("LOGOUT");
}

/**
 * Persist demo identity ke seam ADR-017 supaya session berkelanjutan di preview.
 * `fallback` dipakai saat identifier bukan salah satu HARDCODED_DEMO_USERS (mis.
 * hasil register baru) supaya nama & email yang baru saja diisi user ikut kebawa,
 * bukan cuma username-nya.
 */
function persistDemoUser(
  identifier: string,
  fallback?: { name: string; email: string }
): { handle: string; name?: string; email?: string } {
  demoUserCounter += 1;
  const id = identifier.includes("@") ? identifier.split("@")[0] : identifier;
  const known = HARDCODED_DEMO_USERS[id.toLowerCase()];
  const name = known?.name ?? fallback?.name;
  const email = known?.email ?? fallback?.email;

  if (typeof window === "undefined") return { handle: id, name, email };
  // Hanya override kalau currently guest / dev — jangan timpa identity real dari host.
  if (!getCurrentUser() || process.env.NODE_ENV !== "production") {
    window.__DARSI_USER__ = { userId: `demo-${id}-${demoUserCounter}`, handle: id, name };
  }
  return { handle: id, name, email };
}
