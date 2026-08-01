-- ============================================================
-- Migration 002: Admin section support
-- Run this AFTER schema.sql in Supabase SQL Editor (SQL Editor > New query > paste > Run)
-- ============================================================

-- ---------- Admin + suspension flags on profiles ----------
alter table profiles add column if not exists is_admin boolean not null default false;
alter table profiles add column if not exists is_suspended boolean not null default false;
alter table profiles add column if not exists suspended_reason text;

-- ---------- Site-wide settings (singleton row) ----------
create table if not exists site_settings (
  id boolean primary key default true check (id),  -- forces exactly one row
  default_commission_pct numeric(4,2) not null default 8.00,
  min_commission_pct numeric(4,2) not null default 5.00,
  max_commission_pct numeric(4,2) not null default 15.00,
  site_name_bn text not null default 'কাজকরো',
  support_email text not null default 'support@kajkoro.com',
  support_phone text not null default '',
  maintenance_mode boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into site_settings (id) values (true) on conflict (id) do nothing;

-- ---------- Admin audit log (who changed what) ----------
create table if not exists admin_audit_log (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid not null references profiles(id),
  action text not null,           -- e.g. 'verify_nid', 'suspend_user', 'update_commission'
  target_table text,
  target_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

-- ---------- Contact / support messages from the public pages ----------
create table if not exists support_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table site_settings enable row level security;
alter table admin_audit_log enable row level security;
alter table support_messages enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$ language sql stable security definer;

-- site_settings: public can read (needed for e.g. showing commission %), only admins can write
create policy "site settings readable by all" on site_settings for select using (true);
create policy "site settings editable by admins" on site_settings for update using (is_admin());

-- audit log: admin-only read/write
create policy "audit log readable by admins" on admin_audit_log for select using (is_admin());
create policy "audit log insertable by admins" on admin_audit_log for insert with check (is_admin());

-- support messages: anyone can submit (even logged-out), only admins can read/update
create policy "support messages insertable by anyone" on support_messages for insert with check (true);
create policy "support messages readable by admins" on support_messages for select using (is_admin());
create policy "support messages updatable by admins" on support_messages for update using (is_admin());

-- ---------- Let admins manage everything (extend existing table policies) ----------
create policy "profiles: admin full access" on profiles for all using (is_admin());
create policy "worker_profiles: admin full access" on worker_profiles for all using (is_admin());
create policy "jobs: admin full access" on jobs for all using (is_admin());
create policy "bids: admin full access" on bids for all using (is_admin());
create policy "transactions: admin full access" on transactions for all using (is_admin());
create policy "reviews: admin full access" on reviews for all using (is_admin());
create policy "skill_categories: admin full access" on skill_categories for all using (is_admin());

-- ============================================================
-- 🔑 IMPORTANT — MAKE YOURSELF AN ADMIN
-- After running this migration, run this ONE line separately,
-- replacing the email with your own account's email:
--
--   update profiles set is_admin = true
--   where id = (select id from auth.users where email = 'your-email@example.com');
--
-- ============================================================
