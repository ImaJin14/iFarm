import React, { useState } from 'react';
import { Plus, Edit, Trash2, Heart, Calendar, Baby, Users } from 'lucide-react';
import { useBreedingRecords } from '../../hooks/useBreedingRecords';
import { useAnimals } from '../../hooks/useAnimals';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

interface BreedingFormData {
  sire_id: string;
  dam_id: string;
  animal_type: 'rabbit' | 'guinea-pig' | 'dog' | 'cat' | 'fowl';
  breeding_date: string;
  expected_birth: string;
  actual_birth: string;
  litter_size: number;
  status: 'planned' | 'bred' | 'born' | 'weaned';
  notes: string;
}

const initialFormData: BreedingFormData = {
  sire_id: '',
  dam_id: '',
  animal_type: 'rabbit',
  breeding_date: new Date().toISOString().split('T')[0],
  expected_birth: '',
  actual_birth: '',
  litter_size: 0,
  status: 'planned',
  notes: ''
};

export default function BreedingManagement() {
  const { breedingRecords, loading, error, refetch } = useBreedingRecords();
  const { animals } = useAnimals();
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [formData, setFormData] = useState<BreedingFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'litter_size' ? parseInt(value) || 0 : value
    }));
  };

  const calculateExpectedBirth = (breedingDate: string, animalType: string) => {
    if (!breedingDate) return '';
    
    const gestationPeriods = {
      'rabbit': 31,
      'guinea-pig': 68,
      'dog': 63,
      'cat': 64,
      'fowl': 21
    };
    
    const date = new Date(breedingDate);
    date.setDate(date.getDate() + gestationPeriods[animalType as keyof typeof gestationPeriods]);
    return date.toISOString().split('T')[0];
  };

  const handleBreedingDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const breedingDate = e.target.value;
    setFormData(prev => ({
      ...prev,
      breeding_date: breedingDate,
      expected_birth: calculateExpectedBirth(breedingDate, prev.animal_type)
    }));
  };

  const handleAnimalTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const animalType = e.target.value;
    setFormData(prev => ({
      ...prev,
      animal_type: animalType as any,
      expected_birth: calculateExpectedBirth(prev.breeding_date, animalType),
      sire_id: '',
      dam_id: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const submitData = {
        ...formData,
        actual_birth: formData.actual_birth || null,
        litter_size: formData.litter_size || null
      };

      if (editingRecord) {
        const { error } = await supabase
          .from('breeding_records')
          .update(submitData)
          .eq('id', editingRecord);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Breeding record updated successfully!' });
      } else {
        const { error } = await supabase
          .from('breeding_records')
          .insert([submitData]);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Breeding record added successfully!' });
      }

      setFormData(initialFormData);
      setShowForm(false);
      setEditingRecord(null);
      refetch();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to save breeding record' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (record: any) => {
    setFormData({
      sire_id: record.sire_id,
      dam_id: record.dam_id,
      animal_type: record.animal_type,
      breeding_date: record.breeding_date,
      expected_birth: record.expected_birth,
      actual_birth: record.actual_birth || '',
      litter_size: record.litter_size || 0,
      status: record.status,
      notes: record.notes
    });
    setEditingRecord(record.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this breeding record?')) return;

    try {
      const { error } = await supabase
        .from('breeding_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Breeding record deleted successfully!' });
      refetch();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to delete breeding record' 
      });
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setShowForm(false);
    setEditingRecord(null);
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

  const getAvailableAnimals = (gender: 'male' | 'female') => {
    return animals.filter(animal => 
      animal.type === formData.animal_type && 
      animal.gender === gender &&
      animal.status === 'breeding'
    );
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
          <h2 className="text-2xl font-bold text-gray-900">Breeding Management</h2>
          <p className="text-gray-600">Track breeding programs and offspring records</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Breeding Record
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
              {editingRecord ? 'Edit Breeding Record' : 'Add New Breeding Record'}
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
                  Animal Type *
                </label>
                <select
                  name="animal_type"
                  required
                  value={formData.animal_type}
                  onChange={handleAnimalTypeChange}
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
                  Status *
                </label>
                <select
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="planned">Planned</option>
                  <option value="bred">Bred</option>
                  <option value="born">Born</option>
                  <option value="weaned">Weaned</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sire (Male) *
                </label>
                <select
                  name="sire_id"
                  required
                  value={formData.sire_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Sire</option>
                  {getAvailableAnimals('male').map((animal) => (
                    <option key={animal.id} value={animal.name}>
                      {animal.name} - {animal.breed}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dam (Female) *
                </label>
                <select
                  name="dam_id"
                  required
                  value={formData.dam_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Dam</option>
                  {getAvailableAnimals('female').map((animal) => (
                    <option key={animal.id} value={animal.name}>
                      {animal.name} - {animal.breed}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breeding Date *
                </label>
                <input
                  type="date"
                  name="breeding_date"
                  required
                  value={formData.breeding_date}
                  onChange={handleBreedingDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Birth Date
                </label>
                <input
                  type="date"
                  name="expected_birth"
                  value={formData.expected_birth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actual Birth Date
                </label>
                <input
                  type="date"
                  name="actual_birth"
                  value={formData.actual_birth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Litter Size
                </label>
                <input
                  type="number"
                  name="litter_size"
                  min="0"
                  value={formData.litter_size}
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
                placeholder="Additional notes about this breeding..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                {submitting ? 'Saving...' : editingRecord ? 'Update Record' : 'Add Record'}
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

      {/* Breeding Records List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Breeding Records ({breedingRecords.length})</h3>
        </div>

        {breedingRecords.length === 0 ? (
          <div className="p-8 text-center">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No breeding records found. Add your first breeding record to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parents
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Animal Type
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {breedingRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          ♂ {record.sire_id}
                        </div>
                        <div className="text-sm text-gray-500">
                          ♀ {record.dam_id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {record.animal_type.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(record.breeding_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Baby className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(record.expected_birth).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.litter_size || 'TBD'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
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