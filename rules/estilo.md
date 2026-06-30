# rules/estilo.md — Convenciones de código y trabajo

## Lenguaje y stack

- Next.js (App Router) + React + TypeScript.
- Tailwind CSS, con el tema generado desde `rules/DESIGN.md` (no colores sueltos).
- Supabase JS para datos y auth.
- Todo el texto de la UI en **español**.

## Estructura

```
/app          rutas y páginas (App Router)
/components    componentes reutilizables (PascalCase: RetoCard.tsx)
/lib          supabase/ (client.ts, server.ts), queries.ts
/public/assets imágenes reales (ver assets/README.md)
```

- Componentes pequeños y reutilizables. Si un bloque se repite, se extrae.
- Server Components por defecto; `"use client"` solo cuando hace falta interacción.
- Funciones de datos centralizadas en `lib/queries.ts`, no SQL disperso en páginas.

## Nombres

- Componentes y archivos de componente: PascalCase.
- Variables y funciones: camelCase, descriptivas (`equiposDelReto`, no `data2`).
- Sin abreviaturas crípticas. Sin código muerto ni `console.log` olvidados.

## Diseño (resumen — la fuente es rules/DESIGN.md)

- Solo tokens del DESIGN.md. Nada de hex sueltos en componentes.
- Cero emojis (caracteres Unicode pictográficos) en código, copy ni datos.
  Íconos solo vía Lucide importado. Se valida con `npm run check:emojis`.
- Estética flat: sin glow ni gradientes llamativos.

## Git y commits

- Ramas por trabajo: `feat/catalogo`, `feat/auth-github`, `fix/...`.
- Frontend y backend en ramas/worktrees separados para trabajar en paralelo.
- Commits pequeños y descriptivos en imperativo: `agrega catálogo de retos`.
- No se mergea a `main` sin pasar Seguridad + Buenas Prácticas + Verificador.

## TypeScript

- Tipar props y respuestas de Supabase. Evitar `any`.
- Manejar estados de carga, error y vacío en cada vista que lee datos.

## Accesibilidad (mínimos)

- Contraste según DESIGN.md (validado con el lint de DESIGN.md).
- Imágenes con `alt`. Botones e inputs con label accesible.
- Foco visible (anillo cian). Navegable con teclado.
