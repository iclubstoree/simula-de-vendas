import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface PeriodFilterProps {
  selectedPeriod: string;
  customDateRange: DateRange;
  onPeriodChange: (value: string) => void;
  onCustomDateRangeChange: (range: DateRange) => void;
}

export function PeriodFilter({
  selectedPeriod,
  customDateRange,
  onPeriodChange,
  onCustomDateRangeChange
}: PeriodFilterProps) {
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);

  const handlePeriodChange = (value: string) => {
    onPeriodChange(value);
    if (value !== "personalizado") {
      onCustomDateRangeChange({ from: undefined, to: undefined });
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
                    onCustomDateRangeChange({ from: range.from, to: range.to });
                  } else {
                    onCustomDateRangeChange({ from: undefined, to: undefined });
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
  );
}