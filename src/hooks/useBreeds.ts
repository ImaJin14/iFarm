import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Breed = Database['public']['Tables']['breeds']['Row'];

export interface UseBreeds {
  breeds: Breed[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBreeds(): UseBreeds {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBreeds = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('breeds')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (supabaseError) {
        throw supabaseError;
      }

      setBreeds(data || []);
    } catch (err) {
      console.error('Error fetching breeds:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch breeds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreeds();
  }, []);

  return {
    breeds,
    loading,
    error,
    refetch: fetchBreeds
  };
}

export function useBreed(id: string) {
  const [breed, setBreed] = useState<Breed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreed = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: supabaseError } = await supabase
          .from('breeds')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        setBreed(data);
      } catch (err) {
        console.error('Error fetching breed:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch breed');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBreed();
    }
  }, [id]);

  return {
    breed,
    loading,
    error
  };
}