import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StandaloneCurrencyInput } from "@/lib/ControlledCurrencyInput";
import { formatCentsToBRL } from "@/lib/currency";
import { PhoneModel } from "@/data/mockData";

interface PriceCalculatorProps {
  selectedModel: PhoneModel | null;
  priceCents: number;
  onPriceChange: (cents: number) => void;
  downPaymentCents: number;
  onDownPaymentChange: (cents: number) => void;
  tradeInValueCents: number;
  onTradeInValueChange: (cents: number) => void;
  onOpenTradeInModal: () => void;
  disabled?: boolean;
}

export function PriceCalculator({
  selectedModel,
  priceCents,
  onPriceChange,
  downPaymentCents,
  onDownPaymentChange,
  tradeInValueCents,
  onTradeInValueChange,
  onOpenTradeInModal,
  disabled = false
}: PriceCalculatorProps) {
  const { toast } = useToast();

  const handleRemoveTradeIn = () => {
    onTradeInValueChange(0);
    toast({
      title: "Aparelho removido",
      description: "Aparelho de entrada foi removido do cálculo",
      duration: 2000
    });
  };

  return (
    <Card className="card-animate hover-float">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Simulador de Vendas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Product Price */}
        <div>
          <StandaloneCurrencyInput
            id="price"
            label="Valor do Produto (R$)"
            value={priceCents}
            onChange={onPriceChange}
            placeholder="R$ 0,00"
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Preenchido automaticamente, mas editável
          </p>
        </div>

        {/* Down Payment */}
        <div>
          <StandaloneCurrencyInput
            id="downPayment"
            label="Entrada (R$)"
            value={downPaymentCents}
            onChange={onDownPaymentChange}
            placeholder="R$ 0,00"
            disabled={disabled}
          />
        </div>

        {/* Trade-in Device */}
        <div>
          <Label htmlFor="tradeIn">Aparelho de Entrada (R$):</Label>
          <div className="flex gap-2">
            <Input
              id="tradeIn"
              value={tradeInValueCents > 0 ? formatCentsToBRL(tradeInValueCents) : ""}
              readOnly
              placeholder="R$ 0,00"
              className="bg-muted"
              disabled={disabled}
            />
            <Button
              variant="outline"
              onClick={onOpenTradeInModal}
              className="whitespace-nowrap"
              disabled={disabled}
            >
              <Plus className="h-4 w-4" />
            </Button>
            {tradeInValueCents > 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleRemoveTradeIn}
                disabled={disabled}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          {tradeInValueCents > 0 && (
            <Badge variant="secondary" className="mt-1">
              {formatCentsToBRL(tradeInValueCents)} aplicado
            </Badge>
          )}
        </div>

        {/* Selected Model Summary */}
        {selectedModel && (
          <div className="pt-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Modelo selecionado:</span>
                <Badge variant="outline">{selectedModel.name}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Categoria:</span>
                <span className="text-sm text-muted-foreground">{selectedModel.category}</span>
              </div>
            </div>
          </div>
        )}

        {/* Price Summary */}
        {priceCents > 0 && (
          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Valor do produto:</span>
              <span className="text-sm font-mono">{formatCentsToBRL(priceCents)}</span>
            </div>

            {downPaymentCents > 0 && (
              <div className="flex justify-between">
                <span className="text-sm">Entrada:</span>
                <span className="text-sm font-mono text-green-600">
                  -{formatCentsToBRL(downPaymentCents)}
                </span>
              </div>
            )}

            {tradeInValueCents > 0 && (
              <div className="flex justify-between">
                <span className="text-sm">Aparelho de entrada:</span>
                <span className="text-sm font-mono text-green-600">
                  -{formatCentsToBRL(tradeInValueCents)}
                </span>
              </div>
            )}

            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Valor a financiar:</span>
              <span className="font-mono text-primary">
                {formatCentsToBRL(Math.max(0, priceCents - downPaymentCents - tradeInValueCents))}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}