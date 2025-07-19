import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database, BreedingRecord } from '../lib/supabase';

// Extended type with animal names
export interface BreedingRecordWithAnimals extends BreedingRecord {
  sire_name?: string;
  dam_name?: string;
  animal_type?: string;
}

export interface UseBreedingRecords {
  breedingRecords: BreedingRecordWithAnimals[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBreedingRecords(): UseBreedingRecords {
  const [breedingRecords, setBreedingRecords] = useState<BreedingRecordWithAnimals[]>([]);
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
          sire:animals!sire_id (
            name,
            breeds (
              type
            )
          ),
          dam:animals!dam_id (
            name
          )
        `)
        .order('breeding_date', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      // Transform data to include animal names and type
      const transformedData: BreedingRecordWithAnimals[] = (data || []).map(record => ({
        ...record,
        sire_name: record.sire?.name || 'Unknown',
        dam_name: record.dam?.name || 'Unknown',
        animal_type: record.sire?.breeds?.type || 'unknown'
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