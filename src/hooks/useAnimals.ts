import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Animal = Database['public']['Tables']['animals']['Row'];

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
        .select('*')
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
          .select('*')
          .eq('id', id)
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
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableAnimals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('animals')
        .select('*')
        .eq('status', 'available')
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