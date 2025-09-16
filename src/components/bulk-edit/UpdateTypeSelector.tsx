import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";

type UpdateType = "percentage" | "fixed" | "custom_price";

interface UpdateTypeSelectorProps {
  updateType: UpdateType;
  onUpdateTypeChange: (type: UpdateType) => void;
  showCustomPrice?: boolean;
}

export function UpdateTypeSelector({
  updateType,
  onUpdateTypeChange,
  showCustomPrice = false
}: UpdateTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Tipo de Atualização</Label>
      <div className={`grid gap-4 ${showCustomPrice ? "grid-cols-3" : "grid-cols-2"}`}>
        <Card
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            updateType === "percentage"
              ? "ring-2 ring-green-500 bg-green-50 border-green-200"
              : "hover:border-primary/50"
          }`}
          onClick={() => onUpdateTypeChange("percentage")}
        >
          <CardContent className="py-6 px-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">%</div>
            <div className="text-xs font-medium text-gray-700">Percentual</div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            updateType === "fixed"
              ? "ring-2 ring-green-500 bg-green-50 border-green-200"
              : "hover:border-primary/50"
          }`}
          onClick={() => onUpdateTypeChange("fixed")}
        >
          <CardContent className="py-6 px-4 text-center">
            <div className="text-2xl font-bold text-gray-700 mb-2">R$</div>
            <div className="text-xs font-medium text-gray-700">Valor Fixo</div>
          </CardContent>
        </Card>

        {showCustomPrice && (
          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              updateType === "custom_price"
                ? "ring-2 ring-green-500 bg-green-50 border-green-200"
                : "hover:border-primary/50"
            }`}
            onClick={() => onUpdateTypeChange("custom_price")}
          >
            <CardContent className="py-6 px-4 text-center">
              <Edit className="h-6 w-6 mx-auto text-gray-600 mb-2" />
              <div className="text-xs font-medium text-gray-700">
                Valores<br />Personalizados
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}