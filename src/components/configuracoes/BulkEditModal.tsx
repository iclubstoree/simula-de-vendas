import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit3, Eye, Package, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { stores, formatCurrency, categories } from "@/data/mockData";

interface BulkEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "models" | "tradein" | "damages";
  selectedItems: any[]; // Pre-selected items (for backward compatibility)
  allItems?: any[]; // All available items for internal selection
  onApply: (updates: any) => void;
  onLiveUpdate?: (updates: any) => void; // For real-time updates
}

export function BulkEditModal({ open, onOpenChange, type, selectedItems, allItems, onApply, onLiveUpdate }: BulkEditModalProps) {
  const [updateType, setUpdateType] = useState<"percentage" | "fixed" | "custom_price">("percentage");
  const [targetStore, setTargetStore] = useState<string>("all");
  const [fieldsToUpdate, setFieldsToUpdate] = useState<string[]>([]);
  
  // Internal item selection
  const [internalSelectedItems, setInternalSelectedItems] = useState<any[]>([]);
  
  // Store selection for models/tradein types
  const [selectedStores, setSelectedStores] = useState<string[]>(() => {
    return (type === "models" || type === "tradein") ? stores.filter(store => store.active).map(s => s.id) : [];
  });
  
  // Values for each card type and field
  const [cardValues, setCardValues] = useState<Record<string, Record<string, string>>>({
    percentage: {},
    fixed: {}
  });
  
  const { toast } = useToast();

  // Always use internal selection
  const effectiveSelectedItems = internalSelectedItems;
  const availableItems = allItems || [];
  
  // Debug log for availableItems
  useEffect(() => {
    console.log('📋 Available items updated:', {
      type,
      availableItemsCount: availableItems.length,
      allItemsCount: allItems?.length || 0,
      sampleItems: availableItems.slice(0, 3).map(item => ({ id: item?.id, name: item?.name }))
    });
  }, [availableItems, type, allItems]);

  // Reset updateType if not supported by current type
  useEffect(() => {
    if (type !== "models" && type !== "tradein" && type !== "damages" && updateType === "custom_price") {
      setUpdateType("percentage");
    }
  }, [type, updateType]);

  // Initialize internal selection when modal opens
  useEffect(() => {
    if (open) {
      if (selectedItems.length > 0 && allItems) {
        // Set internal selection based on passed selectedItems (string IDs)
        const matchedItems = allItems.filter(item => selectedItems.includes(item.id));
        setInternalSelectedItems(matchedItems);
      } else {
        // Clear internal selection when modal opens fresh
        setInternalSelectedItems([]);
      }
    }
  }, [open, selectedItems, allItems]);

  // Auto-populate values when modal opens with current values from selected items
  useEffect(() => {
    if (open && effectiveSelectedItems.length > 0) {
      // Auto-populate with current values from first selected item (as baseline)
      const firstItem = effectiveSelectedItems[0];
      
      if (type === "models") {
        // Initialize cardValues for percentage/fixed mode
        const newCardValues = {
          percentage: { price: "" },
          fixed: { price: "" }
        };
        setCardValues(newCardValues);
      } else if (type === "tradein") {
        // Initialize cardValues for percentage/fixed mode
        const newCardValues = {
          percentage: { 
            minValue: "",
            maxValue: ""
          },
          fixed: { 
            minValue: "",
            maxValue: ""
          }
        };
        setCardValues(newCardValues);
      }
    }
  }, [open, effectiveSelectedItems, type, selectedStores]);

  const getFieldsForType = () => {
    switch (type) {
      case "models":
        return [
          { id: "price", label: "Preço", type: "currency" }
        ];
      case "tradein":
        return [
          { id: "minValue", label: "Valor Mínimo", type: "currency" },
          { id: "maxValue", label: "Valor Máximo", type: "currency" }
        ];
      case "damages":
        return [{ id: "discount", label: "Desconto", type: "currency" }];
      default:
        return [];
    }
  };

  const getFieldDisplayName = (fieldId: string) => {
    const fieldMap: Record<string, string> = {
      price: "Preço",
      category: "Categoria", 
      subcategory: "Subcategoria",
      minValue: "Valor Mínimo",
      maxValue: "Valor Máximo",
      discount: "Desconto",
      name: "Nome"
    };
    return fieldMap[fieldId] || fieldId;
  };

  const handleFieldToggle = (fieldId: string, checked: boolean) => {
    if (checked) {
      setFieldsToUpdate(prev => [...prev, fieldId]);
    } else {
      setFieldsToUpdate(prev => prev.filter(id => id !== fieldId));
    }
  };

  // Internal selection handlers
  const handleSelectAllInternal = (checked: boolean) => {
    console.log('🔄 handleSelectAllInternal called:', { checked, availableItemsCount: availableItems.length });
    if (checked) {
      setInternalSelectedItems(availableItems);
      console.log('✅ Selected all items:', availableItems.length);
    } else {
      setInternalSelectedItems([]);
      console.log('❌ Cleared all selections');
    }
  };

  const handleSelectItemInternal = (item: any, checked: boolean) => {
    if (checked) {
      setInternalSelectedItems(prev => [...prev, item]);
    } else {
      setInternalSelectedItems(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const isAllInternalSelected = internalSelectedItems.length === availableItems.length && availableItems.length > 0;

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
    
    // Show success toast after modal closes
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


  const handleFieldValueChange = (fieldId: string, value: string, fieldType: string) => {
    let processedValue = value;
    
    // Auto-format currency fields when user types raw numbers like "500"
    if (fieldType === 'currency' && updateType === 'fixed' && /^\d+$/.test(value)) {
      processedValue = value;
    }
    
    const newValues = {
      ...cardValues[updateType], 
      [fieldId]: processedValue 
    };
    
    setCardValues(prev => ({
      ...prev,
      [updateType]: newValues
    }));
    
    // Real-time update if callback is provided and field is selected for update
    if (onLiveUpdate && fieldsToUpdate.includes(fieldId)) {
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
            {/* Model Selection Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Selecionar {getTypeTitle()}
                </CardTitle>
                <CardDescription className="text-xs">
                  Escolha quais itens deseja editar em massa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all-internal"
                      checked={isAllInternalSelected}
                      onCheckedChange={handleSelectAllInternal}
                      aria-label="Selecionar todos os itens"
                    />
                    <Label htmlFor="select-all-internal" className="text-sm font-medium">
                      Selecionar todos ({availableItems.length})
                    </Label>
                  </div>
                  
                  <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-1">
                    {availableItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`item-${item.id}`}
                          checked={internalSelectedItems.some(selected => selected.id === item.id)}
                          onCheckedChange={(checked) => handleSelectItemInternal(item, !!checked)}
                        />
                        <Label htmlFor={`item-${item.id}`} className="text-sm">
                          {item.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {internalSelectedItems.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {internalSelectedItems.length} de {availableItems.length} itens selecionados
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Selected Items Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Itens Selecionados ({effectiveSelectedItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                  {effectiveSelectedItems.slice(0, 10).map((item, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {item.name || item.id}
                    </Badge>
                  ))}
                  {effectiveSelectedItems.length > 10 && (
                    <Badge variant="secondary" className="text-xs">
                      +{effectiveSelectedItems.length - 10} mais
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Store Selection for all update types */}
            {(type === "models" || type === "tradein") && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Lojas ({selectedStores.length}/{stores.length})
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Selecione as lojas onde deseja aplicar as alterações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="select-all-stores"
                        checked={selectedStores.length === stores.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedStores(stores.filter(store => store.active).map(store => store.id));
                          } else {
                            setSelectedStores([]);
                          }
                        }}
                      />
                      <Label htmlFor="select-all-stores" className="text-sm font-medium">
                        Selecionar todas ({stores.length})
                      </Label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {stores.filter(store => store.active).map(store => (
                        <div key={store.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`store-${store.id}`}
                            checked={selectedStores.includes(store.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedStores(prev => [...prev, store.id]);
                              } else {
                                setSelectedStores(prev => prev.filter(id => id !== store.id));
                              }
                            }}
                          />
                          <Label htmlFor={`store-${store.id}`} className="text-sm">
                            {store.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Update Type Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Tipo de Atualização</Label>
              <div className={`grid gap-4 ${type === "models" || type === "tradein" || type === "damages" ? "grid-cols-3" : "grid-cols-2"}`}>
                <Card className={`cursor-pointer transition-all duration-200 hover:shadow-md ${updateType === "percentage" ? "ring-2 ring-green-500 bg-green-50 border-green-200" : "hover:border-primary/50"}`} 
                      onClick={() => setUpdateType("percentage")}>
                  <CardContent className="py-8 px-6 text-center">
                    <div className="text-4xl font-bold text-green-600 mb-3">%</div>
                    <div className="text-sm font-medium text-gray-700">Percentual</div>
                  </CardContent>
                </Card>
                <Card className={`cursor-pointer transition-all duration-200 hover:shadow-md ${updateType === "fixed" ? "ring-2 ring-green-500 bg-green-50 border-green-200" : "hover:border-primary/50"}`}
                      onClick={() => setUpdateType("fixed")}>
                  <CardContent className="py-8 px-6 text-center">
                    <div className="text-4xl font-bold text-gray-700 mb-3">R$</div>
                    <div className="text-sm font-medium text-gray-700">Valor Fixo</div>
                  </CardContent>
                </Card>
                {(type === "models" || type === "tradein" || type === "damages") && (
                  <Card className={`cursor-pointer transition-all duration-200 hover:shadow-md ${updateType === "custom_price" ? "ring-2 ring-green-500 bg-green-50 border-green-200" : "hover:border-primary/50"}`}
                        onClick={() => setUpdateType("custom_price")}>
                    <CardContent className="py-8 px-6 text-center">
                      <Edit className="h-8 w-8 mx-auto text-gray-600 mb-3" />
                      <div className="text-sm font-medium text-gray-700">Valores<br/>Personalizados</div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Fields and Values Configuration */}
            {updateType === "custom_price" ? (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <h3 className="font-medium text-green-900">Edição Personalizada</h3>
                    <p className="text-sm text-green-700">
                      Clique em "Aplicar Edição" para abrir a tabela de edição personalizada
                    </p>
                    <p className="text-xs text-green-600">
                      Você poderá editar preços individualmente por modelo e loja
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Fields Selection */}
                <div className="space-y-3">
                  <Label>Campos para Atualizar</Label>
                  <div className="space-y-3">
                    {getFieldsForType().map((field) => (
                      <div key={field.id} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={field.id}
                            checked={fieldsToUpdate.includes(field.id)}
                            onCheckedChange={(checked) => handleFieldToggle(field.id, checked as boolean)}
                          />
                          <Label htmlFor={field.id} className="text-sm font-medium">
                            {field.label}
                          </Label>
                        </div>
                        
                        {/* Show input when field is selected and we're in percentage or fixed mode */}
                        {fieldsToUpdate.includes(field.id) && (updateType === "percentage" || updateType === "fixed") && (
                          <div className="ml-6 space-y-1">
                            <Input
                              type="number"
                              step={updateType === "percentage" ? "0.1" : "0.01"}
                              placeholder={updateType === "percentage" ? "10" : "500"}
                              value={cardValues[updateType]?.[field.id] || ""}
                              onChange={(e) => handleFieldValueChange(field.id, e.target.value, field.type)}
                              className="w-32"
                            />
                             <p className="text-xs text-muted-foreground">
                               {updateType === "percentage" 
                                 ? "Ex: 10 (para +10%) - Use valores positivos para aumentar e negativos para diminuir"
                                 : "Use valores positivos para somar e negativos para subtrair"
                               }
                             </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                {fieldsToUpdate.length > 0 && (
                  <Card className="bg-muted/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Resumo da Operação
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                      <p><span className="font-medium">Itens:</span> {effectiveSelectedItems.length}</p>
                      <p><span className="font-medium">Campos:</span> {fieldsToUpdate.map(field => getFieldDisplayName(field)).join(", ")}</p>
                      <p><span className="font-medium">Tipo:</span> {
                        updateType === "percentage" ? "Ajuste Percentual" :
                        updateType === "fixed" ? "Ajuste Valor Fixo" :
                        "Substituição de valores"
                      }</p>
                      {(type === "models" || type === "tradein") && (
                        <p><span className="font-medium">Lojas:</span> {
                          selectedStores.length === stores.length ? "Todas" : 
                          selectedStores.length === 0 ? "Nenhuma selecionada" :
                          `${selectedStores.length} selecionadas`
                        }</p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Actions - Always visible */}
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