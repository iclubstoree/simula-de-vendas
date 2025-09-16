import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { stores, formatCurrency, type PhoneModel } from "@/data/mockData";

interface ModelTableProps {
  filteredModels: PhoneModel[];
  isLoading?: boolean;
  error?: unknown;
  onEditModel: (model: PhoneModel) => void;
  onToggleModelActive: (modelId: string) => void;
  onDeleteModel: (modelId: string) => void;
}

export function ModelTable({
  filteredModels,
  isLoading,
  error,
  onEditModel,
  onToggleModelActive,
  onDeleteModel
}: ModelTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Modelos Cadastrados ({filteredModels.length})
          {isLoading && <span className="text-sm text-muted-foreground ml-2">(Carregando...)</span>}
          {error && <span className="text-sm text-destructive ml-2">(Erro ao carregar)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Subcategoria</TableHead>
                <TableHead>Tipo</TableHead>
                {stores.filter(store => store.active).map(store => (
                  <TableHead key={store.id}>Preço {store.name}</TableHead>
                ))}
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModels.map((model) => (
                <TableRow key={model.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{model.name}</TableCell>
                  <TableCell>{model.category}</TableCell>
                  <TableCell>{model.subcategory}</TableCell>
                  <TableCell>
                    <Badge variant={model.type === 'novo' ? 'default' : 'secondary'}>
                      {model.type === 'novo' ? 'Novo' : 'Seminovo'}
                    </Badge>
                  </TableCell>
                  {stores.filter(store => store.active).map(store => (
                    <TableCell key={store.id}>
                      {model.prices[store.id as keyof typeof model.prices]
                        ? formatCurrency(model.prices[store.id as keyof typeof model.prices]!)
                        : '-'
                      }
                    </TableCell>
                  ))}
                  <TableCell>
                    <Badge variant={model.active ? 'default' : 'secondary'}>
                      {model.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditModel(model)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onToggleModelActive(model.id)}
                      >
                        {model.active ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDeleteModel(model.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredModels.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum modelo encontrado</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}