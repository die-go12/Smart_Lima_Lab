# assets/ — Manifiesto de imágenes (slots reservados)

Regla base (de `rules/DESIGN.md`): **nunca usar emojis como logos o íconos de
contenido**. Cada imagen real ocupa un *slot* con dimensiones fijas. Mientras no
exista la imagen, se muestra un placeholder de esas mismas medidas, así el layout
nunca se rompe. El componente `<Imagen>` redimensiona y optimiza al encajar.

## Cómo subir tus imágenes
1. Guarda el archivo en `public/assets/` con el **nombre exacto** del slot.
2. Respeta las dimensiones (o una proporción igual; el componente reescala).
3. Formato preferido: SVG para logos/íconos, WebP o PNG para fotos.

## Slots reservados

| Slot (nombre de archivo) | Dimensiones | Uso |
|--------------------------|-------------|-----|
| `logo-principal.svg` | 240×64 | Logo de Smart Lima Lab (navbar, footer) |
| `logo-icono.svg` | 64×64 | Versión compacta (favicon, móvil) |
| `tano-mascota.png` | 320×320 | Mascota Tano (onboarding, estados vacíos) |
| `hero-inicio.webp` | 1200×630 | Imagen principal de la pantalla de inicio |
| `og-share.webp` | 1200×630 | Imagen para compartir (Open Graph) |
| `reto-movilidad.svg` | 80×80 | Ícono categoría Movilidad |
| `reto-salud.svg` | 80×80 | Ícono categoría Salud |
| `reto-seguridad.svg` | 80×80 | Ícono categoría Seguridad |
| `reto-ambiente.svg` | 80×80 | Ícono categoría Medio ambiente |
| `proyecto-veyro.webp` | 800×500 | Captura del proyecto Veyro (portafolio) |
| `avatar-placeholder.svg` | 96×96 | Avatar por defecto (si no hay foto de GitHub) |
| `empty-retos.svg` | 240×180 | Ilustración de estado vacío (sin retos) |
| `empty-proyectos.svg` | 240×180 | Ilustración de estado vacío (sin proyectos) |

## Notas
- Los íconos de UI (botones, navegación) **no** son assets: usan Lucide.
- Estos slots son solo para logos, mascota, fotos e ilustraciones de contenido.
- El avatar real del usuario viene de GitHub; `avatar-placeholder.svg` es el respaldo.

## Slots de insignias (v2)

Carpeta: `public/assets/`. Una imagen por código (96×96, SVG preferido). Mientras
no existan, se muestra un placeholder.

| Slot | Insignia |
|------|----------|
| `insignia-primer_paso.svg` | Primer paso |
| `insignia-constructor.svg` | Constructor |
| `insignia-veterano.svg` | Veterano |
| `insignia-todoterreno.svg` | Todoterreno |
| `insignia-capitan.svg` | Capitán |
| `insignia-visionario.svg` | Visionario |
| `insignia-mentor_novato.svg` | Mentor novato |
| `insignia-mentoria.svg` | Mentoría |
| `insignia-lider.svg` | Líder |
| `insignia-interdisciplinario.svg` | Interdisciplinario |
