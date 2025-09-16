import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface SelectedFiltersDisplayProps {
  selectedStores: string[];
  selectedSellers: string[];
  selectedBrands: string[];
  selectedPaymentMethods: string[];
  selectedConditions: string[];
  storeOptions: FilterOption[];
  sellerOptions: FilterOption[];
  brandOptions: FilterOption[];
  paymentMethodOptions: FilterOption[];
  conditionOptions: FilterOption[];
  onRemoveStore: (value: string) => void;
  onRemoveSeller: (value: string) => void;
  onRemoveBrand: (value: string) => void;
  onRemovePaymentMethod: (value: string) => void;
  onRemoveCondition: (value: string) => void;
  hasActiveFilters: boolean;
}

export function SelectedFiltersDisplay({
  selectedStores,
  selectedSellers,
  selectedBrands,
  selectedPaymentMethods,
  selectedConditions,
  storeOptions,
  sellerOptions,
  brandOptions,
  paymentMethodOptions,
  conditionOptions,
  onRemoveStore,
  onRemoveSeller,
  onRemoveBrand,
  onRemovePaymentMethod,
  onRemoveCondition,
  hasActiveFilters
}: SelectedFiltersDisplayProps) {
  const getFilterLabel = (options: FilterOption[], value: string) => {
    return options.find(option => option.value === value)?.label || value;
  };

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">Filtros selecionados:</Label>
      <div className="flex flex-wrap gap-1">
        {selectedStores.map((store) => (
          <Badge key={`store-${store}`} variant="secondary" className="flex items-center gap-1">
            {getFilterLabel(storeOptions, store)}
            <Button
              variant="ghost"
              size="sm"
              className="h-3 w-3 p-0 hover:bg-transparent"
              onClick={() => onRemoveStore(store)}
            >
              <X className="h-2 w-2" />
            </Button>
          </Badge>
        ))}
        {selectedSellers.map((seller) => (
          <Badge key={`seller-${seller}`} variant="secondary" className="flex items-center gap-1">
            {getFilterLabel(sellerOptions, seller)}
            <Button
              variant="ghost"
              size="sm"
              className="h-3 w-3 p-0 hover:bg-transparent"
              onClick={() => onRemoveSeller(seller)}
            >
              <X className="h-2 w-2" />
            </Button>
          </Badge>
        ))}
        {selectedBrands.map((brand) => (
          <Badge key={`brand-${brand}`} variant="secondary" className="flex items-center gap-1">
            {getFilterLabel(brandOptions, brand)}
            <Button
              variant="ghost"
              size="sm"
              className="h-3 w-3 p-0 hover:bg-transparent"
              onClick={() => onRemoveBrand(brand)}
            >
              <X className="h-2 w-2" />
            </Button>
          </Badge>
        ))}
        {selectedPaymentMethods.map((payment) => (
          <Badge key={`payment-${payment}`} variant="secondary" className="flex items-center gap-1">
            {getFilterLabel(paymentMethodOptions, payment)}
            <Button
              variant="ghost"
              size="sm"
              className="h-3 w-3 p-0 hover:bg-transparent"
              onClick={() => onRemovePaymentMethod(payment)}
            >
              <X className="h-2 w-2" />
            </Button>
          </Badge>
        ))}
        {selectedConditions.map((condition) => (
          <Badge key={`condition-${condition}`} variant="secondary" className="flex items-center gap-1">
            {getFilterLabel(conditionOptions, condition)}
            <Button
              variant="ghost"
              size="sm"
              className="h-3 w-3 p-0 hover:bg-transparent"
              onClick={() => onRemoveCondition(condition)}
            >
              <X className="h-2 w-2" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}