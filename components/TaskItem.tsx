"use client";

import { Circle, CircleDot, CircleCheck } from "lucide-react";
import type { Task } from "@/lib/types";
import { cambiarEstadoTarea } from "@/app/equipos/[id]/actions";

const meta = {
  pendiente: { label: "Pendiente", Icon: Circle, color: "text-muted" },
  en_progreso: { label: "En progreso", Icon: CircleDot, color: "text-warning" },
  hecho: { label: "Hecho", Icon: CircleCheck, color: "text-success" },
} as const;

export default function TaskItem({ task, canEdit }: { task: Task; canEdit: boolean }) {
  const m = meta[task.estado];
  const Icon = m.Icon;

  return (
    <li className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface p-3">
      <span className="flex items-center gap-2">
        <Icon size={18} className={m.color} />
        <span className={task.estado === "hecho" ? "text-muted line-through" : "text-neutral"}>
          {task.titulo}
        </span>
      </span>

      {canEdit ? (
        <form action={cambiarEstadoTarea}>
          <input type="hidden" name="task_id" value={task.id} />
          <input type="hidden" name="team_id" value={task.team_id} />
          <input type="hidden" name="estado" value={task.estado} />
          <button
            type="submit"
            className={`rounded-md bg-surface-2 px-2.5 py-1 text-xs font-medium transition hover:bg-background ${m.color}`}
          >
            {m.label}
          </button>
        </form>
      ) : (
        <span className={`text-xs ${m.color}`}>{m.label}</span>
      )}
    </li>
  );
}
