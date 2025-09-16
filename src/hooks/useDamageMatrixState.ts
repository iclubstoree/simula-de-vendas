import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import {
  subcategories,
  damageMatrix,
  formatCurrency,
  updateDamageTypeDiscount,
  type DamageType,
  type DamageMatrix
} from "@/data/mockData";

interface DamageFormData {
  name: string;
  defaultDiscount: string;
}

export function useDamageMatrixState() {
  const { damageTypes: damageTypesList, addDamageType } = useData();
  const [matrixData, setMatrixData] = useState<DamageMatrix[]>(damageMatrix);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDamageFilter, setSelectedDamageFilter] = useState<string>("all");
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [damageEditOpen, setDamageEditOpen] = useState(false);
  const [selectedDamage, setSelectedDamage] = useState<DamageType | null>(null);
  const [selectedItems, setSelectedItems] = useState<DamageType[]>([]);
  const [selectedDamageIds, setSelectedDamageIds] = useState<string[]>([]);
  const [editAllModalOpen, setEditAllModalOpen] = useState(false);
  const [customDamageModalOpen, setCustomDamageModalOpen] = useState(false);
  const [pendingCustomDamageModels, setPendingCustomDamageModels] = useState<DamageType[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<{ id: string; name: string } | null>(null);

  const [newDamageForm, setNewDamageForm] = useState<DamageFormData>({
    name: "",
    defaultDiscount: ""
  });

  const { toast } = useToast();

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
        id: `matrix-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        subcategoryId,
        damageTypeId,
        discountValue: value
      };
      setMatrixData(prev => [...prev, newMatrix]);
    }
  };

  const handleCellEdit = (subcategoryId: string, damageTypeId: string, value: number) => {
    if (value < 0) {
      toast({
        title: "Erro",
        description: "Valor não pode ser negativo",
        variant: "destructive"
      });
      return;
    }

    updateMatrixValue(subcategoryId, damageTypeId, value);
    toast({
      title: "Valor atualizado",
      description: "Desconto salvo com sucesso"
    });
  };

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

  // Form handlers
  const handleFormChange = (updates: Partial<DamageFormData>) => {
    setNewDamageForm(prev => ({ ...prev, ...updates }));
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

    // Create consistent damage ID
    const damageId = `damage-${Date.now()}`;

    // Add damage type using DataContext (but we need to create it with the specific ID)
    // Since addDamageType creates its own ID, we'll work with the current approach
    addDamageType({
      name: newDamageForm.name,
      discount: defaultDiscount
    });

    // Get the latest damage ID from the updated list
    // Since addDamageType is async and we can't get the ID directly,
    // we'll create matrix entries when the component updates with new damageTypes
    // For now, let's create entries with a predictable ID structure

    // Create matrix entries for all subcategories with default value
    setTimeout(() => {
      // Get the newest damage type (it should be the last one added)
      const newestDamage = damageTypesList[damageTypesList.length - 1];
      if (newestDamage && newestDamage.name === newDamageForm.name) {
        const newMatrixEntries: DamageMatrix[] = filteredSubcategories.map(sub => ({
          id: `matrix-${sub.id}-${newestDamage.id}-${Date.now()}`,
          subcategoryId: sub.id,
          damageTypeId: newestDamage.id,
          discountValue: defaultDiscount
        }));

        setMatrixData(prev => [...prev, ...newMatrixEntries]);
      }
    }, 100); // Small delay to allow DataContext to update

    setDialogOpen(false);
    setNewDamageForm({ name: "", defaultDiscount: "" });

    toast({
      title: "Avaria adicionada",
      description: `${newDamageForm.name} foi criada com desconto padrão de ${formatCurrency(defaultDiscount)} e adicionada automaticamente a todas as subcategorias`
    });
  };

  const deleteDamageType = (damageTypeId: string) => {
    const damageType = damageTypesList.find(d => d.id === damageTypeId);
    // For now, show message that this is in development
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Exclusão de avarias será implementada em breve",
      variant: "default"
    });
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedDamageFilter("all");
  };

  const handleEditDamage = (damage: DamageType) => {
    setSelectedDamage(damage);
    setDamageEditOpen(true);
  };

  const handleSaveDamage = (updatedDamage: DamageType) => {
    // For now, show message that this is in development
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Edição de avarias será implementada em breve",
      variant: "default"
    });

    setSelectedDamage(null);
    setDamageEditOpen(false);
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
        currentValue: matrixEntry?.discountValue || 0
      };
    });
  };

  const handleSaveAllDamages = (updates: { damageId: string; newValue: number }[]) => {
    if (!selectedSubcategory) return;

    updates.forEach(update => {
      updateMatrixValue(selectedSubcategory.id, update.damageId, update.newValue);
    });
  };

  return {
    // State
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

    // Computed values
    filteredSubcategories,
    filteredDamageTypes,

    // Handlers
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
  };
}