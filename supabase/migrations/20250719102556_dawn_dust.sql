/*
  # Farm Operations Management System

  1. New Tables
    - `breeding_records`
      - `id` (uuid, primary key)
      - `sire_id` (text, male parent name)
      - `dam_id` (text, female parent name)
      - `animal_type` (enum: rabbit, guinea-pig, dog, cat, fowl)
      - `breeding_date` (date)
      - `expected_birth` (date)
      - `actual_birth` (date, optional)
      - `litter_size` (integer, optional)
      - `status` (enum: planned, bred, born, weaned)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `inventory`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (enum: feed, medical, equipment, bedding, other)
      - `animal_types` (text array)
      - `quantity` (integer)
      - `unit` (text)
      - `low_stock_threshold` (integer)
      - `cost` (decimal)
      - `supplier` (text, optional)
      - `last_restocked` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `bi_products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `image_url` (text)
      - `price` (decimal)
      - `unit` (text)
      - `type` (enum: manure, urine, bedding, other)
      - `benefits` (text array)
      - `availability` (enum: in-stock, seasonal, pre-order)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Farm and administrator access for management
    - Public read access for bi-products
*/

-- Create breeding status enum
CREATE TYPE breeding_status AS ENUM ('planned', 'bred', 'born', 'weaned');

-- Create inventory category enum
CREATE TYPE inventory_category AS ENUM ('feed', 'medical', 'equipment', 'bedding', 'other');

-- Create bi-product type enum
CREATE TYPE biproduct_type AS ENUM ('manure', 'urine', 'bedding', 'other');

-- Create availability enum
CREATE TYPE availability_status AS ENUM ('in-stock', 'seasonal', 'pre-order');

-- Create breeding_records table
CREATE TABLE IF NOT EXISTS breeding_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sire_id text NOT NULL,
  dam_id text NOT NULL,
  animal_type animal_type NOT NULL,
  breeding_date date NOT NULL,
  expected_birth date NOT NULL,
  actual_birth date,
  litter_size integer CHECK (litter_size >= 0),
  status breeding_status DEFAULT 'planned',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category inventory_category NOT NULL,
  animal_types text[] DEFAULT '{}',
  quantity integer DEFAULT 0 CHECK (quantity >= 0),
  unit text NOT NULL,
  low_stock_threshold integer DEFAULT 0 CHECK (low_stock_threshold >= 0),
  cost decimal(8,2) DEFAULT 0 CHECK (cost >= 0),
  supplier text,
  last_restocked date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bi_products table
CREATE TABLE IF NOT EXISTS bi_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  price decimal(8,2) NOT NULL CHECK (price >= 0),
  unit text NOT NULL,
  type biproduct_type NOT NULL,
  benefits text[] DEFAULT '{}',
  availability availability_status DEFAULT 'in-stock',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE breeding_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE bi_products ENABLE ROW LEVEL SECURITY;

-- Breeding records policies
CREATE POLICY "Farm users and administrators can manage breeding records"
  ON breeding_records
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

-- Inventory policies
CREATE POLICY "Farm users and administrators can manage inventory"
  ON inventory
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

-- Bi-products policies
CREATE POLICY "Anyone can read bi-products"
  ON bi_products
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Farm users and administrators can manage bi-products"
  ON bi_products
  FOR INSERT, UPDATE, DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

-- Add updated_at triggers
CREATE TRIGGER update_breeding_records_updated_at
  BEFORE UPDATE ON breeding_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bi_products_updated_at
  BEFORE UPDATE ON bi_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();