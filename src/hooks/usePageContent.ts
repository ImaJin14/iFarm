// src/hooks/usePageContent.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface PageContent {
  id: string;
  page_type: 'home' | 'about' | 'contact' | 'products' | 'education' | 'news' | 'services';
  content_data: any;
  meta_title?: string;
  meta_description?: string;
  featured_image_id?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: string;
  // Joined data
  media_assets?: {
    original_url: string;
    alt_text?: string;
  };
}

export function usePageContent(pageType: string) {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPageContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_content')
        .select(`
          *,
          media_assets(original_url, alt_text)
        `)
        .eq('page_type', pageType)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      setPageContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch page content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageContent();
  }, [pageType]);

  return { pageContent, loading, error, refetch: fetchPageContent };
}