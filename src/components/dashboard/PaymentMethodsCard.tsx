import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreditCard } from "lucide-react";

interface PaymentMethod {
  method: string;
  simulations: number;
  percentage: number;
  highlight?: boolean;
}

interface PriceRange {
  range: string;
  count: number;
}

interface PaymentMethodsCardProps {
  paymentMethods?: PaymentMethod[];
  priceRanges?: PriceRange[];
}

const defaultPaymentMethods: PaymentMethod[] = [
  { method: '12x', simulations: 35, percentage: 74, highlight: true },
  { method: '6x', simulations: 8, percentage: 17 },
  { method: 'Débito', simulations: 6, percentage: 13 },
  { method: '3x', simulations: 4, percentage: 8 },
  { method: '18x', simulations: 3, percentage: 6 }
];

const defaultPriceRanges: PriceRange[] = [
  { range: 'R$ 2.000 - R$ 3.000', count: 18 },
  { range: 'R$ 1.000 - R$ 2.000', count: 12 },
  { range: 'R$ 3.000 - R$ 4.000', count: 10 },
  { range: 'R$ 500 - R$ 1.000', count: 7 }
];

export function PaymentMethodsCard({
  paymentMethods = defaultPaymentMethods,
  priceRanges = defaultPriceRanges
}: PaymentMethodsCardProps) {
  const maxCount = Math.max(...priceRanges.map(p => p.count));

  return (
    <Card className="card-animate hover-float">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Parcelamentos
        </CardTitle>
        <p className="text-sm text-muted-foreground">Formas de pagamento mais usadas</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {paymentMethods.map((payment, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{payment.method}</span>
                {payment.highlight && <Badge className="text-xs bg-gradient-primary">Destaque</Badge>}
              </div>
              <span className="text-xs text-muted-foreground">{payment.simulations} simulações</span>
            </div>
            <Progress value={payment.percentage} className="h-2" />
          </div>
        ))}

        <div className="mt-6">
          <h4 className="font-medium text-sm mb-3">Faixas de Preço</h4>
          <p className="text-xs text-muted-foreground mb-3">Distribuição por valor do produto</p>
          <div className="space-y-2">
            {priceRanges.map((price, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{price.range}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{price.count}</span>
                  <Progress value={(price.count / maxCount) * 100} className="w-16 h-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}