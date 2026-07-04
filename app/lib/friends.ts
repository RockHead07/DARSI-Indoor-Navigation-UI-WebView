// Friend client — MOCK implementation (Fase 2 UI dibangun duluan; backend friends
// menunggu identitas user stabil dari MyRSIy, ROADMAP T0.8 / ADR-013).
//
// Bentuk fungsi & tipe di file ini MENIRU PERSIS kontrak terkunci
// (docs/API_CONTRACT.md): GET /api/friends, POST /api/friends/request,
// POST /api/friends/respond, DELETE /api/friends/{id}. Saat T0.8 turun, ganti isi
// tiap fungsi dengan fetch beneran — UI tidak boleh berubah.
//
// Guardrail ADR-013 yang relevan di sisi client:
// - add-by-exact-identifier — TIDAK ADA pencarian/browse direktori user
// - presence status-only (online / ar-active / offline) — tidak pernah lokasi
// - opt-out "tampil offline" tersedia

export type Presence = "online" | "ar-active" | "offline";

export type Friend = {
  connectionId: string;
  name: string;
  handle: string; // identifier persis (username) — dipakai untuk add-by-exact-identifier
  presence: Presence;
};

export type IncomingRequest = {
  requestId: string;
  name: string;
  handle: string;
};

// ponytail: in-memory module state — hilang saat reload, cukup untuk mock UI.
let friends: Friend[] = [
  { connectionId: "c-1", name: "Aisyah Putri", handle: "aisyah.p", presence: "ar-active" },
  { connectionId: "c-2", name: "Raka Pratama", handle: "raka07", presence: "online" },
  { connectionId: "c-3", name: "Dimas Anggara", handle: "dimas.a", presence: "offline" },
];

let incoming: IncomingRequest[] = [
  { requestId: "r-1", name: "Salsabila Zahra", handle: "salsa.bila" },
];

let invisible = false;

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms)); // simulasi latency network

export async function getFriends(): Promise<Friend[]> {
  await delay();
  return [...friends];
}

export async function getIncomingRequests(): Promise<IncomingRequest[]> {
  await delay();
  return [...incoming];
}

/** POST /api/friends/request { identifier } — exact identifier, bukan pencarian. */
export async function sendRequest(identifier: string): Promise<{ ok: boolean; message: string }> {
  await delay();
  const id = identifier.trim();
  if (!id) return { ok: false, message: "Masukkan username teman dulu." };
  if (friends.some((f) => f.handle === id))
    return { ok: false, message: "Pengguna ini sudah ada di daftar temanmu." };
  // Mock selalu "terkirim". Backend asli yang memvalidasi identifier-nya ada,
  // menyimpan status pending, dan menerapkan rate-limit (ADR-013).
  return { ok: true, message: `Permintaan terkirim ke @${id}. Menunggu persetujuan.` };
}

/** POST /api/friends/respond { requestId, action } */
export async function respondRequest(
  requestId: string,
  action: "accept" | "reject",
): Promise<void> {
  await delay();
  const req = incoming.find((r) => r.requestId === requestId);
  incoming = incoming.filter((r) => r.requestId !== requestId);
  if (req && action === "accept") {
    friends = [
      ...friends,
      { connectionId: `c-${Date.now()}`, name: req.name, handle: req.handle, presence: "online" },
    ];
  }
  // reject: request dibuang diam-diam — pengirim tidak diberi tahu (FLOWS.md §5a).
}

/** DELETE /api/friends/{id} */
export async function removeFriend(connectionId: string): Promise<void> {
  await delay();
  friends = friends.filter((f) => f.connectionId !== connectionId);
}

/** Opt-out presence (ADR-013): tampil offline ke semua orang. */
export async function setInvisible(v: boolean): Promise<void> {
  await delay(150);
  invisible = v;
}

export function getInvisible(): boolean {
  return invisible;
}
