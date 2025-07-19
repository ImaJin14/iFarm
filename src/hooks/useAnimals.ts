import { useState, useEffect } from 'react';
import { supabase, calculateAge } from '../lib/supabase';
import type { Database, Animal, AnimalWithBreed } from '../lib/supabase';

type AvailableAnimal = Database['public']['Views']['available_animals_view']['Row'];

export interface UseAnimals {
  animals: AnimalWithBreed[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAnimals(): UseAnimals {
  const [animals, setAnimals] = useState<AnimalWithBreed[]>([]);
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
          breeds (
            id,
            name,
            type,
            description,
            characteristics,
            average_weight_min,
            average_weight_max,
            price_range_min,
            price_range_max,
            primary_uses,
            image_url
          ),
          facilities (
            id,
            name,
            facility_type
          )
        `)
        .eq('is_active', true)
        .order('name');

      if (supabaseError) {
        throw supabaseError;
      }

      setAnimals(data || []);
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
  const [animal, setAnimal] = useState<AnimalWithBreed | null>(null);
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
            breeds (
              id,
              name,
              type,
              description,
              characteristics,
              average_weight_min,
              average_weight_max,
              price_range_min,
              price_range_max,
              primary_uses,
              image_url
            ),
            facilities (
              id,
              name,
              facility_type
            )
          `)
          .eq('id', id)
          .eq('is_active', true)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        setAnimal(data);
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
      
      // Use the available_animals_view which already includes breed info and calculated age
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