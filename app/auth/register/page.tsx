"use client";

// Register — auth seam (ADR-017). Validasi inline per-field, loading state,
// lalu success card. Data dikirim ke mock client lib/auth.ts (belum ada backend).

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell, Field, PasswordField, PrimaryButton, FormError, PasswordStrength, Reveal } from "../components";
import { Icon } from "../../icons";
import { register } from "../../lib/auth";

type Errors = {
  username?: string;
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirm?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async () => {
    const next: Errors = {};
    if (!username.trim()) next.username = "Masukkan nickname/username.";
    if (!name.trim()) next.name = "Masukkan nama lengkap.";
    if (phone.replace(/\D/g, "").length < 9) next.phone = "Masukkan nomor telepon yang valid.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Masukkan email yang valid.";
    if (password.length < 6) next.password = "Minimal 6 karakter.";
    if (confirm !== password) next.confirm = "Konfirmasi harus sama dengan password.";
    setErrors(next);
    setFormError(null);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const res = await register({ username, name, phone, email, password, confirm });
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
        eyebrow="Akun berhasil dibuat"
        title="Selamat bergabung!"
        subtitle=""
      >
        <Reveal delay={120}>
          <div className="rounded-[2rem] p-1.5 ring-1 ring-black/[0.03] bg-cute-silver/60 shadow-[0_30px_60px_-45px_rgba(3,80,48,0.5)]">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white px-5 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-beryl-green text-sensational-green">
                <Icon name="check" size={28} />
              </span>
              <p className="mt-4 text-[13px] leading-relaxed text-matte-graphite">
                Gunakan email dan password yang baru kamu daftarkan untuk masuk.
              </p>
              <div className="mt-6">
                <PrimaryButton label="Masuk Sekarang" success onClick={() => router.push("/auth/login")} />
              </div>
            </div>
          </div>
        </Reveal>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Buat akun baru"
      title="Daftar DARSI"
      subtitle=""
    >
      <Reveal delay={120}>
        <div className="rounded-[2rem] p-1.5 ring-1 ring-black/[0.03] bg-cute-silver/60 shadow-[0_30px_60px_-45px_rgba(3,80,48,0.5)]">
          <div className="rounded-[calc(2rem-0.375rem)] bg-white px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="space-y-2">
              <Field
                label="Nickname/username"
                icon="user"
                value={username}
                onChange={(v) => setUsername(v)}
                placeholder="Nickname/username"
                autoCapitalize="none"
                autoComplete="username"
                error={errors.username}
              />
              <Field
                label="Nama lengkap"
                value={name}
                onChange={(v) => setName(v)}
                placeholder="Nama lengkap"
                autoCapitalize="words"
                autoComplete="name"
                error={errors.name}
              />
              <Field
                label="Nomor telepon"
                value={phone}
                onChange={(v) => setPhone(v)}
                placeholder="08xxxxxxxxxx"
                autoComplete="tel"
                error={errors.phone}
              />
              <Field
                label="Email"
                icon="mail"
                type="email"
                value={email}
                onChange={(v) => setEmail(v)}
                placeholder="Email"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
              />
              <PasswordField
                label="Password"
                value={password}
                onChange={(v) => setPassword(v)}
                placeholder="Password"
                autoComplete="new-password"
                error={errors.password}
              />
              <PasswordStrength value={password} />
              <PasswordField
                label="Konfirmasi password"
                value={confirm}
                onChange={(v) => setConfirm(v)}
                placeholder="Konfirmasi password"
                autoComplete="new-password"
                error={errors.confirm}
              />

              {formError && (
                <div className="pt-2">
                  <FormError message={formError} />
                </div>
              )}

              <div className="pt-3">
                <PrimaryButton
                  label={submitting ? "Memproses…" : "Daftar"}
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
          Sudah punya akun?{" "}
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