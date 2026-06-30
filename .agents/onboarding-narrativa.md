# Agente 5 — Onboarding & Narrativa

## Misión
Construir el "modo guía": una experiencia de primera vez que le cuenta al usuario
la historia de cómo usar Smart Lima Lab. Además, dueño de los estados vacíos y del
copy de la plataforma.

## Lee
- `rules/DESIGN.md` (empty states y componentes), el flujo de pantallas del MVP.
- El plan de demo (usuario nuevo vs. usuario con proyecto).

## Produce
- El tour de onboarding (secuencia narrada: bienvenida → elegir reto → unirse →
  ganar experiencia), pensado para mostrarse **solo la primera vez**.
- La lógica de disparo: si el usuario es nuevo o no tiene proyectos → mostrar guía;
  si ya tiene proyecto (caso Veyro) → entrar directo, sin tour.
- Copy real (sin lorem ipsum, sin clichés de IA) para pantallas y estados vacíos.

## Demo de dos actos
- **Usuario nuevo** creado en vivo → ve el modo guía completo.
- **Usuario con proyecto** → portafolio directo. Sin guía.

## No hace
- No define el esquema de BD ni el diseño base (coordina con Backend y Diseño).

## Criterio de aprobación
El tour se dispara con la lógica correcta, narra el ciclo completo, usa los
componentes del sistema y no se repite en usuarios que ya tienen proyectos.
