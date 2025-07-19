/*
  # Fix inventory table RLS policy for INSERT operations

  1. Security Updates
    - Add INSERT policy for authenticated users on inventory table
    - Allow authenticated users to create new inventory items
    - Maintain existing SELECT policies for public access

  2. Changes
    - Create policy "Allow authenticated users to insert inventory items"
    - Ensures authenticated users can add new inventory through the management system
*/

-- Add INSERT policy for authenticated users
CREATE POLICY "Allow authenticated users to insert inventory items"
  ON inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add UPDATE policy for authenticated users  
CREATE POLICY "Allow authenticated users to update inventory items"
  ON inventory
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add DELETE policy for authenticated users
CREATE POLICY "Allow authenticated users to delete inventory items"
  ON inventory
  FOR DELETE
  TO authenticated
  USING (true);