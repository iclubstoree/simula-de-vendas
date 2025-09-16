// Mock data for the sales simulator - Updated

export interface PhoneModel {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  type: 'novo' | 'seminovo';
  prices: {
    castanhal?: number;
    belem?: number;
    ananindeua?: number;
  };
  active: boolean;
  lastUsed?: Date;
}

export interface TradeInDevice {
  id: string;
  modelId: string;
  name: string;
  minValue: number;
  maxValue: number;
  store: 'castanhal' | 'belem' | 'ananindeua';
  active: boolean;
}

export interface DamageType {
  id: string;
  name: string;
  discount: number;
}

export interface Store {
  id: string;
  name: string;
  city: string;
  active: boolean;
}

export interface CardMachine {
  id: string;
  name: string;
  stores: string[]; // Array de IDs das lojas
  maxInstallments: number;
  rates: { [key: number]: number }; // installment -> rate percentage
  active: boolean;
  paymentTypes: {
    debit: boolean;
    credit: boolean;
  };
  debitRate?: number; // taxa para débito
}

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: Date;
  results: number;
}

// Stores Mock Data
export const stores: Store[] = [
  { id: 'castanhal', name: 'Castanhal', city: 'Castanhal', active: true },
  { id: 'belem', name: 'Belém', city: 'Belém', active: true },
  { id: 'ananindeua', name: 'Ananindeua', city: 'Ananindeua', active: true },
];

// Card Machines Mock Data
export const cardMachines: CardMachine[] = [
  {
    id: 'stone-castanhal',
    name: 'Stone',
    stores: ['castanhal'],
    maxInstallments: 12,
    rates: {
      1: 0, 2: 2.5, 3: 3.5, 4: 4.5, 5: 5.5, 6: 6.5,
      7: 7.5, 8: 8.5, 9: 9.5, 10: 10.5, 11: 11.5, 12: 12.5
    },
    active: true,
    paymentTypes: {
      debit: true,
      credit: true
    },
    debitRate: 1.2
  },
  {
    id: 'rede-castanhal',
    name: 'Rede',
    stores: ['castanhal'],
    maxInstallments: 18,
    rates: {
      1: 0, 2: 2.8, 3: 3.8, 4: 4.8, 5: 5.8, 6: 6.8,
      7: 7.8, 8: 8.8, 9: 9.8, 10: 10.8, 11: 11.8, 12: 12.8,
      13: 13.8, 14: 14.8, 15: 15.8, 16: 16.8, 17: 17.8, 18: 18.8
    },
    active: true,
    paymentTypes: {
      debit: true,
      credit: true
    },
    debitRate: 1.8
  },
  {
    id: 'stone-belem',
    name: 'Stone',
    stores: ['belem'],
    maxInstallments: 12,
    rates: {
      1: 0, 2: 2.5, 3: 3.5, 4: 4.5, 5: 5.5, 6: 6.5,
      7: 7.5, 8: 8.5, 9: 9.5, 10: 10.5, 11: 11.5, 12: 12.5
    },
    active: true,
    paymentTypes: {
      debit: true,
      credit: true
    },
    debitRate: 1.2
  },
  {
    id: 'mercadopago-belem',
    name: 'Mercado Pago',
    stores: ['belem'],
    maxInstallments: 12,
    rates: {
      1: 0, 2: 3.0, 3: 4.0, 4: 5.0, 5: 6.0, 6: 7.0,
      7: 8.0, 8: 9.0, 9: 10.0, 10: 11.0, 11: 12.0, 12: 13.0
    },
    active: true,
    paymentTypes: {
      debit: false,
      credit: true
    }
  },
  {
    id: 'stone-ananindeua',
    name: 'Stone',
    stores: ['ananindeua'],
    maxInstallments: 12,
    rates: {
      1: 0, 2: 2.5, 3: 3.5, 4: 4.5, 5: 5.5, 6: 6.5,
      7: 7.5, 8: 8.5, 9: 9.5, 10: 10.5, 11: 11.5, 12: 12.5
    },
    active: true,
    paymentTypes: {
      debit: true,
      credit: true
    },
    debitRate: 1.2
  },
  {
    id: 'pagseguro-ananindeua',
    name: 'PagSeguro',
    stores: ['ananindeua'],
    maxInstallments: 10,
    rates: {
      1: 0, 2: 2.9, 3: 3.9, 4: 4.9, 5: 5.9, 6: 6.9,
      7: 7.9, 8: 8.9, 9: 9.9, 10: 10.9
    },
    active: true,
    paymentTypes: {
      debit: true,
      credit: true
    },
    debitRate: 1.5
  }
];

