import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type user_role = 'administrator' | 'farm' | 'customer'
export type activity_type = 'login' | 'create' | 'update' | 'delete' | 'view' | 'export' | 'import'
export type animal_type = 'rabbit' | 'guinea-pig' | 'dog' | 'cat' | 'fowl'
export type animal_gender = 'male' | 'female'
export type animal_status = 'available' | 'breeding' | 'sold' | 'reserved' | 'retired' | 'deceased'
export type animal_size = 'small' | 'medium' | 'large' | 'extra-large'
export type fowl_purpose = 'eggs' | 'meat' | 'dual-purpose' | 'ornamental' | 'breeding'
export type health_record_type = 'vaccination' | 'checkup' | 'treatment' | 'surgery' | 'injury' | 'illness' | 'deworming' | 'dental'
export type breeding_status = 'planned' | 'bred' | 'confirmed_pregnant' | 'born' | 'weaned' | 'completed' | 'failed'
export type offspring_status = 'alive' | 'deceased' | 'adopted' | 'sold' | 'retained'
export type inventory_category = 'feed' | 'medical' | 'equipment' | 'bedding' | 'supplement' | 'toy' | 'grooming' | 'cleaning'
export type inventory_transaction_type = 'purchase' | 'usage' | 'adjustment' | 'waste' | 'transfer' | 'return'
export type biproduct_type = 'manure' | 'urine' | 'bedding' | 'compost' | 'other'
export type availability_status = 'in-stock' | 'seasonal' | 'pre-order' | 'discontinued'
export type page_type = 'home' | 'about' | 'contact' | 'products' | 'education' | 'news' | 'services'
export type content_type = 'news' | 'guide' | 'faq' | 'page' | 'blog'
export type guide_difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type transaction_type = 'sale' | 'purchase' | 'expense' | 'income' | 'refund' | 'fee'
export type payment_method = 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'paypal' | 'other'


