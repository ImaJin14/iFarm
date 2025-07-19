import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type InventoryItem = Database['public']['Tables']['inventory_items']['Row'] & {
  suppliers?: Database['public']['Tables']['suppliers']['Row'];
  quantity?: number;
  low_stock_threshold?: number;
  cost?: number;
  supplier?: string;
  last_restocked?: string;
};

export interface UseInventory {
  inventory: InventoryItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useInventory(): UseInventory {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('inventory_items')
        .select(`
          *,
          suppliers(name)
        `)
        .eq('is_active', true)
        .order('name');

      if (supabaseError) {
        throw supabaseError;
      }

      // Transform data to match expected format
      const transformedData = (data || []).map(item => ({
        ...item,
        quantity: item.current_quantity || 0,
        cost: item.cost_per_unit || 0,
        supplier: (item as any).suppliers?.name || '',
        last_restocked: item.created_at || new Date().toISOString()
      }));

      setInventory(transformedData);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return {
    inventory,
    loading,
    error,
    refetch: fetchInventory
  };
}