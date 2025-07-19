import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Calendar, Weight, Palette, User } from 'lucide-react';
import { useAnimal } from '../hooks/useAnimals';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function AnimalDetail() {
  const { id } = useParams<{ id: string }>();
  const { animal, loading, error } = useAnimal(id || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? 'Error Loading Animal' : 'Animal Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The animal you're looking for is no longer available."}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Available Animals
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
            Back to Available Animals
          </Link>
        </div>
      </div>

      {/* Animal Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <img
              src={animal.image_url}
              alt={animal.name}
              className="w-full h-96 lg:h-full object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {getAnimalTypeLabel(animal.type)}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200">
                <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
              </button>
            </div>
            {animal.price && (
              <div className="absolute bottom-4 right-4">
                <span className="bg-green-600 text-white px-4 py-2 rounded-full text-lg font-bold">
                  ${animal.price}
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{animal.name}</h1>
              <p className="text-xl text-green-600 font-medium mb-4">
                {animal.breed}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">{animal.description}</p>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <span className="text-gray-500 text-sm">Age</span>
                    <p className="font-medium text-gray-900">{animal.age} months</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Weight className="h-5 w-5 text-green-600" />
                  <div>
                    <span className="text-gray-500 text-sm">Weight</span>
                    <p className="font-medium text-gray-900">{animal.weight} lbs</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-green-600" />
                  <div>
                    <span className="text-gray-500 text-sm">Gender</span>
                    <p className="font-medium text-gray-900 capitalize">{animal.gender}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Palette className="h-5 w-5 text-green-600" />
                  <div>
                    <span className="text-gray-500 text-sm">Color</span>
                    <p className="font-medium text-gray-900">{animal.color}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Attributes */}
            {animal.temperament && animal.temperament.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Temperament</h2>
                <div className="flex flex-wrap gap-2">
                  {animal.temperament.map((trait, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Health Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Health & Care</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  {animal.name} has received comprehensive health care including regular checkups, 
                  appropriate vaccinations, and preventive treatments. All health records are available 
                  for review.
                </p>
                {animal.vaccinations && animal.vaccinations.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Current Vaccinations:</h3>
                    <div className="flex flex-wrap gap-2">
                      {animal.vaccinations.map((vaccination, index) => (
                        <span
                          key={index}
                          className="bg-green-50 text-green-800 px-2 py-1 rounded text-sm"
                        >
                          {vaccination}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to={`/contact?subject=Inquiry about ${animal.name}&message=I am interested in adopting ${animal.name}, a ${getAnimalTypeLabel(animal.type).toLowerCase()}.`}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-center"
              >
                Contact About {animal.name}
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
      </div>
    </div>
  );
}