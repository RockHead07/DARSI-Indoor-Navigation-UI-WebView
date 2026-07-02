# FLOWS.md — User Flows (LOCKED)

> Semua flow di bawah ini sudah final berdasarkan diskusi arsitektur. Perubahan flow harus ditambahkan sebagai ADR baru di `DECISIONS.md`.

## 1. Entry Flow

```
MyRSIy Home
  → tap menu "Navigasi Indoor"
  → Flutter push DarsiNavigationScreen
      (AppBar hijau native: back button, "Navigasi Indoor", subtitle, ornamen)
  → body screen load WebView → URL Next.js DARSI
  → WebView tampilkan Home
```

Menu item "Navigasi Indoor" ditambahkan ke `menu_items.dart` (Flutter), action type `webview`, target `DarsiNavigationScreen`.

## 2. Browsing Flow (WebView — tanpa jarak)

**Home:**
- Search bar (placeholder "Cari ruangan, poli, layanan...")
- Quick action: "Cari Lokasi" (Lihat Peta sudah dihapus — lihat ADR-006)
- Destinasi Populer — horizontal card, tampilkan nama + lantai/gedung SAJA (tanpa meter)
- Layanan Lainnya — list, status badge (Buka/Antre/Penuh)
- Floating Action Button kamera — shortcut ke AR (free explore mode)

**Cari Lokasi:**
- Search input + filter chip kategori
- Hasil list: nama + lantai/gedung + status badge (TANPA meter — lihat ADR-007)
- Tap hasil → selected-location confirmation card muncul
- CTA "Mulai Navigasi AR" aktif setelah lokasi dipilih (atau langsung tersedia untuk free explore)

## 3. Transisi ke AR

```
User tap "Mulai Navigasi AR" (dari Home FAB atau Cari Lokasi CTA)
  → WebView: postMessage({ action: 'launchAR', poiId?, poiName?, floor?, building? })
  → Flutter native menerima message
  → Flutter launch Unity via UaaL (UnityPlayerActivity / setara)
  → Unity boot LANGSUNG ke AR Canvas (tanpa splash/login internal — sudah dihapus, lihat ADR-003)
```

## 4. AR Navigation Flow (Unity)

```
AR Canvas aktif
  → MultiSet SDK localize (bagian dari proses masuk AR, BUKAN gate terpisah — lihat ADR-008)
  → Localize berhasil:
      - Jika ada tujuan (poiId dari WebView) → AR Navigation state "Active"
          → arrow, dashed path, bottom drawer (jarak REAL + ETA)
          → state "Reroute" jika user keluar jalur
          → state "Arrived" saat sampai tujuan
      - Jika tidak ada tujuan (free explore) → tampilkan UI pilih tujuan di dalam AR,
        atau buka panel Cari Teman
```

## 5. Cari Teman Flow (pairing-code — AR only)

**Prasyarat:** kedua user (A dan B) harus sudah localized di sesi AR aktif masing-masing.

```
User A buka panel "Cari Teman" di dalam AR
  → pilih "Buat Kode"
  → sistem generate kode singkat (contoh: 6 digit), expire dalam waktu tertentu (contoh: 2 jam)
  → A bagikan kode ke B lewat channel eksternal (WhatsApp / lisan / dll — DI LUAR app)

User B buka panel "Cari Teman" di dalam AR (juga sudah localized)
  → pilih "Masukkan Kode"
  → input kode dari A
  → validasi ke backend: kode valid + A masih dalam sesi AR aktif?
  → jika valid: posisi A dan B saling terlihat di AR (dot + jarak + tombol "Navigasi ke [nama]")
  → jika A menutup sesi AR / kode expire → pairing otomatis berakhir
```

**Yang TIDAK ada di flow ini** (lihat ADR-010 untuk alasan):
- Tidak ada daftar "orang di sekitar yang terdeteksi otomatis"
- Tidak ada notifikasi ke stranger bahwa mereka "terdeteksi"
- Tidak ada fitur reject/accept yang mengonfirmasi keberadaan seseorang ke pihak yang tidak diinginkan

## 6. Return Flow

```
User selesai (arrived / tap back di AR) 
  → Unity kirim signal ke Flutter (AR session closed)
  → Flutter tutup Unity, kembali ke DarsiNavigationScreen
  → WebView RESUME (state Home/Cari Lokasi terakhir, TIDAK reload dari awal)
  → back button di AppBar native → kembali ke MyRSIy Home
```

## Ringkasan: screen yang ADA vs yang DIHAPUS dari scope

| Screen | Status | Keterangan |
|---|---|---|
| Home (WebView) | ✅ Ada | Tanpa jarak meter |
| Cari Lokasi (WebView) | ✅ Ada | Tanpa jarak meter |
| Peta 2D (WebView) | ❌ Dihapus | ADR-006 |
| Deteksi Lokasi / scan gate (WebView) | ❌ Dihapus | ADR-008 |
| Splash / Auth / Login / Register / Home (Unity UI Toolkit) | ❌ Dihapus dari Unity | ADR-003 — sudah di-cleanup dari repo |
| AR Navigation (Unity) | ✅ Ada | Active, Reroute, Arrived states |
| Cari Teman (Unity, pairing-code) | ✅ Ada (baru) | AR-only, lihat flow #5 |
| Voice Input (Unity uGUI) | ✅ Ada (existing) | Tidak berubah |