export interface Database {
  public: {
    Tables: {
      animal_measurements: {
        Row: {
          animal_id: string
          body_condition_score: number | null
          created_at: string | null
          height_inches: number | null
          id: string
          length_inches: number | null
          measurement_date: string
          measured_by: string | null
          notes: string | null
          weight_lbs: number | null
        }
        Insert: {
          animal_id: string
          body_condition_score?: number | null
          created_at?: string | null
          height_inches?: number | null
          id?: string
          length_inches?: number | null
          measurement_date?: string
          measured_by?: string | null
          notes?: string | null
          weight_lbs?: number | null
        }
        Update: {
          animal_id?: string
          body_condition_score?: number | null
          created_at?: string | null
          height_inches?: number | null
          id?: string
          length_inches?: number | null
          measurement_date?: string
          measured_by?: string | null
          notes?: string | null
          weight_lbs?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "animal_measurements_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_measurements_measured_by_fkey"
            columns: ["measured_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      animals: {
        Row: {
          acquisition_cost: number | null
          acquisition_date: string | null
          acquisition_source: string | null
          additional_images: string[] | null
          breed_id: string
          breeding_restrictions: string | null
          coat_length: string | null
          coat_type: string | null
          color: string
          created_at: string | null
          dam_id: string | null
          date_of_birth: string | null
          description: string
          egg_production_annual: number | null
          facility_id: string | null
          gender: animal_gender
          genetic_line_id: string | null
          id: string
          image_url: string
          is_active: boolean | null
          is_breeding_quality: boolean | null
          is_for_sale: boolean | null
          microchip_number: string | null
          name: string
          notes: string | null
          price: number | null
          purpose: fowl_purpose | null
          registration_number: string | null
          sire_id: string | null
          size: animal_size | null
          status: animal_status | null
          temperament: string[] | null
          updated_at: string | null
          weight_lbs: number
        }
        Insert: {
          acquisition_cost?: number | null
          acquisition_date?: string | null
          acquisition_source?: string | null
          additional_images?: string[] | null
          breed_id: string
          breeding_restrictions?: string | null
          coat_length?: string | null
          coat_type?: string | null
          color: string
          created_at?: string | null
          dam_id?: string | null
          date_of_birth?: string | null
          description: string
          egg_production_annual?: number | null
          facility_id?: string | null
          gender: animal_gender
          genetic_line_id?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          is_breeding_quality?: boolean | null
          is_for_sale?: boolean | null
          microchip_number?: string | null
          name: string
          notes?: string | null
          price?: number | null
          purpose?: fowl_purpose | null
          registration_number?: string | null
          sire_id?: string | null
          size?: animal_size | null
          status?: animal_status | null
          temperament?: string[] | null
          updated_at?: string | null
          weight_lbs: number
        }
        Update: {
          acquisition_cost?: number | null
          acquisition_date?: string | null
          acquisition_source?: string | null
          additional_images?: string[] | null
          breed_id?: string
          breeding_restrictions?: string | null
          coat_length?: string | null
          coat_type?: string | null
          color?: string
          created_at?: string | null
          dam_id?: string | null
          date_of_birth?: string | null
          description?: string
          egg_production_annual?: number | null
          facility_id?: string | null
          gender?: animal_gender
          genetic_line_id?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          is_breeding_quality?: boolean | null
          is_for_sale?: boolean | null
          microchip_number?: string | null
          name?: string
          notes?: string | null
          price?: number | null
          purpose?: fowl_purpose | null
          registration_number?: string | null
          sire_id?: string | null
          size?: animal_size | null
          status?: animal_status | null
          temperament?: string[] | null
          updated_at?: string | null
          weight_lbs?: number
        }
        Relationships: [
          {
            foreignKeyName: "animals_breed_id_fkey"
            columns: ["breed_id"]
            isOneToOne: false
            referencedRelation: "breeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_dam_id_fkey"
            columns: ["dam_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_genetic_line_id_fkey"
            columns: ["genetic_line_id"]
            isOneToOne: false
            referencedRelation: "genetic_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_sire_id_fkey"
            columns: ["sire_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      bi_products: {
        Row: {
          availability: availability_status | null
          benefits: string[] | null
          certifications: string[] | null
          created_at: string | null
          current_stock: number | null
          description: string
          id: string
          image_url: string
          is_active: boolean | null
          is_organic_certified: boolean | null
          name: string
          notes: string | null
          price: number
          processing_method: string | null
          production_capacity_per_month: number | null
          seasonal_months: number[] | null
          source_animals: string[] | null
          type: biproduct_type
          unit: string
          unit_description: string | null
          updated_at: string | null
          usage_instructions: string | null
          storage_requirements: string | null
        }
        Insert: {
          availability?: availability_status | null
          benefits?: string[] | null
          certifications?: string[] | null
          created_at?: string | null
          current_stock?: number | null
          description: string
          id?: string
          image_url: string
          is_active?: boolean | null
          is_organic_certified?: boolean | null
          name: string
          notes?: string | null
          price: number
          processing_method?: string | null
          production_capacity_per_month?: number | null
          seasonal_months?: number[] | null
          source_animals?: string[] | null
          type: biproduct_type
          unit: string
          unit_description?: string | null
          updated_at?: string | null
          usage_instructions?: string | null
          storage_requirements?: string | null
        }
        Update: {
          availability?: availability_status | null
          benefits?: string[] | null
          certifications?: string[] | null
          created_at?: string | null
          current_stock?: number | null
          description?: string
          id?: string
          image_url?: string
          is_active?: boolean | null
          is_organic_certified?: boolean | null
          name?: string
          notes?: string | null
          price?: number
          processing_method?: string | null
          production_capacity_per_month?: number | null
          seasonal_months?: number[] | null
          source_animals?: string[] | null
          type?: biproduct_type
          unit?: string
          unit_description?: string | null
          updated_at?: string | null
          usage_instructions?: string | null
          storage_requirements?: string | null
        }
        Relationships: []
      }
      breeding_programs: {
        Row: {
          animal_type: animal_type
          breed_id: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          goals: string[] | null
          id: string
          is_active: boolean | null
          name: string
          program_manager_id: string | null
          start_date: string
          target_traits: string[] | null
          updated_at: string | null
        }
        Insert: {
          animal_type: animal_type
          breed_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          goals?: string[] | null
          id?: string
          is_active?: boolean | null
          name: string
          program_manager_id?: string | null
          start_date: string
          target_traits?: string[] | null
          updated_at?: string | null
        }
        Update: {
          animal_type?: animal_type
          breed_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          goals?: string[] | null
          id?: string
          is_active?: boolean | null
          name?: string
          program_manager_id?: string | null
          start_date?: string
          target_traits?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "breeding_programs_breed_id_fkey"
            columns: ["breed_id"]
            isOneToOne: false
            referencedRelation: "breeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breeding_programs_program_manager_id_fkey"
            columns: ["program_manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      breeding_records: {
        Row: {
          actual_birth_date: string | null
          birth_weight_total: number | null
          breeding_date: string
          breeding_fee: number | null
          breeding_method: string | null
          complications: string | null
          created_at: string | null
          dam_id: string
          expected_birth_date: string
          gestation_days: number | null
          id: string
          litter_size: number | null
          notes: string | null
          program_id: string | null
          sire_id: string
          status: breeding_status | null
          surviving_offspring: number | null
          updated_at: string | null
        }
        Insert: {
          actual_birth_date?: string | null
          birth_weight_total?: number | null
          breeding_date: string
          breeding_fee?: number | null
          breeding_method?: string | null
          complications?: string | null
          created_at?: string | null
          dam_id: string
          expected_birth_date: string
          gestation_days?: number | null
          id?: string
          litter_size?: number | null
          notes?: string | null
          program_id?: string | null
          sire_id: string
          status?: breeding_status | null
          surviving_offspring?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_birth_date?: string | null
          birth_weight_total?: number | null
          breeding_date?: string
          breeding_fee?: number | null
          breeding_method?: string | null
          complications?: string | null
          created_at?: string | null
          dam_id?: string
          expected_birth_date?: string
          gestation_days?: number | null
          id?: string
          litter_size?: number | null
          notes?: string | null
          program_id?: string | null
          sire_id?: string
          status?: breeding_status | null
          surviving_offspring?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "breeding_records_dam_id_fkey"
            columns: ["dam_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breeding_records_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "breeding_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breeding_records_sire_id_fkey"
            columns: ["sire_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      breeds: {
        Row: {
          average_lifespan_years: number | null
          average_weight_max: number | null
          average_weight_min: number | null
          care_level: string | null
          characteristics: Json | null
          climate_preferences: string[] | null
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          is_active: boolean | null
          is_rare_breed: boolean | null
          name: string
          origin_country: string | null
          price_range_max: number | null
          price_range_min: number | null
          primary_uses: string[] | null
          type: animal_type
          updated_at: string | null
        }
        Insert: {
          average_lifespan_years?: number | null
          average_weight_max?: number | null
          average_weight_min?: number | null
          care_level?: string | null
          characteristics?: Json | null
          climate_preferences?: string[] | null
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_rare_breed?: boolean | null
          name: string
          origin_country?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          primary_uses?: string[] | null
          type: animal_type
          updated_at?: string | null
        }
        Update: {
          average_lifespan_years?: number | null
          average_weight_max?: number | null
          average_weight_min?: number | null
          care_level?: string | null
          characteristics?: Json | null
          climate_preferences?: string[] | null
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_rare_breed?: boolean | null
          name?: string
          origin_country?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          primary_uses?: string[] | null
          type?: animal_type
          updated_at?: string | null
        }
        Relationships: []
      }
      content_items: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          content_type: content_type
          created_at: string | null
          difficulty: guide_difficulty | null
          excerpt: string | null
          featured_image_id: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          metadata: Json | null
          published_date: string | null
          rating: number | null
          read_time: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          content_type: content_type
          created_at?: string | null
          difficulty?: guide_difficulty | null
          excerpt?: string | null
          featured_image_id?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          metadata?: Json | null
          published_date?: string | null
          rating?: number | null
          read_time?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          content_type?: content_type
          created_at?: string | null
          difficulty?: guide_difficulty | null
          excerpt?: string | null
          featured_image_id?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          metadata?: Json | null
          published_date?: string | null
          rating?: number | null
          read_time?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_items_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_featured_image_id_fkey"
            columns: ["featured_image_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          business_name: string | null
          city: string | null
          created_at: string | null
          credit_limit: number | null
          customer_type: string | null
          email: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          notes: string | null
          payment_terms: string | null
          phone: string | null
          preferred_contact_method: string | null
          state: string | null
          tax_exempt: boolean | null
          tax_id: string | null
          updated_at: string | null
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          business_name?: string | null
          city?: string | null
          created_at?: string | null
          credit_limit?: number | null
          customer_type?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          state?: string | null
          tax_exempt?: boolean | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string | null
          city?: string | null
          created_at?: string | null
          credit_limit?: number | null
          customer_type?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          state?: string | null
          tax_exempt?: boolean | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      facilities: {
        Row: {
          capacity: number | null
          climate_controlled: boolean | null
          created_at: string | null
          current_occupancy: number | null
          description: string | null
          dimensions: string | null
          facility_type: string
          id: string
          is_active: boolean | null
          location: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          climate_controlled?: boolean | null
          created_at?: string | null
          current_occupancy?: number | null
          description?: string | null
          dimensions?: string | null
          facility_type: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          climate_controlled?: boolean | null
          created_at?: string | null
          current_occupancy?: number | null
          description?: string | null
          dimensions?: string | null
          facility_type?: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          order_index: number | null
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      farm_settings: {
        Row: {
          created_at: string | null
          data_type: string | null
          description: string | null
          id: string
          is_public: boolean | null
          setting_group: string
          setting_key: string
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_type?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_group: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_type?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_group?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          animal_id: string | null
          category: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          description: string
          due_date: string | null
          id: string
          invoice_number: string | null
          notes: string | null
          paid_date: string | null
          payment_method: payment_method | null
          receipt_number: string | null
          reference_number: string | null
          status: string | null
          supplier_id: string | null
          tax_amount: number | null
          transaction_date: string
          transaction_type: transaction_type
        }
        Insert: {
          amount: number
          animal_id?: string | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          description: string
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          paid_date?: string | null
          payment_method?: payment_method | null
          receipt_number?: string | null
          reference_number?: string | null
          status?: string | null
          supplier_id?: string | null
          tax_amount?: number | null
          transaction_date?: string
          transaction_type: transaction_type
        }
        Update: {
          amount?: number
          animal_id?: string | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          description?: string
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          paid_date?: string | null
          payment_method?: payment_method | null
          receipt_number?: string | null
          reference_number?: string | null
          status?: string | null
          supplier_id?: string | null
          tax_amount?: number | null
          transaction_date?: string
          transaction_type?: transaction_type
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      genetic_lines: {
        Row: {
          breed_id: string
          characteristics: string[] | null
          created_at: string | null
          description: string | null
          founder_animals: string[] | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          breed_id: string
          characteristics?: string[] | null
          created_at?: string | null
          description?: string | null
          founder_animals?: string[] | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          breed_id?: string
          characteristics?: string[] | null
          created_at?: string | null
          description?: string | null
          founder_animals?: string[] | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "genetic_lines_breed_id_fkey"
            columns: ["breed_id"]
            isOneToOne: false
            referencedRelation: "breeds"
            referencedColumns: ["id"]
          },
        ]
      }
      health_records: {
        Row: {
          attachments: string[] | null
          cost: number | null
          created_at: string | null
          description: string | null
          diagnosis: string | null
          animal_id: string
          follow_up_date: string | null
          follow_up_required: boolean | null
          id: string
          medications_prescribed: string[] | null
          next_due_date: string | null
          notes: string | null
          record_date: string
          record_type: health_record_type
          title: string
          treatment_details: Json | null
          updated_at: string | null
          veterinarian_id: string | null
        }
        Insert: {
          attachments?: string[] | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          diagnosis?: string | null
          animal_id: string
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          medications_prescribed?: string[] | null
          next_due_date?: string | null
          notes?: string | null
          record_date?: string
          record_type: health_record_type
          title: string
          treatment_details?: Json | null
          updated_at?: string | null
          veterinarian_id?: string | null
        }
        Update: {
          attachments?: string[] | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          diagnosis?: string | null
          animal_id?: string
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          medications_prescribed?: string[] | null
          next_due_date?: string | null
          notes?: string | null
          record_date?: string
          record_type?: health_record_type
          title?: string
          treatment_details?: Json | null
          updated_at?: string | null
          veterinarian_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_records_veterinarian_id_fkey"
            columns: ["veterinarian_id"]
            isOneToOne: false
            referencedRelation: "veterinarians"
            referencedColumns: ["id"]
          },
        ]
      }
      health_schedules: {
        Row: {
          age_end_months: number | null
          age_start_months: number | null
          animal_id: string | null
          breed_id: string | null
          created_at: string | null
          description: string | null
          frequency_days: number
          id: string
          is_active: boolean | null
          is_mandatory: boolean | null
          name: string
          reminder_days_advance: number | null
          schedule_type: health_record_type
        }
        Insert: {
          age_end_months?: number | null
          age_start_months?: number | null
          animal_id?: string | null
          breed_id?: string | null
          created_at?: string | null
          description?: string | null
          frequency_days: number
          id?: string
          is_active?: boolean | null
          is_mandatory?: boolean | null
          name: string
          reminder_days_advance?: number | null
          schedule_type: health_record_type
        }
        Update: {
          age_end_months?: number | null
          age_start_months?: number | null
          animal_id?: string | null
          breed_id?: string | null
          created_at?: string | null
          description?: string | null
          frequency_days?: number
          id?: string
          is_active?: boolean | null
          is_mandatory?: boolean | null
          name?: string
          reminder_days_advance?: number | null
          schedule_type?: health_record_type
        }
        Relationships: [
          {
            foreignKeyName: "health_schedules_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_schedules_breed_id_fkey"
            columns: ["breed_id"]
            isOneToOne: false
            referencedRelation: "breeds"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_batches: {
        Row: {
          batch_number: string
          created_at: string | null
          expiration_date: string | null
          id: string
          inventory_item_id: string
          is_active: boolean | null
          notes: string | null
          quantity: number
          received_date: string
          remaining_quantity: number
          supplier_id: string | null
          unit_cost: number
        }
        Insert: {
          batch_number: string
          created_at?: string | null
          expiration_date?: string | null
          id?: string
          inventory_item_id: string
          is_active?: boolean | null
          notes?: string | null
          quantity: number
          received_date: string
          remaining_quantity: number
          supplier_id?: string | null
          unit_cost: number
        }
        Update: {
          batch_number?: string
          created_at?: string | null
          expiration_date?: string | null
          id?: string
          inventory_item_id?: string
          is_active?: boolean | null
          notes?: string | null
          quantity?: number
          received_date?: string
          remaining_quantity?: number
          supplier_id?: string | null
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_batches_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_batches_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          animal_types: string[] | null
          available_quantity: number | null
          category: inventory_category
          cost_per_unit: number | null
          created_at: string | null
          current_quantity: number | null
          expiration_tracking: boolean | null
          id: string
          image_url: string | null
          is_active: boolean | null
          low_stock_threshold: number | null
          max_stock_level: number | null
          name: string
          notes: string | null
          reorder_point: number | null
          reserved_quantity: number | null
          sale_price_per_unit: number | null
          shelf_life_days: number | null
          sku: string | null
          storage_location: string | null
          storage_requirements: string | null
          subcategory: string | null
          supplier_id: string | null
          unit: string
          unit_size: string | null
          updated_at: string | null
        }
        Insert: {
          animal_types?: string[] | null
          available_quantity?: number | null
          category: inventory_category
          cost_per_unit?: number | null
          created_at?: string | null
          current_quantity?: number | null
          expiration_tracking?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          low_stock_threshold?: number | null
          max_stock_level?: number | null
          name: string
          notes?: string | null
          reorder_point?: number | null
          reserved_quantity?: number | null
          sale_price_per_unit?: number | null
          shelf_life_days?: number | null
          sku?: string | null
          storage_location?: string | null
          storage_requirements?: string | null
          subcategory?: string | null
          supplier_id?: string | null
          unit: string
          unit_size?: string | null
          updated_at?: string | null
        }
        Update: {
          animal_types?: string[] | null
          available_quantity?: number | null
          category?: inventory_category
          cost_per_unit?: number | null
          created_at?: string | null
          current_quantity?: number | null
          expiration_tracking?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          low_stock_threshold?: number | null
          max_stock_level?: number | null
          name?: string
          notes?: string | null
          reorder_point?: number | null
          reserved_quantity?: number | null
          sale_price_per_unit?: number | null
          shelf_life_days?: number | null
          sku?: string | null
          storage_location?: string | null
          storage_requirements?: string | null
          subcategory?: string | null
          supplier_id?: string | null
          unit?: string
          unit_size?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_transactions: {
        Row: {
          animal_id: string | null
          batch_id: string | null
          created_by: string | null
          id: string
          inventory_item_id: string
          notes: string | null
          quantity: number
          reason: string | null
          reference_id: string | null
          reference_type: string | null
          total_cost: number | null
          transaction_date: string | null
          transaction_type: inventory_transaction_type
          unit_cost: number | null
        }
        Insert: {
          animal_id?: string | null
          batch_id?: string | null
          created_by?: string | null
          id?: string
          inventory_item_id: string
          notes?: string | null
          quantity: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          total_cost?: number | null
          transaction_date?: string | null
          transaction_type: inventory_transaction_type
          unit_cost?: number | null
        }
        Update: {
          animal_id?: string | null
          batch_id?: string | null
          created_by?: string | null
          id?: string
          inventory_item_id?: string
          notes?: string | null
          quantity?: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          total_cost?: number | null
          transaction_date?: string | null
          transaction_type?: inventory_transaction_type
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "inventory_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string | null
          filename: string
          file_size_bytes: number | null
          height_px: number | null
          id: string
          is_public: boolean | null
          mime_type: string | null
          optimized_url: string | null
          original_url: string
          tags: string[] | null
          thumbnail_url: string | null
          upload_date: string | null
          uploaded_by: string | null
          width_px: number | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          filename: string
          file_size_bytes?: number | null
          height_px?: number | null
          id?: string
          is_public?: boolean | null
          mime_type?: string | null
          optimized_url?: string | null
          original_url: string
          tags?: string[] | null
          thumbnail_url?: string | null
          upload_date?: string | null
          uploaded_by?: string | null
          width_px?: number | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          filename?: string
          file_size_bytes?: number | null
          height_px?: number | null
          id?: string
          is_public?: boolean | null
          mime_type?: string | null
          optimized_url?: string | null
          original_url?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          upload_date?: string | null
          uploaded_by?: string | null
          width_px?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      offspring: {
        Row: {
          animal_id: string | null
          birth_order: number | null
          breeding_record_id: string
          buyer_info: string | null
          color: string | null
          created_at: string | null
          gender: animal_gender | null
          id: string
          markings: string | null
          notes: string | null
          sale_date: string | null
          sale_price: number | null
          status: offspring_status | null
          updated_at: string | null
          weaning_date: string | null
          weight_at_birth: number | null
        }
        Insert: {
          animal_id?: string | null
          birth_order?: number | null
          breeding_record_id: string
          buyer_info?: string | null
          color?: string | null
          created_at?: string | null
          gender?: animal_gender | null
          id?: string
          markings?: string | null
          notes?: string | null
          sale_date?: string | null
          sale_price?: number | null
          status?: offspring_status | null
          updated_at?: string | null
          weaning_date?: string | null
          weight_at_birth?: number | null
        }
        Update: {
          animal_id?: string | null
          birth_order?: number | null
          breeding_record_id?: string
          buyer_info?: string | null
          color?: string | null
          created_at?: string | null
          gender?: animal_gender | null
          id?: string
          markings?: string | null
          notes?: string | null
          sale_date?: string | null
          sale_price?: number | null
          status?: offspring_status | null
          updated_at?: string | null
          weaning_date?: string | null
          weight_at_birth?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "offspring_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offspring_breeding_record_id_fkey"
            columns: ["breeding_record_id"]
            isOneToOne: false
            referencedRelation: "breeding_records"
            referencedColumns: ["id"]
          },
        ]
      }
      page_content: {
        Row: {
          content_data: Json
          created_at: string | null
          featured_image_id: string | null
          id: string
          is_published: boolean | null
          meta_description: string | null
          meta_title: string | null
          page_type: page_type
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content_data?: Json
          created_at?: string | null
          featured_image_id?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          page_type: page_type
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content_data?: Json
          created_at?: string | null
          featured_image_id?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          page_type?: page_type
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_content_featured_image_id_fkey"
            columns: ["featured_image_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_content_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          city: string | null
          contact_person: string | null
          created_at: string | null
          credit_limit: number | null
          delivery_schedule: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          payment_terms: string | null
          phone: string | null
          preferred_payment_method: payment_method | null
          state: string | null
          tax_id: string | null
          updated_at: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_person?: string | null
          created_at?: string | null
          credit_limit?: number | null
          delivery_schedule?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          preferred_payment_method?: payment_method | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_person?: string | null
          created_at?: string | null
          credit_limit?: number | null
          delivery_schedule?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          preferred_payment_method?: payment_method | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      system_notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          data: Json | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          priority: string | null
          read_at: string | null
          recipient_id: string | null
          notification_type: string
          title: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          priority?: string | null
          read_at?: string | null
          recipient_id?: string | null
          notification_type: string
          title: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: string | null
          read_at?: string | null
          recipient_id?: string | null
          notification_type?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          bio: string
          created_at: string | null
          email: string | null
          hire_date: string | null
          id: string
          image_url: string
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          order_index: number | null
          phone: string | null
          role: string
          social_links: Json | null
          specialties: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bio: string
          created_at?: string | null
          email?: string | null
          hire_date?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          order_index?: number | null
          phone?: string | null
          role: string
          social_links?: Json | null
          specialties?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bio?: string
          created_at?: string | null
          email?: string | null
          hire_date?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          order_index?: number | null
          phone?: string | null
          role?: string
          social_links?: Json | null
          specialties?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: activity_type
          created_at: string | null
          description: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          activity_type: activity_type
          created_at?: string | null
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          activity_type?: activity_type
          created_at?: string | null
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          notes: string | null
          notification_settings: Json | null
          phone: string | null
          preferences: Json | null
          state: string | null
          updated_at: string | null
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          notes?: string | null
          notification_settings?: Json | null
          phone?: string | null
          preferences?: Json | null
          state?: string | null
          updated_at?: string | null
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          notes?: string | null
          notification_settings?: Json | null
          phone?: string | null
          preferences?: Json | null
          state?: string | null
          updated_at?: string | null
          user_id?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          role: user_role
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          last_login?: string | null
          role?: user_role
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          role?: user_role
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      vaccinations: {
        Row: {
          administered_by: string | null
          administered_date: string
          administration_route: string | null
          animal_id: string
          batch_number: string | null
          created_at: string | null
          dose_amount: string | null
          id: string
          manufacturer: string | null
          next_due_date: string | null
          notes: string | null
          vaccine_name: string
        }
        Insert: {
          administered_by?: string | null
          administered_date: string
          administration_route?: string | null
          animal_id: string
          batch_number?: string | null
          created_at?: string | null
          dose_amount?: string | null
          id?: string
          manufacturer?: string | null
          next_due_date?: string | null
          notes?: string | null
          vaccine_name: string
        }
        Update: {
          administered_by?: string | null
          administered_date?: string
          administration_route?: string | null
          animal_id?: string
          batch_number?: string | null
          created_at?: string | null
          dose_amount?: string | null
          id?: string
          manufacturer?: string | null
          next_due_date?: string | null
          notes?: string | null
          vaccine_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccinations_administered_by_fkey"
            columns: ["administered_by"]
            isOneToOne: false
            referencedRelation: "veterinarians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaccinations_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      veterinarians: {
        Row: {
          address: string | null
          clinic_name: string | null
          created_at: string | null
          email: string | null
          emergency_contact: boolean | null
          id: string
          is_active: boolean | null
          license_number: string | null
          name: string
          notes: string | null
          phone: string | null
          preferred_contact_method: string | null
          specialties: string[] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          clinic_name?: string | null
          created_at?: string | null
          email?: string | null
          emergency_contact?: boolean | null
          id?: string
          is_active?: boolean | null
          license_number?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          specialties?: string[] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          clinic_name?: string | null
          created_at?: string | null
          email?: string | null
          emergency_contact?: boolean | null
          id?: string
          is_active?: boolean | null
          license_number?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          specialties?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      animal_health_summary: {
        Row: {
          animal_id: string | null
          checkup_count: number | null
          current_age_months: number | null
          last_health_record_date: string | null
          last_vaccination_date: string | null
          name: string | null
          total_health_records: number | null
          treatment_count: number | null
          vaccination_count: number | null
          vaccination_records: number | null
        }
        Relationships: [
          {
            foreignKeyName: "health_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      available_animals_view: {
        Row: {
          age_months: number | null
          additional_images: string[] | null
          animal_type: animal_type | null
          breed_characteristics: Json | null
          breed_name: string | null
          color: string | null
          date_of_birth: string | null
          description: string | null
          facility_name: string | null
          gender: animal_gender | null
          id: string | null
          image_url: string | null
          name: string | null
          price: number | null
          registration_number: string | null
          temperament: string[] | null
          weight_lbs: number | null
        }
        Relationships: []
      }
      breeding_performance_view: {
        Row: {
          age_months: number | null
          animal_id: string | null
          avg_litter_size: number | null
          current_age_months: number | null
          gender: animal_gender | null
          living_offspring: number | null
          name: string | null
          times_as_dam: number | null
          times_as_sire: number | null
          total_offspring: number | null
        }
        Relationships: [
          {
            foreignKeyName: "animals_dam_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_sire_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_status_view: {
        Row: {
          available_quantity: number | null
          category: inventory_category | null
          cost_per_unit: number | null
          current_quantity: number | null
          id: string | null
          low_stock_threshold: number | null
          name: string | null
          sku: string | null
          stock_status: string | null
          supplier_name: string | null
          total_value: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_age_months_from_birth: {
        Args: {
          birth_date: string
        }
        Returns: number
      }
      calculate_current_age_months: {
        Args: {
          birth_date: string
        }
        Returns: number
      }
      check_low_stock_items: {
        Args: Record<PropertyKey, never>
        Returns: {
          item_id: string
          item_name: string
          current_quantity: number
          threshold: number
          shortage: number
        }[]
      }
      get_breeding_calendar: {
        Args: {
          months_ahead?: number
        }
        Returns: {
          breeding_id: string
          sire_name: string
          dam_name: string
          breeding_date: string
          expected_birth: string
          status: breeding_status
          days_until_birth: number
        }[]
      }
      get_health_reminders: {
        Args: {
          days_ahead?: number
        }
        Returns: {
          animal_id: string
          animal_name: string
          reminder_type: string
          due_date: string
          days_until_due: number
        }[]
      }
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {
      activity_type: activity_type
      animal_gender: animal_gender
      animal_size: animal_size
      animal_status: animal_status
      animal_type: animal_type
      availability_status: availability_status
      biproduct_type: biproduct_type
      breeding_status: breeding_status
      content_type: content_type
      fowl_purpose: fowl_purpose
      guide_difficulty: guide_difficulty
      health_record_type: health_record_type
      inventory_category: inventory_category
      inventory_transaction_type: inventory_transaction_type
      offspring_status: offspring_status
      page_type: page_type
      payment_method: payment_method
      transaction_type: transaction_type
      user_role: user_role
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
