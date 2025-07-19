import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type EducationGuide = Database['public']['Tables']['content_items']['Row'] & {
  media_assets?: Database['public']['Tables']['media_assets']['Row'];
  image_url?: string;
};

export interface UseEducationGuides {
  guides: EducationGuide[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Helper function to adapt content item to guide format
const adaptGuideData = (contentItem: any): EducationGuide => ({
  ...contentItem,
  image_url: contentItem.media_assets?.original_url || 
           contentItem.featured_image_url || 
           'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=800'
});

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
          media_assets!content_items_featured_image_id_fkey(
            id,
            original_url,
            thumbnail_url,
            alt_text
          )
        `)
        .eq('content_type', 'guide')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      // Transform data to match component expectations
      const adaptedGuides = (data || []).map(adaptGuideData);
      setGuides(adaptedGuides);
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
          .eq('content_type', 'guide')
          .eq('is_published', true)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        if (data) {
          const adaptedGuide = adaptGuideData(data);
          setGuide(adaptedGuide);
          
          // Update view count
          await supabase
            .from('content_items')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', id);
        }
      } catch (err) {
        console.error('Error fetching education guide:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch education guide');
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [id]);

  return {
    guide,
    loading,
    error
  };
}