// Phone models mock data - cada modelo único com preços por loja
export const phoneModels: PhoneModel[] = [
  // iPhone Models
  { 
    id: '1', 
    name: 'iPhone 15 Pro Max 512GB', 
    category: 'iPhone', 
    subcategory: 'iPhone 15', 
    type: 'novo', 
    prices: { castanhal: 9999.00, belem: 10199.00, ananindeua: 10049.00 }, 
    active: true 
  },
  { 
    id: '2', 
    name: 'iPhone 15 Pro 256GB', 
    category: 'iPhone', 
    subcategory: 'iPhone 15', 
    type: 'novo', 
    prices: { castanhal: 7999.00, belem: 8199.00, ananindeua: 8099.00 }, 
    active: true 
  },
  { 
    id: '3', 
    name: 'iPhone 15 128GB', 
    category: 'iPhone', 
    subcategory: 'iPhone 15', 
    type: 'novo', 
    prices: { castanhal: 5999.00, belem: 6199.00, ananindeua: 6099.00 }, 
    active: true 
  },
  { 
    id: '4', 
    name: 'iPhone 15 Pro Max 1TB', 
    category: 'iPhone', 
    subcategory: 'iPhone 15', 
    type: 'novo', 
    prices: { castanhal: 12499.00, belem: 12699.00, ananindeua: 12599.00 }, 
    active: true 
  },
  { 
    id: '5', 
    name: 'iPhone 14 Pro Max 256GB', 
    category: 'iPhone', 
    subcategory: 'iPhone 14', 
    type: 'novo', 
    prices: { castanhal: 6999.00, belem: 7199.00, ananindeua: 7099.00 }, 
    active: true 
  },
  { 
    id: '6', 
    name: 'iPhone 14 Pro 256GB', 
    category: 'iPhone', 
    subcategory: 'iPhone 14', 
    type: 'novo', 
    prices: { castanhal: 8199.00, belem: 8399.00, ananindeua: 8299.00 }, 
    active: true 
  },
  { 
    id: '7', 
    name: 'iPhone 13 Pro 256GB', 
    category: 'iPhone', 
    subcategory: 'iPhone 13', 
    type: 'seminovo', 
    prices: { castanhal: 4199.00, belem: 4299.00, ananindeua: 4249.00 }, 
    active: true 
  },
  { 
    id: '8', 
    name: 'iPhone 12 64GB', 
    category: 'iPhone', 
    subcategory: 'iPhone 12', 
    type: 'seminovo', 
    prices: { castanhal: 2799.00, belem: 2899.00, ananindeua: 2849.00 }, 
    active: true 
  },
  { 
    id: '9', 
    name: 'iPhone 11 128GB', 
    category: 'iPhone', 
    subcategory: 'iPhone 11', 
    type: 'seminovo', 
    prices: { castanhal: 2199.00, belem: 2299.00, ananindeua: 2249.00 }, 
    active: true 
  },

  // Samsung Models
  { 
    id: '10', 
    name: 'Samsung Galaxy S24 Ultra 512GB', 
    category: 'Samsung', 
    subcategory: 'Galaxy S24', 
    type: 'novo', 
    prices: { castanhal: 7199.00, belem: 7299.00, ananindeua: 7249.00 }, 
    active: true 
  },
  { 
    id: '11', 
    name: 'Samsung Galaxy S23 256GB', 
    category: 'Samsung', 
    subcategory: 'Galaxy S23', 
    type: 'novo', 
    prices: { castanhal: 4299.00, belem: 4399.00, ananindeua: 4349.00 }, 
    active: true 
  },
  { 
    id: '12', 
    name: 'Samsung Galaxy A54 128GB', 
    category: 'Samsung', 
    subcategory: 'Galaxy A', 
    type: 'novo', 
    prices: { castanhal: 1899.00, belem: 1949.00, ananindeua: 1924.00 }, 
    active: true 
  },
  { 
    id: '13', 
    name: 'Samsung Galaxy S22 128GB', 
    category: 'Samsung', 
    subcategory: 'Galaxy S22', 
    type: 'seminovo', 
    prices: { castanhal: 2400.00, belem: 2450.00, ananindeua: 2425.00 }, 
    active: true 
  },
  { 
    id: '14', 
    name: 'Samsung Galaxy S21 256GB', 
    category: 'Samsung', 
    subcategory: 'Galaxy S21', 
    type: 'seminovo', 
    prices: { castanhal: 1800.00, belem: 1850.00, ananindeua: 1825.00 }, 
    active: true 
  },

  // Xiaomi Models
  { 
    id: '15', 
    name: 'Xiaomi 14 Ultra 512GB', 
    category: 'Xiaomi', 
    subcategory: 'Xiaomi 14', 
    type: 'novo', 
    prices: { castanhal: 4999.00, belem: 5099.00, ananindeua: 5049.00 }, 
    active: true 
  },
  { 
    id: '16', 
    name: 'Xiaomi Redmi Note 13 Pro 256GB', 
    category: 'Xiaomi', 
    subcategory: 'Redmi Note 13', 
    type: 'novo', 
    prices: { castanhal: 1599.00, belem: 1649.00, ananindeua: 1624.00 }, 
    active: true 
  },
  { 
    id: '17', 
    name: 'Xiaomi Mi 11 128GB', 
    category: 'Xiaomi', 
    subcategory: 'Mi 11', 
    type: 'seminovo', 
    prices: { castanhal: 1200.00, belem: 1250.00, ananindeua: 1225.00 }, 
    active: true 
  },

  // Motorola Models
  { 
    id: '18', 
    name: 'Motorola Edge 40 Pro 256GB', 
    category: 'Motorola', 
    subcategory: 'Edge 40', 
    type: 'novo', 
    prices: { castanhal: 2799.00, belem: 2849.00, ananindeua: 2824.00 }, 
    active: true 
  },
  { 
    id: '19', 
    name: 'Motorola Moto G84 128GB', 
    category: 'Motorola', 
    subcategory: 'Moto G', 
    type: 'novo', 
    prices: { castanhal: 1299.00, belem: 1349.00, ananindeua: 1324.00 }, 
    active: true 
  },
];

