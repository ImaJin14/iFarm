// src/hooks/useAboutContent.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface AboutContent {
  id: string;
  hero_intro_text: string;
  mission_statement: string;
  history_intro_text: string;
  certifications_intro_text: string;
  gallery_intro_text: string;
  values_list: any;
  history_milestones: any;
  certifications_awards: any;
  gallery_images: string[];
  created_at: string;
  updated_at: string;
}

export function useAboutContent() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      
      // Try to get from page_content first
      let { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_type', 'about')
        .eq('is_published', true)
        .single();

      // If not found or no content_data, create default content
      if (error || !data?.content_data) {
        const defaultContent = {
          hero_intro_text: "Welcome to iFarm, where we've been dedicated to sustainable livestock breeding and farming practices for over a decade. Our commitment to animal welfare, environmental responsibility, and community education drives everything we do.",
          mission_statement: "Our mission is to provide high-quality, ethically raised livestock while promoting sustainable farming practices and educating our community about responsible animal husbandry.",
          history_intro_text: "Our journey began with a simple vision: to create a farm that prioritizes animal welfare and environmental sustainability.",
          certifications_intro_text: "We're proud to hold certifications that demonstrate our commitment to quality and ethical practices.",
          gallery_intro_text: "Take a visual tour of our farm and meet some of our wonderful animals.",
          values_list: [
            { title: "Animal Welfare", description: "The health and happiness of our animals is our top priority.", icon: "Heart" },
            { title: "Sustainability", description: "We use eco-friendly practices to protect our environment.", icon: "Leaf" },
            { title: "Quality", description: "We maintain the highest standards in breeding and care.", icon: "Award" }
          ],
          history_milestones: [
            { year: "2015", title: "Farm Founded", icon: "Calendar" },
            { year: "2018", title: "Organic Certification", icon: "Award" },
            { year: "2021", title: "Expanded Facilities", icon: "Building" },
            { year: "2024", title: "Community Education Program", icon: "Users" }
          ],
          certifications_awards: [
            { title: "Organic Certified", description: "USDA Organic certification for our farming practices", color: "green" },
            { title: "Animal Welfare Approved", description: "High welfare standards certification", color: "blue" }
          ],
          gallery_images: [
            "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800",
            "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
            "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800"
          ]
        };

        // Create the content if it doesn't exist
        if (error?.code === 'PGRST116') { // Not found
          await supabase
            .from('page_content')
            .insert([{
              page_type: 'about',
              content_data: defaultContent,
              is_published: true
            }]);
        }

        setAboutContent({ 
          id: 'default', 
          ...defaultContent,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } else {
        setAboutContent({
          id: data.id,
          ...data.content_data,
          created_at: data.created_at,
          updated_at: data.updated_at
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch about content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutContent();
  }, []);

  return { aboutContent, loading, error, refetch: fetchAboutContent };
}