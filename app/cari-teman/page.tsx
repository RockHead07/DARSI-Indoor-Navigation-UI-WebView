"use client";

// Cari Teman (Fase 2 UI — FLOWS.md §5a, ADR-013). Semua manajemen teman terjadi
// di sini (2D, tanpa kamera); AR hanya menerima connectionId yang sudah accepted.
// Data masih dari mock client (lib/friends.ts) sampai T0.8 (identitas MyRSIy) turun.

import { useEffect, useState } from "react";
import { Icon, type IconName } from "../icons";
import { launchAR } from "../lib/bridge";
import Modal from "../Modal";
import {
  type Friend,
  type IncomingRequest,
  type Presence,
  getFriends,
  getIncomingRequests,
  sendRequest,
  respondRequest,
  removeFriend,
  requestMeet,
  setInvisible,
  getInvisible,
} from "../lib/friends";

type MeetStage = "confirm" | "waiting" | "accepted" | "rejected";

type Tab = "teman" | "tambah" | "request";

const presenceLabel: Record<Presence, string> = {
  online: "Online",
  "ar-active": "Di dalam AR",
  offline: "Offline",
};

const presenceBadge: Record<Presence, string> = {
  online: "bg-beryl-green text-sensational-green",
  "ar-active": "bg-sensational-green text-white",
  offline: "bg-[#FCEBEB] text-[#A32D2D]", // merah — status tidak tersedia
};

const presenceIcon: Record<Presence, IconName> = {
  online: "online",
  "ar-active": "ar",
  offline: "offline",
};

// warna avatar bergilir, konsisten dengan tint kartu populer di Home
const avatarTints = ["bg-beryl-green", "bg-refreshing-ivory", "bg-cute-silver"];

