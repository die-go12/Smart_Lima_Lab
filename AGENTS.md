# AGENTS.md — Arquitectura de agentes de Smart Lima Lab

Índice operativo del proyecto. Define **qué hace cada agente, qué lee, qué
produce y su criterio de aprobación**. Todo agente, antes de trabajar, lee las
reglas obligatorias de `rules/`.

## Proyecto

Smart Lima Lab es una plataforma web donde estudiantes de Ingeniería Informática
se unen a **retos reales de Lima**, forman equipos, construyen soluciones y ganan
**experiencia y portafolio**. Veyro (movilidad urbana) es un proyecto-ejemplo ya
terminado que vive dentro de la plataforma.

- **Stack:** Next.js (App Router) + Tailwind CSS → Vercel.
- **Backend/BD:** Supabase (Postgres + Auth email y GitHub OAuth + Storage).
- **Entregable:** MVP navegable con link público, antes del 1 de julio 14:59.

## Reglas obligatorias (leer siempre, en este orden)

1. `rules/DESIGN.md` — sistema de diseño. Fuente única de verdad visual.
2. `rules/seguridad.md` — checklist de seguridad obligatorio.
3. `rules/estilo.md` — convenciones de código, estructura y commits.
4. `rules/definicion-de-listo.md` — qué significa que una pantalla esté "lista".
5. `assets/README.md` — slots de imagen reservados (nunca emojis como logos).

## Los 8 agentes

| # | Agente | Archivo | Misión en una línea |
|---|--------|---------|---------------------|
| 1 | Orquestador / Planner | `.agents/orquestador.md` | Descompone, asigna y mantiene el estado |
| 2 | Builder Frontend | `.agents/builder-frontend.md` | Construye pantallas y componentes |
| 3 | Builder Backend | `.agents/builder-backend.md` | Esquema, RLS, Auth GitHub, queries |
| 4 | Diseño & Assets | `.agents/diseno-assets.md` | Dueño de DESIGN.md, componentes e imágenes |
| 5 | Onboarding & Narrativa | `.agents/onboarding-narrativa.md` | Modo guía, estados vacíos, copy |
| 6 | Revisor de Seguridad | `.agents/revisor-seguridad.md` | Vulnerabilidades y datos sensibles |
| 7 | Revisor de Buenas Prácticas | `.agents/revisor-buenas-practicas.md` | Calidad, convenciones, accesibilidad |
| 8 | Verificador / QA | `.agents/verificador.md` | Valida el flujo end-to-end |

## Flujo de trabajo (pipeline)

```
Orquestador reparte (1 pantalla = 1 tarea con criterio de listo)
        │
  ┌─────┴─────┐
Frontend    Backend          ← construyen en paralelo (ramas/worktrees distintos)
  │            │                Diseño & Assets y Onboarding asisten a Frontend
  └─────┬──────┘
   pantalla terminada
        │
  ┌─────┴─────┐
Seguridad   Buenas prácticas  ← revisan EN PARALELO mientras los builders
  │            │                avanzan la siguiente pantalla
  └─────┬──────┘
   Verificador (QA) → ✓ listo → merge
```

Regla de oro: **una pantalla = una tarea** con su contrato explícito (qué lee,
qué escribe, a dónde navega, criterio de aprobación). Nada se marca "listo" sin
pasar por los dos revisores y el verificador.

## Pantallas del MVP

1. Inicio — propuesta de valor.
2. Login — email + GitHub OAuth.
3. Catálogo de retos.
4. Detalle de reto — unirse / crear equipo.
5. Espacio del proyecto — tareas, avance, repo.
6. Perfil / portafolio — badges + GitHub (aquí aparece Veyro).
7. Modo guía (onboarding) — solo primera vez / usuario sin proyectos.

## Datos semilla para la demo

- **Usuario nuevo** (creado en vivo) → sin proyectos → se dispara el modo guía.
- **Usuario con proyecto** (Veyro terminado) → entra directo al portafolio, sin tour.

## Principios heredados de prácticas de harness (ECC), reescritos como reglas propias

- **search-first:** investigar antes de codear; no inventar APIs.
- **verification-loop:** todo cambio pasa por un check antes de cerrarse.
- **revisión separada:** seguridad y calidad son agentes distintos, no el builder.
- **contexto mínimo por agente:** cada agente recibe solo lo que necesita.

No se instala ECC ni sus skills; solo se replican estos patrones aquí.
