import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Heart, Leaf } from 'lucide-react';
import { useHomeContent } from '../../hooks/useHomeContent';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function Hero() {
  const { homeContent, loading, error } = useHomeContent();

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Award, Heart, Leaf
    };
    return icons[iconName] || Heart;
  };

  if (loading) {
    return (
      <div className="relative bg-gradient-to-br from-green-50 to-yellow-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !homeContent) {
    return (
      <div className="relative bg-gradient-to-br from-green-50 to-yellow-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <p className="text-red-600">Failed to load home content</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-green-50 to-yellow-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {homeContent.hero_title}
                <span className="text-green-600 block">{homeContent.hero_subtitle}</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {homeContent.hero_description}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {(homeContent.hero_features as any[])?.map((feature, index) => {
                const IconComponent = getIconComponent(feature.icon);
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <IconComponent className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-700">{feature.title}</span>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {(homeContent.cta_buttons as any[])?.map((button, index) => (
                <Link
                  key={index}
                  to={button.link}
                  className={`inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                    button.type === 'primary'
                      ? 'border border-transparent text-white bg-green-600 hover:bg-green-700 group'
                      : 'border border-green-600 text-green-600 bg-white hover:bg-green-50'
                  }`}
                >
                  {button.text}
                  {button.type === 'primary' && (
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={homeContent.hero_image_url}
                alt="iFarm hero image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
              {homeContent.hero_badge_text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}