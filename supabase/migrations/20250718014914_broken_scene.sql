/*
  # Create inventory table

  1. New Tables
    - `inventory`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text, constrained to specific categories)
      - `animal_types` (text array)
      - `quantity` (integer)
      - `unit` (text)
      - `low_stock_threshold` (integer)
      - `cost` (numeric)
      - `supplier` (text, optional)
      - `last_restocked` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `inventory` table
    - Add policy for public read access
    - Add policy for authenticated users to manage inventory
*/

CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('feed', 'medical', 'equipment', 'bedding', 'other')),
  animal_types text[] NOT NULL DEFAULT '{}',
  quantity integer NOT NULL DEFAULT 0,
  unit text NOT NULL,
  low_stock_threshold integer NOT NULL DEFAULT 0,
  cost numeric NOT NULL DEFAULT 0,
  supplier text,
  last_restocked date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to inventory"
  ON inventory
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage inventory"
  ON inventory
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO inventory (name, category, animal_types, quantity, unit, low_stock_threshold, cost, supplier, last_restocked) VALUES
('Premium Rabbit Pellets', 'feed', ARRAY['rabbit'], 25, 'bags (50lb)', 10, 18.99, 'Farm Supply Co.', '2024-03-10'),
('Guinea Pig Food', 'feed', ARRAY['guinea-pig'], 15, 'bags (25lb)', 5, 22.50, 'Small Animal Supply', '2024-03-08'),
('Premium Dog Food', 'feed', ARRAY['dog'], 20, 'bags (40lb)', 8, 45.00, 'Pet Nutrition Plus', '2024-03-05'),
('Cat Food (All Life Stages)', 'feed', ARRAY['cat'], 12, 'bags (30lb)', 5, 38.99, 'Feline Nutrition Co.', '2024-03-07'),
('Chicken Feed', 'feed', ARRAY['fowl'], 30, 'bags (50lb)', 12, 16.50, 'Poultry Supply Inc.', '2024-03-12'),
('Universal Bedding', 'bedding', ARRAY['rabbit', 'guinea-pig', 'cat'], 18, 'bales', 8, 12.50, 'Farm Bedding Co.', '2024-03-08'),
('Multi-Animal Vitamins', 'medical', ARRAY['rabbit', 'guinea-pig', 'dog', 'cat', 'fowl'], 5, 'bottles', 3, 25.00, 'Animal Health Solutions', '2024-02-15');