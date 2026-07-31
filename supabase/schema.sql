-- ============================================================
-- KajKoro (কাজ করো) — Marketplace Database Schema
-- Run this in Supabase SQL Editor (Project > SQL Editor > New query)
-- ============================================================

-- ---------- EXTENSIONS ----------
create extension if not exists "uuid-ossp";

-- ---------- ENUMS ----------
create type user_role as enum ('worker', 'buyer', 'both');
create type job_status as enum ('open', 'assigned', 'completed', 'cancelled');
create type bid_status as enum ('pending', 'accepted', 'rejected', 'withdrawn');
create type payment_method as enum ('cash', 'card');
create type payment_status as enum ('pending', 'paid', 'refunded');

-- ---------- PROFILES (extends Supabase auth.users) ----------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text unique,
  role user_role not null default 'buyer',
  area text,                      -- e.g. ধানমন্ডি, বনানী
  nid_number text,                -- stored encrypted/hashed in production — see README
  nid_verified boolean not null default false,
  avatar_url text,
  emergency_contact_name text,
  emergency_contact_phone text,
  rating_avg numeric(3,2) default 0,
  rating_count integer default 0,
  created_at timestamptz not null default now()
);

-- ---------- SKILL CATEGORIES (predefined list, admin-managed) ----------
create table skill_categories (
  id serial primary key,
  name_bn text not null,          -- বাংলা নাম
  name_en text not null,
  group_name text not null        -- e.g. 'household', 'office', 'restaurant', 'education'
);

insert into skill_categories (name_bn, name_en, group_name) values
  ('কিচেন ও বাথরুম পরিষ্কার', 'Kitchen & bathroom cleaning', 'household'),
  ('দরজা-জানালা-গ্রিল পরিষ্কার', 'Door/window/grille cleaning', 'household'),
  ('কাপড় ধোয়া', 'Laundry (washing)', 'household'),
  ('আয়রন করা', 'Ironing', 'household'),
  ('তরকারি কাটাকাটি', 'Vegetable/meal prep', 'household'),
  ('রান্নাবান্না', 'Cooking', 'household'),
  ('বাজার করা', 'Grocery shopping/errands', 'household'),
  ('শিশু দেখাশোনা', 'Childcare (babysitting)', 'household'),
  ('বয়স্ক ব্যক্তির সেবা', 'Elderly care companion', 'household'),
  ('পোষা প্রাণীর যত্ন', 'Pet care', 'household'),
  ('বাগান পরিচর্যা', 'Gardening', 'household'),
  ('শিফটিং/মালামাল স্থানান্তর সহায়তা', 'Moving/shifting help', 'household'),
  ('অফিস ক্লিনিং', 'Office cleaning', 'office'),
  ('ডকুমেন্ট/ফাইলিং সহায়তা', 'Document filing assistance', 'office'),
  ('ডেলিভারি/এরান্ড', 'Delivery/errand running', 'office'),
  ('ইভেন্ট সহায়তা', 'Event support staff', 'office'),
  ('রেস্টুরেন্ট সার্ভিং', 'Restaurant serving', 'restaurant'),
  ('ডিশওয়াশিং', 'Dishwashing', 'restaurant'),
  ('হোম টিউশন', 'Home tutoring', 'education'),
  ('অ্যাসাইনমেন্ট/টাইপিং সহায়তা', 'Typing/assignment help', 'education');

-- ---------- WORKER PROFILES ----------
create table worker_profiles (
  user_id uuid primary key references profiles(id) on delete cascade,
  hourly_rate numeric(10,2) not null check (hourly_rate > 0),
  bio text,
  max_daily_hours numeric(4,1) default 8,
  is_active boolean not null default true
);

-- max 5 skills per worker — enforced via trigger below
create table worker_skills (
  worker_id uuid not null references worker_profiles(user_id) on delete cascade,
  skill_id integer not null references skill_categories(id),
  primary key (worker_id, skill_id)
);

create or replace function enforce_max_five_skills()
returns trigger as $$
begin
  if (select count(*) from worker_skills where worker_id = new.worker_id) >= 5 then
    raise exception 'একজন ওয়ার্কার সর্বোচ্চ ৫টি কাজ সিলেক্ট করতে পারবেন';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_max_five_skills
before insert on worker_skills
for each row execute function enforce_max_five_skills();

-- worker weekly availability — flexible slot model
create table worker_availability (
  id uuid primary key default uuid_generate_v4(),
  worker_id uuid not null references worker_profiles(user_id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6), -- 0=Sun
  start_time time not null,
  end_time time not null
);

