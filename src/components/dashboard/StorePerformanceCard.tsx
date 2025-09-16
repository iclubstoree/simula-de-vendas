import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Store, TrendingUp } from "lucide-react";
import { useData } from "@/contexts/DataContext";

interface StoreMetrics {
  name: string;
  simulations: number;
  averageTicket: number;
  growth: number;
}

export function StorePerformanceCard() {
  const { stores } = useData();

  // Generate mock performance data based on active stores
  const storeMetrics: StoreMetrics[] = stores
    .filter(store => store.active)
    .map(store => {
      const simulations = Math.floor(Math.random() * 50 + 20);
      const averageTicket = Math.floor(Math.random() * 1000 + 2000); // R$ 2000-3000 ticket médio
      const growth = Math.floor(Math.random() * 30 - 10); // -10% a +20% crescimento

      return {
        name: store.name,
        simulations,
        averageTicket,
        growth
      };
    })
    .sort((a, b) => b.simulations - a.simulations);

  const maxSimulations = Math.max(...storeMetrics.map(m => m.simulations));

  return (
    <Card className="card-animate hover-float">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          Performance por Loja
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Atividade de simulações por unidade
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {storeMetrics.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Store className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma loja ativa</p>
            </div>
          ) : (
            storeMetrics.map((store) => (
              <div key={store.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{store.name}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className={`h-3 w-3 ${store.growth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                      {store.growth >= 0 ? '+' : ''}{store.growth}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {store.simulations} simulações
                    </div>
                    <div className="text-xs text-muted-foreground">
                      R$ {store.averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ticket médio
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Volume de Simulações</span>
                    <span>{store.simulations}</span>
                  </div>
                  <Progress
                    value={(store.simulations / maxSimulations) * 100}
                    className="h-2"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}