import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getCurrentProfile } from "@/lib/queries";
import { crearProyecto } from "../actions";

export const dynamic = "force-dynamic";

export default async function NuevoProyectoPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[640px] flex-1 px-6 py-10">
        <Link href="/proyectos" className="inline-flex items-center gap-2 text-sm text-muted hover:text-neutral">
          <ArrowLeft size={16} /> Volver a proyectos
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">Subir un proyecto</h1>
        <p className="mt-1 text-sm text-muted">Trae tu proyecto propio o de curso y arma equipo.</p>

        <form action={crearProyecto} className="mt-6 space-y-4 rounded-lg border border-border bg-surface p-6">
          <div>
            <label htmlFor="titulo" className="block text-sm text-muted">Título</label>
            <input id="titulo" name="titulo" required maxLength={100}
              className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary" />
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm text-muted">Descripción</label>
            <textarea id="descripcion" name="descripcion" rows={3} maxLength={500}
              className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary" />
          </div>

          <div>
            <label htmlFor="repo_url" className="block text-sm text-muted">Repositorio en GitHub (opcional)</label>
            <input id="repo_url" name="repo_url" type="url" placeholder="https://github.com/usuario/proyecto"
              className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary" />
            <label className="mt-2 flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" name="repo_publico" defaultChecked /> Mostrar el repositorio públicamente
            </label>
          </div>

          <div>
            <label htmlFor="origen" className="block text-sm text-muted">Origen</label>
            <select id="origen" name="origen"
              className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary">
              <option value="proyecto_libre">Proyecto propio</option>
              <option value="proyecto_curso">Proyecto de curso</option>
            </select>
          </div>

          <div>
            <label htmlFor="visibilidad" className="block text-sm text-muted">Visibilidad</label>
            <select id="visibilidad" name="visibilidad"
              className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary">
              <option value="publico">Público</option>
              <option value="privado">Privado (solo miembros)</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" name="interdisciplinario" /> Es interdisciplinario
          </label>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" name="convocatoria" /> Abrir convocatoria (recibir postulaciones)
          </label>

          <div>
            <label htmlFor="especialidades_busca" className="block text-sm text-muted">Especialidades que busco (opcional)</label>
            <input id="especialidades_busca" name="especialidades_busca" maxLength={200}
              placeholder="Ej. Medicina, Diseño"
              className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary" />
          </div>

          <button type="submit"
            className="w-full rounded-md bg-primary px-4 py-3 font-medium text-on-primary transition hover:brightness-95">
            Crear proyecto
          </button>
        </form>
      </main>
    </>
  );
}
