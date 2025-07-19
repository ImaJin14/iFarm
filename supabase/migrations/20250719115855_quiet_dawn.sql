/*
  # iFarm Complete Database Schema Implementation

  1. Schema Changes
    - Implements comprehensive livestock management system
    - Adds proper normalization with breed_id, facility_id relationships
    - Replaces simple tables with normalized content management
    - Adds health tracking, breeding programs, inventory management
    - Implements proper RLS policies for all tables

  2. Key Features
    - Multi-species animal management with proper breed relationships
    - Health records and vaccination tracking
    - Breeding program management with offspring tracking
    - Inventory management with batch tracking
    - Content management system for news, guides, and pages
    - Financial transaction tracking
    - Team member management
    - Comprehensive farm settings

  3. Security
    - Row Level Security enabled on all tables
    - Role-based access control (administrator, farm, customer)
    - Proper policies for data access and modification
*/

-- =============================================================================
-- CLEANUP AND PREPARATION
-- =============================================================================

-- Drop existing objects if they exist (in reverse dependency order)
DROP VIEW IF EXISTS inventory_status_view CASCADE;
DROP VIEW IF EXISTS breeding_performance_view CASCADE;
DROP VIEW IF EXISTS animal_health_summary CASCADE;
DROP VIEW IF EXISTS available_animals_view CASCADE;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS get_breeding_calendar(integer) CASCADE;
DROP FUNCTION IF EXISTS get_health_reminders(integer) CASCADE;
DROP FUNCTION IF EXISTS check_low_stock_items() CASCADE;
DROP FUNCTION IF EXISTS calculate_age_months(date) CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop types if they exist
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS guide_difficulty CASCADE;
DROP TYPE IF EXISTS content_type CASCADE;
DROP TYPE IF EXISTS page_type CASCADE;
DROP TYPE IF EXISTS availability_status CASCADE;
DROP TYPE IF EXISTS biproduct_type CASCADE;
DROP TYPE IF EXISTS inventory_transaction_type CASCADE;
DROP TYPE IF EXISTS inventory_category CASCADE;
DROP TYPE IF EXISTS offspring_status CASCADE;
DROP TYPE IF EXISTS breeding_status CASCADE;
DROP TYPE IF EXISTS health_record_type CASCADE;
DROP TYPE IF EXISTS fowl_purpose CASCADE;
DROP TYPE IF EXISTS animal_size CASCADE;
DROP TYPE IF EXISTS animal_status CASCADE;
DROP TYPE IF EXISTS animal_gender CASCADE;
DROP TYPE IF EXISTS animal_type CASCADE;
DROP TYPE IF EXISTS activity_type CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- =============================================================================
-- EXTENSIONS AND FUNCTIONS
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Updated timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate animal age in months (immutable version)
CREATE OR REPLACE FUNCTION calculate_age_months_from_birth(birth_date date)
RETURNS integer AS $$
BEGIN
  IF birth_date IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Use a fixed reference date to make it immutable for generated columns
  -- This will be updated via triggers when needed
  RETURN EXTRACT(YEAR FROM AGE('2024-01-01'::date, birth_date)) * 12 + 
         EXTRACT(MONTH FROM AGE('2024-01-01'::date, birth_date));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate current age (for queries)
CREATE OR REPLACE FUNCTION calculate_current_age_months(birth_date date)
RETURNS integer AS $$
BEGIN
  IF birth_date IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN EXTRACT(YEAR FROM AGE(CURRENT_DATE, birth_date)) * 12 + 
         EXTRACT(MONTH FROM AGE(CURRENT_DATE, birth_date));
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================================================
-- ENUMS AND CUSTOM TYPES
-- =============================================================================

-- User and permission types
CREATE TYPE user_role AS ENUM ('administrator', 'farm', 'customer');
CREATE TYPE activity_type AS ENUM ('login', 'create', 'update', 'delete', 'view', 'export', 'import');

-- Animal related types
CREATE TYPE animal_type AS ENUM ('rabbit', 'guinea-pig', 'dog', 'cat', 'fowl');
CREATE TYPE animal_gender AS ENUM ('male', 'female');
CREATE TYPE animal_status AS ENUM ('available', 'breeding', 'sold', 'reserved', 'retired', 'deceased');
CREATE TYPE animal_size AS ENUM ('small', 'medium', 'large', 'extra-large');

-- Fowl specific types
CREATE TYPE fowl_purpose AS ENUM ('eggs', 'meat', 'dual-purpose', 'ornamental', 'breeding');

-- Health and breeding types
CREATE TYPE health_record_type AS ENUM ('vaccination', 'checkup', 'treatment', 'surgery', 'injury', 'illness', 'deworming', 'dental');
CREATE TYPE breeding_status AS ENUM ('planned', 'bred', 'confirmed_pregnant', 'born', 'weaned', 'completed', 'failed');
CREATE TYPE offspring_status AS ENUM ('alive', 'deceased', 'adopted', 'sold', 'retained');

-- Inventory and business types
CREATE TYPE inventory_category AS ENUM ('feed', 'medical', 'equipment', 'bedding', 'supplement', 'toy', 'grooming', 'cleaning');
CREATE TYPE inventory_transaction_type AS ENUM ('purchase', 'usage', 'adjustment', 'waste', 'transfer', 'return');
CREATE TYPE biproduct_type AS ENUM ('manure', 'urine', 'bedding', 'compost', 'other');
CREATE TYPE availability_status AS ENUM ('in-stock', 'seasonal', 'pre-order', 'discontinued');

-- Content management types
CREATE TYPE page_type AS ENUM ('home', 'about', 'contact', 'products', 'education', 'news', 'services');
CREATE TYPE content_type AS ENUM ('news', 'guide', 'faq', 'page', 'blog');
CREATE TYPE guide_difficulty AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- Financial types
CREATE TYPE transaction_type AS ENUM ('sale', 'purchase', 'expense', 'income', 'refund', 'fee');
CREATE TYPE payment_method AS ENUM ('cash', 'check', 'credit_card', 'bank_transfer', 'paypal', 'other');

-- =============================================================================
-- USER MANAGEMENT
-- =============================================================================

-- Main users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role user_role NOT NULL DEFAULT 'customer',
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- User profiles with extended information
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  phone text,
  address text,
  city text,
  state text,
  zip_code text,
  country text DEFAULT 'US',
  date_of_birth date,
  emergency_contact_name text,
  emergency_contact_phone text,
  preferences jsonb DEFAULT '{}',
  notification_settings jsonb DEFAULT '{
    "email_notifications": true,
    "sms_notifications": false,
    "newsletter": true,
    "breeding_updates": true,
    "health_reminders": true
  }'::jsonb,
  notes text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Activity logging for audit trails
CREATE TABLE IF NOT EXISTS user_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  entity_type text,
  entity_id uuid,
  description text,
  metadata jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- LOCATION AND FACILITY MANAGEMENT
-- =============================================================================

