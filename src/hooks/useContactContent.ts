import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

interface ContactContent {
  hero_title: string;
  hero_description: string;
  contact_description: string;
  address: string;
  phone: string;
  email: string;
  business_hours: Array<{ day: string; hours: string }>;
  social_links: Array<{ platform: string; url: string; icon: string }>;
  map_description: string;
  newsletter_title: string;
  newsletter_description: string;
  newsletter_privacy_text: string;
}

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
        .from('page_content')
        .select('*')
        .eq('page_type', 'contact')
        .eq('is_published', true)
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      // Extract content from JSONB data
      const contentData = data.content_data as any;
      setContactContent(contentData);
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