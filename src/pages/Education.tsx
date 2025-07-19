import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, Search, Clock, Star, ChevronRight, Users, Heart, Leaf, ExternalLink } from 'lucide-react';
import { useEducationGuides } from '../hooks/useEducationGuides';
import { useFAQs } from '../hooks/useFAQs';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function Education() {
  const { guides, loading: guidesLoading, error: guidesError, refetch: refetchGuides } = useEducationGuides();
  const { faqs, loading: faqsLoading, error: faqsError, refetch: refetchFaqs } = useFAQs();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFeatureMessage, setShowFeatureMessage] = useState('');

  // Get unique categories from guides
  const categories = ['all', ...Array.from(new Set(guides.map(guide => guide.category)))];

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });


  const handleFeatureClick = (feature: string) => {
    setShowFeatureMessage(feature);
    setTimeout(() => setShowFeatureMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Educational Resources
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Comprehensive guides and resources for animal care, breeding, and management across all species. 
              Learn from our years of experience and expert knowledge.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search guides and resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Message */}
      {showFeatureMessage && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <p>{showFeatureMessage}</p>
        </div>
      )}

      {/* Categories */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {guidesLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : guidesError ? (
            <ErrorMessage message={guidesError} onRetry={refetchGuides} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGuides.map((guide) => (
                <div key={guide.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                  <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                    <img
                      src={guide.image_url}
                      alt={guide.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {guide.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{guide.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{guide.title}</h3>
                    
                    <p className="text-gray-600 mb-4">{guide.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {guide.read_time}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          guide.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          guide.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {guide.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <Link
                      to={`/guides/${guide.id}`}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center group"
                    >
                      Read Guide
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Resources</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential resources for every animal enthusiast
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Book className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Complete Care Manual</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive 50-page guide covering all aspects of animal care, from housing to health management.
              </p>
              <button 
                onClick={() => handleFeatureClick('PDF download feature coming soon!')}
                className="text-green-600 font-medium hover:text-green-700 flex items-center"
              >
                Download PDF <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Monthly Workshops</h3>
              <p className="text-gray-600 mb-4">
                Join our hands-on workshops covering topics from basic care to advanced breeding techniques.
              </p>
              <button 
                onClick={() => handleFeatureClick('Workshop schedule feature coming soon!')}
                className="text-blue-600 font-medium hover:text-blue-700 flex items-center"
              >
                View Schedule <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Forum</h3>
              <p className="text-gray-600 mb-4">
                Connect with other animal enthusiasts, share experiences, and get expert advice from our team.
              </p>
              <button 
                onClick={() => handleFeatureClick('Community forum feature coming soon!')}
                className="text-purple-600 font-medium hover:text-purple-700 flex items-center"
              >
                Join Community <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Quick answers to common animal care questions
            </p>
          </div>

          {faqsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : faqsError ? (
            <ErrorMessage message={faqsError} onRetry={refetchFaqs} />
          ) : (
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Don't see your question answered?</p>
            <Link
              to="/contact?inquiryType=consultation&subject=Expert Consultation Request"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Contact Our Experts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}