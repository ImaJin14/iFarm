/*
  # Farm Settings and Configuration

  1. New Tables
    - `farm_settings`
      - `id` (uuid, primary key)
      - `farm_name` (text)
      - `farm_tagline` (text)
      - `contact_email` (text)
      - `contact_phone` (text)
      - `address` (text)
      - `website_url` (text, optional)
      - `timezone` (text)
      - `currency` (text)
      - `default_weight_unit` (text)
      - `low_stock_threshold` (integer)
      - `enable_notifications` (boolean)
      - `notification_email` (text, optional)
      - `backup_frequency` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on table
    - Farm and administrator access only
*/

-- Create farm_settings table
CREATE TABLE IF NOT EXISTS farm_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_name text NOT NULL,
  farm_tagline text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  address text NOT NULL,
  website_url text,
  timezone text NOT NULL DEFAULT 'America/New_York',
  currency text NOT NULL DEFAULT 'USD',
  default_weight_unit text NOT NULL DEFAULT 'lbs',
  low_stock_threshold integer DEFAULT 10 CHECK (low_stock_threshold >= 0),
  enable_notifications boolean DEFAULT true,
  notification_email text,
  backup_frequency text DEFAULT 'weekly',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE farm_settings ENABLE ROW LEVEL SECURITY;

-- Farm settings policies
CREATE POLICY "Farm users and administrators can read farm settings"
  ON farm_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

CREATE POLICY "Farm users and administrators can manage farm settings"
  ON farm_settings
  FOR INSERT, UPDATE, DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

-- Add updated_at trigger
CREATE TRIGGER update_farm_settings_updated_at
  BEFORE UPDATE ON farm_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();