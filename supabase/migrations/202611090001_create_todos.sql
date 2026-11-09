-- Run once in the Supabase SQL Editor for the project used by this app.
-- If todo already exists, inspect its schema and policies before applying.
begin;
create table public.todo (
  id serial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null check (char_length(trim(nickname)) between 2 and 20),
  title text not null check (char_length(btrim(title)) between 1 and 200),
  is_completed boolean not null default false,
  created_at timestamptz not null default now()
);
create index todo_user_created_idx on public.todo (user_id, created_at desc);
alter table public.todo enable row level security;
revoke all on table public.todo from anon, authenticated;
grant select, insert, update, delete on table public.todo to authenticated;
grant usage on sequence public.todo_id_seq to authenticated;
create policy "Read own todo" on public.todo for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Create own todo" on public.todo for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Update own todo" on public.todo for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own todo" on public.todo for delete to authenticated
  using ((select auth.uid()) = user_id);
commit;
