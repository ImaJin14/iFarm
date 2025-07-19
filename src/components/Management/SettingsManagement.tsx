import React, { useState, useEffect } from 'react';
import { Save, Settings, Globe, Bell, Database, Shield, Clock, DollarSign } from 'lucide-react';
import { useFarmSettings } from '../../hooks/useFarmSettings';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

export default function SettingsManagement() {
  const { farmSettings, loading, error, refetch, updateSettings } = useFarmSettings();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'preferences' | 'notifications'>('general');

  // Form states
  const [formData, setFormData] = useState({
    farm_name: '',
    farm_tagline: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    website_url: '',
    timezone: '',
    currency: '',
    default_weight_unit: '',
    low_stock_threshold: 10,
    enable_notifications: true,
    notification_email: '',
    backup_frequency: 'weekly'
  });

  useEffect(() => {
    if (farmSettings) {
      setFormData({
        farm_name: farmSettings.farm_name,
        farm_tagline: farmSettings.farm_tagline,
        contact_email: farmSettings.contact_email,
        contact_phone: farmSettings.contact_phone,
        address: farmSettings.address,
        website_url: farmSettings.website_url || '',
        timezone: farmSettings.timezone,
        currency: farmSettings.currency,
        default_weight_unit: farmSettings.default_weight_unit,
        low_stock_threshold: farmSettings.low_stock_threshold,
        enable_notifications: farmSettings.enable_notifications,
        notification_email: farmSettings.notification_email || '',
        backup_frequency: farmSettings.backup_frequency
      });
    }
  }, [farmSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'low_stock_threshold' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      await updateSettings(formData);
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to update settings' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'contact', name: 'Contact Info', icon: Globe },
    { id: 'preferences', name: 'Preferences', icon: DollarSign },
    { id: 'notifications', name: 'Notifications', icon: Bell }
  ];

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Phoenix',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo'
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  const weightUnits = ['lbs', 'kg', 'oz', 'g'];
  const backupFrequencies = ['daily', 'weekly', 'monthly'];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Farm Settings</h2>
          <p className="text-gray-600">Manage your farm's general settings and preferences</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          {submitting ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">General Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farm Name *
                  </label>
                  <input
                    type="text"
                    name="farm_name"
                    required
                    value={formData.farm_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Your farm name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farm Tagline
                  </label>
                  <input
                    type="text"
                    name="farm_tagline"
                    value={formData.farm_tagline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Your farm's tagline"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="https://yourfarm.com"
                />
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    required
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="contact@yourfarm.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="contact_phone"
                    required
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farm Address *
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="123 Farm Road, Rural Valley, ST 12345"
                />
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">System Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone *
                  </label>
                  <select
                    name="timezone"
                    required
                    value={formData.timezone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {timezones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency *
                  </label>
                  <select
                    name="currency"
                    required
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Weight Unit *
                  </label>
                  <select
                    name="default_weight_unit"
                    required
                    value={formData.default_weight_unit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {weightUnits.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    name="low_stock_threshold"
                    min="0"
                    value={formData.low_stock_threshold}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Frequency
                  </label>
                  <select
                    name="backup_frequency"
                    value={formData.backup_frequency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {backupFrequencies.map(freq => (
                      <option key={freq} value={freq}>{freq.charAt(0).toUpperCase() + freq.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="enable_notifications"
                    checked={formData.enable_notifications}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Enable email notifications
                  </label>
                </div>

                {formData.enable_notifications && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Email
                    </label>
                    <input
                      type="email"
                      name="notification_email"
                      value={formData.notification_email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="notifications@yourfarm.com"
                    />
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Notification Types</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Low inventory alerts</li>
                  <li>• Breeding schedule reminders</li>
                  <li>• Health check notifications</li>
                  <li>• System backup confirmations</li>
                </ul>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}