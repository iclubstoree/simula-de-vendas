import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Info } from "lucide-react";
import { updateDamageTypeDiscount } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

// Components
import { DamageForm } from "../damages/DamageForm";
import { DamageFilters } from "../damages/DamageFilters";
import { DamageMatrix } from "../damages/DamageMatrix";
import { useDamageMatrixState } from "@/hooks/useDamageMatrixState";

// Modals
import { BulkEditModal } from "./BulkEditModal";
import { DamageEditModal } from "./DamageEditModal";
import { EditAllDamagesModal } from "./EditAllDamagesModal";
import { CustomDamageEditModal } from "./CustomDamageEditModal";

export function MatrizAvarias() {
  const {
    matrixData,
    damageTypesList,
    dialogOpen,
    setDialogOpen,
    selectedCategory,
    setSelectedCategory,
    selectedDamageFilter,
    setSelectedDamageFilter,
    bulkEditOpen,
    setBulkEditOpen,
    damageEditOpen,
    setDamageEditOpen,
    selectedDamage,
    selectedItems,
    selectedDamageIds,
    setSelectedDamageIds,
    editAllModalOpen,
    setEditAllModalOpen,
    customDamageModalOpen,
    setCustomDamageModalOpen,
    pendingCustomDamageModels,
    setPendingCustomDamageModels,
    selectedSubcategory,
    newDamageForm,
    filteredSubcategories,
    filteredDamageTypes,
    getMatrixValue,
    updateMatrixValue,
    handleCellEdit,
    handleSelectAll,
    handleSelectItem,
    handleFormChange,
    handleAddDamageType,
    deleteDamageType,
    clearFilters,
    handleEditDamage,
    handleSaveDamage,
    handleEditAllForModel,
    getDamageValuesForSubcategory,
    handleSaveAllDamages
  } = useDamageMatrixState();

  const { toast } = useToast();


  const handleBulkEdit = (updates: { type: string; selectedItemIds?: string[]; value?: number; percentage?: number; operation?: string; data?: Record<string, unknown>; cardValues?: Record<string, string>; fields?: string[]; replaceValues?: Record<string, string>; itemCount?: number; [key: string]: unknown }) => {
    // Get selected damage types from internal modal selection
    const selectedItemIds = updates.selectedItemIds || selectedDamageIds;
    const selectedDamageObjects = damageTypesList.filter(damage => selectedItemIds.includes(damage.id));

    // Update our local selection state to match what was selected in the modal
    setSelectedDamageIds(selectedItemIds);

    // Handle custom price editing
    if (updates.type === "custom_price") {
      console.log('🎯 Custom damage price requested:', {
        selectedItemIds,
        selectedDamageObjects: selectedDamageObjects.map(d => ({ id: d.id, name: d.name }))
      });

      // Store the selected damages for the custom modal
      setPendingCustomDamageModels(selectedDamageObjects);
      // Close bulk edit modal
      setBulkEditOpen(false);
      // Open custom damage modal
      setCustomDamageModalOpen(true);
      return;
    }

    // Handle custom pricing updates
    if (updates.type === "custom_damage") {
      const { data } = updates;
      if (data && typeof data === 'object') {
        Object.entries(data).forEach(([subcategoryId, damages]) => {
          if (damages && typeof damages === 'object') {
            Object.entries(damages as Record<string, number>).forEach(([damageId, value]: [string, number]) => {
              updateMatrixValue(subcategoryId, damageId, value);

              // 🔥 CRITICAL: Update the original damage type data for persistence
              updateDamageTypeDiscount(damageId, value);
            });
          }
        });
      }

      // Show success toast
      setTimeout(() => {
        toast({
          title: "Descontos personalizados aplicados",
          description: `${updates.itemCount || 0} subcategorias atualizadas`
        });
      }, 100);
    }

    // Handle regular bulk edit logic for percentage and fixed values
    if (updates.type === "percentage" || updates.type === "fixed") {
      const { cardValues, fields } = updates;

      if (cardValues && fields) {
        selectedDamageObjects.forEach(damage => {
          fields.forEach((field: string) => {
            const value = parseFloat(cardValues[field]) || 0;

            if (field === "discount") {
              // Apply to all subcategories for this damage
              filteredSubcategories.forEach(sub => {
                const currentValue = getMatrixValue(sub.id, damage.id);
                let newValue = 0;

                if (updates.type === "percentage") {
                  newValue = Math.max(0, currentValue * (1 + value / 100));
                } else {
                  newValue = Math.max(0, currentValue + value);
                }

                updateMatrixValue(sub.id, damage.id, newValue);
              });
            }

            if (field === "name") {
              // For now, show message that this is in development
              toast({
                title: "Funcionalidade em desenvolvimento",
                description: "Edição de nomes de avarias será implementada em breve",
                variant: "default"
              });
            }
          });
        });
      }

      // Show success toast
      setTimeout(() => {
        toast({
          title: "Alterações aplicadas",
          description: `${updates.itemCount || 0} avarias atualizadas com ${updates.type === 'percentage' ? 'ajuste percentual' : 'valor fixo'}`
        });
      }, 100);
    }

    // Handle replace mode
    if (updates.type === "replace") {
      const { replaceValues } = updates;

      if (replaceValues) {
        selectedItems.forEach(damage => {
          if (replaceValues.name) {
            // For now, show message that this is in development
            toast({
              title: "Funcionalidade em desenvolvimento",
              description: "Edição de nomes de avarias será implementada em breve",
              variant: "default"
            });
          }

          if (replaceValues.discount) {
            const newDiscount = parseFloat(replaceValues.discount) || 0;
            filteredSubcategories.forEach(sub => {
              updateMatrixValue(sub.id, damage.id, newDiscount);
            });
          }
        });
      }

      // Toast will be shown after modal closes
      setTimeout(() => {
        toast({
          title: "Alterações aplicadas",
          description: `${updates.itemCount || 0} avarias atualizadas com novos valores`
        });
      }, 100);
    }
  };


  const handleCustomDamageSave = async (changes: { damageId: string; subcategoryId: string; newValue: number }[]): Promise<boolean> => {
    try {
      console.log('💾 MatrizAvarias: Received custom damage values to save:', {
        changesCount: changes.length,
        sampleChanges: changes.slice(0, 3),
        currentMatrixSize: matrixData.length
      });

      // Apply all changes to the matrix
      changes.forEach(change => {
        console.log(`  Updating matrix: ${change.subcategoryId} x ${change.damageId} = R$ ${change.newValue}`);
        updateMatrixValue(change.subcategoryId, change.damageId, change.newValue);
      });

      console.log('✅ MatrizAvarias: All changes applied successfully');

      toast({
        title: "Valores personalizados aplicados",
        description: `${changes.length} valores atualizados com sucesso`
      });

      return true;
    } catch (error) {
      console.error('❌ MatrizAvarias: Error saving custom damage values:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os valores personalizados",
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
          <h3 className="text-lg font-semibold">Matriz de Avarias</h3>
          <p className="text-sm text-muted-foreground">
            Configure os descontos por avarias em cada subcategoria
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
          <Button
            className="bg-gradient-primary hover:bg-primary-hover"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Avaria
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Importante sobre matriz de avarias</p>
              <p className="text-sm text-muted-foreground">
                Configure os descontos aplicados para cada tipo de avaria em diferentes subcategorias. 
                Os valores são utilizados no simulador para calcular descontos em aparelhos de entrada.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <DamageFilters
        selectedCategory={selectedCategory}
        selectedDamageFilter={selectedDamageFilter}
        damageTypes={damageTypesList}
        onCategoryChange={setSelectedCategory}
        onDamageFilterChange={setSelectedDamageFilter}
        onClearFilters={clearFilters}
      />

      {/* Matriz de Avarias */}
      <DamageMatrix
        subcategories={filteredSubcategories}
        damageTypes={filteredDamageTypes}
        selectedItems={selectedItems}
        getMatrixValue={getMatrixValue}
        onCellEdit={handleCellEdit}
        onEditDamage={handleEditDamage}
        onDeleteDamage={deleteDamageType}
        onEditAllForModel={handleEditAllForModel}
      />

      {/* Formulário de Nova Avaria */}
      <DamageForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        formData={newDamageForm}
        onFormChange={handleFormChange}
        onSave={handleAddDamageType}
      />

      {/* Bulk Edit Modal */}
      <BulkEditModal 
        open={bulkEditOpen}
        onOpenChange={setBulkEditOpen}
        type="damages"
        selectedItems={selectedDamageIds}
        allItems={damageTypesList}
        onApply={handleBulkEdit}
      />

      {/* Damage Edit Modal */}
      <DamageEditModal
        open={damageEditOpen}
        onOpenChange={setDamageEditOpen}
        damage={selectedDamage}
        onSave={handleSaveDamage}
        onDelete={deleteDamageType}
      />

      {/* Edit All Damages Modal */}
      <EditAllDamagesModal
        open={editAllModalOpen}
        onOpenChange={setEditAllModalOpen}
        subcategoryName={selectedSubcategory?.name || ""}
        damageValues={selectedSubcategory ? getDamageValuesForSubcategory(selectedSubcategory.id) : []}
        onSave={handleSaveAllDamages}
      />

      {/* Custom Damage Edit Modal */}
      <CustomDamageEditModal
        open={customDamageModalOpen}
        onOpenChange={setCustomDamageModalOpen}
        selectedDamages={pendingCustomDamageModels}
        onSave={handleCustomDamageSave}
        getMatrixValue={getMatrixValue}
      />
    </div>
  );
}