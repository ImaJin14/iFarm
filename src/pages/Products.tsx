// src/pages/Products.tsx
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useAnimals } from '../hooks/useAnimals';
import { useBreeds } from '../hooks/useBreeds';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function Products() {
  const { animals, loading, error, refetch } = useAnimals();
  const { breeds } = useBreeds();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('available');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || animal.breeds?.type === selectedType;
    const matchesStatus = !selectedStatus || animal.status === selectedStatus;
    const matchesPrice = (!priceRange.min || (animal.price && animal.price >= parseFloat(priceRange.min))) &&
                        (!priceRange.max || (animal.price && animal.price <= parseFloat(priceRange.max)));

    return matchesSearch && matchesType && matchesStatus && matchesPrice;
  });

  const animalTypes = [...new Set(breeds.map(breed => breed.type))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Our Animals
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our carefully bred and well-cared-for animals, each with their unique personality and characteristics.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Search animals..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Animal Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Types</option>
                {animalTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'guinea-pig' ? 'Guinea Pig' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="breeding">Breeding</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAnimals.length} of {animals.length} animals
          </p>
        </div>

        {/* Animals Grid */}
        {filteredAnimals.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No animals found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAnimals.map((animal) => (
              <div key={animal.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                  <img
                    src={animal.image_url}
                    alt={animal.name}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{animal.name}</h3>
                      <p className="text-sm text-green-600 font-medium">
                        {animal.breeds?.name} • {animal.breeds?.type === 'guinea-pig' ? 'Guinea Pig' : 
                         animal.breeds?.type?.charAt(0).toUpperCase() + animal.breeds?.type?.slice(1)}
                      </p>
                    </div>
                    <div className="text-right">
                      {animal.price && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          ${animal.price}
                        </span>
                      )}
                      <div className={`mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                        animal.status === 'available' ? 'bg-green-100 text-green-800' :
                        animal.status === 'breeding' ? 'bg-blue-100 text-blue-800' :
                        animal.status === 'sold' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {animal.status}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{animal.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Age:</span>
                      <span className="font-medium text-gray-900">{animal.age_months || 0} months</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Weight:</span>
                      <span className="font-medium text-gray-900">{animal.weight_lbs} lbs</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Gender:</span>
                      <span className="font-medium text-gray-900 capitalize">{animal.gender}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Color:</span>
                      <span className="font-medium text-gray-900">{animal.color}</span>
                    </div>
                  </div>

                  {animal.temperament && animal.temperament.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {animal.temperament.slice(0, 3).map((trait, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                      Contact About {animal.name}
                    </button>
                    {animal.additional_images && animal.additional_images.length > 0 && (
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                        View Gallery
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}