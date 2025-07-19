/*
  # Fix RLS policies for news_items table

  1. Security Updates
    - Add policy for authenticated users to manage news_items
    - Add policy for anonymous users to manage news_items (for demo purposes)
    - Add policy for public read access to news_items
    - Ensure RLS is enabled on news_items table

  This migration fixes the RLS policy violation error when inserting news articles.
*/

-- Ensure RLS is enabled
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to news_items" ON news_items;
DROP POLICY IF EXISTS "Allow authenticated users to manage news_items" ON news_items;
DROP POLICY IF EXISTS "Allow anonymous manage on news_items" ON news_items;

-- Allow public read access to news_items
CREATE POLICY "Allow public read access to news_items"
  ON news_items
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage news_items
CREATE POLICY "Allow authenticated users to manage news_items"
  ON news_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to manage news_items (for demo purposes)
CREATE POLICY "Allow anonymous manage on news_items"
  ON news_items
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);