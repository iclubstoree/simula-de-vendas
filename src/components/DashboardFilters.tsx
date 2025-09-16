import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Filter,
  Store,
  User,
  Smartphone,
  CreditCard,
  Package
} from "lucide-react";
import { useFilters } from "@/contexts/FiltersContext";
import { PeriodFilter } from "./filters/PeriodFilter";
import { SelectedFiltersDisplay } from "./filters/SelectedFiltersDisplay";
import { FilterGroup } from "./filters/FilterGroup";

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export function DashboardFilters() {
  const {
    selectedStores,
    selectedSellers,
    selectedBrands,
    selectedPaymentMethods,
    selectedConditions,
    selectedPeriod,
    customDateRange,
    setSelectedStores,
    setSelectedSellers,
    setSelectedBrands,
    setSelectedPaymentMethods,
    setSelectedConditions,
    setSelectedPeriod,
    setCustomDateRange,
    clearAllFilters,
    hasActiveFilters
  } = useFilters();


  const storeOptions: FilterOption[] = [
    { id: "castanhal", label: "Castanhal", value: "castanhal" },
    { id: "belem", label: "Belém", value: "belem" },
    { id: "ananindeua", label: "Ananindeua", value: "ananindeua" },
  ];

  const sellerOptions: FilterOption[] = [
    { id: "ana", label: "Ana Silva", value: "ana" },
    { id: "carlos", label: "Carlos Santos", value: "carlos" },
    { id: "maria", label: "Maria Oliveira", value: "maria" },
    { id: "joao", label: "João Santos", value: "joao" },
    { id: "pedro", label: "Pedro Lima", value: "pedro" },
  ];

  const brandOptions: FilterOption[] = [
    { id: "iphone", label: "iPhone", value: "iphone" },
    { id: "samsung", label: "Samsung", value: "samsung" },
    { id: "xiaomi", label: "Xiaomi", value: "xiaomi" },
    { id: "motorola", label: "Motorola", value: "motorola" },
  ];

  const paymentMethodOptions: FilterOption[] = [
    { id: "debito", label: "Débito", value: "debito" },
    { id: "1x", label: "1x", value: "1x" },
    { id: "3x", label: "3x", value: "3x" },
    { id: "6x", label: "6x", value: "6x" },
    { id: "10x", label: "10x", value: "10x" },
    { id: "12x", label: "12x", value: "12x" },
    { id: "18x", label: "18x", value: "18x" },
    { id: "24x", label: "24x", value: "24x" },
  ];

  const conditionOptions: FilterOption[] = [
    { id: "novo", label: "Novo", value: "novo" },
    { id: "seminovo", label: "Seminovo", value: "seminovo" },
  ];


  const handleMultiSelect = (
    value: string,
    currentSelection: string[],
    setSelection: (selection: string[]) => void
  ) => {
    if (currentSelection.includes(value)) {
      setSelection(currentSelection.filter(item => item !== value));
    } else {
      setSelection([...currentSelection, value]);
    }
  };

  const removeFilter = (
    value: string,
    currentSelection: string[],
    setSelection: (selection: string[]) => void
  ) => {
    setSelection(currentSelection.filter(item => item !== value));
  };

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    if (value !== "personalizado") {
      setCustomDateRange({ from: undefined, to: undefined });
    }
  };


  return (
    <Card className="p-4 space-y-4 card-animate hover-float">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Filtros</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearAllFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          Limpar filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Período */}
        <PeriodFilter
          selectedPeriod={selectedPeriod}
          customDateRange={customDateRange}
          onPeriodChange={handlePeriodChange}
          onCustomDateRangeChange={setCustomDateRange}
        />

        {/* Lojas */}
        <FilterGroup
          title="LOJAS"
          icon={Store}
          options={storeOptions}
          selectedValues={selectedStores}
          onSelectionChange={handleMultiSelect}
          setSelection={setSelectedStores}
          placeholder="Selecionar lojas"
        />

        {/* Vendedores */}
        <FilterGroup
          title="VENDEDORES"
          icon={User}
          options={sellerOptions}
          selectedValues={selectedSellers}
          onSelectionChange={handleMultiSelect}
          setSelection={setSelectedSellers}
          placeholder="Selecionar vendedores"
        />

        {/* Marcas */}
        <FilterGroup
          title="MARCAS"
          icon={Smartphone}
          options={brandOptions}
          selectedValues={selectedBrands}
          onSelectionChange={handleMultiSelect}
          setSelection={setSelectedBrands}
          placeholder="Selecionar marcas"
        />

        {/* Forma de Pagamento */}
        <FilterGroup
          title="FORMA DE PAGAMENTO"
          icon={CreditCard}
          options={paymentMethodOptions}
          selectedValues={selectedPaymentMethods}
          onSelectionChange={handleMultiSelect}
          setSelection={setSelectedPaymentMethods}
          placeholder="Selecionar pagamento"
        />

        {/* Condição */}
        <FilterGroup
          title="CONDIÇÃO"
          icon={Package}
          options={conditionOptions}
          selectedValues={selectedConditions}
          onSelectionChange={handleMultiSelect}
          setSelection={setSelectedConditions}
          placeholder="Selecionar condição"
        />
      </div>

      {/* Selected Filters Display */}
      <SelectedFiltersDisplay
        selectedStores={selectedStores}
        selectedSellers={selectedSellers}
        selectedBrands={selectedBrands}
        selectedPaymentMethods={selectedPaymentMethods}
        selectedConditions={selectedConditions}
        storeOptions={storeOptions}
        sellerOptions={sellerOptions}
        brandOptions={brandOptions}
        paymentMethodOptions={paymentMethodOptions}
        conditionOptions={conditionOptions}
        onRemoveStore={(value) => removeFilter(value, selectedStores, setSelectedStores)}
        onRemoveSeller={(value) => removeFilter(value, selectedSellers, setSelectedSellers)}
        onRemoveBrand={(value) => removeFilter(value, selectedBrands, setSelectedBrands)}
        onRemovePaymentMethod={(value) => removeFilter(value, selectedPaymentMethods, setSelectedPaymentMethods)}
        onRemoveCondition={(value) => removeFilter(value, selectedConditions, setSelectedConditions)}
        hasActiveFilters={hasActiveFilters()}
      />
    </Card>
  );
}