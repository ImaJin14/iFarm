import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type EducationGuide = Database['public']['Tables']['education_guides']['Row'];

export interface UseEducationGuides {
  guides: EducationGuide[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEducationGuides(): UseEducationGuides {
  const [guides, setGuides] = useState<EducationGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('education_guides')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setGuides(data || []);
    } catch (err) {
      console.error('Error fetching education guides:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch education guides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  return {
    guides,
    loading,
    error,
    refetch: fetchGuides
  };
}

export function useEducationGuide(id: string) {
  const [guide, setGuide] = useState<EducationGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: supabaseError } = await supabase
          .from('education_guides')
          .select('*')
          .eq('id', id)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        setGuide(data);
      } catch (err) {
        console.error('Error fetching education guide:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch education guide');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGuide();
    }
  }, [id]);

  return {
    guide,
    loading,
    error
  };
}