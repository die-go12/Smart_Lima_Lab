"use client";

import { GitBranch } from "lucide-react";
import type { Team } from "@/lib/types";
import { crearEquipo, unirseEquipo } from "@/app/retos/[id]/actions";

export default function EquipoForm({
  challengeId,
  teams,
}: {
  challengeId: string;
  teams: Team[];
}) {
  return (
    <div className="space-y-6">
      {teams.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted">Equipos en este reto</h3>
          <ul className="mt-3 space-y-2">
            {teams.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-4 rounded-md border border-border bg-surface p-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-neutral">{t.nombre}</p>
                  {t.repo_url && (
                    <a
                      href={t.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-secondary hover:underline"
                    >
                      <GitBranch size={12} /> Repositorio
                    </a>
                  )}
                </div>
                <form action={unirseEquipo}>
                  <input type="hidden" name="team_id" value={t.id} />
                  <button
                    type="submit"
                    className="shrink-0 rounded-md bg-surface-2 px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-background"
                  >
                    Unirme
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form action={crearEquipo} className="rounded-lg border border-border bg-surface p-5">
        <input type="hidden" name="challenge_id" value={challengeId} />
        <h3 className="font-medium text-neutral">Crear un equipo</h3>

        <label htmlFor="nombre" className="mt-4 block text-sm text-muted">
          Nombre del equipo
        </label>
        <input
          id="nombre"
          name="nombre"
          required
          placeholder="Ej. Equipo Veyro"
          className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary"
        />

        <label htmlFor="repo_url" className="mt-4 block text-sm text-muted">
          Repositorio en GitHub (opcional)
        </label>
        <input
          id="repo_url"
          name="repo_url"
          type="url"
          placeholder="https://github.com/usuario/proyecto"
          className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-neutral outline-none focus:ring-2 focus:ring-secondary"
        />

        <button
          type="submit"
          className="mt-5 w-full rounded-md bg-primary px-4 py-3 font-medium text-on-primary transition hover:brightness-95"
        >
          Crear y empezar
        </button>
      </form>
    </div>
  );
}
