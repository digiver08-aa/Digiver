-- =====================================================
-- DIGIVER
-- Reactions Schema
-- =====================================================

create table if not exists public.reactions (
    id uuid primary key default gen_random_uuid(),

    post_id uuid not null,

    persona_id uuid not null,

    type text not null
        check (
            type in (
                'like',
                'love',
                'insightful',
                'support',
                'applaud',
                'curious'
            )
        ),

    created_at timestamptz not null default now(),

    constraint reactions_post_fk
        foreign key (post_id)
        references public.posts(id)
        on delete cascade,

    constraint reactions_persona_fk
        foreign key (persona_id)
        references public.personas(id)
        on delete cascade,

    constraint reactions_unique_post_persona
        unique (post_id, persona_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

create index if not exists reactions_post_id_idx
    on public.reactions(post_id);

create index if not exists reactions_persona_id_idx
    on public.reactions(persona_id);

create index if not exists reactions_created_at_idx
    on public.reactions(created_at desc);

create index if not exists reactions_type_idx
    on public.reactions(type);

-- =====================================================
-- IMMUTABILITY TRIGGER
-- =====================================================

create or replace function public.prevent_reaction_core_changes()
returns trigger
language plpgsql
as $$
begin
    if old.post_id <> new.post_id
       or old.persona_id <> new.persona_id
       or old.created_at <> new.created_at then

        raise exception
            'Reaction ownership fields cannot be modified';
    end if;

    return new;
end;
$$;

drop trigger if exists trg_reaction_immutable
on public.reactions;

create trigger trg_reaction_immutable
before update
on public.reactions
for each row
execute function public.prevent_reaction_core_changes();

-- =====================================================
-- RLS
-- =====================================================

alter table public.reactions
enable row level security;

drop policy if exists
"reactions_select_authenticated"
on public.reactions;

create policy
"reactions_select_authenticated"
on public.reactions
for select
to authenticated
using (true);

drop policy if exists
"reactions_insert_owner"
on public.reactions;

create policy
"reactions_insert_owner"
on public.reactions
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

drop policy if exists
"reactions_delete_owner"
on public.reactions;

create policy
"reactions_delete_owner"
on public.reactions
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

drop policy if exists
"reactions_update_owner"
on public.reactions;

create policy
"reactions_update_owner"
on public.reactions
for update
to authenticated
using (
    exists (
        select 1
        from public.personas p
        where p.id = persona_id
          and p.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.personas p
        where p.id = persona_id
          and p.user_id = auth.uid()
    )
);