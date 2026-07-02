# CLAUDE.md — DARSI WebView (Next.js repo)

Baca `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/FLOWS.md`, `docs/DESIGN_SYSTEM.md`, dan `docs/API_CONTRACT.md` dulu sebelum mengerjakan apapun — semua keputusan desain dan arsitektur project ini sudah dikunci di file-file tersebut, jangan asumsikan dari training data atau pattern umum.

## Ringkasan super singkat

Repo ini adalah UI pre-AR untuk DARSI Indoor Navigation — hanya berisi screen **Home** dan **Cari Lokasi**. Di-load sebagai WebView di dalam `DarsiNavigationScreen` (Flutter native, app MyRSIy). Setelah user pilih tujuan dan tap "Mulai Navigasi AR", kontrol berpindah ke Unity (lihat `docs/API_CONTRACT.md`) — repo ini TIDAK menangani AR sama sekali.

## Aturan paling kritis — jangan pernah dilanggar

1. **TIDAK ADA header/AppBar/back button di repo ini.** Header hijau (logo, judul, subtitle, ornamen) adalah tanggung jawab Flutter native. Setiap screen di sini dimulai langsung dari konten.
2. **TIDAK ADA angka jarak (meter) di manapun.** Info lokasi hanya lantai + gedung + status (Buka/Antre/Penuh). Jarak real hanya ada di dalam sesi AR (Unity), bukan di sini.
3. **TIDAK ADA screen Peta 2D.** Sudah dihapus dari scope.
4. **Istilah "POI" tidak boleh muncul di teks user-facing.** Pakai "lokasi"/"ruangan"/"tujuan". Boleh tetap "poi" di kode/API.
5. **Warna resmi DARSI ada di `DESIGN_SYSTEM.md`** — hijau `#035030` dkk, font Roboto. Ini BUKAN warna asli MyRSIy (yang lain lagi), ini brand DARSI sendiri, sudah keputusan sadar pemilik project.

## Yang perlu dibangun

- [ ] Setup project Next.js dasar
- [ ] Home screen sesuai `DESIGN_SYSTEM.md` + `FLOWS.md` bagian 2
- [ ] Cari Lokasi screen sesuai `DESIGN_SYSTEM.md` + `FLOWS.md` bagian 2
- [ ] Integrasi API ke backend Supabase/FastAPI sesuai `API_CONTRACT.md`
- [ ] postMessage bridge ke Flutter sesuai `API_CONTRACT.md`

## Alur kerja yang diharapkan

Jangan commit tanpa review dari pemilik project (Bagus). Kalau ada requirement yang bikin salah satu aturan kritis di atas perlu dilanggar, tanyakan dulu — jangan diam-diam menyimpang.

## Catatan teknis Next.js

@AGENTS.md
