-- =====================================================
-- DIGIVER
-- POSTS TABLE SCHEMA
-- Phase 5 — Feed System
-- =====================================================

create table if not exists public.posts (
    id uuid primary key default gen_random_uuid(),

    persona_id uuid not null,

    content text not null,

    created_at timestamptz not null default timezone('utc', now()),

    updated_at timestamptz not null default timezone('utc', now()),

    constraint posts_content_not_empty
        check (length(trim(content)) > 0),

    constraint posts_content_max_length
        check (char_length(content) <= 1000),

    constraint posts_persona_fk
        foreign key (persona_id)
        references public.personas(id)
        on delete cascade
);

-- =====================================================
-- INDEXES
-- =====================================================

create index if not exists idx_posts_persona_id
    on public.posts(persona_id);

create index if not exists idx_posts_created_at
    on public.posts(created_at desc);

create index if not exists idx_posts_persona_created_at
    on public.posts(persona_id, created_at desc);

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================

create or replace function public.set_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

-- =====================================================
-- PERSONA IMMUTABILITY
-- =====================================================

create or replace function public.prevent_post_persona_change()
returns trigger
language plpgsql
as $$
begin
    if old.persona_id <> new.persona_id then
        raise exception
            'Post persona ownership cannot be changed';
    end if;

    return new;
end;
$$;

-- =====================================================
-- TRIGGERS
-- =====================================================

drop trigger if exists trg_posts_updated_at
on public.posts;

create trigger trg_posts_updated_at
before update
on public.posts
for each row
execute function public.set_posts_updated_at();

drop trigger if exists trg_posts_persona_immutable
on public.posts;

create trigger trg_posts_persona_immutable
before update
on public.posts
for each row
execute function public.prevent_post_persona_change();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

alter table public.posts
enable row level security;

-- =====================================================
-- SELECT
-- =====================================================

drop policy if exists
"Posts are viewable by everyone"
on public.posts;

create policy
"Posts are viewable by everyone"
on public.posts
for select
using (true);

-- =====================================================
-- INSERT
-- =====================================================

drop policy if exists
"Persona owners can create posts"
on public.posts;

create policy
"Persona owners can create posts"
on public.posts
for insert
with check (
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

drop policy if exists
"Persona owners can update posts"
on public.posts;

create policy
"Persona owners can update posts"
on public.posts
for update
using (
    exists (
        select 1
        from public.personas p
        where p.id = posts.persona_id
          and p.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.personas p
        where p.id = posts.persona_id
          and p.user_id = auth.uid()
    )
);

-- =====================================================
-- DELETE
-- =====================================================

drop policy if exists
"Persona owners can delete posts"
on public.posts;

create policy
"Persona owners can delete posts"
on public.posts
for delete
using (
    exists (
        select 1
        from public.personas p
        where p.id = posts.persona_id
          and p.user_id = auth.uid()
    )
);