-- ============================================================
-- Migration 004: Editable content (mini-CMS) + SEO + analytics
-- Run in Supabase SQL Editor after migrations 002 and 003.
-- ============================================================

-- ---------- Generic editable text blocks (mini-CMS) ----------
-- One row per content "key". Pages fetch by key and fall back to a
-- hardcoded default if the row doesn't exist yet (so nothing breaks
-- before an admin edits anything).
create table if not exists site_content (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- ---------- Per-page SEO metadata ----------
create table if not exists page_seo (
  page_key text primary key,      -- e.g. 'home', 'jobs', 'privacy'
  title text,
  description text,
  updated_at timestamptz not null default now()
);

-- ---------- Traffic analytics ----------
create table if not exists page_views (
  id uuid primary key default uuid_generate_v4(),
  path text not null,
  referrer text,
  user_agent text,
  session_id text,
  created_at timestamptz not null default now()
);
create index if not exists idx_page_views_created_at on page_views (created_at desc);
create index if not exists idx_page_views_path on page_views (path);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table site_content enable row level security;
alter table page_seo enable row level security;
alter table page_views enable row level security;

create policy "site_content readable by all" on site_content for select using (true);
create policy "site_content editable by admins" on site_content for all using (is_admin());

create policy "page_seo readable by all" on page_seo for select using (true);
create policy "page_seo editable by admins" on page_seo for all using (is_admin());

-- Anyone (including logged-out visitors) can log a page view, but only
-- admins can read the analytics data back.
create policy "page_views insertable by anyone" on page_views for insert with check (true);
create policy "page_views readable by admins" on page_views for select using (is_admin());
create policy "page_views deletable by admins" on page_views for delete using (is_admin());
