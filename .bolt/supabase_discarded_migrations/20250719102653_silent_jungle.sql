/*
  # Sample Data for Farm Website

  1. Sample Data Inserts
    - Default farm settings
    - Sample home page content
    - Sample about page content
    - Sample contact page content
    - Sample animals and breeds
    - Sample news items
    - Sample education guides
    - Sample FAQs
    - Sample team members
    - Sample bi-products
    - Sample inventory items

  2. Notes
    - This provides initial data for testing and demonstration
    - All content can be modified through the management interface
*/

-- Insert default farm settings
INSERT INTO farm_settings (
  farm_name,
  farm_tagline,
  contact_email,
  contact_phone,
  address,
  timezone,
  currency,
  default_weight_unit
) VALUES (
  'iFarm',
  'Premium Livestock Breeding',
  'info@ifarm.com',
  '(555) 123-4567',
  '123 Farm Road, Rural Valley, ST 12345',
  'America/New_York',
  'USD',
  'lbs'
) ON CONFLICT DO NOTHING;

-- Insert home page content
INSERT INTO home_content (
  hero_title,
  hero_subtitle,
  hero_description,
  hero_image_url,
  hero_badge_text,
  hero_features,
  featured_section_title,
  featured_section_description,
  news_section_title,
  news_section_description,
  cta_buttons,
  stats
) VALUES (
  'Premium Livestock',
  'Breeding Farm',
  'Specializing in sustainable breeding practices across rabbits, guinea pigs, dogs, cats, and fowls. Quality animals raised with care and expertise.',
  'https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg?auto=compress&cs=tinysrgb&w=800',
  '15+ Years Experience',
  '[
    {"title": "Quality Breeding", "icon": "Award"},
    {"title": "Health Guaranteed", "icon": "Heart"},
    {"title": "Sustainable Practices", "icon": "Leaf"}
  ]',
  'Our Featured Animals',
  'Carefully selected breeds across rabbits, guinea pigs, dogs, cats, and fowls, each known for their exceptional qualities, health, and temperament.',
  'Latest News & Updates',
  'Stay informed about our latest breeding programs, farm updates, and educational content.',
  '[
    {"text": "View Our Animals", "link": "/products", "type": "primary"},
    {"text": "Learn More", "link": "/about", "type": "secondary"}
  ]',
  '[
    {"label": "Years Experience", "value": "15+", "icon": "Calendar"},
    {"label": "Happy Customers", "value": "500+", "icon": "Users"},
    {"label": "Animals Bred", "value": "2000+", "icon": "Heart"},
    {"label": "Species", "value": "5", "icon": "Star"}
  ]'
) ON CONFLICT DO NOTHING;

-- Insert about page content
INSERT INTO about_content (
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
  'Welcome to iFarm, where passion meets expertise in multi-species livestock breeding. For over 15 years, we have been dedicated to raising healthy, happy animals while maintaining the highest standards of care and sustainability.',
  'Our mission is to provide exceptional livestock through sustainable breeding practices, comprehensive care, and educational support. We believe in creating lasting relationships with our animals and customers while contributing to responsible agriculture.',
  '[
    {"title": "Quality First", "description": "Every animal receives individual attention and care", "icon": "Heart"},
    {"title": "Sustainability", "description": "Environmentally conscious farming practices", "icon": "Leaf"},
    {"title": "Excellence", "description": "Continuous improvement in all we do", "icon": "Award"},
    {"title": "Community", "description": "Supporting fellow farmers and animal lovers", "icon": "Users"}
  ]',
  'From humble beginnings to becoming a trusted name in multi-species breeding, our journey reflects our commitment to excellence and innovation in animal husbandry.',
  '[
    {"year": "2008", "title": "Farm Established", "icon": "Calendar"},
    {"year": "2012", "title": "Expanded to Multiple Species", "icon": "Heart"},
    {"year": "2018", "title": "Sustainability Certification", "icon": "Leaf"},
    {"year": "2023", "title": "Educational Program Launch", "icon": "Award"}
  ]',
  'Our commitment to excellence is recognized through various certifications and awards from agricultural and animal welfare organizations.',
  '[
    {"title": "Organic Certification", "description": "USDA Organic Certified", "color": "green"},
    {"title": "Animal Welfare Approved", "description": "High Welfare Standards", "color": "blue"},
    {"title": "Sustainable Farm Award", "description": "Environmental Excellence", "color": "green"},
    {"title": "Breeder Excellence", "description": "Quality Breeding Recognition", "color": "yellow"}
  ]',
  'Take a visual journey through our farm facilities, meet our animals, and see the care and attention that goes into every aspect of our operation.',
  '{
    "https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/4588003/pexels-photo-4588003.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/4588001/pexels-photo-4588001.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/4588004/pexels-photo-4588004.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/4588006/pexels-photo-4588006.jpeg?auto=compress&cs=tinysrgb&w=400"
  }'
) ON CONFLICT DO NOTHING;

