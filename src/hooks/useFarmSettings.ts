// src/hooks/useFarmSettings.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface FarmSetting {
  id: string;
  setting_group: string;
  setting_key: string;
  setting_value?: string;
  data_type: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface FarmSettingsData {
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

export function useFarmSettings() {
  const [farmSettings, setFarmSettings] = useState<FarmSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFarmSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('farm_settings')
        .select('*');

      if (error) throw error;

      // Convert array of settings to object
      const settingsObject: any = {};
      (data || []).forEach((setting: FarmSetting) => {
        const key = setting.setting_key;
        let value = setting.setting_value;

        // Convert based on data type
        if (setting.data_type === 'number') {
          value = parseFloat(value || '0');
        } else if (setting.data_type === 'boolean') {
          value = value === 'true';
        }

        settingsObject[key] = value;
      });

      setFarmSettings(settingsObject);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch farm settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<FarmSettingsData>) => {
    try {
      // Convert settings object back to array format for database
      const updates = Object.entries(newSettings).map(([key, value]) => ({
        setting_key: key,
        setting_value: String(value),
        data_type: typeof value === 'number' ? 'number' : 
                   typeof value === 'boolean' ? 'boolean' : 'string'
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('farm_settings')
          .upsert({
            setting_group: getSettingGroup(update.setting_key),
            ...update
          }, { 
            onConflict: 'setting_group,setting_key'
          });

        if (error) throw error;
      }

      // Refresh settings
      await fetchFarmSettings();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update settings');
    }
  };

  const getSettingGroup = (key: string): string => {
    if (['farm_name', 'farm_tagline', 'timezone', 'currency', 'default_weight_unit'].includes(key)) {
      return 'general';
    }
    if (['contact_email', 'contact_phone', 'address', 'website_url'].includes(key)) {
      return 'contact';
    }
    if (['enable_notifications', 'notification_email'].includes(key)) {
      return 'notifications';
    }
    if (['low_stock_threshold', 'backup_frequency'].includes(key)) {
      return 'system';
    }
    return 'general';
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