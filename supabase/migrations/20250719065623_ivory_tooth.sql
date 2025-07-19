/*
  # Create contact content management table

  1. New Tables
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
    - Enable RLS on `contact_content` table
    - Add policy for public read access
    - Add policy for authenticated users to manage content

  3. Initial Data
    - Insert default contact content from current page
*/

CREATE TABLE IF NOT EXISTS contact_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title text NOT NULL DEFAULT 'Get In Touch',
  hero_description text NOT NULL DEFAULT 'We''d love to hear from you! Whether you have questions about our animals, need care advice, or want to schedule a visit, we''re here to help.',
  contact_description text NOT NULL DEFAULT 'We''re always happy to discuss our animals, share our expertise, or answer any questions you might have.',
  address text NOT NULL DEFAULT '123 Farm Road, Rural Valley, ST 12345',
  phone text NOT NULL DEFAULT '(555) 123-4567',
  email text NOT NULL DEFAULT 'info@ifarm.com',
  business_hours jsonb DEFAULT '[
    {"day": "Monday - Friday", "hours": "8:00 AM - 6:00 PM"},
    {"day": "Saturday", "hours": "8:00 AM - 4:00 PM"},
    {"day": "Sunday", "hours": "By appointment only"}
  ]'::jsonb,
  social_links jsonb DEFAULT '[
    {"platform": "Facebook", "url": "https://facebook.com", "icon": "Facebook"},
    {"platform": "Instagram", "url": "https://instagram.com", "icon": "Instagram"},
    {"platform": "Twitter", "url": "https://twitter.com", "icon": "Twitter"}
  ]'::jsonb,
  map_description text NOT NULL DEFAULT 'Located in the heart of Rural Valley, our farm is easily accessible for visits and pickups.',
  newsletter_title text NOT NULL DEFAULT 'Stay Connected',
  newsletter_description text NOT NULL DEFAULT 'Subscribe to our newsletter for updates on available animals, care tips, and farm news.',
  newsletter_privacy_text text NOT NULL DEFAULT 'We respect your privacy and never share your information.',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to contact_content"
  ON contact_content
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage contact_content"
  ON contact_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous manage on contact_content"
  ON contact_content
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER update_contact_content_updated_at
  BEFORE UPDATE ON contact_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO contact_content (
  hero_title,
  hero_description,
  contact_description,
  address,
  phone,
  email,
  business_hours,
  social_links,
  map_description,
  newsletter_title,
  newsletter_description,
  newsletter_privacy_text
) VALUES (
  'Get In Touch',
  'We''d love to hear from you! Whether you have questions about our animals, need care advice, or want to schedule a visit, we''re here to help.',
  'We''re always happy to discuss our animals, share our expertise, or answer any questions you might have.',
  '123 Farm Road, Rural Valley, ST 12345',
  '(555) 123-4567',
  'info@ifarm.com',
  '[
    {"day": "Monday - Friday", "hours": "8:00 AM - 6:00 PM"},
    {"day": "Saturday", "hours": "8:00 AM - 4:00 PM"},
    {"day": "Sunday", "hours": "By appointment only"}
  ]'::jsonb,
  '[
    {"platform": "Facebook", "url": "https://facebook.com", "icon": "Facebook"},
    {"platform": "Instagram", "url": "https://instagram.com", "icon": "Instagram"},
    {"platform": "Twitter", "url": "https://twitter.com", "icon": "Twitter"}
  ]'::jsonb,
  'Located in the heart of Rural Valley, our farm is easily accessible for visits and pickups.',
  'Stay Connected',
  'Subscribe to our newsletter for updates on available animals, care tips, and farm news.',
  'We respect your privacy and never share your information.'
);