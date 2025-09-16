import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import { categories, formatCurrency, type Subcategory, type DamageType } from "@/data/mockData";

interface DamageMatrixProps {
  subcategories: Subcategory[];
  damageTypes: DamageType[];
  selectedItems: DamageType[];
  getMatrixValue: (subcategoryId: string, damageTypeId: string) => number;
  onCellEdit: (subcategoryId: string, damageTypeId: string, value: number) => void;
  onEditDamage: (damage: DamageType) => void;
  onDeleteDamage: (damageId: string) => void;
  onEditAllForModel: (subcategoryId: string) => void;
}

export function DamageMatrix({
  subcategories,
  damageTypes,
  selectedItems,
  getMatrixValue,
  onCellEdit,
  onEditDamage,
  onDeleteDamage,
  onEditAllForModel
}: DamageMatrixProps) {
  const [editingCell, setEditingCell] = useState<{subcategoryId: string, damageTypeId: string} | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleCellClick = (subcategoryId: string, damageTypeId: string) => {
    const currentValue = getMatrixValue(subcategoryId, damageTypeId);
    setEditingCell({ subcategoryId, damageTypeId });
    setEditValue(currentValue.toString());
  };

  const handleCellSave = () => {
    if (!editingCell) return;

    const value = parseFloat(editValue) || 0;
    if (value < 0) return;

    onCellEdit(editingCell.subcategoryId, editingCell.damageTypeId, value);
    setEditingCell(null);
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue("");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Gerenciar Matriz de Avarias
          </CardTitle>
          <div className="flex items-center gap-2">
            {selectedItems.length > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                {selectedItems.length} selecionadas
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Subcategoria</TableHead>
                {damageTypes.map((damage) => (
                  <TableHead key={damage.id} className="text-center min-w-[120px]">
                    <div className="space-y-1">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-medium">{damage.name}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEditDamage(damage)}
                            title="Editar avaria"
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteDamage(damage.id)}
                            title="Excluir avaria"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subcategories.map((subcategory) => (
                <TableRow key={subcategory.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div>{subcategory.name}</div>
                      <Badge variant="outline" className="text-xs">
                        {categories.find(c => c.id === subcategory.categoryId)?.name}
                      </Badge>
                    </div>
                  </TableCell>
                  {damageTypes.map((damage) => (
                    <TableCell key={`${subcategory.id}-${damage.id}`} className="text-center">
                      {editingCell?.subcategoryId === subcategory.id &&
                       editingCell?.damageTypeId === damage.id ? (
                        <div className="flex gap-1">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleCellSave();
                              if (e.key === 'Escape') handleCellCancel();
                            }}
                            className="w-20 h-8 text-center"
                            autoFocus
                          />
                          <Button size="sm" onClick={handleCellSave} className="h-8 w-8 p-0">
                            ✓
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleCellClick(subcategory.id, damage.id)}
                          className="w-full p-2 rounded hover:bg-muted/50 cursor-pointer"
                        >
                          {formatCurrency(getMatrixValue(subcategory.id, damage.id))}
                        </button>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    <div className="flex gap-1 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditAllForModel(subcategory.id)}
                        title="Editar todas as avarias desta subcategoria"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {subcategories.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhuma subcategoria encontrada para a categoria selecionada
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}