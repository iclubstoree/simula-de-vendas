import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { TradeInModal } from "./TradeInModal";
import { useData } from "@/contexts/DataContext";
import { useUpdates } from "@/contexts/UpdateContext";
import { useUserPreferences } from "@/hooks/useLocalStorage";
import { usePriceCalculations } from "@/hooks/usePriceCalculations";
import { useProductSearch } from "@/hooks/useProductSearch";
import { useToast } from "@/hooks/use-toast";

// New refactored components
import { ProductSearch } from "./sales/ProductSearch";
import { StoreSelector } from "./sales/StoreSelector";
import { PriceCalculator } from "./sales/PriceCalculator";
import { PaymentOptionsTable } from "./sales/PaymentOptionsTable";
import { QuoteGenerator } from "./sales/QuoteGenerator";

import { PhoneModel, CardMachine } from "@/data/mockData";

export function SalesSimulator() {
  const { phoneModels, getCardMachinesByStore, stores } = useData();
  const { simulatorUpdateKey } = useUpdates();
  const { toast } = useToast();

  // User preferences for store and card machine
  const {
    getPreference,
    setPreference
  } = useUserPreferences();

  // Mock current user - in real app this would come from auth context
  const currentUser = {
    id: "user-vendedor-1",
    name: "Carlos Silva",
    type: "vendedor" as const,
    allowedStores: ['castanhal', 'belem'] // Multiple stores for testing
  };

  // Main state
  const [selectedStore, setSelectedStore] = useState<string>(() => {
    const savedStore = getPreference('defaultStore', '');
    // If user has only one allowed store, auto-select it
    if (currentUser.allowedStores.length === 1) {
      const singleStore = currentUser.allowedStores[0];
      if (savedStore !== singleStore) {
        setPreference('defaultStore', singleStore);
      }
      return singleStore;
    }
    return savedStore;
  });

  const [priceCents, setPriceCents] = useState(0);
  const [downPaymentCents, setDownPaymentCents] = useState(0);
  const [tradeInValueCents, setTradeInValueCents] = useState(0);
  const [showTradeInModal, setShowTradeInModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);

  // Card machine state
  const [selectedCardMachine, setSelectedCardMachine] = useState<string>("");
  const [availableCardMachines, setAvailableCardMachines] = useState<CardMachine[]>([]);

  // Search functionality using our new hook
  const searchContextModels = useCallback((query: string, type?: 'novo' | 'seminovo', store?: string): PhoneModel[] => {
    if (!query.trim()) return [];

    const filtered = phoneModels.filter(model => {
      const matchesQuery = model.name.toLowerCase().includes(query.toLowerCase()) ||
                          model.category.toLowerCase().includes(query.toLowerCase()) ||
                          model.subcategory.toLowerCase().includes(query.toLowerCase());
      const matchesType = type ? model.type === type : true;
      const matchesStore = store ? model.prices[store as keyof typeof model.prices] : true;
      return matchesQuery && matchesType && matchesStore;
    });

    return filtered.slice(0, 10); // Limit results
  }, [phoneModels]);

  const {
    searchQuery,
    selectedModel,
    handleSearchChange,
    handleModelSelect: onModelSelect
  } = useProductSearch({
    searchFunction: searchContextModels,
    selectedStore,
    onModelSelect: (model: PhoneModel) => {
      // Get price for selected store
      const storePrice = selectedStore ? model.prices[selectedStore as keyof typeof model.prices] : 0;
      const priceToUse = storePrice || 0;
      setPriceCents(priceToUse * 100); // Convert reais to cents
      setDownPaymentCents(0);
      setTradeInValueCents(0);
    }
  });

  // Price calculations using our new hook
  const { calculation } = usePriceCalculations({
    priceCents,
    downPaymentCents,
    tradeInValueCents,
    selectedCardMachine,
    availableCardMachines
  });

  // Initialize card machines when store changes
  useEffect(() => {
    if (selectedStore) {
      const machines = getCardMachinesByStore(selectedStore);
      setAvailableCardMachines(machines);

      const lastUsedMachine = getPreference('defaultCardMachine', '');
      const lastMachineAvailable = machines.find(m => m.id === lastUsedMachine);

      if (lastMachineAvailable) {
        setSelectedCardMachine(lastUsedMachine);
      } else if (machines.length > 0) {
        const defaultMachine = machines[0].id;
        setSelectedCardMachine(defaultMachine);
        setPreference('defaultCardMachine', defaultMachine);
      } else {
        setSelectedCardMachine("");
      }

      // Clear form when store changes
      clearForm();
    }
  }, [selectedStore, getCardMachinesByStore, getPreference, setPreference]);

  // Show store modal if no store is selected
  useEffect(() => {
    if (!selectedStore) {
      setShowStoreModal(true);
    }
  }, [selectedStore]);

  // Listen for updates from configuration changes
  useEffect(() => {
    if (simulatorUpdateKey > 0) {
      toast({
        title: "Simulador atualizado",
        description: "Os dados foram atualizados automaticamente com as novas configurações.",
      });

      // If current model is no longer available, clear the form
      if (selectedModel && !phoneModels.find(model => model.id === selectedModel.id && model.active)) {
        clearForm();
      }

      // If selected store is no longer active, clear store selection
      if (selectedStore && !stores.find(store => store.id === selectedStore && store.active)) {
        setSelectedStore('');
        setShowStoreModal(true);
      }
    }
  }, [simulatorUpdateKey, toast, selectedModel, phoneModels, clearForm, selectedStore, stores]);

  // Handle store change
  const handleStoreChange = useCallback((storeId: string) => {
    setSelectedStore(storeId);
    setPreference('defaultStore', storeId);
    setShowStoreModal(false);
  }, [setPreference]);

  // Handle card machine change
  const handleCardMachineChange = useCallback((machineId: string) => {
    setSelectedCardMachine(machineId);
    setPreference('defaultCardMachine', machineId);
  }, [setPreference]);

  // Clear form
  const clearForm = useCallback(() => {
    handleSearchChange("");
    setPriceCents(0);
    setDownPaymentCents(0);
    setTradeInValueCents(0);
  }, [handleSearchChange]);

  // Handle trade-in value change
  const handleTradeInValueChange = useCallback((value: number) => {
    setTradeInValueCents(value * 100); // Convert reais to cents
    setShowTradeInModal(false);
  }, []);

  // Filter stores based on user permissions
  const allowedStoresData = stores.filter(store =>
    store.active && currentUser.allowedStores.includes(store.id)
  );

  const selectedStoreData = stores.find(store => store.id === selectedStore);
  const isSingleStoreUser = currentUser.allowedStores.length === 1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Input Form */}
        <div className="space-y-6">
          {/* Store Selection */}
          <StoreSelector
            selectedStore={selectedStore}
            selectedStoreData={selectedStoreData}
            allowedStores={allowedStoresData}
            onStoreChange={handleStoreChange}
            showModal={showStoreModal}
            onShowModalChange={setShowStoreModal}
            isSingleStoreUser={isSingleStoreUser}
          />

          {/* Product Search */}
          <ProductSearch
            value={searchQuery}
            onChange={handleSearchChange}
            onModelSelect={onModelSelect}
            searchFunction={searchContextModels}
            selectedStore={selectedStore}
            disabled={!selectedStore}
          />

          {/* Price Calculator */}
          <PriceCalculator
            selectedModel={selectedModel}
            priceCents={priceCents}
            onPriceChange={setPriceCents}
            downPaymentCents={downPaymentCents}
            onDownPaymentChange={setDownPaymentCents}
            tradeInValueCents={tradeInValueCents}
            onTradeInValueChange={setTradeInValueCents}
            onOpenTradeInModal={() => setShowTradeInModal(true)}
            disabled={!selectedStore}
          />
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Quote Generator */}
          <QuoteGenerator
            selectedModel={selectedModel}
            modelName={searchQuery}
            priceCents={priceCents}
            tradeInValueCents={tradeInValueCents}
            calculateInstallments={calculation.installmentOptions}
          />

          {/* Payment Options Table */}
          <PaymentOptionsTable
            priceCents={priceCents}
            downPaymentCents={downPaymentCents}
            tradeInValueCents={tradeInValueCents}
            selectedCardMachine={selectedCardMachine}
            availableCardMachines={availableCardMachines}
            onCardMachineChange={handleCardMachineChange}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={clearForm}
          variant="outline"
        >
          Limpar
        </Button>
        <Button
          onClick={() => {
            const simulationText = `
Simulação de Venda - iClub
Modelo: ${selectedModel?.name || searchQuery}
Loja: ${selectedStoreData?.name || 'N/A'}
Preço: R$ ${(priceCents / 100).toFixed(2).replace('.', ',')}
Entrada: R$ ${(downPaymentCents / 100).toFixed(2).replace('.', ',')}
Parcelamento: Ver opções de pagamento
            `.trim();

            navigator.clipboard.writeText(simulationText);
          }}
          disabled={!selectedModel && !searchQuery}
        >
          Copiar Simulação
        </Button>
      </div>

      {/* Trade-in Modal */}
      <TradeInModal
        open={showTradeInModal}
        onOpenChange={setShowTradeInModal}
        onApply={handleTradeInValueChange}
        store={selectedStore}
      />
    </div>
  );
}