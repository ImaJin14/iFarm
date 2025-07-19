import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Star, User, Calendar, BookOpen, Share2, Heart } from 'lucide-react';
import { useEducationGuide, useEducationGuides } from '../hooks/useEducationGuides';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>();
  const { guide, loading, error } = useEducationGuide(id || '');
  const { guides } = useEducationGuides();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? 'Error Loading Guide' : 'Guide Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The guide you're looking for doesn't exist."}
          </p>
          <Link
            to="/education"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Education
          </Link>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/education"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Education
          </Link>
        </div>
      </div>

      {/* Guide Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={guide.image_url}
              alt={guide.title}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Guide Header */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                  {guide.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(guide.difficulty)}`}>
                  {guide.difficulty}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {guide.read_time}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                  {guide.rating}
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors duration-200">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-green-600 transition-colors duration-200">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {guide.title}
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {guide.description}
              </p>
              
              <div className="text-gray-700 leading-relaxed space-y-6">
                {guide.content.split('\n').map((paragraph, index) => {
                  if (paragraph.trim() === '') return null;
                  
                  // Check if paragraph is a heading (starts with #)
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                        {paragraph.substring(2)}
                      </h2>
                    );
                  }
                  
                  // Check if paragraph is a subheading (starts with ##)
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                        {paragraph.substring(3)}
                      </h3>
                    );
                  }
                  
                  // Check if paragraph is a list item (starts with -)
                  if (paragraph.startsWith('- ')) {
                    return (
                      <li key={index} className="ml-4">
                        {paragraph.substring(2)}
                      </li>
                    );
                  }
                  
                  // Regular paragraph
                  return <p key={index}>{paragraph}</p>;
                })}
              </div>
            </div>

            {/* Guide Info Box */}
            <div className="mt-12 p-6 bg-green-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                About This Guide
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Difficulty:</span>
                  <span className="font-medium text-gray-900 ml-2">{guide.difficulty}</span>
                </div>
                <div>
                  <span className="text-gray-500">Read Time:</span>
                  <span className="font-medium text-gray-900 ml-2">{guide.read_time}</span>
                </div>
                <div>
                  <span className="text-gray-500">Rating:</span>
                  <span className="font-medium text-gray-900 ml-2">{guide.rating}/5</span>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Need More Help?</h3>
              <p className="text-gray-600 mb-4">
                Have questions about this guide or need personalized advice? Our experts are here to help.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/contact?inquiryType=consultation&subject=Question about guide"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <User className="h-4 w-4 mr-2" />
                  Contact Expert
                </Link>
                <Link
                  to="/education"
                  className="inline-flex items-center px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors duration-200"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  More Guides
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Guides */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides
              .filter(g => g.id !== guide.id && g.category === guide.category)
              .slice(0, 2)
              .map((relatedGuide) => (
                <Link
                  key={relatedGuide.id}
                  to={`/guides/${relatedGuide.id}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={relatedGuide.image_url}
                    alt={relatedGuide.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {relatedGuide.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {relatedGuide.read_time}
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{relatedGuide.title}</h3>
                    <p className="text-sm text-gray-600">{relatedGuide.description}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </article>
    </div>
  );
}