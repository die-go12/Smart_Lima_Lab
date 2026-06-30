import Link from "next/link";
import { Activity } from "lucide-react";
import { getCurrentProfile } from "@/lib/queries";

export default async function Navbar() {
  const profile = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-[100] border-b border-border bg-background/90 backdrop-blur">
      <nav className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-on-primary">
            <Activity size={18} />
          </span>
          <span className="font-display text-lg font-semibold text-neutral">Smart Lima Lab</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/retos" className="text-sm text-muted hover:text-neutral">Retos</Link>
          <Link href="/proyectos" className="text-sm text-muted hover:text-neutral">Proyectos</Link>
          <Link href="/convocatorias" className="text-sm text-muted hover:text-neutral">Convocatorias</Link>
          <Link href="/insignias" className="text-sm text-muted hover:text-neutral">Insignias</Link>
          {profile?.rol === "mentor" && (
            <Link href="/revision" className="text-sm text-muted hover:text-neutral">Revisión</Link>
          )}
          {profile ? (
            <Link href="/perfil" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:brightness-95">
              Mi perfil
            </Link>
          ) : (
            <Link href="/login" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:brightness-95">
              Iniciar sesión
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
