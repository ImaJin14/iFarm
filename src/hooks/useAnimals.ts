import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Animal = Database['public']['Tables']['animals']['Row'] & {
  breeds?: Database['public']['Tables']['breeds']['Row'];
  facilities?: Database['public']['Tables']['facilities']['Row'];
  age_months?: number;
};

type AvailableAnimal = Database['public']['Views']['available_animals_view']['Row'];

export interface UseAnimals {
  animals: Animal[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

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
          breeds(name, type, characteristics),
          facilities(name)
        `)
        .eq('is_active', true)
        .order('name');

      if (supabaseError) {
        throw supabaseError;
      }

      // Calculate age for each animal
      const animalsWithAge = (data || []).map(animal => ({
        ...animal,
        age_months: animal.date_of_birth 
          ? Math.floor((new Date().getTime() - new Date(animal.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
          : null
      }));

      setAnimals(animalsWithAge);
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
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: supabaseError } = await supabase
          .from('animals')
          .select(`
            *,
            breeds(name, type, characteristics, description),
            facilities(name),
            sire:animals!animals_sire_id_fkey(name),
            dam:animals!animals_dam_id_fkey(name)
          `)
          .eq('id', id)
          .eq('is_active', true)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        // Calculate age
        const animalWithAge = {
          ...data,
          age_months: data.date_of_birth 
            ? Math.floor((new Date().getTime() - new Date(data.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
            : null
        };

        setAnimal(animalWithAge);
      } catch (err) {
        console.error('Error fetching animal:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch animal');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnimal();
    }
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