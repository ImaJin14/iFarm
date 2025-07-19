/*
  # Allow anonymous operations on animals table

  1. Security Changes
    - Add INSERT policy for anonymous users on animals table
    - Add UPDATE policy for anonymous users on animals table  
    - Add DELETE policy for anonymous users on animals table
    - Maintain existing SELECT policy for public read access

  This enables the management system to perform CRUD operations on animals
  since it uses its own authentication rather than Supabase auth.
*/

-- Allow anonymous users to insert animals
CREATE POLICY "Allow anonymous insert on animals"
  ON animals
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to update animals
CREATE POLICY "Allow anonymous update on animals"
  ON animals
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to delete animals
CREATE POLICY "Allow anonymous delete on animals"
  ON animals
  FOR DELETE
  TO anon
  USING (true);