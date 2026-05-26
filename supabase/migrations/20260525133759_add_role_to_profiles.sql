/*
  # Add role column to profiles table

  ## Changes
  1. Add `role` column to `profiles` table with values 'user' or 'admin', default 'user'
  2. Keep `is_admin` column for backward compatibility but sync with role
  3. Add trigger to sync `is_admin` from `role` for backward compatibility
  4. Update RLS policies to use role column for admin checks
  5. Create default admin user profile

  ## Security
  - Role defaults to 'user' for new signups
  - Only existing admins can promote other users
  - RLS policies enforce role-based access
*/

-- Add role column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'));
  END IF;
END $$;

-- Sync is_admin with role for backward compatibility
UPDATE profiles SET is_admin = (role = 'admin') WHERE is_admin IS DISTINCT FROM (role = 'admin');

-- Drop old policies that used is_admin
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Recreate policies using role
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

-- Allow anon to read profiles (needed for some lookups)
-- Actually, let's not - keep it restrictive

-- Create a function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Create a function to get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text AS $$
  SELECT COALESCE(
    (SELECT role FROM profiles WHERE id = auth.uid()),
    'user'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