-- Farm locations and facilities
CREATE TABLE IF NOT EXISTS facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  facility_type text NOT NULL, -- 'barn', 'coop', 'kennel', 'pasture', 'storage'
  description text,
  capacity integer CHECK (capacity > 0),
  current_occupancy integer DEFAULT 0 CHECK (current_occupancy >= 0),
  location text,
  dimensions text,
  climate_controlled boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT capacity_check CHECK (current_occupancy <= capacity)
);

-- =============================================================================
-- ANIMAL BREED AND GENETICS
-- =============================================================================

-- Normalized breeds table
CREATE TABLE IF NOT EXISTS breeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type animal_type NOT NULL,
  description text NOT NULL,
  origin_country text,
  characteristics jsonb DEFAULT '[]',
  average_weight_min decimal(6,2),
  average_weight_max decimal(6,2),
  average_lifespan_years integer,
  primary_uses text[] DEFAULT '{}',
  care_level text, -- 'easy', 'moderate', 'difficult'
  climate_preferences text[] DEFAULT '{}',
  image_url text,
  price_range_min decimal(8,2),
  price_range_max decimal(8,2),
  is_rare_breed boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_weight_range CHECK (average_weight_max >= average_weight_min),
  CONSTRAINT valid_price_range CHECK (price_range_max >= price_range_min),
  CONSTRAINT unique_breed_per_type UNIQUE (name, type)
);

-- Genetic lines for tracking bloodlines
CREATE TABLE IF NOT EXISTS genetic_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  breed_id uuid NOT NULL REFERENCES breeds(id) ON DELETE CASCADE,
  description text,
  founder_animals text[] DEFAULT '{}',
  characteristics text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- ANIMAL MANAGEMENT
-- =============================================================================

-- Main animals table
CREATE TABLE IF NOT EXISTS animals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  breed_id uuid NOT NULL REFERENCES breeds(id) ON DELETE RESTRICT,
  genetic_line_id uuid REFERENCES genetic_lines(id),
  facility_id uuid REFERENCES facilities(id),
  
  -- Basic information
  registration_number text UNIQUE,
  microchip_number text UNIQUE,
  date_of_birth date,
  -- Removed generated column - age will be calculated in views/queries
  weight_lbs decimal(6,2) NOT NULL CHECK (weight_lbs > 0),
  gender animal_gender NOT NULL,
  color text NOT NULL,
  markings text,
  
  -- Status and pricing
  status animal_status DEFAULT 'available',
  price decimal(8,2) CHECK (price >= 0),
  is_for_sale boolean DEFAULT true,
  description text NOT NULL,
  
  -- Physical characteristics
  coat_type text,
  coat_length text,
  size animal_size,
  temperament text[] DEFAULT '{}',
  
  -- Breeding specific
  is_breeding_quality boolean DEFAULT false,
  breeding_restrictions text,
  
  -- Fowl specific
  egg_production_annual integer CHECK (egg_production_annual >= 0),
  purpose fowl_purpose,
  
  -- Acquisition and tracking
  acquisition_date date DEFAULT CURRENT_DATE,
  acquisition_source text,
  acquisition_cost decimal(8,2) CHECK (acquisition_cost >= 0),
  
  -- Media
  image_url text NOT NULL,
  additional_images text[] DEFAULT '{}',
  
  -- Parents (for tracking lineage)
  sire_id uuid REFERENCES animals(id),
  dam_id uuid REFERENCES animals(id),
  
  -- Metadata
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  CONSTRAINT different_parents CHECK (sire_id != dam_id),
  CONSTRAINT no_self_parent CHECK (id != sire_id AND id != dam_id)
);

-- Animal measurements tracking over time
CREATE TABLE IF NOT EXISTS animal_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  measurement_date date NOT NULL DEFAULT CURRENT_DATE,
  weight_lbs decimal(6,2) CHECK (weight_lbs > 0),
  length_inches decimal(5,2),
  height_inches decimal(5,2),
  body_condition_score integer CHECK (body_condition_score BETWEEN 1 AND 9),
  notes text,
  measured_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- HEALTH MANAGEMENT
-- =============================================================================

-- Veterinary professionals
CREATE TABLE IF NOT EXISTS veterinarians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  license_number text UNIQUE,
  phone text,
  email text,
  clinic_name text,
  address text,
  specialties text[] DEFAULT '{}',
  emergency_contact boolean DEFAULT false,
  preferred_contact_method text,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Health records
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  veterinarian_id uuid REFERENCES veterinarians(id),
  record_type health_record_type NOT NULL,
  record_date date NOT NULL DEFAULT CURRENT_DATE,
  title text NOT NULL,
  description text,
  diagnosis text,
  treatment_details jsonb DEFAULT '{}',
  medications_prescribed text[] DEFAULT '{}',
  cost decimal(8,2) CHECK (cost >= 0),
  follow_up_required boolean DEFAULT false,
  follow_up_date date,
  next_due_date date,
  attachments text[] DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Vaccination tracking
CREATE TABLE IF NOT EXISTS vaccinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  vaccine_name text NOT NULL,
  manufacturer text,
  batch_number text,
  administered_date date NOT NULL,
  administered_by uuid REFERENCES veterinarians(id),
  administration_route text, -- 'injection', 'oral', 'nasal'
  dose_amount text,
  next_due_date date,
  notes text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Health schedules and reminders
CREATE TABLE IF NOT EXISTS health_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
  breed_id uuid REFERENCES breeds(id) ON DELETE CASCADE,
  schedule_type health_record_type NOT NULL,
  name text NOT NULL,
  description text,
  frequency_days integer NOT NULL CHECK (frequency_days > 0),
  age_start_months integer DEFAULT 0,
  age_end_months integer,
  is_mandatory boolean DEFAULT false,
  reminder_days_advance integer DEFAULT 7,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  
  -- Either animal-specific or breed-specific, not both
  CONSTRAINT schedule_target CHECK (
    (animal_id IS NOT NULL AND breed_id IS NULL) OR 
    (animal_id IS NULL AND breed_id IS NOT NULL)
  )
);

-- =============================================================================
-- BREEDING MANAGEMENT
-- =============================================================================

-- Breeding programs
CREATE TABLE IF NOT EXISTS breeding_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  animal_type animal_type NOT NULL,
  breed_id uuid REFERENCES breeds(id),
  description text,
  goals text[] DEFAULT '{}',
  target_traits text[] DEFAULT '{}',
  start_date date NOT NULL,
  end_date date,
  program_manager_id uuid REFERENCES users(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Breeding records
CREATE TABLE IF NOT EXISTS breeding_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES breeding_programs(id),
  sire_id uuid NOT NULL REFERENCES animals(id),
  dam_id uuid NOT NULL REFERENCES animals(id),
  breeding_date date NOT NULL,
  breeding_method text DEFAULT 'natural', -- 'natural', 'artificial_insemination'
  expected_birth_date date NOT NULL,
  actual_birth_date date,
  gestation_days integer,
  litter_size integer CHECK (litter_size >= 0),
  surviving_offspring integer CHECK (surviving_offspring >= 0),
  birth_weight_total decimal(6,2) CHECK (birth_weight_total >= 0),
  complications text,
  status breeding_status DEFAULT 'planned',
  notes text,
  breeding_fee decimal(8,2) CHECK (breeding_fee >= 0),
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  CONSTRAINT different_parents CHECK (sire_id != dam_id),
  CONSTRAINT surviving_not_greater_than_total CHECK (surviving_offspring <= litter_size),
  CONSTRAINT logical_birth_date CHECK (actual_birth_date >= breeding_date)
);

