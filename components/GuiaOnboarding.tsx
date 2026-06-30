"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Imagen from "@/components/Imagen";
import { marcarGuiaVista } from "@/app/guia-actions";

const pasos = [
  {
    titulo: "Bienvenido a Smart Lima Lab",
    texto: "Aquí resuelves retos reales de Lima y ganas experiencia para tu portafolio profesional.",
  },
  {
    titulo: "1. Elige un reto",
    texto: "Explora el catálogo por categoría: movilidad, salud, seguridad y medio ambiente.",
  },
  {
    titulo: "2. Forma o únete a un equipo",
    texto: "Crea tu equipo con su repositorio de GitHub, o únete a uno que ya exista.",
  },
  {
    titulo: "3. Construye y avanza",
    texto: "Gestiona las tareas de tu proyecto y registra tu progreso paso a paso.",
  },
  {
    titulo: "4. Gana experiencia",
    texto: "Al completar retos sumas insignias y proyectos a tu perfil. Tu portafolio crece solo.",
  },
];

export default function GuiaOnboarding() {
  const [visible, setVisible] = useState(true);
  const [i, setI] = useState(0);

  if (!visible) return null;

  const paso = pasos[i];
  const ultimo = i === pasos.length - 1;

  const cerrar = async () => {
    setVisible(false);
    await marcarGuiaVista();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-md rounded-lg border border-border bg-surface p-6">
        <button
          onClick={cerrar}
          aria-label="Cerrar guía"
          className="absolute right-4 top-4 text-muted transition hover:text-neutral"
        >
          <X size={18} />
        </button>

        <div className="flex justify-center">
          <Imagen
            src="/assets/tano-mascota.png"
            alt="Tano, tu guía en Smart Lima Lab"
            width={120}
            height={120}
            className="w-[120px]"
          />
        </div>

        <h2 className="mt-4 text-center text-xl font-semibold">{paso.titulo}</h2>
        <p className="mt-2 text-center text-sm text-muted">{paso.texto}</p>

        <div className="mt-5 flex justify-center gap-1.5">
          {pasos.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 w-1.5 rounded-full ${idx === i ? "bg-primary" : "bg-surface-2"}`}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={cerrar} className="text-sm text-muted transition hover:text-neutral">
            Saltar
          </button>
          {ultimo ? (
            <button
              onClick={cerrar}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:brightness-95"
            >
              Empezar
            </button>
          ) : (
            <button
              onClick={() => setI(i + 1)}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:brightness-95"
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
