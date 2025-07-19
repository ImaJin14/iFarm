// src/hooks/useNews.ts - Updated to use content_items table
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  image_url: string;
  published_date: string;
  view_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  // Legacy compatibility
  date: string;
}

export function useNews() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_items')
        .select(`
          id,
          title,
          excerpt,
          content,
          category,
          tags,
          published_date,
          view_count,
          is_featured,
          created_at,
          updated_at,
          media_assets!inner(original_url)
        `)
        .eq('content_type', 'news')
        .eq('is_published', true)
        .order('published_date', { ascending: false });

      if (error) throw error;

      // Transform data to match legacy interface
      const transformedData = (data || []).map(item => ({
        ...item,
        image_url: item.media_assets?.original_url || '',
        date: item.published_date || item.created_at,
        excerpt: item.excerpt || ''
      }));

      setNewsItems(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return { newsItems, loading, error, refetch: fetchNews };
}