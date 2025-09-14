import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/data/mockData";
import { formatCentsToBRL, centsToReais, reaisToCents, parseBRLToNumber } from "@/lib/currency";
import { StandaloneCurrencyInput } from "@/lib/ControlledCurrencyInput";

interface DamageValue {
  damageId: string;
  damageName: string;
  currentValue: number;
}

interface EditAllDamagesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subcategoryName: string;
  damageValues: DamageValue[];
  onSave: (updates: { damageId: string; newValue: number }[]) => void;
}

export function EditAllDamagesModal({ 
  open, 
  onOpenChange, 
  subcategoryName, 
  damageValues, 
  onSave 
}: EditAllDamagesModalProps) {
  const [values, setValues] = useState<Record<string, number>>({});
  const { toast } = useToast();

  // Initialize values when modal opens
  useEffect(() => {
    if (open && damageValues.length > 0) {
      const initialValues: Record<string, number> = {};
      damageValues.forEach(damage => {
        initialValues[damage.damageId] = damage.currentValue;
      });
      setValues(initialValues);
    }
  }, [open, damageValues]);

  const handleSave = () => {
    const updates: { damageId: string; newValue: number }[] = [];
    let hasError = false;

    // Validate all values
    for (const damage of damageValues) {
      const value = values[damage.damageId] || 0;
      
      if (value < 0) {
        toast({
          title: "Erro de Validação",
          description: `O valor para "${damage.damageName}" não pode ser negativo`,
          variant: "destructive"
        });
        hasError = true;
        break;
      }

      updates.push({
        damageId: damage.damageId,
        newValue: value
      });
    }

    if (!hasError) {
      onSave(updates);
      onOpenChange(false);
      toast({
        title: "Avarias Atualizadas",
        description: `Todas as avarias de "${subcategoryName}" foram atualizadas com sucesso`
      });
    }
  };

  const handleValueChange = (damageId: string, value: number) => {
    setValues(prev => ({
      ...prev,
      [damageId]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Editar Todas as Avarias - {subcategoryName}
          </DialogTitle>
          <DialogDescription>
            Edite os valores de desconto para todas as avarias desta subcategoria de uma só vez.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                Valores de Desconto (R$)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {damageValues.map((damage) => (
                  <div key={damage.damageId} className="space-y-2">
                    <Label htmlFor={`damage-${damage.damageId}`} className="text-sm font-medium">
                      {damage.damageName}
                    </Label>
                    <div className="flex flex-col gap-2">
                      <StandaloneCurrencyInput
                        value={reaisToCents(values[damage.damageId] || 0)}
                        onChange={(cents) => handleValueChange(damage.damageId, centsToReais(cents))}
                        placeholder="R$ 0,00"
                      />
                      <p className="text-xs text-muted-foreground">
                        Atual: {formatCurrency(damage.currentValue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary">
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}