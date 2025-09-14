import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw, Calculator, Percent, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/data/mockData";

interface DamageBulkActionsToolbarProps {
  onApplyBulk: (value: number) => void;
  onApplyPercentage: (percentage: number, operation: 'increase' | 'decrease') => void;
  onReset: () => void;
}

export function DamageBulkActionsToolbar({
  onApplyBulk,
  onApplyPercentage,
  onReset
}: DamageBulkActionsToolbarProps) {
  const [bulkValue, setBulkValue] = useState("");
  const [percentageValue, setPercentageValue] = useState("");
  const { toast } = useToast();

  const applyBulkValue = () => {
    if (!bulkValue) return;
    const numValue = parseFloat(bulkValue) || 0;
    onApplyBulk(numValue);
    setBulkValue("");
  };

  const applyPercentageIncrease = () => {
    if (!percentageValue) return;
    const percentage = parseFloat(percentageValue) || 0;
    onApplyPercentage(percentage, 'increase');
    setPercentageValue("");
  };

  const applyPercentageDecrease = () => {
    if (!percentageValue) return;
    const percentage = parseFloat(percentageValue) || 0;
    onApplyPercentage(percentage, 'decrease');
    setPercentageValue("");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Ações em Massa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 items-end">
          {/* Fixed Value Application */}
          <div className="flex gap-2 items-end">
            <div className="space-y-1">
              <Label className="text-xs">Valor Fixo</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                className="w-32"
              />
            </div>
            <Button onClick={applyBulkValue} disabled={!bulkValue} size="sm">
              <Calculator className="h-4 w-4 mr-1" />
              Aplicar Tudo
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-10" />
          
          {/* Percentage Operations */}
          <div className="flex gap-2 items-end">
            <div className="space-y-1">
              <Label className="text-xs">Percentual</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="10.0"
                value={percentageValue}
                onChange={(e) => setPercentageValue(e.target.value)}
                className="w-24"
              />
            </div>
            <Button 
              onClick={applyPercentageIncrease} 
              disabled={!percentageValue} 
              size="sm"
              variant="outline"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              +{percentageValue || '0'}%
            </Button>
            <Button 
              onClick={applyPercentageDecrease} 
              disabled={!percentageValue} 
              size="sm"
              variant="outline"
            >
              <TrendingDown className="h-4 w-4 mr-1" />
              -{percentageValue || '0'}%
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-10" />
          
          {/* Reset Button */}
          <Button onClick={onReset} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-1" />
            Restaurar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}