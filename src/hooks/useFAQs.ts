import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type FAQ = Database['public']['Tables']['faqs']['Row'];

export interface UseFAQs {
  faqs: FAQ[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFAQs(): UseFAQs {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('faqs')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setFaqs(data || []);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  return {
    faqs,
    loading,
    error,
    refetch: fetchFaqs
  };
}