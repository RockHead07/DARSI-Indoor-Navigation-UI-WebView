"use client";

// Shared building blocks for the auth screens (login / register / forgot-password).
//
// Design rules enforced here (DESIGN_SYSTEM.md):
//  - green-primary palette only, no blue
//  - no header/AppBar (ADR-004) — screens start straight into content
//  - hairlines + soft ambient edges instead of hard 1px gray borders
//  - every motion via transform/opacity on a custom cubic-bezier
//  - entrance reveals are one-shot (IntersectionObserver), never scroll-bound listeners

import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../icons";

const EASE = "cubic-bezier(0.32,0.72,0,1)";

/** One-shot viewport reveal: heavy fade-up with blur, transform+opacity only. */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // briefly defer so the reveal animates instead of rendering statically
    const raf = requestAnimationFrame(() => setShown(true));
    if (typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setShown(true), 0);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t);
      };
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={
        shown
          ? undefined
          : {
              opacity: 0,
              transform: "translate3d(0, 24px, 0)",
              filter: "blur(8px)",
              transition: `opacity 0.9s ${EASE} ${delay}ms, transform 0.9s ${EASE} ${delay}ms, filter 0.9s ${EASE} ${delay}ms`,
            }
      }
    >
      {children}
    </div>
  );
}

/**
 * Page shell: fixed ambient green orbs (GPU-static, never animating), centered
 * heading + subtitle, minim whitespace. Content flows below inside a
 * double-bezel card owned by each screen.
 */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-full flex-col bg-authentic-white px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-4 font-sans text-space-black">
      {/* Ambient glow — fixed background layer, pointer-events-none, static (no animation). */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-beryl-green/60 blur-3xl" />
        <div className="absolute -left-28 top-44 h-88 w-88 rounded-full bg-cute-silver/70 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-beryl-green/40 blur-3xl" />
      </div>

      {/* Heading — centered */}
      <Reveal>
        <div className="text-center">
          <h1 className="text-[26px] font-black leading-[1.15] tracking-tight text-space-black">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-1.5 max-w-[300px] text-[13px] leading-relaxed text-matte-graphite">
              {subtitle}
            </p>
          )}
        </div>
      </Reveal>

      <div className="mt-3">{children}</div>

      <Reveal delay={120}>
        <p className="mt-1 text-center text-[10px] leading-relaxed text-brushed-nickel">
          Dengan melanjutkan, kamu menyetujui Ketentuan Layanan &amp; Kebijakan Privasi DARSI.
        </p>
      </Reveal>
    </div>
  );
}

type FieldProps = {
  label: string;
  icon?: IconName;
  type?: "text" | "email";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoCapitalize?: "none" | "words";
  autoComplete?: string;
  maxLength?: number;
  error?: string;
};

/**
 * Text/email input shell. Double-bezel: p-1 outer tray (tint + hairline) holding a
 * white inner core. Focus lifts the outer tray to beryl-green via focus-within.
 */
function FieldBase({
  label,
  icon,
  error,
  trailing,
  children,
}: {
  label: string;
  icon?: IconName;
  error?: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block px-1 text-[11px] font-bold text-brushed-nickel">{label}</span>
      <span
        className={`block rounded-2xl p-1 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          error
            ? "bg-[#FCEBEB]/90 ring-1 ring-[#E7B7B7]"
            : "bg-cute-silver/60 ring-1 ring-black/[0.03] focus-within:bg-beryl-green/80 focus-within:ring-sensational-green/20"
        }`}
      >
        <span className="flex h-12 items-center gap-2.5 rounded-[1.1rem] bg-white px-3.5 shadow-[inset_0_1px_0_rgba(0,0,0,0.02)]">
          {icon && (
            <Icon
              name={icon}
              size={17}
              className={`shrink-0 transition-colors duration-300 ${
                error ? "text-[#A32D2D]" : "text-matte-graphite"
              }`}
            />
          )}
          {children}
          {trailing}
        </span>
      </span>
      {error && (
        <span className="mt-1 block px-1 text-[11px] font-bold leading-snug text-[#A32D2D]">
          {error}
        </span>
      )}
    </label>
  );
}

