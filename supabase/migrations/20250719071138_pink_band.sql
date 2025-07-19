/*
  # News Management Schema

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

  2. Security
    - Enable RLS on `news_items` table
    - Add policy for public read access
    - Add policy for authenticated users to manage news
*/

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

-- Enable RLS
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to news_items"
  ON news_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage news_items"
  ON news_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_news_items_updated_at
  BEFORE UPDATE ON news_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample news data
INSERT INTO news_items (title, excerpt, content, date, image_url, category) VALUES
(
  'New Breeding Program Launch',
  'We are excited to announce the launch of our advanced breeding program focusing on genetic diversity and health.',
  'Our new breeding program represents a significant milestone in our commitment to producing healthy, genetically diverse animals. This comprehensive program incorporates the latest advances in animal genetics and breeding science to ensure the highest quality offspring.

The program focuses on several key areas: genetic health screening, temperament evaluation, and performance tracking. Each breeding pair is carefully selected based on complementary traits and genetic compatibility.

We have invested in state-of-the-art facilities and equipment to support this program, including climate-controlled breeding areas and advanced monitoring systems. Our team of experienced breeders and veterinarians work together to ensure optimal conditions for both parent animals and their offspring.

This program will initially focus on our rabbit and guinea pig populations, with plans to expand to other species in the coming months. We expect to see the first results of this program in the next breeding season.',
  '2024-01-15',
  'https://images.pexels.com/photos/4588000/pexels-photo-4588000.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Breeding'
),
(
  'Sustainable Farming Practices Update',
  'Learn about our latest initiatives in sustainable farming and environmental conservation.',
  'Sustainability has always been at the core of our farming philosophy. This year, we have implemented several new initiatives to further reduce our environmental impact and promote sustainable practices.

Our new composting system processes all organic waste from the farm, creating nutrient-rich compost that we use to fertilize our feed crops. This closed-loop system significantly reduces waste and eliminates the need for chemical fertilizers.

We have also installed solar panels on our main barn, which now provides 60% of our electricity needs. The remaining energy comes from wind power through our local renewable energy cooperative.

Water conservation is another key focus area. Our new rainwater collection system captures and stores water for use during dry periods, reducing our reliance on municipal water supplies.

These initiatives not only benefit the environment but also improve the health and wellbeing of our animals by providing them with cleaner air, water, and living conditions.',
  '2024-01-10',
  'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Sustainability'
),
(
  'Educational Workshop Series',
  'Join us for our monthly educational workshops covering animal care, breeding, and farm management.',
  'We are pleased to announce our new educational workshop series, designed to share our knowledge and experience with fellow animal enthusiasts and aspiring farmers.

The workshop series covers a wide range of topics, from basic animal care to advanced breeding techniques. Each session is led by our experienced team members and includes both theoretical instruction and hands-on practice.

Upcoming workshops include:
- Basic Rabbit Care and Housing (February 15)
- Guinea Pig Nutrition and Health (March 10)
- Introduction to Animal Breeding (April 5)
- Sustainable Farm Management (May 12)

Each workshop is limited to 15 participants to ensure personalized attention and plenty of opportunity for questions and discussion. Participants receive comprehensive handouts and access to our online resource library.

The workshops are held in our newly renovated education center, which features modern audio-visual equipment and comfortable seating. Light refreshments are provided, and participants have the opportunity to tour our facilities.

Registration is now open on our website. Early bird pricing is available for those who register at least two weeks in advance.',
  '2024-01-05',
  'https://images.pexels.com/photos/4588015/pexels-photo-4588015.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Education'
);