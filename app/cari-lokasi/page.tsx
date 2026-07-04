"use client";

import { useEffect, useState } from "react";
import { Icon } from "../icons";
import PoiDetailSheet from "../PoiDetailSheet";
import {
  type ApiPoi,
  type PoiStatus,
  searchPois,
  getCategories,
  categoryIcon,
  placeLabel,
} from "../lib/api";

const recent = ["Perpustakaan", "BAAK", "Lab Mikrotik"];

const badgeStyle: Record<PoiStatus, string> = {
  Buka: "bg-beryl-green text-sensational-green",
  Antre: "bg-refreshing-ivory text-matte-graphite",
  Penuh: "bg-[#FCEBEB] text-[#A32D2D]",
};

const MAX_VISIBLE = 6;

export default function CariLokasi() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [selected, setSelected] = useState<ApiPoi | null>(null);
  const [showAll, setShowAll] = useState(false);

  const [chips, setChips] = useState<string[]>(["Semua"]);
  const [results, setResults] = useState<ApiPoi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // filter chips from the backend's distinct categories
  useEffect(() => {
    getCategories()
      .then((cats) => setChips(["Semua", ...cats]))
      .catch(() => setError(true));
  }, []);

  const q = query.trim();
  const showResults = q !== "" || category !== "Semua";

  // fetch results whenever the query or category changes (only when there's something to show)
  useEffect(() => {
    if (!showResults) return; // stale results aren't rendered in the default (recent) view
    let cancelled = false;
    // legit fetch-in-effect: flag loading synchronously so the spinner shows immediately
    /* eslint-disable react-hooks/set-state-in-effect */
    setLoading(true);
    setError(false);
    /* eslint-enable react-hooks/set-state-in-effect */
    searchPois(q, category)
      .then((rows) => {
        if (!cancelled) setResults(rows);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [q, category, showResults]);

  const visible = showAll ? results : results.slice(0, MAX_VISIBLE);
  const onChip = (c: string) => setCategory((prev) => (prev === c ? "Semua" : c));

  return (
    <div className="flex min-h-full flex-col bg-authentic-white font-sans">
      {/* 1. Search input — highlights green only on focus (focus-within) */}
      <div className="px-4 pb-3 pt-[18px]">
        <div className="group flex h-[50px] items-center gap-2 rounded-[14px] border-[1.5px] border-cute-silver bg-white px-3.5 transition-all focus-within:border-sensational-green focus-within:shadow-[0_0_0_3px_rgba(3,80,48,0.08)]">
          <Icon
            name="search"
            size={17}
            className="text-matte-graphite transition-colors group-focus-within:text-sensational-green"
          />
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
        loading ? (
          <div className="px-4 py-10 text-center text-xs text-matte-graphite">Memuat…</div>
        ) : error ? (
          <div className="px-4 py-10 text-center text-xs text-matte-graphite">
            Gagal memuat data. Coba lagi nanti.
          </div>
        ) : results.length > 0 ? (
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
                  className={`flex w-full items-center border-b-[0.5px] border-refreshing-ivory bg-white px-4 py-3 text-left transition-colors active:bg-refreshing-ivory ${
                    i === 0 ? "border-l-2 border-l-sensational-green" : ""
                  }`}
                >
                  <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[14px] bg-beryl-green text-sensational-green">
                    <Icon name={categoryIcon(p.category)} size={20} />
                  </span>
                  <span className="mx-3 flex-1">
                    <span className="block text-[13px] font-bold text-space-black">{p.name}</span>
                    <span className="block text-[11px] text-matte-graphite">{placeLabel(p)}</span>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeStyle[p.status]}`}
                    >
                      {p.status}
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
          /* Empty state */
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
              className="flex w-full items-center gap-3 border-b-[0.5px] border-refreshing-ivory bg-white px-4 py-3 text-left transition-colors active:bg-refreshing-ivory"
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

      {/* 5. Detail sheet — foto + deskripsi + tombol Mulai Navigasi AR.
          Replaces the old confirmation card + bottom CTA: AR now starts from
          inside the sheet, not straight from a row tap. */}
      <PoiDetailSheet poi={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
