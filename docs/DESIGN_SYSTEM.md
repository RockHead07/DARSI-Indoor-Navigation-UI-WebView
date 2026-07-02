# DESIGN_SYSTEM.md — DARSI Official Brand (WebView)

> Palette ini independen dari hex asli MyRSIy — keputusan sadar, lihat ADR-005 di `DECISIONS.md`.

## Warna

| Token | Hex | Nama | Usage |
|---|---|---|---|
| primary-green | `#035030` | Sensational Green | Section title, CTA button, primary icon, FAB |
| accent-lime | `#93BB24` | Lime Peel | Active chip, highlight aksen |
| surface-tint-1 | `#DEE9BE` | Beryl Green | Icon container bg, top-match accent |
| surface-tint-2 | `#EDF1E0` | Refreshing Ivory | "Lihat semua" pill bg, selected-card bg |
| surface-tint-3 | `#DFEAE6` | Cute Silver | Border, divider |
| page-bg | `#F8F9FB` | Authentic White | Page/content background |
| text-primary | `#0A0B0D` | Space Black | Heading, nama lokasi |
| text-secondary | `#414745` | Matte Graphite | Body text, subtitle |
| text-muted | `#3B3B3A` | Brushed Nickel | Caption, placeholder |
| surface-white | `#FFFFFF` | — | Card background |
| status-full-bg | `#FCEBEB` | — | Badge "Penuh" — satu-satunya exception di luar green system |
| status-full-text | `#A32D2D` | — | Badge "Penuh" text |

**Aturan:** tidak ada warna biru di manapun dalam WebView DARSI. Ini green-primary design, konsisten dengan identitas RS Islam.

## Tipografi

- **Font:** Roboto (Google Fonts)
- Section title: Bold 14-15pt, `#035030`
- Body: Regular 11-13pt, `#414745`
- Caption/badge: Bold 9-10pt

## Spacing & radius

| Token | Value |
|---|---|
| Page padding | 16px |
| Section gap | 12-14px |
| Card radius (sm) | 12px |
| Card radius (md) | 14-16px |
| Card radius (lg) | 18-20px |
| Pill radius | 999px (full) |

## Aturan struktural yang WAJIB dipatuhi

1. **JANGAN gambar header/AppBar/back button apapun.** Header adalah tanggung jawab `DarsiNavigationScreen` di Flutter (native). Frame WebView dimulai langsung dari konten (search bar / floor selector / dll), seolah 88px bagian atas sudah dipotong.
2. **JANGAN tampilkan jarak/meter di screen manapun di WebView ini.** Lihat ADR-007 — jarak hanya valid setelah AR aktif. Info lokasi cukup lantai + gedung.
3. **JANGAN pakai istilah "POI" di teks yang dilihat user.** Pakai "lokasi", "ruangan", atau "tujuan". Lihat ADR-009. (Di kode/variable/API tetap boleh `poi`.)
4. **Tidak ada screen Peta 2D.** Sudah dihapus dari scope, lihat ADR-006.
