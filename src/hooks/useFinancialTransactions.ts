import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type FinancialTransaction = Database['public']['Tables']['financial_transactions']['Row'];
type FinancialTransactionInsert = Database['public']['Tables']['financial_transactions']['Insert'];
type FinancialTransactionUpdate = Database['public']['Tables']['financial_transactions']['Update'];

interface FinancialTransactionWithDetails extends FinancialTransaction {
  customers?: {
    first_name: string;
    last_name: string;
    business_name: string;
    email: string;
  };
  suppliers?: {
    name: string;
    contact_person: string;
  };
  animals?: {
    name: string;
    registration_number: string;
    breeds: {
      name: string;
      type: string;
    };
  };
  users?: {
    full_name: string;
    email: string;
  };
}

interface TransactionFilters {
  transaction_type?: string;
  status?: string;
  payment_method?: string;
  category?: string;
  start_date?: string;
  end_date?: string;
  customer_id?: string;
  supplier_id?: string;
  animal_id?: string;
}

export const useFinancialTransactions = (filters?: TransactionFilters) => {
  const [transactions, setTransactions] = useState<FinancialTransactionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('financial_transactions')
        .select(`
          *,
          customers(
            first_name,
            last_name,
            business_name,
            email
          ),
          suppliers(
            name,
            contact_person
          ),
          animals(
            name,
            registration_number,
            breeds!inner(
              name,
              type
            )
          ),
          users(
            full_name,
            email
          )
        `)
        .order('transaction_date', { ascending: false });

      // Apply filters
      if (filters) {
        if (filters.transaction_type) {
          query = query.eq('transaction_type', filters.transaction_type);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.payment_method) {
          query = query.eq('payment_method', filters.payment_method);
        }
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        if (filters.customer_id) {
          query = query.eq('customer_id', filters.customer_id);
        }
        if (filters.supplier_id) {
          query = query.eq('supplier_id', filters.supplier_id);
        }
        if (filters.animal_id) {
          query = query.eq('animal_id', filters.animal_id);
        }
        if (filters.start_date) {
          query = query.gte('transaction_date', filters.start_date);
        }
        if (filters.end_date) {
          query = query.lte('transaction_date', filters.end_date);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching financial transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch financial transactions');
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData: FinancialTransactionInsert) => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([transactionData])
        .select()
        .single();

      if (error) throw error;
      await fetchTransactions();
      return data;
    } catch (err) {
      console.error('Error creating financial transaction:', err);
      throw err;
    }
  };

  const updateTransaction = async (id: string, updates: FinancialTransactionUpdate) => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchTransactions();
      return data;
    } catch (err) {
      console.error('Error updating financial transaction:', err);
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchTransactions();
    } catch (err) {
      console.error('Error deleting financial transaction:', err);
      throw err;
    }
  };

  const markAsPaid = async (id: string, paidDate?: string) => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .update({
          status: 'completed',
          paid_date: paidDate || new Date().toISOString().split('T')[0]
        })
        .eq('id', id);

      if (error) throw error;
      await fetchTransactions();
    } catch (err) {
      console.error('Error marking transaction as paid:', err);
      throw err;
    }
  };

  // Analytics and reporting functions
  const getTransactionsByType = (type: string) => {
    return transactions.filter(t => t.transaction_type === type);
  };

  const getTransactionsByStatus = (status: string) => {
    return transactions.filter(t => t.status === status);
  };

  const getPendingTransactions = () => {
    return transactions.filter(t => t.status === 'pending');
  };

  const getOverdueTransactions = () => {
    const today = new Date();
    return transactions.filter(t => {
      if (t.status !== 'pending' || !t.due_date) return false;
      return new Date(t.due_date) < today;
    });
  };

  const getTotalsByType = () => {
    const totals = {
      sales: 0,
      purchases: 0,
      expenses: 0,
      income: 0,
      refunds: 0,
      fees: 0
    };

    transactions.forEach(t => {
      if (t.status === 'completed') {
        totals[t.transaction_type as keyof typeof totals] += Math.abs(t.amount);
      }
    });

    return totals;
  };

  const getMonthlyTotals = (year?: number) => {
    const currentYear = year || new Date().getFullYear();
    const monthlyData = Array(12).fill(0).map((_, index) => ({
      month: index + 1,
      monthName: new Date(2000, index).toLocaleString('default', { month: 'long' }),
      sales: 0,
      purchases: 0,
      expenses: 0,
      income: 0,
      net: 0
    }));

    transactions
      .filter(t => {
        const transactionYear = new Date(t.transaction_date).getFullYear();
        return transactionYear === currentYear && t.status === 'completed';
      })
      .forEach(t => {
        const month = new Date(t.transaction_date).getMonth();
        const amount = Math.abs(t.amount);
        
        switch (t.transaction_type) {
          case 'sale':
          case 'income':
            monthlyData[month].sales += amount;
            monthlyData[month].income += amount;
            monthlyData[month].net += amount;
            break;
          case 'purchase':
          case 'expense':
          case 'fee':
            monthlyData[month].purchases += amount;
            monthlyData[month].expenses += amount;
            monthlyData[month].net -= amount;
            break;
          case 'refund':
            monthlyData[month].net -= amount;
            break;
        }
      });

    return monthlyData;
  };

  const getCashFlow = (days: number = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const relevantTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.transaction_date);
      return transactionDate >= startDate && t.status === 'completed';
    });

    const inflow = relevantTransactions
      .filter(t => ['sale', 'income'].includes(t.transaction_type))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const outflow = relevantTransactions
      .filter(t => ['purchase', 'expense', 'fee', 'refund'].includes(t.transaction_type))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      inflow,
      outflow,
      net: inflow - outflow,
      transactionCount: relevantTransactions.length
    };
  };

  const getTopCustomers = (limit: number = 10) => {
    const customerTotals = new Map();
    
    transactions
      .filter(t => t.customers && t.transaction_type === 'sale' && t.status === 'completed')
      .forEach(t => {
        const customerId = t.customer_id;
        const currentTotal = customerTotals.get(customerId) || { total: 0, count: 0, customer: t.customers };
        customerTotals.set(customerId, {
          total: currentTotal.total + Math.abs(t.amount),
          count: currentTotal.count + 1,
          customer: t.customers
        });
      });

    return Array.from(customerTotals.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);
  };

  const getTransactionStats = () => {
    const total = transactions.length;
    const completed = transactions.filter(t => t.status === 'completed').length;
    const pending = transactions.filter(t => t.status === 'pending').length;
    const cancelled = transactions.filter(t => t.status === 'cancelled').length;
    
    const totals = getTotalsByType();
    const totalRevenue = totals.sales + totals.income;
    const totalExpenses = totals.purchases + totals.expenses + totals.fees;
    const netProfit = totalRevenue - totalExpenses;

    return {
      total,
      completed,
      pending,
      cancelled,
      totalRevenue,
      totalExpenses,
      netProfit,
      ...totals
    };
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  return {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    markAsPaid,
    refetch: fetchTransactions,
    getTransactionsByType,
    getTransactionsByStatus,
    getPendingTransactions,
    getOverdueTransactions,
    getTotalsByType,
    getMonthlyTotals,
    getCashFlow,
    getTopCustomers,
    getTransactionStats
  };
};