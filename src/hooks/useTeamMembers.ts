// src/hooks/useTeamMembers.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface TeamMember {
  id: string;
  user_id?: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  specialties: string[];
  email?: string;
  phone?: string;
  social_links: any;
  order_index: number;
  is_featured: boolean;
  is_active: boolean;
  hire_date?: string;
  created_at: string;
  updated_at: string;
}

export function useTeamMembers() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return { teamMembers, loading, error, refetch: fetchTeamMembers };
}