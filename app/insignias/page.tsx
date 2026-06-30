import { Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Imagen from "@/components/Imagen";
import { getBadgeDefs, getCurrentProfile, getBadgesByProfile } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function InsigniasPage() {
  const profile = await getCurrentProfile();
  const [defs, misBadges] = await Promise.all([
    getBadgeDefs(),
    profile ? getBadgesByProfile(profile.id) : Promise.resolve([]),
  ]);
  const ganadas = new Set(misBadges.map((b) => b.codigo).filter(Boolean));

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[1000px] flex-1 px-6 py-12">
        <h1 className="text-3xl font-semibold">Insignias</h1>
        <p className="mt-2 text-muted">
          Tu portafolio de logros. Cumple los requisitos y se otorgan solas.
          {profile ? "" : " Inicia sesión para ver cuáles ya tienes."}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {defs.map((d) => {
            const obtenida = ganadas.has(d.codigo);
            return (
              <div
                key={d.codigo}
                className={`rounded-lg border bg-surface p-5 ${
                  obtenida ? "border-primary/40" : "border-border"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={obtenida ? "" : "opacity-40 grayscale"}>
                    <Imagen
                      src={`/assets/insignia-${d.codigo}.svg`}
                      alt={d.nombre}
                      width={64}
                      height={64}
                      className="h-16 w-16"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-neutral">{d.nombre}</h3>
                      {obtenida ? (
                        <span className="rounded-sm bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                          Obtenida
                        </span>
                      ) : (
                        <Lock size={14} className="text-muted" />
                      )}
                    </div>
                    {d.descripcion && <p className="mt-1 text-sm text-muted">{d.descripcion}</p>}
                    {d.requisito && (
                      <p className="mt-2 text-xs text-secondary">Requisito: {d.requisito}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
