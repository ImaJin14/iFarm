import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Heart, Calendar, Weight, User } from 'lucide-react';
import { useAnimals } from '../../hooks/useAnimals';
import { useBreeds } from '../../hooks/useBreeds';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

interface AnimalFormData {
  name: string;
  breed_id: string;
  date_of_birth: string;
  weight_lbs: number;
  gender: 'male' | 'female';
  color: string;
  status: 'available' | 'breeding' | 'sold' | 'reserved' | 'retired' | 'deceased';
  price: number;
  description: string;
  image_url: string;
  coat_type: string;
  coat_length: string;
  size: 'small' | 'medium' | 'large' | 'extra-large';
  temperament: string[];
  is_breeding_quality: boolean;
  breeding_restrictions: string;
  egg_production_annual: number;
  purpose: 'eggs' | 'meat' | 'dual-purpose' | 'ornamental' | 'breeding';
  acquisition_source: string;
  acquisition_cost: number;
  registration_number: string;
  microchip_number: string;
  markings: string;
  notes: string;
  facility_id: string;
  sire_id: string;
  dam_id: string;
}

const initialFormData: AnimalFormData = {
  name: '',
  breed_id: '',
  date_of_birth: '',
  weight_lbs: 0,
  gender: 'male',
  color: '',
  status: 'available',
  price: 0,
  description: '',
  image_url: '',
  coat_type: '',
  coat_length: '',
  size: 'medium',
  temperament: [],
  is_breeding_quality: false,
  breeding_restrictions: '',
  egg_production_annual: 0,
  purpose: 'dual-purpose',
  acquisition_source: '',
  acquisition_cost: 0,
  registration_number: '',
  microchip_number: '',
  markings: '',
  notes: '',
  facility_id: '',
  sire_id: '',
  dam_id: ''
};

