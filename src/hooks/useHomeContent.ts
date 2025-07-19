import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type HomeContent = Database['public']['Tables']['home_content']['Row'];

export interface UseHomeContent {
  homeContent: HomeContent | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useHomeContent(): UseHomeContent {
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('home_content')
        .select('*')
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      setHomeContent(data);
    } catch (err) {
      console.error('Error fetching home content:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch home content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeContent();
  }, []);

  return {
    homeContent,
    loading,
    error,
    refetch: fetchHomeContent
  };
}