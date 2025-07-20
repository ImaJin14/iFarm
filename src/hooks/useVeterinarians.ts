import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Veterinarian = Database['public']['Tables']['veterinarians']['Row'];
type VeterinarianInsert = Database['public']['Tables']['veterinarians']['Insert'];
type VeterinarianUpdate = Database['public']['Tables']['veterinarians']['Update'];

interface VeterinarianWithStats extends Veterinarian {
  health_records_count?: number;
  vaccinations_count?: number;
  last_visit_date?: string;
}

export const useVeterinarians = () => {
  const [veterinarians, setVeterinarians] = useState<VeterinarianWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVeterinarians = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('veterinarians')
        .select(`
          *,
          health_records(count),
          vaccinations(count)
        `)
        .order('name', { ascending: true });

      if (error) throw error;

      // Process the data to include stats
      const veterinariansWithStats = data?.map(vet => ({
        ...vet,
        health_records_count: vet.health_records?.[0]?.count || 0,
        vaccinations_count: vet.vaccinations?.[0]?.count || 0
      }));

      setVeterinarians(veterinariansWithStats || []);
    } catch (err) {
      console.error('Error fetching veterinarians:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch veterinarians');
    } finally {
      setLoading(false);
    }
  };

  const createVeterinarian = async (vetData: VeterinarianInsert) => {
    try {
      const { data, error } = await supabase
        .from('veterinarians')
        .insert([vetData])
        .select()
        .single();

      if (error) throw error;
      await fetchVeterinarians();
      return data;
    } catch (err) {
      console.error('Error creating veterinarian:', err);
      throw err;
    }
  };

  const updateVeterinarian = async (id: string, updates: VeterinarianUpdate) => {
    try {
      const { data, error } = await supabase
        .from('veterinarians')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchVeterinarians();
      return data;
    } catch (err) {
      console.error('Error updating veterinarian:', err);
      throw err;
    }
  };

  const deleteVeterinarian = async (id: string) => {
    try {
      // Check if veterinarian has associated records
      const { data: healthRecords, error: checkError } = await supabase
        .from('health_records')
        .select('id')
        .eq('veterinarian_id', id)
        .limit(1);

      if (checkError) throw checkError;

      if (healthRecords && healthRecords.length > 0) {
        throw new Error('Cannot delete veterinarian with associated health records. Consider marking as inactive instead.');
      }

      const { error } = await supabase
        .from('veterinarians')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchVeterinarians();
    } catch (err) {
      console.error('Error deleting veterinarian:', err);
      throw err;
    }
  };

  const getActiveVeterinarians = () => {
    return veterinarians.filter(vet => vet.is_active);
  };

  const getEmergencyVeterinarians = () => {
    return veterinarians.filter(vet => vet.emergency_contact && vet.is_active);
  };

  const getVeterinariansBySpecialty = (specialty: string) => {
    return veterinarians.filter(vet => 
      vet.specialties?.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
    );
  };

  const searchVeterinarians = (searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return veterinarians.filter(vet =>
      vet.name.toLowerCase().includes(term) ||
      vet.clinic_name?.toLowerCase().includes(term) ||
      vet.email?.toLowerCase().includes(term) ||
      vet.phone?.toLowerCase().includes(term) ||
      vet.specialties?.some(s => s.toLowerCase().includes(term))
    );
  };

  const getVeterinarianStats = () => {
    const total = veterinarians.length;
    const active = veterinarians.filter(v => v.is_active).length;
    const emergency = veterinarians.filter(v => v.emergency_contact && v.is_active).length;
    const totalRecords = veterinarians.reduce((sum, v) => sum + (v.health_records_count || 0), 0);
    const totalVaccinations = veterinarians.reduce((sum, v) => sum + (v.vaccinations_count || 0), 0);

    // Get unique specialties
    const allSpecialties = veterinarians.flatMap(v => v.specialties || []);
    const uniqueSpecialties = [...new Set(allSpecialties)];

    return {
      total,
      active,
      inactive: total - active,
      emergency,
      totalRecords,
      totalVaccinations,
      specialtyCount: uniqueSpecialties.length,
      uniqueSpecialties
    };
  };

  const getVetWorkload = () => {
    return veterinarians.map(vet => ({
      id: vet.id,
      name: vet.name,
      clinic_name: vet.clinic_name,
      total_appointments: (vet.health_records_count || 0) + (vet.vaccinations_count || 0),
      health_records: vet.health_records_count || 0,
      vaccinations: vet.vaccinations_count || 0,
      is_active: vet.is_active,
      emergency_contact: vet.emergency_contact
    }))
    .sort((a, b) => b.total_appointments - a.total_appointments);
  };

  useEffect(() => {
    fetchVeterinarians();
  }, []);

  return {
    veterinarians,
    loading,
    error,
    createVeterinarian,
    updateVeterinarian,
    deleteVeterinarian,
    refetch: fetchVeterinarians,
    getActiveVeterinarians,
    getEmergencyVeterinarians,
    getVeterinariansBySpecialty,
    searchVeterinarians,
    getVeterinarianStats,
    getVetWorkload
  };
};