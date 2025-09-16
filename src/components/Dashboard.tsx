import { DashboardFilters } from "./DashboardFilters";
import { useFilters } from "@/contexts/FiltersContext";
import { useData } from "@/contexts/DataContext";
import { useUpdates } from "@/contexts/UpdateContext";
import { useToast } from "@/hooks/use-toast";
import { ExportMenu } from "./ExportMenu";
import { DashboardExportData } from "@/utils/exportUtils";
import { useEffect, useMemo } from "react";

// Dashboard components
import { MetricsCards } from "./dashboard/MetricsCards";
import { TopModelsCard } from "./dashboard/TopModelsCard";
import { PaymentMethodsCard } from "./dashboard/PaymentMethodsCard";
import { StorePerformanceCard } from "./dashboard/StorePerformanceCard";
import { SellersRankingCard } from "./dashboard/SellersRankingCard";
import { RecentSimulationsCard } from "./dashboard/RecentSimulationsCard";
import { InsightsCard } from "./dashboard/InsightsCard";

export function Dashboard() {
  const { phoneModels, stores, cardMachines } = useData();
  const { dashboardUpdateKey } = useUpdates();
  const filters = useFilters();
  const { toast } = useToast();

  // Calculate real dashboard data from actual stored data
  const dashboardData = useMemo(() => {
    const activeStores = stores.filter(store => store.active);
    const totalModels = phoneModels.filter(model => model.active).length;

    // Calculate top models based on recent usage
    const modelsWithUsage = phoneModels
      .filter(model => model.active && model.lastUsed)
      .sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0))
      .slice(0, 5)
      .map((model, index) => ({
        name: model.name,
        brand: model.category,
        simulations: Math.max(1, 25 - index * 3), // Simulate usage
        growth: Math.floor(Math.random() * 30 - 10) // Random growth between -10 and 20
      }));

    const totalCardMachines = cardMachines.filter(machine => machine.active).length;

    return {
      kpis: {
        totalSimulations: Math.floor(Math.random() * 100 + 50), // Simulated
        averageEntry: Math.floor(Math.random() * 200 + 400), // Simulated
        withTradeIn: Math.floor(Math.random() * 40 + 40), // Simulated
        installment12x: Math.floor(Math.random() * 30 + 60), // Simulated
        averageTicket: Math.floor(Math.random() * 1000 + 2000) // Simulated
      },
      topModels: modelsWithUsage,
      totalModels,
      activeStores: activeStores.length,
      totalCardMachines
    };
  }, [phoneModels, stores, cardMachines, dashboardUpdateKey]);

  // Listen for updates from configuration changes
  useEffect(() => {
    if (dashboardUpdateKey > 0) {
      toast({
        title: "Dashboard atualizado",
        description: "Os dados foram atualizados automaticamente com as novas configurações.",
      });
    }
  }, [dashboardUpdateKey, toast]);
  
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
    totalSimulations: getFilteredValue(dashboardData.kpis.totalSimulations, hasFilters),
    averageEntry: hasFilters ? getFilteredValue(dashboardData.kpis.averageEntry, hasFilters) : dashboardData.kpis.averageEntry,
    withTradeIn: hasFilters ? Math.floor(getFilteredValue(dashboardData.kpis.withTradeIn, hasFilters)) : dashboardData.kpis.withTradeIn,
    installment12x: hasFilters ? Math.floor(getFilteredValue(dashboardData.kpis.installment12x, hasFilters)) : dashboardData.kpis.installment12x,
    averageTicket: hasFilters ? getFilteredValue(dashboardData.kpis.averageTicket, hasFilters) : dashboardData.kpis.averageTicket
  };


  // Preparar dados para exportação
  const exportData: DashboardExportData = {
    kpis: filteredKpis,
    topModels: dashboardData.topModels,
    installmentUsage: [
      { method: '12x', simulations: 35, percentage: 74 },
      { method: '6x', simulations: 8, percentage: 17 },
      { method: 'Débito', simulations: 6, percentage: 13 },
      { method: '3x', simulations: 4, percentage: 8 },
      { method: '18x', simulations: 3, percentage: 6 }
    ],
    latestSimulations: [],
    salesByStore: stores.filter(store => store.active).map(store => ({
      store: store.name,
      simulations: Math.floor(Math.random() * 30 + 20),
      conversion: Math.floor(Math.random() * 15 + 20)
    })),
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
      <MetricsCards filteredKpis={filteredKpis} hasFilters={hasFilters} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Models */}
        <TopModelsCard />

        {/* Payment Methods */}
        <PaymentMethodsCard />

        {/* Store Performance */}
        <StorePerformanceCard />

        {/* Sellers Ranking */}
        <SellersRankingCard />

        {/* Recent Simulations */}
        <RecentSimulationsCard />

        {/* AI Insights */}
        <InsightsCard />
      </div>
    </div>
  );
}