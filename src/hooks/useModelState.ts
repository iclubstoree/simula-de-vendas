import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  categories,
  subcategories,
  stores,
  type PhoneModel
} from "@/data/mockData";
import { formatCurrency, parseBRLToNumber } from "@/lib/currency";
import { useModels, useBulkUpdateModels } from "@/hooks/useModels";
import { useData } from "@/contexts/DataContext";

interface ModelFormData {
  name: string;
  category: string;
  subcategory: string;
  type: "novo" | "seminovo";
  prices: {
    castanhal: string;
    belem: string;
    ananindeua: string;
  };
  active: boolean;
}

export function useModelState() {
  // React Query hooks
  const { data: modelsList = [], isLoading, error } = useModels();
  const bulkUpdateMutation = useBulkUpdateModels();
  const { addPhoneModel, addTradeInDevice } = useData();

  // State management
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<PhoneModel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [bulkEditModalOpen, setBulkEditModalOpen] = useState(false);
  const [customPriceModalOpen, setCustomPriceModalOpen] = useState(false);
  const [pendingCustomPriceStores, setPendingCustomPriceStores] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const [formData, setFormData] = useState<ModelFormData>({
    name: "",
    category: "",
    subcategory: "",
    type: "novo",
    prices: {
      castanhal: "",
      belem: "",
      ananindeua: ""
    },
    active: true
  });

  const { toast } = useToast();

  // Filter models
  const filteredModels = modelsList.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || model.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === "all" || model.subcategory === selectedSubcategory;
    const matchesType = selectedType === "all" || model.type === selectedType;
    const matchesStatus = selectedStatus === "all" || (selectedStatus === "active" && model.active) || (selectedStatus === "inactive" && !model.active);

    return matchesSearch && matchesCategory && matchesSubcategory && matchesType && matchesStatus;
  });

  // Get subcategories for selected category
  const availableSubcategories = subcategories.filter(sub =>
    sub.categoryId === categories.find(cat => cat.name === formData.category)?.id
  );

  const handleOpenDialog = (model?: PhoneModel) => {
    if (model) {
      setEditingModel(model);

      const prices = {
        castanhal: model.prices.castanhal ? formatCurrency(model.prices.castanhal) : "",
        belem: model.prices.belem ? formatCurrency(model.prices.belem) : "",
        ananindeua: model.prices.ananindeua ? formatCurrency(model.prices.ananindeua) : ""
      };

      setFormData({
        name: model.name,
        category: model.category,
        subcategory: model.subcategory,
        type: model.type,
        prices,
        active: model.active
      });
    } else {
      setEditingModel(null);
      setFormData({
        name: "",
        category: "",
        subcategory: "",
        type: "novo",
        prices: {
          castanhal: "",
          belem: "",
          ananindeua: ""
        },
        active: true
      });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.category || !formData.subcategory) {
      toast({
        title: "Erro",
        description: "Nome, categoria e subcategoria são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Parse prices from form
    const newPrices: { castanhal?: number; belem?: number; ananindeua?: number } = {};

    // Only add prices that have valid values
    if (formData.prices.castanhal.trim()) {
      const price = parseBRLToNumber(formData.prices.castanhal);
      if (!isNaN(price) && price > 0) {
        newPrices.castanhal = price;
      }
    }

    if (formData.prices.belem.trim()) {
      const price = parseBRLToNumber(formData.prices.belem);
      if (!isNaN(price) && price > 0) {
        newPrices.belem = price;
      }
    }

    if (formData.prices.ananindeua.trim()) {
      const price = parseBRLToNumber(formData.prices.ananindeua);
      if (!isNaN(price) && price > 0) {
        newPrices.ananindeua = price;
      }
    }

    // Check if at least one price is provided
    if (Object.keys(newPrices).length === 0) {
      toast({
        title: "Erro",
        description: "Pelo menos um preço deve ser informado",
        variant: "destructive"
      });
      return;
    }

    if (editingModel) {
      // Edit existing model - update using mutation for immediate UI update
      bulkUpdateMutation.mutate([
        {
          id: editingModel.id,
          name: formData.name,
          pricesByStore: newPrices
        }
      ], {
        onSuccess: () => {
          toast({
            title: "Sucesso",
            description: "Modelo atualizado com sucesso"
          });
        },
        onError: () => {
          toast({
            title: "Erro",
            description: "Erro ao atualizar modelo",
            variant: "destructive"
          });
        }
      });
    } else {
      // Create new model
      const newModel = {
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        type: formData.type,
        prices: newPrices,
        active: formData.active
      };

      // Add the model to context and get the new ID
      const newModelId = addPhoneModel(newModel);

      // If type is "novo", also add to trade-in devices for all stores
      if (formData.type === "novo") {
        const activeStores = stores.filter(store => store.active);
        activeStores.forEach(store => {
          addTradeInDevice({
            modelId: newModelId,
            name: formData.name,
            minValue: 0,
            maxValue: 0,
            store: store.id as 'castanhal' | 'belem' | 'ananindeua',
            active: true
          });
        });
      }

      toast({
        title: "Sucesso",
        description: `Modelo ${formData.name} criado com sucesso${formData.type === "novo" ? " e adicionado aos aparelhos de entrada" : ""}`
      });
    }

    setDialogOpen(false);
    setEditingModel(null);
  };

  const toggleModelActive = (modelId: string) => {
    // For now, show message that this is in development
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Ativação/desativação de modelos será implementada em breve",
      variant: "default"
    });
  };

  const deleteModel = (modelId: string) => {
    const model = modelsList.find(m => m.id === modelId);

    if (!model) return;

    if (!window.confirm(`Tem certeza que deseja excluir o modelo "${model.name}"?\n\nEsta ação não pode ser desfeita.`)) {
      return;
    }

    // For now, show message that this is in development
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Exclusão de modelos será implementada em breve",
      variant: "default"
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setSelectedType("all");
    setSelectedStatus("all");
  };

  const handleFormChange = (updates: Partial<ModelFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Function to apply bulk edits with React Query
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
    const selectedItemIds = updates.selectedItemIds || selectedModels;
    const selectedModelObjects = modelsList.filter(model => selectedItemIds.includes(model.id));

    // Update our local selection state to match what was selected in the modal
    setSelectedModels(selectedItemIds);

    // Handle custom price editing
    if (updates.type === "custom_price") {
      // Store the selected stores for the custom price modal
      setPendingCustomPriceStores(updates.stores || []);
      // Close bulk edit modal
      setBulkEditModalOpen(false);
      // Open custom price modal
      setCustomPriceModalOpen(true);
      return;
    }

    // Prepare mutations based on update type
    const mutations: { id: string; pricesByStore: Record<string, number> }[] = [];

    selectedModelObjects.forEach(model => {
      if (updates.type === "percentage" || updates.type === "fixed") {
        // Update prices for selected stores
        if (updates.fields?.includes("price") && updates.stores) {
          const newPrices = { ...model.prices };
          const adjustmentValue = parseFloat(String(updates.cardValues?.price) || "0");

          updates.stores.forEach((storeId: string) => {
            const currentPrice = newPrices[storeId as keyof typeof newPrices];
            if (currentPrice) {
              if (updates.type === "percentage") {
                const newPrice = currentPrice * (1 + adjustmentValue / 100);
                newPrices[storeId as keyof typeof newPrices] = Math.max(0, newPrice);
              } else if (updates.type === "fixed") {
                const newPrice = currentPrice + adjustmentValue;
                newPrices[storeId as keyof typeof newPrices] = Math.max(0, newPrice);
              }
            }
          });

          mutations.push({ id: model.id, pricesByStore: newPrices });
        }
      }
    });

    // Execute bulk mutation
    if (mutations.length > 0) {
      bulkUpdateMutation.mutate(mutations, {
        onSuccess: (data) => {
          console.log('🎉 Bulk update successful:', data);
          // Clear selection after successful update
          setSelectedModels([]);

          toast({
            title: "Edição em massa aplicada",
            description: `${selectedModelObjects.length} modelos foram atualizados com sucesso`
          });
        },
        onError: (error) => {
          console.error('💥 Bulk update failed:', error);
          toast({
            title: "Erro na edição em massa",
            description: "Ocorreu um erro ao aplicar as alterações",
            variant: "destructive"
          });
        }
      });
    } else {
      console.log('⚠️ No mutations to execute');
    }
  };

  // Function for live/real-time updates (preview only, not persisted)
  const handleLiveUpdate = (updates: { type: string; [key: string]: unknown }) => {
    // For live updates, we could show a preview but we'll keep it simple for now
    // The real updates happen when the user saves
    console.log('Live update preview:', updates);
  };

  // Function to handle custom price save
  const handleCustomPriceSave = async (changes: { modelId: string; storeId: string; newPrice: number }[]): Promise<boolean> => {
    try {
      // Group changes by model ID
      const changesByModel: Record<string, Record<string, number>> = {};

      changes.forEach(change => {
        if (!changesByModel[change.modelId]) {
          changesByModel[change.modelId] = {};
        }
        changesByModel[change.modelId][change.storeId] = change.newPrice;
      });

      // Create mutations for bulk update
      const mutations: { id: string; pricesByStore: Record<string, number> }[] = [];

      Object.entries(changesByModel).forEach(([modelId, priceChanges]) => {
        const model = modelsList.find(m => m.id === modelId);
        if (model) {
          // Merge current prices with new changes
          const updatedPrices = { ...model.prices, ...priceChanges };
          mutations.push({ id: modelId, pricesByStore: updatedPrices });
        }
      });

      // Execute bulk mutation
      if (mutations.length > 0) {
        await new Promise<void>((resolve, reject) => {
          bulkUpdateMutation.mutate(mutations, {
            onSuccess: () => {
              // Clear selection after successful update
              setSelectedModels([]);
              setPendingCustomPriceStores([]);

              toast({
                title: "Preços personalizados aplicados",
                description: `${changes.length} alterações aplicadas com sucesso`
              });
              resolve();
            },
            onError: (error) => {
              console.error('💥 Custom price update failed:', error);
              toast({
                title: "Erro ao aplicar preços personalizados",
                description: "Ocorreu um erro ao salvar as alterações",
                variant: "destructive"
              });
              reject(error);
            }
          });
        });
      }

      return true;
    } catch (error) {
      console.error('Error in handleCustomPriceSave:', error);
      return false;
    }
  };

  return {
    // State
    modelsList,
    isLoading,
    error,
    dialogOpen,
    setDialogOpen,
    editingModel,
    setEditingModel,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    bulkEditModalOpen,
    setBulkEditModalOpen,
    customPriceModalOpen,
    setCustomPriceModalOpen,
    pendingCustomPriceStores,
    setPendingCustomPriceStores,
    selectedModels,
    setSelectedModels,
    formData,
    setFormData,

    // Computed values
    filteredModels,
    availableSubcategories,

    // Handlers
    handleOpenDialog,
    handleSave,
    toggleModelActive,
    deleteModel,
    clearFilters,
    handleFormChange,
    handleApplyBulkEdit,
    handleLiveUpdate,
    handleCustomPriceSave
  };
}