// src/pages/Education.tsx
import React, { useState } from 'react';
import { Search, BookOpen, Clock, Star, ChevronRight } from 'lucide-react';
import { useEducationGuides } from '../hooks/useEducationGuides';
import { useFAQs } from '../hooks/useFAQs';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function Education() {
  const { guides, loading: guidesLoading, error: guidesError } = useEducationGuides();
  const { faqs, loading: faqsLoading, error: faqsError } = useFAQs();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [activeTab, setActiveTab] = useState<'guides' | 'faqs'>('guides');

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || guide.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || guide.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = [...new Set(guides.map(guide => guide.category))].filter(Boolean);
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  if (guidesLoading || faqsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (guidesError || faqsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="Failed to load education content" />
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Education Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn everything you need to know about animal care, breeding, and farm management with our comprehensive guides and resources.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('guides')}
              className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'guides'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Care Guides ({guides.length})
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'faqs'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              FAQs ({faqs.length})
            </button>
          </div>
        </div>

        {activeTab === 'guides' && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Guides
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Search guides..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">All Levels</option>
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                      setSelectedDifficulty('');
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Guides Grid */}
            {filteredGuides.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No guides found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredGuides.map((guide) => (
                  <div key={guide.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                      <img
                        src={guide.image_url}
                        alt={guide.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {guide.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          guide.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          guide.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {guide.difficulty}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{guide.title}</h3>
                      <p className="text-gray-600 mb-4">{guide.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {guide.read_time}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                          {guide.rating}
                        </div>
                      </div>

                      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center">
                        Read Guide
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'faqs' && (
          <div className="bg-white rounded-lg shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            
            {faqs.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No FAQs available at the moment.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {faqs.map((faq) => (
                  <div key={faq.id} className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}