import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type FarmSetting = Database['public']['Tables']['farm_settings']['Row'];

interface FarmSettings {
  farm_name: string;
  farm_tagline: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  website_url: string;
  timezone: string;
  currency: string;
  default_weight_unit: string;
  low_stock_threshold: number;
  enable_notifications: boolean;
  notification_email: string;
  backup_frequency: string;
}

export interface UseFarmSettings {
  farmSettings: FarmSettings | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateSettings: (settings: Partial<FarmSettings>) => Promise<void>;
}

export function useFarmSettings(): UseFarmSettings {
  const [farmSettings, setFarmSettings] = useState<FarmSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFarmSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('farm_settings')
        .select('*');

      if (supabaseError) {
        throw supabaseError;
      }

      // Transform array of settings into object
      const settingsObject: any = {};
      (data || []).forEach(setting => {
        const key = setting.setting_key;
        let value = setting.setting_value;
        
        // Convert based on data type
        if (setting.data_type === 'number') {
          value = value ? parseFloat(value) : 0;
        } else if (setting.data_type === 'boolean') {
          value = value === 'true';
        }
        
        settingsObject[key] = value;
      });

      // Set defaults for missing values
      const defaultSettings: FarmSettings = {
        farm_name: 'iFarm',
        farm_tagline: 'Premium Livestock Breeding',
        contact_email: 'info@ifarm.com',
        contact_phone: '(555) 123-4567',
        address: '123 Farm Road, Rural Valley, ST 12345',
        website_url: '',
        timezone: 'America/New_York',
        currency: 'USD',
        default_weight_unit: 'lbs',
        low_stock_threshold: 10,
        enable_notifications: true,
        notification_email: '',
        backup_frequency: 'weekly'
      };

      setFarmSettings({ ...defaultSettings, ...settingsObject });
    } catch (err) {
      console.error('Error fetching farm settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch farm settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (settings: Partial<FarmSettings>) => {
    try {
      setError(null);
      
      // Update each setting individually
      for (const [key, value] of Object.entries(settings)) {
        const stringValue = typeof value === 'boolean' ? value.toString() : 
                           typeof value === 'number' ? value.toString() : 
                           value as string;
        
        const dataType = typeof value === 'boolean' ? 'boolean' :
                        typeof value === 'number' ? 'number' : 'string';

        const { error } = await supabase
          .from('farm_settings')
          .upsert({
            setting_group: key.startsWith('contact_') ? 'contact' : 
                          key.startsWith('notification_') ? 'notifications' :
                          key === 'low_stock_threshold' ? 'inventory' : 'general',
            setting_key: key,
            setting_value: stringValue,
            data_type: dataType
          }, {
            onConflict: 'setting_group,setting_key'
          });

        if (error) throw error;
      }

      // Refetch to get updated data
      await fetchFarmSettings();
    } catch (err) {
      console.error('Error updating farm settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update farm settings');
      throw err;
    }
  };

  useEffect(() => {
    fetchFarmSettings();
  }, []);

  return {
    farmSettings,
    loading,
    error,
    refetch: fetchFarmSettings,
    updateSettings
  };
}