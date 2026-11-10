-- College Sathi — core schema sketch (Postgres 16) with RLS.
-- Apply with: psql $DATABASE_URL -f db/schema.sql

create extension if not exists "pgcrypto";

create table if not exists groups (
  id           text primary key,
  slug         text unique not null,
  name         text not null,
  created_at   timestamptz default now()
);

create table if not exists campuses (
  id           text primary key,
  group_id     text not null references groups(id),
  slug         text not null,
  name         text not null,
  city         text,
  academic_year text,
  branding     jsonb default '{}'::jsonb,
  holidays     jsonb default '[]'::jsonb
);

create table if not exists users (
  id           uuid primary key default gen_random_uuid(),
  group_id     text not null references groups(id),
  campus_id    text references campuses(id),
  role         text not null check (role in ('student','parent','faculty','hod','admin','accounts','librarian')),
  name         text not null,
  email        text,
  phone        text,
  two_factor   boolean default false,
  created_at   timestamptz default now()
);

create table if not exists audit_log (
  id           bigserial primary key,
  group_id     text,
  campus_id    text,
  actor_id     uuid,
  role         text,
  action       text not null,
  entity       text,
  before       jsonb,
  after        jsonb,
  ip           inet,
  at           timestamptz default now()
);

create table if not exists admissions_applications (
  id           text primary key,
  group_id     text not null,
  campus_id    text,
  applicant    jsonb not null,
  preferences  jsonb default '[]'::jsonb,
  status       text default 'draft',
  fee_paid     boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table if not exists attendance_sessions (
  id           uuid primary key default gen_random_uuid(),
  campus_id    text not null,
  section_id   text not null,
  subject_code text not null,
  faculty_id   uuid,
  mode         text not null,
  opened_at    timestamptz default now(),
  closed_at    timestamptz,
  edit_until   timestamptz
);

create table if not exists attendance_marks (
  session_id   uuid references attendance_sessions(id) on delete cascade,
  student_id   uuid not null,
  status       text not null check (status in ('present','absent','late','flagged')),
  marked_at    timestamptz default now(),
  device_id    text,
  geo          point,
  primary key (session_id, student_id)
);

create table if not exists fee_invoices (
  id           uuid primary key default gen_random_uuid(),
  campus_id    text not null,
  student_id   uuid not null,
  heads        jsonb not null,
  total        numeric(12,2) not null,
  due_date     date,
  status       text default 'issued'
);

-- Row level security: every row is scoped by the session variables that
-- DbService sets on each transaction.
alter table campuses enable row level security;
alter table admissions_applications enable row level security;
alter table fee_invoices enable row level security;
alter table attendance_sessions enable row level security;

drop policy if exists campus_scope on campuses;
create policy campus_scope on campuses using (
  group_id = current_setting('app.group_id', true)
  and (current_setting('app.campus_id', true) = '' or id = current_setting('app.campus_id', true))
);

drop policy if exists application_scope on admissions_applications;
create policy application_scope on admissions_applications using (
  group_id = current_setting('app.group_id', true)
);

drop policy if exists invoice_scope on fee_invoices;
create policy invoice_scope on fee_invoices using (
  campus_id = current_setting('app.campus_id', true)
);

drop policy if exists session_scope on attendance_sessions;
create policy session_scope on attendance_sessions using (
  campus_id = current_setting('app.campus_id', true)
);

insert into groups (id, slug, name) values ('grp_collegesathi', 'collegesathi', 'College Sathi') on conflict do nothing;
insert into campuses (id, group_id, slug, name, city, academic_year) values
  ('cmp_main', 'grp_collegesathi', 'main', 'Main Campus', 'Kolkata', '2026-27'),
  ('cmp_north', 'grp_collegesathi', 'north', 'North Campus', 'Siliguri', '2026-27'),
  ('cmp_south', 'grp_collegesathi', 'south', 'South Campus', 'Kolkata', '2026-27'),
  ('cmp_poly', 'grp_collegesathi', 'polytechnic', 'Polytechnic Campus', 'Kalyani', '2026-27')
on conflict do nothing;
