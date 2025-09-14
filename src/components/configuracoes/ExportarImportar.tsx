import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, 
  Upload, 
  FileJson, 
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Info
} from "lucide-react";
import { 
  phoneModels,
  tradeInDevices,
  categories,
  subcategories,
  damageMatrix,
  damageTypes,
  cardMachines,
  stores,
  users
} from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface ExportData {
  version: string;
  timestamp: string;
  data: {
    stores: typeof stores;
    phoneModels: typeof phoneModels;
    tradeInDevices: typeof tradeInDevices;
    categories: typeof categories;
    subcategories: typeof subcategories;
    damageMatrix: typeof damageMatrix;
    damageTypes: typeof damageTypes;
    cardMachines: typeof cardMachines;
    users: typeof users;
  };
}

export function ExportarImportar() {
  const [importData, setImportData] = useState("");
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    errors: string[];
    stats?: {
      stores: number;
      phoneModels: number;
      tradeInDevices: number;
      categories: number;
      subcategories: number;
      damageMatrix: number;
      damageTypes: number;
      cardMachines: number;
      users: number;
    };
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  
  const { toast } = useToast();

  const generateExportData = (): ExportData => {
    return {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      data: {
        stores,
        phoneModels,
        tradeInDevices,
        categories,
        subcategories,
        damageMatrix,
        damageTypes,
        cardMachines,
        users: users.map(user => ({
          ...user,
          password: undefined // Don't export passwords for security
        }))
      }
    };
  };

  const handleExport = () => {
    try {
      const exportData = generateExportData();
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `iclub-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export realizado",
        description: "Backup exportado com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro no export",
        description: "Falha ao gerar arquivo de backup",
        variant: "destructive"
      });
    }
  };

  const validateImportData = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString) as ExportData;
      const errors: string[] = [];
      
      // Basic structure validation
      if (!data.version) errors.push("Versão não encontrada");
      if (!data.timestamp) errors.push("Timestamp não encontrado");
      if (!data.data) errors.push("Dados não encontrados");
      
      // Data validation
      const requiredTables = ['stores', 'phoneModels', 'categories', 'subcategories', 'damageTypes', 'cardMachines', 'users'];
      requiredTables.forEach(table => {
        if (!data.data[table as keyof typeof data.data]) {
          errors.push(`Tabela '${table}' não encontrada`);
        }
      });
      
      // Version compatibility
      if (data.version !== "1.0.0") {
        errors.push(`Versão ${data.version} pode não ser compatível`);
      }
      
      const stats = {
        stores: data.data.stores?.length || 0,
        phoneModels: data.data.phoneModels?.length || 0,
        tradeInDevices: data.data.tradeInDevices?.length || 0,
        categories: data.data.categories?.length || 0,
        subcategories: data.data.subcategories?.length || 0,
        damageMatrix: data.data.damageMatrix?.length || 0,
        damageTypes: data.data.damageTypes?.length || 0,
        cardMachines: data.data.cardMachines?.length || 0,
        users: data.data.users?.length || 0,
      };
      
      return {
        valid: errors.length === 0,
        errors,
        stats
      };
    } catch (error) {
      return {
        valid: false,
        errors: ["JSON inválido ou corrompido"]
      };
    }
  };

  const handleValidateImport = () => {
    if (!importData.trim()) {
      toast({
        title: "Erro",
        description: "Cole os dados JSON para validar",
        variant: "destructive"
      });
      return;
    }
    
    const result = validateImportData(importData);
    setValidationResult(result);
    
    if (result.valid) {
      toast({
        title: "Dados válidos",
        description: "Arquivo pronto para importação"
      });
    } else {
      toast({
        title: "Dados inválidos",
        description: `${result.errors.length} erro(s) encontrado(s)`,
        variant: "destructive"
      });
    }
  };

  const simulateImport = async () => {
    if (!validationResult?.valid) return;
    
    setIsProcessing(true);
    setImportProgress(0);
    
    // Simulate import process
    const steps = [
      "Validando dados...",
      "Importando lojas...",
      "Importando categorias...",
      "Importando modelos...",
      "Importando aparelhos de entrada...",
      "Importando matriz de avarias...",
      "Importando máquinas de cartão...",
      "Importando usuários...",
      "Finalizando..."
    ];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setImportProgress(((i + 1) / steps.length) * 100);
    }
    
    setIsProcessing(false);
    setImportProgress(0);
    setImportData("");
    setValidationResult(null);
    
    toast({
      title: "Import concluído",
      description: `${validationResult.stats?.phoneModels || 0} modelos, ${validationResult.stats?.users || 0} usuários e outros dados importados com sucesso`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Backup e Restauração</h3>
          <p className="text-sm text-muted-foreground">
            Faça backup completo ou restaure dados do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="json">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Importante</AlertTitle>
        <AlertDescription>
          O backup inclui todas as configurações, modelos, usuários e dados do sistema. 
          Senhas de usuários não são exportadas por segurança. Use apenas backups confiáveis.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Exportar Dados
            </CardTitle>
            <CardDescription>
              Gere um arquivo de backup completo do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Dados incluídos no backup:</Label>
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="outline">Lojas ({stores.length})</Badge>
                <Badge variant="outline">Modelos ({phoneModels.length})</Badge>
                <Badge variant="outline">Aparelhos Entrada ({tradeInDevices.length})</Badge>
                <Badge variant="outline">Categorias ({categories.length})</Badge>
                <Badge variant="outline">Subcategorias ({subcategories.length})</Badge>
                <Badge variant="outline">Matriz Avarias ({damageMatrix.length})</Badge>
                <Badge variant="outline">Tipos Avaria ({damageTypes.length})</Badge>
                <Badge variant="outline">Máquinas ({cardMachines.length})</Badge>
                <Badge variant="outline">Usuários ({users.length})</Badge>
              </div>
            </div>
            
            <div className="pt-4 border-t space-y-2">
              <Button 
                onClick={handleExport} 
                className="w-full bg-gradient-primary hover:bg-primary-hover press-effect"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar Backup JSON
              </Button>
              <Button 
                onClick={() => {
                  // CSV export functionality
                  const csvData = phoneModels.map(model => 
                    `${model.name},${model.category},${model.subcategory},${model.price},${model.store}`
                  ).join('\n');
                  const header = 'Nome,Categoria,Subcategoria,Preço,Loja\n';
                  const blob = new Blob([header + csvData], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `modelos-${new Date().toISOString().split('T')[0]}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  toast({
                    title: "CSV exportado",
                    description: "Dados dos modelos exportados em CSV"
                  });
                }}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar CSV (Modelos)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Import Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Importar Dados
            </CardTitle>
            <CardDescription>
              Restaure dados a partir de um arquivo de backup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="importData">Dados JSON do Backup</Label>
              <Textarea
                id="importData"
                placeholder="Cole o conteúdo do arquivo JSON aqui..."
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                rows={6}
                className="font-mono text-xs"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.csv';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const csvContent = e.target?.result as string;
                        setImportData(csvContent);
                        toast({
                          title: "CSV carregado",
                          description: "Arquivo CSV carregado com sucesso"
                        });
                      };
                      reader.readAsText(file);
                    }
                  };
                  input.click();
                }}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar CSV
              </Button>
              <Button 
                variant="outline" 
                onClick={handleValidateImport}
                disabled={!importData.trim() || isProcessing}
                className="flex-1"
              >
                <FileJson className="h-4 w-4 mr-2" />
                Validar
              </Button>
              <Button 
                onClick={simulateImport}
                disabled={!validationResult?.valid || isProcessing}
                className="flex-1 bg-gradient-primary"
              >
                {isProcessing ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Importar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Import Progress */}
      {isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin text-primary" />
              Importando dados...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={importProgress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(importProgress)}% concluído
            </p>
          </CardContent>
        </Card>
      )}

      {/* Validation Result */}
      {validationResult && !isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {validationResult.valid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              Resultado da Validação
            </CardTitle>
          </CardHeader>
          <CardContent>
            {validationResult.valid ? (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Dados válidos</AlertTitle>
                  <AlertDescription>
                    O arquivo está pronto para importação
                  </AlertDescription>
                </Alert>
                
                {validationResult.stats && (
                  <div>
                    <Label className="text-sm font-medium">Dados que serão importados:</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <Badge variant="secondary">Lojas: {validationResult.stats.stores}</Badge>
                      <Badge variant="secondary">Modelos: {validationResult.stats.phoneModels}</Badge>
                      <Badge variant="secondary">Aparelhos: {validationResult.stats.tradeInDevices}</Badge>
                      <Badge variant="secondary">Categorias: {validationResult.stats.categories}</Badge>
                      <Badge variant="secondary">Subcategorias: {validationResult.stats.subcategories}</Badge>
                      <Badge variant="secondary">Avarias: {validationResult.stats.damageTypes}</Badge>
                      <Badge variant="secondary">Matriz: {validationResult.stats.damageMatrix}</Badge>
                      <Badge variant="secondary">Máquinas: {validationResult.stats.cardMachines}</Badge>
                      <Badge variant="secondary">Usuários: {validationResult.stats.users}</Badge>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Dados inválidos</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {validationResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}