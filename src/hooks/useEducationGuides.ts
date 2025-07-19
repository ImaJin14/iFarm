// src/hooks/useEducationGuides.ts - Updated to use content_items table
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface EducationGuide {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  read_time: string;
  rating: number;
  description: string;
  content: string;
  image_url: string;
  tags: string[];
  is_featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export function useEducationGuides() {
  const [guides, setGuides] = useState<EducationGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_items')
        .select(`
          id,
          title,
          category,
          difficulty,
          read_time,
          rating,
          excerpt,
          content,
          tags,
          is_featured,
          view_count,
          created_at,
          updated_at,
          media_assets!inner(original_url)
        `)
        .eq('content_type', 'guide')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match expected interface
      const transformedData = (data || []).map(item => ({
        ...item,
        description: item.excerpt || '',
        image_url: item.media_assets?.original_url || '',
        difficulty: item.difficulty || 'Beginner',
        read_time: item.read_time || '5 min',
        rating: item.rating || 4.5
      }));

      setGuides(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch education guides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  return { guides, loading, error, refetch: fetchGuides };
}