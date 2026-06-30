# Smart Lima Lab — Roadmap y guía de pitch

Documento vivo. Captura la visión, lo construido, lo que falta y los ángulos de
presentación. Fecha objetivo del Proyecto Final: **miércoles 1 de julio, 14:59**.

---

## 1. Visión

Smart Lima Lab es una plataforma donde estudiantes de Ingeniería resuelven
**retos reales** y construyen **experiencia y portafolio** verificable. El ciclo
se sostiene solo:

> proponer → resolver → ganar experiencia → convertirse en mentor → guiar a otros

No es una lista de proyectos: es un **ecosistema de aprendizaje guiado** que
convierte la capacidad de investigar y resolver problemas en práctica continua.

---

## 2. Estado actual — MVP v1 (CONSTRUIDO y funcionando)

Stack: Next.js 16 (App Router) + Tailwind v4 en Vercel · Supabase (Postgres +
Auth email y GitHub OAuth + RLS).

Pantallas y features ya listas:

- Inicio con propuesta de valor (slot de mascota Tano).
- Login con **GitHub OAuth** + correo (enlace mágico).
- Catálogo de retos con filtro por categoría.
- Detalle de reto: unirse / crear equipo (con repo de GitHub).
- Espacio de proyecto: tareas, avance, miembros, repo.
- Perfil / portafolio: insignias, proyectos, GitHub, cerrar sesión.
- Modo guía de onboarding (Tano) con lógica de "primera vez".
- Sistema de diseño propio (DESIGN.md), anti-emojis automatizado, RLS auditado.

---

## 3. MVP v2 — Alcance a construir antes del 1 de julio

Orden de construcción (cada paso deja algo demostrable):

1. **Perfil editable** — nombre visible, carrera, ciclo, bio. Resuelve que se
   muestre el correo; se prioriza nombre elegido → usuario GitHub → "Estudiante".
2. **Completar reto → insignia** — botón en el espacio de proyecto que marca el
   reto como completado y otorga la insignia correspondiente (cierra el "ganar
   experiencia").
3. **Proponer reto** — formulario para estudiantes; entra como `pendiente`.
4. **Rol mentor + vista de revisión** — el mentor aprueba propuestas y añade la
   **guía técnica** (herramientas, frameworks, arquitectura recomendada).
5. **Auto-promoción a mentor** — al completar N proyectos (sugerido: 2), el
   estudiante sube a mentor + insignia "Mentor novato".
6. **Catálogo de insignias** (`/insignias`) — tabla `badge_defs` + vista pública
   con requisitos y estado (desbloqueada / bloqueada).

### Sistema de insignias

| Insignia | Requisito | Tipo |
|---|---|---|
| Primer paso | Completar onboarding / unirse al primer equipo | Inicio |
| Constructor | Completar tu primer reto | Logro |
| Veterano | Completar 3 retos | Logro |
| Todoterreno | Completar retos de 2+ categorías | Logro |
| Capitán | Crear un equipo (ser líder) | Colaboración |
| Visionario | Proponer un reto aprobado | Contribución |
| Mentor novato | Alcanzar el rol de mentor (2 proyectos) | Mentoría |
| Mentoría | Guiar/aprobar tu primer reto como mentor | Mentoría |
| Líder | Mentorear 3+ grupos | Liderazgo |
| Especialista | Completar un reto de una categoría dada | Temática |

Reglas: el **rol mentor** se gana al completar 2 proyectos; la insignia
**Líder** se gana ejerciendo (mentorear 3+ grupos), no solo por el rol.

### Roles
Un solo sistema de perfiles con campo `rol` (`estudiante` | `mentor`). El mentor
ve de más: enlace "Revisión" y la pantalla `/revision`. El rol no se autoasigna
salvo por la auto-promoción; verificación oficial queda como roadmap.

### Cambios de datos para v2
- `profiles`: `rol`, (nombre editable ya existe).
- `challenges`: `propuesto_por`, `estado_revision` (pendiente/aprobado/rechazado),
  `guia_tecnica`, y tags opcionales `interdisciplinario` y `origen`
  (reto_lima / proyecto_curso).
- `badge_defs`: definiciones de insignias (código, nombre, descripción, requisito).

---

## 4. Roadmap futuro (visión — slides, no se construye ahora)

Continuidad y colaboración:
- **Rescate de proyectos de curso:** subir un proyecto propio que normalmente
  moriría al acabar el ciclo y darle continuidad en la plataforma.
- **Convocatorias interdisciplinarias:** un proyecto marcado interdisciplinario
  lanza llamados a estudiantes de otras especialidades (salud + tecnología, etc.).
- **Insignias validadas** por la universidad u otro ente → valor real de CV más
  allá de aprobar el curso.

Producto:
- Tiempo real (Supabase Realtime) en tareas.
- Chat / comentarios por equipo.
- Ranking / leaderboard y certificados al completar retos.
- Integración con GitHub (commits y actividad del repo).
- Panel admin para coordinadores (publicar retos, verificar mentores).
- La app de ambulancias como otro reto resuelto dentro de la plataforma.

---

## 5. Ángulos de pitch

1. **Cayetano líder en investigación y resolución de problemas:** la plataforma
   institucionaliza ese ADN y lo vuelve práctica continua de los estudiantes;
   deja un portafolio vivo de soluciones con sello Cayetano. (Usar "refuerza/
   potencia", no "garantiza"; la validación oficial es alianza futura.)
2. **Fin del desperdicio:** los proyectos de curso mueren al acabar el ciclo;
   Smart Lima Lab les da continuidad y colaboración multidisciplinaria.
3. **Forma a sus propios mentores:** el ciclo se autosostiene; los mejores
   estudiantes guían a los siguientes y ganan liderazgo verificable.
4. **Desarrollo profesional real:** experiencia, portafolio, trabajo en equipo y
   guía técnica — exactamente lo que el mercado y el curso valoran.

Estructura sugerida del Elevator Pitch (≤5 min): problema (1) → solución (1) →
demo del MVP en vivo, los dos actos (2) → impacto y visión Cayetano (1).

---

## 6. Cronograma a la entrega (lun 29 → mié 1 jul)

- **Lunes:** construir v2 — perfil editable, completar reto → insignia, catálogo
  de insignias; empezar proponer reto + rol mentor.
- **Martes:** terminar mentores + revisión con guía técnica + auto-promoción;
  auditorías (seguridad/buenas prácticas) y `npm run build` limpio; **deploy en
  Vercel** con datos demo y usuario "con proyecto".
- **Miércoles AM:** ensayar el Elevator Pitch, preparar slides (con los ángulos
  de la sección 5), revisar el flujo en el link público.
- **Miércoles 14:59:** enviar presentación + link al MVP por Blackboard.

---

## 7. Definición de "completo" para la entrega
- Las 7 pantallas v1 + el ciclo v2 (proponer, mentor, completar, insignias)
  funcionando en el link público.
- Demo de dos actos: usuario nuevo (ve guía) y usuario con proyecto (Veyro).
- Citas de herramientas en formato IEEE en la presentación.
- Pitch ensayado en ≤5 minutos.
