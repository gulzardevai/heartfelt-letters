create table letters (
  id uuid default gen_random_uuid() primary key,
  share_id text unique not null,
  title text,
  type text not null,
  content text not null,
  recipient_name text,
  sender_name text,
  has_password boolean default false,
  password_hash text,
  created_at timestamptz default now(),
  view_count integer default 0
);

create index on letters(share_id);

alter table letters enable row level security;

create policy "Letters are publicly readable by share_id" on letters
  for select using (true);

create policy "Anyone can create letters" on letters
  for insert with check (true);

create policy "Allow view count updates" on letters
  for update using (true);