// Trade-in devices - All models with min/max values for testing
export const tradeInDevices: TradeInDevice[] = [
  // Castanhal - All models
  { id: '1', modelId: '1', name: 'iPhone 15 Pro Max 512GB', minValue: 7500, maxValue: 8500, store: 'castanhal', active: true },
  { id: '2', modelId: '2', name: 'iPhone 15 Pro 256GB', minValue: 6000, maxValue: 7000, store: 'castanhal', active: true },
  { id: '3', modelId: '3', name: 'iPhone 15 128GB', minValue: 4500, maxValue: 5200, store: 'castanhal', active: true },
  { id: '4', modelId: '4', name: 'iPhone 15 Pro Max 1TB', minValue: 9500, maxValue: 11000, store: 'castanhal', active: true },
  { id: '5', modelId: '5', name: 'iPhone 14 Pro Max 256GB', minValue: 5200, maxValue: 6200, store: 'castanhal', active: true },
  { id: '6', modelId: '6', name: 'iPhone 14 Pro 256GB', minValue: 4800, maxValue: 5800, store: 'castanhal', active: true },
  { id: '7', modelId: '7', name: 'iPhone 13 Pro 256GB', minValue: 2800, maxValue: 3800, store: 'castanhal', active: true },
  { id: '8', modelId: '8', name: 'iPhone 12 64GB', minValue: 1800, maxValue: 2400, store: 'castanhal', active: true },
  { id: '9', modelId: '9', name: 'iPhone 11 128GB', minValue: 1400, maxValue: 1900, store: 'castanhal', active: true },
  { id: '10', modelId: '10', name: 'Samsung Galaxy S24 Ultra 256GB', minValue: 4200, maxValue: 5200, store: 'castanhal', active: true },
  { id: '11', modelId: '11', name: 'Samsung Galaxy S24 128GB', minValue: 3200, maxValue: 4000, store: 'castanhal', active: true },
  { id: '12', modelId: '12', name: 'Samsung Galaxy A54 128GB', minValue: 1000, maxValue: 1400, store: 'castanhal', active: true },
  { id: '13', modelId: '13', name: 'Samsung Galaxy S22 128GB', minValue: 1600, maxValue: 2100, store: 'castanhal', active: true },
  { id: '14', modelId: '14', name: 'Samsung Galaxy S21 256GB', minValue: 1200, maxValue: 1600, store: 'castanhal', active: true },
  { id: '15', modelId: '15', name: 'Xiaomi 14 Ultra 512GB', minValue: 3800, maxValue: 4400, store: 'castanhal', active: true },
  { id: '16', modelId: '16', name: 'Xiaomi Redmi Note 13 Pro 256GB', minValue: 1200, maxValue: 1400, store: 'castanhal', active: true },
  { id: '17', modelId: '17', name: 'Xiaomi Mi 11 128GB', minValue: 800, maxValue: 1000, store: 'castanhal', active: true },
  { id: '18', modelId: '18', name: 'Motorola Edge 40 Pro 256GB', minValue: 2100, maxValue: 2500, store: 'castanhal', active: true },
  { id: '19', modelId: '19', name: 'Motorola Moto G84 128GB', minValue: 900, maxValue: 1150, store: 'castanhal', active: true },
  
  // Belém - All models
  { id: '101', modelId: '1', name: 'iPhone 15 Pro Max 512GB', minValue: 7600, maxValue: 8600, store: 'belem', active: true },
  { id: '102', modelId: '2', name: 'iPhone 15 Pro 256GB', minValue: 6100, maxValue: 7100, store: 'belem', active: true },
  { id: '103', modelId: '3', name: 'iPhone 15 128GB', minValue: 4600, maxValue: 5300, store: 'belem', active: true },
  { id: '104', modelId: '4', name: 'iPhone 15 Pro Max 1TB', minValue: 9600, maxValue: 11100, store: 'belem', active: true },
  { id: '105', modelId: '5', name: 'iPhone 14 Pro Max 256GB', minValue: 5300, maxValue: 6300, store: 'belem', active: true },
  { id: '106', modelId: '6', name: 'iPhone 14 Pro 256GB', minValue: 4900, maxValue: 5900, store: 'belem', active: true },
  { id: '107', modelId: '7', name: 'iPhone 13 Pro 256GB', minValue: 2900, maxValue: 3900, store: 'belem', active: true },
  { id: '108', modelId: '8', name: 'iPhone 12 64GB', minValue: 1900, maxValue: 2500, store: 'belem', active: true },
  { id: '109', modelId: '9', name: 'iPhone 11 128GB', minValue: 1450, maxValue: 1950, store: 'belem', active: true },
  { id: '110', modelId: '10', name: 'Samsung Galaxy S24 Ultra 256GB', minValue: 4300, maxValue: 5300, store: 'belem', active: true },
  { id: '111', modelId: '11', name: 'Samsung Galaxy S24 128GB', minValue: 3300, maxValue: 4100, store: 'belem', active: true },
  { id: '112', modelId: '12', name: 'Samsung Galaxy A54 128GB', minValue: 1050, maxValue: 1450, store: 'belem', active: true },
  { id: '113', modelId: '13', name: 'Samsung Galaxy S22 128GB', minValue: 1650, maxValue: 2150, store: 'belem', active: true },
  { id: '114', modelId: '14', name: 'Samsung Galaxy S21 256GB', minValue: 1250, maxValue: 1650, store: 'belem', active: true },
  { id: '115', modelId: '15', name: 'Xiaomi 14 Ultra 512GB', minValue: 3900, maxValue: 4500, store: 'belem', active: true },
  { id: '116', modelId: '16', name: 'Xiaomi Redmi Note 13 Pro 256GB', minValue: 1250, maxValue: 1450, store: 'belem', active: true },
  { id: '117', modelId: '17', name: 'Xiaomi Mi 11 128GB', minValue: 825, maxValue: 1025, store: 'belem', active: true },
  { id: '118', modelId: '18', name: 'Motorola Edge 40 Pro 256GB', minValue: 2150, maxValue: 2550, store: 'belem', active: true },
  { id: '119', modelId: '19', name: 'Motorola Moto G84 128GB', minValue: 925, maxValue: 1175, store: 'belem', active: true },
  
  // Ananindeua - All models  
  { id: '201', modelId: '1', name: 'iPhone 15 Pro Max 512GB', minValue: 7550, maxValue: 8550, store: 'ananindeua', active: true },
  { id: '202', modelId: '2', name: 'iPhone 15 Pro 256GB', minValue: 6050, maxValue: 7050, store: 'ananindeua', active: true },
  { id: '203', modelId: '3', name: 'iPhone 15 128GB', minValue: 4550, maxValue: 5250, store: 'ananindeua', active: true },
  { id: '204', modelId: '4', name: 'iPhone 15 Pro Max 1TB', minValue: 9550, maxValue: 11050, store: 'ananindeua', active: true },
  { id: '205', modelId: '5', name: 'iPhone 14 Pro Max 256GB', minValue: 5250, maxValue: 6250, store: 'ananindeua', active: true },
  { id: '206', modelId: '6', name: 'iPhone 14 Pro 256GB', minValue: 4850, maxValue: 5850, store: 'ananindeua', active: true },
  { id: '207', modelId: '7', name: 'iPhone 13 Pro 256GB', minValue: 2850, maxValue: 3850, store: 'ananindeua', active: true },
  { id: '208', modelId: '8', name: 'iPhone 12 64GB', minValue: 1850, maxValue: 2450, store: 'ananindeua', active: true },
  { id: '209', modelId: '9', name: 'iPhone 11 128GB', minValue: 1350, maxValue: 1850, store: 'ananindeua', active: true },
  { id: '210', modelId: '10', name: 'Samsung Galaxy S24 Ultra 256GB', minValue: 4250, maxValue: 5250, store: 'ananindeua', active: true },
  { id: '211', modelId: '11', name: 'Samsung Galaxy S24 128GB', minValue: 3250, maxValue: 4050, store: 'ananindeua', active: true },
  { id: '212', modelId: '12', name: 'Samsung Galaxy A54 128GB', minValue: 1025, maxValue: 1425, store: 'ananindeua', active: true },
  { id: '213', modelId: '13', name: 'Samsung Galaxy S22 128GB', minValue: 1600, maxValue: 2100, store: 'ananindeua', active: true },
  { id: '214', modelId: '14', name: 'Samsung Galaxy S21 256GB', minValue: 1150, maxValue: 1550, store: 'ananindeua', active: true },
  { id: '215', modelId: '15', name: 'Xiaomi 14 Ultra 512GB', minValue: 3850, maxValue: 4450, store: 'ananindeua', active: true },
  { id: '216', modelId: '16', name: 'Xiaomi Redmi Note 13 Pro 256GB', minValue: 1225, maxValue: 1425, store: 'ananindeua', active: true },
  { id: '217', modelId: '17', name: 'Xiaomi Mi 11 128GB', minValue: 775, maxValue: 975, store: 'ananindeua', active: true },
  { id: '218', modelId: '18', name: 'Motorola Edge 40 Pro 256GB', minValue: 2125, maxValue: 2525, store: 'ananindeua', active: true },
  { id: '219', modelId: '19', name: 'Motorola Moto G84 128GB', minValue: 915, maxValue: 1165, store: 'ananindeua', active: true },
];

