import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type ContactContent = Database['public']['Tables']['contact_content']['Row'];

export interface UseContactContent {
  contactContent: ContactContent | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useContactContent(): UseContactContent {
  const [contactContent, setContactContent] = useState<ContactContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContactContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('contact_content')
        .select('*')
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      setContactContent(data);
    } catch (err) {
      console.error('Error fetching contact content:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch contact content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactContent();
  }, []);

  return {
    contactContent,
    loading,
    error,
    refetch: fetchContactContent
  };
}