export default function AnimalsManagement() {
  const { animals, loading, error, refetch } = useAnimals();
  const { breeds, loading: breedsLoading } = useBreeds();
  const [facilities, setFacilities] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<string | null>(null);
  const [formData, setFormData] = useState<AnimalFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [temperamentInput, setTemperamentInput] = useState('');

  // Load facilities for the dropdown
  useEffect(() => {
    const fetchFacilities = async () => {
      const { data } = await supabase
        .from('facilities')
        .select('id, name, facility_type')
        .eq('is_active', true)
        .order('name');
      setFacilities(data || []);
    };
    fetchFacilities();
  }, []);

  // Get current breed to determine animal type
  const selectedBreed = breeds.find(b => b.id === formData.breed_id);
  const animalType = selectedBreed?.type;

  // Get potential parent animals of the same type and breeding status
  const potentialParents = animals.filter(animal => 
    animal.breeds?.type === animalType && 
    animal.is_breeding_quality &&
    animal.id !== editingAnimal
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (['weight_lbs', 'price', 'acquisition_cost', 'egg_production_annual'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addTemperament = () => {
    if (temperamentInput.trim() && !formData.temperament.includes(temperamentInput.trim())) {
      setFormData(prev => ({
        ...prev,
        temperament: [...prev.temperament, temperamentInput.trim()]
      }));
      setTemperamentInput('');
    }
  };

  const removeTemperament = (trait: string) => {
    setFormData(prev => ({
      ...prev,
      temperament: prev.temperament.filter(t => t !== trait)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      // Prepare data for submission - only include fields that have values
      const submitData: any = {
        name: formData.name,
        breed_id: formData.breed_id,
        weight_lbs: formData.weight_lbs,
        gender: formData.gender,
        color: formData.color,
        status: formData.status,
        description: formData.description,
        image_url: formData.image_url,
        is_breeding_quality: formData.is_breeding_quality
      };

      // Add optional fields only if they have values
      if (formData.date_of_birth) submitData.date_of_birth = formData.date_of_birth;
      if (formData.price > 0) submitData.price = formData.price;
      if (formData.coat_type) submitData.coat_type = formData.coat_type;
      if (formData.coat_length) submitData.coat_length = formData.coat_length;
      if (formData.size && ['dog', 'cat'].includes(animalType || '')) submitData.size = formData.size;
      if (formData.temperament.length > 0) submitData.temperament = formData.temperament;
      if (formData.breeding_restrictions) submitData.breeding_restrictions = formData.breeding_restrictions;
      if (formData.egg_production_annual > 0) submitData.egg_production_annual = formData.egg_production_annual;
      if (formData.purpose && animalType === 'fowl') submitData.purpose = formData.purpose;
      if (formData.acquisition_source) submitData.acquisition_source = formData.acquisition_source;
      if (formData.acquisition_cost > 0) submitData.acquisition_cost = formData.acquisition_cost;
      if (formData.registration_number) submitData.registration_number = formData.registration_number;
      if (formData.microchip_number) submitData.microchip_number = formData.microchip_number;
      if (formData.markings) submitData.markings = formData.markings;
      if (formData.notes) submitData.notes = formData.notes;
      if (formData.facility_id) submitData.facility_id = formData.facility_id;
      if (formData.sire_id) submitData.sire_id = formData.sire_id;
      if (formData.dam_id) submitData.dam_id = formData.dam_id;

      if (editingAnimal) {
        const { error } = await supabase
          .from('animals')
          .update(submitData)
          .eq('id', editingAnimal);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Animal updated successfully!' });
      } else {
        const { error } = await supabase
          .from('animals')
          .insert([submitData]);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Animal added successfully!' });
      }

      setFormData(initialFormData);
      setShowForm(false);
      setEditingAnimal(null);
      refetch();
    } catch (err) {
      console.error('Error saving animal:', err);
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to save animal' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (animal: any) => {
    setFormData({
      name: animal.name || '',
      breed_id: animal.breed_id || '',
      date_of_birth: animal.date_of_birth || '',
      weight_lbs: animal.weight_lbs || 0,
      gender: animal.gender || 'male',
      color: animal.color || '',
      status: animal.status || 'available',
      price: animal.price || 0,
      description: animal.description || '',
      image_url: animal.image_url || '',
      coat_type: animal.coat_type || '',
      coat_length: animal.coat_length || '',
      size: animal.size || 'medium',
      temperament: animal.temperament || [],
      is_breeding_quality: animal.is_breeding_quality || false,
      breeding_restrictions: animal.breeding_restrictions || '',
      egg_production_annual: animal.egg_production_annual || 0,
      purpose: animal.purpose || 'dual-purpose',
      acquisition_source: animal.acquisition_source || '',
      acquisition_cost: animal.acquisition_cost || 0,
      registration_number: animal.registration_number || '',
      microchip_number: animal.microchip_number || '',
      markings: animal.markings || '',
      notes: animal.notes || '',
      facility_id: animal.facility_id || '',
      sire_id: animal.sire_id || '',
      dam_id: animal.dam_id || ''
    });
    setEditingAnimal(animal.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this animal?')) return;

    try {
      const { error } = await supabase
        .from('animals')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Animal deleted successfully!' });
      refetch();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to delete animal' 
      });
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setShowForm(false);
    setEditingAnimal(null);
    setTemperamentInput('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'breeding': return 'bg-blue-100 text-blue-800';
      case 'sold': return 'bg-gray-100 text-gray-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'retired': return 'bg-purple-100 text-purple-800';
      case 'deceased': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAnimalTypeLabel = (type: string) => {
    switch (type) {
      case 'guinea-pig': return 'Guinea Pig';
      case 'fowl': return 'Fowl';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  if (loading || breedsLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Animals Management</h2>
          <p className="text-gray-600">Manage your farm animals and livestock</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Animal
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              {editingAnimal ? 'Edit Animal' : 'Add New Animal'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animal Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Fluffy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breed *
                </label>
                <select
                  name="breed_id"
                  required
                  value={formData.breed_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Breed</option>
                  {breeds.map((breed) => (
                    <option key={breed.id} value={breed.id}>
                      {breed.name} ({getAnimalTypeLabel(breed.type)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (lbs) *
                </label>
                <input
                  type="number"
                  name="weight_lbs"
                  required
                  min="0"
                  step="0.1"
                  value={formData.weight_lbs}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color *
                </label>
                <input
                  type="text"
                  name="color"
                  required
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Brown and White"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="available">Available</option>
                  <option value="breeding">Breeding</option>
                  <option value="sold">Sold</option>
                  <option value="reserved">Reserved</option>
                  <option value="retired">Retired</option>
                  <option value="deceased">Deceased</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facility
                </label>
                <select
                  name="facility_id"
                  value={formData.facility_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Facility</option>
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {facility.name} ({facility.facility_type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="image_url"
                  required
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Registration fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Microchip Number
                </label>
                <input
                  type="text"
                  name="microchip_number"
                  value={formData.microchip_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Conditional fields based on animal type */}
              {(['guinea-pig', 'cat'].includes(animalType || '')) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coat Type
                  </label>
                  <input
                    type="text"
                    name="coat_type"
                    value={formData.coat_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Short, Long, Curly"
                  />
                </div>
              )}

              {animalType === 'cat' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coat Length
                  </label>
                  <select
                    name="coat_length"
                    value={formData.coat_length}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select Length</option>
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>
              )}

              {(['dog', 'cat'].includes(animalType || '')) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                  </select>
                </div>
              )}

              {animalType === 'fowl' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Egg Production (per year)
                    </label>
                    <input
                      type="number"
                      name="egg_production_annual"
                      min="0"
                      value={formData.egg_production_annual}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., 250"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purpose
                    </label>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="eggs">Eggs</option>
                      <option value="meat">Meat</option>
                      <option value="dual-purpose">Dual Purpose</option>
                      <option value="ornamental">Ornamental</option>
                      <option value="breeding">Breeding</option>
                    </select>
                  </div>
                </>
              )}

              {/* Parent selection for breeding animals */}
              {formData.is_breeding_quality && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sire (Father)
                    </label>
                    <select
                      name="sire_id"
                      value={formData.sire_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select Sire</option>
                      {potentialParents
                        .filter(animal => animal.gender === 'male')
                        .map((animal) => (
                          <option key={animal.id} value={animal.id}>
                            {animal.name} - {animal.breed}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dam (Mother)
                    </label>
                    <select
                      name="dam_id"
                      value={formData.dam_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select Dam</option>
                      {potentialParents
                        .filter(animal => animal.gender === 'female')
                        .map((animal) => (
                          <option key={animal.id} value={animal.id}>
                            {animal.name} - {animal.breed}
                          </option>
                        ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Describe the animal's characteristics, personality, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Markings
              </label>
              <textarea
                name="markings"
                rows={2}
                value={formData.markings}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Describe any distinctive markings..."
              />
            </div>

            {/* Temperament */}
            {(['dog', 'cat'].includes(animalType || '')) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperament
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={temperamentInput}
                    onChange={(e) => setTemperamentInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Add a temperament trait..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTemperament())}
                  />
                  <button
                    type="button"
                    onClick={addTemperament}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.temperament.map((trait, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {trait}
                      <button
                        type="button"
                        onClick={() => removeTemperament(trait)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Breeding Quality and Restrictions */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_breeding_quality"
                  checked={formData.is_breeding_quality}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Breeding Quality Animal
                </label>
              </div>

              {formData.is_breeding_quality && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Breeding Restrictions
                  </label>
                  <textarea
                    name="breeding_restrictions"
                    rows={2}
                    value={formData.breeding_restrictions}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Any breeding restrictions or requirements..."
                  />
                </div>
              )}
            </div>

            {/* Acquisition Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Acquisition Source
                </label>
                <input
                  type="text"
                  name="acquisition_source"
                  value={formData.acquisition_source}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Where the animal was acquired from"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Acquisition Cost ($)
                </label>
                <input
                  type="number"
                  name="acquisition_cost"
                  min="0"
                  step="0.01"
                  value={formData.acquisition_cost}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Additional notes about this animal..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                {submitting ? 'Saving...' : editingAnimal ? 'Update Animal' : 'Add Animal'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Animals List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Current Animals ({animals.length})</h3>
        </div>

        {animals.length === 0 ? (
          <div className="p-8 text-center">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No animals found. Add your first animal to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Animal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Breed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age & Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {animals.map((animal) => (
                  <tr key={animal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={animal.image_url}
                          alt={animal.name}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{animal.name}</div>
                          <div className="text-sm text-gray-500 capitalize">{animal.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getAnimalTypeLabel(animal.type || 'rabbit')}</div>
                      <div className="text-sm text-gray-500">{animal.breed}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {animal.age_months || 0} months
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Weight className="h-4 w-4 mr-1 text-gray-400" />
                        {animal.weight_lbs} lbs
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(animal.status)}`}>
                        {animal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {animal.price ? `${animal.price}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(animal)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(animal.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}