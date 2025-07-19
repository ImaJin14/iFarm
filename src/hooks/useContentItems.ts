// src/hooks/useContentItems.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ContentItem {
  id: string;
  content_type: 'news' | 'guide' | 'faq' | 'page' | 'blog';
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image_id?: string;
  author_id?: string;
  category?: string;
  tags: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  read_time?: string;
  rating?: number;
  metadata: any;
  view_count: number;
  is_featured: boolean;
  is_published: boolean;
  published_date?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  media_assets?: {
    original_url: string;
    alt_text?: string;
  };
  users?: {
    full_name?: string;
    email: string;
  };
}

export function useContentItems(contentType?: string) {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContentItems = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('content_items')
        .select(`
          *,
          media_assets(original_url, alt_text),
          users(full_name, email)
        `)
        .eq('is_published', true)
        .order('published_date', { ascending: false });

      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setContentItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContentItems();
  }, [contentType]);

  return { contentItems, loading, error, refetch: fetchContentItems };
}
