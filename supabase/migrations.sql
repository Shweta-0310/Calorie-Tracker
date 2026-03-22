-- Run this in your Supabase SQL editor to set up the database

-- Create meals table
create table if not exists meals (
  id uuid primary key default gen_random_uuid(),
  meal_name text not null,
  image_url text,
  calories float4 not null default 0,
  protein_g float4 not null default 0,
  carbs_g float4 not null default 0,
  fats_g float4 not null default 0,
  eaten_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Index for fast date range queries
create index if not exists meals_eaten_at_idx on meals (eaten_at);

-- Enable Row Level Security (optional, since we're skipping auth for now)
-- alter table meals enable row level security;

-- Storage bucket setup (run in Supabase dashboard → Storage → New bucket)
-- Bucket name: meal-images
-- Public: true (so image URLs are accessible)
