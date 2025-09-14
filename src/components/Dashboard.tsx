import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Smartphone, 
  CreditCard, 
  Users, 
  Clock,
  Download,
  Filter,
  AlertTriangle,
  Lightbulb,
  Trophy,
  Target,
  ArrowUp,
  ArrowDown,
  Calendar,
  Store,
  Award
} from "lucide-react";
import { dashboardData, formatCurrency } from "@/data/mockData";
import { DashboardFilters } from "./DashboardFilters";
import { useFilters } from "@/contexts/FiltersContext";
import { useToast } from "@/hooks/use-toast";
import { ExportMenu } from "./ExportMenu";
import { DashboardExportData } from "@/utils/exportUtils";

export function Dashboard() {
  const { kpis, topModels, installmentUsage, categories, priceRanges, salesByStore, salesBySeller } = dashboardData;
  const filters = useFilters();
  const { toast } = useToast();
  
  // Simulate filtered data based on active filters
  const getFilteredValue = (baseValue: number, hasFilters: boolean) => {
    if (!hasFilters) return baseValue;
    // Simulate reduction when filters are applied
    const reduction = Math.random() * 0.3 + 0.1; // 10-40% reduction
    return Math.floor(baseValue * (1 - reduction));
  };
  
  const hasFilters = filters.hasActiveFilters();
  
  // Apply filters to KPI values
  const filteredKpis = {
    totalSimulations: getFilteredValue(47, hasFilters),
    averageEntry: hasFilters ? getFilteredValue(580, hasFilters) : 580,
    withTradeIn: hasFilters ? Math.floor(getFilteredValue(68, hasFilters)) : 68,
    installment12x: hasFilters ? Math.floor(getFilteredValue(74, hasFilters)) : 74,
    averageTicket: hasFilters ? getFilteredValue(2890, hasFilters) : 2890
  };

  const heatmapData = [
    { hour: '08h', seg: 2, ter: 1, qua: 3, qui: 4, sex: 5, sab: 3, dom: 1 },
    { hour: '09h', seg: 4, ter: 5, qua: 3, qui: 6, sex: 7, sab: 4, dom: 2 },
    { hour: '10h', seg: 6, ter: 7, qua: 5, qui: 8, sex: 9, sab: 6, dom: 3 },
    { hour: '11h', seg: 5, ter: 6, qua: 4, qui: 7, sex: 8, sab: 5, dom: 4 },
    { hour: '12h', seg: 3, ter: 4, qua: 3, qui: 5, sex: 6, sab: 4, dom: 2 },
    { hour: '13h', seg: 7, ter: 8, qua: 6, qui: 9, sex: 10, sab: 7, dom: 4 },
    { hour: '14h', seg: 8, ter: 9, qua: 7, qui: 10, sex: 11, sab: 8, dom: 5 },
    { hour: '15h', seg: 9, ter: 10, qua: 8, qui: 11, sex: 12, sab: 9, dom: 6 },
    { hour: '16h', seg: 7, ter: 8, qua: 6, qui: 9, sex: 10, sab: 7, dom: 4 },
    { hour: '17h', seg: 6, ter: 7, qua: 5, qui: 8, sex: 9, sab: 6, dom: 3 },
    { hour: '18h', seg: 4, ter: 5, qua: 3, qui: 6, sex: 7, sab: 4, dom: 2 },
    { hour: '19h', seg: 2, ter: 3, qua: 2, qui: 4, sex: 5, sab: 3, dom: 1 }
  ];

  const getHeatmapColor = (value: number) => {
    if (value >= 10) return 'bg-primary';
    if (value >= 8) return 'bg-primary/80';
    if (value >= 6) return 'bg-primary/60';
    if (value >= 4) return 'bg-primary/40';
    if (value >= 2) return 'bg-primary/20';
    return 'bg-muted';
  };

  const insights = [
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

  const latestSimulations = [
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

  // Preparar dados para exportação
  const exportData: DashboardExportData = {
    kpis: filteredKpis,
    topModels: [
      { name: 'iPhone 15 Pro Max 256GB', brand: 'iPhone', simulations: 28, growth: 12 },
      { name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', simulations: 19, growth: -8 },
      { name: 'iPhone 14 Pro 128GB', brand: 'iPhone', simulations: 15, growth: 5 },
      { name: 'Xiaomi Redmi Note 13 Pro', brand: 'Xiaomi', simulations: 12, growth: 15 },
      { name: 'Samsung Galaxy A54', brand: 'Samsung', simulations: 9, growth: -3 }
    ],
    installmentUsage: [
      { method: '12x', simulations: 35, percentage: 74 },
      { method: '6x', simulations: 8, percentage: 17 },
      { method: 'Débito', simulations: 6, percentage: 13 },
      { method: '3x', simulations: 4, percentage: 8 },
      { method: '18x', simulations: 3, percentage: 6 }
    ],
    latestSimulations,
    salesByStore: salesByStore || [
      { store: 'Castanhal', simulations: 32, conversion: 25.8 },
      { store: 'Belém', simulations: 28, conversion: 22.3 }
    ],
    salesBySeller: [
      { name: 'Ana Silva', store: 'Castanhal', simulations: 34, conversion: 28.5 },
      { name: 'Carlos Santos', store: 'Belém', simulations: 28, conversion: 25.2 },
      { name: 'Maria Oliveira', store: 'Castanhal', simulations: 22, conversion: 22.8 },
      { name: 'João Pereira', store: 'Belém', simulations: 18, conversion: 20.1 },
      { name: 'Lucia Costa', store: 'Castanhal', simulations: 15, conversion: 18.5 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Acompanhe métricas e performance de vendas</p>
        </div>
        <ExportMenu data={exportData} filters={hasFilters ? filters : undefined} />
      </div>

      {/* Filters */}
      <DashboardFilters />

      {/* KPI Cards */}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Top Models */}
        <Card className="card-animate hover-float">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Top Modelos
            </CardTitle>
            <p className="text-sm text-muted-foreground">Modelos mais simulados nos últimos 7 dias</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'iPhone 15 Pro Max 256GB', brand: 'iPhone', simulations: 28, growth: 12 },
              { name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', simulations: 19, growth: -8 },
              { name: 'iPhone 14 Pro 128GB', brand: 'iPhone', simulations: 15, growth: 5 },
              { name: 'Xiaomi Redmi Note 13 Pro', brand: 'Xiaomi', simulations: 12, growth: 15 },
              { name: 'Samsung Galaxy A54', brand: 'Samsung', simulations: 9, growth: -3 }
            ].map((model, index) => (
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

        {/* Payment Methods */}
        <Card className="card-animate hover-float">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Parcelamentos
            </CardTitle>
            <p className="text-sm text-muted-foreground">Formas de pagamento mais usadas</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { method: '12x', simulations: 35, percentage: 74, highlight: true },
              { method: '6x', simulations: 8, percentage: 17 },
              { method: 'Débito', simulations: 6, percentage: 13 },
              { method: '3x', simulations: 4, percentage: 8 },
              { method: '18x', simulations: 3, percentage: 6 }
            ].map((payment, index) => (
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
                {[
                  { range: 'R$ 2.000 - R$ 3.000', count: 18 },
                  { range: 'R$ 1.000 - R$ 2.000', count: 12 },
                  { range: 'R$ 3.000 - R$ 4.000', count: 10 },
                  { range: 'R$ 500 - R$ 1.000', count: 7 }
                ].map((price, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{price.range}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{price.count}</span>
                      <Progress value={(price.count / 18) * 100} className="w-16 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Heatmap */}
        <Card className="card-animate hover-float">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Heatmap de Horários
            </CardTitle>
            <p className="text-sm text-muted-foreground">Concentração de simulações por horário</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-8 gap-1 text-xs text-center font-medium text-muted-foreground">
                <div></div>
                <div>Seg</div>
                <div>Ter</div>
                <div>Qua</div>
                <div>Qui</div>
                <div>Sex</div>
                <div>Sáb</div>
                <div>Dom</div>
              </div>
              {heatmapData.map((row) => (
                <div key={row.hour} className="grid grid-cols-8 gap-1 text-xs">
                  <div className="text-muted-foreground font-medium text-right pr-2">{row.hour}</div>
                  <div className={`h-6 rounded text-center leading-6 text-white text-xs font-medium ${getHeatmapColor(row.seg)}`}>{row.seg}</div>
                  <div className={`h-6 rounded text-center leading-6 text-white text-xs font-medium ${getHeatmapColor(row.ter)}`}>{row.ter}</div>
                  <div className={`h-6 rounded text-center leading-6 text-white text-xs font-medium ${getHeatmapColor(row.qua)}`}>{row.qua}</div>
                  <div className={`h-6 rounded text-center leading-6 text-white text-xs font-medium ${getHeatmapColor(row.qui)}`}>{row.qui}</div>
                  <div className={`h-6 rounded text-center leading-6 text-white text-xs font-medium ${getHeatmapColor(row.sex)}`}>{row.sex}</div>
                  <div className={`h-6 rounded text-center leading-6 text-white text-xs font-medium ${getHeatmapColor(row.sab)}`}>{row.sab}</div>
                  <div className={`h-6 rounded text-center leading-6 text-white text-xs font-medium ${getHeatmapColor(row.dom)}`}>{row.dom}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sellers Ranking */}
        <Card className="card-animate hover-float">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Ranking de Vendedores
            </CardTitle>
            <p className="text-sm text-muted-foreground">Performance por simulações geradas</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Ana Silva', store: 'Castanhal', simulations: 34, conversion: 28.5, position: 'AS' },
              { name: 'Carlos Santos', store: 'Belém', simulations: 28, conversion: 25.2, position: 'CS' },
              { name: 'Maria Oliveira', store: 'Castanhal', simulations: 22, conversion: 22.8, position: 'MO' },
              { name: 'João Pereira', store: 'Belém', simulations: 18, conversion: 20.1, position: 'JP' },
              { name: 'Lucia Costa', store: 'Castanhal', simulations: 15, conversion: 18.5, position: 'LC' }
            ].map((seller, index) => (
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

        {/* Recent Simulations */}
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
              {latestSimulations.map((sim) => (
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

        {/* AI Insights */}
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
      </div>
    </div>
  );
}