import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Smartphone, ArrowUp, ArrowDown } from "lucide-react";

interface Model {
  name: string;
  brand: string;
  simulations: number;
  growth: number;
}

interface TopModelsCardProps {
  models?: Model[];
}

const defaultModels: Model[] = [
  { name: 'iPhone 15 Pro Max 256GB', brand: 'iPhone', simulations: 28, growth: 12 },
  { name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', simulations: 19, growth: -8 },
  { name: 'iPhone 14 Pro 128GB', brand: 'iPhone', simulations: 15, growth: 5 },
  { name: 'Xiaomi Redmi Note 13 Pro', brand: 'Xiaomi', simulations: 12, growth: 15 },
  { name: 'Samsung Galaxy A54', brand: 'Samsung', simulations: 9, growth: -3 }
];

export function TopModelsCard({ models = defaultModels }: TopModelsCardProps) {
  return (
    <Card className="card-animate hover-float">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          Top Modelos
        </CardTitle>
        <p className="text-sm text-muted-foreground">Modelos mais simulados nos últimos 7 dias</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {models.map((model, index) => (
          <div key={index} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{model.name}</span>
                <Badge variant="outline" className="text-xs">{model.brand}</Badge>
              </div>
              <div className="text-xs text-muted-foreground">{model.simulations} simulações</div>
              <Progress value={75} className="mt-1 h-1" />
            </div>
            <div className="flex items-center gap-1 ml-2">
              {model.growth > 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500" />
              )}
              <span className={`text-xs font-medium ${model.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(model.growth)}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}