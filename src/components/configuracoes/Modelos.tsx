import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Plus, Edit, Search, Filter, GripVertical, Trash2, Info } from "lucide-react";
import { 
  stores,
  categories,
  subcategories,
  type PhoneModel,
  formatCurrency
} from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { formatCentsToBRL, centsToReais, reaisToCents, parseBRLToNumber } from "@/lib/currency";
import { StandaloneCurrencyInput } from "@/lib/ControlledCurrencyInput";
import { BulkEditModal } from "./BulkEditModal";
import { CustomPriceEditModal } from "./CustomPriceEditModal";
import { useModels, useBulkUpdateModels } from "@/hooks/useModels";
import { useData } from "@/contexts/DataContext";

export function Modelos() {
  console.log('🔍 Modelos component loading...');
  // React Query hooks
  const { data: modelsList = [], isLoading, error } = useModels();
  console.log('📊 Models data:', { modelsList, isLoading, error });
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
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    type: "novo" as "novo" | "seminovo",
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

  // Get subcategories for selected category
  const availableSubcategories = subcategories.filter(sub => 
    sub.categoryId === categories.find(cat => cat.name === formData.category)?.id
  );

  // Function to apply bulk edits with React Query
  const handleApplyBulkEdit = (updates: { type: string; fields?: string[]; stores?: string[]; cardValues?: any; selectedItemIds?: string[]; }) => {
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
        if (updates.fields.includes("price") && updates.stores) {
          const newPrices = { ...model.prices };
          const adjustmentValue = parseFloat(updates.cardValues.price || "0");
          
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
  const handleLiveUpdate = (updates: { type: string; [key: string]: any }) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Modelos Cadastrados</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie todos os modelos de celulares do sistema
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline"
            className="bg-gradient-primary hover:bg-primary-hover text-primary-foreground"
            onClick={() => setBulkEditModalOpen(true)}
          >
            Editar em massa
          </Button>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => handleOpenDialog()}
                className="bg-gradient-primary hover:bg-primary-hover press-effect"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Modelo
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingModel ? 'Editar Modelo' : 'Novo Modelo'}
                </DialogTitle>
                <DialogDescription>
                  {editingModel 
                    ? 'Atualize as informações do modelo'
                    : 'Cadastre um novo modelo no sistema'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="name">Nome do Modelo</Label>
                  <Input
                    id="name"
                    placeholder="Ex: iPhone 15 Pro Max 256GB"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value, subcategory: "" }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Subcategoria</Label>
                  <Select 
                    value={formData.subcategory} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory: value }))}
                    disabled={!formData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubcategories.map(subcategory => (
                        <SelectItem key={subcategory.id} value={subcategory.name}>{subcategory.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: "novo" | "seminovo") => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="novo">Novo</SelectItem>
                      <SelectItem value="seminovo">Seminovo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                
                <div className="col-span-2 space-y-4">
                  <Label>Preços por Loja</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price-castanhal">Castanhal</Label>
                      <StandaloneCurrencyInput
                        value={reaisToCents(parseBRLToNumber(formData.prices.castanhal))}
                        onChange={(cents) => setFormData(prev => ({ 
                          ...prev, 
                          prices: { ...prev.prices, castanhal: formatCentsToBRL(cents) }
                        }))}
                        placeholder="R$ 0,00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price-belem">Belém</Label>
                      <StandaloneCurrencyInput
                        value={reaisToCents(parseBRLToNumber(formData.prices.belem))}
                        onChange={(cents) => setFormData(prev => ({ 
                          ...prev, 
                          prices: { ...prev.prices, belem: formatCentsToBRL(cents) }
                        }))}
                        placeholder="R$ 0,00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price-ananindeua">Ananindeua</Label>
                      <StandaloneCurrencyInput
                        value={reaisToCents(parseBRLToNumber(formData.prices.ananindeua))}
                        onChange={(cents) => setFormData(prev => ({ 
                          ...prev, 
                          prices: { ...prev.prices, ananindeua: formatCentsToBRL(cents) }
                        }))}
                        placeholder="R$ 0,00"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2 flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                  />
                  <Label htmlFor="active">Modelo ativo</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="bg-gradient-primary">
                  {editingModel ? 'Salvar' : 'Criar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Importante sobre modelos</p>
              <p className="text-sm text-muted-foreground">
                Configure os preços dos celulares para cada loja. Modelos <strong>novos</strong> são usados para vendas 
                e modelos <strong>seminovos</strong> podem ser configurados como aparelhos de entrada.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </CardTitle>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedSubcategory("all");
                setSelectedType("all");
                setSelectedStatus("all");
              }}
              className="text-sm"
            >
              Limpar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome, categoria..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Subcategoria</Label>
              <Select 
                value={selectedSubcategory} 
                onValueChange={setSelectedSubcategory}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {subcategories.map(subcategory => (
                    <SelectItem key={subcategory.id} value={subcategory.name}>{subcategory.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="seminovo">Seminovo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Models Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Modelos Cadastrados ({filteredModels.length})
            {isLoading && <span className="text-sm text-muted-foreground ml-2">(Carregando...)</span>}
            {error && <span className="text-sm text-destructive ml-2">(Erro ao carregar)</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table key={`models-${modelsList.length}-${filteredModels.length}`}>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Subcategoria</TableHead>
                  <TableHead>Tipo</TableHead>
{stores.filter(store => store.active).map(store => (
                    <TableHead key={store.id}>Preço {store.name}</TableHead>
                  ))}
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModels.map((model) => (
                  <TableRow key={model.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{model.name}</TableCell>
                    <TableCell>{model.category}</TableCell>
                    <TableCell>{model.subcategory}</TableCell>
                    <TableCell>
                      <Badge variant={model.type === 'novo' ? 'default' : 'secondary'}>
                        {model.type === 'novo' ? 'Novo' : 'Seminovo'}
                      </Badge>
                    </TableCell>
{stores.filter(store => store.active).map(store => (
                      <TableCell key={store.id}>
                        {model.prices[store.id as keyof typeof model.prices] 
                          ? formatCurrency(model.prices[store.id as keyof typeof model.prices]!) 
                          : '-'
                        }
                      </TableCell>
                    ))}
                    <TableCell>
                      <Badge variant={model.active ? 'default' : 'secondary'}>
                        {model.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleOpenDialog(model)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleModelActive(model.id)}
                        >
                          {model.active ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteModel(model.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredModels.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum modelo encontrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição em Massa */}
      <BulkEditModal
        open={bulkEditModalOpen}
        onOpenChange={setBulkEditModalOpen}
        type="models"
        selectedItems={selectedModels}
        allItems={modelsList}
        onApply={handleApplyBulkEdit}
        onLiveUpdate={handleLiveUpdate}
      />

      {/* Modal de Edição de Preços Personalizados */}
      <CustomPriceEditModal
        open={customPriceModalOpen}
        onOpenChange={setCustomPriceModalOpen}
        selectedModels={modelsList.filter(model => selectedModels.includes(model.id))}
        selectedStores={pendingCustomPriceStores}
        onSave={handleCustomPriceSave}
      />
    </div>
  );
}