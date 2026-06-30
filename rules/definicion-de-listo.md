# rules/definicion-de-listo.md — Definición de "listo" (Definition of Done)

Una pantalla o función está **lista** solo cuando cumple TODO esto:

## Funcional

- [ ] Cumple su contrato: lee lo que debe leer y escribe lo que debe escribir.
- [ ] Navega correctamente (botones de avanzar/volver, sin callejones sin salida).
- [ ] Maneja los tres estados: cargando, error y vacío.
- [ ] Los datos vienen de Supabase (o de datos semilla), no quemados en el JSX
      salvo que sea contenido estático de marketing.

## Diseño

- [ ] Usa solo tokens y componentes de `rules/DESIGN.md`.
- [ ] Sin emojis; imágenes vía slots reservados (`assets/README.md`).
- [ ] Responsive: se ve bien en móvil (<768px) sin overflow horizontal.

## Seguridad

- [ ] Pasó el checklist de `rules/seguridad.md` (sin hallazgos críticos/altos).

## Calidad

- [ ] Pasó la revisión de `rules/estilo.md` (estructura, nombres, tipos).
- [ ] Sin código muerto ni logs de depuración.

## Verificación

- [ ] El Verificador recorrió el flujo de la pantalla de punta a punta.
- [ ] Build de Next.js sin errores (`next build`).

## Contrato de cada tarea (lo define el Orquestador)

Cada tarea entregada a un builder incluye:

```
Pantalla:        <nombre>
Lee:             <tablas/queries>
Escribe:         <inserts/updates>
Navega hacia:    <rutas>
Componentes:     <de DESIGN.md>
Criterio listo:  <esta checklist>
```
