import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  phoneModels as defaultPhoneModels,
  tradeInDevices as defaultTradeInDevices,
  damageTypes as defaultDamageTypes,
  cardMachines as defaultCardMachines,
  stores as defaultStores,
  categories as defaultCategories,
  type PhoneModel,
  type TradeInDevice,
  type DamageType,
  type CardMachine,
  type Store,
  type Category
} from "@/data/mockData";
import { useUpdates } from "./UpdateContext";

interface DataContextType {
  // Data
  phoneModels: PhoneModel[];
  tradeInDevices: TradeInDevice[];
  damageTypes: DamageType[];
  cardMachines: CardMachine[];
  stores: Store[];
  categories: Category[];
  
  // Update functions
  updatePhoneModelPrices: (modelId: string, prices: Partial<PhoneModel['prices']>) => void;
  updateTradeInDeviceValues: (deviceId: string, minValue: number, maxValue: number) => void;
  updateDamageTypeDiscount: (damageId: string, discount: number) => void;
  updateCardMachine: (machineId: string, updates: Partial<CardMachine>) => void;
  addCardMachine: (machine: CardMachine) => void;
  deleteCardMachine: (machineId: string) => void;
  getCardMachinesByStore: (storeId: string) => CardMachine[];
  addPhoneModel: (model: Omit<PhoneModel, 'id'>) => string;
  addTradeInDevice: (device: Omit<TradeInDevice, 'id'>) => void;
  addDamageType: (damage: Omit<DamageType, 'id'>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  
  // Store functions
  addStore: (store: Omit<Store, 'id'>) => void;
  updateStore: (storeId: string, updates: Partial<Store>) => void;
  deactivateStore: (storeId: string) => void;
  cleanupInactiveStoreData: (storeId: string) => void;
  
  // Reset functions
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [phoneModels, setPhoneModels] = useState<PhoneModel[]>([]);
  const [tradeInDevices, setTradeInDevices] = useState<TradeInDevice[]>([]);
  const [damageTypes, setDamageTypes] = useState<DamageType[]>([]);
  const [cardMachines, setCardMachines] = useState<CardMachine[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const { triggerDashboardUpdate, triggerSimulatorUpdate } = useUpdates();

  // Load data from localStorage on mount
  useEffect(() => {
    const loadDataFromStorage = () => {
      try {
        const storedPhoneModels = localStorage.getItem('phoneModels');
        const storedTradeInDevices = localStorage.getItem('tradeInDevices');
        const storedDamageTypes = localStorage.getItem('damageTypes');
        const storedCardMachines = localStorage.getItem('cardMachines');
        const storedStores = localStorage.getItem('stores');
        const storedCategories = localStorage.getItem('categories');

        setPhoneModels(storedPhoneModels ? JSON.parse(storedPhoneModels) : defaultPhoneModels);
        setTradeInDevices(storedTradeInDevices ? JSON.parse(storedTradeInDevices) : defaultTradeInDevices);
        setDamageTypes(storedDamageTypes ? JSON.parse(storedDamageTypes) : defaultDamageTypes);
        // Migrate old cardMachine format to new format
        const migrateCardMachines = (machines: any[]): CardMachine[] => {
          return machines.map(machine => {
            if (machine.store && !machine.stores) {
              // Old format - migrate
              const { store, ...rest } = machine;
              return {
                ...rest,
                stores: [store]
              };
            }
            return machine;
          });
        };

        if (storedCardMachines) {
          const parsed = JSON.parse(storedCardMachines);
          const migrated = migrateCardMachines(parsed);
          console.log('🔄 Migrated cardMachines:', migrated);
          setCardMachines(migrated);
          // Save migrated data back to localStorage
          localStorage.setItem('cardMachines', JSON.stringify(migrated));
        } else {
          setCardMachines(defaultCardMachines);
          localStorage.setItem('cardMachines', JSON.stringify(defaultCardMachines));
        }
        setStores(storedStores ? JSON.parse(storedStores) : defaultStores);
        setCategories(storedCategories ? JSON.parse(storedCategories) : defaultCategories);

        // If no data exists, initialize with defaults
        if (!storedPhoneModels) localStorage.setItem('phoneModels', JSON.stringify(defaultPhoneModels));
        if (!storedTradeInDevices) localStorage.setItem('tradeInDevices', JSON.stringify(defaultTradeInDevices));
        if (!storedDamageTypes) localStorage.setItem('damageTypes', JSON.stringify(defaultDamageTypes));
        if (!storedCardMachines) localStorage.setItem('cardMachines', JSON.stringify(defaultCardMachines));
        if (!storedStores) localStorage.setItem('stores', JSON.stringify(defaultStores));
        if (!storedCategories) localStorage.setItem('categories', JSON.stringify(defaultCategories));

        console.log('📦 Data loaded from localStorage successfully');
      } catch (error) {
        console.error('❌ Failed to load data from localStorage:', error);
        // Clear corrupted localStorage and reset to defaults
        localStorage.removeItem('cardMachines');
        localStorage.removeItem('phoneModels');
        localStorage.removeItem('stores');
        localStorage.removeItem('tradeInDevices');
        localStorage.removeItem('damageTypes');
        console.log('🧹 Cleared corrupted localStorage data');
        // Fallback to default data
        setPhoneModels(defaultPhoneModels);
        setTradeInDevices(defaultTradeInDevices);
        setDamageTypes(defaultDamageTypes);
        setCardMachines(defaultCardMachines);
        setStores(defaultStores);
        setCategories(defaultCategories);
      } finally {
        setIsInitialized(true);
      }
    };

    loadDataFromStorage();
  }, []);

  const updatePhoneModelPrices = useCallback((modelId: string, prices: Partial<PhoneModel['prices']>) => {
    console.log(`📱 Updating prices for model ${modelId}:`, prices);
    setPhoneModels(prev => {
      const updated = prev.map(model =>
        model.id === modelId
          ? { ...model, prices: { ...model.prices, ...prices } }
          : model
      );
      localStorage.setItem('phoneModels', JSON.stringify(updated));
      return updated;
    });
    triggerDashboardUpdate();
    triggerSimulatorUpdate();
  }, [triggerDashboardUpdate, triggerSimulatorUpdate]);

  const updateTradeInDeviceValues = useCallback((deviceId: string, minValue: number, maxValue: number) => {
    console.log(`📲 Updating values for trade-in device ${deviceId}:`, { minValue, maxValue });
    setTradeInDevices(prev => {
      const updated = prev.map(device =>
        device.id === deviceId
          ? { ...device, minValue, maxValue }
          : device
      );
      localStorage.setItem('tradeInDevices', JSON.stringify(updated));
      return updated;
    });
    triggerDashboardUpdate();
    triggerSimulatorUpdate();
  }, [triggerDashboardUpdate, triggerSimulatorUpdate]);

  const updateDamageTypeDiscount = useCallback((damageId: string, discount: number) => {
    console.log(`🔧 Updating discount for damage type ${damageId}:`, discount);
    setDamageTypes(prev => {
      const updated = prev.map(damage =>
        damage.id === damageId
          ? { ...damage, discount }
          : damage
      );
      localStorage.setItem('damageTypes', JSON.stringify(updated));
      return updated;
    });
    triggerDashboardUpdate();
    triggerSimulatorUpdate();
  }, [triggerDashboardUpdate, triggerSimulatorUpdate]);

  const updateCardMachine = useCallback((machineId: string, updates: Partial<CardMachine>) => {
    console.log(`💳 Updating card machine ${machineId}:`, updates);
    setCardMachines(prev => {
      const updated = prev.map(machine =>
        machine.id === machineId
          ? { ...machine, ...updates }
          : machine
      );
      localStorage.setItem('cardMachines', JSON.stringify(updated));
      return updated;
    });
    triggerDashboardUpdate();
    triggerSimulatorUpdate();
  }, [triggerDashboardUpdate, triggerSimulatorUpdate]);

  const addCardMachine = useCallback((machine: CardMachine) => {
    console.log(`💳 Adding new card machine:`, machine);
    setCardMachines(prev => {
      const updated = [...prev, machine];
      localStorage.setItem('cardMachines', JSON.stringify(updated));
      return updated;
    });
    triggerDashboardUpdate();
    triggerSimulatorUpdate();
  }, [triggerDashboardUpdate, triggerSimulatorUpdate]);

  const deleteCardMachine = useCallback((machineId: string) => {
    console.log(`💳 Deleting card machine ${machineId}`);
    setCardMachines(prev => {
      const updated = prev.filter(machine => machine.id !== machineId);
      localStorage.setItem('cardMachines', JSON.stringify(updated));
      return updated;
    });
    triggerDashboardUpdate();
    triggerSimulatorUpdate();
  }, [triggerDashboardUpdate, triggerSimulatorUpdate]);

  const getCardMachinesByStore = useCallback((storeId: string) => {
    return cardMachines.filter(machine =>
      machine.stores.includes(storeId) && machine.active
    );
  }, [cardMachines]);

  const addPhoneModel = useCallback((model: Omit<PhoneModel, 'id'>) => {
    const newModel: PhoneModel = {
      ...model,
      id: `model-${Date.now()}`
    };
    console.log(`📱 Adding new phone model:`, newModel);
    setPhoneModels(prev => {
      const updated = [...prev, newModel];
      localStorage.setItem('phoneModels', JSON.stringify(updated));
      return updated;
    });
    triggerDashboardUpdate();
    triggerSimulatorUpdate();
    return newModel.id;
  }, [triggerDashboardUpdate, triggerSimulatorUpdate]);

  const addTradeInDevice = useCallback((device: Omit<TradeInDevice, 'id'>) => {
    const newDevice: TradeInDevice = {
      ...device,
      id: `tradein-${Date.now()}-${device.store}`
    };
    console.log(`📲 Adding new trade-in device:`, newDevice);
    setTradeInDevices(prev => {
      const updated = [...prev, newDevice];
      localStorage.setItem('tradeInDevices', JSON.stringify(updated));
      return updated;
    });
    triggerDashboardUpdate();
    triggerSimulatorUpdate();
  }, [triggerDashboardUpdate, triggerSimulatorUpdate]);

  const addDamageType = useCallback((damage: Omit<DamageType, 'id'>) => {
    const newDamage: DamageType = {
      ...damage,
      id: `damage-${Date.now()}`
    };
    console.log(`💥 Adding new damage type:`, newDamage);
    setDamageTypes(prev => {
      const updated = [...prev, newDamage];
      localStorage.setItem('damageTypes', JSON.stringify(updated));
      return updated;
    });
    triggerDashboardUpdate();
    triggerSimulatorUpdate();
  }, [triggerDashboardUpdate, triggerSimulatorUpdate]);

  // Category management functions
  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: `category-${Date.now()}`
    };
    console.log(`📁 Adding new category:`, newCategory);
    setCategories(prev => {
      const updated = [...prev, newCategory];
      localStorage.setItem('categories', JSON.stringify(updated));
      return updated;
    });
    triggerDashboardUpdate();
    triggerSimulatorUpdate();
  }, [triggerDashboardUpdate, triggerSimulatorUpdate]);

  const updateCategory = useCallback((categoryId: string, updates: Partial<Category>) => {
    console.log(`📁 Updating category ${categoryId}:`, updates);
    setCategories(prev => {
      const updated = prev.map(category =>
        category.id === categoryId ? { ...category, ...updates } : category
      );
      localStorage.setItem('categories', JSON.stringify(updated));
      return updated;
    });
    triggerDashboardUpdate();
    triggerSimulatorUpdate();
  }, [triggerDashboardUpdate, triggerSimulatorUpdate]);

  // Store management functions
  const addStore = useCallback((store: Omit<Store, 'id'>) => {
    const newStore: Store = {
      ...store,
      id: `store-${Date.now()}`
    };
    console.log(`🏪 Adding new store:`, newStore);
    setStores(prev => {
      const updated = [...prev, newStore];
      localStorage.setItem('stores', JSON.stringify(updated));
      return updated;
    });
    triggerDashboardUpdate();
    triggerSimulatorUpdate();
  }, [triggerDashboardUpdate, triggerSimulatorUpdate]);

  const updateStore = useCallback((storeId: string, updates: Partial<Store>) => {
    console.log(`🏪 Updating store ${storeId}:`, updates);
    setStores(prev => {
      const updated = prev.map(store =>
        store.id === storeId ? { ...store, ...updates } : store
      );
      localStorage.setItem('stores', JSON.stringify(updated));
      return updated;
    });
    triggerDashboardUpdate();
    triggerSimulatorUpdate();
  }, [triggerDashboardUpdate, triggerSimulatorUpdate]);

  const cleanupInactiveStoreData = useCallback((storeId: string) => {
    console.log(`🧹 Cleaning up data for inactive store ${storeId}`);

    // Remove store prices from phone models
    setPhoneModels(prev => {
      const updated = prev.map(model => {
        const newPrices = { ...model.prices };
        delete newPrices[storeId];
        return { ...model, prices: newPrices };
      });
      localStorage.setItem('phoneModels', JSON.stringify(updated));
      return updated;
    });

    // Remove trade-in devices for this store
    setTradeInDevices(prev => {
      const updated = prev.filter(device => device.store !== storeId);
      localStorage.setItem('tradeInDevices', JSON.stringify(updated));
      return updated;
    });

    // Remove card machines for this store or update machines to exclude this store
    setCardMachines(prev => {
      const updated = prev.map(machine => {
        if (machine.stores.includes(storeId)) {
          const remainingStores = machine.stores.filter(id => id !== storeId);
          if (remainingStores.length === 0) {
            return null; // Mark for removal
          }
          return { ...machine, stores: remainingStores };
        }
        return machine;
      }).filter(Boolean) as CardMachine[]; // Remove null entries

      localStorage.setItem('cardMachines', JSON.stringify(updated));
      return updated;
    });

    // Clear selected store from localStorage if it matches
    const selectedStore = localStorage.getItem('selected-store');
    if (selectedStore === storeId) {
      localStorage.removeItem('selected-store');
    }

    triggerDashboardUpdate();
    triggerSimulatorUpdate();
  }, [triggerDashboardUpdate, triggerSimulatorUpdate]);

  const deactivateStore = useCallback((storeId: string) => {
    console.log(`🏪 Deactivating store ${storeId}`);
    // First deactivate the store
    setStores(prev => {
      const updated = prev.map(store =>
        store.id === storeId ? { ...store, active: false } : store
      );
      localStorage.setItem('stores', JSON.stringify(updated));
      return updated;
    });
    // Then cleanup the data
    cleanupInactiveStoreData(storeId);
    triggerDashboardUpdate();
    triggerSimulatorUpdate();
  }, [cleanupInactiveStoreData, triggerDashboardUpdate, triggerSimulatorUpdate]);

  const resetData = useCallback(() => {
    console.log("🔄 Resetting all data to default state");
    setPhoneModels(defaultPhoneModels);
    setTradeInDevices(defaultTradeInDevices);
    setDamageTypes(defaultDamageTypes);
    setCardMachines(defaultCardMachines);
    setStores(defaultStores);

    // Update localStorage with default data
    localStorage.setItem('phoneModels', JSON.stringify(defaultPhoneModels));
    localStorage.setItem('tradeInDevices', JSON.stringify(defaultTradeInDevices));
    localStorage.setItem('damageTypes', JSON.stringify(defaultDamageTypes));
    localStorage.setItem('cardMachines', JSON.stringify(defaultCardMachines));
    localStorage.setItem('stores', JSON.stringify(defaultStores));
  }, []);

  const value: DataContextType = {
    phoneModels,
    tradeInDevices,
    damageTypes,
    cardMachines,
    stores,
    categories,
    updatePhoneModelPrices,
    updateTradeInDeviceValues,
    updateDamageTypeDiscount,
    updateCardMachine,
    addCardMachine,
    deleteCardMachine,
    getCardMachinesByStore,
    addPhoneModel,
    addTradeInDevice,
    addDamageType,
    addCategory,
    updateCategory,
    addStore,
    updateStore,
    deactivateStore,
    cleanupInactiveStoreData,
    resetData
  };

  // Don't render until data is initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}