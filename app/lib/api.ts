// POI data client. Migrasi dari FastAPI (Railway) ke Supabase PostgREST + RLS + RPC
// (darsi-backend/supabase/setup.sql). anon key AMAN di bundle karena RLS.
//   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
// Bentuk respons = kontrak terkunci ApiPoi (docs/API_CONTRACT.md) — tak pernah ada field distance (ADR-007).

import type { IconName } from "../icons";

export type PoiStatus = "Buka" | "Antre" | "Penuh";

export type ApiPoi = {
  id: string | null; // stable Unity GUID (unity_id); null for legacy rows → UI falls back to name
  name: string;
  category: string;
  building: string | null;
  floor: string | null;
  status: PoiStatus;
  is_popular: boolean;
  description: string;
  photos: string[]; // image URLs; empty = UI renders placeholder tiles
};

const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Semua request PostgREST butuh apikey + Bearer (anon). Diekspor — friends.ts pakai untuk
// presence. 204 (upsert return=minimal) → tak ada body untuk di-JSON-kan.
export async function rest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${SUPA}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`Supabase ${path} → ${res.status}`);
  return res.status === 204 ? (undefined as T) : (res.json() as Promise<T>);
}

// unity_id di-alias ke `id` → bentuk = ApiPoi, komponen WebView tak berubah.
const POI_SELECT =
  "id:unity_id,name,category,building,floor,status,is_popular,description,photos";

export const getPopular = () =>
  rest<ApiPoi[]>(`pois?is_popular=eq.true&select=${POI_SELECT}&order=name`);

// Substring ILIKE pada elemen array `synonyms` tak bisa PostgREST murni → RPC search_pois.
export const searchPois = (q: string, category: string) =>
  rest<ApiPoi[]>("rpc/search_pois", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q, category }),
  });

// PostgREST tak punya DISTINCT → ambil kolom category lalu dedupe di klien (list kecil).
export const getCategories = async (): Promise<string[]> => {
  const rows = await rest<{ category: string }[]>("pois?select=category&order=category");
  return [...new Set(rows.map((r) => r.category))];
};

// The API carries no icon — derive one from category so the UI stays glyphed.
// Kategori kanonik rumah sakit (RSI). Daftar final divalidasi ke IT RSI; kategori
// tak dikenal jatuh ke "pin" (aman, tidak pernah patah). File glyph: public/icons/.
const CATEGORY_ICON: Record<string, IconName> = {
  // Klinis / instalasi medis
  IGD: "cross",
  Poliklinik: "stethoscope",
  Farmasi: "mortar",
  Laboratorium: "flask",
  Radiologi: "xray",
  "Rawat Inap": "bed",
  "Kamar Operasi": "scalpel",
  ICU: "heart",
  "Ruang Bersalin": "baby",
  Fisioterapi: "activity",
  // Administrasi / layanan
  Pendaftaran: "clipboard",
  Kasir: "wallet",
  Informasi: "info",
  BPJS: "card",
  "Rekam Medis": "folder",
  // Fasilitas umum
  Musholla: "mosque",
  Toilet: "restroom",
  Kantin: "utensils",
  ATM: "atm",
  Parkir: "parking",
  "Ruang Tunggu": "waiting",
  // Sirkulasi / wayfinding
  Lift: "elevator",
  Tangga: "stairs",
  "Pintu Masuk": "door",
  // Kategori demo kampus (lama) — tetap didukung
  Administrasi: "activity",
  Umum: "pin",
};

export function categoryIcon(category: string): IconName {
  return CATEGORY_ICON[category] ?? "pin";
}

// building + floor as one display line, tolerating nulls (ADR-014: owned by Unity, may be unset)
export function placeLabel(p: ApiPoi): string {
  return [p.building, p.floor].filter(Boolean).join(" · ");
}
