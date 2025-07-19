import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database, FarmSetting } from '../lib/supabase';

// Interface for structured farm settings
export interface FarmSettings {
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

      // Transform key-value pairs to structured object
      const settingsMap: Record<string, string> = {};
      data.forEach(setting => {
        const key = setting.setting_key;
        settingsMap[key] = setting.setting_value || '';
      });

      const transformedSettings: FarmSettings = {
        farm_name: settingsMap.farm_name || 'iFarm',
        farm_tagline: settingsMap.farm_tagline || 'Premium Livestock Breeding',
        contact_email: settingsMap.email || 'info@ifarm.com',
        contact_phone: settingsMap.phone || '(555) 123-4567',
        address: settingsMap.address || '123 Farm Road, Rural Valley, ST 12345',
        website_url: settingsMap.website_url || '',
        timezone: settingsMap.timezone || 'America/New_York',
        currency: settingsMap.currency || 'USD',
        default_weight_unit: settingsMap.weight_unit || 'lbs',
        low_stock_threshold: parseInt(settingsMap.low_stock_threshold) || 10,
        enable_notifications: settingsMap.email_enabled === 'true',
        notification_email: settingsMap.notification_email || '',
        backup_frequency: settingsMap.backup_frequency || 'weekly'
      };

      setFarmSettings(transformedSettings);
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
      
      // Convert structured settings back to key-value pairs
      const updates: Array<{ setting_key: string; setting_value: string }> = [];
      
      Object.entries(settings).forEach(([key, value]) => {
        let settingKey = key;
        let settingValue = String(value);
        
        // Map structured keys to database keys
        switch (key) {
          case 'contact_email':
            settingKey = 'email';
            break;
          case 'contact_phone':
            settingKey = 'phone';
            break;
          case 'default_weight_unit':
            settingKey = 'weight_unit';
            break;
          case 'enable_notifications':
            settingKey = 'email_enabled';
            settingValue = value ? 'true' : 'false';
            break;
        }
        
        updates.push({ setting_key: settingKey, setting_value: settingValue });
      });

      // Update each setting individually
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('farm_settings')
          .update({ setting_value: update.setting_value })
          .eq('setting_key', update.setting_key);

        if (updateError) {
          throw updateError;
        }
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