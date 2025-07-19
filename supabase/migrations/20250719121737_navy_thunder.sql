/*
  # Populate Sample Data for iFarm Database

  This migration populates all tables with realistic sample data for testing and demonstration.
  
  1. Sample Data Includes:
     - Breeds across all animal types
     - Animals with proper relationships
     - Health records and vaccinations
     - Breeding programs and records
     - Inventory items and suppliers
     - Content items (news, guides)
     - Page content for static pages
     - Team members and farm settings
     - Facilities and bi-products

  2. Data Structure:
     - Proper foreign key relationships
     - Realistic values and descriptions
     - Sample images from Pexels
     - Comprehensive coverage of all features
*/

-- =============================================================================
-- BREEDS DATA
-- =============================================================================

INSERT INTO breeds (id, name, type, description, origin_country, characteristics, average_weight_min, average_weight_max, average_lifespan_years, primary_uses, care_level, climate_preferences, image_url, price_range_min, price_range_max, is_rare_breed) VALUES
-- Rabbit Breeds
('550e8400-e29b-41d4-a716-446655440001', 'Holland Lop', 'rabbit', 'Small, friendly rabbits with distinctive lopped ears. Known for their calm temperament and compact size, making them excellent pets and show animals.', 'Netherlands', '["Lopped ears", "Compact body", "Friendly temperament", "Easy to handle"]', 2.5, 4.0, 10, '{"pet", "show"}', 'easy', '{"temperate", "indoor"}', 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=800', 75.00, 150.00, false),
('550e8400-e29b-41d4-a716-446655440002', 'Flemish Giant', 'rabbit', 'One of the largest rabbit breeds, known for their gentle giant personality. Excellent for meat production and as gentle pets for experienced owners.', 'Belgium', '["Large size", "Gentle temperament", "Good meat production", "Docile nature"]', 13.0, 22.0, 8, '{"meat", "pet"}', 'moderate', '{"temperate", "cool"}', 'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=800', 100.00, 200.00, false),
('550e8400-e29b-41d4-a716-446655440003', 'New Zealand White', 'rabbit', 'Medium-sized rabbits with pure white coats and pink eyes. Excellent for meat production and laboratory use due to their consistent size and temperament.', 'United States', '["White coat", "Pink eyes", "Good meat production", "Consistent size"]', 9.0, 12.0, 8, '{"meat", "laboratory"}', 'easy', '{"temperate", "varied"}', 'https://images.pexels.com/photos/4588015/pexels-photo-4588015.jpeg?auto=compress&cs=tinysrgb&w=800', 50.00, 100.00, false),

-- Guinea Pig Breeds
('550e8400-e29b-41d4-a716-446655440004', 'American Guinea Pig', 'guinea-pig', 'The most common guinea pig breed with a smooth, short coat. Known for their friendly nature and ease of care, perfect for beginners.', 'South America', '["Short smooth coat", "Easy care", "Friendly nature", "Good for beginners"]', 1.5, 2.5, 6, '{"pet", "show"}', 'easy', '{"temperate", "indoor"}', 'https://images.pexels.com/photos/4588020/pexels-photo-4588020.jpeg?auto=compress&cs=tinysrgb&w=800', 25.00, 50.00, false),
('550e8400-e29b-41d4-a716-446655440005', 'Peruvian Guinea Pig', 'guinea-pig', 'Long-haired guinea pigs with flowing coats that require regular grooming. Popular in shows for their beautiful appearance.', 'Peru', '["Long flowing coat", "Show quality", "Requires grooming", "Beautiful appearance"]', 2.0, 3.0, 6, '{"pet", "show"}', 'difficult', '{"temperate", "indoor"}', 'https://images.pexels.com/photos/4588025/pexels-photo-4588025.jpeg?auto=compress&cs=tinysrgb&w=800', 40.00, 80.00, false),

-- Dog Breeds
('550e8400-e29b-41d4-a716-446655440006', 'Border Collie', 'dog', 'Highly intelligent working dogs bred for herding sheep. Known for their energy, trainability, and strong work ethic.', 'United Kingdom', '["High intelligence", "Herding instinct", "High energy", "Trainable"]', 30.0, 55.0, 14, '{"herding", "working", "pet"}', 'difficult', '{"temperate", "cool"}', 'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=800', 800.00, 1500.00, false),
('550e8400-e29b-41d4-a716-446655440007', 'Golden Retriever', 'dog', 'Friendly, intelligent, and devoted dogs. Originally bred for retrieving waterfowl, they make excellent family pets and service dogs.', 'Scotland', '["Friendly temperament", "Intelligent", "Good with children", "Loyal"]', 55.0, 75.0, 12, '{"pet", "service", "hunting"}', 'easy', '{"temperate", "varied"}', 'https://images.pexels.com/photos/552598/pexels-photo-552598.jpeg?auto=compress&cs=tinysrgb&w=800', 1000.00, 2000.00, false),

-- Cat Breeds
('550e8400-e29b-41d4-a716-446655440008', 'Maine Coon', 'cat', 'Large, gentle cats with long, shaggy coats. Known for their friendly personalities and impressive size, often called gentle giants.', 'United States', '["Large size", "Long coat", "Gentle personality", "Good with families"]', 10.0, 25.0, 15, '{"pet", "show"}', 'moderate', '{"temperate", "cool"}', 'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=800', 600.00, 1200.00, false),
('550e8400-e29b-41d4-a716-446655440009', 'Siamese', 'cat', 'Vocal, social cats with distinctive color points and blue eyes. Known for their intelligence and strong bonds with their owners.', 'Thailand', '["Color points", "Blue eyes", "Vocal", "Social"]', 8.0, 12.0, 15, '{"pet", "show"}', 'moderate', '{"warm", "temperate"}', 'https://images.pexels.com/photos/416138/pexels-photo-416138.jpeg?auto=compress&cs=tinysrgb&w=800', 400.00, 800.00, false),

-- Fowl Breeds
('550e8400-e29b-41d4-a716-446655440010', 'Rhode Island Red', 'fowl', 'Hardy, dual-purpose chickens known for excellent egg production and meat quality. One of the most popular backyard chicken breeds.', 'United States', '["Hardy", "Good egg production", "Dual purpose", "Easy care"]', 6.5, 8.5, 8, '{"eggs", "meat", "dual-purpose"}', 'easy', '{"temperate", "varied"}', 'https://images.pexels.com/photos/4588030/pexels-photo-4588030.jpeg?auto=compress&cs=tinysrgb&w=800', 25.00, 50.00, false),
('550e8400-e29b-41d4-a716-446655440011', 'Leghorn', 'fowl', 'Excellent egg layers producing large white eggs. Active, hardy birds that are efficient feed converters and prolific layers.', 'Italy', '["Excellent egg production", "Hardy", "Active", "Efficient feed conversion"]', 4.5, 6.0, 7, '{"eggs"}', 'easy', '{"temperate", "warm"}', 'https://images.pexels.com/photos/4588035/pexels-photo-4588035.jpeg?auto=compress&cs=tinysrgb&w=800', 20.00, 40.00, false);

-- =============================================================================
-- FACILITIES DATA
-- =============================================================================

INSERT INTO facilities (id, name, facility_type, description, capacity, current_occupancy, location, dimensions, climate_controlled) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Main Rabbit Barn', 'barn', 'Primary housing facility for breeding rabbits with individual cages and climate control', 50, 35, 'North Field', '40x60 feet', true),
('660e8400-e29b-41d4-a716-446655440002', 'Guinea Pig House', 'barn', 'Specialized facility for guinea pig colonies with proper ventilation and heating', 30, 22, 'East Side', '20x30 feet', true),
('660e8400-e29b-41d4-a716-446655440003', 'Dog Kennel Complex', 'kennel', 'Professional kennel facility with indoor/outdoor runs for breeding dogs', 20, 12, 'South Field', '60x40 feet', false),
('660e8400-e29b-41d4-a716-446655440004', 'Cat Cattery', 'cattery', 'Multi-level cattery with climbing structures and separate breeding areas', 25, 18, 'West Building', '30x40 feet', true),
('660e8400-e29b-41d4-a716-446655440005', 'Chicken Coop', 'coop', 'Free-range chicken coop with nesting boxes and outdoor run area', 100, 75, 'Back Pasture', '50x30 feet', false),
('660e8400-e29b-41d4-a716-446655440006', 'Feed Storage', 'storage', 'Climate-controlled storage for all animal feeds and supplies', 1000, 650, 'Central Location', '30x20 feet', true);

-- =============================================================================
-- GENETIC LINES DATA
-- =============================================================================

INSERT INTO genetic_lines (id, name, breed_id, description, founder_animals, characteristics) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Champion Holland Line', '550e8400-e29b-41d4-a716-446655440001', 'Elite breeding line from national champion Holland Lops', '{"Grand Champion Buster", "Best in Show Luna"}', '{"Superior ear set", "Excellent body type", "Show quality"}'),
('770e8400-e29b-41d4-a716-446655440002', 'Giant Production Line', '550e8400-e29b-41d4-a716-446655440002', 'High-yield meat production line of Flemish Giants', '{"Big Ben", "Gentle Greta"}', '{"Large size", "Fast growth", "Good feed conversion"}'),
('770e8400-e29b-41d4-a716-446655440003', 'Working Border Line', '550e8400-e29b-41d4-a716-446655440006', 'Working line Border Collies with strong herding instincts', '{"Champion Rex", "Working Belle"}', '{"Strong herding drive", "High intelligence", "Athletic build"}');

-- =============================================================================
-- ANIMALS DATA
-- =============================================================================

INSERT INTO animals (id, name, breed_id, genetic_line_id, facility_id, registration_number, date_of_birth, weight_lbs, gender, color, status, price, description, coat_type, size, temperament, is_breeding_quality, purpose, image_url) VALUES
-- Rabbits
('880e8400-e29b-41d4-a716-446655440001', 'Cocoa', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'HL2024001', '2023-03-15', 3.2, 'female', 'Chocolate', 'available', 125.00, 'Beautiful chocolate Holland Lop doe with excellent ear set and body type. From champion bloodlines with sweet temperament.', 'Dense', 'small', '{"Gentle", "Calm", "Friendly"}', true, null, 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=800'),
('880e8400-e29b-41d4-a716-446655440002', 'Thunder', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'FG2024001', '2022-08-20', 18.5, 'male', 'Steel Gray', 'breeding', null, 'Massive Flemish Giant buck with excellent conformation. Proven breeder with gentle temperament and strong genetics.', 'Dense', 'extra-large', '{"Gentle", "Docile", "Calm"}', true, null, 'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=800'),
('880e8400-e29b-41d4-a716-446655440003', 'Snowball', '550e8400-e29b-41d4-a716-446655440003', null, '660e8400-e29b-41d4-a716-446655440001', 'NZ2024001', '2023-06-10', 10.2, 'female', 'White', 'available', 75.00, 'Prime New Zealand White doe ready for breeding or meat production. Excellent health and conformation.', 'Short', 'medium', '{"Calm", "Hardy", "Productive"}', true, null, 'https://images.pexels.com/photos/4588015/pexels-photo-4588015.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Guinea Pigs
('880e8400-e29b-41d4-a716-446655440004', 'Patches', '550e8400-e29b-41d4-a716-446655440004', null, '660e8400-e29b-41d4-a716-446655440002', null, '2023-09-05', 2.1, 'male', 'Tri-color', 'available', 35.00, 'Adorable American guinea pig with beautiful tri-color markings. Very social and great with children.', 'Short', 'small', '{"Social", "Friendly", "Active"}', false, null, 'https://images.pexels.com/photos/4588020/pexels-photo-4588020.jpeg?auto=compress&cs=tinysrgb&w=800'),
('880e8400-e29b-41d4-a716-446655440005', 'Rapunzel', '550e8400-e29b-41d4-a716-446655440005', null, '660e8400-e29b-41d4-a716-446655440002', 'PV2024001', '2023-04-12', 2.8, 'female', 'Golden', 'available', 65.00, 'Stunning Peruvian guinea pig with flowing golden coat. Show quality with excellent lineage.', 'Long', 'small', '{"Gentle", "Show quality", "Beautiful"}', true, null, 'https://images.pexels.com/photos/4588025/pexels-photo-4588025.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Dogs
('880e8400-e29b-41d4-a716-446655440006', 'Rex', '550e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'BC2024001', '2022-01-15', 45.0, 'male', 'Black and White', 'breeding', null, 'Outstanding Border Collie stud with proven working ability and excellent temperament. Champion bloodlines.', 'Medium', 'medium', '{"Intelligent", "Energetic", "Loyal", "Working"}', true, null, 'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=800'),
('880e8400-e29b-41d4-a716-446655440007', 'Honey', '550e8400-e29b-41d4-a716-446655440007', null, '660e8400-e29b-41d4-a716-446655440003', 'GR2024001', '2023-02-28', 62.0, 'female', 'Golden', 'available', 1200.00, 'Beautiful Golden Retriever female with excellent temperament. Perfect family dog with champion bloodlines.', 'Long', 'large', '{"Friendly", "Gentle", "Intelligent", "Loyal"}', true, null, 'https://images.pexels.com/photos/552598/pexels-photo-552598.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Cats
('880e8400-e29b-41d4-a716-446655440008', 'Titan', '550e8400-e29b-41d4-a716-446655440008', null, '660e8400-e29b-41d4-a716-446655440004', 'MC2024001', '2022-11-08', 18.5, 'male', 'Brown Tabby', 'breeding', null, 'Magnificent Maine Coon tom with impressive size and gentle nature. Excellent for breeding programs.', 'Long', 'extra-large', '{"Gentle", "Calm", "Friendly", "Majestic"}', true, null, 'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=800'),
('880e8400-e29b-41d4-a716-446655440009', 'Sapphire', '550e8400-e29b-41d4-a716-446655440009', null, '660e8400-e29b-41d4-a716-446655440004', 'SM2024001', '2023-07-22', 9.5, 'female', 'Seal Point', 'available', 650.00, 'Stunning Siamese female with perfect color points and bright blue eyes. Very vocal and affectionate.', 'Short', 'medium', '{"Vocal", "Social", "Intelligent", "Affectionate"}', true, null, 'https://images.pexels.com/photos/416138/pexels-photo-416138.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Fowl
('880e8400-e29b-41d4-a716-446655440010', 'Ruby', '550e8400-e29b-41d4-a716-446655440010', null, '660e8400-e29b-41d4-a716-446655440005', null, '2023-05-01', 7.2, 'female', 'Deep Red', 'available', 35.00, 'Excellent Rhode Island Red hen with consistent egg production. Hardy and reliable layer.', null, null, '{"Hardy", "Productive", "Calm"}', false, 'dual-purpose', 'https://images.pexels.com/photos/4588030/pexels-photo-4588030.jpeg?auto=compress&cs=tinysrgb&w=800'),
('880e8400-e29b-41d4-a716-446655440011', 'Pearl', '550e8400-e29b-41d4-a716-446655440011', null, '660e8400-e29b-41d4-a716-446655440005', null, '2023-03-20', 5.1, 'female', 'White', 'available', 28.00, 'Outstanding Leghorn hen with exceptional egg production. Lays large white eggs consistently.', null, null, '{"Productive", "Active", "Hardy"}', false, 'eggs', 'https://images.pexels.com/photos/4588035/pexels-photo-4588035.jpeg?auto=compress&cs=tinysrgb&w=800');

-- =============================================================================
-- VETERINARIANS DATA
-- =============================================================================

INSERT INTO veterinarians (id, name, license_number, phone, email, clinic_name, address, specialties, emergency_contact) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Dr. Sarah Johnson', 'VET12345', '(555) 234-5678', 'dr.johnson@vetclinic.com', 'Rural Valley Veterinary Clinic', '456 Main Street, Rural Valley, ST 12345', '{"Small Animals", "Exotic Pets", "Surgery"}', true),
('990e8400-e29b-41d4-a716-446655440002', 'Dr. Michael Chen', 'VET12346', '(555) 345-6789', 'dr.chen@animalhealth.com', 'Farm Animal Health Services', '789 Country Road, Rural Valley, ST 12345', '{"Large Animals", "Reproduction", "Herd Health"}', false),
('990e8400-e29b-41d4-a716-446655440003', 'Dr. Emily Rodriguez', 'VET12347', '(555) 456-7890', 'dr.rodriguez@petcare.com', 'Companion Animal Care', '321 Pet Lane, Rural Valley, ST 12345', '{"Cats", "Dogs", "Preventive Care"}', true);

-- =============================================================================
-- SUPPLIERS DATA
-- =============================================================================

INSERT INTO suppliers (id, name, contact_person, phone, email, address, payment_terms, preferred_payment_method) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'Premium Feed Supply Co.', 'John Smith', '(555) 567-8901', 'orders@premiumfeed.com', '123 Industrial Blvd, Feed City, ST 54321', 'Net 30', 'credit_card'),
('aa0e8400-e29b-41d4-a716-446655440002', 'Veterinary Supply Depot', 'Lisa Brown', '(555) 678-9012', 'sales@vetsupply.com', '456 Medical Way, Supply Town, ST 65432', 'Net 15', 'bank_transfer'),
('aa0e8400-e29b-41d4-a716-446655440003', 'Farm Equipment Plus', 'Mike Wilson', '(555) 789-0123', 'info@farmequip.com', '789 Equipment Dr, Tool City, ST 76543', 'COD', 'check');

-- =============================================================================
-- INVENTORY ITEMS DATA
-- =============================================================================

INSERT INTO inventory_items (id, name, sku, category, animal_types, unit, current_quantity, low_stock_threshold, cost_per_unit, supplier_id, storage_location) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'Premium Rabbit Pellets', 'FEED-RAB-001', 'feed', '{"rabbit"}', 'bags', 25, 5, 18.50, 'aa0e8400-e29b-41d4-a716-446655440001', 'Feed Storage A1'),
('bb0e8400-e29b-41d4-a716-446655440002', 'Guinea Pig Complete Food', 'FEED-GP-001', 'feed', '{"guinea-pig"}', 'bags', 15, 3, 22.00, 'aa0e8400-e29b-41d4-a716-446655440001', 'Feed Storage A2'),
('bb0e8400-e29b-41d4-a716-446655440003', 'Premium Dog Food', 'FEED-DOG-001', 'feed', '{"dog"}', 'bags', 12, 2, 45.00, 'aa0e8400-e29b-41d4-a716-446655440001', 'Feed Storage B1'),
('bb0e8400-e29b-41d4-a716-446655440004', 'Cat Food Premium', 'FEED-CAT-001', 'feed', '{"cat"}', 'bags', 8, 2, 35.00, 'aa0e8400-e29b-41d4-a716-446655440001', 'Feed Storage B2'),
('bb0e8400-e29b-41d4-a716-446655440005', 'Chicken Layer Feed', 'FEED-FOWL-001', 'feed', '{"fowl"}', 'bags', 20, 4, 16.00, 'aa0e8400-e29b-41d4-a716-446655440001', 'Feed Storage C1'),
('bb0e8400-e29b-41d4-a716-446655440006', 'Pine Shavings Bedding', 'BED-PINE-001', 'bedding', '{"rabbit", "guinea-pig", "cat"}', 'bales', 30, 8, 12.00, 'aa0e8400-e29b-41d4-a716-446655440001', 'Bedding Storage'),
('bb0e8400-e29b-41d4-a716-446655440007', 'Antibiotics - Penicillin', 'MED-PEN-001', 'medical', '{"rabbit", "guinea-pig", "dog", "cat", "fowl"}', 'bottles', 5, 2, 25.00, 'aa0e8400-e29b-41d4-a716-446655440002', 'Medical Cabinet'),
('bb0e8400-e29b-41d4-a716-446655440008', 'Digital Scale', 'EQUIP-SCALE-001', 'equipment', '{"rabbit", "guinea-pig", "dog", "cat", "fowl"}', 'units', 3, 1, 85.00, 'aa0e8400-e29b-41d4-a716-446655440003', 'Equipment Room');

-- =============================================================================
-- BI-PRODUCTS DATA
-- =============================================================================

INSERT INTO bi_products (id, name, description, type, source_animals, image_url, price, unit, benefits, availability, current_stock) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', 'Premium Rabbit Manure', 'Organic rabbit manure, perfect for gardens and composting. Rich in nitrogen and easy to apply.', 'manure', '{"rabbit"}', 'https://images.pexels.com/photos/4588040/pexels-photo-4588040.jpeg?auto=compress&cs=tinysrgb&w=800', 15.00, 'per 25lb bag', '{"High nitrogen content", "Organic certified", "Easy to apply", "Improves soil structure"}', 'in-stock', 45),
('cc0e8400-e29b-41d4-a716-446655440002', 'Composted Chicken Manure', 'Well-aged chicken manure compost, excellent for vegetable gardens and flower beds.', 'compost', '{"fowl"}', 'https://images.pexels.com/photos/4588045/pexels-photo-4588045.jpeg?auto=compress&cs=tinysrgb&w=800', 12.00, 'per cubic yard', '{"Well composted", "Balanced nutrients", "Weed-free", "Ready to use"}', 'in-stock', 25),
('cc0e8400-e29b-41d4-a716-446655440003', 'Used Pine Bedding', 'Clean used pine bedding, perfect for garden mulch and composting material.', 'bedding', '{"rabbit", "guinea-pig"}', 'https://images.pexels.com/photos/4588050/pexels-photo-4588050.jpeg?auto=compress&cs=tinysrgb&w=800', 8.00, 'per bag', '{"Natural mulch", "Pest deterrent", "Aromatic", "Biodegradable"}', 'seasonal', 15);

-- =============================================================================
-- BREEDING PROGRAMS DATA
-- =============================================================================

INSERT INTO breeding_programs (id, name, animal_type, breed_id, description, goals, target_traits, start_date, program_manager_id) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', 'Holland Lop Excellence Program', 'rabbit', '550e8400-e29b-41d4-a716-446655440001', 'Breeding program focused on producing show-quality Holland Lops with excellent ear set and body type.', '{"Improve ear set", "Enhance body type", "Maintain temperament"}', '{"Perfect ear placement", "Compact body", "Dense coat", "Calm temperament"}', '2024-01-01', null),
('dd0e8400-e29b-41d4-a716-446655440002', 'Meat Production Program', 'rabbit', '550e8400-e29b-41d4-a716-446655440002', 'Commercial meat rabbit program focusing on growth rate and feed conversion efficiency.', '{"Increase growth rate", "Improve feed conversion", "Maintain health"}', '{"Fast growth", "Efficient feed conversion", "Large litter size", "Good health"}', '2024-01-01', null),
('dd0e8400-e29b-41d4-a716-446655440003', 'Working Dog Program', 'dog', '550e8400-e29b-41d4-a716-446655440006', 'Border Collie breeding program for working dogs with strong herding instincts.', '{"Maintain working ability", "Improve trainability", "Ensure health"}', '{"Strong herding instinct", "High intelligence", "Athletic build", "Good health"}', '2024-01-01', null);

-- =============================================================================
-- BREEDING RECORDS DATA
-- =============================================================================

INSERT INTO breeding_records (id, program_id, sire_id, dam_id, breeding_date, expected_birth_date, status, notes) VALUES
('ee0e8400-e29b-41d4-a716-446655440001', 'dd0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440003', '2024-01-15', '2024-02-15', 'completed', 'Successful breeding resulting in 8 healthy kits'),
('ee0e8400-e29b-41d4-a716-446655440002', 'dd0e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440007', '2024-02-01', '2024-04-05', 'bred', 'First breeding for this pair, expecting 6-8 puppies');

-- =============================================================================
-- HEALTH RECORDS DATA
-- =============================================================================

INSERT INTO health_records (id, animal_id, veterinarian_id, record_type, record_date, title, description, cost) VALUES
('ff0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'checkup', '2024-01-10', 'Annual Health Checkup', 'Complete physical examination, all systems normal. Excellent body condition.', 45.00),
('ff0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440006', '990e8400-e29b-41d4-a716-446655440003', 'vaccination', '2024-01-05', 'Annual Vaccinations', 'DHPP and Rabies vaccinations administered. No adverse reactions.', 75.00),
('ff0e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440008', '990e8400-e29b-41d4-a716-446655440003', 'checkup', '2024-01-20', 'Breeding Soundness Exam', 'Pre-breeding examination, all parameters normal. Cleared for breeding.', 65.00);

-- =============================================================================
-- VACCINATIONS DATA
-- =============================================================================

INSERT INTO vaccinations (id, animal_id, vaccine_name, administered_date, administered_by, next_due_date) VALUES
('110e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440006', 'DHPP', '2024-01-05', '990e8400-e29b-41d4-a716-446655440003', '2025-01-05'),
('110e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440006', 'Rabies', '2024-01-05', '990e8400-e29b-41d4-a716-446655440003', '2027-01-05'),
('110e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440007', 'DHPP', '2024-01-12', '990e8400-e29b-41d4-a716-446655440003', '2025-01-12'),
('110e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440008', 'FVRCP', '2024-01-15', '990e8400-e29b-41d4-a716-446655440003', '2025-01-15'),
('110e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440009', 'FVRCP', '2024-01-18', '990e8400-e29b-41d4-a716-446655440003', '2025-01-18');

-- =============================================================================
-- TEAM MEMBERS DATA
-- =============================================================================

INSERT INTO team_members (id, name, role, bio, image_url, specialties, email, phone) VALUES
('120e8400-e29b-41d4-a716-446655440001', 'Sarah Mitchell', 'Farm Manager', 'With over 15 years of experience in livestock management, Sarah oversees all daily operations and ensures the highest standards of animal care.', 'https://images.pexels.com/photos/4588055/pexels-photo-4588055.jpeg?auto=compress&cs=tinysrgb&w=800', '{"Livestock Management", "Breeding Programs", "Health Monitoring"}', 'sarah@ifarm.com', '(555) 123-4567'),
('120e8400-e29b-41d4-a716-446655440002', 'Dr. James Wilson', 'Head Veterinarian', 'Board-certified veterinarian specializing in small animal medicine and surgery. Ensures optimal health for all our animals.', 'https://images.pexels.com/photos/4588060/pexels-photo-4588060.jpeg?auto=compress&cs=tinysrgb&w=800', '{"Veterinary Medicine", "Surgery", "Preventive Care"}', 'dr.wilson@ifarm.com', '(555) 234-5678'),
('120e8400-e29b-41d4-a716-446655440003', 'Maria Rodriguez', 'Breeding Specialist', 'Expert in animal genetics and breeding programs. Manages our selective breeding initiatives across all species.', 'https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg?auto=compress&cs=tinysrgb&w=800', '{"Animal Genetics", "Breeding Programs", "Record Keeping"}', 'maria@ifarm.com', '(555) 345-6789'),
('120e8400-e29b-41d4-a716-446655440004', 'Tom Anderson', 'Facilities Manager', 'Responsible for maintaining all farm facilities and ensuring optimal living conditions for our animals.', 'https://images.pexels.com/photos/4588070/pexels-photo-4588070.jpeg?auto=compress&cs=tinysrgb&w=800', '{"Facility Maintenance", "Climate Control", "Safety Systems"}', 'tom@ifarm.com', '(555) 456-7890');

-- =============================================================================
-- PAGE CONTENT DATA
-- =============================================================================

INSERT INTO page_content (page_type, content_data, is_published) VALUES
('home', '{
  "hero_title": "Premium Livestock",
  "hero_subtitle": "Breeding Farm",
  "hero_description": "Dedicated to sustainable farming practices and breeding excellence across rabbits, guinea pigs, dogs, cats, and fowls. Serving the community with quality livestock and educational resources since 2015.",
  "hero_image_url": "https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=800",
  "hero_badge_text": "15+ Years Experience",
  "hero_features": [
    {"title": "Quality Breeding", "icon": "Award"},
    {"title": "Health Guaranteed", "icon": "Heart"},
    {"title": "Sustainable Practices", "icon": "Leaf"}
  ],
  "featured_section_title": "Our Featured Animals",
  "featured_section_description": "Carefully selected breeds across rabbits, guinea pigs, dogs, cats, and fowls, each known for their exceptional qualities, health, and temperament.",
  "news_section_title": "Latest News & Updates",
  "news_section_description": "Stay informed about our latest breeding programs, farm updates, and educational content.",
  "cta_buttons": [
    {"text": "View Our Animals", "link": "/products", "type": "primary"},
    {"text": "Contact Us", "link": "/contact", "type": "secondary"}
  ],
  "stats": [
    {"label": "Years Experience", "value": "15+", "icon": "Award"},
    {"label": "Happy Customers", "value": "500+", "icon": "Users"},
    {"label": "Animals Raised", "value": "2000+", "icon": "Heart"}
  ]
}', true),

('about', '{
  "hero_intro_text": "At iFarm, we are passionate about raising healthy, happy animals through sustainable and ethical farming practices. Our commitment to excellence spans over 15 years of dedicated service to the livestock community.",
  "mission_statement": "Our mission is to provide the highest quality livestock while promoting sustainable farming practices, animal welfare, and education. We believe in building lasting relationships with our customers and contributing positively to our community.",
  "history_intro_text": "Founded in 2009 with a simple vision: to raise the standard of livestock breeding through dedication, expertise, and genuine care for animals.",
  "certifications_intro_text": "We are proud to hold various certifications and awards that recognize our commitment to excellence and ethical practices.",
  "gallery_intro_text": "Take a visual tour of our facilities and see our animals in their natural, comfortable environments.",
  "values_list": [
    {"title": "Quality", "description": "We maintain the highest standards in breeding and care", "icon": "Award"},
    {"title": "Sustainability", "description": "Environmentally responsible farming practices", "icon": "Leaf"},
    {"title": "Integrity", "description": "Honest, transparent business practices", "icon": "Heart"},
    {"title": "Education", "description": "Sharing knowledge with our community", "icon": "Users"}
  ],
  "history_milestones": [
    {"year": "2009", "title": "Farm Established", "icon": "Calendar"},
    {"year": "2015", "title": "Expanded to Multiple Species", "icon": "Heart"},
    {"year": "2020", "title": "Organic Certification", "icon": "Leaf"},
    {"year": "2024", "title": "Educational Programs Launch", "icon": "Users"}
  ],
  "certifications_awards": [
    {"title": "Organic Certified", "description": "USDA Organic Certification", "color": "green"},
    {"title": "Animal Welfare Approved", "description": "High welfare standards", "color": "blue"},
    {"title": "Best Farm 2023", "description": "Regional farming excellence", "color": "yellow"},
    {"title": "Sustainability Award", "description": "Environmental stewardship", "color": "green"}
  ],
  "gallery_images": [
    "https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4588030/pexels-photo-4588030.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4588020/pexels-photo-4588020.jpeg?auto=compress&cs=tinysrgb&w=800"
  ]
}', true),

('contact', '{
  "hero_title": "Get In Touch",
  "hero_description": "We would love to hear from you! Whether you have questions about our animals, want to schedule a visit, or need expert advice, our team is here to help.",
  "contact_description": "Our knowledgeable team is available to answer questions about our animals, breeding programs, and care recommendations. We welcome visitors by appointment and are always happy to share our expertise.",
  "address": "123 Farm Road, Rural Valley, ST 12345",
  "phone": "(555) 123-4567",
  "email": "info@ifarm.com",
  "business_hours": [
    {"day": "Monday - Friday", "hours": "8:00 AM - 6:00 PM"},
    {"day": "Saturday", "hours": "9:00 AM - 4:00 PM"},
    {"day": "Sunday", "hours": "By Appointment Only"}
  ],
  "social_links": [
    {"platform": "Facebook", "url": "https://facebook.com/ifarm", "icon": "Facebook"},
    {"platform": "Instagram", "url": "https://instagram.com/ifarm", "icon": "Instagram"},
    {"platform": "Twitter", "url": "https://twitter.com/ifarm", "icon": "Twitter"}
  ],
  "map_description": "Visit our farm located in the heart of Rural Valley. We offer guided tours by appointment to see our facilities and meet our animals.",
  "newsletter_title": "Stay Connected",
  "newsletter_description": "Subscribe to our newsletter for updates on new animals, breeding programs, and educational content.",
  "newsletter_privacy_text": "We respect your privacy and will never share your information."
}', true);

-- =============================================================================
-- CONTENT ITEMS DATA (News and Guides)
-- =============================================================================

INSERT INTO content_items (id, content_type, title, slug, excerpt, content, category, tags, difficulty, read_time, rating, is_published, published_date) VALUES
-- News Articles
('130e8400-e29b-41d4-a716-446655440001', 'news', 'New Holland Lop Breeding Program Launched', 'new-holland-lop-breeding-program', 'We are excited to announce the launch of our new Holland Lop breeding program, focusing on show-quality animals with exceptional temperaments.', 'We are thrilled to announce the launch of our comprehensive Holland Lop breeding program. This initiative represents months of careful planning and selection of our foundation breeding stock.

Our program focuses on three key areas: superior ear set, excellent body type, and gentle temperaments. We have carefully selected our breeding animals from champion bloodlines across the country.

The program will produce animals suitable for both show competition and as beloved family pets. Each animal in our program undergoes rigorous health testing and temperament evaluation.

We expect our first litters to be available in late spring, with reservations being taken now for serious buyers.', 'Breeding', '{"breeding", "holland-lop", "rabbits"}', null, null, null, true, '2024-01-15'),

('130e8400-e29b-41d4-a716-446655440002', 'news', 'Sustainable Farming Practices Update', 'sustainable-farming-practices-update', 'Learn about our latest initiatives in sustainable farming and how we are reducing our environmental impact while maintaining the highest standards of animal care.', 'Sustainability has always been at the core of our farming philosophy. This year, we have implemented several new initiatives to further reduce our environmental impact.

Our new composting system processes all organic waste from our facilities, creating nutrient-rich compost for local gardens. We have also installed solar panels to reduce our energy consumption.

Water conservation measures include rainwater collection systems and efficient watering systems for all our animals. These improvements have reduced our water usage by 30% while maintaining optimal conditions for our animals.

We are proud to be leaders in sustainable livestock farming and continue to seek new ways to improve our practices.', 'Sustainability', '{"sustainability", "environment", "farming"}', null, null, null, true, '2024-01-20'),

-- Education Guides
('130e8400-e29b-41d4-a716-446655440003', 'guide', 'Complete Guide to Rabbit Care', 'complete-guide-rabbit-care', 'Everything you need to know about caring for rabbits, from housing and feeding to health management and breeding.', 'Caring for rabbits requires understanding their unique needs and behaviors. This comprehensive guide covers all aspects of rabbit care.

# Housing Requirements

Rabbits need spacious, secure housing with proper ventilation. Indoor cages should be at least 4 times the length of the rabbit when fully stretched out.

# Feeding Guidelines

A proper diet consists of high-quality pellets, unlimited timothy hay, and fresh vegetables. Avoid foods high in sugar or starch.

# Health Management

Regular health checks are essential. Watch for signs of illness including changes in appetite, behavior, or bathroom habits.

# Breeding Considerations

If breeding, ensure both animals are healthy and of appropriate age. Gestation period is approximately 31 days.

# Common Health Issues

Dental problems, GI stasis, and respiratory infections are common. Early detection and veterinary care are crucial.', 'Care', '{"rabbits", "care", "health", "housing"}', 'Beginner', '15 min', 4.8, true, '2024-01-10'),

('130e8400-e29b-41d4-a716-446655440004', 'guide', 'Dog Training Fundamentals', 'dog-training-fundamentals', 'Essential training techniques for raising well-behaved, happy dogs. Covers basic commands, house training, and socialization.', 'Training your dog is one of the most important investments you can make in your relationship. This guide covers fundamental training principles.

# Basic Commands

Start with essential commands: sit, stay, come, and down. Use positive reinforcement and consistency.

# House Training

Establish a routine and be patient. Most dogs can be house trained within 4-6 months with consistent effort.

# Socialization

Early socialization is crucial for developing a well-adjusted dog. Expose your puppy to various people, animals, and environments.

# Problem Solving

Address behavioral issues early with positive training methods. Seek professional help for serious problems.

# Advanced Training

Once basics are mastered, consider advanced training for specific activities or sports.', 'Training', '{"dogs", "training", "behavior", "socialization"}', 'Intermediate', '20 min', 4.9, true, '2024-01-12');

-- =============================================================================
-- FAQS DATA
-- =============================================================================

INSERT INTO faqs (question, answer, category, order_index, is_published) VALUES
('What animals do you breed?', 'We specialize in breeding rabbits, guinea pigs, dogs, cats, and various fowl species. Each animal is carefully selected for health, temperament, and breed standards.', 'General', 1, true),
('Do you offer health guarantees?', 'Yes, all our animals come with comprehensive health guarantees. We provide health certificates and vaccination records with each animal.', 'Health', 2, true),
('Can I visit the farm?', 'Absolutely! We welcome visitors by appointment. This allows us to provide personalized attention and ensure the safety of our animals.', 'Visits', 3, true),
('What is your breeding philosophy?', 'We focus on breeding for health, temperament, and breed standards. We never compromise on animal welfare for profit and maintain detailed health and genetic records.', 'Breeding', 4, true),
('Do you ship animals?', 'We prefer local pickup for the welfare of our animals, but we can arrange safe transportation for qualified buyers within a reasonable distance.', 'Sales', 5, true),
('What support do you provide after purchase?', 'We provide ongoing support including care guidance, feeding recommendations, and are always available to answer questions about your new animal.', 'Support', 6, true);

-- =============================================================================
-- CUSTOMERS DATA
-- =============================================================================

INSERT INTO customers (id, customer_type, first_name, last_name, email, phone, city, state, notes) VALUES
('140e8400-e29b-41d4-a716-446655440001', 'individual', 'Jennifer', 'Smith', 'jennifer.smith@email.com', '(555) 111-2222', 'Hometown', 'ST', 'Regular customer, interested in Holland Lops'),
('140e8400-e29b-41d4-a716-446655440002', 'business', 'Pet', 'Store Plus', 'orders@petstoreplus.com', '(555) 333-4444', 'City Center', 'ST', 'Wholesale buyer for guinea pigs'),
('140e8400-e29b-41d4-a716-446655440003', 'individual', 'Robert', 'Johnson', 'rob.johnson@email.com', '(555) 555-6666', 'Farmville', 'ST', 'Interested in breeding dogs');

-- =============================================================================
-- FINANCIAL TRANSACTIONS DATA
-- =============================================================================

INSERT INTO financial_transactions (id, transaction_type, amount, payment_method, description, category, animal_id, customer_id, transaction_date, status) VALUES
('150e8400-e29b-41d4-a716-446655440001', 'sale', 125.00, 'credit_card', 'Sale of Holland Lop doe Cocoa', 'Animal Sales', '880e8400-e29b-41d4-a716-446655440001', '140e8400-e29b-41d4-a716-446655440001', '2024-01-25', 'completed'),
('150e8400-e29b-41d4-a716-446655440002', 'purchase', -450.00, 'bank_transfer', 'Premium feed supply order', 'Feed', null, null, '2024-01-20', 'completed'),
('150e8400-e29b-41d4-a716-446655440003', 'sale', 70.00, 'cash', 'Guinea pig pair sale', 'Animal Sales', '880e8400-e29b-41d4-a716-446655440004', '140e8400-e29b-41d4-a716-446655440002', '2024-01-22', 'completed');

-- =============================================================================
-- COMPLETION MESSAGE
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Sample data population completed successfully!';
    RAISE NOTICE 'Data includes:';
    RAISE NOTICE '- 11 breeds across all animal types';
    RAISE NOTICE '- 11 animals with proper relationships';
    RAISE NOTICE '- 6 facilities for housing';
    RAISE NOTICE '- 3 veterinarians and health records';
    RAISE NOTICE '- 3 suppliers and 8 inventory items';
    RAISE NOTICE '- 3 bi-products for sustainable farming';
    RAISE NOTICE '- 4 team members';
    RAISE NOTICE '- Page content for home, about, and contact pages';
    RAISE NOTICE '- News articles and education guides';
    RAISE NOTICE '- FAQs and customer data';
    RAISE NOTICE '- Sample financial transactions';
    RAISE NOTICE 'The database is now ready for testing and demonstration!';
END$$;