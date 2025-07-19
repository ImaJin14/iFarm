/*
  # Animals and Breeds Management System

  1. New Tables
    - `breeds`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (enum: rabbit, guinea-pig, dog, cat, fowl)
      - `description` (text)
      - `characteristics` (text array)
      - `average_weight` (text)
      - `primary_use` (text)
      - `image_url` (text)
      - `price_range` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `animals`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (enum: rabbit, guinea-pig, dog, cat, fowl)
      - `breed` (text)
      - `age` (integer, months)
      - `weight` (decimal, pounds)
      - `gender` (enum: male, female)
      - `color` (text)
      - `status` (enum: available, breeding, sold, reserved)
      - `price` (decimal, optional)
      - `description` (text)
      - `image_url` (text)
      - `coat_type` (text, optional for guinea pigs and cats)
      - `size` (enum: small, medium, large, extra-large, optional for dogs and cats)
      - `temperament` (text array, optional for dogs and cats)
      - `vaccinations` (text array, optional for dogs and cats)
      - `egg_production` (text, optional for fowl)
      - `purpose` (enum: eggs, meat, dual-purpose, ornamental, optional for fowl)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Public read access for all users
    - Farm and administrator write access
*/

-- Create animal type enum
CREATE TYPE animal_type AS ENUM ('rabbit', 'guinea-pig', 'dog', 'cat', 'fowl');

-- Create gender enum
CREATE TYPE animal_gender AS ENUM ('male', 'female');

-- Create status enum
CREATE TYPE animal_status AS ENUM ('available', 'breeding', 'sold', 'reserved');

-- Create size enum for dogs and cats
CREATE TYPE animal_size AS ENUM ('small', 'medium', 'large', 'extra-large');

-- Create purpose enum for fowl
CREATE TYPE fowl_purpose AS ENUM ('eggs', 'meat', 'dual-purpose', 'ornamental');

-- Create breeds table
CREATE TABLE IF NOT EXISTS breeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type animal_type NOT NULL,
  description text NOT NULL,
  characteristics text[] DEFAULT '{}',
  average_weight text NOT NULL,
  primary_use text NOT NULL,
  image_url text NOT NULL,
  price_range text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create animals table
CREATE TABLE IF NOT EXISTS animals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type animal_type NOT NULL,
  breed text NOT NULL,
  age integer NOT NULL CHECK (age >= 0),
  weight decimal(5,2) NOT NULL CHECK (weight > 0),
  gender animal_gender NOT NULL,
  color text NOT NULL,
  status animal_status DEFAULT 'available',
  price decimal(8,2) CHECK (price >= 0),
  description text NOT NULL,
  image_url text NOT NULL,
  coat_type text,
  size animal_size,
  temperament text[] DEFAULT '{}',
  vaccinations text[] DEFAULT '{}',
  egg_production text,
  purpose fowl_purpose,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE breeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

-- Breeds policies
CREATE POLICY "Anyone can read breeds"
  ON breeds
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Farm users and administrators can manage breeds"
  ON breeds
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

-- Animals policies
CREATE POLICY "Anyone can read animals"
  ON animals
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Farm users and administrators can manage animals"
  ON animals
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

-- Add updated_at triggers
CREATE TRIGGER update_breeds_updated_at
  BEFORE UPDATE ON breeds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_animals_updated_at
  BEFORE UPDATE ON animals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();