-- Individual offspring tracking
CREATE TABLE IF NOT EXISTS offspring (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  breeding_record_id uuid NOT NULL REFERENCES breeding_records(id) ON DELETE CASCADE,
  animal_id uuid REFERENCES animals(id), -- NULL until registered as individual animal
  birth_order integer CHECK (birth_order > 0),
  weight_at_birth decimal(5,2) CHECK (weight_at_birth >= 0),
  gender animal_gender,
  color text,
  markings text,
  status offspring_status DEFAULT 'alive',
  weaning_date date,
  sale_date date,
  sale_price decimal(8,2) CHECK (sale_price >= 0),
  buyer_info text,
  notes text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- INVENTORY MANAGEMENT
-- =============================================================================

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  contact_person text,
  phone text,
  email text,
  address text,
  city text,
  state text,
  zip_code text,
  website text,
  tax_id text,
  payment_terms text,
  credit_limit decimal(10,2),
  preferred_payment_method payment_method,
  delivery_schedule text,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Inventory items
CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text UNIQUE,
  category inventory_category NOT NULL,
  subcategory text,
  animal_types text[] DEFAULT '{}',
  unit text NOT NULL,
  unit_size text, -- e.g., "50 lb bag", "1 gallon"
  current_quantity decimal(10,2) DEFAULT 0 CHECK (current_quantity >= 0),
  reserved_quantity decimal(10,2) DEFAULT 0 CHECK (reserved_quantity >= 0),
  available_quantity decimal(10,2) GENERATED ALWAYS AS (current_quantity - reserved_quantity) STORED,
  low_stock_threshold decimal(10,2) DEFAULT 0 CHECK (low_stock_threshold >= 0),
  reorder_point decimal(10,2) DEFAULT 0,
  max_stock_level decimal(10,2),
  cost_per_unit decimal(8,2) DEFAULT 0 CHECK (cost_per_unit >= 0),
  sale_price_per_unit decimal(8,2) CHECK (sale_price_per_unit >= 0),
  supplier_id uuid REFERENCES suppliers(id),
  storage_location text,
  storage_requirements text,
  expiration_tracking boolean DEFAULT false,
  shelf_life_days integer,
  image_url text,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Inventory batches for expiration tracking
CREATE TABLE IF NOT EXISTS inventory_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id uuid NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  batch_number text NOT NULL,
  quantity decimal(10,2) NOT NULL CHECK (quantity > 0),
  remaining_quantity decimal(10,2) NOT NULL CHECK (remaining_quantity >= 0),
  unit_cost decimal(8,2) NOT NULL CHECK (unit_cost >= 0),
  received_date date NOT NULL,
  expiration_date date,
  supplier_id uuid REFERENCES suppliers(id),
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT batch_quantity_check CHECK (remaining_quantity <= quantity),
  CONSTRAINT unique_batch_per_item UNIQUE (inventory_item_id, batch_number)
);

-- Inventory transactions
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id uuid NOT NULL REFERENCES inventory_items(id),
  batch_id uuid REFERENCES inventory_batches(id),
  transaction_type inventory_transaction_type NOT NULL,
  quantity decimal(10,2) NOT NULL,
  unit_cost decimal(8,2),
  total_cost decimal(10,2),
  reference_type text, -- 'purchase_order', 'usage_record', 'adjustment'
  reference_id uuid,
  animal_id uuid REFERENCES animals(id), -- for usage tracking
  reason text,
  notes text,
  transaction_date timestamptz DEFAULT CURRENT_TIMESTAMP,
  created_by uuid REFERENCES users(id),
  
  CONSTRAINT positive_quantity_for_additions CHECK (
    CASE WHEN transaction_type IN ('purchase', 'adjustment') 
    THEN quantity > 0 
    ELSE true END
  )
);

-- =============================================================================
-- BI-PRODUCTS AND FINANCIAL MANAGEMENT
-- =============================================================================

-- Bi-products
CREATE TABLE IF NOT EXISTS bi_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  type biproduct_type NOT NULL,
  source_animals text[] DEFAULT '{}', -- types of animals this comes from
  processing_method text,
  image_url text NOT NULL,
  price decimal(8,2) NOT NULL CHECK (price >= 0),
  unit text NOT NULL,
  unit_description text, -- "per 25lb bag", "per cubic yard"
  benefits text[] DEFAULT '{}',
  usage_instructions text,
  storage_requirements text,
  availability availability_status DEFAULT 'in-stock',
  seasonal_months integer[] DEFAULT '{}', -- months when available if seasonal
  production_capacity_per_month decimal(10,2),
  current_stock decimal(10,2) DEFAULT 0,
  is_organic_certified boolean DEFAULT false,
  certifications text[] DEFAULT '{}',
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id), -- NULL for walk-in customers
  customer_type text DEFAULT 'individual', -- 'individual', 'business', 'farm'
  first_name text,
  last_name text,
  business_name text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  zip_code text,
  tax_exempt boolean DEFAULT false,
  tax_id text,
  credit_limit decimal(10,2) DEFAULT 0,
  payment_terms text DEFAULT 'immediate',
  preferred_contact_method text DEFAULT 'email',
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Financial transactions
CREATE TABLE IF NOT EXISTS financial_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type transaction_type NOT NULL,
  amount decimal(10,2) NOT NULL CHECK (amount != 0),
  payment_method payment_method,
  reference_number text,
  description text NOT NULL,
  category text,
  animal_id uuid REFERENCES animals(id),
  customer_id uuid REFERENCES customers(id),
  supplier_id uuid REFERENCES suppliers(id),
  invoice_number text,
  receipt_number text,
  tax_amount decimal(10,2) DEFAULT 0,
  transaction_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  paid_date date,
  status text DEFAULT 'completed', -- 'pending', 'completed', 'cancelled', 'refunded'
  notes text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- CONTENT MANAGEMENT AND SYSTEM TABLES
-- =============================================================================

-- Media assets
CREATE TABLE IF NOT EXISTS media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_url text NOT NULL,
  optimized_url text,
  thumbnail_url text,
  alt_text text,
  caption text,
  file_size_bytes bigint,
  mime_type text,
  width_px integer,
  height_px integer,
  tags text[] DEFAULT '{}',
  is_public boolean DEFAULT true,
  upload_date timestamptz DEFAULT CURRENT_TIMESTAMP,
  uploaded_by uuid REFERENCES users(id)
);

