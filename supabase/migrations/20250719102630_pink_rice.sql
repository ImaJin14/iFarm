/*
  # Education and News Management System

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

    - `education_guides`
      - `id` (uuid, primary key)
      - `title` (text)
      - `category` (text)
      - `read_time` (text)
      - `difficulty` (enum: Beginner, Intermediate, Advanced)
      - `rating` (decimal)
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
    - Enable RLS on all tables
    - Public read access for all users
    - Farm and administrator write access
*/

-- Create difficulty enum
CREATE TYPE guide_difficulty AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- Create news_items table
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

-- Create education_guides table
CREATE TABLE IF NOT EXISTS education_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  read_time text NOT NULL,
  difficulty guide_difficulty DEFAULT 'Beginner',
  rating decimal(2,1) DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
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

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text NOT NULL,
  image_url text NOT NULL,
  specialties text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- News items policies
CREATE POLICY "Anyone can read news items"
  ON news_items
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Farm users and administrators can manage news items"
  ON news_items
  FOR INSERT, UPDATE, DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

-- Education guides policies
CREATE POLICY "Anyone can read education guides"
  ON education_guides
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Farm users and administrators can manage education guides"
  ON education_guides
  FOR INSERT, UPDATE, DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

-- FAQs policies
CREATE POLICY "Anyone can read faqs"
  ON faqs
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Farm users and administrators can manage faqs"
  ON faqs
  FOR INSERT, UPDATE, DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

-- Team members policies
CREATE POLICY "Anyone can read team members"
  ON team_members
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Administrators can manage team members"
  ON team_members
  FOR INSERT, UPDATE, DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'administrator'
    )
  );

-- Add updated_at triggers
CREATE TRIGGER update_news_items_updated_at
  BEFORE UPDATE ON news_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_guides_updated_at
  BEFORE UPDATE ON education_guides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();