"use client";

import { useState } from "react";
import { Icon, type IconName } from "../icons";

type Poi = {
  name: string;
  category: string;
  building: string;
  floor: string;
  badge: "Buka" | "Antre" | "Penuh";
  icon: IconName;
  iconBg: string;
  iconColor: string;
};

const chips = [
  "Semua",
  "Poliklinik",
  "IGD & Darurat",
  "Laboratorium",
  "Farmasi",
  "Radiologi",
  "Administrasi",
];

const pois: Poi[] = [
  { name: "Poli Jantung", category: "Poliklinik", building: "Gedung A", floor: "Lantai 2", badge: "Buka", icon: "heart", iconBg: "bg-beryl-green", iconColor: "text-sensational-green" },
  { name: "Poli Jantung B", category: "Poliklinik", building: "Gedung B", floor: "Lantai 3", badge: "Antre", icon: "heart", iconBg: "bg-beryl-green", iconColor: "text-sensational-green" },
  { name: "ICU Jantung", category: "IGD & Darurat", building: "Gedung C", floor: "Lantai 4", badge: "Buka", icon: "activity", iconBg: "bg-refreshing-ivory", iconColor: "text-matte-graphite" },
  { name: "Poli Umum", category: "Poliklinik", building: "Gedung B", floor: "Lantai 2", badge: "Buka", icon: "eye", iconBg: "bg-beryl-green", iconColor: "text-sensational-green" },
  { name: "IGD", category: "IGD & Darurat", building: "Gedung A", floor: "Lantai 1", badge: "Buka", icon: "activity", iconBg: "bg-beryl-green", iconColor: "text-sensational-green" },
  { name: "Farmasi", category: "Farmasi", building: "Gedung A", floor: "Lantai 1", badge: "Buka", icon: "flask", iconBg: "bg-beryl-green", iconColor: "text-sensational-green" },
  { name: "Laboratorium", category: "Laboratorium", building: "Gedung C", floor: "Lantai 1", badge: "Antre", icon: "flask", iconBg: "bg-refreshing-ivory", iconColor: "text-matte-graphite" },
  { name: "Radiologi", category: "Radiologi", building: "Gedung D", floor: "Lantai 2", badge: "Penuh", icon: "scan", iconBg: "bg-refreshing-ivory", iconColor: "text-matte-graphite" },
];

const recent = ["Poli Jantung", "Farmasi", "IGD"];

const badgeStyle: Record<Poi["badge"], string> = {
  Buka: "bg-beryl-green text-sensational-green",
  Antre: "bg-refreshing-ivory text-matte-graphite",
  Penuh: "bg-[#FCEBEB] text-[#A32D2D]",
};

const MAX_VISIBLE = 6;

// ponytail: Flutter webview channel; no-op in a plain browser
const launchAR = (p: Poi) => {
  const w = window as unknown as { DarsiChannel?: { postMessage: (m: string) => void } };
  w.DarsiChannel?.postMessage(
    JSON.stringify({ action: "launchAR", poiName: p.name, floor: p.floor, building: p.building })
  );
};

