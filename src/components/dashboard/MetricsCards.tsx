import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  Smartphone,
  CreditCard,
  Trophy
} from "lucide-react";

interface FilteredKpis {
  totalSimulations: number;
  averageEntry: number;
  withTradeIn: number;
  installment12x: number;
  averageTicket: number;
}

interface MetricsCardsProps {
  filteredKpis: FilteredKpis;
  hasFilters: boolean;
}

export function MetricsCards({ filteredKpis, hasFilters }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <Card className="card-animate hover-float">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Orçamentos Gerados</p>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-primary">{filteredKpis.totalSimulations}</p>
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
              {hasFilters ? "Filtrado" : "+15.2%"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {hasFilters ? `${filteredKpis.totalSimulations} de 47 total` : "Hoje: 12 | Ontem: 8"}
          </p>
        </CardContent>
      </Card>

      <Card className="card-animate hover-float">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Entrada Média</p>
            <DollarSign className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">R$ {filteredKpis.averageEntry.toLocaleString('pt-BR')},00</p>
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
              {hasFilters ? "Filtrado" : "+8.4%"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {hasFilters ? "Baseado nos filtros" : "↑ R$ 45 vs semana passada"}
          </p>
        </CardContent>
      </Card>

      <Card className="card-animate hover-float">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Com Aparelho de Entrada</p>
            <Smartphone className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{filteredKpis.withTradeIn}%</p>
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
              {hasFilters ? "Filtrado" : "+12.1%"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {hasFilters ? "Dados filtrados" : `${Math.floor(filteredKpis.withTradeIn * filteredKpis.totalSimulations / 100)} de ${filteredKpis.totalSimulations} simulações`}
          </p>
        </CardContent>
      </Card>

      <Card className="card-animate hover-float">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Pagamento em 12x</p>
            <CreditCard className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{filteredKpis.installment12x}%</p>
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
              {hasFilters ? "Filtrado" : "+5.8%"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {hasFilters ? "Dados filtrados" : `${Math.floor(filteredKpis.installment12x * filteredKpis.totalSimulations / 100)} de ${filteredKpis.totalSimulations} simulações`}
          </p>
        </CardContent>
      </Card>

      <Card className="card-animate hover-float bg-gradient-primary text-primary-foreground">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Ticket Médio</p>
            <Trophy className="h-4 w-4 opacity-90" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">R$ {filteredKpis.averageTicket.toLocaleString('pt-BR')},00</p>
            <Badge variant="secondary" className="text-xs bg-white/20 text-white">
              {hasFilters ? "Filtrado" : "+3.2%"}
            </Badge>
          </div>
          <p className="text-xs opacity-75 mt-1">
            {hasFilters ? "Baseado nos filtros aplicados" : "↑ 3,2% vs período anterior"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}