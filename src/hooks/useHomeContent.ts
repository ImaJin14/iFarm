import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database, PageContent } from '../lib/supabase';

// Interface for home content structure
export interface HomeContent {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_image_url: string;
  hero_badge_text: string;
  hero_features: Array<{
    title: string;
    icon: string;
  }>;
  featured_section_title: string;
  featured_section_description: string;
  news_section_title: string;
  news_section_description: string;
  cta_buttons: Array<{
    text: string;
    link: string;
    type: 'primary' | 'secondary';
  }>;
  stats: Array<{
    label: string;
    value: string;
    icon: string;
  }>;
}

export interface UseHomeContent {
  homeContent: HomeContent | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useHomeContent(): UseHomeContent {
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('page_content')
        .select(`
          *,
          media_assets (
            original_url
          )
        `)
        .eq('page_type', 'home')
        .eq('is_published', true)
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      // Transform JSONB content_data to HomeContent interface
      const contentData = data.content_data as any;
      const transformedData: HomeContent = {
        hero_title: contentData.hero_title || 'Premium Livestock',
        hero_subtitle: contentData.hero_subtitle || 'Breeding Farm',
        hero_description: contentData.hero_description || 'Dedicated to sustainable farming practices and breeding excellence across rabbits, guinea pigs, dogs, cats, and fowls.',
        hero_image_url: data.media_assets?.original_url || contentData.hero_image_url || 'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=800',
        hero_badge_text: contentData.hero_badge_text || '15+ Years Experience',
        hero_features: contentData.hero_features || [
          { title: 'Quality Breeding', icon: 'Award' },
          { title: 'Health Focused', icon: 'Heart' },
          { title: 'Sustainable Practices', icon: 'Leaf' }
        ],
        featured_section_title: contentData.featured_section_title || 'Our Featured Animals',
        featured_section_description: contentData.featured_section_description || 'Carefully selected breeds across rabbits, guinea pigs, dogs, cats, and fowls, each known for their exceptional qualities, health, and temperament.',
        news_section_title: contentData.news_section_title || 'Latest News & Updates',
        news_section_description: contentData.news_section_description || 'Stay informed about our latest breeding programs, farm updates, and educational content.',
        cta_buttons: contentData.cta_buttons || [
          { text: 'View Our Animals', link: '/products', type: 'primary' },
          { text: 'Contact Us', link: '/contact', type: 'secondary' }
        ],
        stats: contentData.stats || [
          { label: 'Years Experience', value: '15+', icon: 'Award' },
          { label: 'Happy Customers', value: '500+', icon: 'Users' },
          { label: 'Animals Bred', value: '1000+', icon: 'Heart' }
        ]
      };

      setHomeContent(transformedData);
    } catch (err) {
      console.error('Error fetching home content:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch home content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeContent();
  }, []);

  return {
    homeContent,
    loading,
    error,
    refetch: fetchHomeContent
  };
}