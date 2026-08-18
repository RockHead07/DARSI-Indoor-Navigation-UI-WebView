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
// gating login-only (Cari Teman, ADR-017) ikut menyala saat dites preview.
// TODO(T0.8 / backend auth): hapus persist manual ini — host yang set header WebView.

import { getCurrentUser } from "./user";

const delay = (ms = 700) => new Promise((r) => setTimeout(r, ms)); // simulasi latency network

let demoUserCounter = 0;

export type AuthResult = { ok: boolean; message: string };

/**
 * POST /api/auth/login — mock: kombinasi email/username terserah, password apa
 * pun diterima (≥6 karakter). Demo identity dipersist ke window.__DARSI_USER__.
 */
export async function login(identifier: string, password: string): Promise<AuthResult> {
  await delay();
  const id = identifier.trim().toLowerCase();
  if (!id) return { ok: false, message: "Email atau username tidak boleh kosong." };
  if (!password) return { ok: false, message: "Password tidak boleh kosong." };
  if (password.length < 6) return { ok: false, message: "Password minimal 6 karakter." };

  persistDemoUser(id);
  return { ok: true, message: "Login berhasil." };
}

/**
 * POST /api/auth/register — mock: validasi ringan standar, lalu persist demo
 * identity supaya gating login ikut aktif.
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

  persistDemoUser(username.trim().toLowerCase());
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

/** Persist demo identity ke seam ADR-017 supaya session berkelanjutan di preview. */
function persistDemoUser(identifier: string): void {
  demoUserCounter += 1;
  if (typeof window === "undefined") return;
  const id = identifier.includes("@") ? identifier.split("@")[0] : identifier;
  // Hanya override kalau currently guest / dev — jangan timpa identity real dari host.
  if (!getCurrentUser() || process.env.NODE_ENV !== "production") {
    window.__DARSI_USER__ = { userId: `demo-${id}-${demoUserCounter}`, handle: id };
  }
}