-- Page content (for static pages)
CREATE TABLE IF NOT EXISTS page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type page_type NOT NULL UNIQUE,
  content_data jsonb NOT NULL DEFAULT '{}',
  meta_title text,
  meta_description text,
  featured_image_id uuid REFERENCES media_assets(id),
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_by uuid REFERENCES users(id)
);

-- Dynamic content (news, guides, etc.)
CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type content_type NOT NULL,
  title text NOT NULL,
  slug text NOT NULL,
  excerpt text,
  content text NOT NULL,
  featured_image_id uuid REFERENCES media_assets(id),
  author_id uuid REFERENCES users(id),
  category text,
  tags text[] DEFAULT '{}',
  difficulty guide_difficulty, -- for guides
  read_time text, -- for guides
  rating decimal(2,1) CHECK (rating >= 0 AND rating <= 5), -- for guides
  metadata jsonb DEFAULT '{}',
  view_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  published_date timestamptz,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_slug_per_type UNIQUE (content_type, slug)
);

-- FAQs
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  order_index integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id), -- Link to user account if they have one
  name text NOT NULL,
  role text NOT NULL,
  bio text NOT NULL,
  image_url text NOT NULL,
  specialties text[] DEFAULT '{}',
  email text,
  phone text,
  social_links jsonb DEFAULT '{}',
  order_index integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  hire_date date,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Farm settings
CREATE TABLE IF NOT EXISTS farm_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_group text NOT NULL,
  setting_key text NOT NULL,
  setting_value text,
  data_type text DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
  description text,
  is_public boolean DEFAULT false, -- whether setting can be read by non-admin users
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_setting UNIQUE (setting_group, setting_key)
);

-- System notifications
CREATE TABLE IF NOT EXISTS system_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid REFERENCES users(id),
  notification_type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  read_at timestamptz,
  priority text DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  expires_at timestamptz,
  action_url text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Create indexes conditionally
DO $$
BEGIN
  -- User and authentication indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_role') THEN
    CREATE INDEX idx_users_role ON users(role) WHERE is_active = true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email') THEN
    CREATE INDEX idx_users_email ON users(email) WHERE is_active = true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_activities_user_date') THEN
    CREATE INDEX idx_user_activities_user_date ON user_activities(user_id, created_at DESC);
  END IF;

  -- Animal management indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_animals_breed_status') THEN
    CREATE INDEX idx_animals_breed_status ON animals(breed_id, status) WHERE is_active = true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_animals_status_available') THEN
    CREATE INDEX idx_animals_status_available ON animals(status) WHERE status = 'available' AND is_active = true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_animals_facility') THEN
    CREATE INDEX idx_animals_facility ON animals(facility_id) WHERE is_active = true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_animals_breeding_quality') THEN
    CREATE INDEX idx_animals_breeding_quality ON animals(is_breeding_quality) WHERE is_breeding_quality = true AND is_active = true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_animals_parents') THEN
    CREATE INDEX idx_animals_parents ON animals(sire_id, dam_id) WHERE sire_id IS NOT NULL OR dam_id IS NOT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_animals_birth_date') THEN
    CREATE INDEX idx_animals_birth_date ON animals(date_of_birth) WHERE date_of_birth IS NOT NULL;
  END IF;

  -- Health management indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_health_records_animal_date') THEN
    CREATE INDEX idx_health_records_animal_date ON health_records(animal_id, record_date DESC);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_health_records_type') THEN
    CREATE INDEX idx_health_records_type ON health_records(record_type, record_date DESC);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_vaccinations_animal_due') THEN
    CREATE INDEX idx_vaccinations_animal_due ON vaccinations(animal_id, next_due_date) WHERE next_due_date IS NOT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_vaccinations_due_dates') THEN
    CREATE INDEX idx_vaccinations_due_dates ON vaccinations(next_due_date);
  END IF;

  -- Breeding management indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_breeding_records_sire') THEN
    CREATE INDEX idx_breeding_records_sire ON breeding_records(sire_id, breeding_date DESC);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_breeding_records_dam') THEN
    CREATE INDEX idx_breeding_records_dam ON breeding_records(dam_id, breeding_date DESC);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_breeding_records_program') THEN
    CREATE INDEX idx_breeding_records_program ON breeding_records(program_id, breeding_date DESC);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_breeding_records_status') THEN
    CREATE INDEX idx_breeding_records_status ON breeding_records(status, expected_birth_date);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_offspring_breeding_record') THEN
    CREATE INDEX idx_offspring_breeding_record ON offspring(breeding_record_id);
  END IF;

  -- Inventory management indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_inventory_items_category') THEN
    CREATE INDEX idx_inventory_items_category ON inventory_items(category) WHERE is_active = true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_inventory_items_low_stock') THEN
    CREATE INDEX idx_inventory_items_low_stock ON inventory_items(current_quantity) WHERE current_quantity <= low_stock_threshold AND is_active = true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_inventory_transactions_item_date') THEN
    CREATE INDEX idx_inventory_transactions_item_date ON inventory_transactions(inventory_item_id, transaction_date DESC);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_inventory_batches_expiration') THEN
    CREATE INDEX idx_inventory_batches_expiration ON inventory_batches(expiration_date) WHERE expiration_date IS NOT NULL AND is_active = true;
  END IF;

  -- Financial indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_financial_transactions_date') THEN
    CREATE INDEX idx_financial_transactions_date ON financial_transactions(transaction_date DESC);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_financial_transactions_type') THEN
    CREATE INDEX idx_financial_transactions_type ON financial_transactions(transaction_type, transaction_date DESC);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_financial_transactions_customer') THEN
    CREATE INDEX idx_financial_transactions_customer ON financial_transactions(customer_id, transaction_date DESC);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_financial_transactions_animal') THEN
    CREATE INDEX idx_financial_transactions_animal ON financial_transactions(animal_id, transaction_date DESC);
  END IF;

  -- Content management indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_content_items_type_published') THEN
    CREATE INDEX idx_content_items_type_published ON content_items(content_type, is_published, published_date DESC);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_content_items_featured') THEN
    CREATE INDEX idx_content_items_featured ON content_items(is_featured, published_date DESC) WHERE is_featured = true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_content_items_category') THEN
    CREATE INDEX idx_content_items_category ON content_items(category, published_date DESC) WHERE is_published = true;
  END IF;

  -- Full-text search indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_animals_search') THEN
    CREATE INDEX idx_animals_search ON animals USING GIN(to_tsvector('english', name || ' ' || description || ' ' || color));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_content_search') THEN
    CREATE INDEX idx_content_search ON content_items USING GIN(to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || content));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_breeds_search') THEN
    CREATE INDEX idx_breeds_search ON breeds USING GIN(to_tsvector('english', name || ' ' || description));
  END IF;
END$$;

-- =============================================================================
-- ROW LEVEL SECURITY SETUP
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE breeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE genetic_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE animal_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE veterinarians ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE breeding_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE breeding_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE offspring ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bi_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_notifications ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Drop existing policies if they exist (safely)
DO $$
DECLARE
    pol_record RECORD;
