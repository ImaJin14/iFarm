// src/components/Management/HealthManagement.tsx
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Heart, Calendar, Stethoscope, Pill, AlertTriangle, CheckCircle } from 'lucide-react';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import { useAnimals } from '../../hooks/useAnimals';
import { useVeterinarians } from '../../hooks/useVeterinarians';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

interface HealthRecordFormData {
  animal_id: string;
  veterinarian_id: string;
  record_type: 'vaccination' | 'checkup' | 'treatment' | 'surgery' | 'injury' | 'illness' | 'deworming' | 'dental';
  record_date: string;
  title: string;
  description: string;
  diagnosis: string;
  treatment_details: any;
  medications_prescribed: string[];
  cost: number;
  follow_up_required: boolean;
  follow_up_date: string;
  next_due_date: string;
  notes: string;
}

interface VaccinationFormData {
  animal_id: string;
  vaccine_name: string;
  manufacturer: string;
  batch_number: string;
  administered_date: string;
  administered_by: string;
  administration_route: string;
  dose_amount: string;
  next_due_date: string;
  notes: string;
}

const initialHealthFormData: HealthRecordFormData = {
  animal_id: '',
  veterinarian_id: '',
  record_type: 'checkup',
  record_date: new Date().toISOString().split('T')[0],
  title: '',
  description: '',
  diagnosis: '',
  treatment_details: {},
  medications_prescribed: [],
  cost: 0,
  follow_up_required: false,
  follow_up_date: '',
  next_due_date: '',
  notes: ''
};

const initialVaccinationFormData: VaccinationFormData = {
  animal_id: '',
  vaccine_name: '',
  manufacturer: '',
  batch_number: '',
  administered_date: new Date().toISOString().split('T')[0],
  administered_by: '',
  administration_route: 'injection',
  dose_amount: '',
  next_due_date: '',
  notes: ''
};

