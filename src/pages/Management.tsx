import React, { useState } from 'react';
import { Users, Package, Heart, BarChart3, Settings, Plus, Edit, Trash2, Calendar, TrendingUp, Book, Info, Phone, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAnimals } from '../hooks/useAnimals';
import { useBreedingRecords } from '../hooks/useBreedingRecords';
import { useInventory } from '../hooks/useInventory';
import { useBiProducts } from '../hooks/useBiProducts';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import BiProductsManagement from '../components/Management/BiProductsManagement';
import InventoryManagement from '../components/Management/InventoryManagement';
import BreedingManagement from '../components/Management/BreedingManagement';
import AnimalsManagement from '../components/Management/AnimalsManagement';
import EducationManagement from '../components/Management/EducationManagement';
import AboutManagement from '../components/Management/AboutManagement';
import ContactManagement from '../components/Management/ContactManagement';
import HomeManagement from '../components/Management/HomeManagement';
import NewsManagement from '../components/Management/NewsManagement';
import SettingsManagement from '../components/Management/SettingsManagement';
import Dashboard from '../components/Management/Dashboard';

export default function Management() {
  const [activeTab, setActiveTab] = useState('overview');
  const { isAdministrator, isFarmUser } = useAuth();
  const { animals, loading: animalsLoading, error: animalsError } = useAnimals();
  const { breedingRecords, loading: breedingLoading, error: breedingError } = useBreedingRecords();
  const { inventory, loading: inventoryLoading, error: inventoryError } = useInventory();
  const { biProducts, loading: biProductsLoading, error: biProductsError } = useBiProducts();

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    // Administrator-only tabs
    ...(isAdministrator() ? [
      { id: 'home', name: 'Home Page', icon: Heart },
      { id: 'about', name: 'About Page', icon: Info },
      { id: 'contact', name: 'Contact Page', icon: Phone },
      { id: 'settings', name: 'Settings', icon: Settings }
    ] : []),
    // Farm user tabs
    ...(isFarmUser() || isAdministrator() ? [
    { id: 'animals', name: 'Animals', icon: Heart },
    { id: 'breeding', name: 'Breeding', icon: Users },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'biproducts', name: 'Bi-Products', icon: Package },
    { id: 'news', name: 'News', icon: FileText },
      { id: 'education', name: 'Education', icon: Book }
    ] : [])
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'breeding': return 'bg-blue-100 text-blue-800';
      case 'sold': return 'bg-gray-100 text-gray-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBreedingStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'bred': return 'bg-yellow-100 text-yellow-800';
      case 'born': return 'bg-green-100 text-green-800';
      case 'weaned': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => {
    if (animalsLoading || breedingLoading || inventoryLoading || biProductsLoading) {
      return (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    const availableAnimals = animals.filter(animal => animal.status === 'available').length;
    const breedingAnimals = animals.filter(animal => animal.status === 'breeding').length;
    const activeBreeding = breedingRecords.filter(record => record.status === 'bred' || record.status === 'planned').length;
    const lowStockItems = inventory.filter(item => item.quantity <= item.low_stock_threshold).length;

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Animals</p>
                <p className="text-3xl font-bold text-gray-900">{animals.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <span className="text-green-600 font-medium">{availableAnimals} available</span>
              <span className="mx-2">•</span>
              <span>{breedingAnimals} breeding</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Breeding</p>
                <p className="text-3xl font-bold text-gray-900">{activeBreeding}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Breeding programs</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inventory Items</p>
                <p className="text-3xl font-bold text-gray-900">{inventory.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              {lowStockItems > 0 ? (
                <span className="text-red-600 font-medium">{lowStockItems} low stock</span>
              ) : (
                <span className="text-green-600 font-medium">All items in stock</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bi-Products</p>
                <p className="text-3xl font-bold text-gray-900">{biProducts.length}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <span>Sustainable products</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Animals</h3>
            <div className="space-y-3">
              {animals.slice(0, 5).map((animal) => (
                <div key={animal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={animal.image_url}
                      alt={animal.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{animal.name}</p>
                      <p className="text-sm text-gray-500">{animal.breed}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(animal.status)}`}>
                    {animal.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Breeding Schedule</h3>
            <div className="space-y-3">
              {breedingRecords.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{record.animal_type} Breeding</p>
                    <p className="text-sm text-gray-500">
                      Expected: {new Date(record.expected_birth).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBreedingStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnimals = () => {
    return <AnimalsManagement />;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'home':
        return <HomeManagement />;
      case 'animals':
        return renderAnimals();
      case 'breeding':
        return <BreedingManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'biproducts':
        return <BiProductsManagement />;
      case 'education':
        return <EducationManagement />;
      case 'about':
        return <AboutManagement />;
      case 'contact':
        return <ContactManagement />;
      case 'news':
        return <NewsManagement />;
      case 'settings':
        return <SettingsManagement />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Farm Management</h1>
            <p className="text-gray-600">Manage your farm operations and livestock</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg font-medium transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}