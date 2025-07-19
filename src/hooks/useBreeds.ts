// src/hooks/useBreeds.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Breed {
  id: string;
  name: string;
  type: 'rabbit' | 'guinea-pig' | 'dog' | 'cat' | 'fowl';
  description: string;
  origin_country?: string;
  characteristics: string[];
  average_weight_min?: number;
  average_weight_max?: number;
  average_lifespan_years?: number;
  primary_uses: string[];
  care_level?: string;
  climate_preferences: string[];
  image_url?: string;
  price_range_min?: number;
  price_range_max?: number;
  is_rare_breed: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useBreeds() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBreeds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('breeds')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setBreeds(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch breeds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreeds();
  }, []);

  return { breeds, loading, error, refetch: fetchBreeds };
}

// src/hooks/useAnimals.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Animal {
  id: string;
  name: string;
  breed_id: string;
  genetic_line_id?: string;
  facility_id?: string;
  registration_number?: string;
  microchip_number?: string;
  date_of_birth?: string;
  weight_lbs: number;
  gender: 'male' | 'female';
  color: string;
  markings?: string;
  status: 'available' | 'breeding' | 'sold' | 'reserved' | 'retired' | 'deceased';
  price?: number;
  is_for_sale: boolean;
  description: string;
  coat_type?: string;
  coat_length?: string;
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  temperament: string[];
  is_breeding_quality: boolean;
  breeding_restrictions?: string;
  egg_production_annual?: number;
  purpose?: 'eggs' | 'meat' | 'dual-purpose' | 'ornamental' | 'breeding';
  acquisition_date?: string;
  acquisition_source?: string;
  acquisition_cost?: number;
  image_url: string;
  additional_images: string[];
  sire_id?: string;
  dam_id?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  breeds?: {
    name: string;
    type: string;
  };
  facilities?: {
    name: string;
  };
  age_months?: number;
}

