```sql
-- supabase/migrations/20250719064624_create_about_content_table.sql

-- Create the table
CREATE TABLE public.about_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    hero_intro_text text NOT NULL,
    mission_statement text NOT NULL,
    values_list jsonb DEFAULT '[]'::jsonb, -- Stores an array of objects for values {title, description}
    history_intro_text text NOT NULL,
    history_milestones jsonb DEFAULT '[]'::jsonb, -- Stores an array of objects for milestones {year, description}
    certifications_intro_text text NOT NULL,
    certifications_awards jsonb DEFAULT '[]'::jsonb, -- Stores an array of objects for certifications {title, description}
    gallery_intro_text text NOT NULL,
    image_urls text[] DEFAULT '{}'::text[], -- Stores an array of image URLs
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Allow public read access
CREATE POLICY "Allow public read access to about_content"
ON public.about_content FOR SELECT
USING (true);

-- Allow authenticated users to manage about_content (insert, update, delete)
CREATE POLICY "Allow authenticated users to manage about_about_content"
ON public.about_content FOR ALL
TO authenticated
USING (true) WITH CHECK (true);

-- Create a trigger to update the 'updated_at' column on each update
-- (Assuming update_updated_at_column() function already exists from other migrations)
CREATE TRIGGER update_about_content_updated_at
BEFORE UPDATE ON public.about_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```