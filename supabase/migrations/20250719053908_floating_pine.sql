/*
  # Fix breeding_records RLS policy for anonymous operations

  1. Security Changes
    - Add INSERT policy for anonymous users on breeding_records table
    - Add UPDATE policy for anonymous users on breeding_records table  
    - Add DELETE policy for anonymous users on breeding_records table
    - Maintains existing SELECT policy for public access

  This allows the management system to function properly since it uses
  its own authentication rather than Supabase auth.
*/

-- Add INSERT policy for anonymous users
CREATE POLICY "Allow anonymous insert on breeding_records"
  ON breeding_records
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Add UPDATE policy for anonymous users
CREATE POLICY "Allow anonymous update on breeding_records"
  ON breeding_records
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Add DELETE policy for anonymous users
CREATE POLICY "Allow anonymous delete on breeding_records"
  ON breeding_records
  FOR DELETE
  TO anon
  USING (true);