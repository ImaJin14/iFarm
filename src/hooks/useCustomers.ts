import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Customer = Database['public']['Tables']['customers']['Row'];
type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

interface CustomerWithStats extends Customer {
  total_purchases?: number;
  total_spent?: number;
  last_purchase_date?: string;
  pending_balance?: number;
  user_details?: {
    email: string;
    full_name: string;
  };
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          users(
            email,
            full_name
          ),
          financial_transactions(
            amount,
            transaction_date,
            status,
            transaction_type
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process the data to include customer stats
      const customersWithStats = data?.map(customer => {
        const transactions = customer.financial_transactions || [];
        const purchases = transactions.filter((t: any) => t.transaction_type === 'sale');
        const totalSpent = purchases.reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0);
        const pendingTransactions = transactions.filter((t: any) => t.status === 'pending');
        const pendingBalance = pendingTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
        
        const lastPurchase = purchases
          .sort((a: any, b: any) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())[0];

        return {
          ...customer,
          total_purchases: purchases.length,
          total_spent: totalSpent,
          last_purchase_date: lastPurchase?.transaction_date || null,
          pending_balance: pendingBalance,
          user_details: customer.users ? {
            email: customer.users.email,
            full_name: customer.users.full_name
          } : null
        };
      });

      setCustomers(customersWithStats || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData: CustomerInsert) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();

      if (error) throw error;
      await fetchCustomers();
      return data;
    } catch (err) {
      console.error('Error creating customer:', err);
      throw err;
    }
  };

  const updateCustomer = async (id: string, updates: CustomerUpdate) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchCustomers();
      return data;
    } catch (err) {
      console.error('Error updating customer:', err);
      throw err;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      // Check if customer has associated transactions
      const { data: transactions, error: checkError } = await supabase
        .from('financial_transactions')
        .select('id')
        .eq('customer_id', id)
        .limit(1);

      if (checkError) throw checkError;

      if (transactions && transactions.length > 0) {
        throw new Error('Cannot delete customer with associated transactions. Consider deactivating instead.');
      }

      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCustomers();
    } catch (err) {
      console.error('Error deleting customer:', err);
      throw err;
    }
  };

  const getActiveCustomers = () => {
    return customers.filter(customer => customer.is_active);
  };

  const getCustomersByType = (type: string) => {
    return customers.filter(customer => customer.customer_type === type);
  };

  const searchCustomers = (searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return customers.filter(customer =>
      customer.first_name?.toLowerCase().includes(term) ||
      customer.last_name?.toLowerCase().includes(term) ||
      customer.business_name?.toLowerCase().includes(term) ||
      customer.email?.toLowerCase().includes(term) ||
      customer.phone?.toLowerCase().includes(term) ||
      customer.user_details?.full_name?.toLowerCase().includes(term) ||
      customer.user_details?.email?.toLowerCase().includes(term)
    );
  };

  const getTopCustomers = (limit: number = 10) => {
    return [...customers]
      .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
      .slice(0, limit);
  };

  const getCustomersWithPendingBalance = () => {
    return customers.filter(customer => (customer.pending_balance || 0) > 0);
  };

  const getCustomersNearCreditLimit = () => {
    return customers.filter(customer => {
      if (!customer.credit_limit || !customer.pending_balance) return false;
      const usage = (customer.pending_balance / customer.credit_limit) * 100;
      return usage >= 80; // 80% or more of credit limit used
    });
  };

  const getCustomerStats = () => {
    const total = customers.length;
    const active = customers.filter(c => c.is_active).length;
    const business = customers.filter(c => c.customer_type === 'business').length;
    const individual = customers.filter(c => c.customer_type === 'individual').length;
    const farm = customers.filter(c => c.customer_type === 'farm').length;
    
    const totalSpent = customers.reduce((sum, c) => sum + (c.total_spent || 0), 0);
    const totalPending = customers.reduce((sum, c) => sum + (c.pending_balance || 0), 0);
    const avgSpent = total > 0 ? totalSpent / total : 0;

    return {
      total,
      active,
      inactive: total - active,
      business,
      individual,
      farm,
      totalSpent,
      totalPending,
      avgSpent
    };
  };

  const getRecentCustomers = (days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return customers.filter(customer => {
      if (!customer.created_at) return false;
      return new Date(customer.created_at) >= cutoffDate;
    });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: fetchCustomers,
    getActiveCustomers,
    getCustomersByType,
    searchCustomers,
    getTopCustomers,
    getCustomersWithPendingBalance,
    getCustomersNearCreditLimit,
    getCustomerStats,
    getRecentCustomers
  };
};