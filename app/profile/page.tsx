"use client";

// Entry point yang di-load Flutter ProfileScreen (PROFILE_AUTH_URL, default
// "/profile") -- lihat docs/AUTH_INTEGRATION.md di repo My-eRSIy-CopyCat-.
//
// Tata letaknya meniru layar Profil MyRSIy asli: blok identitas, daftar menu
// "Bantuan & Informasi", aksi akun, lalu versi app. Header hijau TIDAK dibuat di
// sini -- Flutter ProfileScreen sudah punya header nativenya sendiri, jadi
// menggambarnya lagi berarti dua header bertumpuk.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, type IconName } from "../icons";
import { type CurrentUser, getCurrentUser } from "../lib/user";
import { logout } from "../lib/auth";

const APP_VERSION = "0.1.0"; // selaras dengan package.json

// ponytail: tujuan tiap menu belum ada isinya (T&C, FAQ, dsb belum ditulis).
// Rownya tetap dirender supaya rangka layar sesuai MyRSIy, tapi tap-nya jujur
// bilang "belum tersedia" -- bukan link mati yang diam saja saat ditekan.
const HELP_MENU: { icon: IconName; label: string }[] = [
  { icon: "heart", label: "Penilaian Aplikasi" },
  { icon: "clipboard", label: "Syarat & Ketentuan" },
  { icon: "info", label: "FAQ" },
  { icon: "navigation", label: "Tentang Aplikasi" },
];

function MenuRow({
  icon,
  label,
  onClick,
  last,
}: {
  icon: IconName;
  label: string;
  onClick: () => void;
  last: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-refreshing-ivory ${
        last ? "" : "border-b-[0.5px] border-cute-silver"
      }`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-beryl-green text-sensational-green">
        <Icon name={icon} size={18} />
      </span>
      <span className="flex-1 text-[13px] font-bold text-space-black">{label}</span>
      <span className="text-brushed-nickel">
        <Icon name="navigation" size={13} className="rotate-90" />
      </span>
    </button>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null | undefined>(undefined);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => setUser(getCurrentUser()), []);

  // Sembunyikan notice otomatis supaya tidak menggantung selamanya.
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 2200);
    return () => clearTimeout(t);
  }, [notice]);

  if (user === undefined) {
    return <div className="min-h-full bg-authentic-white" />;
  }

  return (
    <div className="min-h-full bg-authentic-white pb-10 font-sans">
      {/* Identitas */}
      <div className="flex items-center gap-3 px-4 pt-5">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-beryl-green text-sensational-green">
          <Icon name="user" size={28} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[18px] font-black leading-tight text-space-black">
            {user ? (user.name ?? user.handle) : "Tamu"}
          </p>
          <p className="mt-0.5 truncate text-[12px] text-matte-graphite">
            {user ? `@${user.handle}` : "Masuk untuk akses penuh"}
          </p>
        </div>
      </div>

      {/* Bantuan & Informasi */}
      <p className="px-4 pb-2 pt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-brushed-nickel">
        Bantuan &amp; Informasi
      </p>
      <div className="mx-4 overflow-hidden rounded-[14px] border-[0.5px] border-cute-silver bg-white">
        {HELP_MENU.map((m, i) => (
          <MenuRow
            key={m.label}
            icon={m.icon}
            label={m.label}
            last={i === HELP_MENU.length - 1}
            onClick={() => setNotice(`${m.label} belum tersedia.`)}
          />
        ))}
      </div>

      {/* Aksi akun */}
      <div className="mx-4 mt-4">
        {user ? (
          <button
            onClick={() => {
              logout();
              setUser(null);
            }}
            className="flex w-full items-center gap-3 rounded-[14px] border-[0.5px] border-cute-silver bg-white px-4 py-3.5 text-left transition-colors active:bg-refreshing-ivory"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#FCEBEB] text-[#A32D2D]">
              <Icon name="x" size={18} />
            </span>
            <span className="flex-1 text-[13px] font-bold text-[#A32D2D]">Keluar</span>
          </button>
        ) : (
          <button
            onClick={() => router.push("/auth/login")}
            className="flex w-full items-center gap-3 rounded-[14px] border-[0.5px] border-cute-silver bg-white px-4 py-3.5 text-left transition-colors active:bg-refreshing-ivory"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-beryl-green text-sensational-green">
              <Icon name="add-friend" size={18} />
            </span>
            <span className="flex-1 text-[13px] font-bold text-sensational-green">
              Masuk / Daftar Akun
            </span>
          </button>
        )}
      </div>

      <p className="mt-6 text-center text-[11px] text-brushed-nickel">
        Versi Aplikasi {APP_VERSION}
      </p>

      {notice && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 flex justify-center px-6">
          <span className="rounded-full bg-space-black/85 px-4 py-2 text-[12px] font-bold text-white shadow-lg">
            {notice}
          </span>
        </div>
      )}
    </div>
  );
}
