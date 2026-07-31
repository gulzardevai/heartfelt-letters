-- "How well do you know me?" user-generated quiz builder.
-- Anonymous UGC: no auth. Ownership is via an unguessable owner_token generated
-- on create. ALL writes go through server route handlers using the service role
-- key (which bypasses RLS); RLS is ON with no policies, so the anon/public key
-- can neither read nor write these tables directly.

create table if not exists quizzes (
  id text primary key,               -- short unguessable slug (nanoid)
  owner_token text not null,         -- unguessable; only way to view the scoreboard
  title text not null,
  creator_name text not null,        -- display name the quiz is "about"
  questions jsonb not null,          -- [{ q, options: string[], correct_index }]
  ip_address text,
  created_at timestamptz not null default now()
);

create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id text not null references quizzes(id) on delete cascade,
  taker_name text not null,
  answers jsonb not null,            -- number[] chosen option index per question
  score int not null,
  total int not null,
  ip_address text,
  created_at timestamptz not null default now()
);

create index if not exists quiz_attempts_quiz_id_idx on quiz_attempts(quiz_id);
create index if not exists quizzes_ip_created_idx on quizzes(ip_address, created_at);
create index if not exists quiz_attempts_ip_created_idx on quiz_attempts(ip_address, created_at);

-- RLS ON, deliberately NO policies: only the service role (server-side) can touch
-- these tables. The take page reads the quiz server-side and strips correct_index
-- before sending it to the browser, so the answer key never reaches a taker.
alter table quizzes enable row level security;
alter table quiz_attempts enable row level security;
