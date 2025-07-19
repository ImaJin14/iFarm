/*
  # Create farm settings table

  1. New Tables
    - `farm_settings`
      - `id` (uuid, primary key)
      - `farm_name` (text)
      - `farm_tagline` (text)
      - `contact_email` (text)
      - `contact_phone` (text)
      - `address` (text)
      - `website_url` (text)
      - `timezone` (text)
      - `currency` (text)
      - `default_weight_unit` (text)
      - `low_stock_threshold` (integer)
      - `enable_notifications` (boolean)
      - `notification_email` (text)
      - `backup_frequency` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `farm_settings` table
    - Add policies for public read and authenticated management
*/

CREATE TABLE IF NOT EXISTS farm_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_name text NOT NULL DEFAULT 'iFarm',
  farm_tagline text NOT NULL DEFAULT 'Premium Livestock Breeding',
  contact_email text NOT NULL DEFAULT 'info@ifarm.com',
  contact_phone text NOT NULL DEFAULT '(555) 123-4567',
  address text NOT NULL DEFAULT '123 Farm Road, Rural Valley, ST 12345',
  website_url text DEFAULT 'https://ifarm.com',
  timezone text NOT NULL DEFAULT 'America/New_York',
  currency text NOT NULL DEFAULT 'USD',
  default_weight_unit text NOT NULL DEFAULT 'lbs',
  low_stock_threshold integer NOT NULL DEFAULT 10,
  enable_notifications boolean NOT NULL DEFAULT true,
  notification_email text DEFAULT 'notifications@ifarm.com',
  backup_frequency text NOT NULL DEFAULT 'weekly',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE farm_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to farm_settings"
  ON farm_settings
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage settings
CREATE POLICY "Allow authenticated users to manage farm_settings"
  ON farm_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anonymous management for demo purposes
CREATE POLICY "Allow anonymous manage on farm_settings"
  ON farm_settings
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_farm_settings_updated_at
  BEFORE UPDATE ON farm_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO farm_settings (
  farm_name,
  farm_tagline,
  contact_email,
  contact_phone,
  address,
  website_url,
  timezone,
  currency,
  default_weight_unit,
  low_stock_threshold,
  enable_notifications,
  notification_email,
  backup_frequency
) VALUES (
  'iFarm',
  'Premium Livestock Breeding',
  'info@ifarm.com',
  '(555) 123-4567',
  '123 Farm Road, Rural Valley, ST 12345',
  'https://ifarm.com',
  'America/New_York',
  'USD',
  'lbs',
  10,
  true,
  'notifications@ifarm.com',
  'weekly'
) ON CONFLICT DO NOTHING;