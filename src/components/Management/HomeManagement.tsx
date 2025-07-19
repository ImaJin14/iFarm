import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Home, Star, Users, Calendar, Heart, Award, Leaf } from 'lucide-react';
import { useHomeContent } from '../../hooks/useHomeContent';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

interface HeroFeature {
  title: string;
  icon: string;
}

interface CTAButton {
  text: string;
  link: string;
  type: 'primary' | 'secondary';
}

interface Stat {
  label: string;
  value: string;
  icon: string;
}

export default function HomeManagement() {
  const { homeContent, loading, error, refetch } = useHomeContent();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'sections' | 'features' | 'stats'>('hero');

  // Form states
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heroBadgeText, setHeroBadgeText] = useState('');
  const [heroFeatures, setHeroFeatures] = useState<HeroFeature[]>([]);
  const [featuredSectionTitle, setFeaturedSectionTitle] = useState('');
  const [featuredSectionDescription, setFeaturedSectionDescription] = useState('');
  const [newsSectionTitle, setNewsSectionTitle] = useState('');
  const [newsSectionDescription, setNewsSectionDescription] = useState('');
  const [ctaButtons, setCtaButtons] = useState<CTAButton[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);

  // Form inputs for adding new items
  const [newFeature, setNewFeature] = useState<HeroFeature>({ title: '', icon: 'Award' });
  const [newCTAButton, setNewCTAButton] = useState<CTAButton>({ text: '', link: '', type: 'primary' });
  const [newStat, setNewStat] = useState<Stat>({ label: '', value: '', icon: 'Star' });

  const iconOptions = ['Award', 'Heart', 'Leaf', 'Star', 'Users', 'Calendar'];

  useEffect(() => {
    if (homeContent) {
      setHeroTitle(homeContent.hero_title);
      setHeroSubtitle(homeContent.hero_subtitle);
      setHeroDescription(homeContent.hero_description);
      setHeroImageUrl(homeContent.hero_image_url);
      setHeroBadgeText(homeContent.hero_badge_text);
      setHeroFeatures(homeContent.hero_features as HeroFeature[] || []);
      setFeaturedSectionTitle(homeContent.featured_section_title);
      setFeaturedSectionDescription(homeContent.featured_section_description);
      setNewsSectionTitle(homeContent.news_section_title);
      setNewsSectionDescription(homeContent.news_section_description);
      setCtaButtons(homeContent.cta_buttons as CTAButton[] || []);
      setStats(homeContent.stats as Stat[] || []);
    }
  }, [homeContent]);

  const handleSave = async () => {
    setSubmitting(true);
    setMessage(null);

    try {
      const updateData = {
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_description: heroDescription,
        hero_image_url: heroImageUrl,
        hero_badge_text: heroBadgeText,
        hero_features: heroFeatures,
        featured_section_title: featuredSectionTitle,
        featured_section_description: featuredSectionDescription,
        news_section_title: newsSectionTitle,
        news_section_description: newsSectionDescription,
        cta_buttons: ctaButtons,
        stats: stats
      };

      const { error } = await supabase
        .from('home_content')
        .update(updateData)
        .eq('id', homeContent?.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Home page content updated successfully!' });
      refetch();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to update home content' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const addFeature = () => {
    if (newFeature.title) {
      setHeroFeatures([...heroFeatures, newFeature]);
      setNewFeature({ title: '', icon: 'Award' });
    }
  };

  const removeFeature = (index: number) => {
    setHeroFeatures(heroFeatures.filter((_, i) => i !== index));
  };

  const addCTAButton = () => {
    if (newCTAButton.text && newCTAButton.link) {
      setCtaButtons([...ctaButtons, newCTAButton]);
      setNewCTAButton({ text: '', link: '', type: 'primary' });
    }
  };

  const removeCTAButton = (index: number) => {
    setCtaButtons(ctaButtons.filter((_, i) => i !== index));
  };

  const addStat = () => {
    if (newStat.label && newStat.value) {
      setStats([...stats, newStat]);
      setNewStat({ label: '', value: '', icon: 'Star' });
    }
  };

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const tabs = [
    { id: 'hero', name: 'Hero Section', icon: Home },
    { id: 'sections', name: 'Section Content', icon: Star },
    { id: 'features', name: 'Features & CTAs', icon: Award },
    { id: 'stats', name: 'Statistics', icon: Users }
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
          <h2 className="text-2xl font-bold text-gray-900">Home Page Management</h2>
          <p className="text-gray-600">Manage the content displayed on your home page</p>
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
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Hero Section Content</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Premium Livestock"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Subtitle
                </label>
                <input
                  type="text"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Breeding Farm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Description
              </label>
              <textarea
                rows={3}
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Main description for the hero section..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Image URL
                </label>
                <input
                  type="url"
                  value={heroImageUrl}
                  onChange={(e) => setHeroImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="https://example.com/hero-image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={heroBadgeText}
                  onChange={(e) => setHeroBadgeText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="15+ Years Experience"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Section Content</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Animals Section Title
              </label>
              <input
                type="text"
                value={featuredSectionTitle}
                onChange={(e) => setFeaturedSectionTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Our Featured Animals"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Animals Section Description
              </label>
              <textarea
                rows={3}
                value={featuredSectionDescription}
                onChange={(e) => setFeaturedSectionDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Description for the featured animals section..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                News Section Title
              </label>
              <input
                type="text"
                value={newsSectionTitle}
                onChange={(e) => setNewsSectionTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Latest News & Updates"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                News Section Description
              </label>
              <textarea
                rows={3}
                value={newsSectionDescription}
                onChange={(e) => setNewsSectionDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Description for the news section..."
              />
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-8">
            {/* Hero Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Features</h3>
              
              {/* Add New Feature */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-900 mb-3">Add New Feature</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Feature title"
                    value={newFeature.title}
                    onChange={(e) => setNewFeature({...newFeature, title: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <select
                    value={newFeature.icon}
                    onChange={(e) => setNewFeature({...newFeature, icon: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  <button
                    onClick={addFeature}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </button>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                {heroFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{feature.title}</h4>
                      <span className="text-xs text-gray-500">Icon: {feature.icon}</span>
                    </div>
                    <button
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-900 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Call-to-Action Buttons</h3>
              
              {/* Add New CTA Button */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-900 mb-3">Add New CTA Button</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Button text"
                    value={newCTAButton.text}
                    onChange={(e) => setNewCTAButton({...newCTAButton, text: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <input
                    type="text"
                    placeholder="Link (e.g., /products)"
                    value={newCTAButton.link}
                    onChange={(e) => setNewCTAButton({...newCTAButton, link: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <select
                    value={newCTAButton.type}
                    onChange={(e) => setNewCTAButton({...newCTAButton, type: e.target.value as 'primary' | 'secondary'})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                  </select>
                  <button
                    onClick={addCTAButton}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </button>
                </div>
              </div>

              {/* CTA Buttons List */}
              <div className="space-y-3">
                {ctaButtons.map((button, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{button.text}</h4>
                      <p className="text-sm text-gray-600">{button.link}</p>
                      <span className={`text-xs px-2 py-1 rounded ${button.type === 'primary' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {button.type}
                      </span>
                    </div>
                    <button
                      onClick={() => removeCTAButton(index)}
                      className="text-red-600 hover:text-red-900 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
            
            {/* Add New Stat */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Add New Statistic</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Label (e.g., Years Experience)"
                  value={newStat.label}
                  onChange={(e) => setNewStat({...newStat, label: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="text"
                  placeholder="Value (e.g., 15+)"
                  value={newStat.value}
                  onChange={(e) => setNewStat({...newStat, value: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <select
                  value={newStat.icon}
                  onChange={(e) => setNewStat({...newStat, icon: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <button
                  onClick={addStat}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </button>
              </div>
            </div>

            {/* Stats List */}
            <div className="space-y-3">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{stat.label}: {stat.value}</h4>
                    <span className="text-xs text-gray-500">Icon: {stat.icon}</span>
                  </div>
                  <button
                    onClick={() => removeStat(index)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}