export default function HealthManagement() {
  const { healthRecords, loading, error, refetch } = useHealthRecords();
  const { animals } = useAnimals();
  const { veterinarians } = useVeterinarians();
  
  const [activeTab, setActiveTab] = useState<'records' | 'vaccinations' | 'reminders'>('records');
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [showVaccinationForm, setShowVaccinationForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [healthFormData, setHealthFormData] = useState<HealthRecordFormData>(initialHealthFormData);
  const [vaccinationFormData, setVaccinationFormData] = useState<VaccinationFormData>(initialVaccinationFormData);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [medicationInput, setMedicationInput] = useState('');

  const recordTypes = ['vaccination', 'checkup', 'treatment', 'surgery', 'injury', 'illness', 'deworming', 'dental'];
  const administrationRoutes = ['injection', 'oral', 'nasal', 'topical'];

  const handleHealthInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setHealthFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'cost' ? parseFloat(value) || 0 : value
    }));
  };

  const handleVaccinationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVaccinationFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addMedication = () => {
    if (medicationInput.trim() && !healthFormData.medications_prescribed.includes(medicationInput.trim())) {
      setHealthFormData(prev => ({
        ...prev,
        medications_prescribed: [...prev.medications_prescribed, medicationInput.trim()]
      }));
      setMedicationInput('');
    }
  };

  const removeMedication = (medication: string) => {
    setHealthFormData(prev => ({
      ...prev,
      medications_prescribed: prev.medications_prescribed.filter(m => m !== medication)
    }));
  };

  const handleHealthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const submitData = {
        ...healthFormData,
        veterinarian_id: healthFormData.veterinarian_id || null,
        follow_up_date: healthFormData.follow_up_date || null,
        next_due_date: healthFormData.next_due_date || null
      };

      if (editingRecord) {
        const { error } = await supabase
          .from('health_records')
          .update(submitData)
          .eq('id', editingRecord);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Health record updated successfully!' });
      } else {
        const { error } = await supabase
          .from('health_records')
          .insert([submitData]);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Health record added successfully!' });
      }

      setHealthFormData(initialHealthFormData);
      setShowHealthForm(false);
      setEditingRecord(null);
      refetch();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to save health record' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVaccinationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const submitData = {
        ...vaccinationFormData,
        administered_by: vaccinationFormData.administered_by || null,
        next_due_date: vaccinationFormData.next_due_date || null
      };

      const { error } = await supabase
        .from('vaccinations')
        .insert([submitData]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Vaccination record added successfully!' });
      setVaccinationFormData(initialVaccinationFormData);
      setShowVaccinationForm(false);
      refetch();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to save vaccination record' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (record: any) => {
    setHealthFormData({
      animal_id: record.animal_id,
      veterinarian_id: record.veterinarian_id || '',
      record_type: record.record_type,
      record_date: record.record_date,
      title: record.title,
      description: record.description || '',
      diagnosis: record.diagnosis || '',
      treatment_details: record.treatment_details || {},
      medications_prescribed: record.medications_prescribed || [],
      cost: record.cost || 0,
      follow_up_required: record.follow_up_required || false,
      follow_up_date: record.follow_up_date || '',
      next_due_date: record.next_due_date || '',
      notes: record.notes || ''
    });
    setEditingRecord(record.id);
    setShowHealthForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this health record?')) return;

    try {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Health record deleted successfully!' });
      refetch();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to delete health record' 
      });
    }
  };

  const resetHealthForm = () => {
    setHealthFormData(initialHealthFormData);
    setShowHealthForm(false);
    setEditingRecord(null);
    setMedicationInput('');
  };

  const resetVaccinationForm = () => {
    setVaccinationFormData(initialVaccinationFormData);
    setShowVaccinationForm(false);
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'vaccination': return <Pill className="h-4 w-4 text-blue-600" />;
      case 'checkup': return <Stethoscope className="h-4 w-4 text-green-600" />;
      case 'treatment': return <Heart className="h-4 w-4 text-red-600" />;
      case 'surgery': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Heart className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUpcomingReminders = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    return healthRecords.filter(record => {
      if (!record.next_due_date) return false;
      const dueDate = new Date(record.next_due_date);
      return dueDate >= today && dueDate <= thirtyDaysFromNow;
    }).sort((a, b) => new Date(a.next_due_date!).getTime() - new Date(b.next_due_date!).getTime());
  };

  const upcomingReminders = getUpcomingReminders();

  const tabs = [
    { id: 'records', name: 'Health Records', icon: Heart },
    { id: 'vaccinations', name: 'Vaccinations', icon: Pill },
    { id: 'reminders', name: 'Reminders', icon: AlertTriangle }
  ];

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
          <h2 className="text-2xl font-bold text-gray-900">Health Management</h2>
          <p className="text-gray-600">Track animal health records, vaccinations, and medical care</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowVaccinationForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
          >
            <Pill className="h-4 w-4 mr-2" />
            Add Vaccination
          </button>
          <button
            onClick={() => setShowHealthForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Health Record
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
                {tab.id === 'reminders' && upcomingReminders.length > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    {upcomingReminders.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Health Record Form */}
      {showHealthForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              {editingRecord ? 'Edit Health Record' : 'Add New Health Record'}
            </h3>
            <button
              onClick={resetHealthForm}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleHealthSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animal *
                </label>
                <select
                  name="animal_id"
                  required
                  value={healthFormData.animal_id}
                  onChange={handleHealthInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Animal</option>
                  {animals.map(animal => (
                    <option key={animal.id} value={animal.id}>{animal.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Record Type *
                </label>
                <select
                  name="record_type"
                  required
                  value={healthFormData.record_type}
                  onChange={handleHealthInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {recordTypes.map(type => (
                    <option key={type} value={type} className="capitalize">{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Record Date *
                </label>
                <input
                  type="date"
                  name="record_date"
                  required
                  value={healthFormData.record_date}
                  onChange={handleHealthInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Veterinarian
                </label>
                <select
                  name="veterinarian_id"
                  value={healthFormData.veterinarian_id}
                  onChange={handleHealthInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Veterinarian</option>
                  {veterinarians.map(vet => (
                    <option key={vet.id} value={vet.id}>{vet.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={healthFormData.title}
                  onChange={handleHealthInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Annual Checkup, Vaccination"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost ($)
                </label>
                <input
                  type="number"
                  name="cost"
                  min="0"
                  step="0.01"
                  value={healthFormData.cost}
                  onChange={handleHealthInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  name="follow_up_date"
                  value={healthFormData.follow_up_date}
                  onChange={handleHealthInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Due Date
                </label>
                <input
                  type="date"
                  name="next_due_date"
                  value={healthFormData.next_due_date}
                  onChange={handleHealthInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={healthFormData.description}
                onChange={handleHealthInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Describe the health record..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnosis
              </label>
              <textarea
                name="diagnosis"
                rows={2}
                value={healthFormData.diagnosis}
                onChange={handleHealthInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Veterinary diagnosis..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medications Prescribed
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={medicationInput}
                  onChange={(e) => setMedicationInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Add a medication..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
                />
                <button
                  type="button"
                  onClick={addMedication}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {healthFormData.medications_prescribed.map((medication, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {medication}
                    <button
                      type="button"
                      onClick={() => removeMedication(medication)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="follow_up_required"
                checked={healthFormData.follow_up_required}
                onChange={handleHealthInputChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Follow-up Required
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                value={healthFormData.notes}
                onChange={handleHealthInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Additional notes..."
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
                onClick={resetHealthForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vaccination Form */}
      {showVaccinationForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Add Vaccination Record</h3>
            <button
              onClick={resetVaccinationForm}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleVaccinationSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animal *
                </label>
                <select
                  name="animal_id"
                  required
                  value={vaccinationFormData.animal_id}
                  onChange={handleVaccinationInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Animal</option>
                  {animals.map(animal => (
                    <option key={animal.id} value={animal.id}>{animal.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vaccine Name *
                </label>
                <input
                  type="text"
                  name="vaccine_name"
                  required
                  value={vaccinationFormData.vaccine_name}
                  onChange={handleVaccinationInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., RHDV, Distemper"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={vaccinationFormData.manufacturer}
                  onChange={handleVaccinationInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Number
                </label>
                <input
                  type="text"
                  name="batch_number"
                  value={vaccinationFormData.batch_number}
                  onChange={handleVaccinationInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Administered Date *
                </label>
                <input
                  type="date"
                  name="administered_date"
                  required
                  value={vaccinationFormData.administered_date}
                  onChange={handleVaccinationInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Administered By
                </label>
                <select
                  name="administered_by"
                  value={vaccinationFormData.administered_by}
                  onChange={handleVaccinationInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Veterinarian</option>
                  {veterinarians.map(vet => (
                    <option key={vet.id} value={vet.id}>{vet.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Administration Route
                </label>
                <select
                  name="administration_route"
                  value={vaccinationFormData.administration_route}
                  onChange={handleVaccinationInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {administrationRoutes.map(route => (
                    <option key={route} value={route} className="capitalize">{route}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dose Amount
                </label>
                <input
                  type="text"
                  name="dose_amount"
                  value={vaccinationFormData.dose_amount}
                  onChange={handleVaccinationInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., 1ml, 0.5ml"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Due Date
                </label>
                <input
                  type="date"
                  name="next_due_date"
                  value={vaccinationFormData.next_due_date}
                  onChange={handleVaccinationInputChange}
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
                value={vaccinationFormData.notes}
                onChange={handleVaccinationInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Additional notes about this vaccination..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                {submitting ? 'Saving...' : 'Add Vaccination'}
              </button>
              <button
                type="button"
                onClick={resetVaccinationForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {activeTab === 'records' && (
          <>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Health Records ({healthRecords.length})</h3>
            </div>

            {healthRecords.length === 0 ? (
              <div className="p-8 text-center">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No health records found. Add your first health record to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Animal & Record
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Veterinarian
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {healthRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{record.animals?.name}</div>
                            <div className="text-sm text-gray-500">{record.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getRecordIcon(record.record_type)}
                            <span className="ml-2 text-sm text-gray-900 capitalize">{record.record_type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {new Date(record.record_date).toLocaleDateString()}
                          </div>
                          {record.next_due_date && (
                            <div className="text-xs text-gray-500">
                              Next due: {new Date(record.next_due_date).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.veterinarians?.name || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.cost ? `$${record.cost.toFixed(2)}` : 'N/A'}
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
          </>
        )}

        {activeTab === 'reminders' && (
          <>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Upcoming Reminders ({upcomingReminders.length})
              </h3>
            </div>

            {upcomingReminders.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming reminders. All health care is up to date!</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {upcomingReminders.map((record) => {
                  const dueDate = new Date(record.next_due_date!);
                  const today = new Date();
                  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  const isOverdue = daysUntilDue < 0;
                  const isDueSoon = daysUntilDue <= 7;

                  return (
                    <div 
                      key={record.id} 
                      className={`p-4 rounded-lg border-l-4 ${
                        isOverdue ? 'border-red-500 bg-red-50' : 
                        isDueSoon ? 'border-yellow-500 bg-yellow-50' : 
                        'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{record.animals?.name}</h4>
                          <p className="text-sm text-gray-600">{record.title}</p>
                          <p className="text-sm text-gray-500 capitalize">{record.record_type}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            isOverdue ? 'text-red-600' : 
                            isDueSoon ? 'text-yellow-600' : 
                            'text-blue-600'
                          }`}>
                            {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` :
                             daysUntilDue === 0 ? 'Due today' :
                             `Due in ${daysUntilDue} days`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {dueDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}