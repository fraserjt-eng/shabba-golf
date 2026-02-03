-- Golf Squad: Initial Schema
-- 6 core tables with constraints, indexes, and JSONB fields

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  display_name text not null,
  avatar_url text,
  phone text,
  handicap numeric(4,1),
  stats jsonb default '{"rounds_played":0,"average_score":null,"best_score":null,"total_winnings":0,"total_losses":0,"backout_count":0}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_users_email on users(email);

-- Teams
create table teams (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null default 'weekly' check (type in ('weekly', 'tournament', 'casual')),
  description text,
  member_ids uuid[] not null default '{}',
  admin_ids uuid[] not null default '{}',
  invite_code text unique,
  settings jsonb default '{"backout_fee_schedule":{"before_lock":0,"after_lock":10,"no_show":25},"default_game_types":["skins"],"require_signup":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_teams_invite_code on teams(invite_code) where invite_code is not null;

-- Rounds
create table rounds (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id) on delete cascade,
  course_name text not null,
  date date not null,
  tee_time time,
  status text not null default 'upcoming' check (status in ('upcoming', 'signup_open', 'locked', 'in_progress', 'completed', 'cancelled')),
  signup_deadline timestamptz,
  max_players integer check (max_players > 0),
  signed_up_ids uuid[] not null default '{}',
  created_by uuid not null references users(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_rounds_team_id on rounds(team_id);
create index idx_rounds_date on rounds(date);
create index idx_rounds_status on rounds(status);

-- Games
create table games (
  id uuid primary key default uuid_generate_v4(),
  round_id uuid not null references rounds(id) on delete cascade,
  type text not null check (type in ('skins', 'nassau', 'match_play', 'stroke', 'best_ball', 'scramble')),
  name text not null,
  buy_in numeric(8,2) not null default 0,
  player_ids uuid[] not null default '{}',
  results jsonb,
  settled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_games_round_id on games(round_id);

-- Backout Fees
create table backout_fees (
  id uuid primary key default uuid_generate_v4(),
  round_id uuid not null references rounds(id) on delete cascade,
  user_id uuid not null references users(id),
  timing text not null check (timing in ('before_lock', 'after_lock', 'no_show')),
  amount numeric(8,2) not null,
  reason text,
  created_at timestamptz not null default now()
);

create index idx_backout_fees_round_id on backout_fees(round_id);
create index idx_backout_fees_user_id on backout_fees(user_id);

-- Settlements
create table settlements (
  id uuid primary key default uuid_generate_v4(),
  round_id uuid not null references rounds(id) on delete cascade,
  from_user_id uuid not null references users(id),
  to_user_id uuid not null references users(id),
  amount numeric(8,2) not null check (amount > 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'disputed', 'forgiven')),
  settled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_settlements_round_id on settlements(round_id);
create index idx_settlements_from_user on settlements(from_user_id);
create index idx_settlements_to_user on settlements(to_user_id);
create index idx_settlements_status on settlements(status);

-- Updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger trg_users_updated_at before update on users for each row execute function update_updated_at();
create trigger trg_teams_updated_at before update on teams for each row execute function update_updated_at();
create trigger trg_rounds_updated_at before update on rounds for each row execute function update_updated_at();
create trigger trg_games_updated_at before update on games for each row execute function update_updated_at();
create trigger trg_settlements_updated_at before update on settlements for each row execute function update_updated_at();
