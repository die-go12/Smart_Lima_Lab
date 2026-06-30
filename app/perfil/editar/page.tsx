import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getCurrentProfile } from "@/lib/queries";
import { actualizarPerfil } from "../actions";

export const dynamic = "force-dynamic";

const ESPECIALIDADES = [
  "Ingeniería Informática",
  "Medicina",
  "Biología",
  "Ingeniería Ambiental",
  "Diseño",
  "Administración",
  "Otra",
];

export default async function EditarPerfilPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[640px] flex-1 px-6 py-10">
        <Link href="/perfil" className="inline-flex items-center gap-2 text-sm text-muted hover:text-neutral">
          <ArrowLeft size={16} /> Volver al perfil
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">Editar perfil</h1>

        <form action={actualizarPerfil} className="mt-6 space-y-4 rounded-lg border border-border bg-surface p-6">
          <div>
            <label htmlFor="nombre" className="block text-sm text-muted">Nombre visible</label>
            <input id="nombre" name="nombre" defaultValue={profile.nombre ?? ""} maxLength={80}
              className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="carrera" className="block text-sm text-muted">Carrera</label>
              <input id="carrera" name="carrera" defaultValue={profile.carrera ?? ""} maxLength={80}
                className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary" />
            </div>
            <div>
              <label htmlFor="ciclo" className="block text-sm text-muted">Ciclo</label>
              <input id="ciclo" name="ciclo" type="number" min={1} max={20} defaultValue={profile.ciclo ?? ""}
                className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary" />
            </div>
          </div>

          <div>
            <label htmlFor="especialidad" className="block text-sm text-muted">Especialidad</label>
            <select id="especialidad" name="especialidad" defaultValue={profile.especialidad ?? ""}
              className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary">
              <option value="">Selecciona…</option>
              {ESPECIALIDADES.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm text-muted">Bio</label>
            <textarea id="bio" name="bio" rows={3} maxLength={300} defaultValue={profile.bio ?? ""}
              placeholder="Cuéntale a otros en qué te interesa trabajar…"
              className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary" />
          </div>

          <button type="submit"
            className="w-full rounded-md bg-primary px-4 py-3 font-medium text-on-primary transition hover:brightness-95">
            Guardar cambios
          </button>
        </form>
      </main>
    </>
  );
}
