import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Challenge } from "@/lib/types";

const dificultadColor: Record<string, string> = {
  "Básico": "text-success",
  "Intermedio": "text-warning",
  "Avanzado": "text-danger",
};

export default function RetoCard({ reto }: { reto: Challenge }) {
  return (
    <Link
      href={`/retos/${reto.id}`}
      className="group flex flex-col rounded-lg border border-border bg-surface p-5 transition hover:bg-surface-2"
    >
      <div className="flex items-center justify-between">
        <span className="rounded-sm bg-surface-2 px-2.5 py-1 text-xs font-medium text-secondary">
          {reto.categoria}
        </span>
        {reto.estado === "completado" && (
          <span className="text-xs text-muted">Completado</span>
        )}
      </div>

      <h3 className="mt-3 text-lg font-semibold text-neutral">{reto.titulo}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted">{reto.descripcion}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {reto.habilidades.slice(0, 3).map((h) => (
          <span key={h} className="rounded-sm border border-border px-2 py-0.5 text-xs text-muted">
            {h}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
        <span className={dificultadColor[reto.dificultad ?? ""] ?? "text-muted"}>
          {reto.dificultad ?? "Sin nivel"}
        </span>
        <span className="inline-flex items-center gap-1 text-primary opacity-0 transition group-hover:opacity-100">
          Ver reto <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  );
}
