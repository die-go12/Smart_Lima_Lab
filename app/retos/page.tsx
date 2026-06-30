import Link from "next/link";
import { Inbox, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import RetoCard from "@/components/RetoCard";
import GuiaOnboarding from "@/components/GuiaOnboarding";
import { getChallenges, getCurrentProfile } from "@/lib/queries";

export const dynamic = "force-dynamic";

const categorias = ["Movilidad", "Salud", "Seguridad", "Medio ambiente"];

function FilterChip({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link href={href}
      className={`rounded-md px-3 py-1.5 text-sm transition ${
        active ? "bg-primary text-on-primary" : "border border-border bg-surface text-muted hover:text-neutral"
      }`}>
      {label}
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="mt-12 flex flex-col items-center rounded-lg border border-dashed border-border bg-surface p-12 text-center">
      <Inbox size={32} className="text-muted" />
      <p className="mt-3 font-medium text-neutral">No hay retos en esta categoría</p>
      <p className="mt-1 text-sm text-muted">Prueba con otra categoría o vuelve al listado completo.</p>
      <Link href="/retos" className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary">Ver todos</Link>
    </div>
  );
}

export default async function RetosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const [retos, profile] = await Promise.all([getChallenges(), getCurrentProfile()]);
  const filtrados = categoria ? retos.filter((r) => r.categoria === categoria) : retos;
  const mostrarGuia = !!profile && !profile.guia_vista;

  return (
    <>
      <Navbar />
      {mostrarGuia && <GuiaOnboarding />}
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Retos de Lima</h1>
            <p className="mt-2 text-muted">Elige un problema real, forma equipo y construye tu solución.</p>
          </div>
          {profile && (
            <Link href="/proponer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-primary transition hover:bg-surface-2">
              <Plus size={16} /> Proponer reto
            </Link>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <FilterChip label="Todos" href="/retos" active={!categoria} />
          {categorias.map((c) => (
            <FilterChip key={c} label={c} href={`/retos?categoria=${encodeURIComponent(c)}`} active={categoria === c} />
          ))}
        </div>

        {filtrados.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((r) => <RetoCard key={r.id} reto={r} />)}
          </div>
        )}
      </main>
    </>
  );
}
