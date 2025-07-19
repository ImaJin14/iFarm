/*
  # Create home content table

  1. New Tables
    - `home_content`
      - `id` (uuid, primary key)
      - `hero_title` (text)
      - `hero_subtitle` (text)
      - `hero_description` (text)
      - `hero_image_url` (text)
      - `hero_badge_text` (text)
      - `hero_features` (jsonb array)
      - `featured_section_title` (text)
      - `featured_section_description` (text)
      - `news_section_title` (text)
      - `news_section_description` (text)
      - `cta_buttons` (jsonb array)
      - `stats` (jsonb array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `home_content` table
    - Add policy for public read access
    - Add policy for authenticated users to manage content
    - Add policy for anonymous users to manage content (for demo purposes)

  3. Initial Data
    - Insert default home page content
*/

CREATE TABLE IF NOT EXISTS home_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title text NOT NULL DEFAULT 'Premium Livestock',
  hero_subtitle text NOT NULL DEFAULT 'Breeding Farm',
  hero_description text NOT NULL DEFAULT 'Sustainable farming practices meet exceptional breeding standards. Discover quality rabbits, guinea pigs, dogs, cats, and fowls with a commitment to animal welfare.',
  hero_image_url text NOT NULL DEFAULT 'https://images.pexels.com/photos/4588000/pexels-photo-4588000.jpeg?auto=compress&cs=tinysrgb&w=800',
  hero_badge_text text NOT NULL DEFAULT '15+ Years Experience',
  hero_features jsonb DEFAULT '[
    {"title": "Award Winning", "icon": "Award"},
    {"title": "Ethical Care", "icon": "Heart"},
    {"title": "Sustainable", "icon": "Leaf"}
  ]'::jsonb,
  featured_section_title text NOT NULL DEFAULT 'Our Featured Animals',
  featured_section_description text NOT NULL DEFAULT 'Carefully selected breeds across rabbits, guinea pigs, dogs, cats, and fowls, each known for their exceptional qualities, health, and temperament.',
  news_section_title text NOT NULL DEFAULT 'Latest News & Updates',
  news_section_description text NOT NULL DEFAULT 'Stay informed about our latest breeding programs, farm updates, and educational content.',
  cta_buttons jsonb DEFAULT '[
    {"text": "View Our Animals", "link": "/products", "type": "primary"},
    {"text": "Contact Us", "link": "/contact", "type": "secondary"}
  ]'::jsonb,
  stats jsonb DEFAULT '[
    {"label": "Years Experience", "value": "15+", "icon": "Calendar"},
    {"label": "Happy Customers", "value": "500+", "icon": "Users"},
    {"label": "Animals Bred", "value": "1000+", "icon": "Heart"},
    {"label": "Species", "value": "5", "icon": "Star"}
  ]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE home_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to home_content"
  ON home_content
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage home_content"
  ON home_content
  FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous manage on home_content"
  ON home_content
  FOR ALL
  TO anon
  USING (true) WITH CHECK (true);

CREATE TRIGGER update_home_content_updated_at
  BEFORE UPDATE ON home_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO home_content (id) VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;