import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { stores, formatCurrency, type TradeInDevice } from "@/data/mockData";

interface UniqueModel {
  id: string;
  modelId: string;
  name: string;
  castanhal?: TradeInDevice;
  belem?: TradeInDevice;
  ananindeua?: TradeInDevice;
}

interface TradeInTableProps {
  uniqueModels: UniqueModel[];
  onEditModel: (modelId: string, modelName: string) => void;
  onDeleteModel: (modelId: string) => void;
}

export function TradeInTable({
  uniqueModels,
  onEditModel,
  onDeleteModel
}: TradeInTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Aparelhos Configurados ({uniqueModels.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                {stores.filter(store => store.active).map(store => (
                  <>
                    <TableHead key={`min-${store.id}`}>Min {store.name}</TableHead>
                    <TableHead key={`max-${store.id}`}>Máx {store.name}</TableHead>
                  </>
                ))}
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uniqueModels.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-muted/50"
                >
                  <TableCell className="font-medium">
                    {item.name}
                  </TableCell>
                  {stores.filter(store => store.active).map(store => (
                    <>
                      <TableCell key={`min-${store.id}`}>
                        {item[store.id as keyof UniqueModel]
                          ? formatCurrency((item[store.id as keyof UniqueModel] as TradeInDevice).minValue)
                          : '-'
                        }
                      </TableCell>
                      <TableCell key={`max-${store.id}`}>
                        {item[store.id as keyof UniqueModel]
                          ? formatCurrency((item[store.id as keyof UniqueModel] as TradeInDevice).maxValue)
                          : '-'
                        }
                      </TableCell>
                    </>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditModel(item.modelId, item.name)}
                        title="Editar preços por loja"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDeleteModel(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {uniqueModels.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum aparelho encontrado</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}