// Damage types for trade-in assessment
export const damageTypes: DamageType[] = [
  { id: 'display-broken', name: 'Display Quebrado', discount: 450 },
  { id: 'battery-drain', name: 'Bateria Vicia Rápido', discount: 200 },
  { id: 'camera-main', name: 'Câmera Principal', discount: 250 },
  { id: 'water-damage', name: 'Danos por Água', discount: 400 },
  { id: 'charging-port', name: 'Entrada de Carregamento', discount: 90 },
];

// Recent searches mock data
export const recentSearches: RecentSearch[] = [
  { id: '1', query: 'iPhone 15', timestamp: new Date(Date.now() - 1000 * 60 * 30), results: 4 },
  { id: '2', query: 'Samsung Galaxy S24', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), results: 3 },
  { id: '3', query: 'Xiaomi Redmi', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), results: 2 },
  { id: '4', query: 'Motorola Edge', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), results: 2 },
  { id: '5', query: 'iPhone 13 Pro', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), results: 1 },
];

// Utility functions
export const searchModels = (query: string, type?: 'novo' | 'seminovo', store?: string): PhoneModel[] => {
  if (!query.trim()) return [];
  
  const filtered = phoneModels.filter(model => {
    const matchesQuery = model.name.toLowerCase().includes(query.toLowerCase()) ||
                        model.category.toLowerCase().includes(query.toLowerCase()) ||
                        model.subcategory.toLowerCase().includes(query.toLowerCase());
    const matchesType = type ? model.type === type : true;
    // Para busca com store, verifica se o modelo tem preço para essa loja
    const matchesStore = store ? model.prices[store as keyof typeof model.prices] !== undefined : true;
    return matchesQuery && matchesType && matchesStore && model.active;
  });
  
  return filtered.slice(0, 10); // Limit to 10 results
};

