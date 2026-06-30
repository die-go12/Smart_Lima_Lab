import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getCurrentProfile } from "@/lib/queries";
import { proponerReto } from "./actions";

export const dynamic = "force-dynamic";
const categorias = ["Movilidad", "Salud", "Seguridad", "Medio ambiente"];

export default async function ProponerPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[640px] flex-1 px-6 py-10">
        <Link href="/retos" className="inline-flex items-center gap-2 text-sm text-muted hover:text-neutral">
          <ArrowLeft size={16} /> Volver a retos
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">Proponer un reto</h1>
        <p className="mt-1 text-sm text-muted">Un mentor lo revisará y le añadirá la guía técnica antes de publicarlo.</p>

        <form action={proponerReto} className="mt-6 space-y-4 rounded-lg border border-border bg-surface p-6">
          <div>
            <label htmlFor="titulo" className="block text-sm text-muted">Título</label>
            <input id="titulo" name="titulo" required maxLength={120}
              className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary" />
          </div>
          <div>
            <label htmlFor="categoria" className="block text-sm text-muted">Categoría</label>
            <select id="categoria" name="categoria" required
              className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary">
              <option value="">Selecciona…</option>
              {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="descripcion" className="block text-sm text-muted">Descripción del problema</label>
            <textarea id="descripcion" name="descripcion" rows={4} maxLength={600}
              className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary" />
          </div>
          <button type="submit" className="w-full rounded-md bg-primary px-4 py-3 font-medium text-on-primary transition hover:brightness-95">
            Enviar propuesta
          </button>
        </form>
      </main>
    </>
  );
}
