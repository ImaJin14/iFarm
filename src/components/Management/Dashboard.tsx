import React from 'react';
import { BarChart3, Users, Package, Heart, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAnimals } from '../../hooks/useAnimals';
import { useBreedingRecords } from '../../hooks/useBreedingRecords';
import { useInventory } from '../../hooks/useInventory';
import LoadingSpinner from '../ui/LoadingSpinner';
import RoleGuard from '../Auth/RoleGuard';

export default function Dashboard() {
  const { user, isAdministrator, isFarmUser } = useAuth();
  const { animals, loading: animalsLoading } = useAnimals();
  const { breedingRecords, loading: breedingLoading } = useBreedingRecords();
  const { inventory, loading: inventoryLoading } = useInventory();

  if (animalsLoading || breedingLoading || inventoryLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const availableAnimals = animals.filter(animal => animal.status === 'available').length;
  const breedingAnimals = animals.filter(animal => animal.status === 'breeding').length;
  const activeBreeding = breedingRecords.filter(record => 
    record.status === 'bred' || record.status === 'planned'
  ).length;
  const lowStockItems = inventory.filter(item => 
    item.quantity <= item.low_stock_threshold
  ).length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.full_name || user?.email}
        </h2>
        <p className="text-gray-600">
          {isAdministrator() && "You have full administrative access to manage the farm website and operations."}
          {isFarmUser() && "Manage your farm operations, livestock, and inventory from this dashboard."}
        </p>
      </div>

      {/* Stats Cards - Farm Users and Administrators */}
      <RoleGuard allowedRoles={['farm', 'administrator']} hideIfNoAccess>
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
                <>
                  <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                  <span className="text-red-600 font-medium">{lowStockItems} low stock</span>
                </>
              ) : (
                <span className="text-green-600 font-medium">All items in stock</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-gray-900">$12,450</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-green-600">+12% from last month</span>
            </div>
          </div>
        </div>
      </RoleGuard>

      {/* Role-specific Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Administrator Quick Actions */}
        <RoleGuard allowedRoles={['administrator']} hideIfNoAccess>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrator Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                <h4 className="font-medium text-blue-900">Manage Site Content</h4>
                <p className="text-sm text-blue-700">Update home, about, and contact pages</p>
              </button>
              <button className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                <h4 className="font-medium text-purple-900">User Management</h4>
                <p className="text-sm text-purple-700">Manage user accounts and permissions</p>
              </button>
              <button className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                <h4 className="font-medium text-green-900">System Settings</h4>
                <p className="text-sm text-green-700">Configure farm settings and preferences</p>
              </button>
            </div>
          </div>
        </RoleGuard>

        {/* Farm User Quick Actions */}
        <RoleGuard allowedRoles={['farm', 'administrator']} hideIfNoAccess>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Operations</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                <h4 className="font-medium text-green-900">Add New Animal</h4>
                <p className="text-sm text-green-700">Register a new animal in the system</p>
              </button>
              <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                <h4 className="font-medium text-blue-900">Schedule Breeding</h4>
                <p className="text-sm text-blue-700">Plan breeding programs and track progress</p>
              </button>
              <button className="w-full text-left p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200">
                <h4 className="font-medium text-yellow-900">Update Inventory</h4>
                <p className="text-sm text-yellow-700">Manage feed, supplies, and equipment</p>
              </button>
            </div>
          </div>
        </RoleGuard>
      </div>

      {/* Recent Activity - Farm Users and Administrators */}
      <RoleGuard allowedRoles={['farm', 'administrator']} hideIfNoAccess>
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    animal.status === 'available' ? 'bg-green-100 text-green-800' :
                    animal.status === 'breeding' ? 'bg-blue-100 text-blue-800' :
                    animal.status === 'sold' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    record.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                    record.status === 'bred' ? 'bg-yellow-100 text-yellow-800' :
                    record.status === 'born' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </RoleGuard>
    </div>
  );
}