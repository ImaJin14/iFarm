import React, { useState, useEffect } from 'react';
import { Save, Plus, Edit, Trash2, Info, Award, Calendar, MapPin, Users, Heart, Leaf, Image } from 'lucide-react';
import { useAboutContent } from '../../hooks/useAboutContent';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

interface ValueItem {
  title: string;
  description: string;
  icon: string;
}

interface HistoryMilestone {
  year: string;
  title: string;
  icon: string;
}

interface CertificationAward {
  title: string;
  description: string;
  color: string;
}

export default function AboutManagement() {
  const { aboutContent, loading, error, refetch } = useAboutContent();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'values' | 'history' | 'certifications' | 'gallery'>('content');

  // Form states
  const [heroIntroText, setHeroIntroText] = useState('');
  const [missionStatement, setMissionStatement] = useState('');
  const [historyIntroText, setHistoryIntroText] = useState('');
  const [certificationsIntroText, setCertificationsIntroText] = useState('');
  const [galleryIntroText, setGalleryIntroText] = useState('');
  const [valuesList, setValuesList] = useState<ValueItem[]>([]);
  const [historyMilestones, setHistoryMilestones] = useState<HistoryMilestone[]>([]);
  const [certificationsAwards, setCertificationsAwards] = useState<CertificationAward[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Form inputs for adding new items
  const [newValue, setNewValue] = useState<ValueItem>({ title: '', description: '', icon: 'Heart' });
  const [newMilestone, setNewMilestone] = useState<HistoryMilestone>({ year: '', title: '', icon: 'Calendar' });
  const [newCertification, setNewCertification] = useState<CertificationAward>({ title: '', description: '', color: 'green' });
  const [newImageUrl, setNewImageUrl] = useState('');

  const iconOptions = ['Heart', 'Leaf', 'Award', 'Users', 'Calendar', 'MapPin'];
  const colorOptions = ['green', 'blue', 'yellow', 'purple', 'red', 'indigo'];

  useEffect(() => {
    if (aboutContent) {
      setHeroIntroText(aboutContent.hero_intro_text);
      setMissionStatement(aboutContent.mission_statement);
      setHistoryIntroText(aboutContent.history_intro_text);
      setCertificationsIntroText(aboutContent.certifications_intro_text);
      setGalleryIntroText(aboutContent.gallery_intro_text);
      setValuesList(aboutContent.values_list as ValueItem[] || []);
      setHistoryMilestones(aboutContent.history_milestones as HistoryMilestone[] || []);
      setCertificationsAwards(aboutContent.certifications_awards as CertificationAward[] || []);
      setGalleryImages(aboutContent.gallery_images || []);
    }
  }, [aboutContent]);

  const handleSave = async () => {
    setSubmitting(true);
    setMessage(null);

    try {
      const updateData = {
        hero_intro_text: heroIntroText,
        mission_statement: missionStatement,
        history_intro_text: historyIntroText,
        certifications_intro_text: certificationsIntroText,
        gallery_intro_text: galleryIntroText,
        values_list: valuesList,
        history_milestones: historyMilestones,
        certifications_awards: certificationsAwards,
        gallery_images: galleryImages
      };

      const { error } = await supabase
        .from('about_content')
        .update(updateData)
        .eq('id', aboutContent?.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'About page content updated successfully!' });
      refetch();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to update about content' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const addValue = () => {
    if (newValue.title && newValue.description) {
      setValuesList([...valuesList, newValue]);
      setNewValue({ title: '', description: '', icon: 'Heart' });
    }
  };

  const removeValue = (index: number) => {
    setValuesList(valuesList.filter((_, i) => i !== index));
  };

  const addMilestone = () => {
    if (newMilestone.year && newMilestone.title) {
      setHistoryMilestones([...historyMilestones, newMilestone]);
      setNewMilestone({ year: '', title: '', icon: 'Calendar' });
    }
  };

  const removeMilestone = (index: number) => {
    setHistoryMilestones(historyMilestones.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    if (newCertification.title && newCertification.description) {
      setCertificationsAwards([...certificationsAwards, newCertification]);
      setNewCertification({ title: '', description: '', color: 'green' });
    }
  };

  const removeCertification = (index: number) => {
    setCertificationsAwards(certificationsAwards.filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (newImageUrl && !galleryImages.includes(newImageUrl)) {
      setGalleryImages([...galleryImages, newImageUrl]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const tabs = [
    { id: 'content', name: 'Text Content', icon: Info },
    { id: 'values', name: 'Values', icon: Heart },
    { id: 'history', name: 'History', icon: Calendar },
    { id: 'certifications', name: 'Certifications', icon: Award },
    { id: 'gallery', name: 'Gallery', icon: Image }
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
          <h2 className="text-2xl font-bold text-gray-900">About Page Management</h2>
          <p className="text-gray-600">Manage the content displayed on your About page</p>
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
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Section Introduction
              </label>
              <textarea
                rows={3}
                value={heroIntroText}
                onChange={(e) => setHeroIntroText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Main introduction paragraph for the About page..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mission Statement
              </label>
              <textarea
                rows={4}
                value={missionStatement}
                onChange={(e) => setMissionStatement(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Your farm's mission statement..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                History Section Introduction
              </label>
              <textarea
                rows={2}
                value={historyIntroText}
                onChange={(e) => setHistoryIntroText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Introduction for the farm history section..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certifications Section Introduction
              </label>
              <textarea
                rows={2}
                value={certificationsIntroText}
                onChange={(e) => setCertificationsIntroText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Introduction for the certifications section..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery Section Introduction
              </label>
              <textarea
                rows={2}
                value={galleryIntroText}
                onChange={(e) => setGalleryIntroText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Introduction for the photo gallery section..."
              />
            </div>
          </div>
        )}

        {activeTab === 'values' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Farm Values</h3>
            
            {/* Add New Value */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Add New Value</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Value title"
                  value={newValue.title}
                  onChange={(e) => setNewValue({...newValue, title: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newValue.description}
                  onChange={(e) => setNewValue({...newValue, description: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <select
                  value={newValue.icon}
                  onChange={(e) => setNewValue({...newValue, icon: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <button
                  onClick={addValue}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </button>
              </div>
            </div>

            {/* Values List */}
            <div className="space-y-3">
              {valuesList.map((value, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{value.title}</h4>
                    <p className="text-sm text-gray-600">{value.description}</p>
                    <span className="text-xs text-gray-500">Icon: {value.icon}</span>
                  </div>
                  <button
                    onClick={() => removeValue(index)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Farm History Milestones</h3>
            
            {/* Add New Milestone */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Add New Milestone</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Year (e.g., 2015)"
                  value={newMilestone.year}
                  onChange={(e) => setNewMilestone({...newMilestone, year: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="text"
                  placeholder="Milestone description"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <select
                  value={newMilestone.icon}
                  onChange={(e) => setNewMilestone({...newMilestone, icon: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <button
                  onClick={addMilestone}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </button>
              </div>
            </div>

            {/* Milestones List */}
            <div className="space-y-3">
              {historyMilestones.map((milestone, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{milestone.year}</h4>
                    <p className="text-sm text-gray-600">{milestone.title}</p>
                    <span className="text-xs text-gray-500">Icon: {milestone.icon}</span>
                  </div>
                  <button
                    onClick={() => removeMilestone(index)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Certifications & Awards</h3>
            
            {/* Add New Certification */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Add New Certification</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Certification title"
                  value={newCertification.title}
                  onChange={(e) => setNewCertification({...newCertification, title: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newCertification.description}
                  onChange={(e) => setNewCertification({...newCertification, description: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <select
                  value={newCertification.color}
                  onChange={(e) => setNewCertification({...newCertification, color: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {colorOptions.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
                <button
                  onClick={addCertification}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </button>
              </div>
            </div>

            {/* Certifications List */}
            <div className="space-y-3">
              {certificationsAwards.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{cert.title}</h4>
                    <p className="text-sm text-gray-600">{cert.description}</p>
                    <span className={`text-xs px-2 py-1 rounded bg-${cert.color}-100 text-${cert.color}-800`}>
                      {cert.color}
                    </span>
                  </div>
                  <button
                    onClick={() => removeCertification(index)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Photo Gallery</h3>
            
            {/* Add New Image */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Add New Image</h4>
              <div className="flex space-x-4">
                <input
                  type="url"
                  placeholder="Image URL"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button
                  onClick={addImage}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </button>
              </div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Trash2 className="h-3 w-3" />
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