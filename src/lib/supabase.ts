import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      breeds: {
        Row: {
          id: string
          name: string
          type: 'rabbit' | 'guinea-pig' | 'dog' | 'cat' | 'fowl'
          description: string
          characteristics: string[]
          average_weight: string
          primary_use: string
          image_url: string
          price_range: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'rabbit' | 'guinea-pig' | 'dog' | 'cat' | 'fowl'
          description: string
          characteristics: string[]
          average_weight: string
          primary_use: string
          image_url: string
          price_range: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'rabbit' | 'guinea-pig' | 'dog' | 'cat' | 'fowl'
          description?: string
          characteristics?: string[]
          average_weight?: string
          primary_use?: string
          image_url?: string
          price_range?: string
          created_at?: string
          updated_at?: string
        }
      }
      animals: {
        Row: {
          id: string
          name: string
          type: 'rabbit' | 'guinea-pig' | 'dog' | 'cat' | 'fowl'
          breed: string
          age: number
          weight: number
          gender: 'male' | 'female'
          color: string
          status: 'available' | 'breeding' | 'sold' | 'reserved'
          price: number | null
          description: string
          image_url: string
          coat_type: string | null
          size: 'small' | 'medium' | 'large' | 'extra-large' | null
          temperament: string[] | null
          vaccinations: string[] | null
          egg_production: string | null
          purpose: 'eggs' | 'meat' | 'dual-purpose' | 'ornamental' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'rabbit' | 'guinea-pig' | 'dog' | 'cat' | 'fowl'
          breed: string
          age: number
          weight: number
          gender: 'male' | 'female'
          color: string
          status?: 'available' | 'breeding' | 'sold' | 'reserved'
          price?: number | null
          description: string
          image_url: string
          coat_type?: string | null
          size?: 'small' | 'medium' | 'large' | 'extra-large' | null
          temperament?: string[] | null
          vaccinations?: string[] | null
          egg_production?: string | null
          purpose?: 'eggs' | 'meat' | 'dual-purpose' | 'ornamental' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'rabbit' | 'guinea-pig' | 'dog' | 'cat' | 'fowl'
          breed?: string
          age?: number
          weight?: number
          gender?: 'male' | 'female'
          color?: string
          status?: 'available' | 'breeding' | 'sold' | 'reserved'
          price?: number | null
          description?: string
          image_url?: string
          coat_type?: string | null
          size?: 'small' | 'medium' | 'large' | 'extra-large' | null
          temperament?: string[] | null
          vaccinations?: string[] | null
          egg_production?: string | null
          purpose?: 'eggs' | 'meat' | 'dual-purpose' | 'ornamental' | null
          created_at?: string
          updated_at?: string
        }
      }
      bi_products: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string
          price: number
          unit: string
          type: 'manure' | 'urine' | 'bedding' | 'other'
          benefits: string[]
          availability: 'in-stock' | 'seasonal' | 'pre-order'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url: string
          price: number
          unit: string
          type: 'manure' | 'urine' | 'bedding' | 'other'
          benefits?: string[]
          availability?: 'in-stock' | 'seasonal' | 'pre-order'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string
          price?: number
          unit?: string
          type?: 'manure' | 'urine' | 'bedding' | 'other'
          benefits?: string[]
          availability?: 'in-stock' | 'seasonal' | 'pre-order'
          created_at?: string
          updated_at?: string
        }
      }
      news_items: {
        Row: {
          id: string
          title: string
          excerpt: string
          content: string
          date: string
          image_url: string
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          excerpt: string
          content: string
          date: string
          image_url: string
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          excerpt?: string
          content?: string
          date?: string
          image_url?: string
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          name: string
          role: string
          bio: string
          image_url: string
          specialties: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          role: string
          bio: string
          image_url: string
          specialties?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          bio?: string
          image_url?: string
          specialties?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      breeding_records: {
        Row: {
          id: string
          sire_id: string
          dam_id: string
          animal_type: 'rabbit' | 'guinea-pig' | 'dog' | 'cat' | 'fowl'
          breeding_date: string
          expected_birth: string
          actual_birth: string | null
          litter_size: number | null
          status: 'planned' | 'bred' | 'born' | 'weaned'
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sire_id: string
          dam_id: string
          animal_type: 'rabbit' | 'guinea-pig' | 'dog' | 'cat' | 'fowl'
          breeding_date: string
          expected_birth: string
          actual_birth?: string | null
          litter_size?: number | null
          status?: 'planned' | 'bred' | 'born' | 'weaned'
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sire_id?: string
          dam_id?: string
          animal_type?: 'rabbit' | 'guinea-pig' | 'dog' | 'cat' | 'fowl'
          breeding_date?: string
          expected_birth?: string
          actual_birth?: string | null
          litter_size?: number | null
          status?: 'planned' | 'bred' | 'born' | 'weaned'
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          name: string
          category: 'feed' | 'medical' | 'equipment' | 'bedding' | 'other'
          animal_types: string[]
          quantity: number
          unit: string
          low_stock_threshold: number
          cost: number
          supplier: string | null
          last_restocked: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: 'feed' | 'medical' | 'equipment' | 'bedding' | 'other'
          animal_types?: string[]
          quantity?: number
          unit: string
          low_stock_threshold?: number
          cost?: number
          supplier?: string | null
          last_restocked: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: 'feed' | 'medical' | 'equipment' | 'bedding' | 'other'
          animal_types?: string[]
          quantity?: number
          unit?: string
          low_stock_threshold?: number
          cost?: number
          supplier?: string | null
          last_restocked?: string
          created_at?: string
          updated_at?: string
        }
      }
      education_guides: {
        Row: {
          id: string
          title: string
          category: string
          read_time: string
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
          rating: number
          description: string
          content: string
          image_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          category: string
          read_time: string
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
          rating?: number
          description: string
          content: string
          image_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string
          read_time?: string
          difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
          rating?: number
          description?: string
          content?: string
          image_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question: string
          answer: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          created_at?: string
          updated_at?: string
        }
      }
      about_content: {
        Row: {
          id: string
          hero_intro_text: string
          mission_statement: string
          values_list: Json[]
          history_intro_text: string
          history_milestones: Json[]
          certifications_intro_text: string
          certifications_awards: Json[]
          gallery_intro_text: string
          image_urls: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hero_intro_text: string
          mission_statement: string
          values_list?: Json[]
          history_intro_text: string
          history_milestones?: Json[]
          certifications_intro_text: string
          certifications_awards?: Json[]
          gallery_intro_text: string
          image_urls?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hero_intro_text?: string
          mission_statement?: string
          values_list?: Json[]
          history_intro_text?: string
          history_milestones?: Json[]
          certifications_intro_text?: string
          certifications_awards?: Json[]
          gallery_intro_text?: string
          image_urls?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}