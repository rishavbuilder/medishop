/*
  # Fix admin RLS policies to use is_admin() function

  ## Changes
  - Update DELETE policy on medicines to use is_admin() function instead of auth.jwt()
  - Update INSERT policy to require authenticated user  
  - Update UPDATE policy to use is_admin() function

  ## Security
  - Admin operations now properly check the profiles.role column
  - Non-admin users cannot insert/update/delete medicines
*/

-- Drop old policies
DROP POLICY IF EXISTS "Admins can delete medicines" ON medicines;
DROP POLICY IF EXISTS "Admins can insert medicines" ON medicines;
DROP POLICY IF EXISTS "Admins can update medicines" ON medicines;

-- Recreate policies using is_admin() function
CREATE POLICY "Admins can insert medicines"
  ON medicines FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update medicines"
  ON medicines FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete medicines"
  ON medicines FOR DELETE
  TO authenticated
  USING (is_admin());
