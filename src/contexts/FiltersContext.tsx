import { createContext, useContext, useState, ReactNode } from "react";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface FiltersContextType {
  selectedStores: string[];
  selectedSellers: string[];
  selectedBrands: string[];
  selectedPaymentMethods: string[];
  selectedConditions: string[];
  selectedPeriod: string;
  customDateRange: DateRange;
  
  setSelectedStores: (stores: string[]) => void;
  setSelectedSellers: (sellers: string[]) => void;
  setSelectedBrands: (brands: string[]) => void;
  setSelectedPaymentMethods: (methods: string[]) => void;
  setSelectedConditions: (conditions: string[]) => void;
  setSelectedPeriod: (period: string) => void;
  setCustomDateRange: (range: DateRange) => void;
  
  clearAllFilters: () => void;
  hasActiveFilters: () => boolean;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("7dias");
  const [customDateRange, setCustomDateRange] = useState<DateRange>({ from: undefined, to: undefined });

  const clearAllFilters = () => {
    setSelectedStores([]);
    setSelectedSellers([]);
    setSelectedBrands([]);
    setSelectedPaymentMethods([]);
    setSelectedConditions([]);
    setSelectedPeriod("7dias");
    setCustomDateRange({ from: undefined, to: undefined });
  };

  const hasActiveFilters = () => {
    return selectedStores.length > 0 ||
           selectedSellers.length > 0 ||
           selectedBrands.length > 0 ||
           selectedPaymentMethods.length > 0 ||
           selectedConditions.length > 0 ||
           selectedPeriod !== "7dias" ||
           customDateRange.from !== undefined;
  };

  return (
    <FiltersContext.Provider value={{
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
    }}>
      {children}
    </FiltersContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFilters() {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
}