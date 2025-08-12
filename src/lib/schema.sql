-- Create tables for the community section
create table topics (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create profiles table for authenticated users
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table posts (
  id uuid default gen_random_uuid() primary key,
  topic_id uuid references topics(id) on delete cascade,
  user_id uuid references auth.users,
  author text not null,
  content text not null,
  location text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table replies (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references auth.users,
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

create policy "Allow public read access to profiles"
  on profiles for select
  to anon
  using (true);

create policy "Allow users to update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Allow users to delete their own profile"
  on profiles for delete
  using (auth.uid() = id);

create policy "Allow authenticated users to create topics"
  on topics for insert
  to authenticated
  with check (true);

create policy "Allow users to create posts"
  on posts for insert
  to anon
  with check (true);

create policy "Allow users to create replies"
  on replies for insert
  to anon
  with check (true);

create policy "Allow users to update their own posts"
  on posts for update
  using (auth.uid() = user_id);

create policy "Allow users to delete their own posts"
  on posts for delete
  using (auth.uid() = user_id);

create policy "Allow users to update their own replies"
  on replies for update
  using (auth.uid() = user_id);

create policy "Allow users to delete their own replies"
  on replies for delete
  using (auth.uid() = user_id);

-- Insert initial topics
insert into topics (title, description) values
  ('General', 'Talk about anything related to the community.'),
  ('Finding Labubu', 'Share and find Labubu in your area!'),
  ('Labubu Hangouts', 'Share photos and stories of hanging out with your Labubu!');