export default function CariTeman() {
  const [tab, setTab] = useState<Tab>("teman");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [invisible, setInvisibleState] = useState(getInvisible());

  // Tambah Teman
  const [identifier, setIdentifier] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  // Minta Navigasi (meet request) — flow popup
  const [meet, setMeet] = useState<Friend | null>(null);
  const [meetStage, setMeetStage] = useState<MeetStage>("confirm");

  // Hapus teman — konfirmasi dulu sebelum eksekusi
  const [remove, setRemove] = useState<Friend | null>(null);

  const reload = () => {
    Promise.all([getFriends(), getIncomingRequests()]).then(([f, r]) => {
      setFriends(f);
      setRequests(r);
      setLoading(false);
    });
  };

  // legit fetch-in-effect: initial load dari mock client
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(reload, []);

  const onSend = async () => {
    setSending(true);
    setFeedback(null);
    const res = await sendRequest(identifier);
    setFeedback(res);
    if (res.ok) setIdentifier("");
    setSending(false);
  };

  const onRespond = async (requestId: string, action: "accept" | "reject") => {
    await respondRequest(requestId, action);
    reload();
  };

  const onRemove = async () => {
    if (!remove) return;
    await removeFriend(remove.connectionId);
    setRemove(null);
    reload();
  };

  const onToggleInvisible = async () => {
    const next = !invisible;
    setInvisibleState(next);
    await setInvisible(next);
  };

  const openMeet = (f: Friend) => {
    setMeet(f);
    setMeetStage("confirm");
  };

  const confirmMeet = async () => {
    if (!meet) return;
    const target = meet;
    setMeetStage("waiting");
    const res = await requestMeet(target.connectionId);
    // hanya terapkan kalau masih menunggu untuk teman yang sama (user bisa keburu batal)
    setMeet((cur) => {
      if (cur?.connectionId === target.connectionId) setMeetStage(res);
      return cur;
    });
  };

  const enterMeetAr = () => {
    if (!meet) return;
    // Simetris: kedua pihak sudah setuju, buka AR untuk saling menemui (ADR-013 refine).
    launchAR({ mode: "findFriend", connectionId: meet.connectionId });
    setMeet(null);
  };

  return (
    <div className="flex min-h-full flex-col bg-authentic-white font-sans">
      {/* Tabs */}
      <div className="flex gap-2 px-4 pb-1 pt-[18px]">
        {(
          [
            ["teman", "Daftar Teman"],
            ["tambah", "Tambah Teman"],
            ["request", "Request Masuk"],
          ] as [Tab, string][]
        ).map(([t, label]) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative h-[34px] flex-1 rounded-full text-[11px] font-bold transition-colors ${
                active
                  ? "bg-sensational-green text-white"
                  : "border-[0.5px] border-cute-silver bg-white text-matte-graphite active:bg-refreshing-ivory"
              }`}
            >
              {label}
              {t === "request" && requests.length > 0 && (
                <span className="absolute -right-1 -top-1 grid h-[18px] w-[18px] place-items-center rounded-full bg-lime-peel text-[10px] font-bold text-white">
                  {requests.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="px-4 py-10 text-center text-xs text-matte-graphite">Memuat…</div>
      ) : tab === "teman" ? (
        <div className="pt-2">
          {/* Opt-out presence (ADR-013): tampil offline ke semua orang */}
          <button
            onClick={onToggleInvisible}
            className="mx-4 mb-2 flex w-[calc(100%-32px)] items-center gap-3 rounded-[14px] border-[0.5px] border-cute-silver bg-white px-4 py-3 text-left transition-colors active:bg-refreshing-ivory"
          >
            <Icon
              name={invisible ? "eye" : "eye-closed"}
              size={17}
              className={invisible ? "text-sensational-green" : "text-matte-graphite"}
            />
            <span className="flex-1">
              <span className="block text-xs font-bold text-space-black">Tampil offline</span>
              <span className="block text-[10px] text-matte-graphite">
                Status kehadiranmu disembunyikan dari semua teman
              </span>
            </span>
            <span
              className={`relative h-5 w-9 rounded-full transition-colors ${
                invisible ? "bg-sensational-green" : "bg-cute-silver"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                  invisible ? "left-[18px]" : "left-0.5"
                }`}
              />
            </span>
          </button>

          {friends.length === 0 ? (
            <div className="flex flex-col items-center px-8 pt-14 text-center">
              <div className="mb-4 grid h-20 w-20 place-items-center rounded-full bg-beryl-green">
                <Icon name="friend-list" size={36} className="text-sensational-green" />
              </div>
              <h2 className="text-sm font-bold text-space-black">Belum ada teman</h2>
              <p className="mt-1 text-xs text-matte-graphite">
                Tambah teman lewat username persisnya di tab Tambah Teman
              </p>
            </div>
          ) : (
            friends.map((f, i) => {
              const canRequest = f.presence !== "offline"; // offline tak bisa dihubungi realtime
              return (
                <div
                  key={f.connectionId}
                  className="flex items-center border-b-[0.5px] border-refreshing-ivory bg-white px-4 py-3"
                >
                  <span
                    className={`grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full text-sm font-bold text-sensational-green ${avatarTints[i % avatarTints.length]}`}
                  >
                    {f.name.charAt(0)}
                  </span>
                  <span className="mx-3 flex-1">
                    <span className="block text-[13px] font-bold text-space-black">{f.name}</span>
                    <span className="block text-[11px] text-matte-graphite">@{f.handle}</span>
                    <span
                      className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${presenceBadge[f.presence]}`}
                    >
                      <Icon name={presenceIcon[f.presence]} size={11} />
                      {presenceLabel[f.presence]}
                    </span>
                  </span>
                  <span className="flex flex-col items-end gap-1.5">
                    {/* Minta Navigasi — consent per-sesi, simetris (refine ADR-013).
                        Offline tak bisa diminta (tak terjangkau realtime). */}
                    <button
                      disabled={!canRequest}
                      onClick={() => openMeet(f)}
                      className={`flex h-[30px] items-center gap-1.5 rounded-full px-3 text-[11px] font-bold transition ${
                        canRequest
                          ? "bg-sensational-green text-white active:scale-[0.97]"
                          : "bg-refreshing-ivory text-brushed-nickel opacity-60"
                      }`}
                    >
                      <Icon name="navigation" size={12} />
                      Minta Navigasi
                    </button>
                    <button
                      aria-label={`Hapus ${f.name}`}
                      onClick={() => setRemove(f)}
                      className="text-[10px] text-brushed-nickel underline active:text-space-black"
                    >
                      Hapus
                    </button>
                  </span>
                </div>
              );
            })
          )}
        </div>
      ) : tab === "tambah" ? (
        <div className="px-4 pt-3">
          {/* Add-by-exact-identifier — sengaja TANPA pencarian/browse user (ADR-013) */}
          <label className="block pb-1.5 text-[11px] text-brushed-nickel">
            Username teman (persis)
          </label>
          <div className="flex h-[50px] items-center gap-2 rounded-[14px] border-[1.5px] border-cute-silver bg-white px-3.5 transition-all focus-within:border-sensational-green focus-within:shadow-[0_0_0_3px_rgba(3,80,48,0.08)]">
            <span className="text-sm text-matte-graphite">@</span>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="mis. aisyah.p"
              autoCapitalize="none"
              autoCorrect="off"
              className="flex-1 bg-transparent text-sm text-space-black outline-none placeholder:text-[13px] placeholder:text-matte-graphite"
            />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-matte-graphite">
            Minta username langsung ke temanmu. Demi privasi, tidak ada fitur mencari atau
            menjelajah daftar pengguna — koneksi hanya terbentuk jika temanmu menyetujui
            permintaanmu.
          </p>

          {feedback && (
            <div
              className={`mt-3 rounded-[14px] px-4 py-3 text-xs font-bold ${
                feedback.ok
                  ? "bg-beryl-green text-sensational-green"
                  : "bg-[#FCEBEB] text-[#A32D2D]"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <button
            onClick={onSend}
            disabled={sending || !identifier.trim()}
            className="mt-4 flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-sensational-green text-sm font-bold text-white transition active:scale-[0.98] active:bg-[#023d24] disabled:opacity-50"
          >
            <Icon name="add-friend" size={18} className="text-white" />
            {sending ? "Mengirim…" : "Kirim Permintaan"}
          </button>
        </div>
      ) : (
        <div className="pt-2">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center px-8 pt-14 text-center">
              <div className="mb-4 grid h-20 w-20 place-items-center rounded-full bg-refreshing-ivory">
                <Icon name="mail" size={36} className="text-matte-graphite" />
              </div>
              <h2 className="text-sm font-bold text-space-black">Tidak ada request masuk</h2>
              <p className="mt-1 text-xs text-matte-graphite">
                Permintaan pertemanan baru akan muncul di sini
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 px-4 pb-2 pt-1 text-[11px] font-bold text-sensational-green">
                <Icon name="mail-alert" size={15} />
                {requests.length} permintaan menunggu persetujuanmu
              </div>
              {requests.map((r) => (
                <div
                  key={r.requestId}
                  className="flex items-center border-b-[0.5px] border-refreshing-ivory bg-white px-4 py-3"
                >
                <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-refreshing-ivory text-sm font-bold text-sensational-green">
                  {r.name.charAt(0)}
                </span>
                <span className="mx-3 flex-1">
                  <span className="block text-[13px] font-bold text-space-black">{r.name}</span>
                  <span className="block text-[11px] text-matte-graphite">@{r.handle}</span>
                </span>
                <span className="flex items-center gap-2">
                  <button
                    aria-label={`Terima ${r.name}`}
                    onClick={() => onRespond(r.requestId, "accept")}
                    className="grid h-9 w-9 place-items-center rounded-full bg-sensational-green text-white transition active:scale-95"
                  >
                    <Icon name="check" size={16} />
                  </button>
                  <button
                    aria-label={`Tolak ${r.name}`}
                    onClick={() => onRespond(r.requestId, "reject")}
                    className="grid h-9 w-9 place-items-center rounded-full border-[0.5px] border-[#E7B7B7] bg-[#FCEBEB] text-[#A32D2D] transition active:scale-95 active:bg-[#F7DCDC]"
                  >
                    <Icon name="x" size={16} />
                  </button>
                </span>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Flow "Minta Navigasi" — request → tunggu → diterima/ditolak → buka AR */}
      <Modal open={!!meet} onClose={meetStage === "waiting" ? undefined : () => setMeet(null)}>
        {meet && meetStage === "confirm" && (
          <>
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-beryl-green text-sensational-green">
              <Icon name="navigation" size={26} />
            </div>
            <h2 className="text-[15px] font-bold text-space-black">
              Minta navigasi bareng {meet.name}?
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-matte-graphite">
              Kalau {meet.name} setuju, kalian berdua akan saling melihat posisi di AR untuk
              bertemu. Permintaan ini harus disetujui dulu.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setMeet(null)}
                className="h-[46px] flex-1 rounded-2xl border-[0.5px] border-cute-silver bg-white text-sm font-bold text-matte-graphite transition active:scale-[0.98] active:bg-refreshing-ivory"
              >
                Batal
              </button>
              <button
                onClick={confirmMeet}
                className="h-[46px] flex-1 rounded-2xl bg-sensational-green text-sm font-bold text-white transition active:scale-[0.98] active:bg-[#023d24]"
              >
                Kirim Permintaan
              </button>
            </div>
          </>
        )}

        {meet && meetStage === "waiting" && (
          <>
            <div className="mx-auto mb-3 h-12 w-12 animate-spin rounded-full border-[3px] border-cute-silver border-t-sensational-green" />
            <h2 className="text-[15px] font-bold text-space-black">
              Menunggu persetujuan…
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-matte-graphite">
              Permintaan navigasi terkirim ke {meet.name}. Menunggu {meet.name} membuka AR dan
              menyetujui.
            </p>
            <button
              onClick={() => setMeet(null)}
              className="mt-4 h-[46px] w-full rounded-2xl border-[0.5px] border-cute-silver bg-white text-sm font-bold text-matte-graphite transition active:scale-[0.98] active:bg-refreshing-ivory"
            >
              Batalkan
            </button>
          </>
        )}

        {meet && meetStage === "accepted" && (
          <>
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-sensational-green text-white">
              <Icon name="check" size={26} />
            </div>
            <h2 className="text-[15px] font-bold text-space-black">{meet.name} setuju!</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-matte-graphite">
              Kalian siap saling menemui. Buka AR untuk mulai melihat posisi masing-masing.
            </p>
            <button
              onClick={enterMeetAr}
              className="mt-4 flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-sensational-green text-sm font-bold text-white transition active:scale-[0.98] active:bg-[#023d24]"
            >
              <Icon name="camera" size={18} />
              Buka AR
            </button>
          </>
        )}

        {meet && meetStage === "rejected" && (
          <>
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-[#FCEBEB] text-[#A32D2D]">
              <Icon name="x" size={26} />
            </div>
            <h2 className="text-[15px] font-bold text-space-black">Permintaan ditolak</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-matte-graphite">
              {meet.name} belum bisa menerima permintaan navigasimu sekarang.
            </p>
            <button
              onClick={() => setMeet(null)}
              className="mt-4 h-[46px] w-full rounded-2xl border-[0.5px] border-cute-silver bg-white text-sm font-bold text-matte-graphite transition active:scale-[0.98] active:bg-refreshing-ivory"
            >
              Tutup
            </button>
          </>
        )}
      </Modal>

      {/* Konfirmasi hapus teman */}
      <Modal open={!!remove} onClose={() => setRemove(null)}>
        {remove && (
          <>
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-[#FCEBEB] text-[#A32D2D]">
              <Icon name="user" size={26} />
            </div>
            <h2 className="text-[15px] font-bold text-space-black">Hapus dari pertemanan?</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-matte-graphite">
              Apakah kamu yakin ingin menghapus <span className="font-bold">{remove.name}</span> dari
              daftar temanmu? Kalian tidak akan bisa saling melihat status atau minta navigasi lagi
              sampai berteman ulang.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setRemove(null)}
                className="h-[46px] flex-1 rounded-2xl border-[0.5px] border-cute-silver bg-white text-sm font-bold text-matte-graphite transition active:scale-[0.98] active:bg-refreshing-ivory"
              >
                Batal
              </button>
              <button
                onClick={onRemove}
                className="h-[46px] flex-1 rounded-2xl bg-[#A32D2D] text-sm font-bold text-white transition active:scale-[0.98] active:bg-[#8a2525]"
              >
                Hapus
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
