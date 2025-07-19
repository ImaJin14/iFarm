// src/hooks/useFAQs.ts - Updated to use faqs table
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export function useFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_published', true)
        .order('order_index');

      if (error) throw error;
      setFaqs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  return { faqs, loading, error, refetch: fetchFaqs };
}