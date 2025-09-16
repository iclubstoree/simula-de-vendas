import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, Search, X, Check } from "lucide-react";

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
  group?: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

export interface MultiSelectFilterProps {
  options: FilterOption[] | FilterGroup[];
  selectedValues: string[];
  onSelectionChange: (selectedValues: string[]) => void;

  // Configuration
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  maxDisplayedItems?: number;
  allowSearch?: boolean;
  allowSelectAll?: boolean;
  closeOnSelect?: boolean;

  // Labels
  selectAllLabel?: string;
  clearAllLabel?: string;
  selectedLabel?: string;

  // Styling
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  variant?: "default" | "compact";

  // Custom rendering
  renderTrigger?: (selectedCount: number, totalCount: number) => React.ReactNode;
  renderOption?: (option: FilterOption, isSelected: boolean) => React.ReactNode;
}

export function MultiSelectFilter({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Selecionar itens",
  searchPlaceholder = "Pesquisar...",
  emptyMessage = "Nenhum item encontrado",
  maxDisplayedItems = 3,
  allowSearch = true,
  allowSelectAll = true,
  closeOnSelect = false,
  selectAllLabel = "Selecionar todos",
  clearAllLabel = "Limpar tudo",
  selectedLabel = "selecionado(s)",
  className = "",
  triggerClassName = "",
  contentClassName = "",
  variant = "default",
  renderTrigger,
  renderOption
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Normalize options to flat array
  const flatOptions = React.useMemo(() => {
    return options.reduce<FilterOption[]>((acc, item) => {
      if ('options' in item) {
        // It's a group
        return [...acc, ...item.options];
      } else {
        // It's a single option
        return [...acc, item];
      }
    }, []);
  }, [options]);

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return options;
    }

    const query = searchQuery.toLowerCase();

    if (options.length > 0 && 'options' in options[0]) {
      // Grouped options
      return (options as FilterGroup[]).map(group => ({
        ...group,
        options: group.options.filter(option =>
          option.label.toLowerCase().includes(query) ||
          option.value.toLowerCase().includes(query) ||
          option.description?.toLowerCase().includes(query)
        )
      })).filter(group => group.options.length > 0);
    } else {
      // Flat options
      return (options as FilterOption[]).filter(option =>
        option.label.toLowerCase().includes(query) ||
        option.value.toLowerCase().includes(query) ||
        option.description?.toLowerCase().includes(query)
      );
    }
  }, [options, searchQuery]);

  const selectedCount = selectedValues.length;
  const totalCount = flatOptions.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  const handleOptionToggle = (optionValue: string) => {
    const newSelectedValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(value => value !== optionValue)
      : [...selectedValues, optionValue];

    onSelectionChange(newSelectedValues);

    if (closeOnSelect) {
      setOpen(false);
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(flatOptions.map(option => option.value));
    }
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  // Default trigger renderer
  const defaultRenderTrigger = () => {
    if (selectedCount === 0) {
      return (
        <span className="text-muted-foreground font-normal">
          {placeholder}
        </span>
      );
    }

    if (selectedCount <= maxDisplayedItems) {
      const selectedOptions = flatOptions.filter(option =>
        selectedValues.includes(option.value)
      );

      return (
        <div className="flex items-center gap-1 flex-wrap">
          {selectedOptions.slice(0, maxDisplayedItems).map(option => (
            <Badge key={option.id} variant="secondary" className="text-xs">
              {option.label}
            </Badge>
          ))}
          {selectedCount > maxDisplayedItems && (
            <Badge variant="outline" className="text-xs">
              +{selectedCount - maxDisplayedItems}
            </Badge>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Badge variant="default" className="text-xs">
          {selectedCount} {selectedLabel}
        </Badge>
        <span className="text-sm text-muted-foreground">
          de {totalCount}
        </span>
      </div>
    );
  };

  // Default option renderer
  const defaultRenderOption = (option: FilterOption, isSelected: boolean) => (
    <div className="flex items-center space-x-2 w-full">
      <Checkbox checked={isSelected} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{option.label}</div>
        {option.description && (
          <div className="text-xs text-muted-foreground truncate">
            {option.description}
          </div>
        )}
      </div>
    </div>
  );

  // Render individual option
  const renderSingleOption = (option: FilterOption) => {
    const isSelected = selectedValues.includes(option.value);

    return (
      <div
        key={option.id}
        className={`flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer ${
          option.disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => !option.disabled && handleOptionToggle(option.value)}
      >
        {renderOption ? renderOption(option, isSelected) : defaultRenderOption(option, isSelected)}
      </div>
    );
  };

  const isCompact = variant === "compact";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`justify-between h-auto min-h-9 ${isCompact ? 'px-2 py-1' : 'px-3 py-2'} ${triggerClassName}`}
          onClick={() => setOpen(!open)}
        >
          <div className="flex-1 text-left">
            {renderTrigger ? renderTrigger(selectedCount, totalCount) : defaultRenderTrigger()}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className={`w-80 p-0 ${contentClassName}`} align="start">
        <div className="space-y-2 p-3">
          {/* Search */}
          {allowSearch && (
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          )}

          {/* Actions */}
          {allowSelectAll && (
            <div className="flex items-center justify-between border-b pb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="h-auto p-1"
              >
                <Check className="h-3 w-3 mr-1" />
                {isAllSelected ? clearAllLabel : selectAllLabel}
              </Button>

              {selectedCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-auto p-1 text-muted-foreground"
                >
                  <X className="h-3 w-3 mr-1" />
                  {clearAllLabel}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Options */}
        <ScrollArea className="max-h-60">
          <div className="p-1">
            {filteredOptions.length === 0 ? (
              <div className="text-center text-muted-foreground py-4 text-sm">
                {emptyMessage}
              </div>
            ) : (
              <>
                {/* Render grouped or flat options */}
                {filteredOptions.map((item) => {
                  if ('options' in item) {
                    // It's a group
                    const group = item as FilterGroup;
                    return (
                      <div key={group.id} className="mb-2">
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {group.label}
                        </div>
                        {group.options.map(renderSingleOption)}
                      </div>
                    );
                  } else {
                    // It's a single option
                    return renderSingleOption(item as FilterOption);
                  }
                })}
              </>
            )}
          </div>
        </ScrollArea>

        {/* Selection summary */}
        {selectedCount > 0 && (
          <div className="border-t p-2 text-xs text-muted-foreground text-center">
            {selectedCount} de {totalCount} {selectedLabel}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// Utility functions
// eslint-disable-next-line react-refresh/only-export-components
export const createFilterOption = (
  id: string,
  label: string,
  value: string,
  options: Partial<FilterOption> = {}
): FilterOption => ({
  id,
  label,
  value,
  ...options
});

// eslint-disable-next-line react-refresh/only-export-components
export const createFilterGroup = (
  id: string,
  label: string,
  options: FilterOption[]
): FilterGroup => ({
  id,
  label,
  options
});