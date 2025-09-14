import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit3, Copy, Save, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCentsToBRL, centsToReais, reaisToCents, parseBRLToNumber } from "@/lib/currency";
import { StandaloneCurrencyInput } from "@/lib/ControlledCurrencyInput";
import { stores } from "@/data/mockData";

interface CustomTradeInEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModels: any[]; // Trade-in models to edit
  selectedStores: string[]; // Store IDs to show columns for
  onSave: (changes: { modelId: string; storeId: string; field: 'minValue' | 'maxValue'; newValue: number }[]) => Promise<boolean>;
}

interface EditValue {
  modelId: string;
  storeId: string;
  field: 'minValue' | 'maxValue';
  value: number; // In cents
}

export function CustomTradeInEditModal({ 
  open, 
  onOpenChange, 
  selectedModels, 
  selectedStores,
  onSave 
}: CustomTradeInEditModalProps) {
  const [editValues, setEditValues] = useState<EditValue[]>([]);
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Filter stores to show only selected ones
  const visibleStores = stores.filter(store => selectedStores.includes(store.id));

  // Debug log for received props
  useEffect(() => {
    console.log('🏪 CustomTradeInEditModal props:', {
      open,
      selectedModelsCount: selectedModels.length,
      selectedStoresCount: selectedStores.length,
      selectedModels: selectedModels.map(m => ({ id: m.id, modelId: m.modelId, name: m.name })),
      selectedStores
    });
  }, [open, selectedModels, selectedStores]);

  // Initialize edit values when modal opens
  useEffect(() => {
    if (open && selectedModels.length > 0) {
      const initialValues: EditValue[] = [];
      
      selectedModels.forEach(model => {
        selectedStores.forEach(storeId => {
          // Try to find existing values from the model's store data
          const storeData = model[storeId];
          
          initialValues.push({
            modelId: model.modelId,
            storeId,
            field: 'minValue',
            value: reaisToCents(storeData?.minValue || 0)
          });
          
          initialValues.push({
            modelId: model.modelId,
            storeId,
            field: 'maxValue',
            value: reaisToCents(storeData?.maxValue || 0)
          });
        });
      });
      
      setEditValues(initialValues);
      setIsEditing({});
    }
  }, [open, selectedModels, selectedStores]);

  // Get current value for a specific cell
  const getValue = useCallback((modelId: string, storeId: string, field: 'minValue' | 'maxValue'): number => {
    const editValue = editValues.find(ev => 
      ev.modelId === modelId && ev.storeId === storeId && ev.field === field
    );
    return editValue?.value || 0;
  }, [editValues]);

  // Update a specific cell value
  const updateValue = useCallback((modelId: string, storeId: string, field: 'minValue' | 'maxValue', newValue: number) => {
    setEditValues(prev => prev.map(ev => 
      ev.modelId === modelId && ev.storeId === storeId && ev.field === field
        ? { ...ev, value: newValue }
        : ev
    ));
  }, []);


  // Save changes
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Collect all changes
      const changes: { modelId: string; storeId: string; field: 'minValue' | 'maxValue'; newValue: number }[] = [];
      
      editValues.forEach(editValue => {
        changes.push({
          modelId: editValue.modelId,
          storeId: editValue.storeId,
          field: editValue.field,
          newValue: centsToReais(editValue.value)
        });
      });
      
      const success = await onSave(changes);
      
      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error saving custom trade-in values:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as alterações",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Get the store name
  const getStoreName = (storeId: string) => {
    return stores.find(s => s.id === storeId)?.name || storeId;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Valores Personalizados - Aparelhos de Entrada
          </DialogTitle>
          <DialogDescription>
            Edite os valores mínimos e máximos de cada modelo por loja. {selectedModels.length} modelo(s) selecionado(s).
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Main editing table */}
          <Card className="flex-1 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Tabela de Edição</CardTitle>
              <CardDescription className="text-xs">
                Clique nos valores para editá-los diretamente na tabela
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-full overflow-auto">
              <div className="border rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background border-r min-w-[200px]">Modelo</TableHead>
                      {visibleStores.map(store => (
                        <TableHead key={`min-${store.id}`} colSpan={2} className="text-center border-r">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold">{store.name}</span>
                            <div className="flex gap-4 text-xs mt-1">
                              <span>Mín.</span>
                              <span>Máx.</span>
                            </div>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedModels.map((model) => (
                      <TableRow key={model.modelId} className="hover:bg-muted/50">
                        <TableCell className="sticky left-0 bg-background border-r font-medium min-w-[200px]">
                          <div className="flex flex-col">
                            <span className="font-medium">{model.name}</span>
                            <Badge variant="secondary" className="text-xs w-fit mt-1">
                              Seminovo
                            </Badge>
                          </div>
                        </TableCell>
                        
                        {visibleStores.map(store => (
                          <>
                            {/* Min Value */}
                            <TableCell key={`min-${model.modelId}-${store.id}`} className="p-2 border-r-0">
                              <StandaloneCurrencyInput
                                value={getValue(model.modelId, store.id, 'minValue')}
                                onChange={(newValue) => updateValue(model.modelId, store.id, 'minValue', newValue)}
                                placeholder="R$ 0,00"
                                className="w-full text-sm"
                              />
                            </TableCell>
                            
                            {/* Max Value */}
                            <TableCell key={`max-${model.modelId}-${store.id}`} className="p-2 border-r">
                              <StandaloneCurrencyInput
                                value={getValue(model.modelId, store.id, 'maxValue')}
                                onChange={(newValue) => updateValue(model.modelId, store.id, 'maxValue', newValue)}
                                placeholder="R$ 0,00"
                                className="w-full text-sm"
                              />
                            </TableCell>
                          </>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {selectedModels.length === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum modelo selecionado para edição</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer with actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedModels.length} modelo(s) × {visibleStores.length} loja(s) = {selectedModels.length * visibleStores.length * 2} campos editáveis
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-gradient-primary hover:bg-primary-hover"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Aplicar Alterações'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}