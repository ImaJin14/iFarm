import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type BreedingRecord = Database['public']['Tables']['breeding_records']['Row'];

export interface UseBreedingRecords {
  breedingRecords: BreedingRecord[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBreedingRecords(): UseBreedingRecords {
  const [breedingRecords, setBreedingRecords] = useState<BreedingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBreedingRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('breeding_records')
        .select('*')
        .order('breeding_date', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setBreedingRecords(data || []);
    } catch (err) {
      console.error('Error fetching breeding records:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch breeding records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreedingRecords();
  }, []);

  return {
    breedingRecords,
    loading,
    error,
    refetch: fetchBreedingRecords
  };
}