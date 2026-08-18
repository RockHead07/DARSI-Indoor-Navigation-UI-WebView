"use client";

// Forgot password — auth seam (ADR-017). Dua stage: input email → success card
// "cek emailmu". Pengiriman ke mock client lib/auth.ts (belum ada backend email).

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell, Field, PrimaryButton, FormError, Reveal } from "../components";
import { Icon } from "../../icons";
import { requestPasswordReset } from "../../lib/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Masukkan email yang valid.");
      setFormError(null);
      return;
    }
    setError(undefined);
    setFormError(null);
    setSubmitting(true);
    const res = await requestPasswordReset(email);
    setSubmitting(false);

    if (res.ok) {
      setSuccess(true);
    } else {
      setFormError(res.message);
    }
  };

  if (success) {
    return (
      <AuthShell
        eyebrow="Email terkirim"
        title="Cek email kamu"
        subtitle=""
      >
        <Reveal delay={120}>
          <div className="rounded-[2rem] p-1.5 ring-1 ring-black/[0.03] bg-cute-silver/60 shadow-[0_30px_60px_-45px_rgba(3,80,48,0.5)]">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white px-5 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-beryl-green text-sensational-green">
                <Icon name="mail-alert" size={28} />
              </span>
              <p className="mt-4 break-words text-[13px] leading-relaxed text-matte-graphite">
                Tautan reset sudah dikirim ke{" "}
                <span className="font-bold text-space-black">{email.trim()}</span>. Cek folder spam
                bila tidak menemukannya.
              </p>
              <div className="mt-6">
                <PrimaryButton label="Kembali ke Masuk" success onClick={() => router.push("/auth/login")} />
              </div>
            </div>
          </div>
        </Reveal>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Pemulihan akun"
      title="Lupa password?"
      subtitle=""
    >
      <Reveal delay={120}>
        <div className="rounded-[2rem] p-1.5 ring-1 ring-black/[0.03] bg-cute-silver/60 shadow-[0_30px_60px_-45px_rgba(3,80,48,0.5)]">
          <div className="rounded-[calc(2rem-0.375rem)] bg-white px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="space-y-2">
              <Field
                label="Email"
                icon="mail"
                type="email"
                value={email}
                onChange={(v) => setEmail(v)}
                placeholder="Email"
                autoCapitalize="none"
                autoComplete="email"
                error={error}
              />

              {formError && (
                <div className="pt-2">
                  <FormError message={formError} />
                </div>
              )}

              <div className="pt-3">
                <PrimaryButton
                  label={submitting ? "Mengirim…" : "Kirim Tautan Reset"}
                  loading={submitting}
                  onClick={onSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <p className="mt-6 text-center text-[12px] text-matte-graphite">
          Ingat password sekarang?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="font-bold text-sensational-green underline decoration-sensational-green/30 underline-offset-4 transition-colors active:text-[#023d24]"
          >
            Masuk
          </button>
        </p>
      </Reveal>
    </AuthShell>
  );
}