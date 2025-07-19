// src/hooks/useInventory.ts - Fixed to use inventory_items table
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  low_stock_threshold: number;
  cost: number;
  supplier: string;
  last_restocked: string;
  animal_types: string[];
  image_url?: string;
  notes?: string;
}

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from inventory_items table first (schema compliant)
      let { data, error } = await supabase
        .from('inventory_items')
        .select(`
          id,
          name,
          category,
          current_quantity,
          unit,
          low_stock_threshold,
          cost_per_unit,
          animal_types,
          image_url,
          notes,
          created_at,
          suppliers(name)
        `)
        .eq('is_active', true)
        .order('name');

      // If that fails, try legacy inventory table
      if (error && error.code === '42P01') { // Table doesn't exist
        const legacyResult = await supabase
          .from('inventory')
          .select('*')
          .order('name');
        
        data = legacyResult.data;
        error = legacyResult.error;
      }

      if (error) throw error;

      // Transform data to match expected interface
      const transformedData = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: item.current_quantity || item.quantity || 0,
        unit: item.unit,
        low_stock_threshold: item.low_stock_threshold,
        cost: item.cost_per_unit || item.cost || 0,
        supplier: item.suppliers?.name || item.supplier || '',
        last_restocked: item.last_restocked || item.created_at,
        animal_types: item.animal_types || [],
        image_url: item.image_url,
        notes: item.notes
      }));

      setInventory(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return { inventory, loading, error, refetch: fetchInventory };
}