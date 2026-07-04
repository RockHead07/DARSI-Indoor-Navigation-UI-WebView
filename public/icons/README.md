# Ikon custom DARSI WebView

Taruh file ikon di folder ini (`public/icons/`). Next.js melayaninya di `/icons/<nama>.svg`.

## Aturan penting (biar warnanya bisa ganti-ganti)

App ini memakai ikon yang SAMA dalam beberapa warna tergantung konteks — hijau di kartu
putih, putih di tombol hijau, abu-abu di toggle. Supaya satu file bisa dipakai di semua
warna itu, ikon harus **monokrom (satu warna) dengan latar transparan** (siluet). Nanti
komponen `Icon` mewarnainya via CSS mask mengikuti `currentColor`.

- **Format**: `.svg` (paling disarankan). Boleh warna apa pun di dalamnya — yang penting
  monokrom + latar transparan; warnanya akan di-override oleh app.
- **viewBox**: idealnya `0 0 24 24` (persegi). Ukuran diatur komponen, jangan set
  width/height fixed yang aneh.
- **Gaya**: line-icon (stroke ~1.8) biar seragam dengan set sekarang — tidak wajib, tapi
  konsisten.
- **Nama file** harus PERSIS seperti daftar di bawah (huruf kecil).

## Daftar ikon yang dibutuhkan (12)

| File | Dipakai untuk |
|------|---------------|
| `search.svg`     | kolom pencarian |
| `pin.svg`        | Cari Lokasi + kategori "Umum" |
| `user.svg`       | Cari Teman |
| `navigation.svg` | tombol navigasi / panah arah |
| `camera.svg`     | tombol "Mulai Navigasi AR" + FAB |
| `x.svg`          | tombol tutup / tolak request |
| `check.svg`      | terima request teman |
| `bell.svg`       | request masuk (empty state) |
| `clock.svg`      | pencarian terakhir |
| `eye.svg`        | toggle "Tampil offline" |
| `flask.svg`      | kategori Laboratorium |
| `activity.svg`   | kategori Administrasi |

Boleh kirim sebagian dulu — yang belum ada file-nya otomatis pakai ikon inline bawaan
(fallback), jadi app tidak akan patah.
