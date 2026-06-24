-- =====================================================
-- DIGIVER
-- PHASE 6 — CIRCLE SYSTEM
-- circle_memberships.sql
-- =====================================================

create table if not exists public.circle_memberships (
    id uuid primary key default gen_random_uuid(),

    circle_id uuid not null,
    persona_id uuid not null,

    created_at timestamptz not null
        default timezone('utc', now()),

    constraint circle_memberships_circle_fk
        foreign key (circle_id)
        references public.circles(id)
        on delete cascade,

    constraint circle_memberships_persona_fk
        foreign key (persona_id)
        references public.personas(id)
        on delete cascade,

    constraint circle_memberships_unique
        unique (circle_id, persona_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

create index if not exists
    circle_memberships_circle_id_idx
on public.circle_memberships(circle_id);

create index if not exists
    circle_memberships_persona_id_idx
on public.circle_memberships(persona_id);

create index if not exists
    circle_memberships_created_at_idx
on public.circle_memberships(created_at desc);

-- =====================================================
-- OWNER MEMBERSHIP PROTECTION
-- =====================================================

create or replace function
public.prevent_owner_membership_removal()
returns trigger
language plpgsql
as $$
begin
    if exists (
        select 1
        from public.circles c
        where c.id = old.circle_id
        and c.owner_persona_id =
            old.persona_id
    ) then
        raise exception
            'Circle owner cannot leave their own circle.';
    end if;

    return old;
end;
$$;

drop trigger if exists
prevent_owner_membership_removal_trigger
on public.circle_memberships;

create trigger
prevent_owner_membership_removal_trigger
before delete
on public.circle_memberships
for each row
execute function
public.prevent_owner_membership_removal();

-- =====================================================
-- RLS
-- =====================================================

alter table public.circle_memberships
enable row level security;

-- =====================================================
-- SELECT
-- =====================================================

create policy
"Circle memberships are viewable by everyone"
on public.circle_memberships
for select
using (true);

-- =====================================================
-- INSERT
-- =====================================================

create policy
"Users can join circles with owned personas"
on public.circle_memberships
for insert
to authenticated
with check (
    exists (
        select 1
        from public.personas p
        where p.id = persona_id
        and p.user_id = auth.uid()
    )
);

-- =====================================================
-- DELETE
-- =====================================================

create policy
"Users can leave circles with owned personas"
on public.circle_memberships
for delete
to authenticated
using (
    exists (
        select 1
        from public.personas p
        where p.id = persona_id
        and p.user_id = auth.uid()
    )
);

-- =====================================================
-- UPDATE
-- =====================================================

create policy
"No membership updates"
on public.circle_memberships
for update
to authenticated
using (false)
with check (false);