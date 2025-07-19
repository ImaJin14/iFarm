// src/hooks/useContactContent.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ContactContent {
  id: string;
  hero_title: string;
  hero_description: string;
  contact_description: string;
  address: string;
  phone: string;
  email: string;
  business_hours: any;
  social_links: any;
  map_description: string;
  newsletter_title: string;
  newsletter_description: string;
  newsletter_privacy_text: string;
  created_at: string;
  updated_at: string;
}

export function useContactContent() {
  const [contactContent, setContactContent] = useState<ContactContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContactContent = async () => {
    try {
      setLoading(true);
      
      let { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_type', 'contact')
        .eq('is_published', true)
        .single();

      if (error || !data?.content_data) {
        const defaultContent = {
          hero_title: "Get In Touch",
          hero_description: "We'd love to hear from you! Whether you're interested in our animals, have questions about our farming practices, or want to schedule a visit, don't hesitate to reach out.",
          contact_description: "Our team is here to help you find the perfect addition to your family or farm.",
          address: "123 Farm Road, Rural Valley, ST 12345",
          phone: "(555) 123-4567",
          email: "info@ifarm.com",
          business_hours: [
            { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
            { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
            { day: "Sunday", hours: "Closed" }
          ],
          social_links: [
            { platform: "Facebook", url: "https://facebook.com/ifarm", icon: "Facebook" },
            { platform: "Instagram", url: "https://instagram.com/ifarm", icon: "Instagram" }
          ],
          map_description: "Visit our farm located in the beautiful Rural Valley. We're easily accessible from the main highway.",
          newsletter_title: "Stay Connected",
          newsletter_description: "Subscribe to our newsletter for updates on available animals, farm news, and educational content.",
          newsletter_privacy_text: "We respect your privacy and will never share your information."
        };

        if (error?.code === 'PGRST116') {
          await supabase
            .from('page_content')
            .insert([{
              page_type: 'contact',
              content_data: defaultContent,
              is_published: true
            }]);
        }

        setContactContent({ 
          id: 'default', 
          ...defaultContent,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } else {
        setContactContent({
          id: data.id,
          ...data.content_data,
          created_at: data.created_at,
          updated_at: data.updated_at
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contact content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactContent();
  }, []);

  return { contactContent, loading, error, refetch: fetchContactContent };
}