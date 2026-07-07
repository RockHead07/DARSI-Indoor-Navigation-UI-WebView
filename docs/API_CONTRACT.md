# API_CONTRACT.md — Backend & Flutter Bridge (WebView side)

## Endpoint backend (Supabase + FastAPI) yang dibutuhkan WebView

| Endpoint | Method | Fungsi |
|---|---|---|
| `/api/poi/popular` | GET | List lokasi populer untuk Home (nama, lantai, gedung, status, description, photos — TANPA jarak) |
| `/api/poi/search` | GET | `?q={query}&category={chip}` — hasil pencarian Cari Lokasi (field sama dengan popular) |
| `/api/poi/categories` | GET | List kategori untuk filter chip |
| `/api/friends/request` | POST | Cari Teman — kirim friend-request via identifier persis (username/ID/QR), BUKAN direktori/search terbuka |
| `/api/friends/respond` | POST | Cari Teman — penerima accept/reject request |
| `/api/friends` | GET | Cari Teman — list koneksi `accepted` + presence status-only (`online`/`ar-active`/`offline`, TANPA gedung/lantai/posisi) |
| `/api/friends/{id}` | DELETE | Cari Teman — hapus koneksi |

Catatan: response API POI TIDAK PERNAH menyertakan field jarak/distance — itu keputusan produk (ADR-007), bukan keterbatasan API. Jarak dihitung di dalam Unity setelah localize.

Catatan detail POI: `description` (teks) dan `photos` (array URL gambar, boleh kosong → UI render placeholder) adalah konten display-only milik backend (ADR-014), dipakai bottom-sheet detail lokasi. Tap POI di Home/Cari Lokasi membuka sheet detail dulu; `launchAR` baru terpanggil dari CTA "Mulai Navigasi AR" di dalam sheet.

Catatan `id` POI: response POI menyertakan `id` = GUID stabil dari Unity (`POIData.poiId`, kolom `unity_id`). WebView mengirim balik `id` ini sebagai `launchAR.poiId` supaya navigasi TIDAK patah kalau nama tampilan POI di-rename. `id` bisa `null` untuk baris legacy yang belum ter-sync → WebView fallback ke `name` (Unity lalu fuzzy-match by name).

Catatan friendlist (lihat ADR-013): seluruh UI kirim/accept request dan lihat presence ADA DI WEBVIEW (2D), bukan di dalam AR — lihat `FLOWS.md` bagian 5 dan ADR-013 (Google ARCore guideline: hindari full-screen takeover di AR). WebView yang panggil keempat endpoint di atas, Unity hanya terima `connectionId` yang statusnya sudah `accepted`. Presence yang dikembalikan `GET /api/friends` TIDAK PERNAH menyertakan lokasi — hanya status kehadiran. Rate-limit request masuk + kemampuan block ada di endpoint `respond`/`{id}`.

## Kontrak postMessage ke Flutter

Kontrak ini HARUS identik dengan `docs/INTEGRATION.md` di repo Unity.

### WebView → Flutter (launch AR)

Bridge pakai `webview_flutter` (`^4.10.0`, sudah dikonfirmasi — lihat ADR-012), mekanismenya `JavaScriptChannel`, bukan `flutter_inappwebview`. Sisi Flutter register channel bernama `DarsiBridge`; sisi JS panggil `postMessage` dengan string JSON:

```js
DarsiBridge.postMessage(JSON.stringify({
  action: 'launchAR',
  mode: 'navigate', // 'navigate' | 'freeExplore' | 'findFriend'
  poiId: 'string atau null',
  poiName: 'string atau null',
  floor: 'string atau null',
  building: 'string atau null',
  connectionId: 'string atau null' // wajib diisi saat mode === 'findFriend', ID koneksi friendlist yang sudah accepted
}));
```

Trigger: tap CTA "Mulai Navigasi AR" (Cari Lokasi), FAB kamera (Home, mode `freeExplore`), atau tombol "Navigasi ke [teman]" pada teman berstatus `ar-active` di friendlist (mode `findFriend`, lihat ADR-013).

### Flutter → WebView (setelah AR selesai, resume state)

WebView harus bisa menerima event ini untuk resume ke state terakhir (bukan reload):

```js
window.onARSessionClosed = function(payload) {
  // payload: { arrived: boolean, poiId: string | null, poiName: string | null }
  // poiId = GUID stabil (identitas); poiName = nama tampilan untuk banner "Kamu telah tiba di …"
  // resume ke Home atau Cari Lokasi, state terakhir
};
```

### Flutter → WebView (identitas user saat load) — seam integrasi MyRSIy (ADR-017)

Fitur **Cari Teman = login-only** (navigasi lokasi tetap boleh tamu). Identitas **tidak**
ikut `launchAR`; ia disuntik host saat WebView di-load — arah host→WebView, sama seperti
`onARSessionClosed`. Host (MyRSIy via Flutter) **wajib set `window.__DARSI_USER__` SEBELUM
app mount:**

```js
// user login:
window.__DARSI_USER__ = { userId: "uuid-stabil", handle: "opsional" };
// atau tamu (eksplisit):
window.__DARSI_USER__ = null;
```

- **`userId`** — satu-satunya field yang WAJIB dari MyRSIy: **stabil + TIDAK didaur ulang**
  (UUID atau PK auto-increment). Ini kunci friend graph. Hapus-akun MyRSIy = koneksi
  di-drop; yang dilarang cuma *reuse* ID ke user lain.
- **`handle`** — OPSIONAL. Kalau MyRSIy tak kasih, DARSI mint handle sendiri saat user
  pertama pakai Cari Teman (disimpan di tabel `profiles` DARSI, di-key `userId`). Jadi
  MyRSIy **tidak perlu expose PII** (nama asli/RM/NIK) — cukup `userId`.
- WebView baca via `getCurrentUser()` (`app/lib/user.ts`, SATU sumber kebenaran). Tanpa
  host: dev = fake login (testable), produksi = tamu. `__DARSI_USER__` absen ⇒ tamu.

## Implementasi teknis WebView

- Bridge sudah dikunci: `webview_flutter` (`^4.10.0`) via `JavaScriptChannel` bernama `DarsiBridge`, bukan `postMessage` browser standar murni dan bukan `flutter_inappwebview` (lihat ADR-012).
- Nama channel `DarsiBridge` adalah kesepakatan kerja tim ini — kalau implementasi Flutter final di `My-eRSIy-CopyCat` pakai nama beda, update di sini dan di `INTEGRATION.md` sekaligus.
- Identitas user (friendlist, ADR-013/017): **seam sudah dibangun** (`app/lib/user.ts` + kontrak `window.__DARSI_USER__` di atas), jadi Fase 2 bisa dibangun & dites di atas identitas suntikan (dev/copycat) TANPA nunggu MyRSIy. Yang tersisa cuma **final wiring**: MyRSIy asli mengisi `userId` saat launch. Pertanyaan ke MyRSIy sudah menyempit jadi 1: *"bisa oper `userId` stabil (UUID/PK, tak didaur ulang) saat launch modul DARSI?"* (lihat `docs/ROADMAP.md` T0.8). `handle` tidak lagi diperlukan dari MyRSIy (DARSI mint sendiri — ADR-017).
