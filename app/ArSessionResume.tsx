"use client";

import { useEffect, useState } from "react";
import { onArSessionClosed, type ArSessionClosed } from "./lib/bridge";
import { Icon } from "./icons";

// Mounted once in the root layout. Resuming from AR keeps WebView state (no reload);
// this just surfaces a light confirmation banner when the Flutter host reports AR closed.
export default function ArSessionResume() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    return onArSessionClosed((p: ArSessionClosed) => {
      setMsg(p.arrived && p.poiId ? `Kamu telah tiba di ${p.poiId}.` : "Sesi AR selesai.");
    });
  }, []);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 4000);
    return () => clearTimeout(t);
  }, [msg]);

  if (!msg) return null;

  return (
    <div className="fixed inset-x-4 bottom-5 z-50 flex items-center gap-2 rounded-2xl bg-sensational-green px-4 py-3 text-white shadow-lg">
      <Icon name="navigation" size={16} className="text-white" />
      <span className="flex-1 text-[13px] font-bold">{msg}</span>
      <button aria-label="Tutup" onClick={() => setMsg(null)}>
        <Icon name="x" size={15} className="text-white/80" />
      </button>
    </div>
  );
}
