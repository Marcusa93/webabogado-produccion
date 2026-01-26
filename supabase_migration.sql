-- =====================================================
-- SUPABASE DATABASE MIGRATION SCRIPT
-- Legal-Tech Platform - Authentication & Tool History
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USER PROFILES TABLE
-- =====================================================

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'premium', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- 2. COTIO HISTORY TABLE
-- =====================================================

CREATE TABLE public.cotio_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  input_prompt TEXT NOT NULL,
  document_type TEXT,
  jurisdiction TEXT,
  anonimize BOOLEAN DEFAULT true,
  output_result TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cotio_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own COTIO history"
  ON public.cotio_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own COTIO history"
  ON public.cotio_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own COTIO history"
  ON public.cotio_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 3. HASH HISTORY TABLE
-- =====================================================

CREATE TABLE public.hash_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_input TEXT NOT NULL,
  hash_type TEXT NOT NULL CHECK (hash_type IN ('SHA-256', 'SHA-512', 'MD5')),
  hash_result TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.hash_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own hash history"
  ON public.hash_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hash history"
  ON public.hash_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own hash history"
  ON public.hash_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 4. PERFORMANCE INDEXES
-- =====================================================

CREATE INDEX idx_cotio_history_user_id ON public.cotio_history(user_id);
CREATE INDEX idx_cotio_history_created_at ON public.cotio_history(created_at DESC);
CREATE INDEX idx_hash_history_user_id ON public.hash_history(user_id);
CREATE INDEX idx_hash_history_created_at ON public.hash_history(created_at DESC);

-- =====================================================
-- 5. AUTOMATIC TRIGGERS
-- =====================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 6. GRANT PERMISSIONS (if needed for service role)
-- =====================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Next steps:
-- 1. Update your .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
-- 2. Go to Supabase Dashboard → Authentication → Email Templates
--    and customize the email templates with your branding
-- 3. Test the authentication flow
-- =====================================================
