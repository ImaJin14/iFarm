/*
  # Role-Based Access Control System

  1. New Tables
    - Updates `users` table with proper role enum
    - Adds RLS policies for role-based access
    - Creates helper functions for role checking

  2. Security
    - Enable RLS on all tables
    - Add role-specific policies
    - Create secure role checking functions

  3. Roles
    - administrator: Full control over public pages and site settings
    - farm: Manages farm operations and data
    - customer: Read-only access to public content
*/

-- Update user role enum to match requirements
DO $$
BEGIN
  -- Drop existing enum if it exists and recreate with new values
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    -- First, update any existing data to use new role names
    UPDATE users SET role = 'customer' WHERE role = 'client';
    UPDATE users SET role = 'farm' WHERE role = 'farm_owner';
    UPDATE users SET role = 'administrator' WHERE role = 'superuser';
    
    -- Drop and recreate the enum
    ALTER TYPE user_role RENAME TO user_role_old;
    CREATE TYPE user_role AS ENUM ('administrator', 'farm', 'customer');
    ALTER TABLE users ALTER COLUMN role TYPE user_role USING role::text::user_role;
    DROP TYPE user_role_old;
  ELSE
    CREATE TYPE user_role AS ENUM ('administrator', 'farm', 'customer');
  END IF;
END $$;

-- Create helper functions for role checking
CREATE OR REPLACE FUNCTION is_administrator()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT role = 'administrator'
    FROM users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_farm_user()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT role = 'farm'
    FROM users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_customer()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT role = 'customer'
    FROM users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
  RETURN (
    SELECT role
    FROM users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for public content tables (administrator access)
-- Home Content
DROP POLICY IF EXISTS "Allow authenticated users to manage home_content" ON home_content;
DROP POLICY IF EXISTS "Superusers can manage all home_content" ON home_content;

CREATE POLICY "Administrators can manage home_content"
  ON home_content
  FOR ALL
  TO authenticated
  USING (is_administrator())
  WITH CHECK (is_administrator());

CREATE POLICY "Public can view home_content"
  ON home_content
  FOR SELECT
  TO public
  USING (true);

-- About Content
DROP POLICY IF EXISTS "Allow authenticated users to manage about_content" ON about_content;
DROP POLICY IF EXISTS "Superusers can manage all about_content" ON about_content;

CREATE POLICY "Administrators can manage about_content"
  ON about_content
  FOR ALL
  TO authenticated
  USING (is_administrator())
  WITH CHECK (is_administrator());

-- Contact Content
DROP POLICY IF EXISTS "Superusers can manage all contact_content" ON contact_content;

CREATE POLICY "Administrators can manage contact_content"
  ON contact_content
  FOR ALL
  TO authenticated
  USING (is_administrator())
  WITH CHECK (is_administrator());

-- Farm Settings
DROP POLICY IF EXISTS "Allow anonymous manage on farm_settings" ON farm_settings;
DROP POLICY IF EXISTS "Allow authenticated users to manage farm_settings" ON farm_settings;
DROP POLICY IF EXISTS "Superusers can manage all farm_settings" ON farm_settings;

CREATE POLICY "Administrators can manage farm_settings"
  ON farm_settings
  FOR ALL
  TO authenticated
  USING (is_administrator())
  WITH CHECK (is_administrator());

CREATE POLICY "Farm users can view farm_settings"
  ON farm_settings
  FOR SELECT
  TO authenticated
  USING (is_farm_user());

-- Update RLS policies for farm operational tables (farm user access)
-- Animals
DROP POLICY IF EXISTS "Superusers can manage all animals" ON animals;

CREATE POLICY "Farm users can manage animals"
  ON animals
  FOR ALL
  TO authenticated
  USING (is_farm_user())
  WITH CHECK (is_farm_user());

CREATE POLICY "Administrators can manage all animals"
  ON animals
  FOR ALL
  TO authenticated
  USING (is_administrator())
  WITH CHECK (is_administrator());

-- Breeding Records
DROP POLICY IF EXISTS "Superusers can manage all breeding_records" ON breeding_records;

CREATE POLICY "Farm users can manage breeding_records"
  ON breeding_records
  FOR ALL
  TO authenticated
  USING (is_farm_user())
  WITH CHECK (is_farm_user());

CREATE POLICY "Administrators can view breeding_records"
  ON breeding_records
  FOR SELECT
  TO authenticated
  USING (is_administrator());

-- Inventory
DROP POLICY IF EXISTS "Superusers can manage all inventory" ON inventory;

CREATE POLICY "Farm users can manage inventory"
  ON inventory
  FOR ALL
  TO authenticated
  USING (is_farm_user())
  WITH CHECK (is_farm_user());

CREATE POLICY "Administrators can view inventory"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (is_administrator());

-- Bi-Products
DROP POLICY IF EXISTS "Superusers can manage all bi_products" ON bi_products;

CREATE POLICY "Farm users can manage bi_products"
  ON bi_products
  FOR ALL
  TO authenticated
  USING (is_farm_user())
  WITH CHECK (is_farm_user());

-- News Items
DROP POLICY IF EXISTS "Superusers can manage all news_items" ON news_items;

CREATE POLICY "Farm users can manage news_items"
  ON news_items
  FOR ALL
  TO authenticated
  USING (is_farm_user())
  WITH CHECK (is_farm_user());

CREATE POLICY "Administrators can manage all news_items"
  ON news_items
  FOR ALL
  TO authenticated
  USING (is_administrator())
  WITH CHECK (is_administrator());

-- Education Guides
DROP POLICY IF EXISTS "Superusers can manage all education_guides" ON education_guides;

CREATE POLICY "Farm users can manage education_guides"
  ON education_guides
  FOR ALL
  TO authenticated
  USING (is_farm_user())
  WITH CHECK (is_farm_user());

CREATE POLICY "Administrators can manage all education_guides"
  ON education_guides
  FOR ALL
  TO authenticated
  USING (is_administrator())
  WITH CHECK (is_administrator());

-- FAQs
DROP POLICY IF EXISTS "Superusers can manage all faqs" ON faqs;

CREATE POLICY "Farm users can manage faqs"
  ON faqs
  FOR ALL
  TO authenticated
  USING (is_farm_user())
  WITH CHECK (is_farm_user());

CREATE POLICY "Administrators can manage all faqs"
  ON faqs
  FOR ALL
  TO authenticated
  USING (is_administrator())
  WITH CHECK (is_administrator());

-- Team Members
DROP POLICY IF EXISTS "Superusers can manage all team_members" ON team_members;

CREATE POLICY "Farm users can manage team_members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (is_farm_user())
  WITH CHECK (is_farm_user());

CREATE POLICY "Administrators can manage all team_members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (is_administrator())
  WITH CHECK (is_administrator());

-- Update Users table policies
DROP POLICY IF EXISTS "Superusers can manage all users" ON users;

CREATE POLICY "Administrators can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (is_administrator())
  WITH CHECK (is_administrator());

-- Animal Types (reference data - farm users can suggest, administrators approve)
DROP POLICY IF EXISTS "Superusers can manage animal types" ON animal_types;

CREATE POLICY "Farm users can suggest animal_types"
  ON animal_types
  FOR INSERT
  TO authenticated
  USING (is_farm_user());

CREATE POLICY "Administrators can manage animal_types"
  ON animal_types
  FOR ALL
  TO authenticated
  USING (is_administrator())
  WITH CHECK (is_administrator());