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
import { Edit3, Save, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StandaloneCurrencyInput } from "@/lib/ControlledCurrencyInput";
import { subcategories, formatCurrency } from "@/data/mockData";

interface CustomDamageEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDamages: any[]; // Damage types to edit
  onSave: (changes: { damageId: string; subcategoryId: string; newValue: number }[]) => Promise<boolean>;
}

interface EditValue {
  damageId: string;
  subcategoryId: string;
  value: number; // Value in cents
}

export function CustomDamageEditModal({ 
  open, 
  onOpenChange, 
  selectedDamages, 
  onSave 
}: CustomDamageEditModalProps) {
  const [editValues, setEditValues] = useState<EditValue[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Get active subcategories
  const activeSubcategories = subcategories.filter(sub => sub.active);

  // Debug log for received props
  useEffect(() => {
    console.log('🔧 CustomDamageEditModal props:', {
      open,
      selectedDamagesCount: selectedDamages.length,
      subcategoriesCount: activeSubcategories.length,
      selectedDamages: selectedDamages.map(d => ({ id: d.id, name: d.name }))
    });
  }, [open, selectedDamages]);

  // Initialize edit values when modal opens
  useEffect(() => {
    if (open && selectedDamages.length > 0) {
      const initialValues: EditValue[] = [];
      
      selectedDamages.forEach(damage => {
        activeSubcategories.forEach(subcategory => {
          // Use the damage's discount value in cents (reais * 100)
          initialValues.push({
            damageId: damage.id,
            subcategoryId: subcategory.id,
            value: (damage.discount || 0) * 100
          });
        });
      });
      
      setEditValues(initialValues);
    } else if (!open) {
      // Reset when modal closes
      setEditValues([]);
    }
  }, [open, selectedDamages]); // Removed activeSubcategories from dependencies

  // Get current value for a specific cell
  const getValue = useCallback((damageId: string, subcategoryId: string): number => {
    const editValue = editValues.find(ev => 
      ev.damageId === damageId && ev.subcategoryId === subcategoryId
    );
    return editValue?.value || 0;
  }, [editValues]);

  // Update a specific cell value
  const updateValue = useCallback((damageId: string, subcategoryId: string, newValue: number) => {
    setEditValues(prev => prev.map(ev => 
      ev.damageId === damageId && ev.subcategoryId === subcategoryId
        ? { ...ev, value: newValue }
        : ev
    ));
  }, []);

  // Save changes
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Collect all changes
      const changes: { damageId: string; subcategoryId: string; newValue: number }[] = [];
      
      editValues.forEach(editValue => {
        changes.push({
          damageId: editValue.damageId,
          subcategoryId: editValue.subcategoryId,
          newValue: editValue.value / 100 // Convert cents back to reais
        });
      });
      
      const success = await onSave(changes);
      
      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error saving custom damage values:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as alterações",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Get subcategory name
  const getSubcategoryName = (subcategoryId: string) => {
    return activeSubcategories.find(s => s.id === subcategoryId)?.name || subcategoryId;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Valores Personalizados - Avarias
          </DialogTitle>
          <DialogDescription>
            Edite os valores (R$) de cada avaria por subcategoria. {selectedDamages.length} avaria(s) selecionada(s).
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Main editing table */}
          <Card className="flex-1 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Tabela de Edição</CardTitle>
              <CardDescription className="text-xs">
                Edite os valores (R$) diretamente na tabela. Estrutura: subcategorias × avarias
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <div className="border rounded-md h-full overflow-auto scroll-smooth">
                <div className="min-w-max">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-20">
                      <TableRow>
                        <TableHead className="sticky left-0 bg-background border-r min-w-[200px] z-30">
                          Subcategoria
                        </TableHead>
                        {selectedDamages.map(damage => (
                          <TableHead key={damage.id} className="text-center border-r min-w-[180px] bg-background">
                            <div className="flex flex-col items-center p-2">
                              <span className="font-semibold text-sm">{damage.name}</span>
                              <span className="text-xs text-muted-foreground">Valor R$</span>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeSubcategories.map((subcategory) => (
                        <TableRow key={subcategory.id} className="hover:bg-muted/50">
                          <TableCell className="sticky left-0 bg-background border-r font-medium min-w-[200px] z-10">
                            <div className="flex flex-col py-2">
                              <span className="font-medium text-sm">{subcategory.name}</span>
                              <Badge variant="outline" className="text-xs w-fit mt-1">
                                Subcategoria
                              </Badge>
                            </div>
                          </TableCell>
                          
                          {selectedDamages.map(damage => (
                            <TableCell key={`${damage.id}-${subcategory.id}`} className="p-3 border-r min-w-[180px]">
                              <StandaloneCurrencyInput
                                value={getValue(damage.id, subcategory.id)}
                                onChange={(newValue) => updateValue(damage.id, subcategory.id, newValue)}
                                placeholder="R$ 0,00"
                                className="w-full text-sm"
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {selectedDamages.length === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma avaria selecionada para edição</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer with actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
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
      </DialogContent>
    </Dialog>
  );
}