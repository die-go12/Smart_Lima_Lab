import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getCurrentProfile, getPendingChallenges } from "@/lib/queries";
import { aprobarReto, rechazarReto } from "./actions";

export const dynamic = "force-dynamic";
const dificultades = ["Básico", "Intermedio", "Avanzado"];

export default async function RevisionPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.rol !== "mentor") redirect("/retos");

  const pendientes = await getPendingChallenges();

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[800px] flex-1 px-6 py-10">
        <h1 className="text-3xl font-semibold">Revisión de propuestas</h1>
        <p className="mt-2 text-muted">Aprueba retos propuestos y añade la guía técnica para los estudiantes.</p>

        {pendientes.length === 0 ? (
          <p className="mt-8 rounded-md border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
            No hay propuestas pendientes.
          </p>
        ) : (
          <div className="mt-8 space-y-5">
            {pendientes.map((c) => (
              <div key={c.id} className="rounded-lg border border-border bg-surface p-5">
                <span className="rounded-sm bg-surface-2 px-2.5 py-1 text-xs font-medium text-secondary">{c.categoria}</span>
                <h2 className="mt-2 text-lg font-semibold text-neutral">{c.titulo}</h2>
                {c.descripcion && <p className="mt-1 text-sm text-muted">{c.descripcion}</p>}

                <form action={aprobarReto} className="mt-4 space-y-3 border-t border-border pt-4">
                  <input type="hidden" name="id" value={c.id} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs text-muted">Dificultad</label>
                      <select name="dificultad"
                        className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-neutral outline-none focus:ring-2 focus:ring-secondary">
                        <option value="">Sin nivel</option>
                        {dificultades.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted">Habilidades (separadas por coma)</label>
                      <input name="habilidades" placeholder="React, APIs, UX"
                        className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-neutral outline-none focus:ring-2 focus:ring-secondary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-muted">Guía técnica (herramientas, frameworks, arquitectura)</label>
                    <textarea name="guia_tecnica" rows={3}
                      placeholder="Sugiere el stack y enfoque recomendado…"
                      className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-neutral outline-none focus:ring-2 focus:ring-secondary" />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:brightness-95">
                      Aprobar y publicar
                    </button>
                  </div>
                </form>

                <form action={rechazarReto} className="mt-2">
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="text-sm text-muted hover:text-danger">Rechazar</button>
                </form>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
