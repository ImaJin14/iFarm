import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

interface AboutContent {
  hero_intro_text: string;
  mission_statement: string;
  history_intro_text: string;
  certifications_intro_text: string;
  gallery_intro_text: string;
  values_list: Array<{ title: string; description: string; icon: string }>;
  history_milestones: Array<{ year: string; title: string; icon: string }>;
  certifications_awards: Array<{ title: string; description: string; color: string }>;
  gallery_images: string[];
}

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
        .from('page_content')
        .select('*')
        .eq('page_type', 'about')
        .eq('is_published', true)
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      // Extract content from JSONB data
      const contentData = data.content_data as any;
      setAboutContent(contentData);
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