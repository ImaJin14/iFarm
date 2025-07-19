import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Animal = Database['public']['Tables']['animals']['Row'] & {
  breeds?: Database['public']['Tables']['breeds']['Row'];
  facilities?: Database['public']['Tables']['facilities']['Row'];
  age_months?: number;
  breed?: string; // For backward compatibility
  weight?: number; // For backward compatibility
  type?: string; // For backward compatibility
};

type AvailableAnimal = Database['public']['Views']['available_animals_view']['Row'];

export interface UseAnimals {
  animals: Animal[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Helper function to calculate age in months
const calculateAgeMonths = (birthDate: string | null): number => {
  if (!birthDate) return 0;
  
  const birth = new Date(birthDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - birth.getTime());
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
  return diffMonths;
};

// Helper function to adapt database data to component expectations
const adaptAnimalData = (dbAnimal: any): Animal => ({
  ...dbAnimal,
  age_months: calculateAgeMonths(dbAnimal.date_of_birth),
  breed: dbAnimal.breeds?.name || 'Unknown Breed',
  weight: dbAnimal.weight_lbs,
  type: dbAnimal.breeds?.type || 'rabbit'
});

export function useAnimals(): UseAnimals {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('animals')
        .select(`
          *,
          breeds!inner(
            id,
            name,
            type,
            characteristics,
            description,
            image_url,
            price_range_min,
            price_range_max
          ),
          facilities(
            id,
            name,
            facility_type
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      // Transform data to match component expectations
      const adaptedAnimals = (data || []).map(adaptAnimalData);
      setAnimals(adaptedAnimals);
    } catch (err) {
      console.error('Error fetching animals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch animals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  return {
    animals,
    loading,
    error,
    refetch: fetchAnimals
  };
}

export function useAnimal(id: string) {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: supabaseError } = await supabase
          .from('animals')
          .select(`
            *,
            breeds!inner(
              id,
              name,
              type,
              characteristics,
              description,
              image_url,
              origin_country,
              average_weight_min,
              average_weight_max,
              average_lifespan_years,
              primary_uses,
              care_level
            ),
            facilities(
              id,
              name,
              facility_type,
              location
            ),
            sire:animals!animals_sire_id_fkey(
              id,
              name,
              registration_number
            ),
            dam:animals!animals_dam_id_fkey(
              id,
              name,
              registration_number
            )
          `)
          .eq('id', id)
          .eq('is_active', true)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        if (data) {
          const adaptedAnimal = adaptAnimalData(data);
          setAnimal(adaptedAnimal);
        }
      } catch (err) {
        console.error('Error fetching animal:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch animal');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  return {
    animal,
    loading,
    error
  };
}

export function useAvailableAnimals() {
  const [animals, setAnimals] = useState<AvailableAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableAnimals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('available_animals_view')
        .select('*')
        .order('name');

      if (supabaseError) {
        throw supabaseError;
      }

      setAnimals(data || []);
    } catch (err) {
      console.error('Error fetching available animals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch available animals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableAnimals();
  }, []);

  return {
    animals,
    loading,
    error,
    refetch: fetchAvailableAnimals
  };
}