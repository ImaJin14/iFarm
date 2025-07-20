import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type HealthRecord = Database['public']['Tables']['health_records']['Row'];
type HealthRecordInsert = Database['public']['Tables']['health_records']['Insert'];
type HealthRecordUpdate = Database['public']['Tables']['health_records']['Update'];

interface HealthRecordWithDetails extends HealthRecord {
  animals?: {
    name: string;
    breed: {
      name: string;
      type: string;
    };
  };
  veterinarians?: {
    name: string;
    clinic_name: string;
  };
}

export const useHealthRecords = (animalId?: string) => {
  const [healthRecords, setHealthRecords] = useState<HealthRecordWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('health_records')
        .select(`
          *,
          animals!inner(
            name,
            breeds!inner(
              name,
              type
            )
          ),
          veterinarians(
            name,
            clinic_name
          )
        `)
        .order('record_date', { ascending: false });

      if (animalId) {
        query = query.eq('animal_id', animalId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setHealthRecords(data || []);
    } catch (err) {
      console.error('Error fetching health records:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch health records');
    } finally {
      setLoading(false);
    }
  };

  const createHealthRecord = async (recordData: HealthRecordInsert) => {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .insert([recordData])
        .select()
        .single();

      if (error) throw error;
      await fetchHealthRecords();
      return data;
    } catch (err) {
      console.error('Error creating health record:', err);
      throw err;
    }
  };

  const updateHealthRecord = async (id: string, updates: HealthRecordUpdate) => {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchHealthRecords();
      return data;
    } catch (err) {
      console.error('Error updating health record:', err);
      throw err;
    }
  };

  const deleteHealthRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchHealthRecords();
    } catch (err) {
      console.error('Error deleting health record:', err);
      throw err;
    }
  };

  const getHealthRecordsByType = (type: string) => {
    return healthRecords.filter(record => record.record_type === type);
  };

  const getUpcomingReminders = (daysAhead: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);
    
    return healthRecords.filter(record => {
      if (!record.next_due_date) return false;
      const dueDate = new Date(record.next_due_date);
      return dueDate <= cutoffDate && dueDate >= new Date();
    });
  };

  const getOverdueRecords = () => {
    const today = new Date();
    return healthRecords.filter(record => {
      if (!record.next_due_date) return false;
      const dueDate = new Date(record.next_due_date);
      return dueDate < today;
    });
  };

  useEffect(() => {
    fetchHealthRecords();
  }, [animalId]);

  return {
    healthRecords,
    loading,
    error,
    createHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    refetch: fetchHealthRecords,
    getHealthRecordsByType,
    getUpcomingReminders,
    getOverdueRecords
  };
};