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
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Plus, Info } from "lucide-react";
import { categories } from "@/data/mockData";
import { formatCentsToBRL, centsToReais, reaisToCents, parseBRLToNumber } from "@/lib/currency";
import { StandaloneCurrencyInput } from "@/lib/ControlledCurrencyInput";
import { BulkEditModal } from "./BulkEditModal";
import { CustomPriceEditModal } from "./CustomPriceEditModal";

// Components
import { ModelFilters } from "../models/ModelFilters";
import { ModelTable } from "../models/ModelTable";
import { useModelState } from "@/hooks/useModelState";

export function Modelos() {
  const {
    modelsList,
    isLoading,
    error,
    dialogOpen,
    setDialogOpen,
    editingModel,
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
    selectedModels,
    formData,
    filteredModels,
    availableSubcategories,
    handleOpenDialog,
    handleSave,
    toggleModelActive,
    deleteModel,
    clearFilters,
    handleFormChange,
    handleApplyBulkEdit,
    handleLiveUpdate,
    handleCustomPriceSave
  } = useModelState();









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
                    onChange={(e) => handleFormChange({ name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleFormChange({ category: value, subcategory: "" })}
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
                    onValueChange={(value) => handleFormChange({ subcategory: value })}
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
                    onValueChange={(value: "novo" | "seminovo") => handleFormChange({ type: value })}
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
                        onChange={(cents) => handleFormChange({
                          prices: { ...formData.prices, castanhal: formatCentsToBRL(cents) }
                        })}
                        placeholder="R$ 0,00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price-belem">Belém</Label>
                      <StandaloneCurrencyInput
                        value={reaisToCents(parseBRLToNumber(formData.prices.belem))}
                        onChange={(cents) => handleFormChange({
                          prices: { ...formData.prices, belem: formatCentsToBRL(cents) }
                        })}
                        placeholder="R$ 0,00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price-ananindeua">Ananindeua</Label>
                      <StandaloneCurrencyInput
                        value={reaisToCents(parseBRLToNumber(formData.prices.ananindeua))}
                        onChange={(cents) => handleFormChange({
                          prices: { ...formData.prices, ananindeua: formatCentsToBRL(cents) }
                        })}
                        placeholder="R$ 0,00"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2 flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => handleFormChange({ active: checked })}
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
      <ModelFilters
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        selectedType={selectedType}
        selectedStatus={selectedStatus}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onSubcategoryChange={setSelectedSubcategory}
        onTypeChange={setSelectedType}
        onStatusChange={setSelectedStatus}
        onClearFilters={clearFilters}
      />

      {/* Models Table */}
      <ModelTable
        filteredModels={filteredModels}
        isLoading={isLoading}
        error={error}
        onEditModel={handleOpenDialog}
        onToggleModelActive={toggleModelActive}
        onDeleteModel={deleteModel}
      />

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