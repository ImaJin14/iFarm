import React, { useState } from 'react';
import { Plus, Package, Users, Calendar, BarChart3, Settings, Leaf } from 'lucide-react';
import AddBiProductForm from '../components/Forms/AddBiProductForm';
import { useBiProducts } from '../hooks/useBiProducts';
import { useInventory } from '../hooks/useInventory';
import { useBreedingRecords } from '../hooks/useBreedingRecords';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function Management() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddBiProductForm, setShowAddBiProductForm] = useState(false);
  
  const { biProducts, loading: biProductsLoading, error: biProductsError, refetch: refetchBiProducts } = useBiProducts();
  const { inventory, loading: inventoryLoading, error: inventoryError } = useInventory();
  const { breedingRecords, loading: breedingLoading, error: breedingError } = useBreedingRecords();

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'biproducts', name: 'Bi-Products', icon: Leaf },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'breeding', name: 'Breeding', icon: Calendar },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const handleBiProductSuccess = () => {
    setShowAddBiProductForm(false);
    refetchBiProducts();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'bred': return 'bg-yellow-100 text-yellow-800';
      case 'born': return 'bg-green-100 text-green-800';
      case 'weaned': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const lowStockItems = inventory.filter(item => item.quantity <= item.low_stock_threshold);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Farm Management</h1>
            <p className="text-gray-600 mt-2">Manage your farm operations, inventory, and breeding programs</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Bi-Products</p>
                    <p className="text-2xl font-bold text-gray-900">{biProducts.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Inventory Items</p>
                    <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Breeding Records</p>
                    <p className="text-2xl font-bold text-gray-900">{breedingRecords.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Package className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                    <p className="text-2xl font-bold text-gray-900">{lowStockItems.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Leaf className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">New bi-product added</p>
                    <p className="text-sm text-gray-500">Premium Rabbit Manure was added to inventory</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Breeding record updated</p>
                    <p className="text-sm text-gray-500">Litter born - 6 healthy kits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'biproducts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Bi-Products Management</h2>
              <button
                onClick={() => setShowAddBiProductForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Bi-Product
              </button>
            </div>

            {showAddBiProductForm ? (
              <AddBiProductForm
                onSuccess={handleBiProductSuccess}
                onCancel={() => setShowAddBiProductForm(false)}
              />
            ) : (
              <>
                {biProductsLoading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : biProductsError ? (
                  <ErrorMessage message={biProductsError} onRetry={refetchBiProducts} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {biProducts.map((product) => (
                      <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(product.availability)}`}>
                              {product.availability.replace('-', ' ')}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{product.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-green-600">${product.price}</span>
                            <span className="text-sm text-gray-500">{product.unit}</span>
                          </div>
                          <div className="mt-3">
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
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
            
            {inventoryLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : inventoryError ? (
              <ErrorMessage message={inventoryError} />
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cost
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Restocked
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inventory.map((item) => (
                        <tr key={item.id} className={item.quantity <= item.low_stock_threshold ? 'bg-red-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.unit}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {item.quantity}
                              {item.quantity <= item.low_stock_threshold && (
                                <span className="ml-2 text-red-600 font-medium">(Low Stock)</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${item.cost}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(item.last_restocked).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'breeding' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Breeding Records</h2>
            
            {breedingLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : breedingError ? (
              <ErrorMessage message={breedingError} />
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Animal Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sire/Dam
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Breeding Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expected Birth
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Litter Size
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {breedingRecords.map((record) => (
                        <tr key={record.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                              {record.animal_type.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div>Sire: {record.sire_id}</div>
                              <div>Dam: {record.dam_id}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(record.breeding_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(record.expected_birth).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.litter_size || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}