import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy, Trash2, Search, Clock, Plus, CreditCard, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TradeInModal } from "./TradeInModal";
import { searchModels, getRecentSearches, formatCurrency, PhoneModel, RecentSearch, Store as StoreType, CardMachine } from "@/data/mockData";
import { useData } from "@/contexts/DataContext";
import { StandaloneCurrencyInput } from "@/lib/ControlledCurrencyInput";
import { parseInputToCents, formatCentsToBRL } from "@/lib/currency";

// Local storage helpers for search history
const SEARCH_HISTORY_KEY = 'sales-simulator-search-history';
const saveModelToHistory = (modelName: string) => {
  if (!modelName.trim()) return;
  const history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
  const existingIndex = history.findIndex((item: RecentSearch) => item.query.toLowerCase() === modelName.toLowerCase());
  const searchItem = {
    id: Date.now().toString(),
    query: modelName.trim(),
    results: 1,
    timestamp: new Date().toISOString()
  };
  if (existingIndex >= 0) {
    history.splice(existingIndex, 1);
  }
  history.unshift(searchItem);
  history.splice(10); // Keep only last 10 searches

  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
};
const getSearchHistory = (): RecentSearch[] => {
  return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
};
const clearSearchHistory = () => {
  localStorage.removeItem(SEARCH_HISTORY_KEY);
};
export function SalesSimulator() {
  const { phoneModels, getCardMachinesByStore, stores } = useData();
  
  // Mock current user - in real app this would come from auth context
  const currentUser = {
    id: "user-vendedor-1", 
    name: "Carlos Silva",
    type: "vendedor" as const,
    allowedStores: ['castanhal', 'belem'] // Multiple stores for testing
  };
  
  const [selectedStore, setSelectedStore] = useState<string>(() => {
    const savedStore = localStorage.getItem('selected-store');
    // If user has only one allowed store, auto-select it
    if (currentUser.allowedStores.length === 1) {
      const singleStore = currentUser.allowedStores[0];
      if (savedStore !== singleStore) {
        localStorage.setItem('selected-store', singleStore);
      }
      return singleStore;
    }
    return savedStore || "";
  });

  // Local search function using context data
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
  const [model, setModel] = useState("");
  const [selectedModel, setSelectedModel] = useState<PhoneModel | null>(null);
  const [priceCents, setPriceCents] = useState(0); // Valor em cents
  const [downPaymentCents, setDownPaymentCents] = useState(0); // Valor em cents
  const [tradeInValueCents, setTradeInValueCents] = useState(0); // Valor em cents
  const [showTradeInModal, setShowTradeInModal] = useState(false);
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);
  const [modelSuggestions, setModelSuggestions] = useState<PhoneModel[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [selectedCardMachine, setSelectedCardMachine] = useState<string>("");
  const [availableCardMachines, setAvailableCardMachines] = useState<CardMachine[]>([]);
  const [lastUsedCardMachine, setLastUsedCardMachine] = useState<string>("");
  const [modelWasSelected, setModelWasSelected] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const {
    toast
  } = useToast();

  const clearForm = useCallback(() => {
    setModel("");
    setSelectedModel(null);
    setPriceCents(0);
    setDownPaymentCents(0);
    setTradeInValueCents(0);
    setShowModelSuggestions(false);
    setModelWasSelected(false);
  }, []);

  useEffect(() => {
    setRecentSearches(getSearchHistory());
    const savedMachine = localStorage.getItem('last-card-machine');
    if (savedMachine) {
      setLastUsedCardMachine(savedMachine);
    }
    
    // Show store modal if no store is selected
    if (!selectedStore) {
      setShowStoreModal(true);
    }
  }, [selectedStore]);
  useEffect(() => {
    if (selectedStore) {
      const machines = getCardMachinesByStore(selectedStore);
      setAvailableCardMachines(machines);

      // Try to use last used machine if available in current store
      const lastMachineAvailable = machines.find(m => m.id === lastUsedCardMachine);
      if (lastMachineAvailable) {
        setSelectedCardMachine(lastUsedCardMachine);
      } else if (machines.length === 1) {
        setSelectedCardMachine(machines[0].id);
        setLastUsedCardMachine(machines[0].id);
        localStorage.setItem('last-card-machine', machines[0].id);
      } else if (machines.length > 0) {
        // Use first available machine if no last used machine
        setSelectedCardMachine(machines[0].id);
        setLastUsedCardMachine(machines[0].id);
        localStorage.setItem('last-card-machine', machines[0].id);
      } else {
        setSelectedCardMachine("");
      }

      // Reset form when store changes
      clearForm();
    }
  }, [selectedStore, lastUsedCardMachine, clearForm, getCardMachinesByStore]);

  const handleModelInputChange = useCallback((value: string) => {
    setModel(value);
    if (value.trim() && selectedStore) {
      const suggestions = searchContextModels(value, 'novo', selectedStore);
      setModelSuggestions(suggestions);
      setShowModelSuggestions(suggestions.length > 0);
    } else {
      setModelSuggestions([]);
      setShowModelSuggestions(value.trim() === '' && getSearchHistory().length > 0);
    }
  }, [selectedStore, searchContextModels]);
  const handleModelFocus = useCallback(() => {
    // If there's a model selected (either typed or from recent search), clear everything
    if (selectedModel || modelWasSelected) {
      setModel("");
      setSelectedModel(null);
      setPriceCents(0);
      setDownPaymentCents(0);
      setTradeInValueCents(0);
      setModelWasSelected(false);
    }

    // Always refresh and show recent searches when focusing
    setRecentSearches(getSearchHistory());
    if (getSearchHistory().length > 0) {
      setShowModelSuggestions(true);
    }
  }, [selectedModel, modelWasSelected]);
  const handleModelSelect = useCallback((selectedModel: PhoneModel) => {
    setModel(selectedModel.name);
    setSelectedModel(selectedModel);
    // Get price for selected store
    const storePrice = selectedStore ? selectedModel.prices[selectedStore as keyof typeof selectedModel.prices] : 0;
    const priceToUse = storePrice || 0;
    setPriceCents(priceToUse * 100); // Converte reais para cents
    setDownPaymentCents(0);
    setTradeInValueCents(0);
    setShowModelSuggestions(false);
    setModelWasSelected(true);

    // Save to search history only the model name
    saveModelToHistory(selectedModel.name);
    setRecentSearches(getSearchHistory());
    toast({
      title: "Modelo selecionado",
      description: `${selectedModel.name} - ${formatCurrency(priceToUse)}`,
      duration: 2000
    });
  }, [toast, selectedStore]);
  const selectModelByName = useCallback((modelName: string) => {
    if (selectedStore) {
      const suggestions = searchContextModels(modelName, 'novo', selectedStore);
      if (suggestions.length > 0) {
        const exactMatch = suggestions.find(s => s.name.toLowerCase() === modelName.toLowerCase());
        const modelToSelect = exactMatch || suggestions[0];
        handleModelSelect(modelToSelect);
      }
    }
  }, [selectedStore, handleModelSelect, searchContextModels]);
  const handleRecentSearchClick = useCallback((query: string) => {
    selectModelByName(query);
  }, [selectModelByName]);
  const clearRecentSearches = () => {
    clearSearchHistory();
    setRecentSearches([]);
    toast({
      title: "Pesquisas limpas",
      description: "Histórico de pesquisas foi removido",
      duration: 2000
    });
  };
  const handleCardMachineChange = (machineId: string) => {
    setSelectedCardMachine(machineId);
    setLastUsedCardMachine(machineId);
    localStorage.setItem('last-card-machine', machineId);
  };

  const handleStoreChange = (storeId: string) => {
    setSelectedStore(storeId);
    localStorage.setItem('selected-store', storeId);
    setShowStoreModal(false);
  };
  const calculateInstallments = useMemo(() => {
    if (!selectedCardMachine) return [];
    const machine = availableCardMachines.find(m => m.id === selectedCardMachine);
    if (!machine) return [];
    const priceValue = priceCents / 100;
    const downPaymentValue = downPaymentCents / 100;
    const tradeInValueParsed = tradeInValueCents / 100;
    const baseValue = Math.max(0, priceValue - downPaymentValue - tradeInValueParsed);
    const installments = [];

    // Debit
    installments.push({
      type: "Débito",
      value: formatCurrency(baseValue),
      total: formatCurrency(baseValue),
      hasDownPayment: downPaymentValue > 0
    });

    // Installments 1 to maxInstallments
    for (let i = 1; i <= machine.maxInstallments; i++) {
      const rate = machine.rates[i] || 0;
      const tax = rate / 100;
      const totalWithTax = baseValue / (1 - tax);
      const installmentValue = totalWithTax / i;
      installments.push({
        type: `${i}x`,
        value: formatCurrency(installmentValue),
        total: formatCurrency(totalWithTax),
        hasDownPayment: downPaymentValue > 0
      });
    }
    return installments;
  }, [selectedCardMachine, availableCardMachines, priceCents, downPaymentCents, tradeInValueCents]);
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${type} copiado para a área de transferência`,
      duration: 2000
    });
  };
  const generateQuote = useCallback(() => {
    const price = formatCentsToBRL(priceCents);
    return `${selectedModel?.name || model} está ${price}.`;
  }, [selectedModel, model, priceCents]);
  const generate12xQuote = useCallback(() => {
    const installment12x = calculateInstallments.find(item => item.type === "12x");
    return `${selectedModel?.name || model} está 12x ${installment12x?.value || "R$ 0,00"}.`;
  }, [calculateInstallments, selectedModel, model]);
  const generateTradeInQuote = useCallback(() => {
    const priceValue = priceCents / 100;
    const tradeInValueParsed = tradeInValueCents / 100;
    const difference = priceValue - tradeInValueParsed;
    return `A volta para o ${selectedModel?.name || model} é de ${formatCurrency(difference)}.`;
  }, [priceCents, tradeInValueCents, selectedModel, model]);
  // Filter stores based on user permissions
  const allowedStoresData = stores.filter(store => 
    store.active && currentUser.allowedStores.includes(store.id)
  );
  const selectedStoreData = stores.find(store => store.id === selectedStore);
  const isSingleStoreUser = currentUser.allowedStores.length === 1;
  return <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Simulation Form */}
          <Card className="card-animate hover-float">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Simulador de Vendas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Store Selection - First Field */}
              <div>
                <Label htmlFor="store-select" className="flex items-center gap-2 text-sm font-medium">
                  <Store className="h-4 w-4 text-primary" />
                  Loja
                </Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    {selectedStore ? (
                      <div className="flex items-center justify-between p-2 border rounded-md bg-muted">
                        <span className="font-medium">{selectedStoreData?.city}</span>
                        {!isSingleStoreUser && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowStoreModal(true)}
                            className="h-auto p-1"
                          >
                            <Store className="h-4 w-4" />
                          </Button>
                        )}
                        {isSingleStoreUser && (
                          <Badge variant="secondary" className="text-xs">
                            Fixo
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={() => setShowStoreModal(true)}
                        className="w-full justify-start"
                        disabled={isSingleStoreUser}
                      >
                        <Store className="h-4 w-4 mr-2" />
                        {isSingleStoreUser ? "Loja única atribuída" : "Selecionar Loja"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              {/* Model Input with Autocomplete */}
              <div className="relative">
                <Label htmlFor="model">Modelo:</Label>
                <Input 
                  ref={modelInputRef} 
                  id="model" 
                  value={model} 
                  onChange={e => handleModelInputChange(e.target.value)} 
                  onFocus={handleModelFocus} 
                  onBlur={() => setTimeout(() => setShowModelSuggestions(false), 200)} 
                  placeholder={selectedStore ? "Digite o modelo do celular" : "Selecione uma loja primeiro"} 
                  className="pr-10" 
                  disabled={!selectedStore}
                />
                <Search className="absolute right-3 top-8 h-4 w-4 text-muted-foreground pointer-events-none" />
                
                {/* Suggestions Dropdown */}
                {showModelSuggestions && <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                     {model.trim() === '' && recentSearches.length > 0 ? <div className="p-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Últimas pesquisas
                          </div>
                          <Button variant="ghost" size="sm" onClick={clearRecentSearches} className="h-5 px-2 text-xs">
                            Limpar
                          </Button>
                        </div>
                        {recentSearches.slice(0, 5).map(search => <button key={search.id} className="w-full text-left px-2 py-1 text-sm hover:bg-accent rounded text-muted-foreground" onClick={() => handleRecentSearchClick(search.query)}>
                            {search.query}
                          </button>)}
                      </div> : <>
                        {modelSuggestions.map(suggestion => <button key={suggestion.id} className="w-full text-left p-3 hover:bg-accent border-b last:border-0 transition-colors" onClick={() => handleModelSelect(suggestion)}>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-sm">{suggestion.name}</p>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {suggestion.category}
                                  </Badge>
                                  <Badge variant="default" className="text-xs">
                                    novo
                                  </Badge>
                                </div>
                              </div>
                              <p className="font-bold text-primary text-sm">
                                {formatCurrency(suggestion.price)}
                              </p>
                            </div>
                          </button>)}
                        
                        {model.trim() && modelSuggestions.length === 0 && <div className="p-4 text-center text-muted-foreground text-sm">
                            Nenhum modelo encontrado para "{model}" na loja {selectedStoreData?.name}
                          </div>}
                      </>}
                  </div>}
              </div>

              {/* Product Price */}
              <div>
                <StandaloneCurrencyInput
                  id="price"
                  label="Valor do Produto (R$)"
                  value={priceCents}
                  onChange={setPriceCents}
                  placeholder="R$ 0,00"
                  disabled={!selectedStore}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Preenchido automaticamente, mas editável
                </p>
              </div>

              {/* Down Payment */}
              <div>
                <StandaloneCurrencyInput
                  id="downPayment"
                  label="Entrada (R$)"
                  value={downPaymentCents}
                  onChange={setDownPaymentCents}
                  placeholder="R$ 0,00"
                  disabled={!selectedStore}
                />
              </div>

              {/* Trade-in Device */}
              <div>
                <Label htmlFor="tradeIn">Aparelho de Entrada (R$):</Label>
                <div className="flex gap-2">
                  <Input 
                    id="tradeIn" 
                    value={tradeInValueCents > 0 ? formatCentsToBRL(tradeInValueCents) : ""} 
                    readOnly 
                    placeholder="R$ 0,00" 
                    className="bg-muted" 
                    disabled={!selectedStore}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => setShowTradeInModal(true)} 
                    className="whitespace-nowrap"
                    disabled={!selectedStore}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  {tradeInValueCents > 0 && <Button variant="outline" size="icon" onClick={() => {
                      setTradeInValueCents(0);
                      toast({
                        title: "Aparelho removido",
                        description: "Aparelho de entrada foi removido do cálculo",
                        duration: 2000
                      });
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>}
                </div>
                {tradeInValueCents > 0 && <Badge variant="secondary" className="mt-1">
                    {formatCentsToBRL(tradeInValueCents)} aplicado
                  </Badge>}
              </div>
            </CardContent>
          </Card>

          {/* Quotes and Installments */}
          <div className="space-y-6">
            {/* Quote Cards */}
            <Card className="card-animate hover-float">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Copy className="h-5 w-5 text-primary" />
                  Orçamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Client Quote */}
                  <div className="p-3 bg-green-50 border-green-200 border rounded-lg">
                    <p className="text-sm font-medium mb-2">Orçamento Valor Total</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{generateQuote()}</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generateQuote(), "Orçamento")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* 12x Quote */}
                  <div className="p-3 bg-green-50 border-green-200 border rounded-lg">
                    <p className="text-sm font-medium mb-2">Orçamento em 12x</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{generate12xQuote()}</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generate12xQuote(), "Orçamento 12x")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Trade-in Quote */}
                  {tradeInValueCents > 0 ? <div className="p-3 bg-green-50 border-green-200 border rounded-lg">
                      <p className="text-sm font-medium mb-2">Orçamento com Aparelho</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{generateTradeInQuote()}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generateTradeInQuote(), "Orçamento com Aparelho")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div> : <div className="p-3 bg-gray-50 border-gray-200 border rounded-lg opacity-50">
                      <p className="text-sm font-medium mb-2">Orçamento com Aparelho</p>
                      <p className="text-sm text-muted-foreground">Adicione um aparelho de entrada</p>
                    </div>}
                </div>
              </CardContent>
            </Card>

            {/* Installments Table */}
            <Card className="card-animate hover-float" key={`installments-${priceCents}-${downPaymentCents}-${tradeInValueCents}-${selectedCardMachine}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Parcelamento no cartão
                </CardTitle>
              </CardHeader>
              <CardContent>
                {availableCardMachines.length > 1 && (
                  <div className="mb-4 flex justify-center">
                    <Select value={selectedCardMachine} onValueChange={handleCardMachineChange}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Máquina de cartão" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCardMachines.map(machine => <SelectItem key={machine.id} value={machine.id}>
                            {machine.name}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {selectedCardMachine ? <div className="space-y-2 max-h-80 overflow-y-auto">
                    <div className="grid grid-cols-4 gap-4 text-xs font-medium text-muted-foreground pb-2 border-b">
                      <span>Parcelas</span>
                      <span>Valor</span>
                      <span>Total no cartão</span>
                      <span>Ação</span>
                    </div>
                    {calculateInstallments.map((item, index) => <div key={index} className="grid grid-cols-4 gap-4 items-center p-2 rounded-lg hover:bg-muted transition-colors">
                        <span className="font-medium text-sm">{item.type}</span>
                        <div className="text-sm">
                          {item.hasDownPayment && `${formatCentsToBRL(downPaymentCents)} + `}
                          {item.type === "Débito" ? item.value : item.value}
                        </div>
                        <span className="text-sm">{item.total}</span>
                        <Button variant="ghost" size="sm" onClick={() => {
                  const text = item.hasDownPayment ? `${formatCentsToBRL(downPaymentCents)} + ${item.type === "Débito" ? "Débito" : item.type} de ${item.value}` : `${item.type === "Débito" ? "Débito" : item.type} de ${item.value}`;
                  copyToClipboard(text, `Parcela ${item.type}`);
                }}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>)}
                  </div> : <div className="text-center text-muted-foreground py-8">
                    Selecione uma máquina de cartão para ver as opções de parcelamento
                  </div>}
              </CardContent>
            </Card>
          </div>
        </div>

      <TradeInModal open={showTradeInModal} onOpenChange={setShowTradeInModal} onApply={value => {
      setTradeInValueCents(value * 100); // Converte reais para cents
      setShowTradeInModal(false);
    }} store={selectedStore} />

      {/* Store Selection Modal */}
      <Dialog open={showStoreModal} onOpenChange={(open) => {
        // Only allow closing if there's already a store selected
        if (!open && selectedStore) {
          setShowStoreModal(false);
        }
      }}>
        <DialogContent className="max-w-md" onInteractOutside={(e) => {
          // Prevent closing on outside click if no store is selected
          if (!selectedStore) {
            e.preventDefault();
          }
        }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              {selectedStore ? "Trocar Loja" : "Selecionar Loja"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {allowedStoresData.length === 0 ? (
              <div className="text-center py-8">
                <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma loja disponível para seu usuário
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {allowedStoresData.map(store => (
                  <Button
                    key={store.id}
                    variant={selectedStore === store.id ? "default" : "outline"}
                    className="justify-start h-auto p-4"
                    onClick={() => handleStoreChange(store.id)}
                  >
                    <div className="text-left">
                      <div className="font-semibold">{store.name}</div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>;
}