import React, { useState } from 'react';
import { BarChart3, Calendar, Heart, Package, DollarSign, Settings, AlertTriangle, TrendingUp, Plus, X } from 'lucide-react';
import { useAnimals } from '../hooks/useAnimals';
import { useBreedingRecords } from '../hooks/useBreedingRecords';
import { useInventory } from '../hooks/useInventory';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Management() {
  const { animals, loading: animalsLoading } = useAnimals();
  const { breedingRecords, loading: breedingLoading, refetch: refetchBreeding } = useBreedingRecords();
  const { inventory, loading: inventoryLoading, refetch: refetchInventory } = useInventory();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showBreedingModal, setShowBreedingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inventory form state
  const [inventoryForm, setInventoryForm] = useState({
    name: '',
    category: 'feed',
    animal_types: [],
    quantity: 0,
    unit: '',
    low_stock_threshold: 0,
    cost: 0,
    supplier: '',
    last_restocked: new Date().toISOString().split('T')[0]
  });

  // Breeding record form state
  const [breedingForm, setBreedingForm] = useState({
    sire_id: '',
    dam_id: '',
    animal_type: 'rabbit',
    breeding_date: new Date().toISOString().split('T')[0],
    expected_birth: '',
    notes: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password. Use "admin123" for demo.');
    }
  };

  const handleAddInventoryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('inventory')
        .insert([inventoryForm]);

      if (error) throw error;

      // Reset form and close modal
      setInventoryForm({
        name: '',
        category: 'feed',
        animal_types: [],
        quantity: 0,
        unit: '',
        low_stock_threshold: 0,
        cost: 0,
        supplier: '',
        last_restocked: new Date().toISOString().split('T')[0]
      });
      setShowInventoryModal(false);
      refetchInventory();
      alert('Inventory item added successfully!');
    } catch (error) {
      console.error('Error adding inventory item:', error);
      alert('Failed to add inventory item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddBreedingRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate expected birth date (add gestation period based on animal type)
      const gestationPeriods = {
        rabbit: 31,
        'guinea-pig': 65,
        dog: 63,
        cat: 65,
        fowl: 21
      };

      const breedingDate = new Date(breedingForm.breeding_date);
      const gestationDays = gestationPeriods[breedingForm.animal_type as keyof typeof gestationPeriods];
      const expectedBirth = new Date(breedingDate.getTime() + gestationDays * 24 * 60 * 60 * 1000);

      const recordData = {
        ...breedingForm,
        expected_birth: expectedBirth.toISOString().split('T')[0]
      };

      const { error } = await supabase
        .from('breeding_records')
        .insert([recordData]);

      if (error) throw error;

      // Reset form and close modal
      setBreedingForm({
        sire_id: '',
        dam_id: '',
        animal_type: 'rabbit',
        breeding_date: new Date().toISOString().split('T')[0],
        expected_birth: '',
        notes: ''
      });
      setShowBreedingModal(false);
      refetchBreeding();
      alert('Breeding record added successfully!');
    } catch (error) {
      console.error('Error adding breeding record:', error);
      alert('Failed to add breeding record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnimalTypeToggle = (animalType: string) => {
    setInventoryForm(prev => ({
      ...prev,
      animal_types: prev.animal_types.includes(animalType)
        ? prev.animal_types.filter(type => type !== animalType)
        : [...prev.animal_types, animalType]
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="text-center mb-6">
            <Settings className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Farm Management Portal</h2>
            <p className="text-gray-600">Please enter your password to access the management system</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter password (demo: admin123)"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'breeding', name: 'Breeding', icon: Heart },
    { id: 'schedule', name: 'Schedule', icon: Calendar },
    { id: 'financial', name: 'Financial', icon: DollarSign }
  ];

  const totalAnimals = animals.length;
  const breedingPairs = animals.filter(a => a.status === 'breeding').length;
  const availableForSale = animals.filter(a => a.status === 'available').length;
  const lowStockItems = inventory.filter(item => item.quantity <= item.lowStockThreshold);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Farm Management Dashboard</h1>
              <p className="text-gray-600">Comprehensive farm operations management</p>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 font-medium rounded-lg transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Animals</p>
                    <p className="text-2xl font-bold text-gray-900">{totalAnimals}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+12% from last month</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Breeding Pairs</p>
                    <p className="text-2xl font-bold text-gray-900">{breedingPairs}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">Active breeding</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available for Sale</p>
                    <p className="text-2xl font-bold text-gray-900">{availableForSale}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500">Ready for new homes</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                    <p className="text-2xl font-bold text-gray-900">{lowStockItems.length}</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-red-500">Needs restocking</span>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {lowStockItems.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="text-lg font-medium text-red-800">Low Stock Alert</h3>
                </div>
                <p className="text-red-700 mt-1">
                  {lowStockItems.length} items are running low and need restocking.
                </p>
                <ul className="mt-2 text-sm text-red-600">
                  {lowStockItems.map(item => (
                    <li key={item.id}>• {item.name}: {item.quantity} {item.unit} remaining</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Breeding Activity</h3>
                {breedingLoading ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {breedingRecords.slice(0, 3).map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Breeding Record #{record.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-600">Expected: {record.expected_birth}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'born' ? 'bg-green-100 text-green-800' :
                          record.status === 'bred' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Tasks</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Health Check - Breeding Does</p>
                      <p className="text-sm text-gray-600">Due: Tomorrow</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Feed Inventory Check</p>
                      <p className="text-sm text-gray-600">Due: In 3 days</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Scheduled
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Cage Cleaning - Block A</p>
                      <p className="text-sm text-gray-600">Due: Weekly</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Recurring
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Inventory Management</h3>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  onClick={() => setShowInventoryModal(true)}
                  <Plus className="h-4 w-4 mr-2 inline" />
                  Add New Item
                </button>
              </div>
              
              {inventoryLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Item Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Low Stock</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Cost</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                          <td className="py-3 px-4 text-gray-600 capitalize">{item.category}</td>
                          <td className="py-3 px-4 text-gray-900">{item.quantity} {item.unit}</td>
                          <td className="py-3 px-4 text-gray-600">{item.low_stock_threshold} {item.unit}</td>
                          <td className="py-3 px-4 text-gray-900">${item.cost.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            {item.quantity <= item.low_stock_threshold ? (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                Low Stock
                              </span>
                            ) : (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                In Stock
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Breeding Tab */}
        {activeTab === 'breeding' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Breeding Records</h3>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  onClick={() => setShowBreedingModal(true)}
                  <Plus className="h-4 w-4 mr-2 inline" />
                  New Breeding Record
                </button>
              </div>
              
              {breedingLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Record ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Breeding Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Expected Birth</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actual Birth</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Litter Size</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {breedingRecords.map((record) => (
                        <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">#{record.id.slice(0, 8)}</td>
                          <td className="py-3 px-4 text-gray-600">{record.breeding_date}</td>
                          <td className="py-3 px-4 text-gray-600">{record.expected_birth}</td>
                          <td className="py-3 px-4 text-gray-600">{record.actual_birth || '-'}</td>
                          <td className="py-3 px-4 text-gray-900">{record.litter_size || '-'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.status === 'born' ? 'bg-green-100 text-green-800' :
                              record.status === 'bred' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Schedule Management</h3>
            <p className="text-gray-600">Schedule management features would be implemented here.</p>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Tracking</h3>
            <p className="text-gray-600">Financial tracking and reporting features would be implemented here.</p>
          </div>
        )}
      </div>

      {/* Inventory Modal */}
      {showInventoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Inventory Item</h3>
              <button
                onClick={() => setShowInventoryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddInventoryItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={inventoryForm.name}
                  onChange={(e) => setInventoryForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={inventoryForm.category}
                  onChange={(e) => setInventoryForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="feed">Feed</option>
                  <option value="medical">Medical</option>
                  <option value="equipment">Equipment</option>
                  <option value="bedding">Bedding</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Animal Types</label>
                <div className="grid grid-cols-2 gap-2">
                  {['rabbit', 'guinea-pig', 'dog', 'cat', 'fowl'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={inventoryForm.animal_types.includes(type)}
                        onChange={() => handleAnimalTypeToggle(type)}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{type.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={inventoryForm.quantity}
                    onChange={(e) => setInventoryForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={inventoryForm.unit}
                    onChange={(e) => setInventoryForm(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="lbs, bags, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={inventoryForm.low_stock_threshold}
                    onChange={(e) => setInventoryForm(prev => ({ ...prev, low_stock_threshold: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={inventoryForm.cost}
                    onChange={(e) => setInventoryForm(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier (Optional)</label>
                <input
                  type="text"
                  value={inventoryForm.supplier}
                  onChange={(e) => setInventoryForm(prev => ({ ...prev, supplier: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Supplier name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Restocked</label>
                <input
                  type="date"
                  required
                  value={inventoryForm.last_restocked}
                  onChange={(e) => setInventoryForm(prev => ({ ...prev, last_restocked: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInventoryModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Breeding Record Modal */}
      {showBreedingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Breeding Record</h3>
              <button
                onClick={() => setShowBreedingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddBreedingRecord} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sire ID</label>
                <input
                  type="text"
                  required
                  value={breedingForm.sire_id}
                  onChange={(e) => setBreedingForm(prev => ({ ...prev, sire_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Male animal ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dam ID</label>
                <input
                  type="text"
                  required
                  value={breedingForm.dam_id}
                  onChange={(e) => setBreedingForm(prev => ({ ...prev, dam_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Female animal ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Animal Type</label>
                <select
                  value={breedingForm.animal_type}
                  onChange={(e) => setBreedingForm(prev => ({ ...prev, animal_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="rabbit">Rabbit</option>
                  <option value="guinea-pig">Guinea Pig</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="fowl">Fowl</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Breeding Date</label>
                <input
                  type="date"
                  required
                  value={breedingForm.breeding_date}
                  onChange={(e) => setBreedingForm(prev => ({ ...prev, breeding_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={breedingForm.notes}
                  onChange={(e) => setBreedingForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={3}
                  placeholder="Additional notes about this breeding..."
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Expected birth date will be automatically calculated based on the animal type's gestation period.
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBreedingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}