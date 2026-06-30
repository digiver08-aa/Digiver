-- =====================================================
-- DIGIVER
-- PHASE 7 — MESSAGING SYSTEM
-- conversation_participants.sql
-- =====================================================

create extension if not exists pgcrypto;

-- =====================================================
-- CONVERSATION PARTICIPANTS TABLE
-- =====================================================

create table if not exists public.conversation_participants (
    id uuid primary key default gen_random_uuid(),

    conversation_id uuid not null,
    persona_id uuid not null,

    created_at timestamptz not null
        default timezone('utc', now()),

    constraint conversation_participants_conversation_id_fkey
        foreign key (conversation_id)
        references public.conversations(id)
        on delete cascade,

    constraint conversation_participants_persona_id_fkey
        foreign key (persona_id)
        references public.personas(id)
        on delete cascade,

    constraint conversation_participants_unique
        unique (
            conversation_id,
            persona_id
        )
);

-- =====================================================
-- INDEXES
-- =====================================================

create index if not exists conversation_participants_conversation_idx
on public.conversation_participants (
    conversation_id
);

create index if not exists conversation_participants_persona_idx
on public.conversation_participants (
    persona_id
);

create index if not exists conversation_participants_created_at_idx
on public.conversation_participants (
    created_at desc
);

-- =====================================================
-- MAX TWO PARTICIPANTS
-- =====================================================

create or replace function public.validate_conversation_participant_limit()
returns trigger
language plpgsql
as $$
declare
    participant_count integer;
begin

    select count(*)
    into participant_count
    from public.conversation_participants
    where conversation_id =
          new.conversation_id;

    if participant_count >= 2 then
        raise exception
            'Conversation may contain at most two participants';
    end if;

    return new;

end;
$$;

drop trigger if exists validate_conversation_participant_limit_trigger
on public.conversation_participants;

create trigger validate_conversation_participant_limit_trigger
before insert
on public.conversation_participants
for each row
execute function public.validate_conversation_participant_limit();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

alter table public.conversation_participants
enable row level security;

-- =====================================================
-- SELECT POLICY
-- =====================================================

drop policy if exists "conversation_participants_select"
on public.conversation_participants;

create policy "conversation_participants_select"
on public.conversation_participants
for select
to authenticated
using (
    exists (
        select 1
        from public.conversation_participants cp
        inner join public.personas p
            on p.id = cp.persona_id
        where cp.conversation_id =
              conversation_participants.conversation_id
          and p.user_id = auth.uid()
    )
);

-- =====================================================
-- INSERT POLICY
--
-- Inserts only through
-- create_direct_conversation().
-- =====================================================

drop policy if exists "conversation_participants_insert"
on public.conversation_participants;

create policy "conversation_participants_insert"
on public.conversation_participants
for insert
to authenticated
with check (false);

-- =====================================================
-- UPDATE POLICY
-- =====================================================

drop policy if exists "conversation_participants_update_none"
on public.conversation_participants;

create policy "conversation_participants_update_none"
on public.conversation_participants
for update
to authenticated
using (false)
with check (false);

-- =====================================================
-- DELETE POLICY
-- =====================================================

drop policy if exists "conversation_participants_delete_none"
on public.conversation_participants;

create policy "conversation_participants_delete_none"
on public.conversation_participants
for delete
to authenticated
using (false);