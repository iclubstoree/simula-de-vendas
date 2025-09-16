import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";

type UpdateType = "percentage" | "fixed" | "custom_price";

interface Field {
  id: string;
  label: string;
  type: string;
}

interface FieldsConfigurationProps {
  updateType: UpdateType;
  fields: Field[];
  fieldsToUpdate: string[];
  cardValues: Record<string, string>;
  selectedItemsCount: number;
  selectedStoresCount?: number;
  totalStoresCount?: number;
  onFieldToggle: (fieldId: string, checked: boolean) => void;
  onFieldValueChange: (fieldId: string, value: string, fieldType: string) => void;
  getFieldDisplayName: (fieldId: string) => string;
}

export function FieldsConfiguration({
  updateType,
  fields,
  fieldsToUpdate,
  cardValues,
  selectedItemsCount,
  selectedStoresCount,
  totalStoresCount,
  onFieldToggle,
  onFieldValueChange,
  getFieldDisplayName
}: FieldsConfigurationProps) {
  if (updateType === "custom_price") {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-medium text-green-900">Edição Personalizada</h3>
            <p className="text-sm text-green-700">
              Clique em "Aplicar Edição" para abrir a tabela de edição personalizada
            </p>
            <p className="text-xs text-green-600">
              Você poderá editar preços individualmente por modelo e loja
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Fields Selection */}
      <div className="space-y-3">
        <Label>Campos para Atualizar</Label>
        <div className="space-y-3">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={field.id}
                  checked={fieldsToUpdate.includes(field.id)}
                  onCheckedChange={(checked) => onFieldToggle(field.id, checked as boolean)}
                />
                <Label htmlFor={field.id} className="text-sm font-medium">
                  {field.label}
                </Label>
              </div>

              {/* Show input when field is selected and we're in percentage or fixed mode */}
              {fieldsToUpdate.includes(field.id) && (updateType === "percentage" || updateType === "fixed") && (
                <div className="ml-6 space-y-1">
                  <Input
                    type="number"
                    step={updateType === "percentage" ? "0.1" : "0.01"}
                    placeholder={updateType === "percentage" ? "10" : "500"}
                    value={cardValues[field.id] || ""}
                    onChange={(e) => onFieldValueChange(field.id, e.target.value, field.type)}
                    className="w-32"
                  />
                  <p className="text-xs text-muted-foreground">
                    {updateType === "percentage"
                      ? "Ex: 10 (para +10%) - Use valores positivos para aumentar e negativos para diminuir"
                      : "Use valores positivos para somar e negativos para subtrair"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      {fieldsToUpdate.length > 0 && (
        <Card className="bg-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Resumo da Operação
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p><span className="font-medium">Itens:</span> {selectedItemsCount}</p>
            <p><span className="font-medium">Campos:</span> {fieldsToUpdate.map(field => getFieldDisplayName(field)).join(", ")}</p>
            <p><span className="font-medium">Tipo:</span> {
              updateType === "percentage" ? "Ajuste Percentual" :
              updateType === "fixed" ? "Ajuste Valor Fixo" :
              "Substituição de valores"
            }</p>
            {selectedStoresCount !== undefined && totalStoresCount !== undefined && (
              <p><span className="font-medium">Lojas:</span> {
                selectedStoresCount === totalStoresCount ? "Todas" :
                selectedStoresCount === 0 ? "Nenhuma selecionada" :
                `${selectedStoresCount} selecionadas`
              }</p>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}