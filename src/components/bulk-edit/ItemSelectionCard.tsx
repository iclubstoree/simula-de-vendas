import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";

interface BulkEditItem {
  id: string;
  name: string;
}

interface ItemSelectionCardProps {
  title: string;
  availableItems: BulkEditItem[];
  selectedItems: BulkEditItem[];
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (item: BulkEditItem, checked: boolean) => void;
}

export function ItemSelectionCard({
  title,
  availableItems,
  selectedItems,
  onSelectAll,
  onSelectItem
}: ItemSelectionCardProps) {
  const isAllSelected = selectedItems.length === availableItems.length && availableItems.length > 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Package className="h-4 w-4" />
          Selecionar {title}
        </CardTitle>
        <CardDescription className="text-xs">
          Escolha quais itens deseja editar em massa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all-internal"
              checked={isAllSelected}
              onCheckedChange={onSelectAll}
              aria-label="Selecionar todos os itens"
            />
            <Label htmlFor="select-all-internal" className="text-sm font-medium">
              Selecionar todos ({availableItems.length})
            </Label>
          </div>

          <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-1">
            {availableItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`item-${item.id}`}
                  checked={selectedItems.some(selected => selected.id === item.id)}
                  onCheckedChange={(checked) => onSelectItem(item, !!checked)}
                />
                <Label htmlFor={`item-${item.id}`} className="text-sm">
                  {item.name}
                </Label>
              </div>
            ))}
          </div>

          {selectedItems.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {selectedItems.length} de {availableItems.length} itens selecionados
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}