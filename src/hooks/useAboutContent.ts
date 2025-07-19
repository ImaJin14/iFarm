import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type AboutContent = Database['public']['Tables']['about_content']['Row'];

export interface UseAboutContent {
  aboutContent: AboutContent | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAboutContent(): UseAboutContent {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('about_content')
        .select('*')
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      setAboutContent(data);
    } catch (err) {
      console.error('Error fetching about content:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch about content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutContent();
  }, []);

  return {
    aboutContent,
    loading,
    error,
    refetch: fetchAboutContent
  };
}