# Contratos de pantalla — T01 (Orquestador)

Alcance **congelado**: 7 pantallas. Nada nuevo sin quitar algo. Cada builder
implementa contra el contrato de su pantalla. "Criterio de listo" remite a
`rules/definicion-de-listo.md`. Todos los componentes salen de `rules/DESIGN.md`.

## Rutas

```
/                 Inicio
/login            Login
/auth/callback    Retorno de OAuth (no es pantalla; crea sesión)
/retos            Catálogo de retos
/retos/[id]       Detalle de reto
/equipos/[id]     Espacio del proyecto
/perfil           Perfil / portafolio
(overlay)         Modo guía (onboarding) sobre /retos en primera vez
```

## Modelo de datos (referencia)

```
profiles(id, nombre, carrera, ciclo, bio, avatar_url, github_username, github_url)
challenges(id, titulo, categoria, descripcion, dificultad, habilidades[], mentor, estado)
teams(id, challenge_id, nombre, creado_por, estado, repo_url)
team_members(id, team_id, profile_id, rol)
tasks(id, team_id, titulo, estado, responsable)
badges(id, profile_id, nombre, challenge_id, fecha)
```

---

## 1. Inicio — `/`  ·  Builder Frontend

- **Objetivo:** comunicar la propuesta de valor y llevar a registrarse / ver retos.
- **Lee:** conteo de `challenges` (opcional, para "X retos activos").
- **Escribe:** nada.
- **Navega hacia:** `/login`, `/retos`.
- **Componentes:** Navbar, Button (primary/ghost), Card, `<Imagen>` (hero-inicio).
- **Estados:** estático; si falla el conteo, ocultar el número (no romper).
- **Contenido:** copy real (retos reales de Lima; experiencia/portafolio). Sin emojis.
- **Listo:** responsive, usa tokens DESIGN.md, CTA navega bien.

## 2. Login — `/login`  ·  Builder Frontend (depende de Auth, T13)

- **Objetivo:** iniciar sesión con email o GitHub.
- **Lee:** sesión actual (si ya hay, redirige a `/retos`).
- **Escribe:** crea sesión; tras OAuth, **upsert** en `profiles`
  (`github_username`, `avatar_url`, `github_url`).
- **Navega hacia:** `/auth/callback` → `/retos`.
- **Componentes:** Card, Input, Button (primary), GithubButton.
- **Estados:** cargando (botón deshabilitado), error de auth (mensaje en `danger`).
- **Seguridad:** sin tokens en URL; callback solo a redirect URLs registradas.
- **Listo:** ambos métodos funcionan; perfil se crea/actualiza al entrar.

## 3. Catálogo de retos — `/retos`  ·  Builder Frontend (depende de T14)

- **Objetivo:** explorar retos reales agrupados por categoría.
- **Lee:** `challenges` (todos), con `titulo, categoria, dificultad, habilidades[]`.
- **Escribe:** nada.
- **Navega hacia:** `/retos/[id]`.
- **Componentes:** Navbar, RetoCard, Badge (dificultad), `<Imagen>` (íconos de categoría).
- **Estados:** cargando (skeletons), vacío (empty-retos + texto), error.
- **Layout:** grilla asimétrica, no 3 columnas iguales.
- **Listo:** lista real desde Supabase, filtrable por categoría, responsive.

## 4. Detalle de reto — `/retos/[id]`  ·  Builder Frontend (depende de T14)

- **Objetivo:** ver el reto y unirse o crear un equipo.
- **Lee:** `challenges` por id + `teams` de ese reto.
- **Escribe:** insert en `teams` (con `repo_url`) o insert en `team_members`.
- **Navega hacia:** `/equipos/[id]` tras unirse/crear.
- **Componentes:** Card, Badge, EquipoForm, Button (primary/ghost).
- **Estados:** cargando, error, sin equipos aún (mostrar CTA "crear equipo").
- **Reglas:** requiere sesión; si no hay, enviar a `/login`.
- **Listo:** unirse y crear equipo persisten en Supabase y redirigen bien.

## 5. Espacio del proyecto — `/equipos/[id]`  ·  Builder Frontend (depende de T14)

- **Objetivo:** trabajar el reto: tareas, avance y repo del equipo.
- **Lee:** `teams` por id + `tasks` del equipo + miembros.
- **Escribe:** update de `tasks` (estado), opcional set `repo_url`.
- **Navega hacia:** `/perfil`, `/retos`.
- **Componentes:** Card, TaskItem, Badge (estado), link a `repo_url` (GitHub).
- **Estados:** cargando, vacío (sin tareas → CTA), error.
- **Reglas:** solo miembros del equipo editan (validar con RLS).
- **Listo:** cambiar estado de tarea persiste; repo enlaza a GitHub.

## 6. Perfil / portafolio — `/perfil`  ·  Builder Frontend (depende de T14)

- **Objetivo:** mostrar experiencia ganada y proyectos (incluido Veyro).
- **Lee:** `profiles` + `team_members` (proyectos) + `badges`.
- **Escribe:** nada en el MVP (perfil de solo lectura).
- **Navega hacia:** `/retos`, `/equipos/[id]`.
- **Componentes:** Card, Badge, `<Imagen>` (avatar de GitHub o placeholder, proyecto-veyro).
- **Estados:** cargando, vacío (sin proyectos → empty-proyectos + CTA), error.
- **Contenido:** usuario de GitHub visible como credencial; Veyro como proyecto destacado.
- **Listo:** badges y proyectos reales; avatar de GitHub o placeholder.

## 7. Modo guía (onboarding) — overlay  ·  Onboarding & Narrativa

- **Objetivo:** narrar el ciclo a usuarios nuevos: bienvenida → elegir reto →
  unirse → ganar experiencia.
- **Lee:** sesión + si el usuario tiene proyectos (`team_members`).
- **Escribe:** marca "guía vista" (campo en `profiles` o flag de sesión).
- **Disparo:** usuario nuevo o sin proyectos → mostrar; con Veyro → no mostrar.
- **Componentes:** overlay (normal-flow), Card, Button, `<Imagen>` (tano-mascota).
- **Estados:** se puede saltar; no reaparece si ya se vio.
- **Listo:** secuencia completa, lógica de disparo correcta, no se repite.

---

## Gate por pantalla

Al terminar cada pantalla de la Fase 3, antes de mergear:
1. Revisor de Seguridad (T24 aplica su checklist al diff).
2. Revisor de Buenas Prácticas (T25 aplica el suyo).
3. Verificador (T26 recorre la pantalla).

Sin los tres en verde, no hay merge.
