// ponytail: inline SVG paths, shared across screens — no icon dependency for ~13 glyphs
export const icons = {
  search: "M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z",
  pin: "M12 21s7-5.686 7-11a7 7 0 10-14 0c0 5.314 7 11 7 11z M12 10a1 1 0 100-2 1 1 0 000 2z",
  map: "M9 4l6 2 5-2v14l-5 2-6-2-5 2V6l5-2z M9 4v14 M15 6v14",
  flask: "M9 3h6 M10 3v6l-4 8a2 2 0 001.8 3h8.4a2 2 0 001.8-3l-4-8V3 M7 15h10",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z M12 15a3 3 0 100-6 3 3 0 000 6z",
  "eye-closed":
    "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z M12 15a3 3 0 100-6 3 3 0 000 6z M3 3l18 18",
  scan: "M4 7V5a1 1 0 011-1h2 M17 4h2a1 1 0 011 1v2 M20 17v2a1 1 0 01-1 1h-2 M7 20H5a1 1 0 01-1-1v-2 M4 12h16",
  camera:
    "M4 8a2 2 0 012-2h1l1.5-2h7L18 6h1a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8z M12 16a3.5 3.5 0 100-7 3.5 3.5 0 000 7z",
  x: "M6 6l12 12 M18 6L6 18",
  heart: "M12 20s-7-4.35-7-9.5A4.5 4.5 0 0112 6a4.5 4.5 0 017 4.5c0 5.15-7 9.5-7 9.5z",
  activity: "M3 12h4l3 8 4-16 3 8h4",
  navigation: "M12 2l7 19-7-4-7 4 7-19z",
  sliders: "M4 6h16 M14 4v4 M4 12h16 M8 10v4 M4 18h16 M17 16v4",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18z M12 7v5l3 2",
  bell: "M18 9a6 6 0 10-12 0c0 6-2.5 8-2.5 8h17S18 15 18 9z M10.5 20a2 2 0 003 0",
  pill: "M10.5 4.5l-6 6a4.24 4.24 0 106 6l6-6a4.24 4.24 0 10-6-6z M8 7l6 6",
  stethoscope:
    "M6 3H4v5a4 4 0 008 0V3h-2 M9 15v1a4 4 0 008 0v-3 M17 12a1.6 1.6 0 100 .1z",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  check: "M20 6L9 17l-5-5",
  // Presence (file-only, dipakai di badge Cari Teman). Path di bawah cuma fallback
  // sederhana kalau file-nya hilang.
  online: "M12 8a4 4 0 100 8 4 4 0 000-8z",
  ar: "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z M12 12l8-4.5 M12 12v9 M12 12L4 7.5",
  offline: "M12 4a8 8 0 100 16 8 8 0 000-16z M6 6l12 12",
  // Cari Teman (file-only). Path di bawah cuma fallback sederhana kalau file hilang.
  "friend-list": "M16 21v-2a4 4 0 00-3-3.87 M8 21v-2a4 4 0 013-3.87 M9 11a3 3 0 100-6 3 3 0 000 6z M17 11a3 3 0 100-6 3 3 0 000 6z",
  "add-friend": "M14 20v-1a5 5 0 00-5-5H6a5 5 0 00-5 5v1 M7.5 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7z M19 8v6 M22 11h-6",
  mail: "M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z M3.5 7l8.5 6 8.5-6",
  "mail-alert": "M15 5H4a1 1 0 00-1 1v10a1 1 0 001 1h13a1 1 0 001-1v-5 M3.5 7l8 5.5 M19 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  // Kategori POI rumah sakit (file-only, dipetakan dari kategori lewat categoryIcon()
  // di lib/api.ts). Path di bawah cuma fallback sederhana kalau file-nya hilang —
  // glyph asli datang dari public/icons/<nama>.svg.
  cross: "M9 4h6v5h5v6h-5v5H9v-5H4V9h5z",
  mortar: "M5 10h14a7 7 0 01-14 0z M12 17v3 M8 20h8 M14 4l-3 6",
  xray: "M6 3h12v18H6z M6 9h12 M6 15h12 M10 9v6 M14 9v6",
  bed: "M3 8v11 M3 13h18v6 M21 13v-2a3 3 0 00-3-3h-6v5 M7 12a2 2 0 100-4 2 2 0 000 4z",
  scalpel: "M13 4l7 7-10 10-4 1 1-4z M13 4l-9 9",
  baby: "M12 6a2 2 0 100-4 2 2 0 000 4z M8 22l1-7 3-2 3 2 1 7 M9 13h6",
  clipboard: "M9 4h6v3H9z M7 5H5v16h14V5h-2 M9 12h6 M9 16h4",
  wallet: "M4 7h13a2 2 0 012 2v8a2 2 0 01-2 2H4z M4 7V5h11 M17 13h2.5",
  info: "M12 21a9 9 0 100-18 9 9 0 000 18z M12 11v5 M12 7.5h.01",
  card: "M3 7h18v10H3z M3 11h18 M7 15h4",
  folder: "M3 6h6l2 2h10v10H3z",
  mosque: "M12 3s5 3 5 7H7c0-4 5-7 5-7z M12 6v-3 M5 21v-9 M19 21v-9 M8 21v-6h8v6 M4 12h16",
  restroom: "M12 3v18 M8 21v-6 M8 15a2 2 0 100-4 2 2 0 000 4z M16 21v-6h1.5l-2-4h-1l-2 4H16 M16 11a2 2 0 100-4 2 2 0 000 4z",
  utensils: "M6 3v7a2 2 0 004 0V3 M8 10v11 M17 3c-2 0-3 2-3 5s1 4 3 4v9",
  atm: "M4 6h16v9H4z M4 19h16 M8 10h2 M14 10h2",
  parking: "M6 4h12v16H6z M10 8h3.5a2 2 0 010 4H10v-4 M10 12v4",
  waiting: "M6 10V7a2 2 0 012-2h1v7 M6 10v8 M6 14h11v4 M17 10V7a1 1 0 011-1",
  elevator: "M6 3h12v18H6z M12 3v18 M9 9l-1.5 2h3z M15 15l-1.5-2h3z",
  stairs: "M4 20h4v-4h4v-4h4v-4h4",
  door: "M6 3h9v18H6z M12 12h.5 M15 8h4v13h-4",
} as const;

