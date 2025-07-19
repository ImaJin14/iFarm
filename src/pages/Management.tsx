import React, { useState } from 'react';
import { BarChart3, Calendar, Heart, Package, DollarSign, Settings, AlertTriangle, TrendingUp, Plus, X, Edit, PawPrint } from 'lucide-react';
import { useAnimals } from '../hooks/useAnimals';
import { useBreedingRecords } from '../hooks/useBreedingRecords';
import { useInventory } from '../hooks/useInventory';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Management() {
  const { animals, loading: animalsLoading } = useAnimals();
  const { breedingRecords, loading: breedingLoading, refetch } = useBreedingRecords();
  const { inventory, loading: inventoryLoading, refetch: refetchInventory } = useInventory();
  const [activeTab, setActiveTab] = useState('animals');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddBreedingRecordModal, setShowAddBreedingRecordModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [showEditBreedingRecordModal, setShowEditBreedingRecordModal] = useState(false);
  const [showAddAnimalModal, setShowAddAnimalModal] = useState(false);
  const [showEditAnimalModal, setShowEditAnimalModal] = useState(false);
  const [showDeleteAnimalModal, setShowDeleteAnimalModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingBreedingRecord, setEditingBreedingRecord] = useState<any>(null);
  const [currentAnimal, setCurrentAnimal] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'feed' as 'feed' | 'medical' | 'equipment' | 'bedding' | 'other',
    animal_types: [] as string[],
    quantity: 0,
    unit: '',
    low_stock_threshold: 0,
    cost: 0,
    supplier: '',
    last_restocked: new Date().toISOString().split('T')[0]
  });
  const [breedingRecordFormData, setBreedingRecordFormData] = useState({
    sire_id: '',
    dam_id: '',
    animal_type: 'rabbit' as 'rabbit' | 'guinea-pig' | 'dog' | 'cat' | 'fowl',
    breeding_date: new Date().toISOString().split('T')[0],
    expected_birth: '',
    actual_birth: '',
    litter_size: '',
    status: 'planned' as 'planned' | 'bred' | 'born' | 'weaned',
    notes: ''
  });

  const [animalFormData, setAnimalFormData] = useState({
    name: '',
    type: 'rabbit' as 'rabbit' | 'guinea-pig' | 'dog' | 'cat' | 'fowl',
    breed: '',
    age: 0,
    weight: 0,
    gender: 'male' as 'male' | 'female',
    color: '',
    status: 'available' as 'available' | 'breeding' | 'sold' | 'reserved',
    price: 0,
    description: '',
    image_url: '',
    coat_type: '',
    size: 'medium' as 'small' | 'medium' | 'large' | 'extra-large',
    temperament: '',
    vaccinations: '',
    egg_production: '',
    purpose: 'eggs' as 'eggs' | 'meat' | 'dual-purpose' | 'ornamental'
  });

  const openEditItemModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      animal_types: item.animal_types || [],
      quantity: item.quantity,
      unit: item.unit,
      low_stock_threshold: item.low_stock_threshold,
      cost: item.cost,
      supplier: item.supplier || '',
      last_restocked: item.last_restocked
    });
    setShowEditItemModal(true);
  };

  const openEditBreedingRecordModal = (record: any) => {
    setEditingBreedingRecord(record);
    setBreedingRecordFormData({
      sire_id: record.sire_id,
      dam_id: record.dam_id,
      animal_type: record.animal_type,
      breeding_date: record.breeding_date,
      expected_birth: record.expected_birth || '',
      actual_birth: record.actual_birth || '',
      litter_size: record.litter_size?.toString() || '',
      status: record.status,
      notes: record.notes || ''
    });
    setShowEditBreedingRecordModal(true);
  };

  const resetAnimalForm = () => {
    setAnimalFormData({
      name: '',
      type: 'rabbit',
      breed: '',
      age: 0,
      weight: 0,
      gender: 'male',
      color: '',
      status: 'available',
      price: 0,
      description: '',
      image_url: '',
      coat_type: '',
      size: 'medium',
      temperament: '',
      vaccinations: '',
      egg_production: '',
      purpose: 'eggs'
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password. Use "admin123" for demo.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleBreedingRecordInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setBreedingRecordFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseInt(value)) : value
    }));
  };

  const handleAnimalTypeChange = (animalType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      animal_types: checked 
        ? [...prev.animal_types, animalType]
        : prev.animal_types.filter(type => type !== animalType)
    }));
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('inventory')
        .insert([{
          name: formData.name,
          category: formData.category,
          animal_types: formData.animal_types,
          quantity: formData.quantity,
          unit: formData.unit,
          low_stock_threshold: formData.low_stock_threshold,
          cost: formData.cost,
          supplier: formData.supplier || null,
          last_restocked: formData.last_restocked
        }]);

      if (error) {
        throw error;
      }

      // Reset form and close modal
      setFormData({
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
      setShowAddItemModal(false);
      
      // Refetch inventory data
      await refetchInventory();
      
      alert('Inventory item added successfully!');
    } catch (error) {
      console.error('Error adding inventory item:', error);
      alert('Failed to add inventory item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('inventory')
        .update({
          name: formData.name,
          category: formData.category,
          animal_types: formData.animal_types,
          quantity: formData.quantity,
          unit: formData.unit,
          low_stock_threshold: formData.low_stock_threshold,
          cost: formData.cost,
          supplier: formData.supplier || null,
          last_restocked: formData.last_restocked
        })
        .eq('id', editingItem.id);

      if (error) {
        throw error;
      }

      // Reset form and close modal
      setFormData({
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
      setShowEditItemModal(false);
      setEditingItem(null);
      
      // Refetch inventory data
      await refetchInventory();
      
      alert('Inventory item updated successfully!');
    } catch (error) {
      console.error('Error updating inventory item:', error);
      alert('Failed to update inventory item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddBreedingRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate expected birth date if not provided
      let expectedBirth = breedingRecordFormData.expected_birth;
      if (!expectedBirth && breedingRecordFormData.breeding_date) {
        const breedingDate = new Date(breedingRecordFormData.breeding_date);
        // Add gestation period based on animal type
        const gestationDays = {
          'rabbit': 31,
          'guinea-pig': 68,
          'dog': 63,
          'cat': 64,
          'fowl': 21
        };
        breedingDate.setDate(breedingDate.getDate() + gestationDays[breedingRecordFormData.animal_type]);
        expectedBirth = breedingDate.toISOString().split('T')[0];
      }

      const { error } = await supabase
        .from('breeding_records')
        .insert([{
          sire_id: breedingRecordFormData.sire_id,
          dam_id: breedingRecordFormData.dam_id,
          animal_type: breedingRecordFormData.animal_type,
          breeding_date: breedingRecordFormData.breeding_date,
          expected_birth: expectedBirth,
          actual_birth: breedingRecordFormData.actual_birth || null,
          litter_size: breedingRecordFormData.litter_size ? parseInt(breedingRecordFormData.litter_size) : null,
          status: breedingRecordFormData.status,
          notes: breedingRecordFormData.notes
        }]);

      if (error) {
        throw error;
      }

      // Reset form and close modal
      setBreedingRecordFormData({
        sire_id: '',
        dam_id: '',
        animal_type: 'rabbit',
        breeding_date: new Date().toISOString().split('T')[0],
        expected_birth: '',
        actual_birth: '',
        litter_size: '',
        status: 'planned',
        notes: ''
      });
      setShowAddBreedingRecordModal(false);
      
      // Refetch breeding records data
      await refetch();
      
      alert('Breeding record added successfully!');
    } catch (error) {
      console.error('Error adding breeding record:', error);
      alert('Failed to add breeding record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBreedingRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate expected birth date if not provided
      let expectedBirth = breedingRecordFormData.expected_birth;
      if (!expectedBirth && breedingRecordFormData.breeding_date) {
        const breedingDate = new Date(breedingRecordFormData.breeding_date);
        // Add gestation period based on animal type
        const gestationDays = {
          'rabbit': 31,
          'guinea-pig': 68,
          'dog': 63,
          'cat': 64,
          'fowl': 21
        };
        breedingDate.setDate(breedingDate.getDate() + gestationDays[breedingRecordFormData.animal_type]);
        expectedBirth = breedingDate.toISOString().split('T')[0];
      }

      const { error } = await supabase
        .from('breeding_records')
        .update({
          sire_id: breedingRecordFormData.sire_id,
          dam_id: breedingRecordFormData.dam_id,
          animal_type: breedingRecordFormData.animal_type,
          breeding_date: breedingRecordFormData.breeding_date,
          expected_birth: expectedBirth,
          actual_birth: breedingRecordFormData.actual_birth || null,
          litter_size: breedingRecordFormData.litter_size ? parseInt(breedingRecordFormData.litter_size) : null,
          status: breedingRecordFormData.status,
          notes: breedingRecordFormData.notes
        })
        .eq('id', editingBreedingRecord.id);

      if (error) {
        throw error;
      }

      // Reset form and close modal
      setBreedingRecordFormData({
        sire_id: '',
        dam_id: '',
        animal_type: 'rabbit',
        breeding_date: new Date().toISOString().split('T')[0],
        expected_birth: '',
        actual_birth: '',
        litter_size: '',
        status: 'planned',
        notes: ''
      });
      setShowEditBreedingRecordModal(false);
      setEditingBreedingRecord(null);
      
      // Refetch breeding records data
      await refetch();
      
      alert('Breeding record updated successfully!');
    } catch (error) {
      console.error('Error updating breeding record:', error);
      alert('Failed to update breeding record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const animalData = {
        ...animalFormData,
        temperament: animalFormData.temperament ? animalFormData.temperament.split(',').map(t => t.trim()) : null,
        vaccinations: animalFormData.vaccinations ? animalFormData.vaccinations.split(',').map(v => v.trim()) : null,
        coat_type: animalFormData.coat_type || null,
        size: animalFormData.size || null,
        egg_production: animalFormData.egg_production || null,
        purpose: animalFormData.purpose || null,
        price: animalFormData.price || null
      };

      const { error } = await supabase
        .from('animals')
        .insert([animalData]);

      if (error) throw error;

      alert('Animal added successfully!');
      setShowAddAnimalModal(false);
      resetAnimalForm();
    } catch (error) {
      console.error('Error adding animal:', error);
      alert(`Error adding animal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAnimalClick = (animal: any) => {
    setCurrentAnimal(animal);
    setAnimalFormData({
      name: animal.name,
      type: animal.type,
      breed: animal.breed,
      age: animal.age,
      weight: animal.weight,
      gender: animal.gender,
      color: animal.color,
      status: animal.status,
      price: animal.price || 0,
      description: animal.description,
      image_url: animal.image_url,
      coat_type: animal.coat_type || '',
      size: animal.size || 'medium',
      temperament: animal.temperament ? animal.temperament.join(', ') : '',
      vaccinations: animal.vaccinations ? animal.vaccinations.join(', ') : '',
      egg_production: animal.egg_production || '',
      purpose: animal.purpose || 'eggs'
    });
    setShowEditAnimalModal(true);
  };

  const handleUpdateAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const animalData = {
        ...animalFormData,
        temperament: animalFormData.temperament ? animalFormData.temperament.split(',').map(t => t.trim()) : null,
        vaccinations: animalFormData.vaccinations ? animalFormData.vaccinations.split(',').map(v => v.trim()) : null,
        coat_type: animalFormData.coat_type || null,
        size: animalFormData.size || null,
        egg_production: animalFormData.egg_production || null,
        purpose: animalFormData.purpose || null,
        price: animalFormData.price || null
      };

      const { error } = await supabase
        .from('animals')
        .update(animalData)
        .eq('id', currentAnimal.id);

      if (error) throw error;

      alert('Animal updated successfully!');
      setShowEditAnimalModal(false);
      setCurrentAnimal(null);
      resetAnimalForm();
    } catch (error) {
      console.error('Error updating animal:', error);
      alert(`Error updating animal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAnimalClick = (animal: any) => {
    setCurrentAnimal(animal);
    setShowDeleteAnimalModal(true);
  };

  const handleConfirmDeleteAnimal = async () => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('animals')
        .delete()
        .eq('id', currentAnimal.id);

      if (error) throw error;

      alert('Animal deleted successfully!');
      setShowDeleteAnimalModal(false);
      setCurrentAnimal(null);
    } catch (error) {
      console.error('Error deleting animal:', error);
      alert(`Error deleting animal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
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
    { id: 'animals', name: 'Animals', icon: PawPrint },
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

        {/* Animals Tab */}
        {activeTab === 'animals' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Animal Management</h2>
                <button
                  onClick={() => setShowAddAnimalModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Animal
                </button>
              </div>

              {animalsLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Breed</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {animals.map((animal) => (
                        <tr key={animal.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img className="h-10 w-10 rounded-full object-cover" src={animal.image_url} alt={animal.name} />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{animal.name}</div>
                                <div className="text-sm text-gray-500">{animal.color}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{animal.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{animal.breed}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{animal.age} months</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              animal.status === 'available' ? 'bg-green-100 text-green-800' :
                              animal.status === 'breeding' ? 'bg-blue-100 text-blue-800' :
                              animal.status === 'sold' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {animal.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {animal.price ? `$${animal.price}` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleEditAnimalClick(animal)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAnimalClick(animal)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <X className="h-4 w-4" />
                            </button>
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

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Inventory Management</h3>
                <button 
                  onClick={() => setShowAddItemModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
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
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
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
                          <td className="py-3 px-4">
                            <button
                              onClick={() => openEditItemModal(item)}
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
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
                <button 
                  onClick={() => setShowAddBreedingRecordModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
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
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
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
                          <td className="py-3 px-4">
                            <button
                              onClick={() => openEditBreedingRecordModal(record)}
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
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

      {/* Add Animal Modal */}
      {showAddAnimalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Animal</h3>
            <form onSubmit={handleAddAnimal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={animalFormData.name}
                    onChange={(e) => setAnimalFormData({...animalFormData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    required
                    value={animalFormData.type}
                    onChange={(e) => setAnimalFormData({...animalFormData, type: e.target.value as any})}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Breed *</label>
                  <input
                    type="text"
                    required
                    value={animalFormData.breed}
                    onChange={(e) => setAnimalFormData({...animalFormData, breed: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age (months) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={animalFormData.age}
                    onChange={(e) => setAnimalFormData({...animalFormData, age: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    value={animalFormData.weight}
                    onChange={(e) => setAnimalFormData({...animalFormData, weight: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select
                    required
                    value={animalFormData.gender}
                    onChange={(e) => setAnimalFormData({...animalFormData, gender: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color *</label>
                  <input
                    type="text"
                    required
                    value={animalFormData.color}
                    onChange={(e) => setAnimalFormData({...animalFormData, color: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    required
                    value={animalFormData.status}
                    onChange={(e) => setAnimalFormData({...animalFormData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="available">Available</option>
                    <option value="breeding">Breeding</option>
                    <option value="sold">Sold</option>
                    <option value="reserved">Reserved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={animalFormData.price}
                    onChange={(e) => setAnimalFormData({...animalFormData, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                  <input
                    type="url"
                    required
                    value={animalFormData.image_url}
                    onChange={(e) => setAnimalFormData({...animalFormData, image_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coat Type</label>
                  <input
                    type="text"
                    value={animalFormData.coat_type}
                    onChange={(e) => setAnimalFormData({...animalFormData, coat_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <select
                    value={animalFormData.size}
                    onChange={(e) => setAnimalFormData({...animalFormData, size: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={animalFormData.description}
                  onChange={(e) => setAnimalFormData({...animalFormData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperament (comma-separated)</label>
                <input
                  type="text"
                  value={animalFormData.temperament}
                  onChange={(e) => setAnimalFormData({...animalFormData, temperament: e.target.value})}
                  placeholder="e.g., Friendly, Calm, Energetic"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vaccinations (comma-separated)</label>
                <input
                  type="text"
                  value={animalFormData.vaccinations}
                  onChange={(e) => setAnimalFormData({...animalFormData, vaccinations: e.target.value})}
                  placeholder="e.g., Rabies, DHPP, Bordetella"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              {animalFormData.type === 'fowl' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Egg Production</label>
                    <input
                      type="text"
                      value={animalFormData.egg_production}
                      onChange={(e) => setAnimalFormData({...animalFormData, egg_production: e.target.value})}
                      placeholder="e.g., 250 eggs/year"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                    <select
                      value={animalFormData.purpose}
                      onChange={(e) => setAnimalFormData({...animalFormData, purpose: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="eggs">Eggs</option>
                      <option value="meat">Meat</option>
                      <option value="dual-purpose">Dual Purpose</option>
                      <option value="ornamental">Ornamental</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Animal'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAnimalModal(false);
                    resetAnimalForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Animal Modal */}
      {showEditAnimalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Animal</h3>
            <form onSubmit={handleUpdateAnimal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={animalFormData.name}
                    onChange={(e) => setAnimalFormData({...animalFormData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    required
                    value={animalFormData.type}
                    onChange={(e) => setAnimalFormData({...animalFormData, type: e.target.value as any})}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Breed *</label>
                  <input
                    type="text"
                    required
                    value={animalFormData.breed}
                    onChange={(e) => setAnimalFormData({...animalFormData, breed: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age (months) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={animalFormData.age}
                    onChange={(e) => setAnimalFormData({...animalFormData, age: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    value={animalFormData.weight}
                    onChange={(e) => setAnimalFormData({...animalFormData, weight: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select
                    required
                    value={animalFormData.gender}
                    onChange={(e) => setAnimalFormData({...animalFormData, gender: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color *</label>
                  <input
                    type="text"
                    required
                    value={animalFormData.color}
                    onChange={(e) => setAnimalFormData({...animalFormData, color: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    required
                    value={animalFormData.status}
                    onChange={(e) => setAnimalFormData({...animalFormData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="available">Available</option>
                    <option value="breeding">Breeding</option>
                    <option value="sold">Sold</option>
                    <option value="reserved">Reserved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={animalFormData.price}
                    onChange={(e) => setAnimalFormData({...animalFormData, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                  <input
                    type="url"
                    required
                    value={animalFormData.image_url}
                    onChange={(e) => setAnimalFormData({...animalFormData, image_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coat Type</label>
                  <input
                    type="text"
                    value={animalFormData.coat_type}
                    onChange={(e) => setAnimalFormData({...animalFormData, coat_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <select
                    value={animalFormData.size}
                    onChange={(e) => setAnimalFormData({...animalFormData, size: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={animalFormData.description}
                  onChange={(e) => setAnimalFormData({...animalFormData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperament (comma-separated)</label>
                <input
                  type="text"
                  value={animalFormData.temperament}
                  onChange={(e) => setAnimalFormData({...animalFormData, temperament: e.target.value})}
                  placeholder="e.g., Friendly, Calm, Energetic"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vaccinations (comma-separated)</label>
                <input
                  type="text"
                  value={animalFormData.vaccinations}
                  onChange={(e) => setAnimalFormData({...animalFormData, vaccinations: e.target.value})}
                  placeholder="e.g., Rabies, DHPP, Bordetella"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              {animalFormData.type === 'fowl' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Egg Production</label>
                    <input
                      type="text"
                      value={animalFormData.egg_production}
                      onChange={(e) => setAnimalFormData({...animalFormData, egg_production: e.target.value})}
                      placeholder="e.g., 250 eggs/year"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                    <select
                      value={animalFormData.purpose}
                      onChange={(e) => setAnimalFormData({...animalFormData, purpose: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="eggs">Eggs</option>
                      <option value="meat">Meat</option>
                      <option value="dual-purpose">Dual Purpose</option>
                      <option value="ornamental">Ornamental</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Animal'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditAnimalModal(false);
                    setCurrentAnimal(null);
                    resetAnimalForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Animal Confirmation Modal */}
      {showDeleteAnimalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Animal</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{currentAnimal?.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleConfirmDeleteAnimal}
                disabled={isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteAnimalModal(false);
                  setCurrentAnimal(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Inventory Item</h2>
              <button
                onClick={() => {
                  setShowEditItemModal(false);
                  setEditingItem(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleEditItem} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Premium Rabbit Pellets"
                  />
                </div>

                <div>
                  <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="edit-category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="feed">Feed</option>
                    <option value="medical">Medical</option>
                    <option value="equipment">Equipment</option>
                    <option value="bedding">Bedding</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animal Types
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {['rabbit', 'guinea-pig', 'dog', 'cat', 'fowl'].map((animalType) => (
                    <label key={animalType} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.animal_types.includes(animalType)}
                        onChange={(e) => handleAnimalTypeChange(animalType, e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {animalType === 'guinea-pig' ? 'Guinea Pig' : animalType}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="edit-quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Quantity *
                  </label>
                  <input
                    type="number"
                    id="edit-quantity"
                    name="quantity"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="edit-unit" className="block text-sm font-medium text-gray-700 mb-2">
                    Unit *
                  </label>
                  <input
                    type="text"
                    id="edit-unit"
                    name="unit"
                    required
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., lbs, bags, bottles"
                  />
                </div>

                <div>
                  <label htmlFor="edit-low_stock_threshold" className="block text-sm font-medium text-gray-700 mb-2">
                    Low Stock Alert *
                  </label>
                  <input
                    type="number"
                    id="edit-low_stock_threshold"
                    name="low_stock_threshold"
                    required
                    min="0"
                    value={formData.low_stock_threshold}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="edit-cost" className="block text-sm font-medium text-gray-700 mb-2">
                    Cost per Unit *
                  </label>
                  <input
                    type="number"
                    id="edit-cost"
                    name="cost"
                    required
                    min="0"
                    step="0.01"
                    value={formData.cost}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="edit-supplier" className="block text-sm font-medium text-gray-700 mb-2">
                    Supplier
                  </label>
                  <input
                    type="text"
                    id="edit-supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Farm Supply Co."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-last_restocked" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Restocked Date *
                </label>
                <input
                  type="date"
                  id="edit-last_restocked"
                  name="last_restocked"
                  required
                  value={formData.last_restocked}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditItemModal(false);
                    setEditingItem(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Item
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Breeding Record Modal */}
      {showEditBreedingRecordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Breeding Record</h2>
              <button
                onClick={() => {
                  setShowEditBreedingRecordModal(false);
                  setEditingBreedingRecord(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleEditBreedingRecord} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="edit-sire_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Sire ID *
                  </label>
                  <input
                    type="text"
                    id="edit-sire_id"
                    name="sire_id"
                    required
                    value={breedingRecordFormData.sire_id}
                    onChange={handleBreedingRecordInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., BUCK001"
                  />
                </div>

                <div>
                  <label htmlFor="edit-dam_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Dam ID *
                  </label>
                  <input
                    type="text"
                    id="edit-dam_id"
                    name="dam_id"
                    required
                    value={breedingRecordFormData.dam_id}
                    onChange={handleBreedingRecordInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., DOE001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="edit-animal_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Animal Type *
                  </label>
                  <select
                    id="edit-animal_type"
                    name="animal_type"
                    required
                    value={breedingRecordFormData.animal_type}
                    onChange={handleBreedingRecordInputChange}
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
                  <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    id="edit-status"
                    name="status"
                    required
                    value={breedingRecordFormData.status}
                    onChange={handleBreedingRecordInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="planned">Planned</option>
                    <option value="bred">Bred</option>
                    <option value="born">Born</option>
                    <option value="weaned">Weaned</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="edit-breeding_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Breeding Date *
                  </label>
                  <input
                    type="date"
                    id="edit-breeding_date"
                    name="breeding_date"
                    required
                    value={breedingRecordFormData.breeding_date}
                    onChange={handleBreedingRecordInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="edit-expected_birth" className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Birth Date
                  </label>
                  <input
                    type="date"
                    id="edit-expected_birth"
                    name="expected_birth"
                    value={breedingRecordFormData.expected_birth}
                    onChange={handleBreedingRecordInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank to auto-calculate based on animal type</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="edit-actual_birth" className="block text-sm font-medium text-gray-700 mb-2">
                    Actual Birth Date
                  </label>
                  <input
                    type="date"
                    id="edit-actual_birth"
                    name="actual_birth"
                    value={breedingRecordFormData.actual_birth}
                    onChange={handleBreedingRecordInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="edit-litter_size" className="block text-sm font-medium text-gray-700 mb-2">
                    Litter Size
                  </label>
                  <input
                    type="number"
                    id="edit-litter_size"
                    name="litter_size"
                    min="0"
                    value={breedingRecordFormData.litter_size}
                    onChange={handleBreedingRecordInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Number of offspring"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  id="edit-notes"
                  name="notes"
                  rows={4}
                  value={breedingRecordFormData.notes}
                  onChange={handleBreedingRecordInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Additional notes about this breeding record..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditBreedingRecordModal(false);
                    setEditingBreedingRecord(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Record
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Inventory Item</h2>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Premium Rabbit Pellets"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="feed">Feed</option>
                    <option value="medical">Medical</option>
                    <option value="equipment">Equipment</option>
                    <option value="bedding">Bedding</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animal Types
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {['rabbit', 'guinea-pig', 'dog', 'cat', 'fowl'].map((animalType) => (
                    <label key={animalType} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.animal_types.includes(animalType)}
                        onChange={(e) => handleAnimalTypeChange(animalType, e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {animalType === 'guinea-pig' ? 'Guinea Pig' : animalType}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Quantity *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
                    Unit *
                  </label>
                  <input
                    type="text"
                    id="unit"
                    name="unit"
                    required
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., lbs, bags, bottles"
                  />
                </div>

                <div>
                  <label htmlFor="low_stock_threshold" className="block text-sm font-medium text-gray-700 mb-2">
                    Low Stock Alert *
                  </label>
                  <input
                    type="number"
                    id="low_stock_threshold"
                    name="low_stock_threshold"
                    required
                    min="0"
                    value={formData.low_stock_threshold}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-2">
                    Cost per Unit *
                  </label>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    required
                    min="0"
                    step="0.01"
                    value={formData.cost}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-2">
                    Supplier
                  </label>
                  <input
                    type="text"
                    id="supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Farm Supply Co."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="last_restocked" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Restocked Date *
                </label>
                <input
                  type="date"
                  id="last_restocked"
                  name="last_restocked"
                  required
                  value={formData.last_restocked}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Breeding Record Modal */}
      {showAddBreedingRecordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Breeding Record</h2>
              <button
                onClick={() => setShowAddBreedingRecordModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddBreedingRecord} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="sire_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Sire ID *
                  </label>
                  <input
                    type="text"
                    id="sire_id"
                    name="sire_id"
                    required
                    value={breedingRecordFormData.sire_id}
                    onChange={handleBreedingRecordInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., BUCK001"
                  />
                </div>

                <div>
                  <label htmlFor="dam_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Dam ID *
                  </label>
                  <input
                    type="text"
                    id="dam_id"
                    name="dam_id"
                    required
                    value={breedingRecordFormData.dam_id}
                    onChange={handleBreedingRecordInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., DOE001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="animal_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Animal Type *
                  </label>
                  <select
                    id="animal_type"
                    name="animal_type"
                    required
                    value={breedingRecordFormData.animal_type}
                    onChange={handleBreedingRecordInputChange}
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
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    value={breedingRecordFormData.status}
                    onChange={handleBreedingRecordInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="planned">Planned</option>
                    <option value="bred">Bred</option>
                    <option value="born">Born</option>
                    <option value="weaned">Weaned</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="breeding_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Breeding Date *
                  </label>
                  <input
                    type="date"
                    id="breeding_date"
                    name="breeding_date"
                    required
                    value={breedingRecordFormData.breeding_date}
                    onChange={handleBreedingRecordInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="expected_birth" className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Birth Date
                  </label>
                  <input
                    type="date"
                    id="expected_birth"
                    name="expected_birth"
                    value={breedingRecordFormData.expected_birth}
                    onChange={handleBreedingRecordInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank to auto-calculate based on animal type</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="actual_birth" className="block text-sm font-medium text-gray-700 mb-2">
                    Actual Birth Date
                  </label>
                  <input
                    type="date"
                    id="actual_birth"
                    name="actual_birth"
                    value={breedingRecordFormData.actual_birth}
                    onChange={handleBreedingRecordInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="litter_size" className="block text-sm font-medium text-gray-700 mb-2">
                    Litter Size
                  </label>
                  <input
                    type="number"
                    id="litter_size"
                    name="litter_size"
                    min="0"
                    value={breedingRecordFormData.litter_size}
                    onChange={handleBreedingRecordInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Number of offspring"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={breedingRecordFormData.notes}
                  onChange={handleBreedingRecordInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Additional notes about this breeding record..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddBreedingRecordModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Record
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}