-- =====================================================
-- DIGIVER
-- PHASE 6 — CIRCLE SYSTEM
-- circles.sql
-- =====================================================

create table if not exists public.circles (
    id uuid primary key default gen_random_uuid(),

    owner_persona_id uuid not null,

    name varchar(100) not null,
    slug varchar(100) not null,
    description text,

    avatar_url text,
    banner_url text,

    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),

    constraint circles_owner_persona_fk
        foreign key (owner_persona_id)
        references public.personas(id)
        on delete cascade,

    constraint circles_name_not_empty
        check (char_length(trim(name)) > 0),

    constraint circles_slug_not_empty
        check (char_length(trim(slug)) > 0),

    constraint circles_slug_format
        check (
            slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
        ),

    constraint circles_slug_unique
        unique (slug)
);

-- =====================================================
-- INDEXES
-- =====================================================

create index if not exists circles_owner_persona_id_idx
    on public.circles(owner_persona_id);

create index if not exists circles_created_at_idx
    on public.circles(created_at desc);

create unique index if not exists circles_slug_idx
    on public.circles(slug);

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================

create trigger set_circles_updated_at
before update on public.circles
for each row
execute function public.handle_updated_at();

-- =====================================================
-- RLS
-- =====================================================

alter table public.circles enable row level security;

-- Public read access

create policy "Circles are viewable by everyone"
on public.circles
for select
using (true);

-- Authenticated users may create circles
-- only for personas they own

create policy "Users can create circles for owned personas"
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

-- Circle owners may update

create policy "Circle owners can update circles"
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

-- Circle owners may delete

create policy "Circle owners can delete circles"
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