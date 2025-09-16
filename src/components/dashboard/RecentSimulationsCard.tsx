import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { formatCurrency } from "@/data/mockData";

interface Simulation {
  id: number;
  model: string;
  brand: string;
  seller: string;
  store: string;
  downPayment: number;
  tradeIn: number;
  installments: string;
  time: string;
}

interface RecentSimulationsCardProps {
  simulations?: Simulation[];
}

const defaultSimulations: Simulation[] = [
  {
    id: 1,
    model: 'iPhone 15 Pro Max 256GB',
    brand: 'iPhone',
    seller: 'Ana Silva',
    store: 'Castanhal',
    downPayment: 800,
    tradeIn: 450,
    installments: '12x',
    time: 'há 5 minutos'
  },
  {
    id: 2,
    model: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    seller: 'Carlos Santos',
    store: 'Belém',
    downPayment: 600,
    tradeIn: 0,
    installments: '6x',
    time: 'há 12 minutos'
  },
  {
    id: 3,
    model: 'iPhone 14 Pro 128GB',
    brand: 'iPhone',
    seller: 'Maria Oliveira',
    store: 'Castanhal',
    downPayment: 400,
    tradeIn: 380,
    installments: '12x',
    time: 'há 25 minutos'
  },
  {
    id: 4,
    model: 'Xiaomi Redmi Note 13 Pro',
    brand: 'Xiaomi',
    seller: 'Ana Silva',
    store: 'Belém',
    downPayment: 200,
    tradeIn: 0,
    installments: 'Débito',
    time: 'há 35 minutos'
  },
  {
    id: 5,
    model: 'Samsung Galaxy A54',
    brand: 'Samsung',
    seller: 'Carlos Santos',
    store: 'Castanhal',
    downPayment: 300,
    tradeIn: 220,
    installments: '3x',
    time: 'há cerca de 1 hora'
  }
];

export function RecentSimulationsCard({ simulations = defaultSimulations }: RecentSimulationsCardProps) {
  return (
    <Card className="col-span-full lg:col-span-2 card-animate hover-float">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Últimas Simulações
        </CardTitle>
        <p className="text-sm text-muted-foreground">Atividade recente de orçamentos</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {simulations.map((sim) => (
            <div key={sim.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{sim.model}</span>
                  <Badge variant="outline" className="text-xs">{sim.brand}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {sim.seller}
                  </span>
                  <span>{sim.store}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">Entrada: {formatCurrency(sim.downPayment)}</span>
                  {sim.tradeIn > 0 && <span className="text-sm">Aparelho: {formatCurrency(sim.tradeIn)}</span>}
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Badge variant={sim.installments === '12x' ? 'default' : 'secondary'} className="text-xs">
                    {sim.installments}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{sim.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}