export function useAnimals() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('animals')
        .select(`
          *,
          breeds!inner(name, type),
          facilities(name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate age for each animal
      const animalsWithAge = (data || []).map(animal => ({
        ...animal,
        age_months: animal.date_of_birth 
          ? Math.floor((new Date().getTime() - new Date(animal.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
          : 0
      }));

      setAnimals(animalsWithAge);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch animals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  return { animals, loading, error, refetch: fetchAnimals };
}

// src/hooks/useFacilities.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Facility {
  id: string;
  name: string;
  facility_type: string;
  description?: string;
  capacity?: number;
  current_occupancy: number;
  location?: string;
  dimensions?: string;
  climate_controlled: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useFacilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setFacilities(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch facilities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  return { facilities, loading, error, refetch: fetchFacilities };
}

// src/hooks/useHealthRecords.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface HealthRecord {
  id: string;
  animal_id: string;
  veterinarian_id?: string;
  record_type: 'vaccination' | 'checkup' | 'treatment' | 'surgery' | 'injury' | 'illness' | 'deworming' | 'dental';
  record_date: string;
  title: string;
  description?: string;
  diagnosis?: string;
  treatment_details: any;
  medications_prescribed: string[];
  cost?: number;
  follow_up_required: boolean;
  follow_up_date?: string;
  next_due_date?: string;
  attachments: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  animals?: {
    name: string;
  };
  veterinarians?: {
    name: string;
  };
}

export function useHealthRecords(animalId?: string) {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthRecords = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('health_records')
        .select(`
          *,
          animals!inner(name),
          veterinarians(name)
        `)
        .order('record_date', { ascending: false });

      if (animalId) {
        query = query.eq('animal_id', animalId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setHealthRecords(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthRecords();
  }, [animalId]);

  return { healthRecords, loading, error, refetch: fetchHealthRecords };
}

// src/hooks/useBreedingRecords.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface BreedingRecord {
  id: string;
  program_id?: string;
  sire_id: string;
  dam_id: string;
  breeding_date: string;
  breeding_method: string;
  expected_birth_date: string;
  actual_birth_date?: string;
  gestation_days?: number;
  litter_size?: number;
  surviving_offspring?: number;
  birth_weight_total?: number;
  complications?: string;
  status: 'planned' | 'bred' | 'confirmed_pregnant' | 'born' | 'weaned' | 'completed' | 'failed';
  notes?: string;
  breeding_fee?: number;
  created_at: string;
  updated_at: string;
  // Joined data
  sire?: {
    name: string;
    breeds?: { name: string; type: string; };
  };
  dam?: {
    name: string;
    breeds?: { name: string; type: string; };
  };
  breeding_programs?: {
    name: string;
  };
}

export function useBreedingRecords() {
  const [breedingRecords, setBreedingRecords] = useState<BreedingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBreedingRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('breeding_records')
        .select(`
          *,
          sire:animals!breeding_records_sire_id_fkey(
            name,
            breeds(name, type)
          ),
          dam:animals!breeding_records_dam_id_fkey(
            name,
            breeds(name, type)
          ),
          breeding_programs(name)
        `)
        .order('breeding_date', { ascending: false });

      if (error) throw error;
      setBreedingRecords(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch breeding records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreedingRecords();
  }, []);

  return { breedingRecords, loading, error, refetch: fetchBreedingRecords };
}

// src/hooks/useInventoryItems.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface InventoryItem {
  id: string;
  name: string;
  sku?: string;
  category: 'feed' | 'medical' | 'equipment' | 'bedding' | 'supplement' | 'toy' | 'grooming' | 'cleaning';
  subcategory?: string;
  animal_types: string[];
  unit: string;
  unit_size?: string;
  current_quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  low_stock_threshold: number;
  reorder_point?: number;
  max_stock_level?: number;
  cost_per_unit: number;
  sale_price_per_unit?: number;
  supplier_id?: string;
  storage_location?: string;
  storage_requirements?: string;
  expiration_tracking: boolean;
  shelf_life_days?: number;
  image_url?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  suppliers?: {
    name: string;
  };
}

export function useInventoryItems() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventoryItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory_items')
        .select(`
          *,
          suppliers(name)
        `)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setInventoryItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  return { inventoryItems, loading, error, refetch: fetchInventoryItems };
}

// src/hooks/useSuppliers.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  website?: string;
  tax_id?: string;
  payment_terms?: string;
  credit_limit?: number;
  preferred_payment_method?: 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'paypal' | 'other';
  delivery_schedule?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setSuppliers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return { suppliers, loading, error, refetch: fetchSuppliers };
}

// src/hooks/useVeterinarians.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Veterinarian {
  id: string;
  name: string;
  license_number?: string;
  phone?: string;
  email?: string;
  clinic_name?: string;
  address?: string;
  specialties: string[];
  emergency_contact: boolean;
  preferred_contact_method?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useVeterinarians() {
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVeterinarians = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('veterinarians')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setVeterinarians(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch veterinarians');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVeterinarians();
  }, []);

  return { veterinarians, loading, error, refetch: fetchVeterinarians };
}

// src/hooks/useCustomers.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Customer {
  id: string;
  user_id?: string;
  customer_type: string;
  first_name?: string;
  last_name?: string;
  business_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  tax_exempt: boolean;
  tax_id?: string;
  credit_limit: number;
  payment_terms: string;
  preferred_contact_method: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { customers, loading, error, refetch: fetchCustomers };
}

// src/hooks/useFinancialTransactions.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface FinancialTransaction {
  id: string;
  transaction_type: 'sale' | 'purchase' | 'expense' | 'income' | 'refund' | 'fee';
  amount: number;
  payment_method?: 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'paypal' | 'other';
  reference_number?: string;
  description: string;
  category?: string;
  animal_id?: string;
  customer_id?: string;
  supplier_id?: string;
  invoice_number?: string;
  receipt_number?: string;
  tax_amount: number;
  transaction_date: string;
  due_date?: string;
  paid_date?: string;
  status: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  // Joined data
  animals?: {
    name: string;
  };
  customers?: {
    first_name?: string;
    last_name?: string;
    business_name?: string;
  };
  suppliers?: {
    name: string;
  };
}

export function useFinancialTransactions() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          animals(name),
          customers(first_name, last_name, business_name),
          suppliers(name)
        `)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch financial transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return { transactions, loading, error, refetch: fetchTransactions };
}