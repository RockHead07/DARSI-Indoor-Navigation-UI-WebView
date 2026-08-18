"use client";

// Entry point yang di-load Flutter ProfileScreen (PROFILE_AUTH_URL, default
// "/profile") -- lihat docs/AUTH_INTEGRATION.md di repo My-eRSIy-CopyCat-.
// Tamu -> arahkan ke login/register. Sudah login -> ringkasan profil + keluar.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "../icons";
import { type CurrentUser, getCurrentUser } from "../lib/user";
import { logout } from "../lib/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null | undefined>(undefined);

  useEffect(() => setUser(getCurrentUser()), []);

  // Tamu -> langsung ke form login, tanpa layar perantara "kamu belum masuk".
  // Jalur daftar tetap terbuka lewat "Belum punya akun? Daftar sekarang" di
  // halaman login itu sendiri. `replace` (bukan `push`) supaya tombol back
  // tidak memantul balik ke /profile yang akan mengarahkan ulang ke sini.
  useEffect(() => {
    if (user === null) router.replace("/auth/login");
  }, [user, router]);

  if (user === undefined || user === null) {
    return <div className="min-h-full bg-authentic-white" />;
  }

  return (
    <div className="flex min-h-full flex-col items-center bg-authentic-white px-6 pt-12 font-sans">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-beryl-green">
        <Icon name="user" size={36} className="text-sensational-green" />
      </div>
      <h2 className="mt-4 text-base font-bold text-space-black">{user.name ?? user.handle}</h2>
      <p className="mt-1 text-xs text-matte-graphite">@{user.handle}</p>

      <button
        onClick={() => {
          logout();
          setUser(null);
        }}
        className="mt-8 h-[46px] w-full max-w-[280px] rounded-2xl border-[0.5px] border-cute-silver bg-white text-sm font-bold text-[#A32D2D] transition active:scale-[0.98] active:bg-refreshing-ivory"
      >
        Keluar
      </button>
    </div>
  );
}
