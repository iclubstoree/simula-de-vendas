import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { stores, formatCurrency, type TradeInDevice } from "@/data/mockData";
import { formatCentsToBRL, centsToReais, reaisToCents, parseBRLToNumber } from "@/lib/currency";
import { StandaloneCurrencyInput } from "@/lib/ControlledCurrencyInput";

interface TradeInEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelId: string;
  modelName: string;
  devices: TradeInDevice[];
  onSave: (devices: TradeInDevice[]) => void;
}

export function TradeInEditModal({ 
  open, 
  onOpenChange, 
  modelId, 
  modelName, 
  devices, 
  onSave 
}: TradeInEditModalProps) {
  const [editingDevices, setEditingDevices] = useState<Record<string, { minValue: string, maxValue: string }>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      // Initialize editing state with current values
      const initialState: Record<string, { minValue: string, maxValue: string }> = {};
      stores.forEach(store => {
        const device = devices.find(d => d.store === store.id && d.modelId === modelId);
        initialState[store.id] = {
          minValue: device ? formatCentsToBRL(reaisToCents(device.minValue)) : "",
          maxValue: device ? formatCentsToBRL(reaisToCents(device.maxValue)) : ""
        };
      });
      setEditingDevices(initialState);
    }
  }, [open, devices, modelId]);


  const handleValueChange = (storeId: string, field: 'minValue' | 'maxValue', value: string) => {
    setEditingDevices(prev => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    const updatedDevices: TradeInDevice[] = [];
    
    stores.forEach(store => {
      const values = editingDevices[store.id];
      if (values?.minValue && values?.maxValue) {
        const minValue = parseBRLToNumber(values.minValue);
        const maxValue = parseBRLToNumber(values.maxValue);
        
        if (isNaN(minValue) || isNaN(maxValue) || minValue <= 0 || maxValue <= 0) {
          toast({
            title: "Erro",
            description: `Valores inválidos para ${store.name}`,
            variant: "destructive"
          });
          return;
        }
        
        if (minValue >= maxValue) {
          toast({
            title: "Erro",
            description: `Valor mínimo deve ser menor que máximo em ${store.name}`,
            variant: "destructive"
          });
          return;
        }

        // Find existing device or create new one
        const existingDevice = devices.find(d => d.store === store.id && d.modelId === modelId);
        const updatedDevice: TradeInDevice = existingDevice 
          ? { ...existingDevice, minValue, maxValue }
          : {
              id: `tradein-${modelId}-${store.id}-${Date.now()}`,
              modelId,
              name: modelName,
              minValue,
              maxValue,
              store: store.id as 'castanhal' | 'belem' | 'ananindeua',
              active: true
            };
        
        updatedDevices.push(updatedDevice);
      }
    });

    onSave(updatedDevices);
    onOpenChange(false);
    toast({
      title: "Sucesso",
      description: "Valores de entrada atualizados com sucesso"
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Preços por Loja
          </DialogTitle>
          <DialogDescription>
            Configure os valores mín/máx de entrada para "{modelName}" em cada loja
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <Badge variant="secondary" className="text-sm">
              {modelName}
            </Badge>
          </div>

          <div className="space-y-4">
            {stores.filter(store => store.active).map(store => {
              const currentDevice = devices.find(d => d.store === store.id && d.modelId === modelId);
              const editingValues = editingDevices[store.id] || { minValue: "", maxValue: "" };
              
              return (
                <Card key={store.id} className="border-l-4 border-l-primary/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      {store.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`min-${store.id}`}>Valor Mínimo</Label>
                        <StandaloneCurrencyInput
                          id={`min-${store.id}`}
                          value={reaisToCents(parseBRLToNumber(editingValues.minValue))}
                          onChange={(cents) => handleValueChange(store.id, 'minValue', formatCentsToBRL(cents))}
                          placeholder="R$ 0,00"
                        />
                        {currentDevice && (
                          <p className="text-xs text-muted-foreground">
                            Atual: {formatCurrency(currentDevice.minValue)}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`max-${store.id}`}>Valor Máximo</Label>
                        <StandaloneCurrencyInput
                          id={`max-${store.id}`}
                          value={reaisToCents(parseBRLToNumber(editingValues.maxValue))}
                          onChange={(cents) => handleValueChange(store.id, 'maxValue', formatCentsToBRL(cents))}
                          placeholder="R$ 0,00"
                        />
                        {currentDevice && (
                          <p className="text-xs text-muted-foreground">
                            Atual: {formatCurrency(currentDevice.maxValue)}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} className="bg-success hover:bg-success/90">
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}