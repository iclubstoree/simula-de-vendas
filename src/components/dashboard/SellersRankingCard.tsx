import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

interface Seller {
  name: string;
  store: string;
  simulations: number;
  conversion: number;
  position: string;
}

interface SellersRankingCardProps {
  sellers?: Seller[];
}

const defaultSellers: Seller[] = [
  { name: 'Ana Silva', store: 'Castanhal', simulations: 34, conversion: 28.5, position: 'AS' },
  { name: 'Carlos Santos', store: 'Belém', simulations: 28, conversion: 25.2, position: 'CS' },
  { name: 'Maria Oliveira', store: 'Castanhal', simulations: 22, conversion: 22.8, position: 'MO' },
  { name: 'João Pereira', store: 'Belém', simulations: 18, conversion: 20.1, position: 'JP' },
  { name: 'Lucia Costa', store: 'Castanhal', simulations: 15, conversion: 18.5, position: 'LC' }
];

export function SellersRankingCard({ sellers = defaultSellers }: SellersRankingCardProps) {
  return (
    <Card className="card-animate hover-float">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Ranking de Vendedores
        </CardTitle>
        <p className="text-sm text-muted-foreground">Performance por simulações geradas</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {sellers.map((seller, index) => (
          <div key={index} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-primary text-primary-foreground text-sm font-bold">
              {seller.position}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{seller.name}</span>
                <span className="text-xs">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{seller.store}</span>
                <span>•</span>
                <span>{seller.conversion}% conversão</span>
              </div>
              <Progress value={seller.conversion} className="mt-1 h-1" />
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{seller.simulations}</div>
              <div className="text-xs text-muted-foreground">simulações</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}