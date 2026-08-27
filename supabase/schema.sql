-- =========================================================
-- PetAdopt - Esquema de base de datos para Supabase (PostgreSQL)
-- Ejecutar en: Supabase Dashboard -> SQL Editor -> New query
-- =========================================================

-- 1) PERFILES: extiende auth.users con nombre y rol
create table if not exists public.perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  rol text not null check (rol in ('adoptante', 'refugio')),
  created_at timestamp with time zone default now()
);

-- 2) MASCOTAS: recurso principal, publicado por un refugio (uno-a-muchos: refugio -> mascotas)
create table if not exists public.mascotas (
  id uuid primary key default gen_random_uuid(),
  refugio_id uuid not null references public.perfiles(id) on delete cascade,
  nombre text not null,
  especie text not null check (especie in ('perro', 'gato', 'otro')),
  raza text,
  edad_meses int,
  descripcion text not null,
  imagen_url text,
  estado text not null default 'disponible' check (estado in ('disponible', 'en_proceso', 'adoptado')),
  created_at timestamp with time zone default now()
);

-- 3) SOLICITUDES_ADOPCION: relaciona adoptante <-> mascota (uno-a-muchos: mascota -> solicitudes)
create table if not exists public.solicitudes_adopcion (
  id uuid primary key default gen_random_uuid(),
  mascota_id uuid not null references public.mascotas(id) on delete cascade,
  adoptante_id uuid not null references public.perfiles(id) on delete cascade,
  mensaje text not null,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aceptada', 'rechazada')),
  created_at timestamp with time zone default now()
);

-- =========================================================
-- Trigger: crea automáticamente un perfil cuando alguien se registra
-- (el rol viaja en el metadata que se manda desde el formulario de registro)
-- =========================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.perfiles (id, nombre, rol)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', 'Usuario'),
    coalesce(new.raw_user_meta_data->>'rol', 'adoptante')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
alter table public.perfiles enable row level security;
alter table public.mascotas enable row level security;
alter table public.solicitudes_adopcion enable row level security;

-- PERFILES: cualquiera autenticado puede leer perfiles (para mostrar nombre del refugio),
-- pero cada quien solo puede editar su propio perfil.
create policy "Perfiles: lectura publica" on public.perfiles
  for select using (true);

create policy "Perfiles: solo el dueño edita" on public.perfiles
  for update using (auth.uid() = id);

-- MASCOTAS: cualquiera (incluso sin sesión) puede leer el listado y el detalle.
create policy "Mascotas: lectura publica" on public.mascotas
  for select using (true);

-- Solo un usuario con rol 'refugio' puede crear mascotas, y siempre a su propio nombre.
create policy "Mascotas: crear solo refugios" on public.mascotas
  for insert with check (
    auth.uid() = refugio_id
    and exists (select 1 from public.perfiles where id = auth.uid() and rol = 'refugio')
  );

-- Solo el refugio dueño del registro puede actualizarlo o eliminarlo.
create policy "Mascotas: editar solo el dueño" on public.mascotas
  for update using (auth.uid() = refugio_id);

create policy "Mascotas: eliminar solo el dueño" on public.mascotas
  for delete using (auth.uid() = refugio_id);

-- SOLICITUDES_ADOPCION: un adoptante ve y crea sus propias solicitudes;
-- el refugio dueño de la mascota también puede verlas y actualizarlas (aceptar/rechazar).
create policy "Solicitudes: el adoptante ve las suyas" on public.solicitudes_adopcion
  for select using (
    auth.uid() = adoptante_id
    or auth.uid() = (select refugio_id from public.mascotas where id = mascota_id)
  );

create policy "Solicitudes: crear solo adoptantes autenticados" on public.solicitudes_adopcion
  for insert with check (
    auth.uid() = adoptante_id
    and exists (select 1 from public.perfiles where id = auth.uid() and rol = 'adoptante')
  );

create policy "Solicitudes: el refugio dueño actualiza el estado" on public.solicitudes_adopcion
  for update using (
    auth.uid() = (select refugio_id from public.mascotas where id = mascota_id)
  );
