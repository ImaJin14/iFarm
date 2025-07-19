```sql
-- Create farm_settings table
CREATE TABLE public.farm_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_name text NOT NULL DEFAULT 'iFarm',
    farm_tagline text NOT NULL DEFAULT 'Premium Livestock Breeding',
    contact_email text NOT NULL DEFAULT 'info@ifarm.com',
    contact_phone text NOT NULL DEFAULT '(555) 123-4567',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.farm_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public read access
CREATE POLICY "Allow public read access to farm_settings"
ON public.farm_settings FOR SELECT
USING (true);

-- Allow authenticated users to manage (insert, update, delete)
CREATE POLICY "Allow authenticated users to manage farm_settings"
ON public.farm_settings FOR ALL
TO authenticated
USING (true) WITH CHECK (true);

-- Allow anonymous users to manage (insert, update, delete) for initial setup/demo
-- In a production environment, you might restrict this to authenticated users only.
CREATE POLICY "Allow anonymous manage on farm_settings"
ON public.farm_settings FOR ALL
TO anon
USING (true) WITH CHECK (true);

-- Create a trigger to update the 'updated_at' column on each row update
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_farm_settings_updated_at
BEFORE UPDATE ON public.farm_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data (optional, but good for quick setup)
INSERT INTO public.farm_settings (farm_name, farm_tagline, contact_email, contact_phone)
VALUES ('iFarm', 'Premium Livestock Breeding', 'info@ifarm.com', '(555) 123-4567')
ON CONFLICT (id) DO NOTHING;
```