export const getCardMachinesByStore = (storeId: string): CardMachine[] => {
  return cardMachines.filter(machine => machine.stores.includes(storeId));
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const getRecentSearches = (): RecentSearch[] => {
  return recentSearches;
};

// Configuration interfaces
export interface User {
  id: string;
  login: string;
  email: string;
  name: string;
  password?: string;
  type: 'dono' | 'gerente' | 'vendedor';
  allowedStores: string[];
  permissions: {
    configuracoes: boolean;
    relatorios: boolean;
    dashboard: boolean;
    simulador: boolean;
  };
  active: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Category {
  id: string;
  name: string;
  active: boolean;
  order: number;
  createdAt: Date;
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  active: boolean;
  order: number;
  createdAt: Date;
}

export interface DamageMatrix {
  id: string;
  subcategoryId: string;
  damageTypeId: string;
  discountValue: number; // valor em BRL
}

// Users Mock Data
export const users: User[] = [
  {
    id: '1',
    login: 'admin',
    email: 'admin@iclub.com.br',
    name: 'Administrador',
    type: 'dono',
    allowedStores: ['castanhal', 'belem', 'ananindeua'],
    permissions: {
      configuracoes: true,
      relatorios: true,
      dashboard: true,
      simulador: true,
    },
    active: true,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  },
  {
    id: '2',
    login: 'gerente.castanhal',
    email: 'gerente@castanhal.iclub.com.br',
    name: 'Gerente Castanhal',
    type: 'gerente',
    allowedStores: ['castanhal'],
    permissions: {
      configuracoes: false,
      relatorios: true,
      dashboard: true,
      simulador: true,
    },
    active: true,
    createdAt: new Date('2024-01-05'),
    lastLogin: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: '3',
    login: 'maria.silva',
    email: 'maria.silva@iclub.com.br',
    name: 'Maria Silva',
    type: 'vendedor',
    allowedStores: ['castanhal', 'belem'],
    permissions: {
      configuracoes: false,
      relatorios: false,
      dashboard: false,
      simulador: true,
    },
    active: true,
    createdAt: new Date('2024-01-10'),
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: '4',
    login: 'joao.santos',
    email: 'joao.santos@iclub.com.br',
    name: 'João Santos',
    type: 'vendedor',
    allowedStores: ['belem'],
    permissions: {
      configuracoes: false,
      relatorios: false,
      dashboard: false,
      simulador: true,
    },
    active: true,
    createdAt: new Date('2024-01-12'),
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 4)
  },
  {
    id: '5',
    login: 'gerente.belem',
    email: 'gerente@belem.iclub.com.br',
    name: 'Gerente Belém',
    type: 'gerente',
    allowedStores: ['belem'],
    permissions: {
      configuracoes: false,
      relatorios: true,
      dashboard: true,
      simulador: true,
    },
    active: true,
    createdAt: new Date('2024-01-06'),
    lastLogin: new Date(Date.now() - 1000 * 60 * 15)
  },
  {
    id: '6',
    login: 'gerente.ananindeua',
    email: 'gerente@ananindeua.iclub.com.br',
    name: 'Gerente Ananindeua',
    type: 'gerente',
    allowedStores: ['ananindeua'],
    permissions: {
      configuracoes: false,
      relatorios: true,
      dashboard: true,
      simulador: true,
    },
    active: true,
    createdAt: new Date('2024-01-07'),
    lastLogin: new Date(Date.now() - 1000 * 60 * 45)
  },
  {
    id: '7',
    login: 'ana.costa',
    email: 'ana.costa@iclub.com.br',
    name: 'Ana Costa',
    type: 'vendedor',
    allowedStores: ['castanhal'],
    permissions: {
      configuracoes: false,
      relatorios: false,
      dashboard: false,
      simulador: true,
    },
    active: true,
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(Date.now() - 1000 * 60 * 60)
  },
  {
    id: '8',
    login: 'carlos.oliveira',
    email: 'carlos.oliveira@iclub.com.br',
    name: 'Carlos Oliveira',
    type: 'vendedor',
    allowedStores: ['ananindeua'],
    permissions: {
      configuracoes: false,
      relatorios: false,
      dashboard: false,
      simulador: true,
    },
    active: true,
    createdAt: new Date('2024-01-18'),
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 6)
  },
  {
    id: '9',
    login: 'pedro.lima',
    email: 'pedro.lima@iclub.com.br',
    name: 'Pedro Lima',
    type: 'vendedor',
    allowedStores: ['belem', 'ananindeua'],
    permissions: {
      configuracoes: false,
      relatorios: false,
      dashboard: false,
      simulador: true,
    },
    active: true,
    createdAt: new Date('2024-01-20'),
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 3)
  },
  {
    id: '10',
    login: 'lucia.fernandes',
    email: 'lucia.fernandes@iclub.com.br',
    name: 'Lúcia Fernandes',
    type: 'vendedor',
    allowedStores: ['castanhal', 'ananindeua'],
    permissions: {
      configuracoes: false,
      relatorios: false,
      dashboard: false,
      simulador: true,
    },
    active: true,
    createdAt: new Date('2024-01-22'),
    lastLogin: new Date(Date.now() - 1000 * 60 * 90)
  }
];

