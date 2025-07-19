import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type PageContent = Database['public']['Tables']['page_content']['Row'];

interface HomeContent {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_image_url: string;
  hero_badge_text: string;
  hero_features: Array<{ title: string; icon: string }>;
  featured_section_title: string;
  featured_section_description: string;
  news_section_title: string;
  news_section_description: string;
  cta_buttons: Array<{ text: string; link: string; type: string }>;
  stats: Array<{ label: string; value: string; icon: string }>;
}

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
        .from('page_content')
        .select('*')
        .eq('page_type', 'home')
        .eq('is_published', true)
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      // Extract content from JSONB data
      const contentData = data.content_data as any;
      setHomeContent(contentData);
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