import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database, ContentItem } from '../lib/supabase';

// Extended type for education guides with image URL resolved
export interface EducationGuide extends ContentItem {
  image_url?: string;
}

export interface UseEducationGuides {
  guides: EducationGuide[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEducationGuides(): UseEducationGuides {
  const [guides, setGuides] = useState<EducationGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuides = async () => {
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
        .eq('content_type', 'guide')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      // Transform data to match expected interface
      const transformedData: EducationGuide[] = (data || []).map(item => ({
        ...item,
        image_url: item.media_assets?.original_url || 'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=800'
      }));

      setGuides(transformedData);
    } catch (err) {
      console.error('Error fetching education guides:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch education guides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  return {
    guides,
    loading,
    error,
    refetch: fetchGuides
  };
}

export function useEducationGuide(id: string) {
  const [guide, setGuide] = useState<EducationGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuide = async () => {
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
          .eq('content_type', 'guide')
          .eq('is_published', true)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        // Transform data to match expected interface
        const transformedData: EducationGuide = {
          ...data,
          image_url: data.media_assets?.original_url || 'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=800'
        };

        setGuide(transformedData);
      } catch (err) {
        console.error('Error fetching education guide:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch education guide');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGuide();
    }
  }, [id]);

  return {
    guide,
    loading,
    error
  };
}