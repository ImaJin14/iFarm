import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Phone, Mail, MapPin, AlertTriangle, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/supabase';

type Veterinarian = Database['public']['Tables']['veterinarians']['Row'];
type VeterinarianInsert = Database['public']['Tables']['veterinarians']['Insert'];
type VeterinarianUpdate = Database['public']['Tables']['veterinarians']['Update'];

const VeterinariansManagement = () => {
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVet, setEditingVet] = useState<Veterinarian | null>(null);
  const [formData, setFormData] = useState<Partial<VeterinarianInsert>>({
    name: '',
    license_number: '',
    phone: '',
    email: '',
    clinic_name: '',
    address: '',
    specialties: [],
    emergency_contact: false,
    preferred_contact_method: 'phone',
    notes: '',
    is_active: true
  });

  useEffect(() => {
    fetchVeterinarians();
  }, []);

  const fetchVeterinarians = async () => {
    try {
      const { data, error } = await supabase
        .from('veterinarians')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setVeterinarians(data || []);
    } catch (error) {
      console.error('Error fetching veterinarians:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVet) {
        const { error } = await supabase
          .from('veterinarians')
          .update(formData as VeterinarianUpdate)
          .eq('id', editingVet.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('veterinarians')
          .insert([formData as VeterinarianInsert]);
        if (error) throw error;
      }
      
      await fetchVeterinarians();
      resetForm();
    } catch (error) {
      console.error('Error saving veterinarian:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this veterinarian?')) return;
    
    try {
      const { error } = await supabase
        .from('veterinarians')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await fetchVeterinarians();
    } catch (error) {
      console.error('Error deleting veterinarian:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      license_number: '',
      phone: '',
      email: '',
      clinic_name: '',
      address: '',
      specialties: [],
      emergency_contact: false,
      preferred_contact_method: 'phone',
      notes: '',
      is_active: true
    });
    setEditingVet(null);
    setShowForm(false);
  };

  const startEdit = (vet: Veterinarian) => {
    setEditingVet(vet);
    setFormData(vet);
    setShowForm(true);
  };

  const handleSpecialtiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const specialties = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setFormData({ ...formData, specialties });
  };

  const commonSpecialties = [
    'Small Animal Medicine',
    'Large Animal Medicine',
    'Exotic Animal Medicine',
    'Surgery',
    'Emergency Medicine',
    'Reproduction',
    'Orthopedics',
    'Dermatology',
    'Ophthalmology',
    'Dentistry'
  ];

  if (loading) {
    return <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Veterinarians Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Veterinarian
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">
            {editingVet ? 'Edit Veterinarian' : 'Add New Veterinarian'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dr. John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Number
              </label>
              <input
                type="text"
                value={formData.license_number || ''}
                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VET12345"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="dr.smith@clinic.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clinic Name
              </label>
              <input
                type="text"
                value={formData.clinic_name || ''}
                onChange={(e) => setFormData({ ...formData, clinic_name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Animal Medical Center"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Contact Method
              </label>
              <select
                value={formData.preferred_contact_method || 'phone'}
                onChange={(e) => setFormData({ ...formData, preferred_contact_method: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="text">Text Message</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123 Main St, City, State 12345"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialties
              </label>
              <input
                type="text"
                value={formData.specialties?.join(', ') || ''}
                onChange={handleSpecialtiesChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Small Animal Medicine, Surgery, Emergency Medicine"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple specialties with commas</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {commonSpecialties.map(specialty => (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => {
                      const current = formData.specialties || [];
                      if (!current.includes(specialty)) {
                        setFormData({ ...formData, specialties: [...current, specialty] });
                      }
                    }}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Additional notes about this veterinarian"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="emergency_contact"
                checked={formData.emergency_contact || false}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="emergency_contact" className="ml-2 block text-sm text-gray-700">
                Available for Emergency Calls
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                {editingVet ? 'Update' : 'Create'} Veterinarian
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {veterinarians.map((vet) => (
          <div key={vet.id} className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{vet.name}</h3>
                {vet.clinic_name && (
                  <p className="text-sm text-gray-600">{vet.clinic_name}</p>
                )}
                {vet.license_number && (
                  <p className="text-xs text-gray-500">License: {vet.license_number}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(vet)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(vet.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {vet.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{vet.phone}</span>
                </div>
              )}

              {vet.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{vet.email}</span>
                </div>
              )}

              {vet.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-xs">{vet.address}</span>
                </div>
              )}

              {vet.specialties && vet.specialties.length > 0 && (
                <div className="flex items-start gap-2">
                  <Award className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {vet.specialties.slice(0, 3).map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {specialty}
                      </span>
                    ))}
                    {vet.specialties.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{vet.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 pt-2">
                {vet.emergency_contact && (
                  <span className="flex items-center gap-1 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    <AlertTriangle className="h-3 w-3" />
                    Emergency
                  </span>
                )}
                
                <span className={`inline-block text-xs px-2 py-1 rounded ${
                  vet.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {vet.is_active ? 'Active' : 'Inactive'}
                </span>

                {vet.preferred_contact_method && (
                  <span className="text-xs text-gray-500 capitalize">
                    Prefers {vet.preferred_contact_method}
                  </span>
                )}
              </div>

              {vet.notes && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600">{vet.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {veterinarians.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No veterinarians found. Add your first veterinarian to get started.</p>
        </div>
      )}
    </div>
  );
};

export default VeterinariansManagement;