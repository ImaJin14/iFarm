import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database, InventoryItem } from '../lib/supabase';

// Extended type with supplier name
export interface InventoryItemWithSupplier extends InventoryItem {
  supplier_name?: string;
  quantity: number; // Map current_quantity for compatibility
  last_restocked: string; // Add for compatibility
}

export interface UseInventory {
  inventory: InventoryItemWithSupplier[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useInventory(): UseInventory {
  const [inventory, setInventory] = useState<InventoryItemWithSupplier[]>([]);
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
          suppliers (
            name
          )
        `)
        .eq('is_active', true)
        .order('name');

      if (supabaseError) {
        throw supabaseError;
      }

      // Transform data to match expected interface
      const transformedData: InventoryItemWithSupplier[] = (data || []).map(item => ({
        ...item,
        supplier_name: item.suppliers?.name || 'No supplier',
        quantity: item.current_quantity || 0,
        last_restocked: item.updated_at || item.created_at || new Date().toISOString()
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