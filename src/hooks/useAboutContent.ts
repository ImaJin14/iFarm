import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database, PageContent } from '../lib/supabase';

// Interface for about content structure
export interface AboutContent {
  hero_intro_text: string;
  mission_statement: string;
  history_intro_text: string;
  certifications_intro_text: string;
  gallery_intro_text: string;
  values_list: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  history_milestones: Array<{
    year: string;
    title: string;
    icon: string;
  }>;
  certifications_awards: Array<{
    title: string;
    description: string;
    color: string;
  }>;
  gallery_images: string[];
}

export interface UseAboutContent {
  aboutContent: AboutContent | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAboutContent(): UseAboutContent {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAboutContent = async () => {
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
        .eq('page_type', 'about')
        .eq('is_published', true)
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      // Transform JSONB content_data to AboutContent interface
      const contentData = data.content_data as any;
      const transformedData: AboutContent = {
        hero_intro_text: contentData.hero_intro_text || 'Welcome to iFarm, where passion meets expertise in multi-species livestock breeding. For over 15 years, we have been dedicated to raising healthy, happy animals while maintaining the highest standards of care and sustainability.',
        mission_statement: contentData.mission_statement || 'Our mission is to provide exceptional livestock through ethical breeding practices, comprehensive health care, and sustainable farming methods. We believe in creating lasting relationships with our animals and customers while contributing positively to our community and environment.',
        history_intro_text: contentData.history_intro_text || 'From humble beginnings to becoming a trusted name in livestock breeding, our journey has been marked by continuous learning, innovation, and unwavering commitment to excellence.',
        certifications_intro_text: contentData.certifications_intro_text || 'Our commitment to excellence is recognized through various certifications and awards that validate our dedication to quality, sustainability, and animal welfare.',
        gallery_intro_text: contentData.gallery_intro_text || 'Take a visual tour of our facilities, meet our animals, and see the care and attention that goes into every aspect of our operation.',
        values_list: contentData.values_list || [
          { title: 'Quality First', description: 'Every animal receives the highest standard of care', icon: 'Award' },
          { title: 'Sustainable Practices', description: 'Environmentally conscious farming methods', icon: 'Leaf' },
          { title: 'Health Focus', description: 'Comprehensive health monitoring and care', icon: 'Heart' },
          { title: 'Community Driven', description: 'Supporting local communities and education', icon: 'Users' }
        ],
        history_milestones: contentData.history_milestones || [
          { year: '2009', title: 'Farm Established', icon: 'Calendar' },
          { year: '2015', title: 'Expanded to Multiple Species', icon: 'Heart' },
          { year: '2020', title: 'Sustainability Certification', icon: 'Leaf' },
          { year: '2024', title: 'Digital Platform Launch', icon: 'Award' }
        ],
        certifications_awards: contentData.certifications_awards || [
          { title: 'Organic Certified', description: 'USDA Organic Certification', color: 'green' },
          { title: 'Animal Welfare', description: 'Certified Humane Standards', color: 'blue' },
          { title: 'Sustainability Award', description: 'State Environmental Excellence', color: 'yellow' },
          { title: 'Breeding Excellence', description: 'National Breeding Association', color: 'purple' }
        ],
        gallery_images: contentData.gallery_images || [
          'https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/4588066/pexels-photo-4588066.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/4588067/pexels-photo-4588067.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/4588068/pexels-photo-4588068.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/4588069/pexels-photo-4588069.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]
      };

      setAboutContent(transformedData);
    } catch (err) {
      console.error('Error fetching about content:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch about content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutContent();
  }, []);

  return {
    aboutContent,
    loading,
    error,
    refetch: fetchAboutContent
  };
}