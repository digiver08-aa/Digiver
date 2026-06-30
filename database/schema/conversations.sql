-- =====================================================
-- DIGIVER
-- PHASE 7 — MESSAGING SYSTEM
-- conversations.sql
-- =====================================================

create extension if not exists pgcrypto;

-- =====================================================
-- CONVERSATIONS TABLE
-- =====================================================

create table if not exists public.conversations (
    id uuid primary key default gen_random_uuid(),

    created_at timestamptz not null
        default timezone('utc', now()),

    updated_at timestamptz not null
        default timezone('utc', now())
);

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================

drop trigger if exists conversations_set_updated_at
on public.conversations;

create trigger conversations_set_updated_at
before update
on public.conversations
for each row
execute function public.set_updated_at();

-- =====================================================
-- INDEXES
-- =====================================================

create index if not exists conversations_created_at_idx
on public.conversations (created_at desc);

create index if not exists conversations_updated_at_idx
on public.conversations (updated_at desc);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

alter table public.conversations
enable row level security;

-- =====================================================
-- SELECT POLICY
-- =====================================================

drop policy if exists "conversation_select_participants"
on public.conversations;

create policy "conversation_select_participants"
on public.conversations
for select
to authenticated
using (
    exists (
        select 1
        from public.conversation_participants cp
        inner join public.personas p
            on p.id = cp.persona_id
        where cp.conversation_id = conversations.id
          and p.user_id = auth.uid()
    )
);

-- =====================================================
-- INSERT POLICY
-- =====================================================

drop policy if exists "conversation_insert_authenticated"
on public.conversations;

create policy "conversation_insert_authenticated"
on public.conversations
for insert
to authenticated
with check (
    auth.uid() is not null
);

-- =====================================================
-- UPDATE POLICY
-- =====================================================

drop policy if exists "conversation_update_participants"
on public.conversations;

create policy "conversation_update_participants"
on public.conversations
for update
to authenticated
using (
    exists (
        select 1
        from public.conversation_participants cp
        inner join public.personas p
            on p.id = cp.persona_id
        where cp.conversation_id = conversations.id
          and p.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.conversation_participants cp
        inner join public.personas p
            on p.id = cp.persona_id
        where cp.conversation_id = conversations.id
          and p.user_id = auth.uid()
    )
);

-- =====================================================
-- DELETE POLICY
-- =====================================================

drop policy if exists "conversation_delete_none"
on public.conversations;

create policy "conversation_delete_none"
on public.conversations
for delete
to authenticated
using (false);

-- =====================================================
-- CREATE DIRECT CONVERSATION
--
-- Guarantees:
-- 1. Authenticated caller
-- 2. Persona A belongs to caller
-- 3. Persona B exists
-- 4. No self-conversations
-- 5. Reuses existing DM if present
-- 6. Atomic creation
-- 7. No orphan conversations
-- =====================================================

create or replace function public.create_direct_conversation(
    persona_a uuid,
    persona_b uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    conversation_uuid uuid;
begin

    if auth.uid() is null then
        raise exception
            'Authentication required';
    end if;

    if persona_a is null
       or persona_b is null then
        raise exception
            'Two personas are required';
    end if;

    if persona_a = persona_b then
        raise exception
            'Conversation requires two unique personas';
    end if;

    if not exists (
        select 1
        from public.personas
        where id = persona_a
          and user_id = auth.uid()
    ) then
        raise exception
            'Persona ownership validation failed';
    end if;

    if not exists (
        select 1
        from public.personas
        where id = persona_b
    ) then
        raise exception
            'Target persona does not exist';
    end if;

    -- Reuse existing conversation if present

    select cp1.conversation_id
    into conversation_uuid
    from public.conversation_participants cp1
    inner join public.conversation_participants cp2
        on cp1.conversation_id =
           cp2.conversation_id
    where cp1.persona_id = persona_a
      and cp2.persona_id = persona_b
    limit 1;

    if conversation_uuid is not null then
        return conversation_uuid;
    end if;

    insert into public.conversations
    default values
    returning id
    into conversation_uuid;

    insert into public.conversation_participants (
        conversation_id,
        persona_id
    )
    values
        (conversation_uuid, persona_a),
        (conversation_uuid, persona_b);

    return conversation_uuid;

end;
$$;

revoke all
on function public.create_direct_conversation(uuid, uuid)
from public;

grant execute
on function public.create_direct_conversation(uuid, uuid)
to authenticated;