// src/pages/About.tsx
import React from 'react';
import { useAboutContent } from '../hooks/useAboutContent';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function About() {
  const { aboutContent, loading, error, refetch } = useAboutContent();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !aboutContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage 
          message="Failed to load about content" 
          onRetry={refetch} 
        />
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            About iFarm
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {aboutContent.hero_intro_text}
          </p>
        </div>

        {/* Mission Statement */}
        {aboutContent.mission_statement && (
          <div className="bg-green-50 rounded-2xl p-8 lg:p-12 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
              {aboutContent.mission_statement}
            </p>
          </div>
        )}

        {/* Values */}
        {aboutContent.values_list && aboutContent.values_list.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(aboutContent.values_list as any[]).map((value, index) => (
                <div key={index} className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💚</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        {aboutContent.history_milestones && aboutContent.history_milestones.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              {aboutContent.history_intro_text}
            </p>
            <div className="space-y-8">
              {(aboutContent.history_milestones as any[]).map((milestone, index) => (
                <div key={index} className="flex items-center space-x-6">
                  <div className="bg-green-600 text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-lg">
                    {milestone.year}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {milestone.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {aboutContent.gallery_images && aboutContent.gallery_images.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Photo Gallery
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              {aboutContent.gallery_intro_text}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aboutContent.gallery_images.map((imageUrl, index) => (
                <div key={index} className="aspect-w-16 aspect-h-12 overflow-hidden rounded-xl">
                  <img
                    src={imageUrl}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}