import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";

interface Store {
  id: string;
  name: string;
  active: boolean;
}

interface StoreSelectionCardProps {
  stores: Store[];
  selectedStores: string[];
  onSelectAllStores: (checked: boolean) => void;
  onSelectStore: (storeId: string, checked: boolean) => void;
}

export function StoreSelectionCard({
  stores,
  selectedStores,
  onSelectAllStores,
  onSelectStore
}: StoreSelectionCardProps) {
  const activeStores = stores.filter(store => store.active);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Package className="h-4 w-4" />
          Lojas ({selectedStores.length}/{stores.length})
        </CardTitle>
        <CardDescription className="text-xs">
          Selecione as lojas onde deseja aplicar as alterações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all-stores"
              checked={selectedStores.length === stores.length}
              onCheckedChange={onSelectAllStores}
            />
            <Label htmlFor="select-all-stores" className="text-sm font-medium">
              Selecionar todas ({stores.length})
            </Label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {activeStores.map(store => (
              <div key={store.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`store-${store.id}`}
                  checked={selectedStores.includes(store.id)}
                  onCheckedChange={(checked) => onSelectStore(store.id, !!checked)}
                />
                <Label htmlFor={`store-${store.id}`} className="text-sm">
                  {store.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}