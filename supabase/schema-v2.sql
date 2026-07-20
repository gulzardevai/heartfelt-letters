-- User profiles (auto-created on signup via trigger)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  plan text default 'free' check (plan in ('free', 'pro')),
  letter_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Add user_id and expiry to letters
alter table letters add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table letters add column if not exists expires_at timestamptz;
alter table letters add column if not exists is_deleted boolean default false;
create index if not exists letters_user_id_idx on letters(user_id);
create index if not exists letters_expires_at_idx on letters(expires_at);

-- RLS on letters
alter table letters enable row level security;
create policy "Anyone can read non-deleted letters" on letters for select using (is_deleted = false and (expires_at is null or expires_at > now()));
create policy "Authenticated users can insert letters" on letters for insert with check (auth.uid() = user_id);
create policy "Users can update own letters" on letters for update using (auth.uid() = user_id);
create policy "Users can delete own letters" on letters for delete using (auth.uid() = user_id);

-- Blog posts
create table if not exists blog_posts (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null,
  cover_image text,
  author text default 'Heartfelt Letters Team',
  tags text[] default '{}',
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table blog_posts enable row level security;
create policy "Anyone can read published posts" on blog_posts for select using (published = true);

-- Trigger: create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function increment_letter_count(user_id uuid)
returns void as $$
  update profiles set letter_count = letter_count + 1, updated_at = now()
  where id = user_id;
$$ language sql security definer;

-- Seed blog posts
insert into blog_posts (slug, title, excerpt, content, published, published_at, tags) values
(
  'how-to-write-a-love-letter',
  'How to Write a Love Letter That Will Be Treasured Forever',
  'A heartfelt love letter is one of the most intimate and meaningful gifts you can give. Here''s how to write one that truly moves the heart.',
  '<p>In a world of instant messages and emoji reactions, a genuine love letter stands apart. It says: <em>I took time. I thought of you. You are worth every word.</em></p><h2>Start with your feelings, not facts</h2><p>Don''t begin with "I am writing this letter to..." — begin with feeling. "Every morning I wake up thinking of you" is infinitely more powerful than any formal opener.</p><h2>Be specific and personal</h2><p>Generic compliments feel hollow. Instead of "you are beautiful," try "the way your face lights up when you talk about something you love makes my whole world brighter." Specificity is intimacy.</p><h2>Write as you speak</h2><p>Don''t try to sound like a Victorian poet. Write the way you would speak to them in a quiet moment — honest, warm, a little vulnerable. Authenticity is more moving than eloquence.</p><h2>Include a memory</h2><p>Anchor your letter in a shared moment. A specific memory says "I hold our time together close" in a way that abstract declarations of love cannot.</p><h2>End with a promise or a hope</h2><p>Close your letter looking forward. What do you wish for together? What do you promise? End on something that opens a door, not closes one.</p><p>The most important thing? Just begin. A letter written imperfectly is infinitely more meaningful than a perfect one never written.</p>',
  true, now(), ARRAY['love', 'tips', 'writing']
),
(
  'birthday-letter-ideas',
  '10 Heartfelt Birthday Letter Ideas for Every Relationship',
  'From parents to best friends, here are creative ideas for writing a birthday letter that will mean the world to someone special.',
  '<p>A birthday is the perfect moment to tell someone how much they mean to you. Cards are lovely, but a letter — a real, personal letter — is something they will keep forever.</p><h2>1. For your parent</h2><p>Thank them for something specific they taught you. Not "thank you for everything" but "thank you for the way you always showed up to every game, even the ones I played terribly."</p><h2>2. For your best friend</h2><p>Celebrate who they''ve become. Remind them of how far they''ve come and how proud you are to know them.</p><h2>3. For your partner</h2><p>Write about what this year with them has meant to you. Be honest, be tender, be specific.</p><h2>4. For your child</h2><p>Capture who they are at this exact age. One day they will read it and see themselves through your loving eyes.</p><h2>5. For a colleague</h2><p>Acknowledge the qualities that make them exceptional to work with — the ones that often go unspoken.</p><h2>6. For a mentor</h2><p>Tell them how they changed your trajectory. Mentors rarely know the depth of their impact.</p><h2>7. For a sibling</h2><p>Reminisce about a shared memory. Siblings carry the longest chapters of your story.</p><h2>8. For a neighbor</h2><p>Appreciate the small ways they make life nicer. These notes are often the most unexpected and treasured.</p><h2>9. For someone going through a hard year</h2><p>Acknowledge it. "I know this year has been hard, and I want you to know I see how bravely you''ve carried it."</p><h2>10. For someone far away</h2><p>Let the letter do what distance prevents — close the gap. Write as if they''re sitting right across from you.</p>',
  true, now() - interval '3 days', ARRAY['birthday', 'ideas', 'tips']
),
(
  'why-handwritten-letters-matter',
  'Why Letters Still Matter in the Age of Instant Messaging',
  'We live in a world of instant communication. So why does a letter — digital or handwritten — still carry more weight than any text ever could?',
  '<p>We can reach anyone, anywhere, instantly. So why does a letter feel like such a radical act of love?</p><h2>Because it takes time</h2><p>Time is the most finite resource we have. When someone spends it crafting words just for you, that investment is felt. A three-line text costs seconds. A letter costs something real.</p><h2>Because it demands thought</h2><p>Texting is reactive. Letter writing is reflective. To write a good letter, you have to sit with your feelings, examine them, and find the words that match. That process — even when imperfect — creates something the recipient can sense.</p><h2>Because it becomes an artifact</h2><p>A text lives in a notification. A letter lives in a drawer, a box, a special place. People keep letters for decades. They reread them. They find them years later and feel everything all over again.</p><h2>Because vulnerability is rare and beautiful</h2><p>Digital communication has an inherent casualness that makes vulnerability feel out of place. A letter creates a container for the things we are almost too afraid to say — and the recipient feels that courage.</p><h2>Because someone who receives a letter knows they are loved</h2><p>Not liked. Not thought of briefly. <em>Loved</em>. There is simply no substitute for that.</p><p>That is why we built Heartfelt Letters — to make it easy to write something real, in a world that makes everything else so fast.</p>',
  true, now() - interval '7 days', ARRAY['reflections', 'writing']
)
on conflict (slug) do nothing;
