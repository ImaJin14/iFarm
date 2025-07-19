import React, { useState } from 'react';
import { Plus, Edit, Trash2, Heart, Calendar, Weight, User } from 'lucide-react';
import { useAnimals } from '../../hooks/useAnimals';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

interface AnimalFormData {
  name: string;
  type: 'rabbit' | 'guinea-pig' | 'dog' | 'cat' | 'fowl';
  breed: string;
  age: number;
  weight: number;
  gender: 'male' | 'female';
  color: string;
  status: 'available' | 'breeding' | 'sold' | 'reserved';
  price: number;
  description: string;
  image_url: string;
  coat_type: string;
  size: 'small' | 'medium' | 'large' | 'extra-large';
  temperament: string[];
  vaccinations: string[];
  egg_production: string;
  purpose: 'eggs' | 'meat' | 'dual-purpose' | 'ornamental';
}

const initialFormData: AnimalFormData = {
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
  temperament: [],
  vaccinations: [],
  egg_production: '',
  purpose: 'dual-purpose'
};

export default function AnimalsManagement() {
  const { animals, loading, error, refetch } = useAnimals();
  const [showForm, setShowForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<string | null>(null);
  const [formData, setFormData] = useState<AnimalFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [temperamentInput, setTemperamentInput] = useState('');
  const [vaccinationInput, setVaccinationInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['age', 'weight', 'price'].includes(name) ? parseFloat(value) || 0 : value
    }));
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

  const addVaccination = () => {
    if (vaccinationInput.trim() && !formData.vaccinations.includes(vaccinationInput.trim())) {
      setFormData(prev => ({
        ...prev,
        vaccinations: [...prev.vaccinations, vaccinationInput.trim()]
      }));
      setVaccinationInput('');
    }
  };

  const removeVaccination = (vaccination: string) => {
    setFormData(prev => ({
      ...prev,
      vaccinations: prev.vaccinations.filter(v => v !== vaccination)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const submitData = {
        ...formData,
        coat_type: formData.coat_type || null,
        egg_production: formData.egg_production || null,
        purpose: formData.type === 'fowl' ? formData.purpose : null,
        size: ['dog', 'cat'].includes(formData.type) ? formData.size : null
      };

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
      temperament: animal.temperament || [],
      vaccinations: animal.vaccinations || [],
      egg_production: animal.egg_production || '',
      purpose: animal.purpose || 'dual-purpose'
    });
    setEditingAnimal(animal.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this animal?')) return;

    try {
      const { error } = await supabase
        .from('animals')
        .delete()
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
    setVaccinationInput('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'breeding': return 'bg-blue-100 text-blue-800';
      case 'sold': return 'bg-gray-100 text-gray-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
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

  if (loading) {
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
                  Animal Type *
                </label>
                <select
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breed *
                </label>
                <input
                  type="text"
                  name="breed"
                  required
                  value={formData.breed}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Holland Lop"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age (months) *
                </label>
                <input
                  type="number"
                  name="age"
                  required
                  min="0"
                  value={formData.age}
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
                  name="weight"
                  required
                  min="0"
                  step="0.1"
                  value={formData.weight}
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

              {/* Conditional fields based on animal type */}
              {(['guinea-pig', 'cat'].includes(formData.type)) && (
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

              {(['dog', 'cat'].includes(formData.type)) && (
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

              {formData.type === 'fowl' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Egg Production
                    </label>
                    <input
                      type="text"
                      name="egg_production"
                      value={formData.egg_production}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., 250 eggs/year"
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

            {/* Temperament */}
            {(['dog', 'cat'].includes(formData.type)) && (
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

            {/* Vaccinations */}
            {(['dog', 'cat'].includes(formData.type)) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vaccinations
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={vaccinationInput}
                    onChange={(e) => setVaccinationInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Add a vaccination..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVaccination())}
                  />
                  <button
                    type="button"
                    onClick={addVaccination}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.vaccinations.map((vaccination, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {vaccination}
                      <button
                        type="button"
                        onClick={() => removeVaccination(vaccination)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

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
                      <div className="text-sm text-gray-900">{getAnimalTypeLabel(animal.type)}</div>
                      <div className="text-sm text-gray-500">{animal.breed}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {animal.age} months
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Weight className="h-4 w-4 mr-1 text-gray-400" />
                        {animal.weight} lbs
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(animal.status)}`}>
                        {animal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {animal.price ? `$${animal.price}` : 'N/A'}
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