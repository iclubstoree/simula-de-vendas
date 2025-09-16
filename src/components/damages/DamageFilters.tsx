import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { categories, type DamageType } from "@/data/mockData";

interface DamageFiltersProps {
  selectedCategory: string;
  selectedDamageFilter: string;
  damageTypes: DamageType[];
  onCategoryChange: (value: string) => void;
  onDamageFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

export function DamageFilters({
  selectedCategory,
  selectedDamageFilter,
  damageTypes,
  onCategoryChange,
  onDamageFilterChange,
  onClearFilters
}: DamageFiltersProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Filtros
          </CardTitle>
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="text-sm"
          >
            Limpar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Avaria</Label>
            <Select value={selectedDamageFilter} onValueChange={onDamageFilterChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Avarias</SelectItem>
                {damageTypes.map(damage => (
                  <SelectItem key={damage.id} value={damage.id}>
                    {damage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}