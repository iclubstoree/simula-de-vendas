import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

interface BulkEditItem {
  id: string;
  name: string;
}

interface SelectedItemsSummaryCardProps {
  selectedItems: BulkEditItem[];
}

export function SelectedItemsSummaryCard({ selectedItems }: SelectedItemsSummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Package className="h-4 w-4" />
          Itens Selecionados ({selectedItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
          {selectedItems.slice(0, 10).map((item, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {item.name || item.id}
            </Badge>
          ))}
          {selectedItems.length > 10 && (
            <Badge variant="secondary" className="text-xs">
              +{selectedItems.length - 10} mais
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}