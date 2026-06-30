# rules/seguridad.md — Checklist de seguridad (obligatorio)

Todo cambio se revisa contra esta lista antes de marcarse "listo". El Revisor de
Seguridad la aplica; los builders la usan como guía mientras construyen.

## Secrets y configuración

- [ ] Ninguna clave secreta en el código ni en el repo. Solo variables de entorno.
- [ ] En el frontend solo se exponen `NEXT_PUBLIC_SUPABASE_URL` y
      `NEXT_PUBLIC_SUPABASE_ANON_KEY`. La `service_role` **nunca** llega al cliente.
- [ ] Client ID/Secret de GitHub OAuth viven en el panel de Supabase, no en el repo.
- [ ] `.env.local` está en `.gitignore`. Existe `.env.example` sin valores reales.

## Supabase / base de datos

- [ ] **RLS activado en todas las tablas.** Sin RLS = bug de seguridad.
- [ ] Políticas mínimas: un usuario solo lee/escribe lo que le corresponde
      (su perfil, sus equipos, las tareas de sus equipos). Catálogo de retos: lectura pública.
- [ ] Sin SQL construido por concatenación de strings — usar el cliente/consultas parametrizadas.
- [ ] Validación de inputs en servidor, no solo en el formulario.

## Autenticación (email + GitHub OAuth)

- [ ] La sesión se valida en el servidor (middleware) en rutas protegidas.
- [ ] La `callback` de OAuth solo acepta las redirect URLs registradas.
- [ ] Tokens de sesión nunca se loguean ni se exponen en la URL.
- [ ] Cerrar sesión invalida la sesión correctamente.

## Frontend

- [ ] Sin `dangerouslySetInnerHTML` con contenido del usuario (riesgo XSS).
- [ ] Datos del usuario escapados al renderizar.
- [ ] Sin información sensible en `localStorage`.
- [ ] Manejo de errores que no filtra detalles internos al usuario.

## Privacidad

- [ ] No se piden datos personales innecesarios para el MVP.
- [ ] Avatares/usuario de GitHub se usan solo para el perfil, no se redistribuyen.

## Resultado de la revisión

El Revisor de Seguridad responde con: **APROBADO** o **BLOQUEADO + lista de
hallazgos** (severidad: crítico / alto / medio / bajo). Crítico o alto bloquean el merge.
