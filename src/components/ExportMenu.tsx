import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { exportToPDF, exportToCSV, DashboardExportData } from "@/utils/exportUtils";

interface ExportMenuProps {
  data: DashboardExportData;
  filters?: {
    selectedStores: string[];
    selectedSellers: string[];
    selectedBrands: string[];
    selectedPaymentMethods: string[];
    selectedConditions: string[];
    selectedPeriod: string;
    customDateRange: {
      from: Date | undefined;
      to: Date | undefined;
    };
  };
}

export function ExportMenu({ data, filters }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const fileName = exportToPDF(data, filters);
      toast({
        title: "Exportação concluída",
        description: `Relatório PDF gerado: ${fileName}`,
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o arquivo PDF",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const fileName = exportToCSV(data, filters);
      toast({
        title: "Exportação concluída",
        description: `Arquivo CSV gerado: ${fileName}`,
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o arquivo CSV",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2" disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isExporting ? "Exportando..." : "Exportar"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Escolha o formato</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportPDF} disabled={isExporting}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Exportar PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV} disabled={isExporting}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Exportar CSV</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          {filters && Object.keys(filters).length > 0 
            ? "Com filtros aplicados" 
            : "Dados completos"}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}