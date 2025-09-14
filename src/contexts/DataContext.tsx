import React, { createContext, useContext, useState, useCallback } from "react";
import { 
  phoneModels as initialPhoneModels,
  tradeInDevices as initialTradeInDevices, 
  damageTypes as initialDamageTypes,
  cardMachines as initialCardMachines,
  stores as initialStores,
  type PhoneModel,
  type TradeInDevice,
  type DamageType,
  type CardMachine,
  type Store
} from "@/data/mockData";

interface DataContextType {
  // Data
  phoneModels: PhoneModel[];
  tradeInDevices: TradeInDevice[];
  damageTypes: DamageType[];
  cardMachines: CardMachine[];
  stores: Store[];
  
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
  
  // Store functions
  updateStore: (storeId: string, updates: Partial<Store>) => void;
  deactivateStore: (storeId: string) => void;
  cleanupInactiveStoreData: (storeId: string) => void;
  
  // Reset functions
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [phoneModels, setPhoneModels] = useState<PhoneModel[]>(initialPhoneModels);
  const [tradeInDevices, setTradeInDevices] = useState<TradeInDevice[]>(initialTradeInDevices);
  const [damageTypes, setDamageTypes] = useState<DamageType[]>(initialDamageTypes);
  const [cardMachines, setCardMachines] = useState<CardMachine[]>(initialCardMachines);
  const [stores, setStores] = useState<Store[]>(initialStores);

  const updatePhoneModelPrices = useCallback((modelId: string, prices: Partial<PhoneModel['prices']>) => {
    console.log(`📱 Updating prices for model ${modelId}:`, prices);
    setPhoneModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, prices: { ...model.prices, ...prices } }
        : model
    ));
  }, []);

  const updateTradeInDeviceValues = useCallback((deviceId: string, minValue: number, maxValue: number) => {
    console.log(`📲 Updating values for trade-in device ${deviceId}:`, { minValue, maxValue });
    setTradeInDevices(prev => prev.map(device =>
      device.id === deviceId
        ? { ...device, minValue, maxValue }
        : device
    ));
  }, []);

  const updateDamageTypeDiscount = useCallback((damageId: string, discount: number) => {
    console.log(`🔧 Updating discount for damage type ${damageId}:`, discount);
    setDamageTypes(prev => prev.map(damage =>
      damage.id === damageId
        ? { ...damage, discount }
        : damage
    ));
  }, []);

  const updateCardMachine = useCallback((machineId: string, updates: Partial<CardMachine>) => {
    console.log(`💳 Updating card machine ${machineId}:`, updates);
    setCardMachines(prev => prev.map(machine =>
      machine.id === machineId
        ? { ...machine, ...updates }
        : machine
    ));
  }, []);

  const addCardMachine = useCallback((machine: CardMachine) => {
    console.log(`💳 Adding new card machine:`, machine);
    setCardMachines(prev => [...prev, machine]);
  }, []);

  const deleteCardMachine = useCallback((machineId: string) => {
    console.log(`💳 Deleting card machine ${machineId}`);
    setCardMachines(prev => prev.filter(machine => machine.id !== machineId));
  }, []);

  const getCardMachinesByStore = useCallback((storeId: string) => {
    return cardMachines.filter(machine => 
      machine.store === storeId && machine.active
    );
  }, [cardMachines]);

  const addPhoneModel = useCallback((model: Omit<PhoneModel, 'id'>) => {
    const newModel: PhoneModel = {
      ...model,
      id: `model-${Date.now()}`
    };
    console.log(`📱 Adding new phone model:`, newModel);
    setPhoneModels(prev => [...prev, newModel]);
    return newModel.id;
  }, []);

  const addTradeInDevice = useCallback((device: Omit<TradeInDevice, 'id'>) => {
    const newDevice: TradeInDevice = {
      ...device,
      id: `tradein-${Date.now()}-${device.store}`
    };
    console.log(`📲 Adding new trade-in device:`, newDevice);
    setTradeInDevices(prev => [...prev, newDevice]);
  }, []);

  // Store management functions
  const updateStore = useCallback((storeId: string, updates: Partial<Store>) => {
    console.log(`🏪 Updating store ${storeId}:`, updates);
    setStores(prev => prev.map(store =>
      store.id === storeId ? { ...store, ...updates } : store
    ));
  }, []);

  const cleanupInactiveStoreData = useCallback((storeId: string) => {
    console.log(`🧹 Cleaning up data for inactive store ${storeId}`);
    
    // Remove store prices from phone models
    setPhoneModels(prev => prev.map(model => {
      const newPrices = { ...model.prices };
      delete newPrices[storeId];
      return { ...model, prices: newPrices };
    }));

    // Remove trade-in devices for this store
    setTradeInDevices(prev => prev.filter(device => device.store !== storeId));

    // Remove card machines for this store
    setCardMachines(prev => prev.filter(machine => machine.store !== storeId));

    // Clear selected store from localStorage if it matches
    const selectedStore = localStorage.getItem('selected-store');
    if (selectedStore === storeId) {
      localStorage.removeItem('selected-store');
    }
  }, []);

  const deactivateStore = useCallback((storeId: string) => {
    console.log(`🏪 Deactivating store ${storeId}`);
    // First deactivate the store
    setStores(prev => prev.map(store =>
      store.id === storeId ? { ...store, active: false } : store
    ));
    // Then cleanup the data
    cleanupInactiveStoreData(storeId);
  }, [cleanupInactiveStoreData]);

  const resetData = useCallback(() => {
    console.log("🔄 Resetting all data to initial state");
    setPhoneModels(initialPhoneModels);
    setTradeInDevices(initialTradeInDevices);
    setDamageTypes(initialDamageTypes);
    setCardMachines(initialCardMachines);
    setStores(initialStores);
  }, []);

  const value: DataContextType = {
    phoneModels,
    tradeInDevices,
    damageTypes,
    cardMachines,
    stores,
    updatePhoneModelPrices,
    updateTradeInDeviceValues,
    updateDamageTypeDiscount,
    updateCardMachine,
    addCardMachine,
    deleteCardMachine,
    getCardMachinesByStore,
    addPhoneModel,
    addTradeInDevice,
    updateStore,
    deactivateStore,
    cleanupInactiveStoreData,
    resetData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}