/*
  # Create breeding_records table

  1. New Tables
    - `breeding_records`
      - `id` (uuid, primary key)
      - `sire_id` (text, reference to animal)
      - `dam_id` (text, reference to animal)
      - `animal_type` (text, constrained to specific animal types)
      - `breeding_date` (date)
      - `expected_birth` (date)
      - `actual_birth` (date, optional)
      - `litter_size` (integer, optional)
      - `status` (text, constrained to specific values)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `breeding_records` table
    - Add policy for public read access
    - Add policy for authenticated users to manage breeding_records
*/

CREATE TABLE IF NOT EXISTS breeding_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sire_id text NOT NULL,
  dam_id text NOT NULL,
  animal_type text NOT NULL CHECK (animal_type IN ('rabbit', 'guinea-pig', 'dog', 'cat', 'fowl')),
  breeding_date date NOT NULL,
  expected_birth date NOT NULL,
  actual_birth date,
  litter_size integer,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'bred', 'born', 'weaned')),
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE breeding_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to breeding_records"
  ON breeding_records
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage breeding_records"
  ON breeding_records
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_breeding_records_updated_at
  BEFORE UPDATE ON breeding_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO breeding_records (sire_id, dam_id, animal_type, breeding_date, expected_birth, actual_birth, litter_size, status, notes) VALUES
('2', '1', 'rabbit', '2024-03-01', '2024-04-01', NULL, NULL, 'bred', 'First breeding for this pairing'),
('6', '8', 'cat', '2024-03-15', '2024-05-15', '2024-05-16', 4, 'born', 'Healthy litter, all kittens thriving');