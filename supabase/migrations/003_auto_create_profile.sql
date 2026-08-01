-- ============================================================
-- Migration 003: Auto-create profile on signup (fixes RLS error)
--
-- Problem: the app was inserting into `profiles` from the browser right
-- after auth.signUp(). If "Confirm email" is enabled in Supabase Auth
-- settings, there's no active session yet at that point, so auth.uid()
-- is null and the RLS policy blocks the insert.
--
-- Fix: create the profile row from a database trigger that fires the
-- moment a row is added to auth.users. This runs with elevated
-- privileges (SECURITY DEFINER) and bypasses RLS safely, and it works
-- whether or not email confirmation is required.
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'নতুন ব্যবহারকারী'),
    'buyer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- One-time cleanup: if you already tried signing up and got the RLS
-- error, you may have "orphaned" auth.users rows with no matching
-- profiles row. This backfills them using this trigger's logic.
-- ============================================================
insert into public.profiles (id, full_name, role)
select u.id, coalesce(u.raw_user_meta_data->>'full_name', 'নতুন ব্যবহারকারী'), 'buyer'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;