-- ---------- JOBS ----------
create table jobs (
  id uuid primary key default uuid_generate_v4(),
  buyer_id uuid not null references profiles(id) on delete cascade,
  skill_id integer not null references skill_categories(id),
  title text not null,
  description text,
  area text not null,
  estimated_hours numeric(4,1) not null check (estimated_hours > 0),
  budget_hourly numeric(10,2),          -- buyer's suggested rate (optional, workers can counter-bid)
  scheduled_date date,
  scheduled_time time,
  status job_status not null default 'open',
  assigned_worker_id uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- ---------- BIDS ----------
create table bids (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references jobs(id) on delete cascade,
  worker_id uuid not null references profiles(id) on delete cascade,
  rate_offered numeric(10,2) not null check (rate_offered > 0),
  message text,
  status bid_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (job_id, worker_id)
);

-- ---------- TRANSACTIONS ----------
create table transactions (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references jobs(id) on delete cascade,
  amount numeric(10,2) not null,
  commission_pct numeric(4,2) not null default 8.00,
  commission_amount numeric(10,2) generated always as (amount * commission_pct / 100) stored,
  payment_method payment_method not null,
  status payment_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- ---------- REVIEWS ----------
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references jobs(id) on delete cascade,
  reviewer_id uuid not null references profiles(id),
  reviewee_id uuid not null references profiles(id),
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (job_id, reviewer_id)
);

-- keep profiles.rating_avg in sync
create or replace function update_rating_avg()
returns trigger as $$
begin
  update profiles
  set rating_avg = (select coalesce(avg(rating),0) from reviews where reviewee_id = new.reviewee_id),
      rating_count = (select count(*) from reviews where reviewee_id = new.reviewee_id)
  where id = new.reviewee_id;
  return new;
end;
$$ language plpgsql;

create trigger trg_update_rating
after insert on reviews
for each row execute function update_rating_avg();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles enable row level security;
alter table worker_profiles enable row level security;
alter table worker_skills enable row level security;
alter table worker_availability enable row level security;
alter table jobs enable row level security;
alter table bids enable row level security;
alter table transactions enable row level security;
alter table reviews enable row level security;

-- profiles: everyone can read basic profile info; only owner can update
create policy "profiles readable by all" on profiles for select using (true);
create policy "profiles editable by owner" on profiles for update using (auth.uid() = id);
create policy "profiles insertable by owner" on profiles for insert with check (auth.uid() = id);

-- worker profiles: public read (needed to browse workers), owner write
create policy "worker profiles readable by all" on worker_profiles for select using (true);
create policy "worker profiles editable by owner" on worker_profiles for all using (auth.uid() = user_id);

create policy "worker skills readable by all" on worker_skills for select using (true);
create policy "worker skills editable by owner" on worker_skills for all using (auth.uid() = worker_id);

create policy "availability readable by all" on worker_availability for select using (true);
create policy "availability editable by owner" on worker_availability for all using (auth.uid() = worker_id);

-- jobs: public read (browse open jobs), owner + assigned worker can write
create policy "jobs readable by all" on jobs for select using (true);
create policy "jobs insertable by buyer" on jobs for insert with check (auth.uid() = buyer_id);
create policy "jobs editable by buyer or assigned worker" on jobs for update
  using (auth.uid() = buyer_id or auth.uid() = assigned_worker_id);

-- bids: worker can insert own bid; job's buyer + the bidding worker can read
create policy "bids readable by involved parties" on bids for select
  using (
    auth.uid() = worker_id
    or auth.uid() in (select buyer_id from jobs where jobs.id = bids.job_id)
  );
create policy "bids insertable by worker" on bids for insert with check (auth.uid() = worker_id);
create policy "bids updatable by involved parties" on bids for update
  using (
    auth.uid() = worker_id
    or auth.uid() in (select buyer_id from jobs where jobs.id = bids.job_id)
  );

-- transactions: only buyer & assigned worker of that job can read
create policy "transactions readable by involved parties" on transactions for select
  using (
    auth.uid() in (
      select buyer_id from jobs where jobs.id = transactions.job_id
      union
      select assigned_worker_id from jobs where jobs.id = transactions.job_id
    )
  );

-- reviews: public read, only reviewer can insert
create policy "reviews readable by all" on reviews for select using (true);
create policy "reviews insertable by reviewer" on reviews for insert with check (auth.uid() = reviewer_id);
