import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import EquipoForm from "@/components/EquipoForm";
import { getChallengeById, getTeamsByChallenge, getCurrentProfile } from "@/lib/queries";

export const dynamic = "force-dynamic";

const dificultadColor: Record<string, string> = {
  "Básico": "text-success",
  "Intermedio": "text-warning",
  "Avanzado": "text-danger",
};

export default async function DetalleRetoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reto = await getChallengeById(id);
  if (!reto) notFound();

  const [teams, profile] = await Promise.all([getTeamsByChallenge(id), getCurrentProfile()]);

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-10">
        <Link href="/retos" className="inline-flex items-center gap-2 text-sm text-muted hover:text-neutral">
          <ArrowLeft size={16} /> Volver a retos
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-sm bg-surface-2 px-2.5 py-1 text-xs font-medium text-secondary">{reto.categoria}</span>
              <span className={`text-sm ${dificultadColor[reto.dificultad ?? ""] ?? "text-muted"}`}>
                {reto.dificultad ?? "Sin nivel"}
              </span>
              {reto.estado === "completado" && <span className="text-sm text-muted">Completado</span>}
            </div>

            <h1 className="mt-4 text-3xl font-semibold">{reto.titulo}</h1>
            <p className="mt-4 leading-relaxed text-muted">{reto.descripcion}</p>

            {reto.mentor && (
              <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted">
                <User size={16} /> Mentor: {reto.mentor}
              </p>
            )}

            {reto.habilidades.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-medium text-muted">Habilidades</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {reto.habilidades.map((h) => (
                    <span key={h} className="rounded-sm border border-border px-2.5 py-1 text-xs text-neutral">{h}</span>
                  ))}
                </div>
              </div>
            )}

            {reto.guia_tecnica && (
              <div className="mt-8 rounded-lg border border-border bg-surface p-5">
                <h2 className="flex items-center gap-2 font-medium text-neutral">
                  <BookOpen size={18} className="text-primary" /> Guía técnica recomendada
                </h2>
                <p className="mt-2 whitespace-pre-line text-sm text-muted">{reto.guia_tecnica}</p>
              </div>
            )}
          </div>

          <aside>
            <h2 className="text-lg font-semibold">Participar</h2>
            <p className="mt-1 text-sm text-muted">
              Únete a un equipo existente o crea el tuyo para empezar a resolver el reto.
            </p>
            <div className="mt-5">
              {profile ? (
                <EquipoForm challengeId={reto.id} teams={teams} />
              ) : (
                <div className="rounded-lg border border-border bg-surface p-5 text-center">
                  <p className="text-sm text-muted">Inicia sesión para unirte o crear un equipo.</p>
                  <Link href="/login" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 font-medium text-on-primary">
                    Iniciar sesión
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
