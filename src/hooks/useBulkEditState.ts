import { useState, useEffect, useMemo } from "react";

type UpdateType = "percentage" | "fixed" | "custom_price";
type BulkEditType = "models" | "tradein" | "damages";

interface BulkEditItem {
  id: string;
  name: string;
}

interface Store {
  id: string;
  name: string;
  active: boolean;
}

interface UseBulkEditStateProps {
  type: BulkEditType;
  allItems: BulkEditItem[];
  selectedItems: BulkEditItem[];
  stores: Store[];
  open: boolean;
}

export function useBulkEditState({
  type,
  allItems,
  selectedItems,
  stores,
  open
}: UseBulkEditStateProps) {
  const [updateType, setUpdateType] = useState<UpdateType>("percentage");
  const [fieldsToUpdate, setFieldsToUpdate] = useState<string[]>([]);
  const [internalSelectedItems, setInternalSelectedItems] = useState<BulkEditItem[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>(() => {
    return (type === "models" || type === "tradein")
      ? stores.filter(store => store.active).map(s => s.id)
      : [];
  });

  const [cardValues, setCardValues] = useState<Record<string, Record<string, string>>>({
    percentage: {},
    fixed: {}
  });

  const availableItems = useMemo(() => allItems || [], [allItems]);
  const effectiveSelectedItems = internalSelectedItems;

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
        const matchedItems = allItems.filter(item => selectedItems.some(sel => sel.id === item.id));
        setInternalSelectedItems(matchedItems);
      } else {
        setInternalSelectedItems([]);
      }
    }
  }, [open, selectedItems, allItems]);

  // Auto-populate values when modal opens with current values from selected items
  useEffect(() => {
    if (open && effectiveSelectedItems.length > 0) {
      if (type === "models") {
        const newCardValues = {
          percentage: { price: "" },
          fixed: { price: "" }
        };
        setCardValues(newCardValues);
      } else if (type === "tradein") {
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

  const handleSelectAllInternal = (checked: boolean) => {
    if (checked) {
      setInternalSelectedItems(availableItems);
    } else {
      setInternalSelectedItems([]);
    }
  };

  const handleSelectItemInternal = (item: BulkEditItem, checked: boolean) => {
    if (checked) {
      setInternalSelectedItems(prev => [...prev, item]);
    } else {
      setInternalSelectedItems(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const handleSelectAllStores = (checked: boolean) => {
    if (checked) {
      setSelectedStores(stores.filter(store => store.active).map(store => store.id));
    } else {
      setSelectedStores([]);
    }
  };

  const handleSelectStore = (storeId: string, checked: boolean) => {
    if (checked) {
      setSelectedStores(prev => [...prev, storeId]);
    } else {
      setSelectedStores(prev => prev.filter(id => id !== storeId));
    }
  };

  const handleFieldValueChange = (fieldId: string, value: string, fieldType: string) => {
    let processedValue = value;

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
  };

  return {
    updateType,
    setUpdateType,
    fieldsToUpdate,
    setFieldsToUpdate,
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
  };
}