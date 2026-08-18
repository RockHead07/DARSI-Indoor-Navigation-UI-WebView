# Known Issues — DARSI WebView

Bug yang sudah pernah muncul, sudah diinvestigasi, dan berpotensi muncul lagi.
Tujuannya supaya investigasi ulang tidak mulai dari nol.

---

## 🟡 "Gagal memuat data lokasi. Coba lagi nanti." di Home

**Status:** Pernah terjadi 2026-08-19, **teratasi dengan restart project Supabase.**
Berpotensi terulang selama masih di compute tier gratis.

### Gejala

Situs hidup normal (semua asset 200 OK), tapi daftar POI kosong dan muncul pesan
"Gagal memuat data lokasi". Home, Cari Lokasi, dan Destinasi Populer semua kosong.

### Akar masalah yang terkonfirmasi

Instabilitas instance Supabase, **bukan bug kode WebView.** Bukti dari dashboard
Supabase saat kejadian:

- **`could not receive data from client: Connection reset by peer`** berulang di
  Postgres Logs — koneksi diputus paksa, bukan ditutup normal.
- **17 request 5xx** dalam 60 menit terakhir.
- Compute tier **NANO** (paling kecil, tier gratis) — pola khas instance kecil yang
  kewalahan.

**Perbaikan:** `Project Settings → General → Restart project`, tunggu ~1 menit, muat
ulang WebView. Terverifikasi memulihkan: setelah restart, semua POI RSI (Farmasi,
IGD, Radiology, Resepsionis, Ruang X-Ray, Toilet, Lift, Parkir) tampil normal lagi.

Kalau `Connection reset by peer` sering berulang di jam sibuk, tier NANO memang mulai
tak memadai — itu keputusan biaya, bukan bug yang bisa dikoding keluar.

### ⚠️ Jalan buntu yang HAMPIR menyesatkan (jangan diulang)

`nslookup nwuvkkvgnrknbatjgplm.supabase.co` dari jaringan kampus PENS membalas
**"Non-existent domain"**, dan `curl` gagal resolve. Itu tampak seperti bukti kuat
project Supabase-nya sudah dihapus — **dan kesimpulan itu salah.** Dashboard
menunjukkan project `darsi` **Healthy** dengan 172 request masuk.

Penyebab NXDOMAIN itu kemungkinan besar **DNS server kampus (`iac32.pens.ac.id`)
yang tidak me-resolve domain ini**, bukan domain-nya yang hilang. Pelajaran: **jangan
menyimpulkan status layanan dari DNS satu jaringan saja** — buka dashboard-nya, atau
tes dari jaringan lain (mis. data seluler) sebelum percaya.

### Urutan diagnosis kalau terulang

1. Buka [dashboard Supabase](https://supabase.com/dashboard) → cek `STATUS` project.
   **Mulai dari sini**, bukan dari `nslookup`/`curl` (lihat jalan buntu di atas).
2. Buka **Logs** → Postgres Logs. Cari `Connection reset by peer` / lonjakan 5xx.
3. Kalau ada → **Restart project**.
4. Kalau project benar-benar sehat dan error tetap muncul, baru curigai sisi klien:
   `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` di Vercel. Ingat
   Next.js meng-**inline** `NEXT_PUBLIC_*` saat **build** — mengubahnya butuh
   redeploy, bukan sekadar restart.

---

## ℹ️ 404 `/rest/v1/pois` saat `npm run dev` lokal

**Bukan bug.** `.env.local` tidak ada di working copy (hanya `.env.example`), jadi
`SUPA`/`ANON` kosong dan request jatuh ke origin localhost → 404. Halaman auth,
profil, dan seluruh UI selain data POI tetap bisa dikembangkan & dites seperti biasa.

Isi `.env.local` dari `.env.example` kalau memang perlu data POI sungguhan saat dev.
