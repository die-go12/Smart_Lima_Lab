import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Award, FolderGit2, ExternalLink, LogOut, Pencil } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getCurrentProfile, getTeamsByProfile, getBadgesByProfile } from "@/lib/queries";
import { cerrarSesion } from "./actions";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const [teams, badges] = await Promise.all([
    getTeamsByProfile(profile.id),
    getBadgesByProfile(profile.id),
  ]);

  const nombre = profile.nombre ?? profile.github_username ?? "Estudiante";
  const inicial = nombre.charAt(0).toUpperCase();
  const esMentor = profile.rol === "mentor";

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[1000px] flex-1 px-6 py-10">
        <section className="flex flex-wrap items-start justify-between gap-6 rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center gap-4">
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt={nombre} width={72} height={72} className="rounded-full" />
            ) : (
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-surface-2 text-2xl font-semibold text-primary">
                {inicial}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">{nombre}</h1>
                {esMentor && (
                  <span className="rounded-sm bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">Mentor</span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted">
                {[profile.carrera, profile.especialidad, profile.ciclo ? `Ciclo ${profile.ciclo}` : null]
                  .filter(Boolean)
                  .join(" · ") || "Completa tu perfil"}
              </p>
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-sm text-secondary hover:underline">
                  @{profile.github_username} <ExternalLink size={12} />
                </a>
              )}
              {profile.bio && <p className="mt-2 max-w-prose text-sm text-neutral">{profile.bio}</p>}
            </div>
          </div>

          <div className="flex gap-2">
            <Link href="/perfil/editar"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:brightness-95">
              <Pencil size={16} /> Editar
            </Link>
            <form action={cerrarSesion}>
              <button type="submit"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm text-muted transition hover:text-neutral">
                <LogOut size={16} /> Salir
              </button>
            </form>
          </div>
        </section>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <section>
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Award size={18} className="text-primary" /> Experiencia
              </h2>
              <Link href="/insignias" className="text-sm text-secondary hover:underline">Ver catálogo</Link>
            </div>
            {badges.length === 0 ? (
              <p className="mt-3 rounded-md border border-dashed border-border bg-surface p-5 text-sm text-muted">
                Aún no tienes insignias. Completa retos para ganarlas.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {badges.map((b) => (
                  <li key={b.id} className="flex items-center gap-2 rounded-md border border-border bg-surface p-3 text-sm text-neutral">
                    <Award size={16} className="text-primary" /> {b.nombre}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <FolderGit2 size={18} className="text-primary" /> Proyectos
            </h2>
            {teams.length === 0 ? (
              <div className="mt-3 rounded-md border border-dashed border-border bg-surface p-6 text-center">
                <p className="text-sm text-muted">Aún no participas en ningún proyecto.</p>
                <Link href="/retos" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary">
                  Explorar retos
                </Link>
              </div>
            ) : (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {teams.map((t) => (
                  <li key={t.id}>
                    <Link href={`/equipos/${t.id}`} className="block rounded-lg border border-border bg-surface p-4 transition hover:bg-surface-2">
                      <p className="font-medium text-neutral">{t.titulo ?? t.nombre}</p>
                      <p className="mt-1 text-xs text-muted">{t.estado === "completado" ? "Completado" : "En progreso"}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
