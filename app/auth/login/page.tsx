"use client";

// Login — auth seam (ADR-017). Form validation + loading/success states di-overlay
// di atas mock client lib/auth.ts. Success state menunjukkan ke mana user dipandu
// setelah masuk; tidak ada navigasi paksa supaya state bisa menyala penuh di preview.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell, Field, PasswordField, PrimaryButton, FormError, Reveal } from "../components";
import { Icon } from "../../icons";
import { login } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async () => {
    const next: typeof errors = {};
    if (!identifier.trim()) next.identifier = "Masukkan email atau username.";
    if (!password) next.password = "Masukkan password.";
    setErrors(next);
    setFormError(null);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const res = await login(identifier, password);
    setSubmitting(false);

    if (res.ok) {
      setSuccess(true);
    } else {
      setFormError(res.message);
    }
  };

  // Success card — menggantikan formulir, antitesis dari "terus diam tanpa feedback".
  if (success) {
    return (
      <AuthShell
        title="Berhasil masuk"
        subtitle=""
      >
        <Reveal delay={120}>
          <div className="rounded-[2rem] p-1.5 ring-1 ring-black/[0.03] bg-cute-silver/60 shadow-[0_30px_60px_-45px_rgba(3,80,48,0.5)]">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white px-5 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-beryl-green text-sensational-green">
                <Icon name="check" size={28} />
              </span>
              <p className="mt-4 text-[13px] leading-relaxed text-matte-graphite">
                Kamu akan diarahkan ke beranda dalam beberapa saat.
              </p>
              <div className="mt-6">
                <PrimaryButton label="Lanjut ke Beranda" success onClick={() => router.push("/")} />
              </div>
            </div>
          </div>
        </Reveal>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Masuk ke akunmu"
      subtitle=""
    >
      <Reveal delay={120}>
        <div className="rounded-[2rem] p-1.5 ring-1 ring-black/[0.03] bg-cute-silver/60 shadow-[0_30px_60px_-45px_rgba(3,80,48,0.5)]">
          <div className="rounded-[calc(2rem-0.375rem)] bg-white px-5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="space-y-2">
              <Field
                label="Email atau username"
                icon="mail"
                type="email"
                value={identifier}
                onChange={(v) => setIdentifier(v)}
                placeholder="Email atau username"
                autoCapitalize="none"
                autoComplete="username"
                error={errors.identifier}
              />
              <PasswordField
                label="Password"
                value={password}
                onChange={(v) => setPassword(v)}
                placeholder="Password"
                autoComplete="current-password"
                error={errors.password}
              />

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => router.push("/auth/forgot-password")}
                  className="text-[11px] font-bold text-sensational-green underline decoration-sensational-green/30 underline-offset-4 transition-colors active:text-[#023d24]"
                >
                  Lupa password?
                </button>
              </div>

              {formError && (
                <div className="pt-2">
                  <FormError message={formError} />
                </div>
              )}

              <div className="pt-3">
                <PrimaryButton
                  label={submitting ? "Memproses…" : "Masuk"}
                  loading={submitting}
                  onClick={onSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <p className="mt-2 text-center text-[12px] text-matte-graphite">
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/register")}
            className="font-bold text-sensational-green underline decoration-sensational-green/30 underline-offset-4 transition-colors active:text-[#023d24]"
          >
            Daftar sekarang
          </button>
        </p>
      </Reveal>
    </AuthShell>
  );
}