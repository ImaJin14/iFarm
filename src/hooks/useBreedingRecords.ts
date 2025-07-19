import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type BreedingRecord = Database['public']['Tables']['breeding_records']['Row'] & {
  sire?: { name: string };
  dam?: { name: string };
  animal_type?: string;
  expected_birth?: string;
};

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
        .select(`
          *,
          sire:animals!breeding_records_sire_id_fkey(name, breeds(type)),
          dam:animals!breeding_records_dam_id_fkey(name)
        `)
        .order('breeding_date', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      // Transform data to match expected format
      const transformedData = (data || []).map(record => ({
        ...record,
        animal_type: (record as any).sire?.breeds?.type || 'rabbit',
        expected_birth: record.expected_birth_date
      }));

      setBreedingRecords(transformedData);
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