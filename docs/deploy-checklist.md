# Checklist de deploy — Smart Lima Lab

## 0. Verifica local
```
npm run build
```
Debe terminar sin errores. Si falla, copia el error y lo resolvemos.

## 1. Sube el código a GitHub
Desde la carpeta del proyecto (Git Bash o terminal):
```
git init
git add .
git commit -m "Smart Lima Lab MVP"
git branch -M main
```
Crea un repositorio vacío en github.com (sin README) y luego:
```
git remote add origin https://github.com/TU_USUARIO/smart-lima-lab.git
git push -u origin main
```
> El `.gitignore` ya evita subir `.env.local` y `node_modules`.

## 2. Importa en Vercel
1. Entra a vercel.com → New Project → importa el repo.
2. Framework: Next.js (lo detecta solo).
3. **Environment Variables** (Settings → Environment Variables), agrega:
   - `NEXT_PUBLIC_SUPABASE_URL` = https://aohacnhglroabqqpdqfn.supabase.co
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = sb_publishable_8t7VLdLAxVA8V4rpSVdKdQ_r4Ctc4bJ
4. Deploy. Te da una URL tipo `https://smart-lima-lab.vercel.app`.

## 3. Conecta la URL de Vercel con el login
1. **Supabase** → Authentication → URL Configuration:
   - Agrega a Redirect URLs: `https://TU-PROYECTO.vercel.app/**`
   - (Opcional) Site URL: tu URL de Vercel.
2. **GitHub OAuth App** (la que creaste): en Homepage URL puedes poner la URL de Vercel.
   El Authorization callback URL se queda igual (apunta a Supabase).

## 4. Datos demo
- Corre `supabase/seed-demo-v2.sql` (cambia tu email) → te vuelve mentor + deja una
  propuesta pendiente y una convocatoria de ejemplo.
- (Opcional) `supabase/seed-demo-user.sql` para el usuario "con proyecto" (Veyro).

## 5. Prueba final en el link público
- Entra con GitHub, recorre: retos → unirte/crear equipo → tareas → completar →
  ver insignia en el perfil → proponer reto → aprobarlo en /revision → convocatoria → postular.
- Demo de dos actos: usuario nuevo (ve la guía) y usuario con proyecto (entra directo).
