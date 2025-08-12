-- Create tables for the community section
create table topics (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table posts (
  id uuid default gen_random_uuid() primary key,
  topic_id uuid references topics(id) on delete cascade,
  author text not null,
  content text not null,
  location text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table replies (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade,
  author text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table topics enable row level security;
alter table posts enable row level security;
alter table replies enable row level security;

-- Create policies
create policy "Allow public read access to topics"
  on topics for select
  to anon
  using (true);

create policy "Allow public read access to posts"
  on posts for select
  to anon
  using (true);

create policy "Allow public read access to replies"
  on replies for select
  to anon
  using (true);

create policy "Allow authenticated users to create topics"
  on topics for insert
  to authenticated
  with check (true);

create policy "Allow authenticated users to create posts"
  on posts for insert
  to authenticated
  with check (true);

create policy "Allow authenticated users to create replies"
  on replies for insert
  to authenticated
  with check (true);

-- Insert initial topics
insert into topics (title, description) values
  ('General', 'Talk about anything related to the community.'),
  ('Finding Labubu', 'Share and find Labubu in your area!'),
  ('Labubu Hangouts', 'Share photos and stories of hanging out with your Labubu!');
