/*
  # Content Management System

  1. New Tables
    - `home_content`
      - `id` (uuid, primary key)
      - `hero_title` (text)
      - `hero_subtitle` (text)
      - `hero_description` (text)
      - `hero_image_url` (text)
      - `hero_badge_text` (text)
      - `hero_features` (jsonb)
      - `featured_section_title` (text)
      - `featured_section_description` (text)
      - `news_section_title` (text)
      - `news_section_description` (text)
      - `cta_buttons` (jsonb)
      - `stats` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `about_content`
      - `id` (uuid, primary key)
      - `hero_intro_text` (text)
      - `mission_statement` (text)
      - `values_list` (jsonb)
      - `history_intro_text` (text)
      - `history_milestones` (jsonb)
      - `certifications_intro_text` (text)
      - `certifications_awards` (jsonb)
      - `gallery_intro_text` (text)
      - `gallery_images` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `contact_content`
      - `id` (uuid, primary key)
      - `hero_title` (text)
      - `hero_description` (text)
      - `contact_description` (text)
      - `address` (text)
      - `phone` (text)
      - `email` (text)
      - `business_hours` (jsonb)
      - `social_links` (jsonb)
      - `map_description` (text)
      - `newsletter_title` (text)
      - `newsletter_description` (text)
      - `newsletter_privacy_text` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Public read access for all users
    - Administrator write access only
*/

-- Create home_content table
CREATE TABLE IF NOT EXISTS home_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title text NOT NULL,
  hero_subtitle text NOT NULL,
  hero_description text NOT NULL,
  hero_image_url text NOT NULL,
  hero_badge_text text NOT NULL,
  hero_features jsonb DEFAULT '[]',
  featured_section_title text NOT NULL,
  featured_section_description text NOT NULL,
  news_section_title text NOT NULL,
  news_section_description text NOT NULL,
  cta_buttons jsonb DEFAULT '[]',
  stats jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create about_content table
CREATE TABLE IF NOT EXISTS about_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_intro_text text NOT NULL,
  mission_statement text NOT NULL,
  values_list jsonb DEFAULT '[]',
  history_intro_text text NOT NULL,
  history_milestones jsonb DEFAULT '[]',
  certifications_intro_text text NOT NULL,
  certifications_awards jsonb DEFAULT '[]',
  gallery_intro_text text NOT NULL,
  gallery_images text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_content table
CREATE TABLE IF NOT EXISTS contact_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title text NOT NULL,
  hero_description text NOT NULL,
  contact_description text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  business_hours jsonb DEFAULT '[]',
  social_links jsonb DEFAULT '[]',
  map_description text NOT NULL,
  newsletter_title text NOT NULL,
  newsletter_description text NOT NULL,
  newsletter_privacy_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE home_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_content ENABLE ROW LEVEL SECURITY;

-- Home content policies
CREATE POLICY "Anyone can read home content"
  ON home_content
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Administrators can manage home content"
  ON home_content
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'administrator'
    )
  );

-- About content policies
CREATE POLICY "Anyone can read about content"
  ON about_content
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Administrators can manage about content"
  ON about_content
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'administrator'
    )
  );

-- Contact content policies
CREATE POLICY "Anyone can read contact content"
  ON contact_content
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Administrators can manage contact content"
  ON contact_content
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'administrator'
    )
  );

-- Add updated_at triggers
CREATE TRIGGER update_home_content_updated_at
  BEFORE UPDATE ON home_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_content_updated_at
  BEFORE UPDATE ON about_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_content_updated_at
  BEFORE UPDATE ON contact_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();