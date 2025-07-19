/*
  # Implement Comprehensive RLS Policies

  This migration implements Row Level Security (RLS) policies for all tables to ensure proper role-based access control.

  ## Security Implementation
  1. Enable RLS on all tables that don't have it yet
  2. Create comprehensive policies for each role (administrator, farm, customer)
  3. Ensure data security at the database level

  ## Policy Structure
  - **Public Read Access**: Most content tables allow anonymous and authenticated users to read
  - **Farm Management**: Farm users and administrators can manage operational data
  - **Administrator Only**: Site content and settings restricted to administrators
  - **User Data**: Users can only access their own data, administrators can access all

  ## Tables Covered
  - bi_products
  - breeding_records  
  - inventory
  - education_guides
  - faqs
  - news_items
  - team_members
  - farm_settings
*/

-- Enable RLS on tables that don't have it yet
ALTER TABLE bi_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE breeding_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- BI_PRODUCTS POLICIES
-- ============================================================================

-- Anyone can read bi-products
CREATE POLICY "Anyone can read bi-products"
  ON bi_products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Farm users and administrators can manage bi-products
CREATE POLICY "Farm users and administrators can manage bi-products"
  ON bi_products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('farm', 'administrator')
    )
  );

-- ============================================================================
-- BREEDING_RECORDS POLICIES
-- ============================================================================

-- Anyone can read breeding records
CREATE POLICY "Anyone can read breeding records"
  ON breeding_records
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Farm users and administrators can manage breeding records
CREATE POLICY "Farm users and administrators can manage breeding records"
  ON breeding_records
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('farm', 'administrator')
    )
  );

-- ============================================================================
-- INVENTORY POLICIES
-- ============================================================================

-- Only farm users and administrators can read inventory
CREATE POLICY "Farm users and administrators can read inventory"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('farm', 'administrator')
    )
  );

-- Farm users and administrators can manage inventory
CREATE POLICY "Farm users and administrators can manage inventory"
  ON inventory
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('farm', 'administrator')
    )
  );

-- ============================================================================
-- EDUCATION_GUIDES POLICIES
-- ============================================================================

-- Anyone can read education guides
CREATE POLICY "Anyone can read education guides"
  ON education_guides
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Farm users and administrators can manage education guides
CREATE POLICY "Farm users and administrators can manage education guides"
  ON education_guides
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('farm', 'administrator')
    )
  );

-- ============================================================================
-- FAQS POLICIES
-- ============================================================================

-- Anyone can read FAQs
CREATE POLICY "Anyone can read FAQs"
  ON faqs
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Farm users and administrators can manage FAQs
CREATE POLICY "Farm users and administrators can manage FAQs"
  ON faqs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('farm', 'administrator')
    )
  );

-- ============================================================================
-- NEWS_ITEMS POLICIES
-- ============================================================================

-- Anyone can read news items
CREATE POLICY "Anyone can read news items"
  ON news_items
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Farm users and administrators can manage news items
CREATE POLICY "Farm users and administrators can manage news items"
  ON news_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('farm', 'administrator')
    )
  );

-- ============================================================================
-- TEAM_MEMBERS POLICIES
-- ============================================================================

-- Anyone can read team members
CREATE POLICY "Anyone can read team members"
  ON team_members
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only administrators can manage team members
CREATE POLICY "Administrators can manage team members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'administrator'
    )
  );

-- ============================================================================
-- FARM_SETTINGS POLICIES
-- ============================================================================

-- Anyone can read farm settings (for public display)
CREATE POLICY "Anyone can read farm settings"
  ON farm_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only administrators can manage farm settings
CREATE POLICY "Administrators can manage farm settings"
  ON farm_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'administrator'
    )
  );