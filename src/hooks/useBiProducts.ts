// src/hooks/useBiProducts.ts - Fixed for bi_products table
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface BiProduct {
  id: string;
  name: string;
  description: string;
  type: 'manure' | 'urine' | 'bedding' | 'compost' | 'other';
  image_url: string;
  price: number;
  unit: string;
  benefits: string[];
  availability: 'in-stock' | 'seasonal' | 'pre-order' | 'discontinued';
  is_active: boolean;
  created_at: string;
}

export function useBiProducts() {
  const [biProducts, setBiProducts] = useState<BiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBiProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bi_products')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setBiProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bi-products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBiProducts();
  }, []);

  return { biProducts, loading, error, refetch: fetchBiProducts };
}