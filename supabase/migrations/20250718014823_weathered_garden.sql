/*
  # Create bi_products table

  1. New Tables
    - `bi_products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `image_url` (text)
      - `price` (numeric)
      - `unit` (text)
      - `type` (text, constrained to specific types)
      - `benefits` (text array)
      - `availability` (text, constrained to specific values)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `bi_products` table
    - Add policy for public read access
    - Add policy for authenticated users to manage bi_products
*/

CREATE TABLE IF NOT EXISTS bi_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  price numeric NOT NULL,
  unit text NOT NULL,
  type text NOT NULL CHECK (type IN ('manure', 'urine', 'bedding', 'other')),
  benefits text[] NOT NULL DEFAULT '{}',
  availability text NOT NULL DEFAULT 'in-stock' CHECK (availability IN ('in-stock', 'seasonal', 'pre-order')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bi_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to bi_products"
  ON bi_products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage bi_products"
  ON bi_products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_bi_products_updated_at
  BEFORE UPDATE ON bi_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO bi_products (name, description, image_url, price, unit, type, benefits, availability) VALUES
('Premium Rabbit Manure', 'Nutrient-rich organic fertilizer perfect for gardens and crops. Our rabbit manure is naturally composted and ready to use.', 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=600', 15, 'per 25lb bag', 'manure', ARRAY['High in nitrogen', 'Improves soil structure', 'Organic and natural', 'Ready to use'], 'in-stock'),
('Rabbit Urine Fertilizer', 'Concentrated liquid fertilizer collected from our healthy rabbits. Excellent for quick nutrient absorption by plants.', 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600', 12, 'per gallon', 'urine', ARRAY['Fast-acting nutrients', 'High potassium content', 'Liquid application', 'Concentrated formula'], 'in-stock'),
('Composted Bedding Mix', 'Used bedding from our animals, fully composted and aged. Creates excellent soil amendment for gardens.', 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=600', 10, 'per 20lb bag', 'bedding', ARRAY['Improves drainage', 'Adds organic matter', 'Sustainable recycling', 'Cost-effective'], 'seasonal'),
('Mixed Animal Compost', 'Premium compost blend from all our farm animals. Perfectly balanced nutrients for vegetable gardens and flower beds.', 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=600', 18, 'per 30lb bag', 'manure', ARRAY['Balanced nutrients', 'Multi-animal blend', 'Enhanced soil health', 'Premium quality'], 'in-stock');