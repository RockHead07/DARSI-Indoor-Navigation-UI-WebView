"use client";

// Detail bottom sheet — opens on POI tap (Home & Cari Lokasi) instead of launching
// AR directly: photos + description first, AR starts from the CTA inside the sheet.
// Ease-in-out animated: backdrop fades, sheet slides from the bottom (both ways).

import { useEffect, useState } from "react";
import { Icon } from "./icons";
import { launchAR } from "./lib/bridge";
import { type ApiPoi, type PoiStatus, categoryIcon, placeLabel } from "./lib/api";

const ANIM_MS = 300; // keep in sync with the duration-300 classes below

const badgeStyle: Record<PoiStatus, string> = {
  Buka: "bg-beryl-green text-sensational-green",
  Antre: "bg-refreshing-ivory text-matte-graphite",
  Penuh: "bg-[#FCEBEB] text-[#A32D2D]",
};

// poiId = stable Unity GUID so navigation survives a POI rename; poiName is the display
// label + Unity's fuzzy-match fallback when a legacy POI has no synced GUID (id null).
const startNavigation = (p: ApiPoi) =>
  launchAR({ mode: "navigate", poiId: p.id ?? p.name, poiName: p.name, floor: p.floor, building: p.building });

export default function PoiDetailSheet({
  poi,
  onClose,
}: {
  poi: ApiPoi | null;
  onClose: () => void;
}) {
  // `shown` keeps the content mounted during the exit animation; `open` drives the
  // CSS transitions (false = backdrop transparent + sheet translated off-screen).
  const [shown, setShown] = useState<ApiPoi | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (poi) {
      setShown(poi);
      // paint the closed position first, then flip to open so the transition runs
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
      return () => cancelAnimationFrame(raf);
    }
    // poi cleared by the parent -> ease out, then unmount the content
    setOpen(false);
    const t = setTimeout(() => setShown(null), ANIM_MS);
    return () => clearTimeout(t);
  }, [poi]);

  if (!shown) return null;

  // No real campus photos yet — show placeholder tiles so the layout is final;
  // once photos[] has URLs they render in the same strip.
  const photos: (string | null)[] = shown.photos.length > 0 ? shown.photos : [null, null, null];

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <button
        aria-label="Tutup"
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-in-out ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`absolute inset-x-0 bottom-0 max-h-[80%] overflow-y-auto rounded-t-[22px] bg-white px-4 pb-6 pt-3 transition-transform duration-300 ease-in-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* grab handle */}
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-cute-silver" />

        {/* photo strip */}
        <div className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {photos.map((src, i) =>
            src ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote POI photos, domains not known at build time
              <img
                key={i}
                src={src}
                alt={`${shown.name} ${i + 1}`}
                className="h-[110px] w-[150px] shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div
                key={i}
                className="grid h-[110px] w-[150px] shrink-0 place-items-center rounded-xl bg-refreshing-ivory text-cute-silver"
              >
                <Icon name="camera" size={26} />
              </div>
            ),
          )}
        </div>

        {/* name + status */}
        <div className="flex items-start gap-3">
          <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[14px] bg-beryl-green text-sensational-green">
            <Icon name={categoryIcon(shown.category)} size={20} />
          </span>
          <div className="flex-1">
            <h2 className="text-[15px] font-bold text-space-black">{shown.name}</h2>
            <p className="text-[11px] text-matte-graphite">{placeLabel(shown)}</p>
          </div>
          <span
            className={`rounded-full px-2 py-1 text-[10px] font-bold ${badgeStyle[shown.status]}`}
          >
            {shown.status}
          </span>
        </div>

        {/* description */}
        {shown.description && (
          <p className="mt-3 text-xs leading-relaxed text-matte-graphite">{shown.description}</p>
        )}

        {/* CTA */}
        <button
          onClick={() => startNavigation(shown)}
          className="mt-4 flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-sensational-green text-sm font-bold text-white transition active:scale-[0.98] active:bg-[#023d24]"
        >
          <Icon name="camera" size={18} className="text-white" />
          Mulai navigasi AR
        </button>
      </div>
    </div>
  );
}
