---
version: "alpha"
name: "Smart Lima Lab"
description: "Plataforma donde estudiantes de Ingeniería resuelven retos reales de Lima y ganan experiencia. Estética tech sobria: oscura, flat, con un acento verde de datos usado con disciplina."
colors:
  primary: "#39FF88"
  on-primary: "#06121F"
  secondary: "#2FE0E0"
  on-secondary: "#06121F"
  background: "#0A1428"
  surface: "#0F1E38"
  surface-2: "#16294A"
  neutral: "#E6EEF7"
  muted: "#9DB8D4"
  border: "#24385C"
  success: "#3DDC84"
  danger: "#FF6B6B"
  warning: "#FFC857"
typography:
  h1:
    fontFamily: Space Grotesk
    fontSize: 2.5rem
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  h2:
    fontFamily: Space Grotesk
    fontSize: 1.75rem
    fontWeight: 600
  h3:
    fontFamily: Space Grotesk
    fontSize: 1.25rem
    fontWeight: 500
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 0.8rem
    fontWeight: 500
    letterSpacing: 0.04em
  mono:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
rounded:
  sm: 6px
  md: 10px
  lg: 16px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "#2BE078"
    textColor: "{colors.on-primary}"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 12px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-hover:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.neutral}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.md}"
    padding: 10px
  input-focus:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.neutral}"
  nav:
    backgroundColor: "{colors.background}"
    textColor: "{colors.neutral}"
  badge:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
  badge-muted:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
---

## Overview

Smart Lima Lab combina rigor de ingeniería con una estética de "sala de datos
urbanos": superficies oscuras y planas, jerarquía tipográfica fuerte y un único
acento verde que guía la acción. La sensación objetivo es la de una herramienta
profesional confiable, no la de una demo autogenerada.

- Density: 5/10 — Equilibrada
- Variance: 4/10 — Sobria
- Motion: 3/10 — Discreta
- **Style:** Tech, sobrio, flat, orientado a datos
- **Keywords:** ciudad inteligente, datos urbanos, retos reales, portafolio, experiencia
- **Light/Dark:** ✗ No / ✓ Full (solo modo oscuro)

## Colors

Paleta de alto contraste sobre fondo oscuro, con un solo acento de acción.

- **Verde-datos (#39FF88):** único color de acción — botones primarios, estados
  activos, insignias. Se usa con moderación; nunca como fondo de página.
- **Cian (#2FE0E0):** foco, links y detalles "tecnológicos" (gráficos, métricas).
- **Azul casi negro (#0A1428):** fondo base de toda la app.
- **Surface (#0F1E38) / Surface-2 (#16294A):** paneles, cards y capas elevadas.
- **Neutral (#E6EEF7):** texto principal. **Muted (#9DB8D4):** metadatos y captions.
- **Semánticos:** success #3DDC84, danger #FF6B6B, warning #FFC857.

## Typography

- **Display / Títulos:** Space Grotesk — geométrica y moderna, con tracking
  ajustado. Da carácter sin caer en lo "gamer". (Se evita Orbitron a propósito.)
- **Cuerpo / UI:** Inter — 16px, line-height 1.6, máx. ~72 caracteres por línea.
- **Etiquetas / Captions:** Space Grotesk, ligeramente espaciada.
- **Monoespaciada:** JetBrains Mono — para código, usuarios de GitHub y valores
  técnicos (refuerza el público de Informática).

Escala: Hero clamp(2.5rem, 5vw, 3.5rem) · H1 2.5rem · H2 1.75rem · Body 1rem/1.6.

## Layout

- **Grid:** CSS Grid. Contenedor máx. 1200px centrado, padding lateral 1.5rem.
- **Ritmo de espaciado:** base 8px (escala xs–xl). Nada de valores arbitrarios.
- **Gaps de sección:** clamp(3rem, 6vw, 6rem).
- **Secciones:** composición asimétrica; cards de tamaños variados. Prohibido el
  patrón de 3 columnas iguales.
- **Mobile:** todo colapsa bajo 768px, sin overflow horizontal. Usar min-h-[100dvh].
- **z-index:** base 0 · nav-sticky 100 · overlay 200 · modal 300 · toast 500.

## Elevation & Depth

Profundidad por capas de color (background → surface → surface-2), no por glow.

- **Sombras:** sutiles (0 2px 12px rgba(0,0,0,0.25)). Sin glows ni neones difusos.
- **Animaciones:** solo transform y opacity. Entrada fade + translate-Y (16px→0)
  en 300ms ease-out; listas con stagger de 80ms.
- **Hover:** cambio de surface + ligero ajuste de sombra (200ms). Sin saltos.

## Shapes

Esquinas suaves y consistentes: sm 6px (badges/inputs), md 10px (botones),
lg 16px (cards). Bordes de 1px en `border`. Sin biselados ni formas decorativas.

## Components

- **Botón primario:** fill verde-datos, texto oscuro, rounded md. Hover: verde
  un 8% más oscuro. Active: -1px de translate. Peso 600. Sin glow externo.
- **Botón ghost:** surface con texto verde y borde 1.5px. Hover: surface-2.
- **Cards:** surface, rounded lg, borde 1px, sombra sutil. Hover: surface-2.
- **Inputs:** label arriba, borde 1px. Focus: anillo 2px cian con offset. Error
  en danger debajo. Sin floating labels.
- **Navegación:** fondo background; ítem activo con indicador verde, peso 500.
- **Skeletons:** shimmer del tamaño del componente. Sin spinners circulares.
- **Empty states:** composición con imagen/ícono reservado + texto + acción.
  Aquí vive el "modo guía" para usuarios nuevos.

## Do's and Don'ts

- **Cero emojis, sin excepción.** Prohibido cualquier carácter emoji o
  pictográfico Unicode (rangos U+1F000–U+1FAFF, U+2600–U+27BF, dingbats,
  símbolos misceláneos) en UI, copy, labels Y datos semilla. Los íconos van
  **solo** mediante el componente Lucide importado (SVG), nunca como carácter.
  Esta regla se valida automáticamente (ver `scripts/check-emojis.sh`).
- Sin emojis como reemplazo de logos: usar **slots de imagen reservados** con
  dimensiones fijas (logo 240×64, hero 1200×630, ícono de reto 80×80…). Mientras
  no se suba la imagen real, mostrar un placeholder de esas mismas medidas; el
  componente redimensiona/optimiza al encajar.
- Sin blanco puro (#FFFFFF): el fondo siempre es oscuro.
- El verde-datos solo para acción/acento, nunca como fondo de página.
- Sin glow, gradientes llamativos ni partículas — estética flat.
- Sin clichés de IA: "Elevate", "Seamless", "Unleash", "Next-Gen".
- Sin lorem ipsum en demos: usar copy real de retos de Lima.
- Sin layouts de 3 columnas iguales — usar grilla asimétrica.
- Sin h-screen — usar min-h-[100dvh].

## Use Case

App web de la plataforma Smart Lima Lab: inicio, catálogo de retos, detalle de
reto, espacio de proyecto, perfil/portafolio y modo guía de onboarding.
