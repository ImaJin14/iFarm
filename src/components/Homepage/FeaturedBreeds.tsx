import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useBreeds } from '../../hooks/useBreeds';
import { useHomeContent } from '../../hooks/useHomeContent';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function FeaturedBreeds() {
  const { breeds, loading } = useBreeds();
  const { homeContent } = useHomeContent();
  
  // Get a mix of featured animals from different types
  const featuredBreeds = breeds.slice(0, 6);

  const getAnimalTypeLabel = (type: string) => {
    switch (type) {
      case 'guinea-pig': return 'Guinea Pig';
      case 'fowl': return 'Fowl';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {homeContent?.featured_section_title || 'Our Featured Animals'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {homeContent?.featured_section_description || 'Carefully selected breeds across rabbits, guinea pigs, dogs, cats, and fowls, each known for their exceptional qualities, health, and temperament.'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBreeds.map((breed) => (
              <div key={breed.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                  <img
                    src={breed.image_url}
                    alt={breed.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{breed.name}</h3>
                      <p className="text-sm text-green-600 font-medium">{getAnimalTypeLabel(breed.type)}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {breed.price_range}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{breed.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Average Weight:</span>
                      <span className="font-medium text-gray-900">{breed.average_weight}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Primary Use:</span>
                      <span className="font-medium text-gray-900">{breed.primary_use}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {breed.characteristics.slice(0, 2).map((char, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 group"
          >
            View All Animals
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
}