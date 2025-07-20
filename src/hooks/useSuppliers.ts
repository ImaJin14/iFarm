import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Supplier = Database['public']['Tables']['suppliers']['Row'];
type SupplierInsert = Database['public']['Tables']['suppliers']['Insert'];
type SupplierUpdate = Database['public']['Tables']['suppliers']['Update'];

interface SupplierWithStats extends Supplier {
  inventory_items_count?: number;
  total_credit_used?: number;
  last_order_date?: string;
}

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<SupplierWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('suppliers')
        .select(`
          *,
          inventory_items(count),
          financial_transactions(
            amount,
            transaction_date
          )
        `)
        .order('name', { ascending: true });

      if (error) throw error;

      // Process the data to include stats
      const suppliersWithStats = data?.map(supplier => ({
        ...supplier,
        inventory_items_count: supplier.inventory_items?.[0]?.count || 0,
        total_credit_used: supplier.financial_transactions?.reduce((sum: number, transaction: any) => 
          sum + (transaction.amount < 0 ? Math.abs(transaction.amount) : 0), 0) || 0,
        last_order_date: supplier.financial_transactions?.length > 0 
          ? supplier.financial_transactions
              .filter((t: any) => t.amount < 0)
              .sort((a: any, b: any) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())[0]?.transaction_date
          : null
      }));

      setSuppliers(suppliersWithStats || []);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (supplierData: SupplierInsert) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([supplierData])
        .select()
        .single();

      if (error) throw error;
      await fetchSuppliers();
      return data;
    } catch (err) {
      console.error('Error creating supplier:', err);
      throw err;
    }
  };

  const updateSupplier = async (id: string, updates: SupplierUpdate) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchSuppliers();
      return data;
    } catch (err) {
      console.error('Error updating supplier:', err);
      throw err;
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      // Check if supplier has associated inventory items
      const { data: inventoryItems, error: checkError } = await supabase
        .from('inventory_items')
        .select('id')
        .eq('supplier_id', id)
        .limit(1);

      if (checkError) throw checkError;

      if (inventoryItems && inventoryItems.length > 0) {
        throw new Error('Cannot delete supplier with associated inventory items');
      }

      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchSuppliers();
    } catch (err) {
      console.error('Error deleting supplier:', err);
      throw err;
    }
  };

  const getActiveSuppliers = () => {
    return suppliers.filter(supplier => supplier.is_active);
  };

  const getSuppliersByPaymentMethod = (paymentMethod: string) => {
    return suppliers.filter(supplier => supplier.preferred_payment_method === paymentMethod);
  };

  const searchSuppliers = (searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(term) ||
      supplier.contact_person?.toLowerCase().includes(term) ||
      supplier.email?.toLowerCase().includes(term)
    );
  };

  const getSuppliersNearCreditLimit = () => {
    return suppliers.filter(supplier => {
      if (!supplier.credit_limit || !supplier.total_credit_used) return false;
      const usage = (supplier.total_credit_used / supplier.credit_limit) * 100;
      return usage >= 80; // 80% or more of credit limit used
    });
  };

  const getSupplierStats = () => {
    const total = suppliers.length;
    const active = suppliers.filter(s => s.is_active).length;
    const totalCreditLimit = suppliers.reduce((sum, s) => sum + (s.credit_limit || 0), 0);
    const totalCreditUsed = suppliers.reduce((sum, s) => sum + (s.total_credit_used || 0), 0);

    return {
      total,
      active,
      inactive: total - active,
      totalCreditLimit,
      totalCreditUsed,
      creditUtilization: totalCreditLimit > 0 ? (totalCreditUsed / totalCreditLimit) * 100 : 0
    };
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    error,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    refetch: fetchSuppliers,
    getActiveSuppliers,
    getSuppliersByPaymentMethod,
    searchSuppliers,
    getSuppliersNearCreditLimit,
    getSupplierStats
  };
};