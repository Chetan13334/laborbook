-- Supabase Schema Setup for LaborBook

-- 1. Profiles Table (Auth tied)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Secure the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Laborers Table (Data migration structure)
CREATE TABLE IF NOT EXISTS public.laborers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  initials TEXT,
  name TEXT NOT NULL,
  role TEXT,
  status TEXT DEFAULT 'Present',
  amount TEXT,
  amount_color TEXT,
  badge TEXT,
  badge_bg TEXT,
  badge_text TEXT,
  muted BOOLEAN DEFAULT FALSE,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Secure the laborers table
ALTER TABLE public.laborers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own laborers"
  ON public.laborers
  USING (auth.uid() = user_id);

-- Note: We will eventually need triggers to auto-create profiles on auth.users insert.
