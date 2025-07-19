import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Filter, Leaf, CheckCircle, Clock } from 'lucide-react';
import { useAnimals, useAvailableAnimals } from '../hooks/useAnimals';
import { useBiProducts } from '../hooks/useBiProducts';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function Products() {
  const { animals, loading: animalsLoading, error: animalsError, refetch } = useAnimals();
  const { animals: availableAnimals, loading: availableAnimalsLoading, error: availableAnimalsError } = useAvailableAnimals();
  const { biProducts, loading: biProductsLoading, error: biProductsError } = useBiProducts();
  const [selectedAnimalType, setSelectedAnimalType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const animalTypes = ['all', 'rabbit', 'guinea-pig', 'dog', 'cat', 'fowl'];
  const categories = ['all', 'pet', 'show', 'breeding', 'working', 'meat', 'eggs'];
  const priceRanges = ['all', 'under-50', '50-200', '200-500', 'over-500'];

  const getAnimalTypeLabel = (type: string) => {
    switch (type) {
      case 'guinea-pig': return 'Guinea Pigs';
      case 'fowl': return 'Fowls';
      default: return type.charAt(0).toUpperCase() + type.slice(1) + 's';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'seasonal': return 'bg-yellow-100 text-yellow-800';
      case 'pre-order': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'in-stock': return <CheckCircle className="h-4 w-4" />;
      case 'seasonal': return <Clock className="h-4 w-4" />;
      case 'pre-order': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const filteredAnimals = animals.filter(animal => {
    if (selectedAnimalType !== 'all' && animal.type !== selectedAnimalType) return false;
    if (selectedCategory !== 'all' && !animal.description.toLowerCase().includes(selectedCategory)) return false;
    return true;
  });

  const filteredAvailableAnimals = availableAnimals.filter(animal => {
    if (selectedAnimalType !== 'all' && animal.type !== selectedAnimalType) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Premium Animals & Products
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our carefully selected animals across multiple species, each raised with exceptional care 
              and bred for specific qualities including temperament, health, and performance. Plus sustainable farm bi-products.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Animal Type:</label>
                <select
                  value={selectedAnimalType}
                  onChange={(e) => setSelectedAnimalType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Animals</option>
                  <option value="rabbit">Rabbits</option>
                  <option value="guinea-pig">Guinea Pigs</option>
                  <option value="dog">Dogs</option>
                  <option value="cat">Cats</option>
                  <option value="fowl">Fowls</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Category:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Categories</option>
                  <option value="pet">Pet & Companion</option>
                  <option value="show">Show & Exhibition</option>
                  <option value="breeding">Breeding</option>
                  <option value="working">Working</option>
                  <option value="meat">Meat Production</option>
                  <option value="eggs">Egg Production</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Price Range:</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Prices</option>
                  <option value="under-50">Under $50</option>
                  <option value="50-200">$50 - $200</option>
                  <option value="200-500">$200 - $500</option>
                  <option value="over-500">Over $500</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breeds Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Farm Animals</h2>
            <p className="text-xl text-gray-600">
              {selectedAnimalType === 'all' ? 'All our farm animals' : getAnimalTypeLabel(selectedAnimalType)}
            </p>
          </div>

          {animalsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : animalsError ? (
            <ErrorMessage message={animalsError} onRetry={refetch} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAnimals.map((animal) => (
                <div key={animal.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                  <div className="relative overflow-hidden">
                    <img
                      src={animal.image_url}
                      alt={animal.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <button 
                        onClick={() => toggleFavorite(animal.id)}
                        className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Heart className={`h-5 w-5 ${favorites.includes(animal.id) ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'}`} />
                      </button>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {getAnimalTypeLabel(animal.type).slice(0, -1)}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">4.9</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{animal.name}</h3>
                      {animal.price && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          ${animal.price}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-green-600 font-medium mb-2">{animal.breed}</p>
                    <p className="text-gray-600 mb-4">{animal.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Age:</span>
                        <span className="font-medium text-gray-900">{animal.age} months</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Weight:</span>
                        <span className="font-medium text-gray-900">{animal.weight} lbs</span>
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
                      <div className="flex flex-wrap gap-2 mb-6">
                        {animal.temperament.slice(0, 2).map((trait, index) => (
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
                      <Link
                        to={`/contact?subject=Inquiry about ${animal.name}&message=I am interested in ${animal.name}, a ${getAnimalTypeLabel(animal.type).toLowerCase().slice(0, -1)}.`}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Inquire Now
                      </Link>
                      <Link
                        to={`/animals/${animal.id}`}
                        className="px-4 py-2 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors duration-200"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Available Animals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Currently Available</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Individual animals ready for their new homes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableAnimalsLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : availableAnimalsError ? (
              <div className="col-span-full">
                <ErrorMessage message={availableAnimalsError} />
              </div>
            ) : (
              filteredAvailableAnimals.map((animal) => (
                <div key={animal.id} className="bg-gray-50 rounded-xl shadow-lg overflow-hidden">
                  <div className="relative">
                    <img
                      src={animal.image_url}
                      alt={animal.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {getAnimalTypeLabel(animal.type).slice(0, -1)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{animal.name}</h3>
                        <p className="text-green-600 font-medium">{animal.breed}</p>
                      </div>
                      {animal.price && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                          ${animal.price}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4">{animal.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">Age:</span>
                        <span className="font-medium text-gray-900 ml-2">{animal.age} months</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Weight:</span>
                        <span className="font-medium text-gray-900 ml-2">{animal.weight} lbs</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Gender:</span>
                        <span className="font-medium text-gray-900 ml-2 capitalize">{animal.gender}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Color:</span>
                        <span className="font-medium text-gray-900 ml-2">{animal.color}</span>
                      </div>
                    </div>
                    
                    <Link
                      to={`/contact?subject=Inquiry about ${animal.name}&message=I am interested in ${animal.name}, a ${getAnimalTypeLabel(animal.type).toLowerCase().slice(0, -1)}.`}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 block text-center"
                    >
                      Contact About {animal.name}
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Farm Bi-Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Sustainable Farm Bi-Products</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your garden with our premium organic fertilizers and soil amendments. 
              These natural bi-products from our healthy animals provide excellent nutrition for your plants while supporting sustainable farming practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {biProductsLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : biProductsError ? (
              <div className="col-span-full">
                <ErrorMessage message={biProductsError} />
              </div>
            ) : (
              biProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
                        {product.type}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(product.availability)}`}>
                        {getAvailabilityIcon(product.availability)}
                        <span className="capitalize">{product.availability.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                      <div className="text-right">
                        <span className="text-lg font-bold text-green-600">${product.price}</span>
                        <p className="text-xs text-gray-500">{product.unit}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Benefits:</h4>
                      <div className="flex flex-wrap gap-1">
                        {product.benefits.slice(0, 2).map((benefit, index) => (
                          <span
                            key={index}
                            className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Link
                      to={`/contact?subject=Inquiry about ${product.name}&message=I am interested in purchasing ${product.name} for my garden. Please provide more information about availability and bulk pricing.`}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 block text-center text-sm"
                    >
                      Contact About {product.name}
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bi-Products Info */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">100% Organic</h3>
                <p className="text-gray-600 text-sm">
                  All our bi-products come from healthy, naturally-raised animals with no artificial additives or chemicals.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Quality Tested</h3>
                <p className="text-gray-600 text-sm">
                  Each batch is tested for nutrient content and safety to ensure optimal results for your garden.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Sustainable Practice</h3>
                <p className="text-gray-600 text-sm">
                  By using our bi-products, you're supporting sustainable farming and reducing waste in agriculture.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive support for your animal breeding and care needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-gray-200">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Breeding Services</h3>
              <p className="text-gray-600 mb-4">
                Professional breeding services with detailed genetic planning and health monitoring across all species.
              </p>
              <p className="font-semibold text-green-600">Starting at $50</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-gray-200">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Show Preparation</h3>
              <p className="text-gray-600 mb-4">
                Expert grooming and conditioning services for show competitions across all animal types.
              </p>
              <p className="font-semibold text-green-600">Starting at $75</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-gray-200">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Consultation</h3>
              <p className="text-gray-600 mb-4">
                One-on-one consultation for breeding programs, facility setup, and care guidance for all animals.
              </p>
              <p className="font-semibold text-green-600">$100/hour</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}