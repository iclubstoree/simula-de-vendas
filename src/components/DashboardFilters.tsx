import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  Store,
  User,
  Smartphone,
  CreditCard,
  Package,
  DollarSign,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useFilters } from "@/contexts/FiltersContext";

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

  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);

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

  const getFilterLabel = (options: FilterOption[], value: string) => {
    return options.find(option => option.value === value)?.label || value;
  };

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    if (value !== "personalizado") {
      setCustomDateRange({ from: undefined, to: undefined });
    }
  };

  const formatDateRange = () => {
    if (!customDateRange.from) return "Selecionar período";
    if (!customDateRange.to) {
      return format(customDateRange.from, "dd/MM/yyyy", { locale: ptBR });
    }
    return `${format(customDateRange.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(customDateRange.to, "dd/MM/yyyy", { locale: ptBR })}`;
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
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            <Clock className="inline h-3 w-3 mr-1" />
            PERÍODO
          </Label>
          <div className="space-y-2">
            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hoje">Hoje</SelectItem>
                <SelectItem value="ontem">Ontem</SelectItem>
                <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="90dias">Últimos 90 dias</SelectItem>
                <SelectItem value="personalizado">Período personalizado</SelectItem>
              </SelectContent>
            </Select>
            
            {selectedPeriod === "personalizado" && (
              <Popover open={isCustomDateOpen} onOpenChange={setIsCustomDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !customDateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateRange()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{
                      from: customDateRange.from,
                      to: customDateRange.to,
                    }}
                    onSelect={(range) => {
                      if (range) {
                        setCustomDateRange({ from: range.from, to: range.to });
                      } else {
                        setCustomDateRange({ from: undefined, to: undefined });
                      }
                    }}
                    numberOfMonths={2}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {/* Lojas */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            <Store className="inline h-3 w-3 mr-1" />
            LOJAS
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {selectedStores.length === 0 ? "Selecionar lojas" : `${selectedStores.length} selecionada(s)`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="space-y-2">
                {storeOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`store-${option.id}`}
                      checked={selectedStores.includes(option.value)}
                      onCheckedChange={() => handleMultiSelect(option.value, selectedStores, setSelectedStores)}
                    />
                    <Label htmlFor={`store-${option.id}`} className="text-sm font-normal">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Vendedores */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            <User className="inline h-3 w-3 mr-1" />
            VENDEDORES
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {selectedSellers.length === 0 ? "Selecionar vendedores" : `${selectedSellers.length} selecionado(s)`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="space-y-2">
                {sellerOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`seller-${option.id}`}
                      checked={selectedSellers.includes(option.value)}
                      onCheckedChange={() => handleMultiSelect(option.value, selectedSellers, setSelectedSellers)}
                    />
                    <Label htmlFor={`seller-${option.id}`} className="text-sm font-normal">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Marcas */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            <Smartphone className="inline h-3 w-3 mr-1" />
            MARCAS
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {selectedBrands.length === 0 ? "Selecionar marcas" : `${selectedBrands.length} selecionada(s)`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="space-y-2">
                {brandOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${option.id}`}
                      checked={selectedBrands.includes(option.value)}
                      onCheckedChange={() => handleMultiSelect(option.value, selectedBrands, setSelectedBrands)}
                    />
                    <Label htmlFor={`brand-${option.id}`} className="text-sm font-normal">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Forma de Pagamento */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            <CreditCard className="inline h-3 w-3 mr-1" />
            FORMA DE PAGAMENTO
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {selectedPaymentMethods.length === 0 ? "Selecionar pagamento" : `${selectedPaymentMethods.length} selecionada(s)`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="space-y-2">
                {paymentMethodOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`payment-${option.id}`}
                      checked={selectedPaymentMethods.includes(option.value)}
                      onCheckedChange={() => handleMultiSelect(option.value, selectedPaymentMethods, setSelectedPaymentMethods)}
                    />
                    <Label htmlFor={`payment-${option.id}`} className="text-sm font-normal">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Condição */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            <Package className="inline h-3 w-3 mr-1" />
            CONDIÇÃO
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {selectedConditions.length === 0 ? "Selecionar condição" : `${selectedConditions.length} selecionada(s)`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="space-y-2">
                {conditionOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`condition-${option.id}`}
                      checked={selectedConditions.includes(option.value)}
                      onCheckedChange={() => handleMultiSelect(option.value, selectedConditions, setSelectedConditions)}
                    />
                    <Label htmlFor={`condition-${option.id}`} className="text-sm font-normal">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Selected Filters Display - All in one line */}
      {hasActiveFilters() && (
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
                  onClick={() => removeFilter(store, selectedStores, setSelectedStores)}
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
                  onClick={() => removeFilter(seller, selectedSellers, setSelectedSellers)}
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
                  onClick={() => removeFilter(brand, selectedBrands, setSelectedBrands)}
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
                  onClick={() => removeFilter(payment, selectedPaymentMethods, setSelectedPaymentMethods)}
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
                  onClick={() => removeFilter(condition, selectedConditions, setSelectedConditions)}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}