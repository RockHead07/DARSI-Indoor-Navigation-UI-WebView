# API_CONTRACT.md — Backend & Flutter Bridge (WebView side)

## Endpoint backend (Supabase + FastAPI) yang dibutuhkan WebView

| Endpoint | Method | Fungsi |
|---|---|---|
| `/api/poi/popular` | GET | List lokasi populer untuk Home (nama, lantai, gedung, status — TANPA jarak) |
| `/api/poi/search` | GET | `?q={query}&category={chip}` — hasil pencarian Cari Lokasi |
| `/api/poi/categories` | GET | List kategori untuk filter chip |
| `/api/friends/request` | POST | Cari Teman — kirim friend-request via identifier persis (username/ID/QR), BUKAN direktori/search terbuka |
| `/api/friends/respond` | POST | Cari Teman — penerima accept/reject request |
| `/api/friends` | GET | Cari Teman — list koneksi `accepted` + presence status-only (`online`/`ar-active`/`offline`, TANPA gedung/lantai/posisi) |
| `/api/friends/{id}` | DELETE | Cari Teman — hapus koneksi |

Catatan: response API POI TIDAK PERNAH menyertakan field jarak/distance — itu keputusan produk (ADR-007), bukan keterbatasan API. Jarak dihitung di dalam Unity setelah localize.

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
  // payload: { arrived: boolean, poiId: string | null }
  // resume ke Home atau Cari Lokasi, state terakhir
};
```

## Implementasi teknis WebView

- Bridge sudah dikunci: `webview_flutter` (`^4.10.0`) via `JavaScriptChannel` bernama `DarsiBridge`, bukan `postMessage` browser standar murni dan bukan `flutter_inappwebview` (lihat ADR-012).
- Nama channel `DarsiBridge` adalah kesepakatan kerja tim ini — kalau implementasi Flutter final di `My-eRSIy-CopyCat` pakai nama beda, update di sini dan di `INTEGRATION.md` sekaligus.
- Identitas user (untuk friendlist, `ADR-013`) masih **`⚠️ NEEDS DECISION`** — menunggu konfirmasi Pak Farris soal user ID + handle stabil dari MyRSIy (lihat `docs/ROADMAP.md` T0.8 di repo Unity). Endpoint `/api/friends/*` tidak bisa diimplementasikan sampai ini clear.
