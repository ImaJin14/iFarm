import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type ContentItem = Database['public']['Tables']['content_items']['Row'] & {
  media_assets?: Database['public']['Tables']['media_assets']['Row'];
  image_url?: string;
  date?: string;
};

export interface UseNews {
  newsItems: ContentItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Helper function to adapt content item to news format
const adaptNewsData = (contentItem: any): ContentItem => ({
  ...contentItem,
  image_url: contentItem.media_assets?.original_url || 
           contentItem.featured_image_url || 
           'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=800',
  date: contentItem.published_date || contentItem.created_at
});

export function useNews(): UseNews {
  const [newsItems, setNewsItems] = useState<ContentItem[]>([]);
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
          media_assets!content_items_featured_image_id_fkey(
            id,
            original_url,
            thumbnail_url,
            alt_text
          )
        `)
        .eq('content_type', 'news')
        .eq('is_published', true)
        .order('published_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      // Transform data to match component expectations
      const adaptedNews = (data || []).map(adaptNewsData);
      setNewsItems(adaptedNews);
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
  const [newsItem, setNewsItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: supabaseError } = await supabase
          .from('content_items')
          .select(`
            *,
            media_assets!content_items_featured_image_id_fkey(
              id,
              original_url,
              thumbnail_url,
              alt_text,
              caption
            ),
            author:users!content_items_author_id_fkey(
              id,
              full_name,
              email
            )
          `)
          .eq('id', id)
          .eq('content_type', 'news')
          .eq('is_published', true)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        if (data) {
          const adaptedNews = adaptNewsData(data);
          setNewsItem(adaptedNews);
          
          // Update view count
          await supabase
            .from('content_items')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', id);
        }
      } catch (err) {
        console.error('Error fetching news item:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch news item');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [id]);

  return {
    newsItem,
    loading,
    error
  };
}