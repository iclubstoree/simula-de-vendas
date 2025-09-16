import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { X, Check, AlertTriangle } from "lucide-react";

export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onClick: () => void;
  disabled?: boolean;
  confirmationRequired?: boolean;
  confirmationMessage?: string;
}

export interface BulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  actions: BulkAction[];
  onClearSelection: () => void;

  // Configuration
  showSelectionSummary?: boolean;
  showSelectAllButton?: boolean;
  onSelectAll?: () => void;

  // Styling
  className?: string;
  variant?: "default" | "floating" | "compact";

  // Labels
  selectedLabel?: string;
  totalLabel?: string;
  selectAllLabel?: string;
  clearSelectionLabel?: string;
}

export function BulkActionBar({
  selectedCount,
  totalCount,
  actions,
  onClearSelection,
  showSelectionSummary = true,
  showSelectAllButton = true,
  onSelectAll,
  className = "",
  variant = "default",
  selectedLabel = "selecionado(s)",
  totalLabel = "total",
  selectAllLabel = "Selecionar todos",
  clearSelectionLabel = "Limpar seleção"
}: BulkActionBarProps) {
  const [confirmingAction, setConfirmingAction] = React.useState<string | null>(null);

  const handleActionClick = (action: BulkAction) => {
    if (action.confirmationRequired && confirmingAction !== action.id) {
      setConfirmingAction(action.id);
      return;
    }

    action.onClick();
    setConfirmingAction(null);
  };

  const cancelConfirmation = () => {
    setConfirmingAction(null);
  };

  if (selectedCount === 0) {
    return null;
  }

  const baseClasses = "flex items-center gap-4 p-4 border rounded-lg transition-all duration-200";

  const variantClasses = {
    default: "bg-background border-border",
    floating: "bg-background border-border shadow-lg",
    compact: "bg-muted/50 border-muted p-2"
  };

  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <Card className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {/* Selection Summary */}
      {showSelectionSummary && (
        <div className="flex items-center gap-2">
          <Badge variant="default" className="px-2 py-1">
            {selectedCount} {selectedLabel}
          </Badge>

          {totalCount > 0 && (
            <span className="text-sm text-muted-foreground">
              de {totalCount} {totalLabel}
            </span>
          )}
        </div>
      )}

      {/* Select All Button */}
      {showSelectAllButton && onSelectAll && !isAllSelected && totalCount > selectedCount && (
        <Button
          variant="outline"
          size="sm"
          onClick={onSelectAll}
          className="h-8"
        >
          <Check className="h-4 w-4 mr-1" />
          {selectAllLabel} ({totalCount})
        </Button>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-1">
        {actions.map((action) => {
          const isConfirming = confirmingAction === action.id;

          return (
            <div key={action.id} className="flex items-center gap-1">
              <Button
                variant={isConfirming ? "destructive" : action.variant || "default"}
                size={variant === "compact" ? "sm" : "default"}
                onClick={() => handleActionClick(action)}
                disabled={action.disabled}
                className={variant === "compact" ? "h-8" : ""}
              >
                {isConfirming ? (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Confirmar?
                  </>
                ) : (
                  <>
                    {action.icon && <span className="mr-1">{action.icon}</span>}
                    {action.label}
                  </>
                )}
              </Button>

              {isConfirming && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelConfirmation}
                  className="h-8 px-2"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Clear Selection */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        className={`text-muted-foreground hover:text-foreground ${variant === "compact" ? "h-8 px-2" : ""}`}
        title={clearSelectionLabel}
      >
        <X className="h-4 w-4" />
        {variant !== "compact" && <span className="ml-1">{clearSelectionLabel}</span>}
      </Button>
    </Card>
  );
}

// Predefined common actions
// eslint-disable-next-line react-refresh/only-export-components
export const bulkActions = {
  delete: (onClick: () => void): BulkAction => ({
    id: "delete",
    label: "Excluir",
    icon: <X className="h-4 w-4" />,
    variant: "destructive" as const,
    onClick,
    confirmationRequired: true,
    confirmationMessage: "Tem certeza que deseja excluir os itens selecionados?"
  }),

  edit: (onClick: () => void): BulkAction => ({
    id: "edit",
    label: "Editar",
    icon: <Check className="h-4 w-4" />,
    onClick
  }),

  activate: (onClick: () => void): BulkAction => ({
    id: "activate",
    label: "Ativar",
    onClick
  }),

  deactivate: (onClick: () => void): BulkAction => ({
    id: "deactivate",
    label: "Desativar",
    variant: "secondary" as const,
    onClick
  })
};

// Hook for managing bulk selection state
// eslint-disable-next-line react-refresh/only-export-components
export function useBulkSelection<T>(
  items: T[],
  getItemId: (item: T) => string = (item: T) => (item as T & { id: string }).id
) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const selectedItems = React.useMemo(() => {
    return items.filter(item => selectedIds.includes(getItemId(item)));
  }, [items, selectedIds, getItemId]);

  const isSelected = (item: T) => selectedIds.includes(getItemId(item));

  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < items.length;

  const toggleItem = (item: T) => {
    const itemId = getItemId(item);
    setSelectedIds(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(getItemId));
    }
  };

  const selectAll = () => {
    setSelectedIds(items.map(getItemId));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const setSelection = (ids: string[]) => {
    setSelectedIds(ids);
  };

  return {
    selectedIds,
    selectedItems,
    selectedCount: selectedIds.length,
    totalCount: items.length,
    isSelected,
    isAllSelected,
    isSomeSelected,
    toggleItem,
    toggleAll,
    selectAll,
    clearSelection,
    setSelection
  };
}