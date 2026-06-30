-- =====================================================
-- DIGIVER
-- PHASE 7 — MESSAGING SYSTEM
-- messages.sql
-- =====================================================

create extension if not exists pgcrypto;

-- =====================================================
-- MESSAGES TABLE
-- =====================================================

create table if not exists public.messages (
    id uuid primary key default gen_random_uuid(),

    conversation_id uuid not null,
    sender_persona_id uuid not null,

    content varchar(2000) not null,

    created_at timestamptz not null
        default timezone('utc', now()),

    constraint messages_content_not_empty
        check (length(trim(content)) > 0),

    constraint messages_content_length
        check (char_length(content) <= 2000),

    constraint messages_conversation_id_fkey
        foreign key (conversation_id)
        references public.conversations(id)
        on delete cascade,

    constraint messages_sender_persona_id_fkey
        foreign key (sender_persona_id)
        references public.personas(id)
        on delete cascade
);

-- =====================================================
-- INDEXES
-- =====================================================

create index if not exists messages_conversation_id_idx
on public.messages (conversation_id);

create index if not exists messages_sender_persona_id_idx
on public.messages (sender_persona_id);

create index if not exists messages_created_at_idx
on public.messages (created_at desc);

create index if not exists messages_conversation_created_at_idx
on public.messages (
    conversation_id,
    created_at desc
);

-- =====================================================
-- OWNERSHIP + PARTICIPATION VALIDATION
--
-- Ensures:
-- 1. Sender persona belongs to auth user
-- 2. Sender persona is a participant
-- 3. Persona belongs to conversation
-- =====================================================

create or replace function public.validate_message_sender()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin

    if not exists (
        select 1
        from public.personas p
        where p.id = new.sender_persona_id
          and p.user_id = auth.uid()
    ) then
        raise exception
            'Sender persona ownership validation failed';
    end if;

    if not exists (
        select 1
        from public.conversation_participants cp
        where cp.conversation_id = new.conversation_id
          and cp.persona_id = new.sender_persona_id
    ) then
        raise exception
            'Sender persona is not a participant of this conversation';
    end if;

    return new;

end;
$$;

drop trigger if exists validate_message_sender_trigger
on public.messages;

create trigger validate_message_sender_trigger
before insert
on public.messages
for each row
execute function public.validate_message_sender();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

alter table public.messages
enable row level security;

-- =====================================================
-- SELECT POLICY
--
-- Users may read messages only from
-- conversations containing one of
-- their personas.
-- =====================================================

drop policy if exists "messages_select_participants"
on public.messages;

create policy "messages_select_participants"
on public.messages
for select
to authenticated
using (
    exists (
        select 1
        from public.conversation_participants cp
        inner join public.personas p
            on p.id = cp.persona_id
        where cp.conversation_id = messages.conversation_id
          and p.user_id = auth.uid()
    )
);

-- =====================================================
-- INSERT POLICY
--
-- Users may create messages only when:
-- 1. They own sender_persona_id
-- 2. Sender persona participates
--    in the conversation
-- =====================================================

drop policy if exists "messages_insert_participants"
on public.messages;

create policy "messages_insert_participants"
on public.messages
for insert
to authenticated
with check (
    exists (
        select 1
        from public.personas p
        inner join public.conversation_participants cp
            on cp.persona_id = p.id
        where p.id = sender_persona_id
          and cp.conversation_id = conversation_id
          and p.user_id = auth.uid()
    )
);

-- =====================================================
-- UPDATE POLICY
--
-- Disabled for MVP.
-- Messages are immutable.
-- =====================================================

drop policy if exists "messages_update_none"
on public.messages;

create policy "messages_update_none"
on public.messages
for update
to authenticated
using (false)
with check (false);

-- =====================================================
-- DELETE POLICY
--
-- Disabled for MVP.
-- Messages are immutable.
-- =====================================================

drop policy if exists "messages_delete_none"
on public.messages;

create policy "messages_delete_none"
on public.messages
for delete
to authenticated
using (false);