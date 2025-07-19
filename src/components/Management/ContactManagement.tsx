import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Phone, Mail, MapPin, Clock, Globe, MessageSquare } from 'lucide-react';
import { useContactContent } from '../../hooks/useContactContent';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

interface BusinessHour {
  day: string;
  hours: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export default function ContactManagement() {
  const { contactContent, loading, error, refetch } = useContactContent();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'hours' | 'social' | 'content'>('basic');

  // Form states
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [contactDescription, setContactDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [mapDescription, setMapDescription] = useState('');
  const [newsletterTitle, setNewsletterTitle] = useState('');
  const [newsletterDescription, setNewsletterDescription] = useState('');
  const [newsletterPrivacyText, setNewsletterPrivacyText] = useState('');

  // Form inputs for adding new items
  const [newBusinessHour, setNewBusinessHour] = useState<BusinessHour>({ day: '', hours: '' });
  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({ platform: '', url: '', icon: 'Globe' });

  const iconOptions = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'YouTube', 'Globe'];

  useEffect(() => {
    if (contactContent) {
      setHeroTitle(contactContent.hero_title);
      setHeroDescription(contactContent.hero_description);
      setContactDescription(contactContent.contact_description);
      setAddress(contactContent.address);
      setPhone(contactContent.phone);
      setEmail(contactContent.email);
      setBusinessHours(contactContent.business_hours as BusinessHour[] || []);
      setSocialLinks(contactContent.social_links as SocialLink[] || []);
      setMapDescription(contactContent.map_description);
      setNewsletterTitle(contactContent.newsletter_title);
      setNewsletterDescription(contactContent.newsletter_description);
      setNewsletterPrivacyText(contactContent.newsletter_privacy_text);
    }
  }, [contactContent]);

  const handleSave = async () => {
    setSubmitting(true);
    setMessage(null);

    try {
      const updateData = {
        hero_title: heroTitle,
        hero_description: heroDescription,
        contact_description: contactDescription,
        address: address,
        phone: phone,
        email: email,
        business_hours: businessHours,
        social_links: socialLinks,
        map_description: mapDescription,
        newsletter_title: newsletterTitle,
        newsletter_description: newsletterDescription,
        newsletter_privacy_text: newsletterPrivacyText
      };

      const { error } = await supabase
        .from('contact_content')
        .update(updateData)
        .eq('id', contactContent?.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Contact page content updated successfully!' });
      refetch();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to update contact content' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const addBusinessHour = () => {
    if (newBusinessHour.day && newBusinessHour.hours) {
      setBusinessHours([...businessHours, newBusinessHour]);
      setNewBusinessHour({ day: '', hours: '' });
    }
  };

  const removeBusinessHour = (index: number) => {
    setBusinessHours(businessHours.filter((_, i) => i !== index));
  };

  const addSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      setSocialLinks([...socialLinks, newSocialLink]);
      setNewSocialLink({ platform: '', url: '', icon: 'Globe' });
    }
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const tabs = [
    { id: 'basic', name: 'Basic Info', icon: Phone },
    { id: 'hours', name: 'Business Hours', icon: Clock },
    { id: 'social', name: 'Social Media', icon: Globe },
    { id: 'content', name: 'Page Content', icon: MessageSquare }
  ];

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
          <h2 className="text-2xl font-bold text-gray-900">Contact Page Management</h2>
          <p className="text-gray-600">Manage contact information and page content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={submitting}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          {submitting ? 'Saving...' : 'Save Changes'}
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
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Basic Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="info@ifarm.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Farm Address
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="123 Farm Road, Rural Valley, ST 12345"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Description
              </label>
              <textarea
                rows={3}
                value={contactDescription}
                onChange={(e) => setContactDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Description about contacting the farm..."
              />
            </div>
          </div>
        )}

        {activeTab === 'hours' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
            
            {/* Add New Business Hour */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Add New Business Hour</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Day(s) (e.g., Monday - Friday)"
                  value={newBusinessHour.day}
                  onChange={(e) => setNewBusinessHour({...newBusinessHour, day: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="text"
                  placeholder="Hours (e.g., 8:00 AM - 6:00 PM)"
                  value={newBusinessHour.hours}
                  onChange={(e) => setNewBusinessHour({...newBusinessHour, hours: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button
                  onClick={addBusinessHour}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </button>
              </div>
            </div>

            {/* Business Hours List */}
            <div className="space-y-3">
              {businessHours.map((hour, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{hour.day}</h4>
                    <p className="text-sm text-gray-600">{hour.hours}</p>
                  </div>
                  <button
                    onClick={() => removeBusinessHour(index)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
            
            {/* Add New Social Link */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Add New Social Link</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Platform name"
                  value={newSocialLink.platform}
                  onChange={(e) => setNewSocialLink({...newSocialLink, platform: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={newSocialLink.url}
                  onChange={(e) => setNewSocialLink({...newSocialLink, url: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <select
                  value={newSocialLink.icon}
                  onChange={(e) => setNewSocialLink({...newSocialLink, icon: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <button
                  onClick={addSocialLink}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </button>
              </div>
            </div>

            {/* Social Links List */}
            <div className="space-y-3">
              {socialLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{link.platform}</h4>
                    <p className="text-sm text-gray-600">{link.url}</p>
                    <span className="text-xs text-gray-500">Icon: {link.icon}</span>
                  </div>
                  <button
                    onClick={() => removeSocialLink(index)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Page Content</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Section Title
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Get In Touch"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Section Description
              </label>
              <textarea
                rows={3}
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Main description for the contact page..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Map Section Description
              </label>
              <textarea
                rows={2}
                value={mapDescription}
                onChange={(e) => setMapDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Description for the map section..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Newsletter Section Title
              </label>
              <input
                type="text"
                value={newsletterTitle}
                onChange={(e) => setNewsletterTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Stay Connected"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Newsletter Description
              </label>
              <textarea
                rows={2}
                value={newsletterDescription}
                onChange={(e) => setNewsletterDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Newsletter signup description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Newsletter Privacy Text
              </label>
              <input
                type="text"
                value={newsletterPrivacyText}
                onChange={(e) => setNewsletterPrivacyText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Privacy statement for newsletter..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}