BEGIN
    FOR pol_record IN 
        SELECT schemaname, tablename, policyname
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      pol_record.policyname, 
                      pol_record.schemaname, 
                      pol_record.tablename);
    END LOOP;
END$$;

-- User management policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Administrators can manage all users" ON users
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'administrator'
    )
  );

CREATE POLICY "Users can manage own profile" ON user_profiles
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Administrators can read all profiles" ON user_profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'administrator'
    )
  );

-- Animal and breeding policies
CREATE POLICY "Anyone can read active animals" ON animals
  FOR SELECT TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Farm users can manage animals" ON animals
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

CREATE POLICY "Anyone can read breeds" ON breeds
  FOR SELECT TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Farm users can manage breeds" ON breeds
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

-- Content management policies
CREATE POLICY "Anyone can read published content" ON content_items
  FOR SELECT TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Farm users can manage content items" ON content_items
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

CREATE POLICY "Anyone can read published FAQs" ON faqs
  FOR SELECT TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Farm users can manage FAQs" ON faqs
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

-- Additional essential policies for core functionality
CREATE POLICY "Farm users can manage facilities" ON facilities
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

CREATE POLICY "Anyone can read active facilities" ON facilities
  FOR SELECT TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Farm users can manage health records" ON health_records
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

CREATE POLICY "Farm users can manage breeding records" ON breeding_records
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

CREATE POLICY "Farm users can manage inventory" ON inventory_items
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

CREATE POLICY "Farm users can manage financial transactions" ON financial_transactions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

CREATE POLICY "Users can read own notifications" ON system_notifications
  FOR SELECT TO authenticated
  USING (recipient_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON system_notifications
  FOR UPDATE TO authenticated
  USING (recipient_id = auth.uid());

-- Additional RLS policies for remaining tables
CREATE POLICY "Anyone can read published page content" ON page_content
  FOR SELECT TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Administrators can manage page content" ON page_content
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'administrator'
    )
  );

CREATE POLICY "Anyone can read active team members" ON team_members
  FOR SELECT TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Administrators can manage team members" ON team_members
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'administrator'
    )
  );

CREATE POLICY "Anyone can read public farm settings" ON farm_settings
  FOR SELECT TO authenticated, anon
  USING (is_public = true);

CREATE POLICY "Administrators can manage farm settings" ON farm_settings
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'administrator'
    )
  );

CREATE POLICY "Anyone can read bi-products" ON bi_products
  FOR SELECT TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Farm users can manage bi-products" ON bi_products
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('farm', 'administrator')
    )
  );

-- =============================================================================
-- UTILITY FUNCTIONS
-- =============================================================================

