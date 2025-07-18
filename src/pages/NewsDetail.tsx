import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2, Heart } from 'lucide-react';
import { useNewsItem, useNews } from '../hooks/useNews';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const { newsItem: news, loading, error } = useNewsItem(id || '');
  const { newsItems } = useNews();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? 'Error Loading Article' : 'Article Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The news article you're looking for doesn't exist."}
          </p>
          <Link
            to="/news"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/news"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Article Header */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                {news.category}
              </span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(news.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
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
              {news.title}
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {news.excerpt}
              </p>
              
              <div className="text-gray-700 leading-relaxed space-y-6">
                {news.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                
                {/* Extended content for demo */}
                <p>
                  Our commitment to excellence in animal breeding extends beyond just producing healthy animals. 
                  We focus on creating sustainable practices that benefit both our animals and the environment. 
                  This approach has led us to implement innovative feeding programs, advanced health monitoring 
                  systems, and environmentally conscious facility management.
                </p>
                
                <p>
                  Each animal in our care receives individual attention and specialized care based on their 
                  specific needs. Our team of experienced professionals works tirelessly to ensure that 
                  every animal meets the highest standards of health, temperament, and genetic quality.
                </p>
                
                <p>
                  We believe in transparency and education, which is why we regularly share updates about 
                  our breeding programs, animal care practices, and farm improvements. Our goal is to not 
                  only provide exceptional animals but also to educate and support our community in 
                  responsible animal ownership and care.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 p-6 bg-green-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Interested in Learning More?</h3>
              <p className="text-gray-600 mb-4">
                Contact us to learn more about our breeding programs or to schedule a farm visit.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsItems
              .filter(item => item.id !== news.id && item.category === news.category)
              .slice(0, 2)
              .map((relatedNews) => (
                <Link
                  key={relatedNews.id}
                  to={`/news/${relatedNews.id}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={relatedNews.image_url}
                    alt={relatedNews.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2">{relatedNews.title}</h3>
                    <p className="text-sm text-gray-600">{relatedNews.excerpt}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </article>
    </div>
  );
}