import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface FilterGroupProps {
  title: string;
  icon: LucideIcon;
  options: FilterOption[];
  selectedValues: string[];
  onSelectionChange: (value: string, currentSelection: string[], setSelection: (selection: string[]) => void) => void;
  setSelection: (selection: string[]) => void;
  placeholder: string;
}

export function FilterGroup({
  title,
  icon: Icon,
  options,
  selectedValues,
  onSelectionChange,
  setSelection,
  placeholder
}: FilterGroupProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground">
        <Icon className="inline h-3 w-3 mr-1" />
        {title}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {selectedValues.length === 0 ? placeholder : `${selectedValues.length} selecionada(s)`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${title.toLowerCase()}-${option.id}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={() => onSelectionChange(option.value, selectedValues, setSelection)}
                />
                <Label htmlFor={`${title.toLowerCase()}-${option.id}`} className="text-sm font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}