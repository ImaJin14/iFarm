import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Heart, ShoppingCart, Award, Info } from 'lucide-react';
import { useBreed, useBreeds } from '../hooks/useBreeds';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function BreedDetail() {
  const { id } = useParams<{ id: string }>();
  const { breed, loading, error } = useBreed(id || '');
  const { breeds } = useBreeds();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !breed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? 'Error Loading Breed' : 'Breed Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The breed you're looking for doesn't exist."}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Animals
          </Link>
        </div>
      </div>
    );
  }

  const getAnimalTypeLabel = (type: string) => {
    switch (type) {
      case 'guinea-pig': return 'Guinea Pig';
      case 'fowl': return 'Fowl';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/products"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Animals
          </Link>
        </div>
      </div>

      {/* Breed Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <img
              src={breed.image_url}
              alt={breed.name}
              className="w-full h-96 lg:h-full object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {getAnimalTypeLabel(breed.type)}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200">
                <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-bold text-gray-900">{breed.name}</h1>
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-medium text-gray-700">4.9</span>
                </div>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed">{breed.description}</p>
            </div>

            {/* Key Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-green-600" />
                Key Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Average Weight:</span>
                  <span className="font-medium text-gray-900">
                    {breed.average_weight_min && breed.average_weight_max 
                      ? `${breed.average_weight_min} - ${breed.average_weight_max} lbs`
                      : 'Varies'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Primary Use:</span>
                  <span className="font-medium text-gray-900">
                    {breed.primary_uses && breed.primary_uses.length > 0 
                      ? breed.primary_uses[0] 
                      : 'Companion'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price Range:</span>
                  <span className="font-medium text-green-600">
                    {breed.price_range_min && breed.price_range_max 
                      ? `$${breed.price_range_min} - $${breed.price_range_max}`
                      : 'Contact for pricing'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Animal Type:</span>
                  <span className="font-medium text-gray-900">{getAnimalTypeLabel(breed.type)}</span>
                </div>
              </div>
            </div>

            {/* Characteristics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-green-600" />
                Characteristics
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {(Array.isArray(breed.characteristics) ? breed.characteristics : []).map((char, index) => (
                  <div
                    key={index}
                    className="bg-green-50 text-green-800 px-3 py-2 rounded-lg text-sm font-medium text-center"
                  >
                    {typeof char === 'string' ? char : String(char)}
                  </div>
                ))}
              </div>
            </div>

            {/* Care Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Care Requirements</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  This breed requires specific care considerations based on their size, temperament, and purpose. 
                  Regular health checkups, proper nutrition, and appropriate housing are essential for their wellbeing.
                </p>
                <p>
                  Our team provides comprehensive care guides and ongoing support to ensure your new animal 
                  thrives in their new environment. We're always available for questions and guidance.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to={`/contact?subject=Inquiry about ${breed.name}&message=I am interested in learning more about the ${breed.name} breed.`}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Inquire About This Breed
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors duration-200 text-center"
              >
                Schedule Visit
              </Link>
            </div>
          </div>
        </div>

        {/* Related Breeds */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Breeds</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {breeds
              .filter(b => b.id !== breed.id && b.type === breed.type)
              .slice(0, 3)
              .map((relatedBreed) => (
                <Link
                  key={relatedBreed.id}
                  to={`/breeds/${relatedBreed.id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={relatedBreed.image_url}
                    alt={relatedBreed.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2">{relatedBreed.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{relatedBreed.description}</p>
                    <span className="text-green-600 font-medium">{relatedBreed.price_range}</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}