-- Insert contact page content
INSERT INTO contact_content (
  hero_title,
  hero_description,
  contact_description,
  address,
  phone,
  email,
  business_hours,
  social_links,
  map_description,
  newsletter_title,
  newsletter_description,
  newsletter_privacy_text
) VALUES (
  'Get In Touch',
  'We would love to hear from you! Whether you have questions about our animals, need breeding advice, or want to schedule a farm visit, we are here to help.',
  'Our team is dedicated to providing exceptional service and support. We welcome inquiries about our animals, breeding programs, and educational resources.',
  '123 Farm Road, Rural Valley, ST 12345',
  '(555) 123-4567',
  'info@ifarm.com',
  '[
    {"day": "Monday - Friday", "hours": "8:00 AM - 6:00 PM"},
    {"day": "Saturday", "hours": "9:00 AM - 4:00 PM"},
    {"day": "Sunday", "hours": "By Appointment Only"}
  ]',
  '[
    {"platform": "Facebook", "url": "https://facebook.com/ifarm", "icon": "Facebook"},
    {"platform": "Instagram", "url": "https://instagram.com/ifarm", "icon": "Instagram"},
    {"platform": "Twitter", "url": "https://twitter.com/ifarm", "icon": "Twitter"}
  ]',
  'Visit our farm located in the heart of Rural Valley. We welcome scheduled visits to meet our animals and see our facilities.',
  'Stay Connected',
  'Subscribe to our newsletter for updates on new animals, breeding programs, educational content, and farm news.',
  'We respect your privacy and will never share your email address.'
) ON CONFLICT DO NOTHING;

