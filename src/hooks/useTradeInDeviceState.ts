import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  tradeInDevices,
  phoneModels,
  type TradeInDevice,
  type PhoneModel
} from "@/data/mockData";

interface TradeInFormData {
  modelId: string;
  minValue: string;
  maxValue: string;
  store: string;
  active: boolean;
}

interface UniqueModel {
  id: string;
  modelId: string;
  name: string;
  castanhal?: TradeInDevice;
  belem?: TradeInDevice;
  ananindeua?: TradeInDevice;
}

export function useTradeInDeviceState() {
  const [devicesList, setDevicesList] = useState<TradeInDevice[]>(tradeInDevices);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<TradeInDevice | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [tradeInEditOpen, setTradeInEditOpen] = useState(false);
  const [selectedTradeInModel, setSelectedTradeInModel] = useState<{modelId: string, modelName: string} | null>(null);
  const [selectedTradeInDevices, setSelectedTradeInDevices] = useState<string[]>([]);
  const [customPriceModalOpen, setCustomPriceModalOpen] = useState(false);
  const [pendingCustomPriceStores, setPendingCustomPriceStores] = useState<string[]>([]);
  const [pendingCustomPriceModels, setPendingCustomPriceModels] = useState<PhoneModel[]>([]);

  const [formData, setFormData] = useState<TradeInFormData>({
    modelId: "",
    minValue: "",
    maxValue: "",
    store: "",
    active: true
  });

  const { toast } = useToast();

  // Get only seminovo models
  const seminovoModels = phoneModels.filter(model => model.type === 'seminovo');

  // Get device model details
  const getModelDetails = (modelId: string) => {
    return phoneModels.find(model => model.id === modelId);
  };

  // Filter devices
  const filteredDevices = devicesList.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Get model details for category/subcategory filtering
    const modelDetails = getModelDetails(device.modelId);
    const matchesCategory = selectedCategory === "all" || modelDetails?.categoryId === selectedCategory;
    const matchesSubcategory = selectedSubcategory === "all" || modelDetails?.subcategoryId === selectedSubcategory;
    const matchesStatus = selectedStatus === "all" ||
      (selectedStatus === "active" && device.active) ||
      (selectedStatus === "inactive" && !device.active);

    return matchesSearch && matchesCategory && matchesSubcategory && matchesStatus;
  });

  // Create unique models for display (avoiding duplicates)
  const uniqueModels: UniqueModel[] = filteredDevices.reduce((acc: UniqueModel[], device) => {
    if (!acc.find(item => item.modelId === device.modelId)) {
      const castanhalDevice = devicesList.find(d => d.modelId === device.modelId && d.store === 'castanhal');
      const belemDevice = devicesList.find(d => d.modelId === device.modelId && d.store === 'belem');
      const ananindeauDevice = devicesList.find(d => d.modelId === device.modelId && d.store === 'ananindeua');

      acc.push({
        id: device.modelId, // Use modelId as unique identifier
        modelId: device.modelId,
        name: device.name,
        castanhal: castanhalDevice,
        belem: belemDevice,
        ananindeua: ananindeauDevice
      });
    }
    return acc;
  }, []);

  // Create all unique models (for bulk edit modal - ignoring store filter)
  const allUniqueModels: UniqueModel[] = devicesList.reduce((acc: UniqueModel[], device) => {
    if (!acc.find(item => item.modelId === device.modelId)) {
      const castanhalDevice = devicesList.find(d => d.modelId === device.modelId && d.store === 'castanhal');
      const belemDevice = devicesList.find(d => d.modelId === device.modelId && d.store === 'belem');
      const ananindeauDevice = devicesList.find(d => d.modelId === device.modelId && d.store === 'ananindeua');

      acc.push({
        id: device.modelId, // Use modelId as unique identifier
        modelId: device.modelId,
        name: device.name,
        castanhal: castanhalDevice,
        belem: belemDevice,
        ananindeua: ananindeauDevice
      });
    }
    return acc;
  }, []);

  // Debug log for uniqueModels
  useEffect(() => {
    console.log('📊 Models updated:', {
      filteredDevicesCount: filteredDevices.length,
      uniqueModelsCount: uniqueModels.length,
      allUniqueModelsCount: allUniqueModels.length,
      searchQuery,
      sampleUniqueModels: uniqueModels.slice(0, 3).map(m => ({
        id: m.id,
        modelId: m.modelId,
        name: m.name
      })),
      sampleAllUniqueModels: allUniqueModels.slice(0, 3).map(m => ({
        id: m.id,
        modelId: m.modelId,
        name: m.name
      }))
    });
  }, [uniqueModels, allUniqueModels, filteredDevices, searchQuery]);

  const handleOpenDialog = (device?: TradeInDevice) => {
    if (device) {
      setEditingDevice(device);
      setFormData({
        modelId: device.modelId,
        minValue: device.minValue.toString(),
        maxValue: device.maxValue.toString(),
        store: device.store,
        active: device.active
      });
    } else {
      setEditingDevice(null);
      setFormData({
        modelId: "",
        minValue: "",
        maxValue: "",
        store: "",
        active: true
      });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.modelId || !formData.minValue || !formData.maxValue || !formData.store) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const minValue = parseFloat(formData.minValue);
    const maxValue = parseFloat(formData.maxValue);

    if (isNaN(minValue) || isNaN(maxValue) || minValue <= 0 || maxValue <= 0) {
      toast({
        title: "Erro",
        description: "Valores devem ser números válidos maiores que zero",
        variant: "destructive"
      });
      return;
    }

    if (minValue >= maxValue) {
      toast({
        title: "Erro",
        description: "Valor mínimo deve ser menor que o máximo",
        variant: "destructive"
      });
      return;
    }

    const selectedModel = seminovoModels.find(m => m.id === formData.modelId);
    if (!selectedModel) {
      toast({
        title: "Erro",
        description: "Modelo não encontrado",
        variant: "destructive"
      });
      return;
    }

    if (editingDevice) {
      // Edit existing device
      setDevicesList(prev => prev.map(device =>
        device.id === editingDevice.id
          ? {
              ...device,
              modelId: formData.modelId,
              name: selectedModel.name,
              minValue,
              maxValue,
              store: formData.store as 'castanhal' | 'belem' | 'ananindeua',
              active: formData.active
            }
          : device
      ));
      toast({
        title: "Sucesso",
        description: "Aparelho de entrada atualizado com sucesso"
      });
    } else {
      // Create new device
      const newDevice: TradeInDevice = {
        id: `tradein-${Date.now()}`,
        modelId: formData.modelId,
        name: selectedModel.name,
        minValue,
        maxValue,
        store: formData.store as 'castanhal' | 'belem' | 'ananindeua',
        active: formData.active
      };
      setDevicesList(prev => [...prev, newDevice]);
      toast({
        title: "Sucesso",
        description: "Aparelho de entrada criado com sucesso"
      });
    }

    setDialogOpen(false);
    setEditingDevice(null);
  };

  const deleteDevice = (deviceId: string) => {
    const device = devicesList.find(d => d.id === deviceId);
    setDevicesList(prev => prev.filter(device => device.id !== deviceId));
    toast({
      title: "Aparelho removido",
      description: `${device?.name} foi removido da lista de entrada`
    });
  };

  const handleFormChange = (updates: Partial<TradeInFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setSelectedStatus("all");
  };

  const handleTradeInEdit = (modelId: string, modelName: string) => {
    setSelectedTradeInModel({ modelId, modelName });
    setTradeInEditOpen(true);
  };

  const handleTradeInSave = (updatedDevices: TradeInDevice[]) => {
    // Update the devices list with new values - maintain original positions
    setDevicesList(prev => {
      return prev.map(device => {
        const updatedDevice = updatedDevices.find(ud =>
          ud.modelId === device.modelId && ud.store === device.store
        );
        return updatedDevice || device;
      });
    });
  };

  const handleApplyBulkEdit = (updates: {
    type: string;
    fields?: string[];
    stores?: string[];
    cardValues?: Record<string, unknown>;
    selectedItemIds?: string[];
    value?: number;
    percentage?: number;
    operation?: string;
  }) => {
    // Use the selected items from the bulk edit modal
    const selectedItemIds = updates.selectedItemIds || selectedTradeInDevices;
    const selectedModelObjects = allUniqueModels.filter(model => selectedItemIds.includes(model.id));

    // Update our local selection state to match what was selected in the modal
    setSelectedTradeInDevices(selectedItemIds);

    // Handle custom price editing
    if (updates.type === "custom_price") {
      console.log('🎯 Custom price requested:', {
        selectedItemIds,
        selectedModelObjects: selectedModelObjects.map(m => ({ id: m.id, name: m.name })),
        stores: updates.stores
      });

      // Store the selected stores and models for the custom price modal
      setPendingCustomPriceStores(updates.stores || []);
      setPendingCustomPriceModels(selectedModelObjects);
      // Close bulk edit modal
      setBulkEditOpen(false);
      // Open custom price modal
      setCustomPriceModalOpen(true);
      return;
    }

    // Handle percentage and fixed updates
    if (updates.type === "percentage" || updates.type === "fixed") {
      // For trade-in devices, we need to update all combinations of selected models + selected stores
      setDevicesList(prev => {
        const newDevicesList = [...prev];

        // Get unique model IDs from selected items
        const selectedModelIds = selectedModelObjects.map(item => item.modelId);

        // Update devices for each combination of selected model + selected store
        selectedModelIds.forEach(modelId => {
          updates.stores?.forEach((storeId: string) => {
            // Find device for this model + store combination
            const deviceIndex = newDevicesList.findIndex(device =>
              device.modelId === modelId && device.store === storeId
            );

            if (deviceIndex >= 0) {
              const device = newDevicesList[deviceIndex];
              const updatedDevice = { ...device };

              ["minValue", "maxValue"].forEach(field => {
                if (updates.fields?.includes(field) && updates.cardValues?.[field]) {
                  const currentValue = device[field as keyof typeof device] as number;
                  const adjustmentValue = parseFloat(updates.cardValues[field] as string || "0");

                  if (!isNaN(adjustmentValue) && currentValue > 0) {
                    if (updates.type === "percentage") {
                      const newValue = currentValue * (1 + adjustmentValue / 100);
                      (updatedDevice as TradeInDevice & Record<string, number>)[field] = Math.max(0, newValue);
                    } else if (updates.type === "fixed") {
                      const newValue = currentValue + adjustmentValue;
                      (updatedDevice as TradeInDevice & Record<string, number>)[field] = Math.max(0, newValue);
                    }
                  }
                }
              });

              newDevicesList[deviceIndex] = updatedDevice;
            }
          });
        });

        return newDevicesList;
      });

      // Clear selection after successful update
      setSelectedTradeInDevices([]);

      toast({
        title: "Edição em massa aplicada",
        description: `${selectedModelObjects.length} modelos foram atualizados em ${updates.stores?.length || 0} lojas`
      });
    }
  };

  const handleCustomTradeInSave = async (changes: {
    modelId: string;
    storeId: string;
    field: 'minValue' | 'maxValue';
    newValue: number;
  }[]): Promise<boolean> => {
    try {
      // Update devices list with new values
      setDevicesList(prev => {
        const newDevicesList = [...prev];

        changes.forEach(change => {
          const deviceIndex = newDevicesList.findIndex(device =>
            device.modelId === change.modelId && device.store === change.storeId
          );

          if (deviceIndex >= 0) {
            newDevicesList[deviceIndex] = {
              ...newDevicesList[deviceIndex],
              [change.field]: change.newValue
            };
          }
        });

        return newDevicesList;
      });

      // Clear selections
      setSelectedTradeInDevices([]);
      setPendingCustomPriceStores([]);
      setPendingCustomPriceModels([]);

      toast({
        title: "Valores personalizados aplicados",
        description: `${changes.length} alterações aplicadas com sucesso`
      });

      return true;
    } catch (error) {
      console.error('Error in handleCustomTradeInSave:', error);
      toast({
        title: "Erro ao aplicar valores personalizados",
        description: "Ocorreu um erro ao salvar as alterações",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    // State
    devicesList,
    dialogOpen,
    setDialogOpen,
    editingDevice,
    setEditingDevice,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    selectedStatus,
    setSelectedStatus,
    bulkEditOpen,
    setBulkEditOpen,
    tradeInEditOpen,
    setTradeInEditOpen,
    selectedTradeInModel,
    selectedTradeInDevices,
    setSelectedTradeInDevices,
    customPriceModalOpen,
    setCustomPriceModalOpen,
    pendingCustomPriceStores,
    setPendingCustomPriceStores,
    pendingCustomPriceModels,
    setPendingCustomPriceModels,
    formData,

    // Computed values
    seminovoModels,
    filteredDevices,
    uniqueModels,
    allUniqueModels,

    // Handlers
    getModelDetails,
    handleOpenDialog,
    handleSave,
    deleteDevice,
    handleFormChange,
    clearFilters,
    handleTradeInEdit,
    handleTradeInSave,
    handleApplyBulkEdit,
    handleCustomTradeInSave
  };
}