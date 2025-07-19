/*
  # Allow anonymous access to inventory operations

  1. Security Changes
    - Update INSERT policy to allow anonymous users
    - Update UPDATE policy to allow anonymous users  
    - Update DELETE policy to allow anonymous users
    - Keep SELECT policy for public access

  This allows the management system to work without Supabase authentication
  since it uses its own password-based access control.
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to insert inventory items" ON inventory;
DROP POLICY IF EXISTS "Allow authenticated users to update inventory items" ON inventory;
DROP POLICY IF EXISTS "Allow authenticated users to delete inventory items" ON inventory;

-- Create new policies that allow anonymous access for management operations
CREATE POLICY "Allow anonymous insert on inventory"
  ON inventory
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update on inventory"
  ON inventory
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete on inventory"
  ON inventory
  FOR DELETE
  TO anon
  USING (true);