// Categories Mock Data
export const categories: Category[] = [
  { id: 'cat1', name: 'iPhone', active: true, order: 1, createdAt: new Date('2024-01-01') },
  { id: 'cat2', name: 'Samsung', active: true, order: 2, createdAt: new Date('2024-01-01') },
  { id: 'cat3', name: 'Xiaomi', active: true, order: 3, createdAt: new Date('2024-01-01') },
  { id: 'cat4', name: 'Motorola', active: true, order: 4, createdAt: new Date('2024-01-01') },
];

// Subcategories Mock Data
export const subcategories: Subcategory[] = [
  // iPhone subcategories
  { id: 'sub1', name: 'iPhone 15', categoryId: 'cat1', active: true, order: 1, createdAt: new Date('2024-01-01') },
  { id: 'sub2', name: 'iPhone 14', categoryId: 'cat1', active: true, order: 2, createdAt: new Date('2024-01-01') },
  { id: 'sub3', name: 'iPhone 13', categoryId: 'cat1', active: true, order: 3, createdAt: new Date('2024-01-01') },
  { id: 'sub4', name: 'iPhone 12', categoryId: 'cat1', active: true, order: 4, createdAt: new Date('2024-01-01') },
  { id: 'sub5', name: 'iPhone 11', categoryId: 'cat1', active: true, order: 5, createdAt: new Date('2024-01-01') },
  
  // Samsung subcategories
  { id: 'sub6', name: 'Galaxy S24', categoryId: 'cat2', active: true, order: 1, createdAt: new Date('2024-01-01') },
  { id: 'sub7', name: 'Galaxy S23', categoryId: 'cat2', active: true, order: 2, createdAt: new Date('2024-01-01') },
  { id: 'sub8', name: 'Galaxy S22', categoryId: 'cat2', active: true, order: 3, createdAt: new Date('2024-01-01') },
  { id: 'sub9', name: 'Galaxy S21', categoryId: 'cat2', active: true, order: 4, createdAt: new Date('2024-01-01') },
  { id: 'sub10', name: 'Galaxy A', categoryId: 'cat2', active: true, order: 5, createdAt: new Date('2024-01-01') },
  
  // Xiaomi subcategories
  { id: 'sub11', name: 'Xiaomi 14', categoryId: 'cat3', active: true, order: 1, createdAt: new Date('2024-01-01') },
  { id: 'sub12', name: 'Redmi Note 13', categoryId: 'cat3', active: true, order: 2, createdAt: new Date('2024-01-01') },
  { id: 'sub13', name: 'Mi 11', categoryId: 'cat3', active: true, order: 3, createdAt: new Date('2024-01-01') },
  
  // Motorola subcategories
  { id: 'sub14', name: 'Edge 40', categoryId: 'cat4', active: true, order: 1, createdAt: new Date('2024-01-01') },
  { id: 'sub15', name: 'Moto G', categoryId: 'cat4', active: true, order: 2, createdAt: new Date('2024-01-01') },
];

