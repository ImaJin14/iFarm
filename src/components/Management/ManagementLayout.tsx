// src/components/Management/ManagementLayout.tsx
import React, { useState } from 'react';
import { 
  BarChart3, 
  Settings, 
  Heart, 
  Package, 
  Users, 
  Building, 
  Stethoscope, 
  Truck,
  UserCheck,
  DollarSign,
  FileText,
  BookOpen,
  Home,
  Info,
  Phone,
  Package2,
  Pill,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../Auth/ProtectedRoute';
import RoleGuard from '../Auth/RoleGuard';

// Import all management components
import Dashboard from './Dashboard';
import AnimalsManagement from './AnimalsManagement';
import BreedingManagement from './BreedingManagement';
import HealthManagement from './HealthManagement';
import InventoryManagement from './InventoryManagement';
import BiProductsManagement from './BiProductsManagement';
import FacilitiesManagement from './FacilitiesManagement';
import VeterinariansManagement from './VeterinariansManagement';
import SuppliersManagement from './SuppliersManagement';
import CustomersManagement from './CustomersManagement';
import FinancialManagement from './FinancialManagement';
import NewsManagement from './NewsManagement';
import EducationManagement from './EducationManagement';
import HomeManagement from './HomeManagement';
import AboutManagement from './AboutManagement';
import ContactManagement from './ContactManagement';
import SettingsManagement from './SettingsManagement';

interface ManagementSection {
  id: string;
  name: string;
  icon: any;
  component: React.ComponentType;
  roles: ('administrator' | 'farm')[];
  category: 'dashboard' | 'livestock' | 'business' | 'content' | 'system';
}

const managementSections: ManagementSection[] = [
  // Dashboard
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3, component: Dashboard, roles: ['administrator', 'farm'], category: 'dashboard' },
  
  // Livestock Management
  { id: 'animals', name: 'Animals', icon: Heart, component: AnimalsManagement, roles: ['administrator', 'farm'], category: 'livestock' },
  { id: 'breeding', name: 'Breeding', icon: Users, component: BreedingManagement, roles: ['administrator', 'farm'], category: 'livestock' },
  { id: 'health', name: 'Health Records', icon: Stethoscope, component: HealthManagement, roles: ['administrator', 'farm'], category: 'livestock' },
  { id: 'facilities', name: 'Facilities', icon: Building, component: FacilitiesManagement, roles: ['administrator', 'farm'], category: 'livestock' },
  { id: 'veterinarians', name: 'Veterinarians', icon: UserCheck, component: VeterinariansManagement, roles: ['administrator', 'farm'], category: 'livestock' },
  
  // Business Management
  { id: 'inventory', name: 'Inventory', icon: Package, component: InventoryManagement, roles: ['administrator', 'farm'], category: 'business' },
  { id: 'biproducts', name: 'Bi-Products', icon: Package2, component: BiProductsManagement, roles: ['administrator', 'farm'], category: 'business' },
  { id: 'suppliers', name: 'Suppliers', icon: Truck, component: SuppliersManagement, roles: ['administrator', 'farm'], category: 'business' },
  { id: 'customers', name: 'Customers', icon: Users, component: CustomersManagement, roles: ['administrator', 'farm'], category: 'business' },
  { id: 'financial', name: 'Financial', icon: DollarSign, component: FinancialManagement, roles: ['administrator', 'farm'], category: 'business' },
  
  // Content Management
  { id: 'news', name: 'News', icon: FileText, component: NewsManagement, roles: ['administrator'], category: 'content' },
  { id: 'education', name: 'Education & FAQs', icon: BookOpen, component: EducationManagement, roles: ['administrator'], category: 'content' },
  { id: 'home', name: 'Home Page', icon: Home, component: HomeManagement, roles: ['administrator'], category: 'content' },
  { id: 'about', name: 'About Page', icon: Info, component: AboutManagement, roles: ['administrator'], category: 'content' },
  { id: 'contact', name: 'Contact Page', icon: Phone, component: ContactManagement, roles: ['administrator'], category: 'content' },
  
  // System Management
  { id: 'settings', name: 'Farm Settings', icon: Settings, component: SettingsManagement, roles: ['administrator'], category: 'system' },
];

const categories = {
  dashboard: { name: 'Dashboard', color: 'text-blue-600' },
  livestock: { name: 'Livestock Management', color: 'text-green-600' },
  business: { name: 'Business Operations', color: 'text-purple-600' },
  content: { name: 'Website Content', color: 'text-orange-600' },
  system: { name: 'System Settings', color: 'text-gray-600' }
};

export default function ManagementLayout() {
  const { user, hasAnyRole } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getAccessibleSections = () => {
    return managementSections.filter(section => 
      hasAnyRole(section.roles)
    );
  };

  const accessibleSections = getAccessibleSections();
  const currentSection = accessibleSections.find(section => section.id === activeSection);
  const CurrentComponent = currentSection?.component || Dashboard;

  const groupedSections = accessibleSections.reduce((groups, section) => {
    if (!groups[section.category]) {
      groups[section.category] = [];
    }
    groups[section.category].push(section);
    return groups;
  }, {} as Record<string, ManagementSection[]>);

  return (
    <ProtectedRoute requiredRoles={['administrator', 'farm']}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 lg:justify-center">
            <div className="flex items-center space-x-2">
              <div className="bg-green-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">iFarm</h1>
                <p className="text-xs text-green-600 font-medium">Management</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="h-full pb-20 overflow-y-auto">
            <nav className="px-4 py-6 space-y-6">
              {Object.entries(groupedSections).map(([categoryKey, sections]) => {
                const category = categories[categoryKey as keyof typeof categories];
                return (
                  <div key={categoryKey}>
                    <h3 className={`px-2 text-xs font-semibold uppercase tracking-wider ${category.color} mb-3`}>
                      {category.name}
                    </h3>
                    <div className="space-y-1">
                      {sections.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        return (
                          <button
                            key={section.id}
                            onClick={() => {
                              setActiveSection(section.id);
                              setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                              isActive
                                ? 'bg-green-100 text-green-700 border-r-2 border-green-500'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                          >
                            <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                            {section.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* User Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-200 rounded-full p-2">
                <Settings className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.full_name || user?.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role === 'administrator' ? 'Administrator' : 'Farm Manager'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          {/* Mobile header */}
          <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">
                {currentSection?.name || 'Management'}
              </h1>
              <div /> {/* Spacer */}
            </div>
          </div>

          {/* Page content */}
          <div className="p-4 lg:p-8">
            <RoleGuard allowedRoles={currentSection?.roles || ['administrator', 'farm']}>
              <CurrentComponent />
            </RoleGuard>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}