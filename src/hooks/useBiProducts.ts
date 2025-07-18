import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type BiProduct = Database['public']['Tables']['bi_products']['Row'];

export interface UseBiProducts {
  biProducts: BiProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBiProducts(): UseBiProducts {
  const [biProducts, setBiProducts] = useState<BiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBiProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('bi_products')
        .select('*')
        .order('name');

      if (supabaseError) {
        throw supabaseError;
      }

      setBiProducts(data || []);
    } catch (err) {
      console.error('Error fetching bi-products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bi-products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBiProducts();
  }, []);

  return {
    biProducts,
    loading,
    error,
    refetch: fetchBiProducts
  };
}