-- Function to check inventory stock levels
CREATE OR REPLACE FUNCTION check_low_stock_items()
RETURNS TABLE(
  item_id uuid,
  item_name text,
  current_quantity decimal,
  threshold decimal,
  shortage decimal
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ii.id,
    ii.name,
    ii.current_quantity,
    ii.low_stock_threshold,
    (ii.low_stock_threshold - ii.current_quantity) AS shortage
  FROM inventory_items ii
  WHERE ii.current_quantity <= ii.low_stock_threshold
    AND ii.is_active = true
  ORDER BY (ii.low_stock_threshold - ii.current_quantity) DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get upcoming health reminders
CREATE OR REPLACE FUNCTION get_health_reminders(days_ahead integer DEFAULT 30)
RETURNS TABLE(
  animal_id uuid,
  animal_name text,
  reminder_type text,
  due_date date,
  days_until_due integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.name,
    'Vaccination' as reminder_type,
    v.next_due_date,
    (v.next_due_date - CURRENT_DATE) as days_until_due
  FROM animals a
  JOIN vaccinations v ON a.id = v.animal_id
  WHERE v.next_due_date IS NOT NULL
    AND v.next_due_date <= CURRENT_DATE + INTERVAL '1 day' * days_ahead
    AND a.is_active = true
  
  UNION ALL
  
  SELECT 
    a.id,
    a.name,
    hr.title as reminder_type,
    hr.next_due_date,
    (hr.next_due_date - CURRENT_DATE) as days_until_due
  FROM animals a
  JOIN health_records hr ON a.id = hr.animal_id
  WHERE hr.next_due_date IS NOT NULL
    AND hr.next_due_date <= CURRENT_DATE + INTERVAL '1 day' * days_ahead
    AND a.is_active = true
  
  ORDER BY due_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get breeding calendar
CREATE OR REPLACE FUNCTION get_breeding_calendar(months_ahead integer DEFAULT 6)
RETURNS TABLE(
  breeding_id uuid,
  sire_name text,
  dam_name text,
  breeding_date date,
  expected_birth date,
  status breeding_status,
  days_until_birth integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    br.id,
    s.name as sire_name,
    d.name as dam_name,
    br.breeding_date,
    br.expected_birth_date,
    br.status,
    (br.expected_birth_date - CURRENT_DATE) as days_until_birth
  FROM breeding_records br
  JOIN animals s ON br.sire_id = s.id
  JOIN animals d ON br.dam_id = d.id
  WHERE br.expected_birth_date <= CURRENT_DATE + INTERVAL '1 month' * months_ahead
    AND br.status IN ('bred', 'confirmed_pregnant')
  ORDER BY br.expected_birth_date ASC;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

-- View for available animals with breed information (includes calculated age)
CREATE OR REPLACE VIEW available_animals_view AS
SELECT 
  a.id,
  a.name,
  a.registration_number,
  a.date_of_birth,
  calculate_current_age_months(a.date_of_birth) as age_months,
  a.weight_lbs,
  a.gender,
  a.color,
  a.price,
  a.description,
  a.image_url,
  a.temperament,
  b.name as breed_name,
  b.type as animal_type,
  b.characteristics as breed_characteristics,
  f.name as facility_name
FROM animals a
JOIN breeds b ON a.breed_id = b.id
LEFT JOIN facilities f ON a.facility_id = f.id
WHERE a.status = 'available' AND a.is_active = true;

-- View for animal health summary
CREATE OR REPLACE VIEW animal_health_summary AS
SELECT 
  a.id as animal_id,
  a.name,
  calculate_current_age_months(a.date_of_birth) as current_age_months,
  COUNT(hr.id) as total_health_records,
  COUNT(CASE WHEN hr.record_type = 'vaccination' THEN 1 END) as vaccination_count,
  COUNT(CASE WHEN hr.record_type = 'checkup' THEN 1 END) as checkup_count,
  COUNT(CASE WHEN hr.record_type = 'treatment' THEN 1 END) as treatment_count,
  MAX(hr.record_date) as last_health_record_date,
  COUNT(v.id) as vaccination_records,
  MAX(v.administered_date) as last_vaccination_date
FROM animals a
LEFT JOIN health_records hr ON a.id = hr.animal_id
LEFT JOIN vaccinations v ON a.id = v.animal_id
WHERE a.is_active = true
GROUP BY a.id, a.name, a.date_of_birth;

-- View for breeding performance
CREATE OR REPLACE VIEW breeding_performance_view AS
SELECT 
  a.id as animal_id,
  a.name,
  a.gender,
  calculate_current_age_months(a.date_of_birth) as current_age_months,
  COUNT(CASE WHEN a.gender = 'male' THEN br_sire.id END) as times_as_sire,
  COUNT(CASE WHEN a.gender = 'female' THEN br_dam.id END) as times_as_dam,
  AVG(CASE WHEN a.gender = 'female' THEN br_dam.litter_size END) as avg_litter_size,
  COUNT(o.id) as total_offspring,
  COUNT(CASE WHEN o.status = 'alive' THEN 1 END) as living_offspring
FROM animals a
LEFT JOIN breeding_records br_sire ON a.id = br_sire.sire_id
LEFT JOIN breeding_records br_dam ON a.id = br_dam.dam_id
LEFT JOIN offspring o ON (br_sire.id = o.breeding_record_id OR br_dam.id = o.breeding_record_id)
WHERE a.is_active = true
GROUP BY a.id, a.name, a.gender, a.date_of_birth;

-- View for inventory status
CREATE OR REPLACE VIEW inventory_status_view AS
SELECT 
  ii.id,
  ii.name,
  ii.sku,
  ii.category,
  ii.current_quantity,
  ii.low_stock_threshold,
  ii.available_quantity,
  CASE 
    WHEN ii.current_quantity <= ii.low_stock_threshold THEN 'Low Stock'
    WHEN ii.current_quantity <= ii.reorder_point THEN 'Reorder Soon'
    ELSE 'In Stock'
  END as stock_status,
  ii.cost_per_unit,
  (ii.current_quantity * ii.cost_per_unit) as total_value,
  s.name as supplier_name
FROM inventory_items ii
LEFT JOIN suppliers s ON ii.supplier_id = s.id
WHERE ii.is_active = true;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Updated timestamp triggers
DO $$
DECLARE
    table_list text[] := ARRAY[
        'users', 'user_profiles', 'facilities', 'breeds', 'animals',
        'veterinarians', 'health_records', 'breeding_programs', 
        'breeding_records', 'offspring', 'suppliers', 'inventory_items',
        'bi_products', 'customers', 'page_content', 'content_items',
        'faqs', 'team_members', 'farm_settings'
    ];
    table_name text;
    trigger_name text;
BEGIN
    FOREACH table_name IN ARRAY table_list
    LOOP
        trigger_name := 'update_' || table_name || '_updated_at';
        
        -- Drop trigger if exists
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', trigger_name, table_name);
        
        -- Create trigger
        EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE ON %I 
                       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', 
                       trigger_name, table_name);
    END LOOP;
END$$;

-- User creation trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- SAMPLE DATA INSERTION
-- =============================================================================

-- Insert default farm settings
INSERT INTO farm_settings (setting_group, setting_key, setting_value, data_type, description, is_public) VALUES
('general', 'farm_name', 'iFarm', 'string', 'Name of the farm', true),
('general', 'farm_tagline', 'Premium Livestock Breeding', 'string', 'Farm tagline', true),
('general', 'timezone', 'America/New_York', 'string', 'Farm timezone', false),
('general', 'currency', 'USD', 'string', 'Default currency', false),
('general', 'weight_unit', 'lbs', 'string', 'Default weight unit', false),
('contact', 'phone', '(555) 123-4567', 'string', 'Farm phone number', true),
('contact', 'email', 'info@ifarm.com', 'string', 'Farm email address', true),
('contact', 'address', '123 Farm Road, Rural Valley, ST 12345', 'string', 'Farm address', true),
('inventory', 'low_stock_threshold', '10', 'number', 'Default low stock threshold', false),
('notifications', 'email_enabled', 'true', 'boolean', 'Enable email notifications', false),
('notifications', 'reminder_days', '7', 'number', 'Days in advance for reminders', false)
ON CONFLICT (setting_group, setting_key) DO NOTHING;

-- Insert sample page content
INSERT INTO page_content (page_type, content_data, meta_title, meta_description) VALUES
('home', '{
  "hero_title": "Premium Livestock",
  "hero_subtitle": "Breeding Farm",
  "hero_description": "Dedicated to sustainable farming practices and breeding excellence across rabbits, guinea pigs, dogs, cats, and fowls. Serving the community with quality livestock and educational resources since 2015.",
  "hero_image_url": "https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg?auto=compress&cs=tinysrgb&w=800",
  "hero_badge_text": "15+ Years Experience",
  "hero_features": [
    {"title": "Quality Breeding", "icon": "Award"},
    {"title": "Sustainable Practices", "icon": "Leaf"},
    {"title": "Expert Care", "icon": "Heart"}
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
    {"label": "Animals Bred", "value": "1000+", "icon": "Heart"}
  ]
}'::jsonb, 'iFarm - Premium Livestock Breeding', 'Premium livestock breeding farm specializing in rabbits, guinea pigs, dogs, cats, and fowls with sustainable practices and quality animals.'),

('about', '{
  "hero_intro_text": "Welcome to iFarm, where passion for animals meets expertise in breeding. For over 15 years, we have been dedicated to raising healthy, well-socialized animals across multiple species.",
  "mission_statement": "Our mission is to provide exceptional animals while promoting sustainable farming practices, education, and responsible animal ownership. We believe in the importance of genetic diversity, proper care, and building lasting relationships with our community.",
  "history_intro_text": "Our journey began in 2008 with a simple goal: to breed healthy, happy animals while educating others about proper care and sustainable practices.",
  "certifications_intro_text": "We are proud to hold various certifications and awards that recognize our commitment to excellence in animal breeding and care.",
  "gallery_intro_text": "Take a visual tour of our facilities, animals, and daily operations at iFarm.",
  "values_list": [
    {"title": "Quality First", "description": "Every animal receives the highest standard of care", "icon": "Award"},
    {"title": "Sustainability", "description": "Environmentally conscious farming practices", "icon": "Leaf"},
    {"title": "Education", "description": "Sharing knowledge with our community", "icon": "Users"},
    {"title": "Compassion", "description": "Treating every animal with love and respect", "icon": "Heart"}
  ],
  "history_milestones": [
    {"year": "2008", "title": "Farm established with first rabbit breeding program", "icon": "Calendar"},
    {"year": "2012", "title": "Expanded to include guinea pig breeding", "icon": "Award"},
    {"year": "2016", "title": "Added sustainable bi-product program", "icon": "Leaf"},
    {"year": "2020", "title": "Launched educational workshop series", "icon": "Users"}
  ],
  "certifications_awards": [
    {"title": "Organic Certified", "description": "USDA Organic certification for our practices", "color": "green"},
    {"title": "Animal Welfare Approved", "description": "High welfare standards certification", "color": "blue"},
    {"title": "Sustainable Farm Award", "description": "State recognition for sustainable practices", "color": "yellow"},
    {"title": "Breeding Excellence", "description": "National breeding association award", "color": "purple"}
  ],
  "gallery_images": [
    "https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4588003/pexels-photo-4588003.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4588001/pexels-photo-4588001.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4588004/pexels-photo-4588004.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4588006/pexels-photo-4588006.jpeg?auto=compress&cs=tinysrgb&w=800"
  ]
}'::jsonb, 'About iFarm - Our Story and Mission', 'Learn about iFarm''s history, mission, and commitment to sustainable livestock breeding across multiple species.'),

('contact', '{
  "hero_title": "Get In Touch",
  "hero_description": "We would love to hear from you! Whether you have questions about our animals, want to schedule a visit, or need expert advice, our team is here to help.",
  "contact_description": "Our knowledgeable team is available to answer questions about animal care, breeding programs, and farm visits. We pride ourselves on building lasting relationships with our customers and providing ongoing support.",
  "address": "123 Farm Road, Rural Valley, ST 12345",
  "phone": "(555) 123-4567",
  "email": "info@ifarm.com",
  "business_hours": [
    {"day": "Monday - Friday", "hours": "8:00 AM - 6:00 PM"},
    {"day": "Saturday", "hours": "9:00 AM - 4:00 PM"},
    {"day": "Sunday", "hours": "By appointment only"}
  ],
  "social_links": [
    {"platform": "Facebook", "url": "https://facebook.com/ifarm", "icon": "Facebook"},
    {"platform": "Instagram", "url": "https://instagram.com/ifarm", "icon": "Instagram"},
    {"platform": "Twitter", "url": "https://twitter.com/ifarm", "icon": "Twitter"}
  ],
  "map_description": "Located in the heart of Rural Valley, our farm is easily accessible and welcomes visitors by appointment.",
  "newsletter_title": "Stay Connected",
  "newsletter_description": "Subscribe to our newsletter for updates on available animals, breeding programs, and educational content.",
  "newsletter_privacy_text": "We respect your privacy and will never share your information."
}'::jsonb, 'Contact iFarm - Get In Touch', 'Contact iFarm for questions about our animals, breeding programs, or to schedule a farm visit.')
ON CONFLICT (page_type) DO NOTHING;

-- Insert sample breeds
INSERT INTO breeds (name, type, description, characteristics, average_weight_min, average_weight_max, primary_uses, image_url, price_range_min, price_range_max) VALUES
('Holland Lop', 'rabbit', 'A small, compact rabbit breed known for their distinctive lopped ears and friendly temperament. Holland Lops are excellent pets and show animals.', '["Friendly", "Compact", "Lopped ears", "Good with children"]'::jsonb, 2.0, 4.0, ARRAY['pet', 'show'], 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=800', 50.00, 150.00),
('American Guinea Pig', 'guinea-pig', 'The most common guinea pig breed, known for their smooth coat and gentle nature. They make excellent first pets for children.', '["Gentle", "Easy care", "Smooth coat", "Social"]'::jsonb, 1.5, 2.5, ARRAY['pet', 'companion'], 'https://images.pexels.com/photos/33152/guinea-pig-cavy-pet-guinea.jpg?auto=compress&cs=tinysrgb&w=800', 20.00, 40.00),
('Rhode Island Red', 'fowl', 'A hardy, dual-purpose chicken breed excellent for both egg production and meat. Known for their deep red plumage and reliable laying.', '["Hardy", "Good layers", "Dual purpose", "Cold tolerant"]'::jsonb, 6.0, 8.5, ARRAY['eggs', 'meat'], 'https://images.pexels.com/photos/1300355/pexels-photo-1300355.jpeg?auto=compress&cs=tinysrgb&w=800', 25.00, 50.00),
('Golden Retriever', 'dog', 'A friendly, intelligent, and devoted dog breed. Golden Retrievers are excellent family pets and working dogs.', '["Friendly", "Intelligent", "Loyal", "Good with children"]'::jsonb, 55.0, 75.0, ARRAY['companion', 'working'], 'https://images.pexels.com/photos/552598/pexels-photo-552598.jpeg?auto=compress&cs=tinysrgb&w=800', 800.00, 1500.00),
('Maine Coon', 'cat', 'One of the largest domestic cat breeds, known for their intelligence, playful personality, and distinctive physical appearance.', '["Large", "Intelligent", "Playful", "Distinctive appearance"]'::jsonb, 10.0, 18.0, ARRAY['companion', 'show'], 'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=800', 400.00, 800.00)
ON CONFLICT (name, type) DO NOTHING;

-- Insert sample animals
DO $$
DECLARE
    holland_lop_id uuid;
    guinea_pig_id uuid;
    rhode_island_id uuid;
    golden_retriever_id uuid;
    maine_coon_id uuid;
BEGIN
    -- Get breed IDs
    SELECT id INTO holland_lop_id FROM breeds WHERE name = 'Holland Lop' AND type = 'rabbit';
    SELECT id INTO guinea_pig_id FROM breeds WHERE name = 'American Guinea Pig' AND type = 'guinea-pig';
    SELECT id INTO rhode_island_id FROM breeds WHERE name = 'Rhode Island Red' AND type = 'fowl';
    SELECT id INTO golden_retriever_id FROM breeds WHERE name = 'Golden Retriever' AND type = 'dog';
    SELECT id INTO maine_coon_id FROM breeds WHERE name = 'Maine Coon' AND type = 'cat';

    -- Insert sample animals
    INSERT INTO animals (name, breed_id, date_of_birth, weight_lbs, gender, color, description, image_url, price, status, temperament) VALUES
    ('Buttercup', holland_lop_id, '2023-06-15', 3.2, 'female', 'Brown and White', 'A sweet and gentle Holland Lop doe with excellent conformation. Perfect for showing or as a beloved pet.', 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=800', 75.00, 'available', ARRAY['gentle', 'friendly']),
    ('Cocoa', guinea_pig_id, '2023-08-20', 2.1, 'male', 'Chocolate Brown', 'A friendly American Guinea Pig boar with a beautiful chocolate coat. Great with children and other guinea pigs.', 'https://images.pexels.com/photos/33152/guinea-pig-cavy-pet-guinea.jpg?auto=compress&cs=tinysrgb&w=800', 30.00, 'available', ARRAY['social', 'calm']),
    ('Henrietta', rhode_island_id, '2023-03-10', 7.2, 'female', 'Deep Red', 'An excellent laying hen with consistent egg production. Part of our sustainable farming program.', 'https://images.pexels.com/photos/1300355/pexels-photo-1300355.jpeg?auto=compress&cs=tinysrgb&w=800', 35.00, 'available', ARRAY['calm', 'productive']),
    ('Buddy', golden_retriever_id, '2023-04-05', 65.0, 'male', 'Golden', 'A well-socialized Golden Retriever puppy with excellent temperament. Health tested parents with clear certifications.', 'https://images.pexels.com/photos/552598/pexels-photo-552598.jpeg?auto=compress&cs=tinysrgb&w=800', 1200.00, 'available', ARRAY['friendly', 'intelligent', 'loyal']),
    ('Luna', maine_coon_id, '2023-05-12', 12.5, 'female', 'Silver Tabby', 'A beautiful Maine Coon female with excellent lineage. Known for her gentle nature and striking appearance.', 'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=800', 600.00, 'available', ARRAY['gentle', 'intelligent', 'playful']);
END$$;

-- Insert sample bi-products
INSERT INTO bi_products (name, description, type, image_url, price, unit, benefits, availability) VALUES
('Premium Rabbit Manure', 'High-quality, aged rabbit manure perfect for organic gardening. Rich in nitrogen and easy to apply.', 'manure', 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=800', 15.00, 'per 25lb bag', ARRAY['High nitrogen content', 'Organic certified', 'Improves soil structure'], 'in-stock'),
('Composted Bedding', 'Fully composted bedding material from our clean animal facilities. Excellent soil amendment.', 'compost', 'https://images.pexels.com/photos/4503271/pexels-photo-4503271.jpeg?auto=compress&cs=tinysrgb&w=800', 25.00, 'per cubic yard', ARRAY['Fully composted', 'Weed-free', 'Rich in organic matter'], 'in-stock'),
('Guinea Pig Manure', 'Small pellet manure from our guinea pig facilities. Perfect for container gardening and houseplants.', 'manure', 'https://images.pexels.com/photos/4503272/pexels-photo-4503272.jpeg?auto=compress&cs=tinysrgb&w=800', 12.00, 'per 10lb bag', ARRAY['Perfect for containers', 'Gentle on plants', 'Easy to apply'], 'in-stock');

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category) VALUES
('What animals do you breed?', 'We specialize in breeding rabbits, guinea pigs, dogs, cats, and fowls. Each species receives specialized care and attention to ensure healthy, well-socialized animals.', 'General'),
('Do you offer health guarantees?', 'Yes, all our animals come with health guarantees. We provide complete health records and offer ongoing support for any health-related questions.', 'Health'),
('Can I visit the farm?', 'Absolutely! We encourage farm visits by appointment. This allows you to meet the animals, see our facilities, and ask any questions you might have.', 'Visits'),
('Do you ship animals?', 'We prefer local pickup for the safety and comfort of our animals. However, we can arrange transportation for qualified buyers within a reasonable distance.', 'Logistics'),
('What makes your breeding program special?', 'Our breeding program focuses on health, temperament, and genetic diversity. We maintain detailed records, provide ongoing support, and prioritize the welfare of both parent animals and offspring.', 'Breeding');

-- Insert sample content items (news and guides)
INSERT INTO content_items (content_type, title, slug, excerpt, content, category, difficulty, read_time, rating, is_published, published_date) VALUES
('news', 'New Breeding Program Launch', 'new-breeding-program-launch', 'We are excited to announce the launch of our new sustainable breeding program focusing on genetic diversity and health.', 'We are thrilled to announce the launch of our comprehensive new breeding program that emphasizes genetic diversity, health testing, and sustainable practices. This program represents years of planning and research to ensure we continue providing the highest quality animals while maintaining ethical breeding standards.

Our new program includes enhanced health screening, genetic testing, and detailed record keeping for all breeding animals. We have also implemented new facilities designed specifically for the comfort and wellbeing of our animals.

This initiative aligns with our commitment to sustainable farming and responsible breeding practices. We believe that by focusing on genetic diversity and health, we can contribute to the long-term wellbeing of the breeds we work with.', 'Breeding', NULL, NULL, NULL, true, CURRENT_TIMESTAMP),

('guide', 'Basic Rabbit Care for Beginners', 'basic-rabbit-care-beginners', 'A comprehensive guide covering everything new rabbit owners need to know about proper care, housing, and nutrition.', 'Caring for rabbits requires understanding their unique needs and behaviors. This guide will walk you through the essential aspects of rabbit care.

# Housing Requirements

Rabbits need spacious, secure housing that protects them from predators and weather. The minimum space requirement is 4 times the length of your rabbit when fully stretched out.

## Indoor Housing
- Use a large cage or pen with solid flooring
- Provide hiding spaces and elevated areas
- Ensure good ventilation without drafts

## Outdoor Housing
- Secure hutch with predator-proof construction
- Weather protection from rain, wind, and extreme temperatures
- Access to grass and natural foraging opportunities

# Nutrition

Proper nutrition is crucial for rabbit health and longevity.

## Basic Diet Components
- High-quality hay (timothy hay for adults)
- Fresh vegetables daily
- Limited pellets (1/4 cup per 5 lbs body weight)
- Fresh water always available

## Foods to Avoid
- Chocolate, avocado, onions, garlic
- Iceberg lettuce, rhubarb
- Seeds, nuts, and beans

# Health Care

Regular health monitoring helps catch issues early.

- Weekly weight checks
- Daily observation for changes in behavior
- Annual veterinary checkups
- Spaying/neutering recommended', 'Care', 'Beginner', '15 min', 4.8, true, CURRENT_TIMESTAMP),

('guide', 'Advanced Breeding Techniques', 'advanced-breeding-techniques', 'Learn advanced breeding strategies including genetic planning, record keeping, and breeding program management.', 'Advanced breeding requires careful planning, detailed record keeping, and understanding of genetics. This guide covers professional breeding techniques.

# Genetic Planning

Successful breeding programs start with understanding genetics and planning breeding pairs carefully.

## Pedigree Analysis
- Study lineages for at least 3 generations
- Identify strengths and weaknesses in bloodlines
- Plan breeding to improve desired traits

## Genetic Diversity
- Avoid inbreeding depression
- Maintain genetic diversity within breeding programs
- Use outcrossing strategically

# Record Keeping

Detailed records are essential for tracking breeding success and making informed decisions.

## Essential Records
- Breeding dates and outcomes
- Health records for all animals
- Performance data and measurements
- Genetic test results

# Breeding Program Management

Managing a breeding program requires long-term planning and consistent evaluation.

## Goal Setting
- Define clear breeding objectives
- Establish measurable criteria for success
- Regular program evaluation and adjustment

## Selection Criteria
- Health and genetic testing
- Temperament evaluation
- Conformation to breed standards
- Production performance where applicable', 'Breeding', 'Advanced', '25 min', 4.9, true, CURRENT_TIMESTAMP);

-- =============================================================================
-- COMPLETION MESSAGE
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE 'iFarm database schema installation completed successfully!';
    RAISE NOTICE 'Key features implemented:';
    RAISE NOTICE '- Comprehensive livestock management system';
    RAISE NOTICE '- Multi-species animal tracking with breed relationships';
    RAISE NOTICE '- Health records and vaccination tracking';
    RAISE NOTICE '- Breeding program management';
    RAISE NOTICE '- Inventory and financial management';
    RAISE NOTICE '- Content management system';
    RAISE NOTICE '- Row Level Security with role-based access';
    RAISE NOTICE '- Sample data for immediate testing';
    RAISE NOTICE 'Schema includes: User management, Animal tracking, Health records,';
    RAISE NOTICE 'Breeding programs, Inventory management, Financial tracking, and Content management.';
END$$;