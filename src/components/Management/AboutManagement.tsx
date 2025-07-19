```typescript
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, XCircle, Image, Award, Leaf, Heart, Users, MapPin, Calendar } from 'lucide-react';
import { useAboutContent } from '../../hooks/useAboutContent';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

interface ValueItem {
  title: string;
  description: string;
}

interface HistoryMilestone {
  year: string;
  description: string;
}

interface CertificationAward {
  title: string;
  description: string;
}

interface AboutFormData {
  hero_intro_text: string;
  mission_statement: string;
  values_list: ValueItem[];
  history_intro_text: string;
  history_milestones: HistoryMilestone[];
  certifications_intro_text: string;
  certifications_awards: CertificationAward[];
  gallery_intro_text: string;
  image_urls: string[];
}

const initialFormData: AboutFormData = {
  hero_intro_text: '',
  mission_statement: '',
  values_list: [],
  history_intro_text: '',
  history_milestones: [],
  certifications_intro_text: '',
  certifications_awards: [],
  gallery_intro_text: '',
  image_urls: []
};

export default function AboutManagement() {
  const { aboutContent, loading, error, refetch } = useAboutContent();
  const [formData, setFormData] = useState<AboutFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (aboutContent) {
      setFormData({
        hero_intro_text: aboutContent.hero_intro_text,
        mission_statement: aboutContent.mission_statement,
        values_list: aboutContent.values_list as ValueItem[],
        history_intro_text: aboutContent.history_intro_text,
        history_milestones: aboutContent.history_milestones as HistoryMilestone[],
        certifications_intro_text: aboutContent.certifications_intro_text,
        certifications_awards: aboutContent.certifications_awards as CertificationAward[],
        gallery_intro_text: aboutContent.gallery_intro_text,
        image_urls: aboutContent.image_urls || []
      });
    }
  }, [aboutContent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleListChange = (listName: keyof AboutFormData, index: number, field: string, value: string) => {
    setFormData(prev => {
      const list = [...(prev[listName] as any[])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [listName]: list };
    });
  };

  const addListItem = (listName: keyof AboutFormData, newItem: any) => {
    setFormData(prev => ({
      ...prev,
      [listName]: [...(prev[listName] as any[]), newItem]
    }));
  };

  const removeListItem = (listName: keyof AboutFormData, index: number) => {
    setFormData(prev => {
      const list = [...(prev[listName] as any[])];
      list.splice(index, 1);
      return { ...prev, [listName]: list };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      if (aboutContent) {
        const { error } = await supabase
          .from('about_content')
          .update(formData)
          .eq('id', aboutContent.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'About page content updated successfully!' });
      } else {
        const { error } = await supabase
          .from('about_content')
          .insert([formData]);

        if (error) throw error;
        setMessage({ type: 'success', text: 'About page content added successfully!' });
      }
      refetch();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to save about page content' 
      });
    } finally {
      setSubmitting(false);
    }
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">About Page Management</h2>
          <p className="text-gray-600">Edit the content displayed on the About Us page</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-lg shadow-lg p-6">
        {/* Hero Section */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Hero Section</h3>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hero Introduction Text</label>
          <textarea
            name="hero_intro_text"
            rows={3}
            value={formData.hero_intro_text}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Founded in 2015, we've been dedicated to sustainable livestock farming practices..."
          />
        </div>

        {/* Mission & Values */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Mission & Values</h3>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement</label>
          <textarea
            name="mission_statement"
            rows={3}
            value={formData.mission_statement}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="To provide healthy, well-bred animals..."
          />

          <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Values</h4>
          <div className="space-y-4">
            {formData.values_list.map((item, index) => (
              <div key={index} className="flex items-end space-x-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleListChange('values_list', index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Animal Welfare"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleListChange('values_list', index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Ethical care and treatment"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeListItem('values_list', index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addListItem('values_list', { title: '', description: '' })}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Value
          </button>
        </div>

        {/* Farm History */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Farm History</h3>
          <label className="block text-sm font-medium text-gray-700 mb-2">History Introduction Text</label>
          <textarea
            name="history_intro_text"
            rows={3}
            value={formData.history_intro_text}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="From a small backyard hobby to a certified sustainable multi-species farm..."
          />

          <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Milestones</h4>
          <div className="space-y-4">
            {formData.history_milestones.map((item, index) => (
              <div key={index} className="flex items-end space-x-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={item.year}
                    onChange={(e) => handleListChange('history_milestones', index, 'year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., 2015"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleListChange('history_milestones', index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Started with rabbits..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeListItem('history_milestones', index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addListItem('history_milestones', { year: '', description: '' })}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Milestone
          </button>
        </div>

        {/* Certifications & Awards */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Certifications & Awards</h3>
          <label className="block text-sm font-medium text-gray-700 mb-2">Certifications Introduction Text</label>
          <textarea
            name="certifications_intro_text"
            rows={3}
            value={formData.certifications_intro_text}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Recognition for our commitment to excellence..."
          />

          <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Awards</h4>
          <div className="space-y-4">
            {formData.certifications_awards.map((item, index) => (
              <div key={index} className="flex items-end space-x-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleListChange('certifications_awards', index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Sustainable Farm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleListChange('certifications_awards', index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Certification 2024"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeListItem('certifications_awards', index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addListItem('certifications_awards', { title: '', description: '' })}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Award
          </button>
        </div>

        {/* Photo Gallery */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Photo Gallery</h3>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Introduction Text</label>
          <textarea
            name="gallery_intro_text"
            rows={3}
            value={formData.gallery_intro_text}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Take a visual tour of our facilities..."
          />

          <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Image URLs</h4>
          <div className="space-y-4">
            {formData.image_urls.map((url, index) => (
              <div key={index} className="flex items-end space-x-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => {
                      const newUrls = [...formData.image_urls];
                      newUrls[index] = e.target.value;
                      setFormData(prev => ({ ...prev, image_urls: newUrls }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeListItem('image_urls', index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addListItem('image_urls', '')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Image URL
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center"
          >
            {submitting ? 'Saving...' : <><Save className="h-5 w-5 mr-2" /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
}
```