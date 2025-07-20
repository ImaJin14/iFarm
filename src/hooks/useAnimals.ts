// src/hooks/useAnimals.ts - Fixed version
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Animal = Database['public']['Tables']['animals']['Row'];
type AnimalInsert = Database['public']['Tables']['animals']['Insert'];
type AnimalUpdate = Database['public']['Tables']['animals']['Update'];

interface AnimalWithDetails extends Animal {
  breeds?: {
    name: string;
    type: Database['public']['Enums']['animal_type'];
    description: string;
  };
  facilities?: {
    name: string;
    facility_type: string;
  };
  genetic_lines?: {
    name: string;
    description: string;
  };
  sire?: {
    name: string;
    registration_number: string;
  };
  dam?: {
    name: string;
    registration_number: string;
  };
}

interface AnimalFilters {
  breed_id?: string;
  status?: Database['public']['Enums']['animal_status'];
  gender?: Database['public']['Enums']['animal_gender'];
  facility_id?: string;
  is_for_sale?: boolean;
  is_breeding_quality?: boolean;
}

export const useAnimals = (filters?: AnimalFilters) => {
  const [animals, setAnimals] = useState<AnimalWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First approach: Use column-based joins
      let query = supabase
        .from('animals')
        .select(`
          *,
          breeds!inner(
            name,
            type,
            description
          ),
          facilities(
            name,
            facility_type
          ),
          genetic_lines(
            name,
            description
          ),
          sire:animals!sire_id(
            name,
            registration_number
          ),
          dam:animals!dam_id(
            name,
            registration_number
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters) {
        if (filters.breed_id) {
          query = query.eq('breed_id', filters.breed_id);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.gender) {
          query = query.eq('gender', filters.gender);
        }
        if (filters.facility_id) {
          query = query.eq('facility_id', filters.facility_id);
        }
        if (filters.is_for_sale !== undefined) {
          query = query.eq('is_for_sale', filters.is_for_sale);
        }
        if (filters.is_breeding_quality !== undefined) {
          query = query.eq('is_breeding_quality', filters.is_breeding_quality);
        }
      }

      const { data, error } = await query;

      if (error) {
        // If column-based approach fails, try fallback approach
        console.warn('Column-based join failed, trying fallback approach:', error);
        const fallbackData = await fetchAnimalsWithFallback(filters);
        setAnimals(fallbackData);
        return;
      }

      setAnimals(data || []);
    } catch (err) {
      console.error('Error fetching animals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch animals');
    } finally {
      setLoading(false);
    }
  };

  // Fallback approach: Separate queries
  const fetchAnimalsWithFallback = async (filters?: AnimalFilters): Promise<AnimalWithDetails[]> => {
    // Get animals without parent relationships first
    let query = supabase
      .from('animals')
      .select(`
        *,
        breeds!inner(
          name,
          type,
          description
        ),
        facilities(
          name,
          facility_type
        ),
        genetic_lines(
          name,
          description
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters) {
      if (filters.breed_id) {
        query = query.eq('breed_id', filters.breed_id);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.gender) {
        query = query.eq('gender', filters.gender);
      }
      if (filters.facility_id) {
        query = query.eq('facility_id', filters.facility_id);
      }
      if (filters.is_for_sale !== undefined) {
        query = query.eq('is_for_sale', filters.is_for_sale);
      }
      if (filters.is_breeding_quality !== undefined) {
        query = query.eq('is_breeding_quality', filters.is_breeding_quality);
      }
    }

    const { data: animals, error: animalsError } = await query;

    if (animalsError) throw animalsError;

    if (!animals || animals.length === 0) {
      return [];
    }

    // Get unique parent IDs
    const parentIds = [
      ...animals.filter(a => a.sire_id).map(a => a.sire_id),
      ...animals.filter(a => a.dam_id).map(a => a.dam_id)
    ].filter((id, index, arr) => arr.indexOf(id) === index && id !== null);

    // Fetch parent animals if any exist
    let parentAnimals: Array<{id: string, name: string, registration_number: string}> = [];
    if (parentIds.length > 0) {
      const { data: parents, error: parentsError } = await supabase
        .from('animals')
        .select('id, name, registration_number')
        .in('id', parentIds);

      if (parentsError) {
        console.warn('Could not fetch parent animals:', parentsError);
      } else {
        parentAnimals = parents || [];
      }
    }

    // Create a map for quick parent lookup
    const parentMap = new Map(parentAnimals.map(p => [p.id, p]));

    // Attach parent information to animals
    const animalsWithParents = animals.map(animal => ({
      ...animal,
      sire: animal.sire_id ? parentMap.get(animal.sire_id) || null : null,
      dam: animal.dam_id ? parentMap.get(animal.dam_id) || null : null
    }));

    return animalsWithParents;
  };

  const createAnimal = async (animalData: AnimalInsert) => {
    try {
      const { data, error } = await supabase
        .from('animals')
        .insert([animalData])
        .select()
        .single();

      if (error) throw error;
      await fetchAnimals();
      return data;
    } catch (err) {
      console.error('Error creating animal:', err);
      throw err;
    }
  };

  const updateAnimal = async (id: string, updates: AnimalUpdate) => {
    try {
      const { data, error } = await supabase
        .from('animals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchAnimals();
      return data;
    } catch (err) {
      console.error('Error updating animal:', err);
      throw err;
    }
  };

  const deleteAnimal = async (id: string) => {
    try {
      // Check if animal has dependents (offspring, breeding records, etc.)
      const { data: breedingRecords, error: breedingError } = await supabase
        .from('breeding_records')
        .select('id')
        .or(`sire_id.eq.${id},dam_id.eq.${id}`)
        .limit(1);

      if (breedingError) throw breedingError;

      if (breedingRecords && breedingRecords.length > 0) {
        throw new Error('Cannot delete animal with breeding records. Consider marking as inactive instead.');
      }

      // Soft delete - mark as inactive instead of hard delete
      const { error } = await supabase
        .from('animals')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      await fetchAnimals();
    } catch (err) {
      console.error('Error deleting animal:', err);
      throw err;
    }
  };

  const getAvailableAnimals = () => {
    return animals.filter(animal => animal.status === 'available' && animal.is_for_sale);
  };

  const getBreedingAnimals = () => {
    return animals.filter(animal => animal.is_breeding_quality);
  };

  const getAnimalsByBreed = (breedId: string) => {
    return animals.filter(animal => animal.breed_id === breedId);
  };

  const getAnimalsByFacility = (facilityId: string) => {
    return animals.filter(animal => animal.facility_id === facilityId);
  };

  const searchAnimals = (searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return animals.filter(animal =>
      animal.name.toLowerCase().includes(term) ||
      animal.registration_number?.toLowerCase().includes(term) ||
      animal.color.toLowerCase().includes(term) ||
      animal.breeds?.name.toLowerCase().includes(term)
    );
  };

  const getAnimalStats = () => {
    const total = animals.length;
    const available = animals.filter(a => a.status === 'available').length;
    const breeding = animals.filter(a => a.status === 'breeding').length;
    const sold = animals.filter(a => a.status === 'sold').length;
    const forSale = animals.filter(a => a.is_for_sale).length;
    const breedingQuality = animals.filter(a => a.is_breeding_quality).length;

    const avgPrice = animals
      .filter(a => a.price && a.is_for_sale)
      .reduce((sum, a) => sum + (a.price || 0), 0) / forSale || 0;

    return {
      total,
      available,
      breeding,
      sold,
      forSale,
      breedingQuality,
      avgPrice
    };
  };

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return null;
    
    const birth = new Date(birthDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, [filters]);

  return {
    animals,
    loading,
    error,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    refetch: fetchAnimals,
    getAvailableAnimals,
    getBreedingAnimals,
    getAnimalsByBreed,
    getAnimalsByFacility,
    searchAnimals,
    getAnimalStats,
    calculateAge
  };
};

// Individual animal hook for detail pages
export const useAnimal = (animalId: string) => {
  const [animal, setAnimal] = useState<AnimalWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnimal = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try column-based approach first
      let { data, error } = await supabase
        .from('animals')
        .select(`
          *,
          breeds!inner(
            name,
            type,
            description
          ),
          facilities(
            name,
            facility_type
          ),
          genetic_lines(
            name,
            description
          ),
          sire:animals!sire_id(
            name,
            registration_number
          ),
          dam:animals!dam_id(
            name,
            registration_number
          )
        `)
        .eq('id', animalId)
        .eq('is_active', true)
        .single();

      if (error) {
        // Fallback: Fetch without parent relationships and add them separately
        console.warn('Column-based join failed for single animal, trying fallback:', error);
        
        const { data: animalData, error: animalError } = await supabase
          .from('animals')
          .select(`
            *,
            breeds!inner(
              name,
              type,
              description
            ),
            facilities(
              name,
              facility_type
            ),
            genetic_lines(
              name,
              description
            )
          `)
          .eq('id', animalId)
          .eq('is_active', true)
          .single();

        if (animalError) throw animalError;

        // Fetch parent animals if they exist
        const parentIds = [animalData.sire_id, animalData.dam_id].filter(Boolean);
        let sireData = null;
        let damData = null;

        if (parentIds.length > 0) {
          const { data: parentAnimals } = await supabase
            .from('animals')
            .select('id, name, registration_number')
            .in('id', parentIds);

          if (parentAnimals) {
            sireData = parentAnimals.find(p => p.id === animalData.sire_id);
            damData = parentAnimals.find(p => p.id === animalData.dam_id);
          }
        }

        data = {
          ...animalData,
          sire: sireData,
          dam: damData
        };
      }

      setAnimal(data);
    } catch (err) {
      console.error('Error fetching animal:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch animal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (animalId) {
      fetchAnimal();
    }
  }, [animalId]);

  return {
    animal,
    loading,
    error,
    refetch: fetchAnimal
  };
};