export default function CariLokasi() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [selected, setSelected] = useState<Poi | null>(null);
  const [showAll, setShowAll] = useState(false);

  const q = query.trim().toLowerCase();
  const showResults = q !== "" || category !== "Semua";
  const results = pois.filter(
    (p) =>
      (category === "Semua" || p.category === category) &&
      (q === "" || p.name.toLowerCase().includes(q))
  );
  const visible = showAll ? results : results.slice(0, MAX_VISIBLE);

  const onChip = (c: string) => setCategory((prev) => (prev === c ? "Semua" : c));

  return (
    <div className="flex min-h-full flex-col bg-authentic-white font-sans">
      {/* 1. Search input (focused) */}
      <div className="px-4 pb-3 pt-[18px]">
        <div className="flex h-[50px] items-center gap-2 rounded-[14px] border-[1.5px] border-sensational-green bg-white px-3.5 shadow-[0_0_0_3px_rgba(3,80,48,0.08)]">
          <Icon name="search" size={17} className="text-sensational-green" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowAll(false);
            }}
            placeholder="Cari ruangan, poli, layanan..."
            className="flex-1 bg-transparent text-sm text-space-black outline-none placeholder:text-[13px] placeholder:text-matte-graphite"
          />
          {query && (
            <button
              aria-label="Hapus"
              onClick={() => setQuery("")}
              className="grid h-5 w-5 place-items-center rounded-full bg-authentic-white text-matte-graphite"
            >
              <Icon name="x" size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Filter chips */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips.map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              onClick={() => onChip(c)}
              className={`h-[30px] shrink-0 rounded-full px-[13px] text-[11px] font-bold ${
                active
                  ? "bg-sensational-green text-white"
                  : "border-[0.5px] border-cute-silver bg-white text-matte-graphite"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {showResults ? (
        results.length > 0 ? (
          <>
            {/* 3. Result count */}
            <div className="flex items-center justify-between px-4 pb-1.5 pt-2">
              <span className="text-[11px] text-brushed-nickel">
                {results.length} lokasi ditemukan
              </span>
            </div>

            {/* 4. Results */}
            <div>
              {visible.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setSelected(p)}
                  className={`flex w-full items-center border-b-[0.5px] border-refreshing-ivory bg-white px-4 py-3 text-left ${
                    i === 0 ? "border-l-2 border-l-sensational-green" : ""
                  }`}
                >
                  <span
                    className={`grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[14px] ${p.iconBg} ${p.iconColor}`}
                  >
                    <Icon name={p.icon} size={20} />
                  </span>
                  <span className="mx-3 flex-1">
                    <span className="block text-[13px] font-bold text-space-black">{p.name}</span>
                    <span className="block text-[11px] text-matte-graphite">
                      {p.building} · {p.floor}
                    </span>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeStyle[p.badge]}`}
                    >
                      {p.badge}
                    </span>
                  </span>
                  <span className="flex flex-col items-end gap-0.5">
                    <Icon name="navigation" size={15} className="text-sensational-green" />
                  </span>
                </button>
              ))}
              {results.length > MAX_VISIBLE && !showAll && (
                <button
                  onClick={() => setShowAll(true)}
                  className="w-full py-3 text-center text-[12px] font-bold text-sensational-green"
                >
                  Lihat lebih banyak
                </button>
              )}
            </div>
          </>
        ) : (
          /* 7. Empty state */
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="mb-4 grid h-20 w-20 place-items-center rounded-full bg-beryl-green">
              <Icon name="search" size={40} className="text-sensational-green" />
            </div>
            <h2 className="text-sm font-bold text-space-black">Lokasi tidak ditemukan</h2>
            <p className="mt-1 text-xs text-matte-graphite">
              Coba kata kunci lain atau pilih kategori di atas
            </p>
            <button
              onClick={() => {
                setQuery("");
                setCategory("Semua");
              }}
              className="mt-4 text-xs font-bold text-sensational-green underline"
            >
              Lihat semua lokasi
            </button>
          </div>
        )
      ) : (
        /* Default state: recent searches */
        <div className="pt-2">
          <span className="block px-4 pb-1 text-[11px] text-brushed-nickel">Pencarian terakhir</span>
          {recent.map((r) => (
            <button
              key={r}
              onClick={() => setQuery(r)}
              className="flex w-full items-center gap-3 border-b-[0.5px] border-refreshing-ivory bg-white px-4 py-3 text-left"
            >
              <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[14px] bg-refreshing-ivory text-matte-graphite">
                <Icon name="clock" size={18} />
              </span>
              <span className="text-[13px] font-bold text-space-black">{r}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex-1" />

      {/* 5. Selected confirmation card */}
      {selected && (
        <div className="mx-4 mt-2.5 flex items-center gap-3 rounded-[14px] border border-beryl-green bg-refreshing-ivory px-4 py-3">
          <Icon name="pin" size={18} className="text-sensational-green" />
          <div className="flex-1">
            <p className="text-xs font-bold text-sensational-green">{selected.name} dipilih</p>
            <p className="text-[10px] text-matte-graphite">
              {selected.building} · {selected.floor}
            </p>
          </div>
          <button aria-label="Batal pilih" onClick={() => setSelected(null)}>
            <Icon name="x" size={15} className="text-[#7F8082]" />
          </button>
        </div>
      )}

      {/* 6. CTA */}
      <button
        onClick={() => (selected ?? results[0]) && launchAR(selected ?? results[0])}
        className="mx-4 mb-5 mt-3 flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-sensational-green text-sm font-bold text-white transition active:scale-[0.98] active:bg-[#023d24]"
      >
        <Icon name="camera" size={18} className="text-white" />
        Mulai navigasi AR
      </button>
    </div>
  );
}
