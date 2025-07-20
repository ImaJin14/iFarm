import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type ContentItem = Database['public']['Tables']['content_items']['Row'];
type ContentItemInsert = Database['public']['Tables']['content_items']['Insert'];
type ContentItemUpdate = Database['public']['Tables']['content_items']['Update'];

interface EducationGuideWithDetails extends ContentItem {
  author?: {
    full_name: string;
    email: string;
  };
  featured_image?: {
    original_url: string;
    alt_text: string;
  };
}

interface GuideFilters {
  category?: string;
  difficulty?: Database['public']['Enums']['guide_difficulty'];
  is_featured?: boolean;
  tags?: string[];
}

export function useEducationGuides(filters?: GuideFilters) {
  const [guides, setGuides] = useState<EducationGuideWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('content_items')
        .select(`
          *,
          users:author_id(
            full_name,
            email
          ),
          media_assets:featured_image_id(
            original_url,
            alt_text
          )
        `)
        .eq('content_type', 'guide')
        .eq('is_published', true)
        .order('published_date', { ascending: false });

      // Apply filters
      if (filters) {
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        if (filters.difficulty) {
          query = query.eq('difficulty', filters.difficulty);
        }
        if (filters.is_featured !== undefined) {
          query = query.eq('is_featured', filters.is_featured);
        }
        if (filters.tags && filters.tags.length > 0) {
          query = query.overlaps('tags', filters.tags);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setGuides(data || []);
    } catch (err) {
      console.error('Error fetching education guides:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch education guides');
    } finally {
      setLoading(false);
    }
  };

  const createGuide = async (guideData: ContentItemInsert) => {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .insert([{ ...guideData, content_type: 'guide' }])
        .select()
        .single();

      if (error) throw error;
      await fetchGuides();
      return data;
    } catch (err) {
      console.error('Error creating guide:', err);
      throw err;
    }
  };

  const updateGuide = async (id: string, updates: ContentItemUpdate) => {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchGuides();
      return data;
    } catch (err) {
      console.error('Error updating guide:', err);
      throw err;
    }
  };

  const deleteGuide = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchGuides();
    } catch (err) {
      console.error('Error deleting guide:', err);
      throw err;
    }
  };

  const incrementViewCount = async (id: string) => {
    try {
      const { error } = await supabase.rpc('increment_view_count', {
        content_id: id
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }
  };

  const getFeaturedGuides = () => {
    return guides.filter(guide => guide.is_featured);
  };

  const getGuidesByCategory = (category: string) => {
    return guides.filter(guide => guide.category === category);
  };

  const getGuidesByDifficulty = (difficulty: Database['public']['Enums']['guide_difficulty']) => {
    return guides.filter(guide => guide.difficulty === difficulty);
  };

  const searchGuides = (searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return guides.filter(guide =>
      guide.title.toLowerCase().includes(term) ||
      guide.excerpt?.toLowerCase().includes(term) ||
      guide.content.toLowerCase().includes(term) ||
      guide.tags?.some(tag => tag.toLowerCase().includes(term))
    );
  };

  const getGuideStats = () => {
    const total = guides.length;
    const featured = guides.filter(g => g.is_featured).length;
    const totalViews = guides.reduce((sum, g) => sum + (g.view_count || 0), 0);
    
    const categoryBreakdown = guides.reduce((acc, guide) => {
      const category = guide.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const difficultyBreakdown = guides.reduce((acc, guide) => {
      const difficulty = guide.difficulty || 'Beginner';
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      featured,
      totalViews,
      avgViews: total > 0 ? totalViews / total : 0,
      categoryBreakdown,
      difficultyBreakdown
    };
  };

  const getPopularGuides = (limit: number = 10) => {
    return [...guides]
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, limit);
  };

  const getRecentGuides = (limit: number = 5) => {
    return [...guides]
      .sort((a, b) => new Date(b.published_date || '').getTime() - new Date(a.published_date || '').getTime())
      .slice(0, limit);
  };

  useEffect(() => {
    fetchGuides();
  }, [filters]);

  return {
    guides,
    loading,
    error,
    createGuide,
    updateGuide,
    deleteGuide,
    incrementViewCount,
    refetch: fetchGuides,
    getFeaturedGuides,
    getGuidesByCategory,
    getGuidesByDifficulty,
    searchGuides,
    getGuideStats,
    getPopularGuides,
    getRecentGuides
  };
}

// Individual education guide hook for detail pages
export const useEducationGuide = (guideId: string) => {
  const [guide, setGuide] = useState<EducationGuideWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuide = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('content_items')
        .select(`
          *,
          users:author_id(
            full_name,
            email
          ),
          media_assets:featured_image_id(
            original_url,
            alt_text
          )
        `)
        .eq('id', guideId)
        .eq('content_type', 'guide')
        .eq('is_published', true)
        .single();

      if (error) throw error;
      setGuide(data);
    } catch (err) {
      console.error('Error fetching education guide:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch education guide');
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async () => {
    if (!guide) return;
    
    try {
      const { error } = await supabase
        .from('content_items')
        .update({ view_count: (guide.view_count || 0) + 1 })
        .eq('id', guide.id);

      if (error) throw error;
      
      // Update local state
      setGuide(prev => prev ? { ...prev, view_count: (prev.view_count || 0) + 1 } : null);
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }
  };

  const getRelatedGuides = async (limit: number = 3) => {
    if (!guide) return [];

    try {
      const { data, error } = await supabase
        .from('content_items')
        .select(`
          id,
          title,
          excerpt,
          difficulty,
          read_time,
          view_count,
          published_date,
          featured_image_id,
          media_assets:featured_image_id(
            original_url,
            alt_text
          )
        `)
        .eq('content_type', 'guide')
        .eq('is_published', true)
        .neq('id', guide.id)
        .or(`category.eq.${guide.category},difficulty.eq.${guide.difficulty}`)
        .order('view_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching related guides:', err);
      return [];
    }
  };

  useEffect(() => {
    if (guideId) {
      fetchGuide();
    }
  }, [guideId]);

  return {
    guide,
    loading,
    error,
    refetch: fetchGuide,
    incrementViewCount,
    getRelatedGuides
  };
};