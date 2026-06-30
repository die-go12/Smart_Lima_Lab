import Link from "next/link";
import { Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getConvocatorias } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ConvocatoriasPage() {
  const convocatorias = await getConvocatorias();
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-12">
        <h1 className="text-3xl font-semibold">Convocatorias</h1>
        <p className="mt-2 text-muted">Proyectos que buscan integrantes. Postula con tu perfil e insignias.</p>

        {convocatorias.length === 0 ? (
          <div className="mt-12 flex flex-col items-center rounded-lg border border-dashed border-border bg-surface p-12 text-center">
            <Users size={32} className="text-muted" />
            <p className="mt-3 font-medium text-neutral">No hay convocatorias abiertas</p>
            <p className="mt-1 text-sm text-muted">Cuando un proyecto abra convocatoria, aparecerá aquí.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {convocatorias.map((p) => (
              <Link key={p.id} href={`/equipos/${p.id}`}
                className="flex flex-col rounded-lg border border-border bg-surface p-5 transition hover:bg-surface-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-sm bg-primary/15 px-2 py-0.5 text-xs text-primary">
                    <Users size={12} /> Convocatoria
                  </span>
                  {p.interdisciplinario && (
                    <span className="rounded-sm bg-surface-2 px-2 py-0.5 text-xs text-secondary">Interdisciplinario</span>
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-neutral">{p.titulo ?? p.nombre}</h3>
                {p.descripcion && <p className="mt-2 line-clamp-3 text-sm text-muted">{p.descripcion}</p>}
                {p.especialidades_busca && <p className="mt-3 text-xs text-secondary">Busca: {p.especialidades_busca}</p>}
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
