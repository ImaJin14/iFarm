// src/hooks/useHomeContent.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface HomeContent {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_image_url: string;
  hero_badge_text: string;
  hero_features: any;
  featured_section_title: string;
  featured_section_description: string;
  news_section_title: string;
  news_section_description: string;
  cta_buttons: any;
  stats: any;
  created_at: string;
  updated_at: string;
}

export function useHomeContent() {
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_type', 'home')
        .eq('is_published', true)
        .maybeSingle(); // Changed from .single() to .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching home content:', error);
        throw error;
      }

      if (!data || !data?.content_data) {
        console.log('No home content found, creating default content...');
        
        const defaultContent = {
          hero_title: "Premium Livestock",
          hero_subtitle: "Breeding Farm",
          hero_description: "Discover our carefully bred and well-cared-for animals, raised with love and dedication in a sustainable farming environment.",
          hero_image_url: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800",
          hero_badge_text: "15+ Years Experience",
          hero_features: [
            { title: "Quality Breeding", icon: "Award" },
            { title: "Animal Welfare", icon: "Heart" },
            { title: "Sustainable Practices", icon: "Leaf" }
          ],
          featured_section_title: "Our Featured Animals",
          featured_section_description: "Carefully selected breeds across rabbits, guinea pigs, dogs, cats, and fowls, each known for their exceptional qualities, health, and temperament.",
          news_section_title: "Latest News & Updates",
          news_section_description: "Stay informed about our latest breeding programs, farm updates, and educational content.",
          cta_buttons: [
            { text: "View Our Animals", link: "/products", type: "primary" },
            { text: "Contact Us", link: "/contact", type: "secondary" }
          ],
          stats: [
            { label: "Years Experience", value: "15+", icon: "Calendar" },
            { label: "Happy Families", value: "500+", icon: "Users" },
            { label: "Animals Bred", value: "1000+", icon: "Heart" }
          ]
        };

        // Try to create default content in database
        try {
          const { data: insertData, error: insertError } = await supabase
            .from('page_content')
            .insert([{
              page_type: 'home',
              content_data: defaultContent,
              is_published: true
            }])
            .select()
            .maybeSingle();

          if (insertError) {
            console.warn('Could not insert default content:', insertError);
          } else if (insertData) {
            setHomeContent({ 
              id: insertData.id, 
              ...defaultContent,
              created_at: insertData.created_at,
              updated_at: insertData.updated_at
            });
            return;
          }
        } catch (insertErr) {
          console.warn('Failed to insert default content:', insertErr);
        }

        // Use default content if database insert fails
        setHomeContent({ 
          id: 'default', 
          ...defaultContent,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } else {
        setHomeContent({
          id: data.id,
          ...data.content_data,
          created_at: data.created_at,
          updated_at: data.updated_at
        });
      }
    } catch (err) {
      console.error('Error in fetchHomeContent:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch home content');
      
      // Fallback to default content on error
      const defaultContent = {
        hero_title: "Premium Livestock",
        hero_subtitle: "Breeding Farm",
        hero_description: "Discover our carefully bred and well-cared-for animals, raised with love and dedication in a sustainable farming environment.",
        hero_image_url: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800",
        hero_badge_text: "15+ Years Experience",
        hero_features: [
          { title: "Quality Breeding", icon: "Award" },
          { title: "Animal Welfare", icon: "Heart" },
          { title: "Sustainable Practices", icon: "Leaf" }
        ],
        featured_section_title: "Our Featured Animals",
        featured_section_description: "Carefully selected breeds across rabbits, guinea pigs, dogs, cats, and fowls, each known for their exceptional qualities, health, and temperament.",
        news_section_title: "Latest News & Updates",
        news_section_description: "Stay informed about our latest breeding programs, farm updates, and educational content.",
        cta_buttons: [
          { text: "View Our Animals", link: "/products", type: "primary" },
          { text: "Contact Us", link: "/contact", type: "secondary" }
        ],
        stats: [
          { label: "Years Experience", value: "15+", icon: "Calendar" },
          { label: "Happy Families", value: "500+", icon: "Users" },
          { label: "Animals Bred", value: "1000+", icon: "Heart" }
        ]
      };

      setHomeContent({ 
        id: 'fallback', 
        ...defaultContent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeContent();
  }, []);

  return { homeContent, loading, error, refetch: fetchHomeContent };
}