// Identitas user DARSI — SATU sumber kebenaran (seam untuk integrasi MyRSIy, ADR-017).
//
// Identitas datang dari host MyRSIy (Flutter) yang meng-inject `window.__DARSI_USER__`
// saat WebView di-load — arahnya host→WebView, sama seperti `window.onARSessionClosed`.
// Payload host cukup { userId } stabil (UUID/PK yang TIDAK didaur ulang); `handle`
// opsional — kalau host tak kasih, DARSI yang mint handle sendiri nanti (ADR-017),
// jadi MyRSIy tidak perlu expose PII.
//
// Kontrak `window.__DARSI_USER__` (host wajib set SEBELUM app mount, atau biarkan absen):
//   - object { userId, handle? } → user login
//   - null                        → tamu (eksplisit)
//   - absen (tanpa host)          → dev: fake login biar Cari Teman bisa dites; prod: tamu
//
// Gating (ADR-017): navigasi = boleh tamu; Cari Teman = login-only.

export type CurrentUser = { userId: string; handle: string };

declare global {
  interface Window {
    __DARSI_USER__?: { userId: string; handle?: string } | null;
  }
}

// Dipakai HANYA saat tanpa host (preview/dev di browser biasa) supaya Cari Teman testable.
const DEV_USER: CurrentUser = { userId: "dev-user-001", handle: "kamu" };

/** Identitas user aktif, atau null kalau tamu (belum login MyRSIy). Client-only. */
export function getCurrentUser(): CurrentUser | null {
  if (typeof window === "undefined") return null; // SSR: anggap tamu sampai hydrate

  // Host sudah menyetel (termasuk null = tamu eksplisit) → hormati.
  if ("__DARSI_USER__" in window) {
    const u = window.__DARSI_USER__;
    return u?.userId ? { userId: u.userId, handle: u.handle ?? u.userId } : null;
  }

  // Tanpa host: dev = fake login (testable), produksi = tamu.
  return process.env.NODE_ENV !== "production" ? DEV_USER : null;
}
