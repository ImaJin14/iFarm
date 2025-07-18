/*
  # Create animals table

  1. New Tables
    - `animals`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text, constrained to specific animal types)
      - `breed` (text)
      - `age` (integer, in months)
      - `weight` (numeric)
      - `gender` (text, male/female)
      - `color` (text)
      - `status` (text, available/breeding/sold/reserved)
      - `price` (numeric, optional)
      - `description` (text)
      - `image_url` (text)
      - `coat_type` (text, optional for guinea pigs/cats)
      - `size` (text, optional for dogs)
      - `temperament` (text array, optional)
      - `vaccinations` (text array, optional)
      - `egg_production` (text, optional for fowl)
      - `purpose` (text, optional for fowl)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `animals` table
    - Add policy for public read access
    - Add policy for authenticated users to manage animals
*/

CREATE TABLE IF NOT EXISTS animals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('rabbit', 'guinea-pig', 'dog', 'cat', 'fowl')),
  breed text NOT NULL,
  age integer NOT NULL,
  weight numeric NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female')),
  color text NOT NULL,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'breeding', 'sold', 'reserved')),
  price numeric,
  description text NOT NULL,
  image_url text NOT NULL,
  coat_type text,
  size text CHECK (size IN ('small', 'medium', 'large', 'extra-large')),
  temperament text[],
  vaccinations text[],
  egg_production text,
  purpose text CHECK (purpose IN ('eggs', 'meat', 'dual-purpose', 'ornamental')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to animals"
  ON animals
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage animals"
  ON animals
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_animals_updated_at
  BEFORE UPDATE ON animals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO animals (name, type, breed, age, weight, gender, color, status, price, description, image_url, coat_type, temperament, vaccinations) VALUES
('Luna', 'rabbit', 'New Zealand White', 8, 10.2, 'female', 'White', 'breeding', NULL, 'Proven doe with excellent mothering abilities', 'https://images.pexels.com/photos/4601880/pexels-photo-4601880.jpeg?auto=compress&cs=tinysrgb&w=600', NULL, NULL, NULL),
('Atlas', 'rabbit', 'Flemish Giant', 12, 18.5, 'male', 'Steel Gray', 'available', 125, 'Show quality buck with champion bloodlines', 'https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg?auto=compress&cs=tinysrgb&w=600', NULL, NULL, NULL),
('Cocoa', 'guinea-pig', 'American Guinea Pig', 6, 2.1, 'female', 'Brown and White', 'available', 25, 'Sweet and social guinea pig, great with children', 'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=600', 'Short', NULL, NULL),
('Fluffy', 'guinea-pig', 'Peruvian Guinea Pig', 8, 2.5, 'male', 'Tri-color', 'breeding', NULL, 'Show quality Peruvian with beautiful long coat', 'https://images.pexels.com/photos/4588030/pexels-photo-4588030.jpeg?auto=compress&cs=tinysrgb&w=600', 'Long', NULL, NULL),
('Buddy', 'dog', 'Golden Retriever', 24, 65, 'male', 'Golden', 'available', 1200, 'Well-trained family dog with excellent temperament', 'https://images.pexels.com/photos/4588000/pexels-photo-4588000.jpeg?auto=compress&cs=tinysrgb&w=600', NULL, ARRAY['Friendly', 'Intelligent', 'Devoted'], ARRAY['Rabies', 'DHPP', 'Bordetella']),
('Scout', 'dog', 'Border Collie', 18, 45, 'female', 'Black and White', 'breeding', NULL, 'Champion bloodline Border Collie with excellent working ability', 'https://images.pexels.com/photos/4601880/pexels-photo-4601880.jpeg?auto=compress&cs=tinysrgb&w=600', NULL, ARRAY['Intelligent', 'Energetic', 'Loyal'], ARRAY['Rabies', 'DHPP', 'Bordetella']),
('Whiskers', 'cat', 'Maine Coon', 18, 15, 'male', 'Brown Tabby', 'available', 600, 'Large, gentle Maine Coon with beautiful coat', 'https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg?auto=compress&cs=tinysrgb&w=600', 'long', ARRAY['Gentle', 'Social', 'Playful'], ARRAY['FVRCP', 'Rabies']),
('Princess', 'cat', 'British Shorthair', 12, 10, 'female', 'Blue', 'breeding', NULL, 'Show quality British Shorthair with excellent pedigree', 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=600', 'short', ARRAY['Calm', 'Independent', 'Affectionate'], ARRAY['FVRCP', 'Rabies']),
('Henrietta', 'fowl', 'Rhode Island Red', 12, 7.5, 'female', 'Red', 'available', 30, 'Excellent layer with good meat production potential', 'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=600', NULL, NULL, NULL),
('Silky', 'fowl', 'Silkie Chicken', 8, 2.5, 'female', 'White', 'breeding', NULL, 'Beautiful ornamental chicken with unique silky feathers', 'https://images.pexels.com/photos/4588030/pexels-photo-4588030.jpeg?auto=compress&cs=tinysrgb&w=600', NULL, NULL, NULL);

-- Update fowl records with specific fowl data
UPDATE animals SET egg_production = '250-300 eggs/year', purpose = 'dual-purpose' WHERE name = 'Henrietta';
UPDATE animals SET purpose = 'ornamental' WHERE name = 'Silky';

-- Update dog records with size
UPDATE animals SET size = 'large' WHERE name = 'Buddy';
UPDATE animals SET size = 'medium' WHERE name = 'Scout';