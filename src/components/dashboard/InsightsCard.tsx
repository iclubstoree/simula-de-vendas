import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, AlertTriangle, Target, TrendingDown, Clock } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Insight {
  type: 'alta' | 'media' | 'baixa';
  icon: LucideIcon;
  title: string;
  description: string;
  reason: string;
  action: string;
  color: string;
}

interface InsightsCardProps {
  insights?: Insight[];
}

const defaultInsights: Insight[] = [
  {
    type: 'alta',
    icon: AlertTriangle,
    title: 'iPhone 15 Pro Max em alta',
    description: 'Crescimento de 25% nas simulações nos últimos 3 dias',
    reason: 'Por quê: Promoção de Black Friday gerando interesse aumentado',
    action: 'Aumentar estoque',
    color: 'text-red-500 bg-red-50'
  },
  {
    type: 'media',
    icon: Target,
    title: '12x continua dominando',
    description: '74% das simulações optam por parcelamento máximo',
    reason: 'Por quê: Clientes preferem menor valor de parcela mesmo com juros maiores',
    action: 'Destacar vantagens do parcelamento',
    color: 'text-blue-500 bg-blue-50'
  },
  {
    type: 'alta',
    icon: TrendingDown,
    title: 'Queda em Samsung Galaxy S24',
    description: 'Redução de 15% nas simulações desta semana',
    reason: 'Por quê: Possível impacto do lançamento de novos modelos concorrentes',
    action: 'Revisar estratégia de preços',
    color: 'text-red-500 bg-red-50'
  },
  {
    type: 'baixa',
    icon: Clock,
    title: 'Horário nobre das 14h-16h',
    description: 'Maior concentração de simulações no período da tarde',
    reason: 'Por quê: Horário de almoço estendido aumenta navegação mobile',
    action: 'Focar campanhas neste período',
    color: 'text-green-500 bg-green-50'
  }
];

export function InsightsCard({ insights = defaultInsights }: InsightsCardProps) {
  return (
    <Card className="col-span-full card-animate hover-float">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Insights Inteligentes
        </CardTitle>
        <p className="text-sm text-muted-foreground">Análises automáticas e sugestões estratégicas</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="border-l-4 border-l-primary pl-4 space-y-2">
              <div className="flex items-start gap-2">
                <div className={`p-1 rounded-full ${insight.color}`}>
                  <insight.icon className="h-3 w-3" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={insight.type === 'alta' ? 'destructive' : insight.type === 'media' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {insight.type === 'alta' ? 'Alta' : insight.type === 'media' ? 'Média' : 'Baixa'}
                    </Badge>
                    <span className="font-medium text-sm">{insight.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                  <p className="text-xs text-muted-foreground mb-2">{insight.reason}</p>
                  <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                    {insight.action} →
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}