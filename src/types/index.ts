// Base Animal interface for common properties
export interface Animal {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  type: 'rabbit' | 'guinea-pig' | 'dog' | 'cat' | 'fowl';
}

// Breed interface extending Animal for breed-specific information
export interface Breed extends Animal {
  characteristics: string[];
  averageWeight: string;
  primaryUse: string;
  priceRange: string;
}

// Bi-Product interface for farm by-products
export interface BiProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  unit: string;
  type: 'manure' | 'urine' | 'bedding' | 'other';
  benefits: string[];
  availability: 'in-stock' | 'seasonal' | 'pre-order';
}

// Individual animal interfaces
export interface Rabbit extends Animal {
  breed: string;
  age: number;
  weight: number;
  gender: 'male' | 'female';
  color: string;
  status: 'available' | 'breeding' | 'sold' | 'reserved';
  price?: number;
  parentage?: {
    sire?: string;
    dam?: string;
  };
  healthRecords: HealthRecord[];
}

export interface GuineaPig extends Animal {
  breed: string;
  age: number;
  weight: number;
  gender: 'male' | 'female';
  color: string;
  status: 'available' | 'breeding' | 'sold' | 'reserved';
  price?: number;
  coatType: string;
  healthRecords: HealthRecord[];
}

export interface Dog extends Animal {
  breed: string;
  age: number;
  weight: number;
  gender: 'male' | 'female';
  color: string;
  status: 'available' | 'breeding' | 'sold' | 'reserved';
  price?: number;
  size: 'small' | 'medium' | 'large' | 'extra-large';
  temperament: string[];
  healthRecords: HealthRecord[];
  vaccinations: string[];
}

export interface Cat extends Animal {
  breed: string;
  age: number;
  weight: number;
  gender: 'male' | 'female';
  color: string;
  status: 'available' | 'breeding' | 'sold' | 'reserved';
  price?: number;
  coatLength: 'short' | 'medium' | 'long';
  temperament: string[];
  healthRecords: HealthRecord[];
  vaccinations: string[];
}

export interface Fowl extends Animal {
  breed: string;
  age: number;
  gender: 'male' | 'female';
  color: string;
  status: 'available' | 'breeding' | 'sold' | 'reserved';
  price?: number;
  eggProduction?: string;
  purpose: 'eggs' | 'meat' | 'dual-purpose' | 'ornamental';
  healthRecords: HealthRecord[];
}

export interface HealthRecord {
  id: string;
  date: string;
  type: 'vaccination' | 'checkup' | 'treatment' | 'breeding';
  notes: string;
  veterinarian?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  imageUrl: string;
  category: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  specialties: string[];
}

export interface BreedingRecord {
  id: string;
  sireId: string;
  damId: string;
  animalType: 'rabbit' | 'guinea-pig' | 'dog' | 'cat' | 'fowl';
  breedingDate: string;
  expectedBirth: string;
  actualBirth?: string;
  litterSize?: number;
  status: 'planned' | 'bred' | 'born' | 'weaned';
  notes: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'feed' | 'medical' | 'equipment' | 'bedding' | 'other';
  animalTypes: ('rabbit' | 'guinea-pig' | 'dog' | 'cat' | 'fowl')[];
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  cost: number;
  supplier?: string;
  lastRestocked: string;
}