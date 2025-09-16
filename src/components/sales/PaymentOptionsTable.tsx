import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, CardMachine } from "@/data/mockData";
import { formatCentsToBRL } from "@/lib/currency";

interface PaymentOption {
  type: string;
  value: string;
  total: string;
  hasDownPayment: boolean;
}

interface PaymentOptionsTableProps {
  priceCents: number;
  downPaymentCents: number;
  tradeInValueCents: number;
  selectedCardMachine: string;
  availableCardMachines: CardMachine[];
  onCardMachineChange: (machineId: string) => void;
}

export function PaymentOptionsTable({
  priceCents,
  downPaymentCents,
  tradeInValueCents,
  selectedCardMachine,
  availableCardMachines,
  onCardMachineChange
}: PaymentOptionsTableProps) {
  const { toast } = useToast();

  // Calculate installment options
  const calculateInstallments = useMemo((): PaymentOption[] => {
    if (!selectedCardMachine) return [];

    const machine = availableCardMachines.find(m => m.id === selectedCardMachine);
    if (!machine) return [];

    const priceValue = priceCents / 100;
    const downPaymentValue = downPaymentCents / 100;
    const tradeInValueParsed = tradeInValueCents / 100;
    const baseValue = Math.max(0, priceValue - downPaymentValue - tradeInValueParsed);
    const installments: PaymentOption[] = [];

    // Debit option
    installments.push({
      type: "Débito",
      value: formatCurrency(baseValue),
      total: formatCurrency(baseValue),
      hasDownPayment: downPaymentValue > 0
    });

    // Installment options (1x to maxInstallments)
    for (let i = 1; i <= machine.maxInstallments; i++) {
      const rate = machine.rates[i] || 0;
      const tax = rate / 100;
      const totalWithTax = baseValue / (1 - tax);
      const installmentValue = totalWithTax / i;

      installments.push({
        type: `${i}x`,
        value: formatCurrency(installmentValue),
        total: formatCurrency(totalWithTax),
        hasDownPayment: downPaymentValue > 0
      });
    }

    return installments;
  }, [selectedCardMachine, availableCardMachines, priceCents, downPaymentCents, tradeInValueCents]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${type} copiado para a área de transferência`,
      duration: 2000
    });
  };

  const formatPaymentText = (option: PaymentOption): string => {
    const downPaymentText = option.hasDownPayment ? `${formatCentsToBRL(downPaymentCents)} + ` : '';
    return `${downPaymentText}${option.type === "Débito" ? "Débito" : option.type} de ${option.value}`;
  };

  return (
    <Card className="card-animate hover-float">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Parcelamento no cartão
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Card Machine Selection */}
        {availableCardMachines.length > 1 && (
          <div className="mb-4 flex justify-center">
            <Select value={selectedCardMachine} onValueChange={onCardMachineChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Máquina de cartão" />
              </SelectTrigger>
              <SelectContent>
                {availableCardMachines.map((machine) => (
                  <SelectItem key={machine.id} value={machine.id}>
                    {machine.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Payment Options Table */}
        {selectedCardMachine ? (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 text-xs font-medium text-muted-foreground pb-2 border-b">
              <span>Parcelas</span>
              <span>Valor</span>
              <span>Total no cartão</span>
              <span>Ação</span>
            </div>

            {/* Payment Options */}
            {calculateInstallments.map((option, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 items-center p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {/* Payment Type */}
                <span className="font-medium text-sm">{option.type}</span>

                {/* Payment Value */}
                <div className="text-sm">
                  {option.hasDownPayment && (
                    <span className="text-green-600">
                      {formatCentsToBRL(downPaymentCents)} +
                    </span>
                  )}
                  <span className="ml-1">
                    {option.type === "Débito" ? option.value : option.value}
                  </span>
                </div>

                {/* Total Value */}
                <span className="text-sm">{option.total}</span>

                {/* Copy Action */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(formatPaymentText(option), `Parcela ${option.type}`)}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Selecione uma máquina de cartão para ver as opções de parcelamento
          </div>
        )}

        {/* Summary */}
        {selectedCardMachine && calculateInstallments.length > 0 && (
          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground text-center">
            {availableCardMachines.find(m => m.id === selectedCardMachine)?.name} -
            {" "}{calculateInstallments.length - 1} opções de parcelamento disponíveis
          </div>
        )}
      </CardContent>
    </Card>
  );
}