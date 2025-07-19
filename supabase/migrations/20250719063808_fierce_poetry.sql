/*
  # Create education tables

  1. New Tables
    - `education_guides`
      - `id` (uuid, primary key)
      - `title` (text)
      - `category` (text)
      - `read_time` (text)
      - `difficulty` (text with check constraint)
      - `rating` (numeric)
      - `description` (text)
      - `content` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `faqs`
      - `id` (uuid, primary key)
      - `question` (text)
      - `answer` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage content
    - Add policies for public read access

  3. Triggers
    - Add update_updated_at_column triggers for both tables
*/

-- Create education_guides table
CREATE TABLE IF NOT EXISTS education_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  read_time text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  rating numeric DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
  description text NOT NULL,
  content text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE education_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Create policies for education_guides
CREATE POLICY "Allow public read access to education_guides"
  ON education_guides
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage education_guides"
  ON education_guides
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on education_guides"
  ON education_guides
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update on education_guides"
  ON education_guides
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete on education_guides"
  ON education_guides
  FOR DELETE
  TO anon
  USING (true);

-- Create policies for faqs
CREATE POLICY "Allow public read access to faqs"
  ON faqs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage faqs"
  ON faqs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on faqs"
  ON faqs
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update on faqs"
  ON faqs
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete on faqs"
  ON faqs
  FOR DELETE
  TO anon
  USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_education_guides_updated_at
  BEFORE UPDATE ON education_guides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();