# Ikon custom DARSI WebView

File ikon ditata per **segmen** di subfolder `public/icons/<segmen>/`. Next.js melayaninya
di `/icons/<segmen>/<nama>.svg`. Segmen: `ui`, `klinis`, `administrasi`, `fasilitas`,
`sirkulasi`.

```
public/icons/
  ui/            search, pin, user, camera, x, check, bell, clock, eye, eye-closed,
                 online, ar, offline, friend-list, add-friend, mail, mail-alert
  klinis/        cross, stethoscope, mortar, flask, xray, bed, scalpel, heart, baby, activity
  administrasi/  clipboard, wallet, info, card, folder
  fasilitas/     mosque, restroom, utensils, atm, parking, waiting
  sirkulasi/     elevator, stairs, door
```

Saat menaruh file ikon baru: taruh di subfolder segmen yang tepat, lalu daftarkan
nama→segmen di `FILE_ICON_DIR` (`app/icons.tsx`).

## Aturan penting (biar warnanya bisa ganti-ganti)

App ini memakai ikon yang SAMA dalam beberapa warna tergantung konteks — hijau di kartu
putih, putih di tombol hijau, abu-abu di toggle. Supaya satu file bisa dipakai di semua
warna itu, ikon harus **monokrom (satu warna) dengan latar transparan** (siluet). Nanti
komponen `Icon` mewarnainya via CSS mask mengikuti `currentColor`.

- **Format**: `.svg`. Boleh warna apa pun di dalamnya — yang penting monokrom + latar
  transparan; warnanya akan di-override oleh app.
- **viewBox**: idealnya `0 0 24 24` (persegi). Ukuran diatur komponen.
- **Gaya**: line-icon (stroke ~1.8) biar seragam. Tidak wajib, tapi konsisten.
- **Nama file** harus PERSIS seperti daftar di bawah (huruf kecil, kebab-case).

## Cara kerja (2 tempat yang harus sinkron)

1. **`app/icons.tsx`** — setiap nama ikon didaftarkan di `icons` (untuk tipe + fallback
   inline) dan di `FILE_ICON_DIR` (memetakan nama → subfolder segmen → di-render via mask).
2. **`app/lib/api.ts` → `categoryIcon()`** — memetakan **kategori POI** dari backend ke
   nama ikon. Ini yang bikin "Lab pakai flask, IGD pakai cross", dst. Kategori tak dikenal
   otomatis jatuh ke `pin` (aman).

---

## A. Ikon UI (dipakai layar, bukan kategori POI)

| File | Dipakai untuk |
|------|---------------|
| `search.svg` | kolom pencarian |
| `pin.svg` | penanda lokasi / fallback kategori |
| `user.svg` | Cari Teman |
| `camera.svg` | tombol "Mulai Navigasi AR" + FAB |
| `x.svg` | tutup / tolak request |
| `check.svg` | terima request teman |
| `bell.svg` | notifikasi |
| `clock.svg` | pencarian terakhir |
| `eye.svg` / `eye-closed.svg` | toggle "Tampil offline" |
| `online.svg` / `ar.svg` / `offline.svg` | badge presence teman |
| `friend-list.svg` / `add-friend.svg` | Cari Teman (empty state + tombol) |
| `mail.svg` / `mail-alert.svg` | Request Masuk |
| `navigation.svg` | *(belum ada file — pakai fallback panah inline)* |

## B. Kategori POI — Rumah Sakit (RSI)

> Kategori final harus divalidasi ke IT/manajemen RSI (mereka punya struktur unit resmi).
> Nama kategori di sini = key `categoryIcon()`; ubah kalau nama unit RSI beda.

**Klinis / instalasi medis**
| Kategori | File ikon |
|----------|-----------|
| IGD | `cross.svg` |
| Poliklinik | `stethoscope.svg` |
| Farmasi | `mortar.svg` |
| Laboratorium | `flask.svg` |
| Radiologi | `xray.svg` |
| Rawat Inap | `bed.svg` |
| Kamar Operasi | `scalpel.svg` |
| ICU | `heart.svg` |
| Ruang Bersalin | `baby.svg` |
| Fisioterapi | `activity.svg` |

**Administrasi / layanan**
| Kategori | File ikon |
|----------|-----------|
| Pendaftaran | `clipboard.svg` |
| Kasir | `wallet.svg` |
| Informasi | `info.svg` |
| BPJS | `card.svg` |
| Rekam Medis | `folder.svg` |

**Fasilitas umum**
| Kategori | File ikon |
|----------|-----------|
| Musholla | `mosque.svg` |
| Toilet | `restroom.svg` |
| Kantin | `utensils.svg` |
| ATM | `atm.svg` |
| Parkir | `parking.svg` |
| Ruang Tunggu | `waiting.svg` |

**Sirkulasi / wayfinding**
| Kategori | File ikon |
|----------|-----------|
| Lift | `elevator.svg` |
| Tangga | `stairs.svg` |
| Pintu Masuk | `door.svg` |

## C. Kategori demo kampus (lama)

`Umum → pin.svg`, `Administrasi → activity.svg`, `Laboratorium → flask.svg`. Masih didukung
`categoryIcon()` supaya seed 11 POI kampus tetap ber-ikon sampai data RSI menggantikan.

---

Boleh kirim sebagian dulu — nama yang belum ada file-nya otomatis pakai ikon inline bawaan
(fallback), jadi app tidak akan patah.
