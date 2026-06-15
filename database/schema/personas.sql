-- ============================================================
-- DIGIVER
-- PERSONAS DATABASE SCHEMA
-- ============================================================

create extension if not exists pgcrypto;

-- ============================================================
-- PERSONAS
-- ============================================================

create table if not exists public.personas (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        unique
        references auth.users(id)
        on delete cascade,

    name varchar(64) not null,

    slug varchar(64) not null unique,

    title varchar(128),

    bio text,

    avatar_url text,

    banner_url text,

    is_active boolean not null default true,

    is_public boolean not null default true,

    created_at timestamptz not null
        default timezone('utc', now()),

    updated_at timestamptz not null
        default timezone('utc', now()),

    constraint personas_name_length_check
        check (
            char_length(name) >= 2
            and char_length(name) <= 64
        ),

    constraint personas_slug_length_check
        check (
            char_length(slug) >= 3
            and char_length(slug) <= 64
        ),

    constraint personas_slug_format_check
        check (
            slug ~ '^[a-z0-9-]+$'
        ),

    constraint personas_bio_length_check
        check (
            bio is null
            or char_length(bio) <= 500
        )
);

-- ============================================================
-- UPDATED AT
-- ============================================================

create or replace function public.update_personas_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

drop trigger if exists personas_updated_at_trigger
on public.personas;

create trigger personas_updated_at_trigger
before update
on public.personas
for each row
execute function public.update_personas_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_personas_user_id
on public.personas(user_id);

create index if not exists idx_personas_slug
on public.personas(slug);

create index if not exists idx_personas_public
on public.personas(is_public);

create index if not exists idx_personas_created_at
on public.personas(created_at desc);

-- ============================================================
-- RLS
-- ============================================================

alter table public.personas
enable row level security;

drop policy if exists "personas_select_public"
on public.personas;

create policy "personas_select_public"
on public.personas
for select
using (
    is_public = true
    or auth.uid() = user_id
);

drop policy if exists "personas_insert_own"
on public.personas;

create policy "personas_insert_own"
on public.personas
for insert
with check (
    auth.uid() = user_id
);

drop policy if exists "personas_update_own"
on public.personas;

create policy "personas_update_own"
on public.personas
for update
using (
    auth.uid() = user_id
)
with check (
    auth.uid() = user_id
);

drop policy if exists "personas_delete_own"
on public.personas;

create policy "personas_delete_own"
on public.personas
for delete
using (
    auth.uid() = user_id
);

comment on table public.personas is
'Primary persona profile table.';