export function Field(props: FieldProps) {
  const { type = "text", value, onChange, error, label, icon, ...rest } = props;
  return (
    <FieldBase label={label} icon={icon} error={error}>
      <input
        {...rest}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-space-black outline-none placeholder:text-[13px] placeholder:text-matte-graphite/70"
      />
    </FieldBase>
  );
}

export function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <FieldBase
      label={label}
      icon="lock"
      error={error}
      trailing={
        <button
          type="button"
          aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          onClick={() => setShow((s) => !s)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-matte-graphite transition-all duration-300 active:scale-90"
        >
          <Icon name={show ? "eye-closed" : "eye"} size={17} />
        </button>
      }
    >
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-space-black outline-none placeholder:text-[13px] placeholder:text-matte-graphite/70"
      />
    </FieldBase>
  );
}

/** Primary CTA — fully rounded pill with a nested icon disc flush to the right edge. */
export function PrimaryButton({
  label,
  loading,
  success,
  disabled,
  onClick,
}: {
  label: string;
  loading?: boolean;
  success?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`group relative flex h-[54px] w-full items-center justify-center rounded-full px-[56px] text-sm font-bold text-white transition-all duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] ${
        success
          ? "bg-sensational-green"
          : "bg-sensational-green hover:bg-[#024226] active:bg-[#023d24]"
      } active:scale-[0.985] disabled:opacity-60 disabled:active:scale-100`}
    >
      <span className="flex items-center justify-center gap-2">
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        )}
        {label}
      </span>
      <span className="absolute right-2 top-[7px] grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/20 text-white transition-all duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-px group-hover:scale-105 group-active:scale-100">
        {success ? <Icon name="check" size={18} /> : <Icon name="navigation" size={16} />}
      </span>
    </button>
  );
}

/** Inline form-level error banner. */
export function FormError({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-2xl bg-[#FCEBEB] px-4 py-3 text-[12px] font-bold leading-snug text-[#A32D2D]">
      <Icon name="x" size={16} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

const STRENGTH_LEVELS = [
  { label: "Lemah", bar: "bg-[#A32D2D]", text: "text-[#A32D2D]" },
  { label: "Cukup", bar: "bg-lime-peel", text: "text-lime-peel" },
  { label: "Kuat", bar: "bg-sensational-green", text: "text-sensational-green" },
  { label: "Sangat kuat", bar: "bg-[#023d24]", text: "text-[#023d24]" },
] as const;

/** Skor kekuatan 1–4 dari tinggi panjang + variasi karakter. 0 = kosong. */
function passwordScore(value: string): number {
  if (!value) return 0;
  const len = value.length;
  const checks =
    (len >= 8 ? 1 : 0) +
    (/[a-z]/.test(value) ? 1 : 0) +
    (/[A-Z]/.test(value) ? 1 : 0) +
    (/\d/.test(value) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(value) ? 1 : 0);
  return Math.min(4, checks);
}

/**
 * Kekuatan kata sandi — 4 segmen, terisi kiri→kanan via transform-only (scaleX),
 * label dinamis + saran perkuat bila masih lemah. Muncul saat input tidak kosong.
 */
export function PasswordStrength({ value }: { value: string }) {
  const score = passwordScore(value);
  const visible = value.length > 0;
  const level = STRENGTH_LEVELS[(score || 1) - 1];

  return (
    <div className="px-1 pt-2">
      <div className="flex h-[3px] gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="flex-1 overflow-hidden rounded-full bg-cute-silver/80">
            <span
              className={`block h-full origin-left rounded-full transition-transform duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] ${
                visible ? level.bar : ""
              }`}
              style={{
                transform: visible && i < score ? "scaleX(1)" : "scaleX(0)",
              }}
            />
          </span>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className={`text-[11px] font-bold transition-colors duration-300 ${visible ? level.text : "text-[#7F8082]"}`}>
          {visible ? `${level.label}` : "Kekuatan kata sandi"}
        </span>
        {visible && score < 3 && (
          <span className="text-right text-[10px] leading-snug text-brushed-nickel">
            Tambah huruf besar, angka, atau simbol
          </span>
        )}
      </div>
    </div>
  );
}