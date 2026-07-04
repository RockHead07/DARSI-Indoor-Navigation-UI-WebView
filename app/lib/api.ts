// POI API client (T3.4.4/T3.4.5). Talks to the DARSI FastAPI backend.
// Base URL is configurable so the same code hits local dev, staging, or prod:
//   NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000  (default, local FastAPI)
// Response shape is the locked contract (docs/API_CONTRACT.md) — never a distance field (ADR-007).

import type { IconName } from "../icons";

export type PoiStatus = "Buka" | "Antre" | "Penuh";

export type ApiPoi = {
  name: string;
  category: string;
  building: string | null;
  floor: string | null;
  status: PoiStatus;
  is_popular: boolean;
  description: string;
  photos: string[]; // image URLs; empty = UI renders placeholder tiles
};

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const getPopular = () => get<ApiPoi[]>("/api/poi/popular");

export const searchPois = (q: string, category: string) =>
  get<ApiPoi[]>(
    `/api/poi/search?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`,
  );

export const getCategories = () => get<string[]>("/api/poi/categories");

// The API carries no icon — derive one from category so the UI stays glyphed.
export function categoryIcon(category: string): IconName {
  switch (category) {
    case "Laboratorium":
      return "flask";
    case "Administrasi":
      return "activity";
    case "Umum":
      return "pin";
    default:
      return "pin";
  }
}

// building + floor as one display line, tolerating nulls (ADR-014: owned by Unity, may be unset)
export function placeLabel(p: ApiPoi): string {
  return [p.building, p.floor].filter(Boolean).join(" · ");
}
