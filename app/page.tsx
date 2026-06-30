import Link from "next/link";
import { ArrowRight, MapPin, Users, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Imagen from "@/components/Imagen";

const features = [
  { icon: MapPin, t: "Retos reales", d: "Movilidad, salud, seguridad y medio ambiente de Lima." },
  { icon: Users, t: "Equipos", d: "Únete o crea un equipo y trabaja con tu repositorio." },
  { icon: Award, t: "Experiencia", d: "Gana insignias y proyectos para tu portafolio." },
];

const metrics = [
  { n: "5", l: "retos activos" },
  { n: "4", l: "categorías" },
  { n: "100%", l: "hecho por estudiantes" },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6">
        <section className="grid items-center gap-12 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div>
            <span className="inline-block rounded-sm bg-surface-2 px-3 py-1 text-xs font-medium uppercase tracking-wider text-secondary">
              Programa de innovación urbana
            </span>

            <h1 className="mt-5 text-4xl font-semibold leading-[1.1] md:text-5xl">
              Resuelve retos reales de Lima{" "}
              <span className="text-primary">y gana experiencia</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Smart Lima Lab conecta a estudiantes de Ingeniería con problemas
              reales de la ciudad. Forma equipo, construye una solución y arma
              tu portafolio profesional.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/retos"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-medium text-on-primary transition hover:brightness-95"
              >
                Explorar retos <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-3 font-medium text-primary transition hover:bg-surface-2"
              >
                Ver demo
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {features.map(({ icon: Icon, t, d }) => (
                <div key={t} className="rounded-md border border-border bg-surface p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary">
                    <Icon size={18} />
                  </span>
                  <p className="mt-3 font-medium text-neutral">{t}</p>
                  <p className="mt-1 text-sm text-muted">{d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <Imagen
              src="/assets/tano-mascota.png"
              alt="Tano, la mascota de Smart Lima Lab"
              width={360}
              height={360}
              className="w-full max-w-[360px]"
            />
          </div>
        </section>

        <section className="mb-16 grid grid-cols-3 gap-4 rounded-lg border border-border bg-surface p-6">
          {metrics.map(({ n, l }) => (
            <div key={l} className="text-center">
              <p className="font-display text-2xl font-semibold text-primary">{n}</p>
              <p className="mt-1 text-sm text-muted">{l}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-6 text-sm text-muted">
          Smart Lima Lab — una iniciativa de estudiantes UPCH.
        </div>
      </footer>
    </>
  );
}
