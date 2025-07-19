
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
      
      let { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_type', 'home')
        .eq('is_published', true)
        .single();

      if (error || !data?.content_data) {
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

        if (error?.code === 'PGRST116') {
          await supabase
            .from('page_content')
            .insert([{
              page_type: 'home',
              content_data: defaultContent,
              is_published: true
            }]);
        }

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
      setError(err instanceof Error ? err.message : 'Failed to fetch home content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeContent();
  }, []);

  return { homeContent, loading, error, refetch: fetchHomeContent };
}