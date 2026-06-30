import Link from "next/link";
import { Plus, GitBranch, Users, FolderGit2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getProyectos } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ProyectosPage() {
  const proyectos = await getProyectos();

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Proyectos</h1>
            <p className="mt-2 text-muted">
              Proyectos propios y de curso. Súmate o trae el tuyo y arma equipo.
            </p>
          </div>
          <Link
            href="/proyectos/nuevo"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-medium text-on-primary transition hover:brightness-95"
          >
            <Plus size={18} /> Subir proyecto
          </Link>
        </div>

        {proyectos.length === 0 ? (
          <div className="mt-12 flex flex-col items-center rounded-lg border border-dashed border-border bg-surface p-12 text-center">
            <FolderGit2 size={32} className="text-muted" />
            <p className="mt-3 font-medium text-neutral">Aún no hay proyectos</p>
            <p className="mt-1 text-sm text-muted">Sé el primero en subir el tuyo.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {proyectos.map((p) => (
              <Link
                key={p.id}
                href={`/equipos/${p.id}`}
                className="flex flex-col rounded-lg border border-border bg-surface p-5 transition hover:bg-surface-2"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {p.interdisciplinario && (
                    <span className="rounded-sm bg-surface-2 px-2 py-0.5 text-xs text-secondary">Interdisciplinario</span>
                  )}
                  {p.convocatoria_abierta && (
                    <span className="inline-flex items-center gap-1 rounded-sm bg-primary/15 px-2 py-0.5 text-xs text-primary">
                      <Users size={12} /> Convocatoria abierta
                    </span>
                  )}
                  {p.origen === "proyecto_curso" && (
                    <span className="rounded-sm bg-surface-2 px-2 py-0.5 text-xs text-muted">De curso</span>
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-neutral">{p.titulo ?? p.nombre}</h3>
                {p.descripcion && <p className="mt-2 line-clamp-3 text-sm text-muted">{p.descripcion}</p>}
                {p.especialidades_busca && (
                  <p className="mt-3 text-xs text-secondary">Busca: {p.especialidades_busca}</p>
                )}
                {p.repo_url && p.repo_publico && (
                  <span className="mt-4 inline-flex items-center gap-1 text-xs text-muted">
                    <GitBranch size={12} /> Con repositorio
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
