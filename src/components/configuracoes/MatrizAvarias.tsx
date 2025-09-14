import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Edit, 
  AlertTriangle, 
  Trash2,
  Info
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  subcategories, 
  damageTypes,
  damageMatrix,
  categories,
  type Subcategory,
  type DamageType,
  type DamageMatrix,
  formatCurrency,
  updateDamageTypeDiscount
} from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { BulkEditModal } from "./BulkEditModal";
import { DamageEditModal } from "./DamageEditModal";
import { EditAllDamagesModal } from "./EditAllDamagesModal";
import { CustomDamageEditModal } from "./CustomDamageEditModal";

export function MatrizAvarias() {
  const [matrixData, setMatrixData] = useState<DamageMatrix[]>(damageMatrix);
  const [damageTypesList, setDamageTypesList] = useState<DamageType[]>(damageTypes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDamageFilter, setSelectedDamageFilter] = useState<string>("all");
  const [editingCell, setEditingCell] = useState<{subcategoryId: string, damageTypeId: string} | null>(null);
  const [editValue, setEditValue] = useState("");
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [damageEditOpen, setDamageEditOpen] = useState(false);
  const [selectedDamage, setSelectedDamage] = useState<DamageType | null>(null);
  const [selectedItems, setSelectedItems] = useState<DamageType[]>([]);
  const [selectedDamageIds, setSelectedDamageIds] = useState<string[]>([]);
  const [editAllModalOpen, setEditAllModalOpen] = useState(false);
  const [customDamageModalOpen, setCustomDamageModalOpen] = useState(false);
  const [pendingCustomDamageModels, setPendingCustomDamageModels] = useState<any[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<{ id: string; name: string } | null>(null);
  
  const [newDamageForm, setNewDamageForm] = useState({
    name: "",
    defaultDiscount: ""
  });
  
  const { toast } = useToast();

  // Selection logic
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(damageTypesList);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (damage: DamageType, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, damage]);
    } else {
      setSelectedItems(prev => prev.filter(item => item.id !== damage.id));
    }
  };

  const isAllSelected = selectedItems.length === damageTypesList.length && damageTypesList.length > 0;
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < damageTypesList.length;

  // Filter subcategories by selected category
  const filteredSubcategories = subcategories.filter(sub => {
    if (selectedCategory === "all") return true;
    return sub.categoryId === selectedCategory;
  }).filter(sub => sub.active);

  // Filter damage types by selected damage filter
  const filteredDamageTypes = damageTypesList.filter(damage => {
    if (selectedDamageFilter === "all") return true;
    return damage.id === selectedDamageFilter;
  });

  // Get matrix value for a specific subcategory and damage type
  const getMatrixValue = (subcategoryId: string, damageTypeId: string): number => {
    const matrix = matrixData.find(m => 
      m.subcategoryId === subcategoryId && m.damageTypeId === damageTypeId
    );
    return matrix?.discountValue || 0;
  };

  // Update matrix value
  const updateMatrixValue = (subcategoryId: string, damageTypeId: string, value: number) => {
    const existingMatrix = matrixData.find(m => 
      m.subcategoryId === subcategoryId && m.damageTypeId === damageTypeId
    );

    if (existingMatrix) {
      setMatrixData(prev => prev.map(m => 
        m.id === existingMatrix.id ? { ...m, discountValue: value } : m
      ));
    } else {
      // Create new matrix entry
      const newMatrix: DamageMatrix = {
        id: `matrix-${Date.now()}`,
        subcategoryId,
        damageTypeId,
        discountValue: value
      };
      setMatrixData(prev => [...prev, newMatrix]);
    }
  };

  // Handle inline editing
  const handleCellClick = (subcategoryId: string, damageTypeId: string) => {
    const currentValue = getMatrixValue(subcategoryId, damageTypeId);
    setEditingCell({ subcategoryId, damageTypeId });
    setEditValue(currentValue.toString());
  };

  const handleCellSave = () => {
    if (!editingCell) return;
    
    const value = parseFloat(editValue) || 0;
    if (value < 0) {
      toast({
        title: "Erro",
        description: "Valor não pode ser negativo",
        variant: "destructive"
      });
      return;
    }

    updateMatrixValue(editingCell.subcategoryId, editingCell.damageTypeId, value);
    setEditingCell(null);
    toast({
      title: "Valor atualizado",
      description: "Desconto salvo com sucesso"
    });
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue("");
  };

  // Add new damage type
  const handleAddDamageType = () => {
    if (!newDamageForm.name.trim() || !newDamageForm.defaultDiscount) {
      toast({
        title: "Erro",
        description: "Nome e desconto padrão são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const defaultDiscount = parseFloat(newDamageForm.defaultDiscount);
    if (isNaN(defaultDiscount) || defaultDiscount < 0) {
      toast({
        title: "Erro",
        description: "Desconto deve ser um número válido não negativo",
        variant: "destructive"
      });
      return;
    }

    // Create new damage type
    const newDamageType: DamageType = {
      id: `damage-${Date.now()}`,
      name: newDamageForm.name,
      discount: defaultDiscount
    };
    setDamageTypesList(prev => [...prev, newDamageType]);

    // Create matrix entries for all subcategories with default value
    const newMatrixEntries: DamageMatrix[] = filteredSubcategories.map(sub => ({
      id: `matrix-${sub.id}-${newDamageType.id}-${Date.now()}`,
      subcategoryId: sub.id,
      damageTypeId: newDamageType.id,
      discountValue: defaultDiscount
    }));
    
    setMatrixData(prev => [...prev, ...newMatrixEntries]);
    setDialogOpen(false);
    setNewDamageForm({ name: "", defaultDiscount: "" });
    
    toast({
      title: "Avaria adicionada",
      description: `${newDamageForm.name} foi criada com desconto padrão de ${formatCurrency(defaultDiscount)}`
    });
  };

  const handleEditAllForModel = (subcategoryId: string) => {
    const subcategory = filteredSubcategories.find(s => s.id === subcategoryId);
    if (!subcategory) return;

    setSelectedSubcategory({ id: subcategoryId, name: subcategory.name });
    setEditAllModalOpen(true);
  };

  const getDamageValuesForSubcategory = (subcategoryId: string) => {
    return damageTypesList.map(damage => {
      const matrixEntry = matrixData.find(m => 
        m.subcategoryId === subcategoryId && m.damageTypeId === damage.id
      );
      return {
        damageId: damage.id,
        damageName: damage.name,
        currentValue: matrixEntry?.discount || 0
      };
    });
  };

  const handleSaveAllDamages = (updates: { damageId: string; newValue: number }[]) => {
    if (!selectedSubcategory) return;

    updates.forEach(update => {
      updateMatrixValue(selectedSubcategory.id, update.damageId, update.newValue);
    });
  };

  const deleteDamageType = (damageTypeId: string) => {
    const damageType = damageTypesList.find(d => d.id === damageTypeId);
    setDamageTypesList(prev => prev.filter(d => d.id !== damageTypeId));
    setMatrixData(prev => prev.filter(m => m.damageTypeId !== damageTypeId));
    
    toast({
      title: "Avaria removida",
      description: `${damageType?.name} foi removida da matriz`
    });
  };

  const handleBulkEdit = (updates: { type: string; selectedItemIds?: string[]; [key: string]: any }) => {
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
      Object.entries(data).forEach(([subcategoryId, damages]: [string, any]) => {
        Object.entries(damages).forEach(([damageId, value]: [string, any]) => {
          updateMatrixValue(subcategoryId, damageId, value);
          
          // 🔥 CRITICAL: Update the original damage type data for persistence
          updateDamageTypeDiscount(damageId, value);
        });
      });
      
      // Show success toast
      setTimeout(() => {
        toast({
          title: "Descontos personalizados aplicados",
          description: `${updates.itemCount} subcategorias atualizadas`
        });
      }, 100);
    }

    // Handle regular bulk edit logic for percentage and fixed values
    if (updates.type === "percentage" || updates.type === "fixed") {
      const { cardValues, fields } = updates;
      
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
            // Update damage name
            setDamageTypesList(prev => prev.map(d => 
              d.id === damage.id ? { ...d, name: cardValues[field] } : d
            ));
          }
        });
      });
      
      // Show success toast 
      setTimeout(() => {
        toast({
          title: "Alterações aplicadas", 
          description: `${updates.itemCount} avarias atualizadas com ${updates.type === 'percentage' ? 'ajuste percentual' : 'valor fixo'}`
        });
      }, 100);
    }

    // Handle replace mode
    if (updates.type === "replace") {
      const { replaceValues } = updates;
      
      selectedItems.forEach(damage => {
        if (replaceValues.name) {
          setDamageTypesList(prev => prev.map(d => 
            d.id === damage.id ? { ...d, name: replaceValues.name } : d
          ));
        }
        
        if (replaceValues.discount) {
          const newDiscount = parseFloat(replaceValues.discount) || 0;
          filteredSubcategories.forEach(sub => {
            updateMatrixValue(sub.id, damage.id, newDiscount);
          });
        }
      });
      
      // Toast will be shown after modal closes
      setTimeout(() => {
        toast({
          title: "Alterações aplicadas",
          description: `${updates.itemCount} avarias atualizadas com novos valores`
        });
      }, 100);
    }
  };

  const handleEditDamage = (damage: DamageType) => {
    setSelectedDamage(damage);
    setDamageEditOpen(true);
  };

  const handleSaveDamage = (updatedDamage: DamageType) => {
    setDamageTypesList(prev => prev.map(d => 
      d.id === updatedDamage.id ? updatedDamage : d
    ));
    
    // Force component re-render by updating a dependency
    setSelectedDamage(null);
    setDamageEditOpen(false);
    
    toast({
      title: "Avaria atualizada",
      description: `${updatedDamage.name} foi atualizada com sucesso`
    });
  };

  const handleCustomDamageSave = async (changes: { damageId: string; subcategoryId: string; newValue: number }[]): Promise<boolean> => {
    try {
      console.log('💾 Saving custom damage values:', changes);
      
      // Apply all changes to the matrix
      changes.forEach(change => {
        updateMatrixValue(change.subcategoryId, change.damageId, change.newValue);
      });
      
      toast({
        title: "Valores personalizados aplicados",
        description: `${changes.length} valores atualizados com sucesso`
      });
      
      return true;
    } catch (error) {
      console.error('Error saving custom damage values:', error);
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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-primary hover:bg-primary-hover"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Avaria
              </Button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Avaria</DialogTitle>
                <DialogDescription>
                  Crie um novo tipo de avaria que será adicionado à matriz
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="damageName">Nome da Avaria</Label>
                  <Input
                    id="damageName"
                    placeholder="Ex: Display, Bateria, Carcaça"
                    value={newDamageForm.name}
                    onChange={(e) => setNewDamageForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="damageDiscount">Desconto Padrão (R$)</Label>
                  <Input
                    id="damageDiscount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={newDamageForm.defaultDiscount}
                    onChange={(e) => setNewDamageForm(prev => ({ ...prev, defaultDiscount: e.target.value }))}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddDamageType} className="bg-gradient-primary">
                  Criar Avaria
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
              <p className="text-sm font-medium">Importante sobre matriz de avarias</p>
              <p className="text-sm text-muted-foreground">
                Configure os descontos aplicados para cada tipo de avaria em diferentes subcategorias. 
                Os valores são utilizados no simulador para calcular descontos em aparelhos de entrada.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Filtros
            </CardTitle>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedCategory("all");
                setSelectedDamageFilter("all");
              }}
              className="text-sm"
            >
              Limpar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Avaria</Label>
              <Select value={selectedDamageFilter} onValueChange={setSelectedDamageFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Avarias</SelectItem>
                  {damageTypesList.map(damage => (
                    <SelectItem key={damage.id} value={damage.id}>
                      {damage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matrix Table */}
      <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Gerenciar Matriz de Avarias
              </CardTitle>
              <div className="flex items-center gap-2">
                {selectedItems.length > 0 && (
                  <Badge className="bg-primary text-primary-foreground">
                    {selectedItems.length} selecionadas
                  </Badge>
                )}
              </div>
            </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table key={`matrix-${damageTypesList.length}-${matrixData.length}`}>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Subcategoria</TableHead>
                  {filteredDamageTypes.map((damage) => {
                    const isSelected = selectedItems.some(item => item.id === damage.id);
                    return (
                      <TableHead key={damage.id} className="text-center min-w-[120px]">
                        <div className="space-y-1">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-medium">{damage.name}</span>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditDamage(damage)}
                                title="Editar avaria"
                                className="h-6 w-6 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteDamageType(damage.id)}
                                title="Excluir avaria"
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TableHead>
                    );
                  })}
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubcategories.map((subcategory) => (
                  <TableRow key={subcategory.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <div>{subcategory.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {categories.find(c => c.id === subcategory.categoryId)?.name}
                        </Badge>
                      </div>
                    </TableCell>
                    {filteredDamageTypes.map((damage) => (
                      <TableCell key={`${subcategory.id}-${damage.id}`} className="text-center">
                        {editingCell?.subcategoryId === subcategory.id && 
                         editingCell?.damageTypeId === damage.id ? (
                          <div className="flex gap-1">
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCellSave();
                                if (e.key === 'Escape') handleCellCancel();
                              }}
                              className="w-20 h-8 text-center"
                              autoFocus
                            />
                            <Button size="sm" onClick={handleCellSave} className="h-8 w-8 p-0">
                              ✓
                            </Button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleCellClick(subcategory.id, damage.id)}
                            className="w-full p-2 rounded hover:bg-muted/50 cursor-pointer"
                          >
                            {formatCurrency(getMatrixValue(subcategory.id, damage.id))}
                          </button>
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      <div className="flex gap-1 justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditAllForModel(subcategory.id)}
                          title="Editar todas as avarias desta subcategoria"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredSubcategories.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma subcategoria encontrada para a categoria selecionada
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
      />
    </div>
  );
}