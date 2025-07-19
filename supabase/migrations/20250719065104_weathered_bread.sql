/*
  # Create about_content table for managing About page content

  1. New Tables
    - `about_content`
      - `id` (uuid, primary key)
      - `hero_intro_text` (text) - Main introduction paragraph
      - `mission_statement` (text) - Mission statement content
      - `values_list` (jsonb) - Array of values with titles and descriptions
      - `history_intro_text` (text) - History section introduction
      - `history_milestones` (jsonb) - Array of historical milestones
      - `certifications_intro_text` (text) - Certifications section introduction
      - `certifications_awards` (jsonb) - Array of certifications and awards
      - `gallery_intro_text` (text) - Photo gallery introduction
      - `gallery_images` (text[]) - Array of image URLs for gallery
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `about_content` table
    - Add policy for public read access
    - Add policy for authenticated users to manage content

  3. Initial Data
    - Insert default content from current About page
*/

-- Create the about_content table
CREATE TABLE IF NOT EXISTS public.about_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_intro_text text NOT NULL,
  mission_statement text NOT NULL,
  values_list jsonb DEFAULT '[]'::jsonb,
  history_intro_text text NOT NULL,
  history_milestones jsonb DEFAULT '[]'::jsonb,
  certifications_intro_text text NOT NULL,
  certifications_awards jsonb DEFAULT '[]'::jsonb,
  gallery_intro_text text NOT NULL,
  gallery_images text[] DEFAULT '{}'::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Allow public read access to about_content"
  ON public.about_content
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage about_content"
  ON public.about_content
  FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous manage on about_content"
  ON public.about_content
  FOR ALL
  TO anon
  USING (true) WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_about_content_updated_at
  BEFORE UPDATE ON public.about_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial content
INSERT INTO public.about_content (
  hero_intro_text,
  mission_statement,
  values_list,
  history_intro_text,
  history_milestones,
  certifications_intro_text,
  certifications_awards,
  gallery_intro_text,
  gallery_images
) VALUES (
  'Founded in 2015, we''ve been dedicated to sustainable livestock farming practices, ethical breeding, and providing exceptional animals to our community across multiple species.',
  'To provide healthy, well-bred animals across multiple species while maintaining the highest standards of animal welfare and environmental responsibility. We believe in sustainable farming practices that benefit both our animals and the community.',
  '[
    {
      "title": "Animal Welfare",
      "description": "Ethical care and treatment",
      "icon": "Heart"
    },
    {
      "title": "Sustainability", 
      "description": "Eco-friendly practices",
      "icon": "Leaf"
    },
    {
      "title": "Excellence",
      "description": "Quality breeding standards", 
      "icon": "Award"
    },
    {
      "title": "Community",
      "description": "Education and support",
      "icon": "Users"
    }
  ]'::jsonb,
  'From a small backyard hobby to a certified sustainable multi-species farm',
  '[
    {
      "year": "2015",
      "title": "Started with rabbits and guinea pigs in our backyard",
      "icon": "Calendar"
    },
    {
      "year": "2018", 
      "title": "Moved to our current 10-acre facility and expanded to dogs and cats",
      "icon": "MapPin"
    },
    {
      "year": "2024",
      "title": "Added fowls and achieved sustainable farming certification",
      "icon": "Award"
    }
  ]'::jsonb,
  'Recognition for our commitment to excellence and sustainable practices',
  '[
    {
      "title": "Sustainable Farm",
      "description": "Certification 2024",
      "color": "yellow"
    },
    {
      "title": "ARBA Member", 
      "description": "Since 2016",
      "color": "blue"
    },
    {
      "title": "Best Breeder",
      "description": "State Fair 2023",
      "color": "green"
    },
    {
      "title": "Humane Care",
      "description": "Certified 2022", 
      "color": "purple"
    }
  ]'::jsonb,
  'Take a visual tour of our facilities and meet some of our animals',
  ARRAY[
    'https://images.pexels.com/photos/4588000/pexels-photo-4588000.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/4588030/pexels-photo-4588030.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/4601880/pexels-photo-4601880.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=600'
  ]
);