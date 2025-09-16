import React, { useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCentsToBRL } from "@/lib/currency";
import { PhoneModel } from "@/data/mockData";

interface PaymentOption {
  type: string;
  value: string;
  total: string;
  hasDownPayment: boolean;
}

interface QuoteGeneratorProps {
  selectedModel: PhoneModel | null;
  modelName: string;
  priceCents: number;
  tradeInValueCents: number;
  calculateInstallments: PaymentOption[];
}

export function QuoteGenerator({
  selectedModel,
  modelName,
  priceCents,
  tradeInValueCents,
  calculateInstallments
}: QuoteGeneratorProps) {
  const { toast } = useToast();

  // Generate basic quote
  const generateQuote = useCallback(() => {
    const price = formatCentsToBRL(priceCents);
    const productName = selectedModel?.name || modelName;
    return `${productName} está ${price}.`;
  }, [selectedModel, modelName, priceCents]);

  // Generate 12x installment quote
  const generate12xQuote = useCallback(() => {
    const installment12x = calculateInstallments.find(item => item.type === "12x");
    const productName = selectedModel?.name || modelName;
    return `${productName} está 12x ${installment12x?.value || "R$ 0,00"}.`;
  }, [calculateInstallments, selectedModel, modelName]);

  // Generate trade-in quote
  const generateTradeInQuote = useCallback(() => {
    const priceValue = priceCents / 100;
    const tradeInValueParsed = tradeInValueCents / 100;
    const difference = priceValue - tradeInValueParsed;
    const productName = selectedModel?.name || modelName;
    return `A volta para o ${productName} é de ${formatCentsToBRL(difference * 100)}.`;
  }, [priceCents, tradeInValueCents, selectedModel, modelName]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${type} copiado para a área de transferência`,
      duration: 2000
    });
  };

  // Memoize quotes for performance
  const quotes = useMemo(() => ({
    basic: generateQuote(),
    installment12x: generate12xQuote(),
    tradeIn: generateTradeInQuote()
  }), [generateQuote, generate12xQuote, generateTradeInQuote]);

  const hasValidProduct = selectedModel || modelName;
  const hasTradeIn = tradeInValueCents > 0;

  if (!hasValidProduct && priceCents === 0) {
    return null;
  }

  return (
    <Card className="card-animate hover-float">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Copy className="h-5 w-5 text-primary" />
          Orçamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Basic Quote */}
          <div className="p-3 bg-green-50 border-green-200 border rounded-lg">
            <p className="text-sm font-medium mb-2">Orçamento Valor Total</p>
            <div className="flex items-center justify-between">
              <span className="text-sm break-words pr-2">{quotes.basic}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(quotes.basic, "Orçamento")}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 12x Installment Quote */}
          <div className="p-3 bg-green-50 border-green-200 border rounded-lg">
            <p className="text-sm font-medium mb-2">Orçamento em 12x</p>
            <div className="flex items-center justify-between">
              <span className="text-sm break-words pr-2">{quotes.installment12x}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(quotes.installment12x, "Orçamento 12x")}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Trade-in Quote */}
          {hasTradeIn ? (
            <div className="p-3 bg-green-50 border-green-200 border rounded-lg">
              <p className="text-sm font-medium mb-2">Orçamento com Aparelho</p>
              <div className="flex items-center justify-between">
                <span className="text-sm break-words pr-2">{quotes.tradeIn}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(quotes.tradeIn, "Orçamento com Aparelho")}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 border-gray-200 border rounded-lg opacity-50">
              <p className="text-sm font-medium mb-2">Orçamento com Aparelho</p>
              <p className="text-sm text-muted-foreground">Adicione um aparelho de entrada</p>
            </div>
          )}
        </div>

        {/* Quote Summary */}
        {(hasValidProduct || priceCents > 0) && (
          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
            <div className="flex justify-between items-center">
              <span>Orçamentos disponíveis:</span>
              <span>{hasTradeIn ? 3 : 2} opções</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}