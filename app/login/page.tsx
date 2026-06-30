"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}

export default function LoginPage() {
  const [modo, setModo] = useState<"entrar" | "crear">("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const conPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const supabase = createClient();
    if (modo === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMsg("Correo o contraseña incorrectos.");
        setLoading(false);
      } else {
        window.location.href = "/retos";
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      setMsg(
        error
          ? "No se pudo crear la cuenta. Prueba con otro correo."
          : "Cuenta creada. Si pide confirmación, revisa tu correo; si no, ya puedes entrar."
      );
      if (!error) setModo("entrar");
    }
  };

  const enlaceMagico = async () => {
    if (!email) {
      setMsg("Escribe tu correo arriba para enviarte el enlace.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setLoading(false);
    setMsg(error ? "No se pudo enviar el enlace." : "Te enviamos un enlace de acceso a tu correo.");
  };

  const conGithub = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) {
      setMsg("No se pudo iniciar con GitHub.");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-neutral">
        <ArrowLeft size={16} /> Volver al inicio
      </Link>
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-8">
        <h1 className="text-2xl font-semibold">
          {modo === "entrar" ? "Iniciar sesión" : "Crear cuenta"}
        </h1>
        <p className="mt-2 text-sm text-muted">Entra con tu correo. Sin complicaciones.</p>

        <form onSubmit={conPassword} className="mt-6 space-y-3">
          <div>
            <label htmlFor="email" className="block text-sm text-muted">Correo</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-muted">Contraseña</label>
            <input id="password" type="password" required minLength={6} value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary" />
          </div>
          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-medium text-on-primary transition hover:brightness-95 disabled:opacity-60">
            <Lock size={18} /> {modo === "entrar" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        <button onClick={() => setModo(modo === "entrar" ? "crear" : "entrar")}
          className="mt-3 text-sm text-secondary hover:underline">
          {modo === "entrar" ? "¿No tienes cuenta? Crear una" : "¿Ya tienes cuenta? Entrar"}
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-border" /> otras opciones <span className="h-px flex-1 bg-border" />
        </div>

        <button onClick={enlaceMagico} disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium text-neutral transition hover:bg-background disabled:opacity-60">
          <Mail size={16} /> Enviarme un enlace de acceso
        </button>
        <button onClick={conGithub} disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium text-neutral transition hover:bg-background disabled:opacity-60">
          <GithubIcon /> Continuar con GitHub
        </button>

        {msg && <p className="mt-4 text-sm text-secondary">{msg}</p>}
      </div>
    </main>
  );
}
