import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type NewsItem = Database['public']['Tables']['news_items']['Row'];

export interface UseNews {
  newsItems: NewsItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useNews(): UseNews {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('news_items')
        .select('*')
        .order('date', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setNewsItems(data || []);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    newsItems,
    loading,
    error,
    refetch: fetchNews
  };
}

export function useNewsItem(id: string) {
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: supabaseError } = await supabase
          .from('news_items')
          .select('*')
          .eq('id', id)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        setNewsItem(data);
      } catch (err) {
        console.error('Error fetching news item:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch news item');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNewsItem();
    }
  }, [id]);

  return {
    newsItem,
    loading,
    error
  };
}