import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Breed = Database['public']['Tables']['breeds']['Row'];
type BreedInsert = Database['public']['Tables']['breeds']['Insert'];
type BreedUpdate = Database['public']['Tables']['breeds']['Update'];

interface BreedWithStats extends Breed {
  animals_count?: number;
  available_animals_count?: number;
  breeding_animals_count?: number;
  avg_price?: number;
}

export function useBreeds(animalType?: Database['public']['Enums']['animal_type']) {
  const [breeds, setBreeds] = useState<BreedWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBreeds = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('breeds')
        .select(`
          *,
          animals(count)
        `)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (animalType) {
        query = query.eq('type', animalType);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Process breeds with stats
      const breedsWithStats = data?.map(breed => ({
        ...breed,
        animals_count: breed.animals?.[0]?.count || 0
      }));

      setBreeds(breedsWithStats || []);
    } catch (err) {
      console.error('Error fetching breeds:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch breeds');
    } finally {
      setLoading(false);
    }
  };

  const createBreed = async (breedData: BreedInsert) => {
    try {
      const { data, error } = await supabase
        .from('breeds')
        .insert([breedData])
        .select()
        .single();

      if (error) throw error;
      await fetchBreeds();
      return data;
    } catch (err) {
      console.error('Error creating breed:', err);
      throw err;
    }
  };

  const updateBreed = async (id: string, updates: BreedUpdate) => {
    try {
      const { data, error } = await supabase
        .from('breeds')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchBreeds();
      return data;
    } catch (err) {
      console.error('Error updating breed:', err);
      throw err;
    }
  };

  const deleteBreed = async (id: string) => {
    try {
      // Check if breed has associated animals
      const { data: animals, error: checkError } = await supabase
        .from('animals')
        .select('id')
        .eq('breed_id', id)
        .eq('is_active', true)
        .limit(1);

      if (checkError) throw checkError;

      if (animals && animals.length > 0) {
        throw new Error('Cannot delete breed with associated animals. Consider marking as inactive instead.');
      }

      const { error } = await supabase
        .from('breeds')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      await fetchBreeds();
    } catch (err) {
      console.error('Error deleting breed:', err);
      throw err;
    }
  };

  const getBreedsByType = (type: Database['public']['Enums']['animal_type']) => {
    return breeds.filter(breed => breed.type === type);
  };

  const searchBreeds = (searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return breeds.filter(breed =>
      breed.name.toLowerCase().includes(term) ||
      breed.description.toLowerCase().includes(term) ||
      breed.origin_country?.toLowerCase().includes(term)
    );
  };

  const getBreedStats = () => {
    const total = breeds.length;
    const totalAnimals = breeds.reduce((sum, breed) => sum + (breed.animals_count || 0), 0);
    
    const typeBreakdown = breeds.reduce((acc, breed) => {
      acc[breed.type] = (acc[breed.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      totalAnimals,
      typeBreakdown,
      avgAnimalsPerBreed: total > 0 ? totalAnimals / total : 0
    };
  };

  useEffect(() => {
    fetchBreeds();
  }, [animalType]);

  return {
    breeds,
    loading,
    error,
    createBreed,
    updateBreed,
    deleteBreed,
    refetch: fetchBreeds,
    getBreedsByType,
    searchBreeds,
    getBreedStats
  };
}

// Individual breed hook for detail pages
export const useBreed = (breedId: string) => {
  const [breed, setBreed] = useState<BreedWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBreed = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('breeds')
        .select(`
          *,
          animals!inner(
            id,
            name,
            status,
            price,
            is_for_sale,
            is_breeding_quality
          )
        `)
        .eq('id', breedId)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      // Calculate breed stats
      const animals = data.animals || [];
      const breedWithStats = {
        ...data,
        animals_count: animals.length,
        available_animals_count: animals.filter((a: any) => a.status === 'available').length,
        breeding_animals_count: animals.filter((a: any) => a.is_breeding_quality).length,
        avg_price: animals.filter((a: any) => a.price && a.is_for_sale)
          .reduce((sum: number, a: any) => sum + a.price, 0) / 
          animals.filter((a: any) => a.price && a.is_for_sale).length || 0
      };

      setBreed(breedWithStats);
    } catch (err) {
      console.error('Error fetching breed:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch breed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (breedId) {
      fetchBreed();
    }
  }, [breedId]);

  return {
    breed,
    loading,
    error,
    refetch: fetchBreed
  };
};