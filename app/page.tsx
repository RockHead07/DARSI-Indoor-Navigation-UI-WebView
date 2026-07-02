"use client";

import { useRouter } from "next/navigation";
import { Icon } from "./icons";

const quickActions = [
  { icon: "pin", title: "Cari Lokasi", sub: "Temukan tujuanmu", href: "/cari-lokasi" },
] as const;

const popular = [
  { emoji: "🏥", name: "IGD", floor: "Lt.1 · 24 jam", bg: "bg-beryl-green" },
  { emoji: "💊", name: "Farmasi", floor: "Gedung A · Lt.1", bg: "bg-refreshing-ivory" },
  { emoji: "🩺", name: "Poli Umum", floor: "Gedung B · Lt.2", bg: "bg-cute-silver" },
  { emoji: "❤️", name: "Poli Jantung", floor: "Gedung B · Lt.3", bg: "bg-beryl-green" },
];

const services = [
  { icon: "flask", name: "Laboratorium", floor: "Gedung C · Lt.1", status: "Buka" },
  { icon: "eye", name: "Poli Mata", floor: "Gedung B · Lt.3", status: "Antre" },
  { icon: "scan", name: "Radiologi", floor: "Gedung D · Lt.2", status: "Buka" },
] as const;

const statusStyle: Record<string, string> = {
  Buka: "bg-beryl-green text-sensational-green",
  Antre: "bg-refreshing-ivory text-matte-graphite",
  Penuh: "bg-[#FCEBEB] text-[#A32D2D]",
};

function SectionHeader({
  title,
  sub,
  onAction,
}: {
  title: string;
  sub?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-2 mt-3 flex items-center justify-between px-4">
      <div>
        <h2 className="text-[15px] font-bold text-sensational-green">{title}</h2>
        {sub && <p className="text-[10px] text-[#7F8082]">{sub}</p>}
      </div>
      {onAction && (
        <button
          onClick={onAction}
          className="rounded-full bg-refreshing-ivory px-2.5 py-1 text-[11px] font-bold text-lime-peel"
        >
          Lihat semua
        </button>
      )}
    </div>
  );
}

export default function Home() {
  const router = useRouter();

  // ponytail: bridge to Flutter host; no-op in a plain browser
  const launchAR = (poiName?: string) => {
    const w = window as unknown as {
      DarsiChannel?: { postMessage: (m: string) => void };
    };
    w.DarsiChannel?.postMessage(
      JSON.stringify({ action: "launchAR", poiName: poiName ?? null })
    );
  };

  return (
    <div className="relative min-h-full bg-authentic-white pb-20 font-sans">
      {/* 1. Search */}
      <div className="p-4">
        <button
          onClick={() => router.push("/cari-lokasi")}
          className="flex h-12 w-full items-center gap-2 rounded-[14px] border-[0.5px] border-cute-silver bg-white px-3.5 text-left shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
        >
          <Icon name="search" className="text-matte-graphite" />
          <span className="text-[13px] text-matte-graphite">
            Cari ruangan, poli, layanan...
          </span>
        </button>
      </div>

      {/* 2. Aksi cepat */}
      <SectionHeader title="Aksi cepat" />
      <div className="grid grid-cols-2 gap-2 px-4">
        {quickActions.map((a) => (
          <button
            key={a.title}
            onClick={() => router.push(a.href)}
            className="flex items-center gap-3 rounded-[14px] border-[0.5px] border-cute-silver bg-white p-[13px] text-left"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-beryl-green text-sensational-green">
              <Icon name={a.icon} />
            </span>
            <span>
              <span className="block text-xs font-bold text-space-black">{a.title}</span>
              <span className="block text-[9px] text-[#7F8082]">{a.sub}</span>
            </span>
          </button>
        ))}
      </div>

      {/* 3. Destinasi Populer */}
      <SectionHeader
        title="Destinasi Populer"
        sub="Paling banyak dicari"
        onAction={() => router.push("/cari-lokasi")}
      />
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {popular.map((p) => (
          <button
            key={p.name}
            onClick={() => launchAR(p.name)}
            className="w-[106px] shrink-0 overflow-hidden rounded-[14px] border-[0.5px] border-cute-silver bg-white text-left"
          >
            <div className={`flex h-[58px] items-center justify-center text-3xl ${p.bg}`}>
              {p.emoji}
            </div>
            <div className="px-2.5 py-2">
              <p className="text-[11px] font-bold text-space-black">{p.name}</p>
              <p className="text-[9px] text-matte-graphite">{p.floor}</p>
            </div>
          </button>
        ))}
      </div>

      {/* 4. Layanan Lainnya */}
      <SectionHeader title="Layanan Lainnya" onAction={() => router.push("/cari-lokasi")} />
      <div className="mt-1">
        {services.map((s) => (
          <button
            key={s.name}
            onClick={() => launchAR(s.name)}
            className="flex w-full items-center gap-3 border-b-[0.5px] border-refreshing-ivory px-4 py-[11px] text-left"
          >
            <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl bg-beryl-green text-sensational-green">
              <Icon name={s.icon} size={17} />
            </span>
            <span className="flex-1">
              <span className="block text-xs font-bold text-space-black">{s.name}</span>
              <span className="block text-[10px] text-matte-graphite">{s.floor}</span>
            </span>
            <span
              className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusStyle[s.status]}`}
            >
              {s.status}
            </span>
          </button>
        ))}
      </div>

      {/* 5. FAB */}
      <button
        onClick={() => launchAR()}
        aria-label="Mulai navigasi AR"
        className="fixed bottom-5 right-4 grid h-[50px] w-[50px] place-items-center rounded-full border-[3px] border-white bg-sensational-green text-white shadow-lg"
      >
        <span className="darsi-pulse absolute inset-0 rounded-full" />
        <Icon name="camera" size={20} />
      </button>
    </div>
  );
}
