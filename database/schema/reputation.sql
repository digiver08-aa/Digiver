-- ============================================================
-- DIGIVER
-- PHASE 9 — REPUTATION SYSTEM MVP
-- reputation.sql
-- ============================================================

create extension if not exists pgcrypto;

-- ============================================================
-- REPUTATION EVENT TYPE
-- ============================================================

create type reputation_event_type as enum (
    'REACTION_RECEIVED',
    'CIRCLE_PARTICIPATION',
    'MESSAGE_PARTICIPATION'
);

-- ============================================================
-- REPUTATIONS
-- ============================================================

create table if not exists public.reputations (

    persona_id uuid primary key
        references public.personas(id)
        on delete cascade,

    score integer not null
        default 0
        check (score >= 0),

    created_at timestamptz
        not null
        default timezone('utc', now()),

    updated_at timestamptz
        not null
        default timezone('utc', now())
);

-- ============================================================
-- REPUTATION EVENTS
-- ============================================================

create table if not exists public.reputation_events (

    id uuid primary key
        default gen_random_uuid(),

    persona_id uuid not null
        references public.personas(id)
        on delete cascade,

    event_type reputation_event_type
        not null,

    score_delta integer
        not null
        check (score_delta > 0),

    source_reference text
        not null
        check (char_length(source_reference) <= 255),

    created_at timestamptz
        not null
        default timezone('utc', now())
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists reputation_events_persona_idx
on public.reputation_events(persona_id);

create index if not exists reputation_events_created_idx
on public.reputation_events(created_at desc);

create index if not exists reputation_events_type_idx
on public.reputation_events(event_type);

create unique index if not exists reputation_events_unique_source_idx
on public.reputation_events(
    persona_id,
    event_type,
    source_reference
);

create index if not exists reputations_score_idx
on public.reputations(score desc);

-- ============================================================
-- UPDATED AT
-- ============================================================

create or replace function public.update_reputation_timestamp()
returns trigger
language plpgsql
as $$
begin
    new.updated_at := timezone('utc', now());
    return new;
end;
$$;

drop trigger if exists reputations_updated_at
on public.reputations;

create trigger reputations_updated_at
before update
on public.reputations
for each row
execute function public.update_reputation_timestamp();

-- ============================================================
-- OWNERSHIP HELPER
-- ============================================================

create or replace function public.owns_persona(
    target_persona uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
select exists (
    select 1
    from public.personas
    where
        id = target_persona
        and user_id = auth.uid()
);
$$;

-- ============================================================
-- APPLY REPUTATION EVENT
-- ============================================================

create or replace function public.apply_reputation_event(

    target_persona uuid,

    target_event reputation_event_type,

    target_source text

)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    calculated_score integer;
begin

    calculated_score :=
        case target_event
            when 'REACTION_RECEIVED' then 5
            when 'MESSAGE_PARTICIPATION' then 2
            when 'CIRCLE_PARTICIPATION' then 10
        end;

    if calculated_score is null then
        raise exception
            'Unsupported reputation event type: %',
            target_event;
    end if;

    insert into public.reputation_events (

        persona_id,
        event_type,
        score_delta,
        source_reference

    )
    values (

        target_persona,
        target_event,
        calculated_score,
        target_source

    )
    on conflict (
        persona_id,
        event_type,
        source_reference
    )
    do nothing;

    if found then

        insert into public.reputations (

            persona_id,
            score

        )
        values (

            target_persona,
            calculated_score

        )
        on conflict (persona_id)
        do update
        set
            score =
                reputations.score
                + excluded.score,

            updated_at =
                timezone('utc', now());

    end if;

end;
$$;

revoke all
on function public.apply_reputation_event(
    uuid,
    reputation_event_type,
    text
)
from public;

grant execute
on function public.apply_reputation_event(
    uuid,
    reputation_event_type,
    text
)
to service_role;

-- ============================================================
-- RLS
-- ============================================================

alter table public.reputations
enable row level security;

alter table public.reputation_events
enable row level security;

alter table public.reputations
force row level security;

alter table public.reputation_events
force row level security;

-- ============================================================
-- REPUTATIONS POLICIES
-- ============================================================

create policy "Anyone can view reputations"
on public.reputations
for select
using (true);

create policy "Service role manages reputations"
on public.reputations
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

-- ============================================================
-- REPUTATION EVENTS POLICIES
-- ============================================================

create policy "Persona owner can view own events"
on public.reputation_events
for select
using (
    public.owns_persona(persona_id)
);

create policy "Service role inserts reputation events"
on public.reputation_events
for insert
with check (
    auth.role() = 'service_role'
);