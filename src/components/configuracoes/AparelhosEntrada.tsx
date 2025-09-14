import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Edit, Search, RefreshCcw, Info, Trash2 } from "lucide-react";
import { 
  tradeInDevices, 
  phoneModels,
  stores,
  categories,
  subcategories,
  type TradeInDevice,
  formatCurrency,
  updateTradeInDeviceValues
} from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { BulkEditModal } from "./BulkEditModal";
import { TradeInEditModal } from "./TradeInEditModal";
import { CustomTradeInEditModal } from "./CustomTradeInEditModal";
import { parseBRLToNumber } from "@/lib/currency";

export function AparelhosEntrada() {
  console.log('🔍 AparelhosEntrada component loading...');
  console.log('📊 tradeInDevices data:', tradeInDevices);
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
  // const [selectedItems, setSelectedItems] = useState<TradeInDevice[]>([]); // Removed - selection now internal to modal
  const [selectedTradeInDevices, setSelectedTradeInDevices] = useState<string[]>([]);
  const [customPriceModalOpen, setCustomPriceModalOpen] = useState(false);
  const [pendingCustomPriceStores, setPendingCustomPriceStores] = useState<string[]>([]);
  const [pendingCustomPriceModels, setPendingCustomPriceModels] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
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
  const uniqueModels = filteredDevices.reduce((acc: any[], device) => {
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
  const allUniqueModels = devicesList.reduce((acc: any[], device) => {
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

  // Note: External selection logic removed - selection now happens inside the bulk edit modal

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
              store: formData.store as any,
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
        store: formData.store as any,
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

  // Function for live/real-time updates (simplified - selection is now internal to modal)
  const handleLiveUpdate = (updates: any) => {
    // Live updates are now handled internally by the modal
    // This function is kept for compatibility but doesn't need complex logic anymore
    console.log('Live update called:', updates);
  };

  // Function to apply bulk edits with React Query
  const handleApplyBulkEdit = (updates: { type: string; fields?: string[]; stores?: string[]; cardValues?: any; selectedItemIds?: string[]; }) => {
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
                if (updates.fields.includes(field) && updates.cardValues[field]) {
                  const currentValue = device[field as keyof typeof device] as number;
                  const adjustmentValue = parseFloat(updates.cardValues[field] || "0");
                  
                  if (!isNaN(adjustmentValue) && currentValue > 0) {
                    if (updates.type === "percentage") {
                      const newValue = currentValue * (1 + adjustmentValue / 100);
                      (updatedDevice as any)[field] = Math.max(0, newValue);
                    } else if (updates.type === "fixed") {
                      const newValue = currentValue + adjustmentValue;
                      (updatedDevice as any)[field] = Math.max(0, newValue);
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

  // Legacy function - no longer used since selection is now internal to modal
  const handleBulkEdit = (updates: any) => {
    // This function is kept for compatibility but functionality moved to handleApplyBulkEdit
    console.log('Legacy handleBulkEdit called:', updates);
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

  // Function to handle custom trade-in values save
  const handleCustomTradeInSave = async (changes: { modelId: string; storeId: string; field: 'minValue' | 'maxValue'; newValue: number }[]): Promise<boolean> => {
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


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Aparelhos de Entrada</h3>
          <p className="text-sm text-muted-foreground">
            Configure valores min/máx para aparelhos seminovos de entrada
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="bg-gradient-primary hover:bg-primary-hover text-primary-foreground"
            onClick={() => setBulkEditOpen(true)}
          >
            Editar em massa
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-block">
                  <Button 
                    disabled
                    className="bg-gradient-primary hover:bg-primary-hover press-effect opacity-50 cursor-not-allowed pointer-events-none"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Aparelho
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Aparelhos são adicionados automaticamente quando um modelo é cadastrado como "seminovo" em Modelos</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingDevice ? 'Editar Aparelho de Entrada' : 'Novo Aparelho de Entrada'}
                </DialogTitle>
                <DialogDescription>
                  {editingDevice 
                    ? 'Atualize as informações do aparelho'
                    : 'Configure um novo aparelho para entrada'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Modelo (Seminovo)</Label>
                  <Select 
                    value={formData.modelId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, modelId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um modelo seminovo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {phoneModels.filter(model => model.type === 'seminovo').map(model => (
                        <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Valor Mínimo</Label>
                    <Input
                      placeholder="R$ 0,00"
                      value={formData.minValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, minValue: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor Máximo</Label>
                    <Input
                      placeholder="R$ 0,00"
                      value={formData.maxValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxValue: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Loja</Label>
                  <Select 
                    value={formData.store} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, store: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.filter(store => store.active).map(store => (
                        <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                  />
                  <Label htmlFor="active">Aparelho ativo</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="bg-gradient-primary">
                  {editingDevice ? 'Salvar' : 'Criar'}
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
              <p className="text-sm font-medium">Importante sobre aparelhos de entrada</p>
              <p className="text-sm text-muted-foreground">
                Apenas modelos <strong>seminovos</strong> podem ser configurados como aparelhos de entrada. 
                O valor final do aparelho não pode exceder o valor máximo configurado.
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
              <RefreshCcw className="h-4 w-4" />
              Filtros
            </CardTitle>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedSubcategory("all");
                setSelectedStatus("all");
              }}
              className="text-sm"
            >
              Limpar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome do modelo..."
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
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Subcategoria</Label>
              <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Subcategorias</SelectItem>
                  {subcategories.filter(sub => 
                    selectedCategory === "all" || sub.categoryId === selectedCategory
                  ).map(subcategory => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
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

      {/* Devices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Aparelhos Configurados ({uniqueModels.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
{stores.filter(store => store.active).map(store => (
                    <>
                      <TableHead key={`min-${store.id}`}>Min {store.name}</TableHead>
                      <TableHead key={`max-${store.id}`}>Máx {store.name}</TableHead>
                    </>
                  ))}
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uniqueModels.map((item) => (
                    <TableRow 
                      key={item.id} 
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        {item.name}
                      </TableCell>
{stores.filter(store => store.active).map(store => (
                      <>
                        <TableCell key={`min-${store.id}`}>
                          {item[store.id] ? formatCurrency(item[store.id].minValue) : '-'}
                        </TableCell>
                        <TableCell key={`max-${store.id}`}>
                          {item[store.id] ? formatCurrency(item[store.id].maxValue) : '-'}
                        </TableCell>
                      </>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleTradeInEdit(item.modelId, item.name)}
                          title="Editar preços por loja"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteDevice(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
            </Table>
            
            {uniqueModels.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum aparelho encontrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Edit Modal */}
          <BulkEditModal 
            open={bulkEditOpen}
            onOpenChange={setBulkEditOpen}
            type="tradein"
            selectedItems={selectedTradeInDevices}
            allItems={allUniqueModels}
            onApply={handleApplyBulkEdit}
            onLiveUpdate={handleLiveUpdate}
          />

      {/* Trade-In Edit Modal */}
      <TradeInEditModal
        open={tradeInEditOpen}
        onOpenChange={setTradeInEditOpen}
        modelId={selectedTradeInModel?.modelId || ""}
        modelName={selectedTradeInModel?.modelName || ""}
        devices={devicesList}
        onSave={handleTradeInSave}
      />

      {/* Custom Trade-In Edit Modal */}
      <CustomTradeInEditModal
        open={customPriceModalOpen}
        onOpenChange={setCustomPriceModalOpen}
        selectedModels={pendingCustomPriceModels}
        selectedStores={pendingCustomPriceStores}
        onSave={handleCustomTradeInSave}
      />
    </div>
  );
}