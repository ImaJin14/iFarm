import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type FarmSettings = Database['public']['Tables']['farm_settings']['Row'];

export interface UseFarmSettings {
  farmSettings: FarmSettings | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateSettings: (settings: Partial<FarmSettings>) => Promise<void>;
}

export function useFarmSettings(): UseFarmSettings {
  const [farmSettings, setFarmSettings] = useState<FarmSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFarmSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('farm_settings')
        .select('*')
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      setFarmSettings(data);
    } catch (err) {
      console.error('Error fetching farm settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch farm settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (settings: Partial<FarmSettings>) => {
    try {
      setError(null);
      
      const { error: supabaseError } = await supabase
        .from('farm_settings')
        .update(settings)
        .eq('id', farmSettings?.id);

      if (supabaseError) {
        throw supabaseError;
      }

      // Refetch to get updated data
      await fetchFarmSettings();
    } catch (err) {
      console.error('Error updating farm settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update farm settings');
      throw err;
    }
  };

  useEffect(() => {
    fetchFarmSettings();
  }, []);

  return {
    farmSettings,
    loading,
    error,
    refetch: fetchFarmSettings,
    updateSettings
  };
}