// Damage Matrix Mock Data
export const damageMatrix: DamageMatrix[] = [
  // iPhone 15 subcategory
  { id: 'dm1', subcategoryId: 'sub1', damageTypeId: 'display', discountValue: 400 },
  { id: 'dm2', subcategoryId: 'sub1', damageTypeId: 'battery', discountValue: 250 },
  { id: 'dm3', subcategoryId: 'sub1', damageTypeId: 'casing', discountValue: 200 },
  { id: 'dm4', subcategoryId: 'sub1', damageTypeId: 'camera', discountValue: 350 },
  
  // iPhone 14 subcategory
  { id: 'dm5', subcategoryId: 'sub2', damageTypeId: 'display', discountValue: 380 },
  { id: 'dm6', subcategoryId: 'sub2', damageTypeId: 'battery', discountValue: 230 },
  { id: 'dm7', subcategoryId: 'sub2', damageTypeId: 'casing', discountValue: 180 },
  { id: 'dm8', subcategoryId: 'sub2', damageTypeId: 'camera', discountValue: 320 },
  
  // Samsung Galaxy S24
  { id: 'dm9', subcategoryId: 'sub6', damageTypeId: 'display', discountValue: 350 },
  { id: 'dm10', subcategoryId: 'sub6', damageTypeId: 'battery', discountValue: 200 },
  { id: 'dm11', subcategoryId: 'sub6', damageTypeId: 'casing', discountValue: 150 },
  { id: 'dm12', subcategoryId: 'sub6', damageTypeId: 'camera', discountValue: 280 },
  
  // Add more matrix entries as needed...
];

