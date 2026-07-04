-- ============================================================
-- DIGIVER
-- PHASE 8 — NOTIFICATION SYSTEM MVP
-- notifications.sql
-- ============================================================

create extension if not exists pgcrypto;

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

create table if not exists public.notifications (
    id uuid primary key
        default gen_random_uuid(),

    recipient_persona_id uuid not null,

    actor_persona_id uuid,

    type text not null,

    title text not null,

    body text not null,

    link text,

    constraint notifications_link_check
        check (
            link is null
            or link ~ '^\/'
        ),

    metadata jsonb not null
        default '{}'::jsonb,

    constraint notifications_metadata_size_check
        check (
        pg_column_size(metadata) <= 8192
        ),

    is_read boolean not null
        default false,

    read_at timestamptz,

    created_at timestamptz not null
        default timezone('utc', now()),

    constraint notifications_recipient_fk
        foreign key (recipient_persona_id)
        references public.personas(id)
        on delete cascade,

    constraint notifications_actor_fk
        foreign key (actor_persona_id)
        references public.personas(id)
        on delete set null,

    constraint notifications_type_length
        check (
            char_length(type)
            between 1 and 100
        ),

    constraint notifications_title_length
        check (
            char_length(title)
            between 1 and 200
        ),

    constraint notifications_body_length
        check (
            char_length(body)
            between 1 and 1000
        ),

    constraint notifications_read_state_check
        check (
            (
                is_read = false
                and read_at is null
            )
            or
            (
                is_read = true
                and read_at is not null
            )
        )
);

comment on table public.notifications is
'Persona-scoped notifications.';

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists
idx_notifications_recipient
on public.notifications(
    recipient_persona_id
);

create index if not exists
idx_notifications_recipient_created
on public.notifications(
    recipient_persona_id,
    created_at desc
);

create index if not exists
idx_notifications_unread
on public.notifications(
    recipient_persona_id,
    is_read
)
where is_read = false;

create index if not exists
idx_notifications_actor
on public.notifications(
    actor_persona_id
);

create index if not exists
idx_notifications_type
on public.notifications(
    type
);

create index if not exists
idx_notifications_created
on public.notifications(
    created_at desc
);

-- ============================================================
-- RLS
-- ============================================================

alter table public.notifications
enable row level security;

alter table public.notifications
force row level security;

-- ============================================================
-- PERSONA OWNERSHIP CHECK
-- ============================================================

create or replace function
public.is_notification_owner(
    target_persona_id uuid
)
returns boolean
language sql
stable
as $$
    select exists (
        select 1
        from public.personas p
        where p.id = target_persona_id
        and p.user_id = auth.uid()
    );
$$;

-- ============================================================
-- SELECT
-- ============================================================

create policy
"Users can view notifications for owned personas"
on public.notifications
for select
to authenticated
using (
    public.is_notification_owner(
        recipient_persona_id
    )
);

-- ============================================================
-- UPDATE
-- ============================================================

create policy
"Users can update notifications for owned personas"
on public.notifications
for update
to authenticated
using (
    public.is_notification_owner(
        recipient_persona_id
    )
)
with check (
    public.is_notification_owner(
        recipient_persona_id
    )
);

-- ============================================================
-- DELETE
-- ============================================================

create policy
"Users can delete notifications for owned personas"
on public.notifications
for delete
to authenticated
using (
    public.is_notification_owner(
        recipient_persona_id
    )
);

-- ============================================================
-- INSERT
-- ============================================================

create policy
"Service role inserts notifications"
on public.notifications
for insert
to service_role
with check (true);

-- ============================================================
-- MARK SINGLE NOTIFICATION READ
-- ============================================================

create or replace function
public.mark_notification_read(
    notification_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin

    update public.notifications
    set
        is_read = true,
        read_at = timezone('utc', now())
    where
        id = notification_id
        and exists (
            select 1
            from public.personas p
            where p.id =
                notifications.recipient_persona_id
            and p.user_id = auth.uid()
        );

end;
$$;

revoke all
on function public.mark_notification_read(uuid)
from public;

grant execute
on function public.mark_notification_read(uuid)
to authenticated;

-- ============================================================
-- MARK ALL READ
-- ============================================================

create or replace function
public.mark_all_notifications_read(
    target_persona_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin

    update public.notifications
    set
        is_read = true,
        read_at = timezone('utc', now())
    where
        recipient_persona_id = target_persona_id
        and is_read = false
        and exists (
            select 1
            from public.personas p
            where p.id = target_persona_id
            and p.user_id = auth.uid()
        );

end;
$$;

revoke all
on function public.mark_all_notifications_read(uuid)
from public;

grant execute
on function public.mark_all_notifications_read(uuid)
to authenticated;

-- ============================================================
-- MESSAGE NOTIFICATION EVENTS
-- ============================================================

create or replace function
public.handle_message_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    recipient_id uuid;
    sender_name text;
begin

    select cp.persona_id
    into recipient_id
    from public.conversation_participants cp
    where cp.conversation_id = new.conversation_id
      and cp.persona_id <> new.sender_persona_id
    limit 1;

    if recipient_id is null then
        return new;
    end if;

    select p.name
    into sender_name
    from public.personas p
    where p.id = new.sender_persona_id;

    insert into public.notifications (
        recipient_persona_id,
        actor_persona_id,
        type,
        title,
        body,
        link,
        metadata
    )
    values (
        recipient_id,
        new.sender_persona_id,
        'message',
        'New Message',
        coalesce(sender_name, 'Someone')
            || ' sent you a message.',
        '/messages',
        jsonb_build_object(
            'conversationId',
            new.conversation_id,
            'messageId',
            new.id
        )
    );

    return new;
end;
$$;

drop trigger if exists
message_notification_trigger
on public.messages;

create trigger
message_notification_trigger
after insert
on public.messages
for each row
execute function
public.handle_message_notification();

-- ============================================================
-- REACTION NOTIFICATION EVENTS
-- ============================================================

create or replace function
public.handle_reaction_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    post_owner_id uuid;
    actor_name text;
begin

    select p.persona_id
    into post_owner_id
    from public.posts p
    where p.id = new.post_id;

    if post_owner_id is null then
        return new;
    end if;

    if post_owner_id = new.persona_id then
        return new;
    end if;

    select persona.name
    into actor_name
    from public.personas persona
    where persona.id = new.persona_id;

    insert into public.notifications (
        recipient_persona_id,
        actor_persona_id,
        type,
        title,
        body,
        link,
        metadata
    )
    values (
        post_owner_id,
        new.persona_id,
        'reaction',
        'New Reaction',
        coalesce(actor_name, 'Someone')
            || ' reacted to your post.',
        '/feed',
        jsonb_build_object(
            'postId',
            new.post_id,
            'reactionType',
            new.type
        )
    );

    return new;
end;
$$;

drop trigger if exists
reaction_notification_trigger
on public.reactions;

create trigger
reaction_notification_trigger
after insert
on public.reactions
for each row
execute function
public.handle_reaction_notification();

-- ============================================================
-- REALTIME
-- ============================================================

do $$
begin
    begin
        alter publication supabase_realtime
        add table public.notifications;
    exception
        when duplicate_object then
            null;
    end;
end
$$;