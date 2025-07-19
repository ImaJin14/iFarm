import React, { useState } from 'react';
import { Plus, Edit, Trash2, Book, HelpCircle, Star, Clock } from 'lucide-react';
import { useEducationGuides } from '../../hooks/useEducationGuides';
import { useFAQs } from '../../hooks/useFAQs';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

interface GuideFormData {
  title: string;
  category: string;
  read_time: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  description: string;
  content: string;
  image_url: string;
}

interface FAQFormData {
  question: string;
  answer: string;
}

const initialGuideFormData: GuideFormData = {
  title: '',
  category: '',
  read_time: '',
  difficulty: 'Beginner',
  rating: 4.5,
  description: '',
  content: '',
  image_url: ''
};

const initialFAQFormData: FAQFormData = {
  question: '',
  answer: ''
};

export default function EducationManagement() {
  const { guides, loading: guidesLoading, error: guidesError, refetch: refetchGuides } = useEducationGuides();
  const { faqs, loading: faqsLoading, error: faqsError, refetch: refetchFaqs } = useFAQs();
  
  const [activeTab, setActiveTab] = useState<'guides' | 'faqs'>('guides');
  const [showGuideForm, setShowGuideForm] = useState(false);
  const [showFAQForm, setShowFAQForm] = useState(false);
  const [editingGuide, setEditingGuide] = useState<string | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<string | null>(null);
  const [guideFormData, setGuideFormData] = useState<GuideFormData>(initialGuideFormData);
  const [faqFormData, setFAQFormData] = useState<FAQFormData>(initialFAQFormData);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleGuideInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGuideFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseFloat(value) || 0 : value
    }));
  };

  const handleFAQInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFAQFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      if (editingGuide) {
        const { error } = await supabase
          .from('education_guides')
          .update(guideFormData)
          .eq('id', editingGuide);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Education guide updated successfully!' });
      } else {
        const { error } = await supabase
          .from('education_guides')
          .insert([guideFormData]);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Education guide added successfully!' });
      }

      setGuideFormData(initialGuideFormData);
      setShowGuideForm(false);
      setEditingGuide(null);
      refetchGuides();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to save education guide' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFAQSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      if (editingFAQ) {
        const { error } = await supabase
          .from('faqs')
          .update(faqFormData)
          .eq('id', editingFAQ);

        if (error) throw error;
        setMessage({ type: 'success', text: 'FAQ updated successfully!' });
      } else {
        const { error } = await supabase
          .from('faqs')
          .insert([faqFormData]);

        if (error) throw error;
        setMessage({ type: 'success', text: 'FAQ added successfully!' });
      }

      setFAQFormData(initialFAQFormData);
      setShowFAQForm(false);
      setEditingFAQ(null);
      refetchFaqs();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to save FAQ' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditGuide = (guide: any) => {
    setGuideFormData({
      title: guide.title,
      category: guide.category,
      read_time: guide.read_time,
      difficulty: guide.difficulty,
      rating: guide.rating,
      description: guide.description,
      content: guide.content,
      image_url: guide.image_url
    });
    setEditingGuide(guide.id);
    setShowGuideForm(true);
  };

  const handleEditFAQ = (faq: any) => {
    setFAQFormData({
      question: faq.question,
      answer: faq.answer
    });
    setEditingFAQ(faq.id);
    setShowFAQForm(true);
  };

  const handleDeleteGuide = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education guide?')) return;

    try {
      const { error } = await supabase
        .from('education_guides')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Education guide deleted successfully!' });
      refetchGuides();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to delete education guide' 
      });
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'FAQ deleted successfully!' });
      refetchFaqs();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to delete FAQ' 
      });
    }
  };

  const resetGuideForm = () => {
    setGuideFormData(initialGuideFormData);
    setShowGuideForm(false);
    setEditingGuide(null);
  };

  const resetFAQForm = () => {
    setFAQFormData(initialFAQFormData);
    setShowFAQForm(false);
    setEditingFAQ(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Education Management</h2>
          <p className="text-gray-600">Manage educational guides and frequently asked questions</p>
        </div>
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
          <button
            onClick={() => setActiveTab('guides')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'guides'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Book className="h-4 w-4 inline mr-2" />
            Education Guides ({guides.length})
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'faqs'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <HelpCircle className="h-4 w-4 inline mr-2" />
            FAQs ({faqs.length})
          </button>
        </nav>
      </div>

      {/* Education Guides Tab */}
      {activeTab === 'guides' && (
        <div className="space-y-6">
          {/* Add Guide Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowGuideForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Education Guide
            </button>
          </div>

          {/* Guide Form */}
          {showGuideForm && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingGuide ? 'Edit Education Guide' : 'Add New Education Guide'}
                </h3>
                <button
                  onClick={resetGuideForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleGuideSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={guideFormData.title}
                      onChange={handleGuideInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., Animal Care Basics"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      required
                      value={guideFormData.category}
                      onChange={handleGuideInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., Care, Breeding, Health"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Read Time *
                    </label>
                    <input
                      type="text"
                      name="read_time"
                      required
                      value={guideFormData.read_time}
                      onChange={handleGuideInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., 10 min"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty *
                    </label>
                    <select
                      name="difficulty"
                      required
                      value={guideFormData.difficulty}
                      onChange={handleGuideInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    <input
                      type="number"
                      name="rating"
                      required
                      min="0"
                      max="5"
                      step="0.1"
                      value={guideFormData.rating}
                      onChange={handleGuideInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL *
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      required
                      value={guideFormData.image_url}
                      onChange={handleGuideInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    value={guideFormData.description}
                    onChange={handleGuideInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Brief description of the guide..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    required
                    rows={8}
                    value={guideFormData.content}
                    onChange={handleGuideInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Full content of the guide..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    {submitting ? 'Saving...' : editingGuide ? 'Update Guide' : 'Add Guide'}
                  </button>
                  <button
                    type="button"
                    onClick={resetGuideForm}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Guides List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Education Guides ({guides.length})</h3>
            </div>

            {guidesLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : guidesError ? (
              <ErrorMessage message={guidesError} onRetry={refetchGuides} />
            ) : guides.length === 0 ? (
              <div className="p-8 text-center">
                <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No education guides found. Add your first guide to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guide
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Difficulty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Read Time
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {guides.map((guide) => (
                      <tr key={guide.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={guide.image_url}
                              alt={guide.title}
                              className="h-10 w-10 rounded-lg object-cover mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{guide.title}</div>
                              <div className="text-sm text-gray-500">{guide.description.substring(0, 50)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {guide.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}>
                            {guide.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm text-gray-900">{guide.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            {guide.read_time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditGuide(guide)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteGuide(guide.id)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAQs Tab */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          {/* Add FAQ Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowFAQForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </button>
          </div>

          {/* FAQ Form */}
          {showFAQForm && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}
                </h3>
                <button
                  onClick={resetFAQForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleFAQSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question *
                  </label>
                  <input
                    type="text"
                    name="question"
                    required
                    value={faqFormData.question}
                    onChange={handleFAQInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter the frequently asked question..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer *
                  </label>
                  <textarea
                    name="answer"
                    required
                    rows={4}
                    value={faqFormData.answer}
                    onChange={handleFAQInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Provide a detailed answer..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    {submitting ? 'Saving...' : editingFAQ ? 'Update FAQ' : 'Add FAQ'}
                  </button>
                  <button
                    type="button"
                    onClick={resetFAQForm}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* FAQs List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">FAQs ({faqs.length})</h3>
            </div>

            {faqsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : faqsError ? (
              <ErrorMessage message={faqsError} onRetry={refetchFaqs} />
            ) : faqs.length === 0 ? (
              <div className="p-8 text-center">
                <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No FAQs found. Add your first FAQ to get started.</p>
              </div>
            ) : (
              <div className="space-y-6 p-6">
                {faqs.map((faq) => (
                  <div key={faq.id} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{faq.question}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditFAQ(faq)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFAQ(faq.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}