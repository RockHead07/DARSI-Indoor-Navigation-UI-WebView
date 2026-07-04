"use client";

// Popup terpusat, animasi ease-in-out (backdrop fade + scale/slide). Dipakai untuk
// flow "Minta Navigasi" di Cari Teman. Konten stage diatur pemanggil.

import { useEffect, useState } from "react";

export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}) {
  const [shown, setShown] = useState(false); // tetap mount selama animasi keluar
  const [visible, setVisible] = useState(false); // driver transisi CSS

  useEffect(() => {
    if (open) {
      setShown(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const t = setTimeout(() => setShown(false), 220);
    return () => clearTimeout(t);
  }, [open]);

  if (!shown) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        aria-label="Tutup"
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ease-in-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`relative m-4 w-full max-w-[340px] rounded-[22px] bg-white p-5 text-center transition-all duration-200 ease-in-out ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
