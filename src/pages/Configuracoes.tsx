import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Smartphone, 
  RefreshCw, 
  FolderTree, 
  AlertTriangle, 
  CreditCard, 
  Users, 
  Download,
  Upload,
  Settings
} from "lucide-react";
import { Lojas } from "@/components/configuracoes/Lojas";
import { Modelos } from "@/components/configuracoes/Modelos";
import { AparelhosEntrada } from "@/components/configuracoes/AparelhosEntrada";
import { Categorias } from "@/components/configuracoes/Categorias";
import { MatrizAvarias } from "@/components/configuracoes/MatrizAvarias";
import { Taxas } from "@/components/configuracoes/Taxas";
import { Usuarios } from "@/components/configuracoes/Usuarios";
import { ExportarImportar } from "@/components/configuracoes/ExportarImportar";

const configTabs = [
  {
    id: "lojas",
    label: "Lojas",
    icon: Store,
    description: "Gerenciar lojas cadastradas"
  },
  {
    id: "modelos",
    label: "Modelos", 
    icon: Smartphone,
    description: "Gerenciar modelos"
  },
  {
    id: "aparelhos-entrada",
    label: "Aparelhos de Entrada",
    icon: RefreshCw,
    description: "Seminovos para entrada"
  },
  {
    id: "categorias",
    label: "Categorias",
    icon: FolderTree,
    description: "Categorias e subcategorias"
  },
  {
    id: "matriz-avarias",
    label: "Avarias",
    icon: AlertTriangle,
    description: "Descontos por avarias"
  },
  {
    id: "taxas",
    label: "Taxas",
    icon: CreditCard,
    description: "Máquinas e taxas"
  },
  {
    id: "usuarios",
    label: "Usuários",
    icon: Users,
    description: "Gerenciar usuários"
  },
  {
    id: "exportar-importar",
    label: "Export/Import",
    icon: Download,
    description: "Backup e restauração"
  }
];

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState(() => {
    // Load active tab from localStorage on component mount
    return localStorage.getItem('config-active-tab') || "lojas";
  });

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    localStorage.setItem('config-active-tab', tabId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-primary">
          <Settings className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie lojas, modelos, taxas e permissões do sistema
          </p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          Admin
        </Badge>
      </div>

      {/* Configuration Tabs */}
      <Card className="card-animate">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Tabs List - Horizontal scroll for mobile */}
          <div className="border-b">
            <div className="overflow-x-auto">
              <TabsList className="grid w-max grid-cols-4 lg:grid-cols-8 h-auto p-1 bg-muted/50">
                {configTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex flex-col items-center gap-1 p-3 min-w-[120px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="text-xs font-medium">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Active Tab Info */}
            <div className="mb-6">
              {(() => {
                const currentTab = configTabs.find(tab => tab.id === activeTab);
                return (
                  <div className="flex items-center gap-3">
                    {currentTab && (
                      <>
                        <currentTab.icon className="h-5 w-5 text-primary" />
                        <div>
                          <h2 className="text-xl font-semibold">{currentTab.label}</h2>
                          <p className="text-sm text-muted-foreground">{currentTab.description}</p>
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Tab Contents */}
            <TabsContent value="lojas" className="mt-0">
              <Lojas />
            </TabsContent>

            <TabsContent value="modelos" className="mt-0">
              <Modelos />
            </TabsContent>

            <TabsContent value="aparelhos-entrada" className="mt-0">
              <AparelhosEntrada />
            </TabsContent>

            <TabsContent value="categorias" className="mt-0">
              <Categorias />
            </TabsContent>

            <TabsContent value="matriz-avarias" className="mt-0">
              <MatrizAvarias />
            </TabsContent>

            <TabsContent value="taxas" className="mt-0">
              <Taxas />
            </TabsContent>

            <TabsContent value="usuarios" className="mt-0">
              <Usuarios />
            </TabsContent>

            <TabsContent value="exportar-importar" className="mt-0">
              <ExportarImportar />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}