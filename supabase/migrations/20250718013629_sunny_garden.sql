/*
  # Create breeds table

  1. New Tables
    - `breeds`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text with check constraint)
      - `description` (text)
      - `characteristics` (text array)
      - `average_weight` (text)
      - `primary_use` (text)
      - `image_url` (text)
      - `price_range` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `breeds` table
    - Add policy for public read access
    - Add policy for authenticated users to manage data
*/

CREATE TABLE IF NOT EXISTS breeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('rabbit', 'guinea-pig', 'dog', 'cat', 'fowl')),
  description text NOT NULL,
  characteristics text[] DEFAULT '{}',
  average_weight text NOT NULL,
  primary_use text NOT NULL,
  image_url text NOT NULL,
  price_range text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE breeds ENABLE ROW LEVEL SECURITY;

-- Allow public read access to breeds
CREATE POLICY "Allow public read access to breeds"
  ON breeds
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert, update, and delete breeds
CREATE POLICY "Allow authenticated users to manage breeds"
  ON breeds
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_breeds_updated_at
  BEFORE UPDATE ON breeds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO breeds (name, type, description, characteristics, average_weight, primary_use, image_url, price_range) VALUES
  ('New Zealand White', 'rabbit', 'A versatile breed known for excellent meat production and gentle temperament.', ARRAY['Fast growth', 'Docile nature', 'Good mothers', 'Hardy breed'], '9-12 lbs', 'Meat & Laboratory', 'https://images.pexels.com/photos/4601880/pexels-photo-4601880.jpeg?auto=compress&cs=tinysrgb&w=600', '$45-85'),
  ('Flemish Giant', 'rabbit', 'The gentle giant of rabbit breeds, known for their impressive size and calm disposition.', ARRAY['Large size', 'Gentle temperament', 'Good with children', 'Show quality'], '14-22 lbs', 'Show & Pet', 'https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg?auto=compress&cs=tinysrgb&w=600', '$75-150'),
  ('Holland Lop', 'rabbit', 'Compact and adorable with distinctive lopped ears, perfect for families.', ARRAY['Compact size', 'Friendly personality', 'Low maintenance', 'Beautiful coat'], '2-4 lbs', 'Pet & Show', 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=600', '$60-120'),
  ('American Guinea Pig', 'guinea-pig', 'The most common guinea pig breed with a smooth, short coat and friendly disposition.', ARRAY['Easy care', 'Social nature', 'Hardy breed', 'Good for beginners'], '1.5-2.5 lbs', 'Pet & Show', 'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=600', '$15-35'),
  ('Peruvian Guinea Pig', 'guinea-pig', 'Long-haired breed known for their beautiful flowing coats and gentle nature.', ARRAY['Long coat', 'Show quality', 'Gentle temperament', 'Regular grooming needed'], '2-3 lbs', 'Show & Pet', 'https://images.pexels.com/photos/4588030/pexels-photo-4588030.jpeg?auto=compress&cs=tinysrgb&w=600', '$25-50'),
  ('Golden Retriever', 'dog', 'Friendly, intelligent, and devoted family dogs known for their golden coats.', ARRAY['Family friendly', 'Intelligent', 'Active', 'Good with children'], '55-75 lbs', 'Family Pet & Companion', 'https://images.pexels.com/photos/4588000/pexels-photo-4588000.jpeg?auto=compress&cs=tinysrgb&w=600', '$800-1500'),
  ('Border Collie', 'dog', 'Highly intelligent working dogs with exceptional herding abilities.', ARRAY['Highly intelligent', 'Energetic', 'Trainable', 'Working breed'], '30-55 lbs', 'Working & Companion', 'https://images.pexels.com/photos/4601880/pexels-photo-4601880.jpeg?auto=compress&cs=tinysrgb&w=600', '$600-1200'),
  ('Maine Coon', 'cat', 'Large, gentle cats with long, fluffy coats and friendly personalities.', ARRAY['Large size', 'Gentle giant', 'Long coat', 'Social nature'], '10-25 lbs', 'Companion & Show', 'https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg?auto=compress&cs=tinysrgb&w=600', '$400-800'),
  ('British Shorthair', 'cat', 'Calm, dignified cats with dense, plush coats and round faces.', ARRAY['Calm temperament', 'Dense coat', 'Independent', 'Good with families'], '7-17 lbs', 'Companion & Show', 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=600', '$500-900'),
  ('Rhode Island Red', 'fowl', 'Hardy, dual-purpose chickens known for excellent egg production and meat quality.', ARRAY['Hardy breed', 'Good egg layers', 'Dual purpose', 'Cold tolerant'], '6.5-8.5 lbs', 'Eggs & Meat', 'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=600', '$20-40'),
  ('Silkie Chicken', 'fowl', 'Ornamental chickens with unique silky feathers and gentle, broody nature.', ARRAY['Silky feathers', 'Broody nature', 'Ornamental', 'Gentle temperament'], '2-3 lbs', 'Ornamental & Pet', 'https://images.pexels.com/photos/4588030/pexels-photo-4588030.jpeg?auto=compress&cs=tinysrgb&w=600', '$25-60');