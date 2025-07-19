import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database, ContentItem } from '../lib/supabase';

// Extended type for news items with image URL resolved
export interface NewsItem extends ContentItem {
  image_url?: string;
  date: string; // Map published_date to date for compatibility
}

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
        .from('content_items')
        .select(`
          *,
          media_assets (
            original_url
          )
        `)
        .eq('content_type', 'news')
        .eq('is_published', true)
        .order('published_date', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      // Transform data to match expected interface
      const transformedData: NewsItem[] = (data || []).map(item => ({
        ...item,
        image_url: item.media_assets?.original_url || 'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=800',
        date: item.published_date || item.created_at || new Date().toISOString()
      }));

      setNewsItems(transformedData);
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
          .from('content_items')
          .select(`
            *,
            media_assets (
              original_url
            )
          `)
          .eq('id', id)
          .eq('content_type', 'news')
          .eq('is_published', true)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        // Transform data to match expected interface
        const transformedData: NewsItem = {
          ...data,
          image_url: data.media_assets?.original_url || 'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=800',
          date: data.published_date || data.created_at || new Date().toISOString()
        };

        setNewsItem(transformedData);
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