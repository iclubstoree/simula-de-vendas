import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { stores, type PhoneModel, type TradeInDevice, type DamageType } from "@/data/mockData";

// Bulk edit components
import { ItemSelectionCard } from "../bulk-edit/ItemSelectionCard";
import { SelectedItemsSummaryCard } from "../bulk-edit/SelectedItemsSummaryCard";
import { StoreSelectionCard } from "../bulk-edit/StoreSelectionCard";
import { UpdateTypeSelector } from "../bulk-edit/UpdateTypeSelector";
import { FieldsConfiguration } from "../bulk-edit/FieldsConfiguration";
import { useBulkEditState } from "@/hooks/useBulkEditState";

type BulkEditItem = PhoneModel | TradeInDevice | DamageType;
type BulkUpdateResult = Record<string, unknown>;

interface BulkEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "models" | "tradein" | "damages";
  selectedItems: BulkEditItem[]; // Pre-selected items (for backward compatibility)
  allItems?: BulkEditItem[]; // All available items for internal selection
  onApply: (updates: BulkUpdateResult) => void;
  onLiveUpdate?: (updates: BulkUpdateResult) => void; // For real-time updates
}

export function BulkEditModal({ open, onOpenChange, type, selectedItems, allItems, onApply, onLiveUpdate }: BulkEditModalProps) {
  const { toast } = useToast();

  const {
    updateType,
    setUpdateType,
    fieldsToUpdate,
    internalSelectedItems,
    selectedStores,
    cardValues,
    availableItems,
    effectiveSelectedItems,
    getFieldsForType,
    getFieldDisplayName,
    handleFieldToggle,
    handleSelectAllInternal,
    handleSelectItemInternal,
    handleSelectAllStores,
    handleSelectStore,
    handleFieldValueChange
  } = useBulkEditState({
    type,
    allItems: allItems || [],
    selectedItems,
    stores,
    open
  });


  const handleApply = () => {
    console.log('🚀 handleApply called:', {
      effectiveSelectedItemsCount: effectiveSelectedItems.length,
      updateType,
      type,
      availableItemsCount: availableItems.length,
      effectiveSelectedItems: effectiveSelectedItems.map(item => ({ id: item.id, name: item.name }))
    });
    
    if (effectiveSelectedItems.length === 0) {
      console.log('❌ No items selected, showing error toast');
      toast({
        title: "Erro",
        description: "Nenhum item selecionado para edição",
        variant: "destructive"
      });
      return;
    }

    // For custom_price, skip validations and go directly to custom modal
    if (updateType === "custom_price") {
      // For store-based types, validate store selection
      if ((type === "models" || type === "tradein") && selectedStores.length === 0) {
        toast({
          title: "Erro",
          description: "Selecione ao menos uma loja para aplicar as alterações",
          variant: "destructive"
        });
        return;
      }
      
      const updates = {
        type: updateType,
        stores: selectedStores,
        itemCount: effectiveSelectedItems.length,
        selectedItemIds: effectiveSelectedItems.map(item => item.id)
      };

      onApply(updates);
      return;
    }

    // For percentage and fixed types, validate fields
    if (fieldsToUpdate.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione ao menos um campo para atualizar",
        variant: "destructive"
      });
      return;
    }

    // For store-based types, validate store selection
    if ((type === "models" || type === "tradein") && selectedStores.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione ao menos uma loja para aplicar as alterações",
        variant: "destructive"
      });
      return;
    }

    // Get adjustment value from cardValues
    const currentCardValues = cardValues[updateType] || {};
    const hasValidValues = fieldsToUpdate.some(field => currentCardValues[field] && currentCardValues[field].trim() !== '');
    
    if ((updateType === "percentage" || updateType === "fixed") && !hasValidValues) {
      toast({
        title: "Erro",
        description: "Digite um valor para os campos selecionados",
        variant: "destructive"
      });
      return;
    }
    
    const updates = {
      type: updateType,
      cardValues: currentCardValues,
      stores: selectedStores,
      fields: fieldsToUpdate,
      itemCount: effectiveSelectedItems.length,
      selectedItemIds: effectiveSelectedItems.map(item => item.id)
    };

    onApply(updates);
    onOpenChange(false);

    setTimeout(() => {
      toast({
        title: "Alterações aplicadas",
        description: `${effectiveSelectedItems.length} itens atualizados com sucesso`
      });
    }, 100);
  };

  const getTypeTitle = () => {
    switch (type) {
      case "models": return "Modelos";
      case "tradein": return "Aparelhos de Entrada";
      case "damages": return "Avarias";
      default: return "Itens";
    }
  };


  const handleFieldValueChangeWithLiveUpdate = (fieldId: string, value: string, fieldType: string) => {
    handleFieldValueChange(fieldId, value, fieldType);

    // Real-time update if callback is provided and field is selected for update
    if (onLiveUpdate && fieldsToUpdate.includes(fieldId)) {
      const newValues = {
        ...cardValues[updateType],
        [fieldId]: value
      };

      onLiveUpdate({
        type: updateType,
        cardValues: newValues,
        stores: selectedStores,
        fields: fieldsToUpdate,
        itemIds: effectiveSelectedItems.map(item => item.id)
      });
    }
  };


  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Editar em Massa - {getTypeTitle()}
            </DialogTitle>
            <DialogDescription>
              Edite múltiplos {getTypeTitle().toLowerCase()} simultaneamente. {effectiveSelectedItems.length} item(s) selecionado(s).
              {effectiveSelectedItems.length === 0 && (
                <span className="text-destructive block mt-1">
                  ⚠️ Nenhum item selecionado. Use o card de seleção abaixo para escolher os itens.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Item Selection */}
            <ItemSelectionCard
              title={getTypeTitle()}
              availableItems={availableItems}
              selectedItems={effectiveSelectedItems}
              onSelectAll={handleSelectAllInternal}
              onSelectItem={handleSelectItemInternal}
            />

            {/* Selected Items Summary */}
            <SelectedItemsSummaryCard selectedItems={effectiveSelectedItems} />

            {/* Store Selection for all update types */}
            {(type === "models" || type === "tradein") && (
              <StoreSelectionCard
                stores={stores}
                selectedStores={selectedStores}
                onSelectAllStores={handleSelectAllStores}
                onSelectStore={handleSelectStore}
              />
            )}

            {/* Update Type Selection */}
            <UpdateTypeSelector
              updateType={updateType}
              onUpdateTypeChange={setUpdateType}
              showCustomPrice={type === "models" || type === "tradein" || type === "damages"}
            />

            {/* Fields and Values Configuration */}
            <FieldsConfiguration
              updateType={updateType}
              fields={getFieldsForType()}
              fieldsToUpdate={fieldsToUpdate}
              cardValues={cardValues[updateType] || {}}
              selectedItemsCount={effectiveSelectedItems.length}
              selectedStoresCount={selectedStores.length}
              totalStoresCount={stores.length}
              onFieldToggle={handleFieldToggle}
              onFieldValueChange={handleFieldValueChangeWithLiveUpdate}
              getFieldDisplayName={getFieldDisplayName}
            />

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleApply}
                className="bg-success hover:bg-success/90"
                disabled={(updateType !== "custom_price" && fieldsToUpdate.length === 0) || effectiveSelectedItems.length === 0}
              >
                Aplicar Edição ({effectiveSelectedItems.length} itens)
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </>
  );
}