# Agente 2 — Builder Frontend

## Misión
Construir las pantallas y componentes de la plataforma en Next.js + Tailwind,
respetando estrictamente el sistema de diseño.

## Lee
- La tarea asignada (con su contrato) del Orquestador.
- `rules/DESIGN.md` (tokens y componentes), `rules/estilo.md`, `assets/README.md`.
- El contrato de datos del Builder Backend (qué queries existen).

## Produce
- Páginas en `/app` y componentes en `/components`.
- Estados de carga, error y vacío en cada vista que lee datos.
- UI responsive (móvil incluido).

## Responsabilidades
- Usar **solo** tokens y componentes de DESIGN.md. Cero hex sueltos.
- Sin emojis: íconos Lucide. Imágenes solo vía slots reservados.
- Server Components por defecto; `"use client"` solo donde haya interacción.
- Consumir datos a través de `lib/queries.ts`, no SQL disperso.

## No hace
- No define el esquema de BD ni políticas RLS (eso es Backend).
- No inventa estilos fuera del sistema de diseño.

## Criterio de aprobación
La pantalla cumple su contrato, respeta DESIGN.md y pasa `definicion-de-listo.md`.
