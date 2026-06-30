import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, GitBranch, Plus, CircleCheck, UserCheck, UserX, GraduationCap, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import TaskItem from "@/components/TaskItem";
import {
  getTeamById,
  getTasksByTeam,
  getTeamMembers,
  getChallengeById,
  getCurrentProfile,
  getAplicaciones,
  getProfileById,
  getMentores,
} from "@/lib/queries";
import {
  agregarTarea,
  completarReto,
  postular,
  aceptarPostulante,
  rechazarPostulante,
  asignarMentor,
  guardarConvocatoria,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function EquipoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await getTeamById(id);
  if (!team) notFound();

  const profile = await getCurrentProfile();
  const members = await getTeamMembers(id);
  const esOwner = !!profile && profile.id === team.creado_por;

  const [tasks, reto, aplicaciones, mentor, mentores] = await Promise.all([
    getTasksByTeam(id),
    team.challenge_id ? getChallengeById(team.challenge_id) : Promise.resolve(null),
    team.convocatoria_abierta ? getAplicaciones(id) : Promise.resolve([]),
    team.mentor_id ? getProfileById(team.mentor_id) : Promise.resolve(null),
    esOwner ? getMentores() : Promise.resolve([]),
  ]);

  const canEdit = !!profile && members.some((m) => m.profile_id === profile.id);
  const yaPostule = !!profile && aplicaciones.some((a) => a.profile_id === profile.id);
  const completado = team.estado === "completado";
  const hechas = tasks.filter((t) => t.estado === "hecho").length;
  const progreso = tasks.length ? Math.round((hechas / tasks.length) * 100) : 0;
  const titulo = team.titulo ?? team.nombre;
  const mostrarMentor = mentor && (team.visibilidad === "publico" || canEdit);
  const mentorNombre = mentor?.nombre ?? mentor?.github_username ?? "Mentor";

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[1000px] flex-1 px-6 py-10">
        {reto ? (
          <Link href={`/retos/${reto.id}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-neutral">
            <ArrowLeft size={16} /> {reto.titulo}
          </Link>
        ) : (
          <Link href="/proyectos" className="inline-flex items-center gap-2 text-sm text-muted hover:text-neutral">
            <ArrowLeft size={16} /> Proyectos
          </Link>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">{titulo}</h1>
            <p className="mt-1 text-sm text-muted">
              {completado ? "Proyecto completado" : "Proyecto en progreso"}
              {team.interdisciplinario ? " · Interdisciplinario" : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {team.repo_url && team.repo_publico && (
              <a href={team.repo_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm text-primary transition hover:bg-surface-2">
                <GitBranch size={16} /> Repositorio
              </a>
            )}
            {completado ? (
              <span className="inline-flex items-center gap-2 rounded-md bg-success/15 px-4 py-2 text-sm font-medium text-success">
                <CircleCheck size={16} /> Completado
              </span>
            ) : (
              canEdit && (
                <form action={completarReto}>
                  <input type="hidden" name="team_id" value={team.id} />
                  <button type="submit"
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:brightness-95">
                    <CircleCheck size={16} /> Marcar como completado
                  </button>
                </form>
              )
            )}
          </div>
        </div>

        {mostrarMentor && (
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-secondary">
            <GraduationCap size={16} /> Mentor: {mentorNombre}
          </p>
        )}

        {team.descripcion && <p className="mt-3 max-w-prose text-muted">{team.descripcion}</p>}

        {team.convocatoria_abierta && team.especialidades_busca && (
          <p className="mt-2 text-sm text-secondary">Busca: {team.especialidades_busca}</p>
        )}

        {team.convocatoria_abierta && profile && !canEdit && !esOwner && !yaPostule && (
          <form action={postular} className="mt-5 rounded-lg border border-border bg-surface p-5">
            <input type="hidden" name="team_id" value={team.id} />
            <h2 className="font-medium text-neutral">Postular a este proyecto</h2>
            <p className="mt-1 text-sm text-muted">Tu perfil e insignias son tu CV. Agrega un mensaje (opcional).</p>
            <textarea name="mensaje" rows={2} maxLength={300} placeholder="¿Por qué quieres unirte?"
              className="mt-3 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary" />
            <button type="submit" className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:brightness-95">
              Enviar postulación
            </button>
          </form>
        )}
        {team.convocatoria_abierta && yaPostule && !canEdit && (
          <p className="mt-5 rounded-md border border-border bg-surface p-4 text-sm text-secondary">Ya postulaste a este proyecto.</p>
        )}

        <div className="mt-8 grid gap-8 md:grid-cols-[1.6fr_1fr]">
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Tareas</h2>
              <span className="text-sm text-muted">{hechas}/{tasks.length} hechas</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-primary" style={{ width: `${progreso}%` }} />
            </div>
            <ul className="mt-5 space-y-2">
              {tasks.length === 0 ? (
                <li className="rounded-md border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
                  Aún no hay tareas. {canEdit ? "Agrega la primera abajo." : ""}
                </li>
              ) : (
                tasks.map((t) => <TaskItem key={t.id} task={t} canEdit={canEdit} />)
              )}
            </ul>
            {canEdit && (
              <form action={agregarTarea} className="mt-4 flex gap-2">
                <input type="hidden" name="team_id" value={team.id} />
                <input name="titulo" required placeholder="Nueva tarea…"
                  className="flex-1 rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary" />
                <button type="submit"
                  className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2.5 font-medium text-on-primary transition hover:brightness-95">
                  <Plus size={16} /> Agregar
                </button>
              </form>
            )}
          </section>

          <aside className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold">Equipo</h2>
              <ul className="mt-3 space-y-2">
                {members.map((m) => (
                  <li key={m.id} className="flex items-center justify-between rounded-md border border-border bg-surface p-3">
                    <span className="text-sm text-neutral">
                      {m.profiles?.nombre ?? m.profiles?.github_username ?? "Estudiante"}
                    </span>
                    <span className="text-xs text-muted">{m.rol}</span>
                  </li>
                ))}
              </ul>
            </div>

            {esOwner && team.convocatoria_abierta && (
              <div>
                <h2 className="text-lg font-semibold">Postulantes</h2>
                {aplicaciones.length === 0 ? (
                  <p className="mt-3 rounded-md border border-dashed border-border bg-surface p-4 text-sm text-muted">
                    Aún no hay postulaciones.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {aplicaciones.map((a) => (
                      <li key={a.id} className="rounded-md border border-border bg-surface p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-neutral">
                            {a.profiles?.nombre ?? a.profiles?.github_username ?? "Estudiante"}
                          </span>
                          <span className="text-xs text-muted">{a.estado}</span>
                        </div>
                        {a.profiles?.especialidad && <p className="text-xs text-secondary">{a.profiles.especialidad}</p>}
                        {a.mensaje && <p className="mt-1 text-sm text-muted">{a.mensaje}</p>}
                        {a.estado === "pendiente" && (
                          <div className="mt-2 flex gap-2">
                            <form action={aceptarPostulante}>
                              <input type="hidden" name="aplicacion_id" value={a.id} />
                              <input type="hidden" name="team_id" value={team.id} />
                              <input type="hidden" name="profile_id" value={a.profile_id} />
                              <button type="submit" className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-on-primary">
                                <UserCheck size={14} /> Aceptar
                              </button>
                            </form>
                            <form action={rechazarPostulante}>
                              <input type="hidden" name="aplicacion_id" value={a.id} />
                              <input type="hidden" name="team_id" value={team.id} />
                              <button type="submit" className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:text-neutral">
                                <UserX size={14} /> Rechazar
                              </button>
                            </form>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {esOwner && (
              <div className="rounded-lg border border-border bg-surface p-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Settings size={18} className="text-primary" /> Ajustes del líder
                </h2>

                <form action={asignarMentor} className="mt-4">
                  <input type="hidden" name="team_id" value={team.id} />
                  <label className="block text-sm text-muted">Mentor del proyecto</label>
                  <select name="mentor_id" defaultValue={team.mentor_id ?? ""}
                    className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-neutral outline-none focus:ring-2 focus:ring-secondary">
                    <option value="">Sin mentor</option>
                    {mentores.map((mm) => (
                      <option key={mm.id} value={mm.id}>
                        {mm.nombre ?? mm.github_username ?? "Mentor"}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="mt-2 rounded-md bg-surface-2 px-3 py-1.5 text-sm text-primary hover:bg-background">
                    Guardar mentor
                  </button>
                </form>

                <form action={guardarConvocatoria} className="mt-5 border-t border-border pt-4">
                  <input type="hidden" name="team_id" value={team.id} />
                  <label className="flex items-center gap-2 text-sm text-muted">
                    <input type="checkbox" name="convocatoria_abierta" defaultChecked={team.convocatoria_abierta} />
                    Convocatoria abierta (recibir postulaciones)
                  </label>
                  <label className="mt-3 block text-sm text-muted">Especialidades que busco</label>
                  <input name="especialidades_busca" defaultValue={team.especialidades_busca ?? ""} maxLength={200}
                    placeholder="Ej. Medicina, Diseño"
                    className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-neutral outline-none focus:ring-2 focus:ring-secondary" />
                  <button type="submit" className="mt-2 rounded-md bg-surface-2 px-3 py-1.5 text-sm text-primary hover:bg-background">
                    Guardar convocatoria
                  </button>
                </form>
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
