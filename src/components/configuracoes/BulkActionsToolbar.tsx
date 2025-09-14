import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, RotateCcw, Calculator, Percent, TrendingUp, TrendingDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency, type Store } from "@/data/mockData";

function CopyStoresSection({ storeNames, onCopyBetweenStores }: { 
  storeNames: Store[], 
  onCopyBetweenStores: (sourceStoreId: string, targetStoreId: string) => void 
}) {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingCopy, setPendingCopy] = useState<{source: string, target: string} | null>(null);

  const handleStoreClick = (storeId: string) => {
    if (selectedSource === storeId) {
      setSelectedSource(null);
    } else {
      setSelectedSource(storeId);
    }
  };

  const handleTargetSelect = (targetId: string) => {
    if (!selectedSource) return;
    setPendingCopy({ source: selectedSource, target: targetId });
    setShowConfirm(true);
  };

  const confirmCopy = () => {
    if (pendingCopy) {
      onCopyBetweenStores(pendingCopy.source, pendingCopy.target);
      setSelectedSource(null);
      setPendingCopy(null);
      setShowConfirm(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm text-muted-foreground">Copiar entre lojas:</span>
      
      {/* Source Store Selection */}
      <div className="flex gap-1">
        {storeNames.map(store => (
          <Button
            key={store.id}
            variant={selectedSource === store.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleStoreClick(store.id)}
            className="capitalize"
          >
            <Copy className="h-3 w-3 mr-1" />
            {store.name}
          </Button>
        ))}
      </div>

      {/* Target Selection */}
      {selectedSource && (
        <div className="flex gap-1 ml-2">
          <span className="text-xs text-muted-foreground self-center">→ Para:</span>
          {storeNames
            .filter(s => s.id !== selectedSource)
            .map(targetStore => (
              <Button
                key={targetStore.id}
                variant="secondary"
                size="sm"
                onClick={() => handleTargetSelect(targetStore.id)}
                className="capitalize"
              >
                {targetStore.name}
              </Button>
            ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && pendingCopy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-4 rounded-lg border shadow-lg">
            <p className="mb-4">Copiar valores de <strong>{storeNames.find(s => s.id === pendingCopy.source)?.name}</strong> para <strong>{storeNames.find(s => s.id === pendingCopy.target)?.name}</strong>?</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancelar</Button>
              <Button onClick={confirmCopy}>Confirmar Cópia</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface BulkActionsToolbarProps {
  storeNames: Store[];
  fieldsToUpdate: string[];
  onApplyBulk: (field: 'minValue' | 'maxValue', value: number) => void;
  onApplyPercentage: (field: 'minValue' | 'maxValue', percentage: number, operation: 'increase' | 'decrease') => void;
  onCopyBetweenStores: (sourceStoreId: string, targetStoreId: string) => void;
  onReset: () => void;
}

export function BulkActionsToolbar({
  storeNames,
  fieldsToUpdate,
  onApplyBulk,
  onApplyPercentage,
  onCopyBetweenStores,
  onReset
}: BulkActionsToolbarProps) {
  const [bulkValue, setBulkValue] = useState("");
  const [bulkField, setBulkField] = useState<'minValue' | 'maxValue'>('minValue');
  const [percentageValue, setPercentageValue] = useState("");
  const [percentageField, setPercentageField] = useState<'minValue' | 'maxValue'>('minValue');
  const { toast } = useToast();

  const applyBulkValue = () => {
    if (!bulkValue) return;
    const numValue = parseFloat(bulkValue) || 0;
    onApplyBulk(bulkField, numValue);
    setBulkValue("");
  };

  const applyPercentageIncrease = () => {
    if (!percentageValue) return;
    const percentage = parseFloat(percentageValue) || 0;
    onApplyPercentage(percentageField, percentage, 'increase');
    setPercentageValue("");
  };

  const applyPercentageDecrease = () => {
    if (!percentageValue) return;
    const percentage = parseFloat(percentageValue) || 0;
    onApplyPercentage(percentageField, percentage, 'decrease');
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
              <Label className="text-xs">Campo</Label>
              <select 
                className="px-3 py-1 border rounded text-sm h-9"
                value={bulkField}
                onChange={(e) => setBulkField(e.target.value as 'minValue' | 'maxValue')}
              >
                <option value="minValue">Valor Mínimo</option>
                <option value="maxValue">Valor Máximo</option>
              </select>
            </div>
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
              <Label className="text-xs">Campo</Label>
              <select 
                className="px-3 py-1 border rounded text-sm h-9"
                value={percentageField}
                onChange={(e) => setPercentageField(e.target.value as 'minValue' | 'maxValue')}
              >
                <option value="minValue">Valor Mínimo</option>
                <option value="maxValue">Valor Máximo</option>
              </select>
            </div>
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
          
          {/* Copy Between Stores */}
          {storeNames.length > 1 && (
            <>
              <Separator orientation="vertical" className="h-10" />
              <CopyStoresSection 
                storeNames={storeNames} 
                onCopyBetweenStores={onCopyBetweenStores} 
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}