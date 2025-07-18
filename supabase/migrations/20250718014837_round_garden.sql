/*
  # Create news_items table

  1. New Tables
    - `news_items`
      - `id` (uuid, primary key)
      - `title` (text)
      - `excerpt` (text)
      - `content` (text)
      - `date` (date)
      - `image_url` (text)
      - `category` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `news_items` table
    - Add policy for public read access
    - Add policy for authenticated users to manage news_items
*/

CREATE TABLE IF NOT EXISTS news_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  date date NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to news_items"
  ON news_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage news_items"
  ON news_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_news_items_updated_at
  BEFORE UPDATE ON news_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO news_items (title, excerpt, content, date, image_url, category) VALUES
('Spring Breeding Season Begins', 'Our spring breeding program is now underway with exciting new genetic lines across all our animal species.', 'We are excited to announce the start of our spring breeding season with several new proven lines added to our breeding program. This season brings exciting opportunities for genetic diversity and improved traits across all our animal species. Our carefully planned breeding program focuses on health, temperament, and breed standards to ensure the highest quality offspring.', '2024-03-15', 'https://images.pexels.com/photos/4588000/pexels-photo-4588000.jpeg?auto=compress&cs=tinysrgb&w=600', 'Breeding'),
('Sustainable Farming Certification Achieved', 'iFarm receives recognition for sustainable and ethical farming practices across all livestock.', 'We are proud to announce our certification for sustainable farming practices, reflecting our commitment to environmental responsibility. This certification recognizes our efforts in waste management, renewable energy use, and ethical animal treatment. Our sustainable practices include composting programs, solar energy systems, and rotational grazing methods that benefit both our animals and the environment.', '2024-02-28', 'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=600', 'Sustainability'),
('New Educational Workshop Series', 'Join us for hands-on workshops covering care for rabbits, guinea pigs, dogs, cats, and fowls.', 'Starting this month, we are offering monthly educational workshops for both beginners and experienced animal enthusiasts. These workshops cover topics ranging from basic animal care to advanced breeding techniques. Participants will gain hands-on experience and learn from our team of experts. Each workshop is designed to be interactive and informative, providing practical knowledge that can be applied immediately.', '2024-02-10', 'https://images.pexels.com/photos/4588030/pexels-photo-4588030.jpeg?auto=compress&cs=tinysrgb&w=600', 'Education');