-- Insert sample team members
INSERT INTO team_members (name, role, bio, image_url, specialties) VALUES
('Sarah Johnson', 'Farm Manager', 'With over 12 years of experience in animal husbandry, Sarah oversees all daily operations and ensures the highest standards of animal care.', 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400', '{"Farm Management", "Animal Health", "Breeding Programs"}'),
('Dr. Michael Chen', 'Veterinarian', 'Dr. Chen provides comprehensive veterinary care for all our animals, specializing in preventive medicine and breeding health.', 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400', '{"Veterinary Medicine", "Animal Health", "Breeding Consultation"}'),
('Emily Rodriguez', 'Animal Care Specialist', 'Emily specializes in the daily care and enrichment of our rabbits and guinea pigs, ensuring optimal health and happiness.', 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400', '{"Small Animal Care", "Nutrition", "Animal Behavior"}')
ON CONFLICT DO NOTHING;

-- Insert sample breeds
INSERT INTO breeds (name, type, description, characteristics, average_weight, primary_use, image_url, price_range) VALUES
('Holland Lop', 'rabbit', 'A popular dwarf rabbit breed known for their distinctive lopped ears and gentle temperament. Perfect for both pets and show.', '{"Gentle", "Compact", "Lopped Ears", "Good with Children"}', '2-4 lbs', 'Pet & Show', 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=400', '$50-150'),
('American Guinea Pig', 'guinea-pig', 'The most common guinea pig breed with a smooth, short coat. Known for their friendly nature and easy care requirements.', '{"Friendly", "Easy Care", "Short Coat", "Social"}', '1.5-2.5 lbs', 'Pet & Companion', 'https://images.pexels.com/photos/3361739/pexels-photo-3361739.jpeg?auto=compress&cs=tinysrgb&w=400', '$25-75'),
('Golden Retriever', 'dog', 'A friendly, intelligent, and devoted breed. Golden Retrievers are excellent family dogs and are known for their gentle mouths.', '{"Friendly", "Intelligent", "Loyal", "Good with Kids"}', '55-75 lbs', 'Family Pet & Working', 'https://images.pexels.com/photos/552598/pexels-photo-552598.jpeg?auto=compress&cs=tinysrgb&w=400', '$800-2000'),
('Maine Coon', 'cat', 'One of the largest domestic cat breeds, known for their intelligence, playful personality, and distinctive physical appearance.', '{"Large", "Intelligent", "Playful", "Long Hair"}', '10-25 lbs', 'Pet & Companion', 'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=400', '$400-1200'),
('Rhode Island Red', 'fowl', 'A popular dual-purpose chicken breed known for excellent egg production and hardiness in various climates.', '{"Hardy", "Good Layers", "Dual Purpose", "Cold Tolerant"}', '6-8 lbs', 'Eggs & Meat', 'https://images.pexels.com/photos/1300355/pexels-photo-1300355.jpeg?auto=compress&cs=tinysrgb&w=400', '$15-35')
ON CONFLICT DO NOTHING;

-- Insert sample animals
INSERT INTO animals (name, type, breed, age, weight, gender, color, status, price, description, image_url, temperament, vaccinations) VALUES
('Luna', 'rabbit', 'Holland Lop', 8, 3.2, 'female', 'Brown and White', 'available', 125, 'Beautiful Holland Lop doe with excellent temperament. Perfect for breeding or as a beloved pet.', 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=400', '{"Gentle", "Calm"}', '{"RHDV2", "Myxomatosis"}'),
('Buddy', 'dog', 'Golden Retriever', 24, 68.5, 'male', 'Golden', 'available', 1500, 'Well-trained Golden Retriever with excellent bloodlines. Great with children and other pets.', 'https://images.pexels.com/photos/552598/pexels-photo-552598.jpeg?auto=compress&cs=tinysrgb&w=400', '{"Friendly", "Intelligent", "Loyal"}', '{"DHPP", "Rabies", "Bordetella"}'),
('Whiskers', 'cat', 'Maine Coon', 18, 15.2, 'male', 'Brown Tabby', 'breeding', 800, 'Magnificent Maine Coon tom with champion bloodlines. Currently in our breeding program.', 'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=400', '{"Gentle", "Playful", "Intelligent"}', '{"FVRCP", "Rabies", "FeLV"}'),
('Henrietta', 'fowl', 'Rhode Island Red', 12, 6.8, 'female', 'Red', 'available', 25, 'Excellent laying hen with consistent egg production. Hardy and well-suited for backyard flocks.', 'https://images.pexels.com/photos/1300355/pexels-photo-1300355.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, NULL)
ON CONFLICT DO NOTHING;

-- Insert sample news items
INSERT INTO news_items (title, excerpt, content, date, image_url, category) VALUES
('New Breeding Program Launch', 'We are excited to announce our expanded breeding program for heritage breed chickens.', 'Our farm is proud to introduce a new heritage breed chicken program focusing on rare and endangered poultry breeds. This initiative supports biodiversity while providing customers with unique, hardy birds perfect for sustainable farming.', '2024-01-15', 'https://images.pexels.com/photos/1300355/pexels-photo-1300355.jpeg?auto=compress&cs=tinysrgb&w=400', 'Breeding'),
('Sustainable Farming Practices', 'Learn about our commitment to environmental stewardship and sustainable agriculture.', 'At iFarm, we believe in farming practices that benefit both animals and the environment. Our latest sustainability report shows significant improvements in water conservation, waste reduction, and renewable energy usage.', '2024-01-10', 'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=400', 'Sustainability'),
('Educational Workshop Series', 'Join us for hands-on workshops covering animal care, breeding, and farm management.', 'We are launching a series of educational workshops designed for both beginners and experienced animal enthusiasts. Topics include basic animal care, breeding fundamentals, and sustainable farming practices.', '2024-01-05', 'https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg?auto=compress&cs=tinysrgb&w=400', 'Education')
ON CONFLICT DO NOTHING;

-- Insert sample education guides
INSERT INTO education_guides (title, category, read_time, difficulty, rating, description, content, image_url) VALUES
('Basic Rabbit Care', 'Care', '10 min', 'Beginner', 4.8, 'Essential guide for new rabbit owners covering housing, feeding, and daily care requirements.', 'Caring for rabbits requires understanding their basic needs for housing, nutrition, and health care. This guide covers the fundamentals of rabbit care including proper housing setup, feeding schedules, and health monitoring.', 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Guinea Pig Nutrition', 'Nutrition', '15 min', 'Intermediate', 4.6, 'Comprehensive guide to feeding guinea pigs for optimal health and longevity.', 'Proper nutrition is crucial for guinea pig health. This guide covers dietary requirements, feeding schedules, and nutritional supplements needed for different life stages.', 'https://images.pexels.com/photos/3361739/pexels-photo-3361739.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Breeding Program Management', 'Breeding', '25 min', 'Advanced', 4.9, 'Advanced guide for managing successful breeding programs across multiple species.', 'Managing a breeding program requires careful planning, record keeping, and genetic understanding. This comprehensive guide covers breeding strategies, health considerations, and program management.', 'https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg?auto=compress&cs=tinysrgb&w=400')
ON CONFLICT DO NOTHING;

-- Insert sample FAQs
INSERT INTO faqs (question, answer) VALUES
('What should I feed my rabbit?', 'Rabbits need a diet consisting primarily of high-quality hay, fresh vegetables, and a small amount of pellets. Timothy hay should make up the majority of their diet, supplemented with leafy greens and a measured amount of rabbit pellets.'),
('How often should guinea pigs be groomed?', 'Guinea pigs should be brushed regularly, with long-haired breeds requiring daily brushing and short-haired breeds needing brushing 2-3 times per week. Regular nail trimming every 4-6 weeks is also important.'),
('What vaccinations do dogs need?', 'Core vaccines for dogs include DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza) and Rabies. Additional vaccines may be recommended based on lifestyle and regional disease risks. Consult with a veterinarian for a vaccination schedule.'),
('How do I prepare for a new pet?', 'Preparation includes setting up appropriate housing, purchasing necessary supplies (food, bedding, toys), pet-proofing your space, and scheduling a veterinary checkup. Research the specific needs of your chosen animal species.')
ON CONFLICT DO NOTHING;

-- Insert sample bi-products
INSERT INTO bi_products (name, description, image_url, price, unit, type, benefits, availability) VALUES
('Premium Rabbit Manure', 'Nutrient-rich organic fertilizer perfect for gardens and crops. Our rabbit manure is composted and ready to use.', 'https://images.pexels.com/photos/4505166/pexels-photo-4505166.jpeg?auto=compress&cs=tinysrgb&w=400', 15.99, 'per 25lb bag', 'manure', '{"High in nitrogen", "Improves soil structure", "Organic and natural", "Easy to apply"}', 'in-stock'),
('Organic Bedding Material', 'Clean, composted bedding material perfect for garden mulch and soil amendment.', 'https://images.pexels.com/photos/4505168/pexels-photo-4505168.jpeg?auto=compress&cs=tinysrgb&w=400', 12.99, 'per cubic yard', 'bedding', '{"Excellent mulch", "Retains moisture", "Suppresses weeds", "Adds organic matter"}', 'in-stock'),
('Liquid Fertilizer Concentrate', 'Concentrated liquid fertilizer made from processed animal waste. Dilute before use.', 'https://images.pexels.com/photos/4505167/pexels-photo-4505167.jpeg?auto=compress&cs=tinysrgb&w=400', 24.99, 'per gallon', 'urine', '{"Fast-acting nutrients", "Easy application", "Concentrated formula", "Organic source"}', 'seasonal')
ON CONFLICT DO NOTHING;

-- Insert sample inventory items
INSERT INTO inventory (name, category, animal_types, quantity, unit, low_stock_threshold, cost, supplier, last_restocked) VALUES
('Premium Rabbit Pellets', 'feed', '{"rabbit"}', 50, 'bags', 10, 18.99, 'Farm Supply Co', '2024-01-01'),
('Guinea Pig Vitamin C Supplement', 'medical', '{"guinea-pig"}', 25, 'bottles', 5, 12.50, 'Pet Health Plus', '2024-01-01'),
('Automatic Water System', 'equipment', '{"rabbit", "guinea-pig"}', 8, 'units', 2, 89.99, 'Farm Equipment Ltd', '2024-01-01'),
('Pine Shavings Bedding', 'bedding', '{"rabbit", "guinea-pig"}', 30, 'bales', 8, 8.99, 'Bedding Supplies Inc', '2024-01-01'),
('Dog Training Treats', 'feed', '{"dog"}', 15, 'bags', 3, 15.99, 'Pet Nutrition Co', '2024-01-01')
ON CONFLICT DO NOTHING;