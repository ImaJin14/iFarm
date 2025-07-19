/*
  # Fix bi_products RLS policies for anonymous access

  1. Security Updates
    - Add policy to allow anonymous users to insert into bi_products table
    - Add policy to allow anonymous users to update bi_products table  
    - Add policy to allow anonymous users to delete from bi_products table
    
  This enables the management interface to work without requiring authentication,
  similar to the existing policies for animals, breeding_records, and inventory tables.
*/

-- Allow anonymous users to insert into bi_products
CREATE POLICY "Allow anonymous insert on bi_products"
  ON bi_products
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to update bi_products
CREATE POLICY "Allow anonymous update on bi_products"
  ON bi_products
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to delete from bi_products
CREATE POLICY "Allow anonymous delete on bi_products"
  ON bi_products
  FOR DELETE
  TO anon
  USING (true);