export type IconName = keyof typeof icons;

// Ikon yang punya file custom, dipetakan ke SUBFOLDER segmennya di public/icons/.
// File di-render via CSS mask supaya ikut `currentColor` (hijau/putih/abu sesuai
// konteks). URL yang dipakai = /icons/<segmen>/<name>.svg. Nama yang tidak ada di
// sini tetap pakai path inline di atas (fallback, tidak pernah patah).
// ponytail: subfolder butuh map nama→segmen ini (nama file saja tak cukup lagi) —
// itu harga dari merapikan direktori per segmen; tambahkan entri saat menaruh file baru.
const FILE_ICON_DIR: Partial<Record<IconName, string>> = {
  // UI (dipakai layar, bukan kategori POI)
  search: "ui",
  pin: "ui",
  user: "ui",
  camera: "ui",
  x: "ui",
  check: "ui",
  bell: "ui",
  clock: "ui",
  eye: "ui",
  "eye-closed": "ui",
  online: "ui",
  ar: "ui",
  offline: "ui",
  "friend-list": "ui",
  "add-friend": "ui",
  mail: "ui",
  "mail-alert": "ui",
  // Klinis / instalasi medis
  cross: "klinis",
  stethoscope: "klinis",
  mortar: "klinis",
  flask: "klinis",
  xray: "klinis",
  bed: "klinis",
  scalpel: "klinis",
  heart: "klinis",
  baby: "klinis",
  activity: "klinis",
  // Administrasi / layanan
  clipboard: "administrasi",
  wallet: "administrasi",
  info: "administrasi",
  card: "administrasi",
  folder: "administrasi",
  // Fasilitas umum
  mosque: "fasilitas",
  restroom: "fasilitas",
  utensils: "fasilitas",
  atm: "fasilitas",
  parking: "fasilitas",
  waiting: "fasilitas",
  // Sirkulasi / wayfinding
  elevator: "sirkulasi",
  stairs: "sirkulasi",
  door: "sirkulasi",
  // "navigation" belum ada file-nya → tetap pakai path inline (fallback).
};

export function Icon({
  name,
  className = "",
  size = 18,
}: {
  name: IconName;
  className?: string;
  size?: number;
}) {
  const dir = FILE_ICON_DIR[name];
  if (dir) {
    // Siluet monokrom dari file (/icons/<segmen>/<name>.svg), diwarnai currentColor lewat mask.
    const url = `url(/icons/${dir}/${name}.svg)`;
    return (
      <span
        role="img"
        aria-hidden
        className={className}
        style={{
          display: "inline-block",
          width: size,
          height: size,
          backgroundColor: "currentColor",
          WebkitMaskImage: url,
          maskImage: url,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={icons[name]} />
    </svg>
  );
}
