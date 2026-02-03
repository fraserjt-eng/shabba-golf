-- Row Level Security Policies

-- Enable RLS on all tables
alter table users enable row level security;
alter table teams enable row level security;
alter table rounds enable row level security;
alter table games enable row level security;
alter table backout_fees enable row level security;
alter table settlements enable row level security;

-- Users: can read own profile, update own profile
create policy "Users can read own profile"
  on users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on users for update
  using (auth.uid() = id);

-- Teams: members can read their teams
create policy "Team members can read team"
  on teams for select
  using (auth.uid() = any(member_ids));

create policy "Team admins can update team"
  on teams for update
  using (auth.uid() = any(admin_ids));

create policy "Authenticated users can create teams"
  on teams for insert
  with check (auth.uid() = any(admin_ids));

-- Rounds: team members can read rounds
create policy "Team members can read rounds"
  on rounds for select
  using (
    exists (
      select 1 from teams
      where teams.id = rounds.team_id
      and auth.uid() = any(teams.member_ids)
    )
  );

create policy "Team members can create rounds"
  on rounds for insert
  with check (
    exists (
      select 1 from teams
      where teams.id = rounds.team_id
      and auth.uid() = any(teams.member_ids)
    )
  );

create policy "Round creator or admin can update rounds"
  on rounds for update
  using (
    created_by = auth.uid()
    or exists (
      select 1 from teams
      where teams.id = rounds.team_id
      and auth.uid() = any(teams.admin_ids)
    )
  );

-- Games: accessible to team members via round
create policy "Team members can read games"
  on games for select
  using (
    exists (
      select 1 from rounds
      join teams on teams.id = rounds.team_id
      where rounds.id = games.round_id
      and auth.uid() = any(teams.member_ids)
    )
  );

create policy "Team members can create games"
  on games for insert
  with check (
    exists (
      select 1 from rounds
      join teams on teams.id = rounds.team_id
      where rounds.id = games.round_id
      and auth.uid() = any(teams.member_ids)
    )
  );

create policy "Team members can update games"
  on games for update
  using (
    exists (
      select 1 from rounds
      join teams on teams.id = rounds.team_id
      where rounds.id = games.round_id
      and auth.uid() = any(teams.member_ids)
    )
  );

-- Backout fees: readable by team members
create policy "Team members can read backout fees"
  on backout_fees for select
  using (
    exists (
      select 1 from rounds
      join teams on teams.id = rounds.team_id
      where rounds.id = backout_fees.round_id
      and auth.uid() = any(teams.member_ids)
    )
  );

-- Settlements: readable by involved parties
create policy "Involved users can read settlements"
  on settlements for select
  using (auth.uid() = from_user_id or auth.uid() = to_user_id);

create policy "Involved users can update settlements"
  on settlements for update
  using (auth.uid() = from_user_id or auth.uid() = to_user_id);
