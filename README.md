# PetAdopt

Plataforma que conecta **refugios de animales** con **familias adoptantes**. Los refugios publican
mascotas disponibles y los adoptantes pueden explorarlas, filtrarlas y enviar solicitudes de adopción.

🔗 Demo en vivo: `https://tu-proyecto.vercel.app` (actualizar después del deploy en Vercel)

🎥 Video de defensa: `https://youtu.be/TU-VIDEO` (subir a YouTube como "no listado" o a Google Drive)

## Capturas de pantalla

_Agregar aquí al menos 3 capturas una vez la app esté corriendo: home (`/`), listado de mascotas
(`/mascotas`) y el dashboard (`/dashboard`) mostrando ambos roles._

| Home | Listado de mascotas | Dashboard |
|---|---|---|
| _captura1.png_ | _captura2.png_ | _captura3.png_ |




## Stack tecnológico

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth, con Row Level Security)
- Dog CEO API (API externa pública, consumida con `fetch`/`async-await`)
- Vercel (deploy)

## Roles de usuario

- **Adoptante**: explora el catálogo público de mascotas, filtra por especie o nombre, y envía
  solicitudes de adopción con un mensaje.
- **Refugio**: publica mascotas (crear), edita o elimina las suyas, y revisa/gestiona las
  solicitudes de adopción recibidas (aceptar/rechazar).

## Modelo de datos

Tres tablas relacionadas en Supabase (ver `supabase/schema.sql`):

- **perfiles** — extiende `auth.users` con `nombre` y `rol` (`adoptante` | `refugio`).
- **mascotas** — recurso principal. `refugio_id` referencia a `perfiles.id` (relación uno-a-muchos:
  un refugio tiene muchas mascotas).
- **solicitudes_adopcion** — referencia a `mascotas.id` y `perfiles.id` (relación uno-a-muchos:
  una mascota puede tener muchas solicitudes).

Row Level Security (RLS) está activado en las tres tablas; las políticas garantizan que cada
usuario solo pueda crear/editar/eliminar lo que le corresponde según su rol.

## Instalación local

1. **Crear el proyecto en Supabase**: entra a [supabase.com](https://supabase.com) → *New project*
   → espera a que termine de aprovisionarse.
2. **Crear el esquema**: abre *SQL Editor* → *New query*, pega todo el contenido de
   `supabase/schema.sql` y ejecútalo. Esto crea las 3 tablas, el trigger que crea el perfil
   automáticamente al registrarse, y las políticas de Row Level Security.
3. **Copiar las claves**: en *Project Settings → API*, copia `Project URL` y `anon public key`.
4. **Clonar y correr el proyecto**:

```bash
git clone https://github.com/tu-usuario/petadopt.git
cd petadopt
npm install
cp .env.example .env.local   # pega aquí la URL y la anon key de Supabase
npm run dev
```

5. Abre `http://localhost:3000`, regístrate como **refugio** y como **adoptante** (dos cuentas
   distintas) para probar ambos roles.

## Variables de entorno

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública (anon) de Supabase |

## Credenciales de prueba

_Crear dos cuentas de prueba (una por rol) desde `/register` y anotarlas aquí, por ejemplo:_

- Adoptante: `adoptante@ejemplo.com` / `contraseña123`
- Refugio: `refugio@ejemplo.com` / `contraseña123`

## Funcionalidades — checklist

- [x] Next.js 14 + App Router + TypeScript + Tailwind
- [x] Autenticación con Supabase (registro, login, logout)
- [x] Rutas protegidas con middleware (`/dashboard/*`)
- [x] 2 rutas públicas (`/`, `/mascotas`) y 1 ruta dinámica pública (`/mascotas/[id]`)
- [x] 2 roles con permisos distintos (adoptante / refugio)
- [x] Base de datos relacional con 3 tablas + RLS
- [x] CRUD completo sobre mascotas (crear, leer, actualizar, eliminar)
- [x] Buscador/filtro con `useState` (`BuscadorMascotas`)
- [x] Consumo de API externa (Dog CEO API) con `fetch` + `async/await` y manejo de errores
- [x] `.env.local` fuera del repositorio (`.gitignore`)
## AUTOR

Víctor Constante
Repositorio:https://github.com/victcons-debug/petadop
