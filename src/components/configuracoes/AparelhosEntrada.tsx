import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Info } from "lucide-react";
import { phoneModels, stores } from "@/data/mockData";

// Components
import { TradeInFilters } from "../trade-in/TradeInFilters";
import { TradeInTable } from "../trade-in/TradeInTable";
import { useTradeInDeviceState } from "@/hooks/useTradeInDeviceState";

// Modals
import { BulkEditModal } from "./BulkEditModal";
import { TradeInEditModal } from "./TradeInEditModal";
import { CustomTradeInEditModal } from "./CustomTradeInEditModal";

export function AparelhosEntrada() {
  const {
    devicesList,
    dialogOpen,
    setDialogOpen,
    editingDevice,
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
    customPriceModalOpen,
    setCustomPriceModalOpen,
    pendingCustomPriceStores,
    pendingCustomPriceModels,
    formData,
    seminovoModels,
    uniqueModels,
    allUniqueModels,
    handleOpenDialog,
    handleSave,
    deleteDevice,
    handleFormChange,
    clearFilters,
    handleTradeInEdit,
    handleTradeInSave,
    handleApplyBulkEdit,
    handleCustomTradeInSave
  } = useTradeInDeviceState();


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
                    onValueChange={(value) => handleFormChange({ modelId: value })}
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
                      onChange={(e) => handleFormChange({ minValue: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor Máximo</Label>
                    <Input
                      placeholder="R$ 0,00"
                      value={formData.maxValue}
                      onChange={(e) => handleFormChange({ maxValue: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Loja</Label>
                  <Select
                    value={formData.store}
                    onValueChange={(value) => handleFormChange({ store: value })}
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
                    onCheckedChange={(checked) => handleFormChange({ active: checked })}
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

      {/* Filtros */}
      <TradeInFilters
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        selectedStatus={selectedStatus}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onSubcategoryChange={setSelectedSubcategory}
        onStatusChange={setSelectedStatus}
        onClearFilters={clearFilters}
      />

      {/* Tabela de Aparelhos */}
      <TradeInTable
        uniqueModels={uniqueModels}
        onEditModel={handleTradeInEdit}
        onDeleteModel={deleteDevice}
      />

      {/* Bulk Edit Modal */}
      <BulkEditModal
        open={bulkEditOpen}
        onOpenChange={setBulkEditOpen}
        type="tradein"
        selectedItems={selectedTradeInDevices}
        allItems={allUniqueModels}
        onApply={handleApplyBulkEdit}
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