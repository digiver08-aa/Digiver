-- ============================================================
-- DIGIVER
-- PHASE 6 — CIRCLE SYSTEM
-- circles.sql
-- ============================================================

create extension if not exists pgcrypto;

-- ============================================================
-- CIRCLES
-- ============================================================

create table if not exists public.circles (
    id uuid primary key
        default gen_random_uuid(),

    owner_persona_id uuid not null,

    name varchar(100) not null,

    slug varchar(100) not null,

    description text,

    avatar_url text,

    banner_url text,

    created_at timestamptz not null
        default timezone('utc', now()),

    updated_at timestamptz not null
        default timezone('utc', now()),

    constraint circles_owner_persona_fk
        foreign key (owner_persona_id)
        references public.personas(id)
        on delete cascade,

    constraint circles_name_length_check
        check (
            char_length(trim(name)) >= 2
            and char_length(trim(name)) <= 100
        ),

    constraint circles_slug_length_check
        check (
            char_length(trim(slug)) >= 3
            and char_length(trim(slug)) <= 100
        ),

    constraint circles_slug_format_check
        check (
            slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
        ),

    constraint circles_slug_unique
        unique (slug)
);

comment on table public.circles is
'Digiver social circles.';

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_circles_owner_persona_id
on public.circles(owner_persona_id);

create index if not exists idx_circles_created_at
on public.circles(created_at desc);

-- ============================================================
-- UPDATED AT TRIGGER
-- ============================================================

create or replace function
public.update_circles_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

drop trigger if exists
circles_updated_at_trigger
on public.circles;

create trigger
circles_updated_at_trigger
before update
on public.circles
for each row
execute function
public.update_circles_updated_at();

-- ============================================================
-- OWNER PROTECTION
-- ============================================================

create or replace function
public.prevent_circle_owner_change()
returns trigger
language plpgsql
as $$
begin
    if old.owner_persona_id <> new.owner_persona_id then
        raise exception
            'Circle ownership cannot be transferred.';
    end if;

    return new;
end;
$$;

drop trigger if exists
prevent_circle_owner_change_trigger
on public.circles;

create trigger
prevent_circle_owner_change_trigger
before update
on public.circles
for each row
execute function
public.prevent_circle_owner_change();

-- ============================================================
-- RLS
-- ============================================================

alter table public.circles
enable row level security;

drop policy if exists
"Circles are viewable by everyone"
on public.circles;

create policy
"Circles are viewable by everyone"
on public.circles
for select
using (true);

drop policy if exists
"Users can create circles for owned personas"
on public.circles;

create policy
"Users can create circles for owned personas"
on public.circles
for insert
to authenticated
with check (
    exists (
        select 1
        from public.personas p
        where p.id = owner_persona_id
        and p.user_id = auth.uid()
    )
);

drop policy if exists
"Circle owners can update circles"
on public.circles;

create policy
"Circle owners can update circles"
on public.circles
for update
to authenticated
using (
    exists (
        select 1
        from public.personas p
        where p.id = owner_persona_id
        and p.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.personas p
        where p.id = owner_persona_id
        and p.user_id = auth.uid()
    )
);

drop policy if exists
"Circle owners can delete circles"
on public.circles;

create policy
"Circle owners can delete circles"
on public.circles
for delete
to authenticated
using (
    exists (
        select 1
        from public.personas p
        where p.id = owner_persona_id
        and p.user_id = auth.uid()
    )
);