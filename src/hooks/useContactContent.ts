import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database, PageContent } from '../lib/supabase';

// Interface for contact content structure
export interface ContactContent {
  hero_title: string;
  hero_description: string;
  contact_description: string;
  address: string;
  phone: string;
  email: string;
  business_hours: Array<{
    day: string;
    hours: string;
  }>;
  social_links: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
  map_description: string;
  newsletter_title: string;
  newsletter_description: string;
  newsletter_privacy_text: string;
}

export interface UseContactContent {
  contactContent: ContactContent | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useContactContent(): UseContactContent {
  const [contactContent, setContactContent] = useState<ContactContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContactContent = async () => {
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
        .eq('page_type', 'contact')
        .eq('is_published', true)
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      // Transform JSONB content_data to ContactContent interface
      const contentData = data.content_data as any;
      const transformedData: ContactContent = {
        hero_title: contentData.hero_title || 'Get In Touch',
        hero_description: contentData.hero_description || 'We\'d love to hear from you. Whether you\'re interested in our animals, have questions about care, or want to schedule a farm visit, we\'re here to help.',
        contact_description: contentData.contact_description || 'Our team is available to answer your questions and help you find the perfect animal for your needs. We believe in building lasting relationships with our customers.',
        address: contentData.address || '123 Farm Road, Rural Valley, ST 12345',
        phone: contentData.phone || '(555) 123-4567',
        email: contentData.email || 'info@ifarm.com',
        business_hours: contentData.business_hours || [
          { day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM' },
          { day: 'Saturday', hours: '9:00 AM - 4:00 PM' },
          { day: 'Sunday', hours: 'By Appointment Only' }
        ],
        social_links: contentData.social_links || [
          { platform: 'Facebook', url: 'https://facebook.com/ifarm', icon: 'Facebook' },
          { platform: 'Instagram', url: 'https://instagram.com/ifarm', icon: 'Instagram' },
          { platform: 'Twitter', url: 'https://twitter.com/ifarm', icon: 'Twitter' }
        ],
        map_description: contentData.map_description || 'Visit our farm to see our facilities and meet our animals in person. We welcome scheduled visits and tours.',
        newsletter_title: contentData.newsletter_title || 'Stay Connected',
        newsletter_description: contentData.newsletter_description || 'Subscribe to our newsletter for updates on new animals, breeding programs, and educational content.',
        newsletter_privacy_text: contentData.newsletter_privacy_text || 'We respect your privacy and will never share your information.'
      };

      setContactContent(transformedData);
    } catch (err) {
      console.error('Error fetching contact content:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch contact content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactContent();
  }, []);

  return {
    contactContent,
    loading,
    error,
    refetch: fetchContactContent
  };
}