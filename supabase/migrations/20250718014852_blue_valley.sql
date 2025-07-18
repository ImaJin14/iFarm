/*
  # Create team_members table

  1. New Tables
    - `team_members`
      - `id` (uuid, primary key)
      - `name` (text)
      - `role` (text)
      - `bio` (text)
      - `image_url` (text)
      - `specialties` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `team_members` table
    - Add policy for public read access
    - Add policy for authenticated users to manage team_members
*/

CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text NOT NULL,
  image_url text NOT NULL,
  specialties text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to team_members"
  ON team_members
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage team_members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO team_members (name, role, bio, image_url, specialties) VALUES
('Sarah Johnson', 'Farm Owner & Head Breeder', 'With over 15 years of experience in animal breeding, Sarah founded iFarm with a passion for sustainable farming and animal welfare.', 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['Breeding Program Management', 'Genetics', 'Business Operations']),
('Dr. Michael Chen', 'Veterinary Consultant', 'Dr. Chen provides expert veterinary care and health management protocols for all our animals, ensuring the highest standards of animal welfare.', 'https://images.pexels.com/photos/5668472/pexels-photo-5668472.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['Veterinary Medicine', 'Health Protocols', 'Disease Prevention']),
('James Martinez', 'Farm Manager', 'James oversees daily operations and implements our sustainable farming practices, bringing expertise in facility management and animal husbandry.', 'https://images.pexels.com/photos/5668854/pexels-photo-5668854.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['Facility Management', 'Daily Care', 'Sustainability Practices']);