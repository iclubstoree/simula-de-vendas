import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Edit3, Save, Copy, AlertTriangle, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { stores, formatCurrency } from "@/data/mockData";
import { parseBRLToNumber, formatCentsToBRL } from "@/lib/currency";

interface ModelPriceData {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  type: 'novo' | 'seminovo';
  originalPrices: Record<string, number>;
  editedPrices: Record<string, number>;
  hasChanges: boolean;
  errors: Record<string, string>;
}

interface CustomPriceEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModels: any[];
  selectedStores: string[];
  onSave: (changes: { modelId: string; storeId: string; newPrice: number }[]) => Promise<boolean>;
}

export function CustomPriceEditModal({ 
  open, 
  onOpenChange, 
  selectedModels, 
  selectedStores,
  onSave 
}: CustomPriceEditModalProps) {
  const [modelData, setModelData] = useState<ModelPriceData[]>([]);
  const [editingCell, setEditingCell] = useState<{ modelId: string; storeId: string } | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Initialize model data when modal opens
  useEffect(() => {
    if (open && selectedModels.length > 0) {
      const initialData: ModelPriceData[] = selectedModels.map(model => ({
        id: model.id,
        name: model.name,
        category: model.category,
        subcategory: model.subcategory,
        type: model.type,
        originalPrices: { ...model.prices },
        editedPrices: { ...model.prices },
        hasChanges: false,
        errors: {}
      }));
      setModelData(initialData);
      setHasUnsavedChanges(false);
    }
  }, [open, selectedModels]);

  // Auto-focus input when editing cell
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  const startEditing = (modelId: string, storeId: string) => {
    const model = modelData.find(m => m.id === modelId);
    if (!model) return;

    const currentPrice = model.editedPrices[storeId] || 0;
    setTempValue(formatCentsToBRL(currentPrice * 100));
    setEditingCell({ modelId, storeId });
  };

  const cancelEditing = () => {
    setEditingCell(null);
    setTempValue("");
  };

  const saveCell = () => {
    if (!editingCell) return;

    const numericValue = parseBRLToNumber(tempValue);
    
    if (isNaN(numericValue) || numericValue < 0) {
      setModelData(prev => prev.map(model => 
        model.id === editingCell.modelId 
          ? { ...model, errors: { ...model.errors, [editingCell.storeId]: "Valor inválido" } }
          : model
      ));
      return;
    }

    setModelData(prev => prev.map(model => {
      if (model.id === editingCell.modelId) {
        const newEditedPrices = { ...model.editedPrices, [editingCell.storeId]: numericValue };
        const hasChanges = Object.keys(newEditedPrices).some(storeId => 
          newEditedPrices[storeId] !== model.originalPrices[storeId]
        );
        
        return {
          ...model,
          editedPrices: newEditedPrices,
          hasChanges,
          errors: { ...model.errors, [editingCell.storeId]: "" }
        };
      }
      return model;
    }));

    setHasUnsavedChanges(true);
    setEditingCell(null);
    setTempValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveCell();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEditing();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      saveCell();
      // Could implement navigation to next cell here
    }
  };


  const getChangedModels = () => {
    return modelData.filter(model => model.hasChanges);
  };

  const getChangesToSave = () => {
    const changes: { modelId: string; storeId: string; newPrice: number }[] = [];
    
    modelData.forEach(model => {
      if (model.hasChanges) {
        selectedStores.forEach(storeId => {
          if (model.editedPrices[storeId] !== model.originalPrices[storeId]) {
            changes.push({
              modelId: model.id,
              storeId,
              newPrice: model.editedPrices[storeId] || 0
            });
          }
        });
      }
    });

    return changes;
  };

  const handleSave = async () => {
    const changes = getChangesToSave();
    
    if (changes.length === 0) {
      toast({
        title: "Nenhuma Alteração",
        description: "Não há alterações para salvar",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await onSave(changes);
      
      if (success) {
        toast({
          title: "Preços Atualizados",
          description: `${changes.length} alterações salvas com sucesso`
        });
        setHasUnsavedChanges(false);
        onOpenChange(false);
      } else {
        toast({
          title: "Erro no Salvamento",
          description: "Houve um erro ao salvar algumas alterações",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar alterações",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (confirm("Você tem alterações não salvas. Deseja sair mesmo assim?")) {
        onOpenChange(false);
        setHasUnsavedChanges(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  const changedModels = getChangedModels();

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Edição de Preços Personalizados
            </DialogTitle>
            <DialogDescription>
              Edite os preços dos modelos selecionados por loja. {selectedModels.length} modelo(s) selecionado(s).
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            {/* Header Actions */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                {changedModels.length > 0 && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    {changedModels.length} item(s) alterado(s)
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReviewModal(true)}
                  disabled={changedModels.length === 0}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Revisar Alterações
                </Button>
              </div>
            </div>


            {/* Editable Table */}
            <div className="flex-1 overflow-auto border rounded-lg">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead className="w-[200px]">Modelo</TableHead>
                    <TableHead className="w-[120px]">Categoria</TableHead>
                    <TableHead className="w-[120px]">Tipo</TableHead>
                    {selectedStores.map(storeId => {
                      const store = stores.find(s => s.id === storeId);
                      return (
                        <TableHead key={storeId} className="w-[150px] text-center">
                          Preço {store?.name}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelData.map((model) => (
                    <TableRow key={model.id} className={model.hasChanges ? "bg-orange-50" : ""}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {model.hasChanges && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                          <span className="truncate">{model.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {model.category}
                      </TableCell>
                      <TableCell>
                        <Badge variant={model.type === 'novo' ? 'default' : 'secondary'}>
                          {model.type}
                        </Badge>
                      </TableCell>
                      {selectedStores.map(storeId => {
                        const isEditing = editingCell?.modelId === model.id && editingCell?.storeId === storeId;
                        const hasError = model.errors[storeId];
                        const hasChanged = model.editedPrices[storeId] !== model.originalPrices[storeId];
                        
                        return (
                          <TableCell key={storeId} className="text-center p-2">
                            {isEditing ? (
                              <Input
                                ref={inputRef}
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={saveCell}
                                className="w-full text-center"
                                placeholder="R$ 0,00"
                              />
                            ) : (
                              <button
                                onClick={() => startEditing(model.id, storeId)}
                                className={`w-full p-2 text-center rounded border-2 border-transparent hover:border-primary/50 transition-colors ${
                                  hasChanged ? 'bg-orange-100 border-orange-300' : 'hover:bg-muted'
                                } ${hasError ? 'border-red-300 bg-red-50' : ''}`}
                              >
                                {hasError ? (
                                  <span className="text-red-600 text-xs">{hasError}</span>
                                ) : (
                                  formatCurrency(model.editedPrices[storeId] || 0)
                                )}
                              </button>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={changedModels.length === 0 || isSubmitting}
              className="bg-gradient-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Salvando..." : `Salvar (${changedModels.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Changes Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Revisar Alterações</DialogTitle>
            <DialogDescription>
              Confirme as alterações que serão salvas
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {changedModels.map(model => (
              <Card key={model.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{model.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {selectedStores.map(storeId => {
                      const store = stores.find(s => s.id === storeId);
                      const originalPrice = model.originalPrices[storeId] || 0;
                      const newPrice = model.editedPrices[storeId] || 0;
                      
                      if (originalPrice === newPrice) return null;
                      
                      return (
                        <div key={storeId} className="flex items-center justify-between text-sm">
                          <span>{store?.name}:</span>
                          <div className="flex items-center gap-2">
                            <span className="line-through text-muted-foreground">
                              {formatCurrency(originalPrice)}
                            </span>
                            <span>→</span>
                            <span className="font-medium text-green-600">
                              {formatCurrency(newPrice)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewModal(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}