// Dashboard Data Mock
export const dashboardData = {
  kpis: {
    totalSimulations: 127,
    conversionRate: 24.5,
    averageTicket: 2850,
    monthlyGrowth: 12.3
  },
  topModels: [
    { name: 'iPhone 15 Pro Max 256GB', brand: 'iPhone', simulations: 28, growth: 12 },
    { name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', simulations: 19, growth: -8 },
    { name: 'iPhone 14 Pro 128GB', brand: 'iPhone', simulations: 15, growth: 5 },
    { name: 'Xiaomi Redmi Note 13 Pro', brand: 'Xiaomi', simulations: 12, growth: 15 },
    { name: 'Samsung Galaxy A54', brand: 'Samsung', simulations: 9, growth: -3 }
  ],
  installmentUsage: [
    { method: '12x', simulations: 35, percentage: 74 },
    { method: '6x', simulations: 8, percentage: 17 },
    { method: 'Débito', simulations: 6, percentage: 13 },
    { method: '3x', simulations: 4, percentage: 8 },
    { method: '18x', simulations: 3, percentage: 6 }
  ],
  categories: [
    { name: 'iPhone', simulations: 45, percentage: 35.4 },
    { name: 'Samsung', simulations: 38, percentage: 29.9 },
    { name: 'Xiaomi', simulations: 28, percentage: 22.0 },
    { name: 'Motorola', simulations: 16, percentage: 12.6 }
  ],
  priceRanges: [
    { range: 'R$ 0 - R$ 1.000', simulations: 15, percentage: 11.8 },
    { range: 'R$ 1.001 - R$ 2.000', simulations: 32, percentage: 25.2 },
    { range: 'R$ 2.001 - R$ 3.000', simulations: 41, percentage: 32.3 },
    { range: 'R$ 3.001 - R$ 5.000', simulations: 28, percentage: 22.0 },
    { range: 'R$ 5.001+', simulations: 11, percentage: 8.7 }
  ],
  salesByStore: [
    { store: 'Castanhal', simulations: 45, conversion: 26.7 },
    { store: 'Belém', simulations: 52, conversion: 23.1 },
    { store: 'Ananindeua', simulations: 30, conversion: 20.0 }
  ],
  salesBySeller: [
    { name: 'Ana Silva', store: 'Castanhal', simulations: 34, conversion: 28.5 },
    { name: 'Carlos Santos', store: 'Belém', simulations: 28, conversion: 25.2 },
    { name: 'Maria Oliveira', store: 'Castanhal', simulations: 22, conversion: 22.8 },
    { name: 'João Pereira', store: 'Belém', simulations: 18, conversion: 20.1 },
    { name: 'Lucia Costa', store: 'Ananindeua', simulations: 15, conversion: 18.5 },
    { name: 'Pedro Lima', store: 'Ananindeua', simulations: 10, conversion: 16.0 }
  ]
};

// Global data update functions for persistent changes
export const updatePhoneModelPrices = (modelId: string, prices: Partial<PhoneModel['prices']>) => {
  const model = phoneModels.find(m => m.id === modelId);
  if (model) {
    model.prices = { ...model.prices, ...prices };
    console.log(`📱 Updated prices for model ${model.name}:`, model.prices);
  }
};

export const updateTradeInDeviceValues = (deviceId: string, minValue: number, maxValue: number) => {
  const device = tradeInDevices.find(d => d.id === deviceId);
  if (device) {
    device.minValue = minValue;
    device.maxValue = maxValue;
    console.log(`📲 Updated values for trade-in device ${device.name}:`, { minValue, maxValue });
  }
};

export const updateDamageTypeDiscount = (damageId: string, discount: number) => {
  const damage = damageTypes.find(d => d.id === damageId);
  if (damage) {
    damage.discount = discount;
    console.log(`🔧 Updated discount for damage type ${damage.name}:`, discount);
  }
};