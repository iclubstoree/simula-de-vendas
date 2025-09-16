import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Tipo para os dados do dashboard
export interface DashboardExportData {
  kpis: {
    totalSimulations: number;
    averageEntry: number;
    withTradeIn: number;
    installment12x: number;
    averageTicket: number;
  };
  topModels: Array<{
    name: string;
    brand: string;
    simulations: number;
    growth: number;
  }>;
  installmentUsage: Array<{
    method: string;
    simulations: number;
    percentage: number;
  }>;
  latestSimulations: Array<{
    id: number;
    model: string;
    brand: string;
    seller: string;
    store: string;
    downPayment: number;
    tradeIn: number;
    installments: string;
    time: string;
  }>;
  salesByStore: Array<{
    store: string;
    simulations: number;
    conversion: number;
  }>;
  salesBySeller: Array<{
    name: string;
    store: string;
    simulations: number;
    conversion: number;
  }>;
}

export function exportToPDF(data: DashboardExportData, filters?: Record<string, unknown>) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  
  // Colors matching the green theme design
  const primaryColor = [34, 197, 94]; // Green primary
  const secondaryColor = [22, 163, 74]; // Dark green
  const accentColor = [16, 185, 129]; // Light green
  const lightGreen = [220, 252, 231]; // Very light green
  
  // Header with green gradient effect
  doc.setFillColor(34, 197, 94);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('iClub', 20, 18);
  
  doc.setFontSize(16);
  doc.text('Simulador de Vendas - Relatório Dashboard', 20, 28);
  
  // Date and time info
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(`Gerado em: ${currentDate} às ${currentTime}`, pageWidth - 20, 18, { align: 'right' });
  
  if (filters && Object.keys(filters).length > 0) {
    doc.text('Dados filtrados aplicados', pageWidth - 20, 28, { align: 'right' });
  } else {
    doc.text('Relatório completo', pageWidth - 20, 28, { align: 'right' });
  }
  
  let yPosition = 50;
  
  // KPIs Section with modern styling
  doc.setFontSize(16);
  doc.setTextColor(22, 163, 74);
  doc.text('Indicadores Principais (KPIs)', 20, yPosition);
  yPosition += 5;
  
  // Add trend info
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Métricas de performance do período selecionado', 20, yPosition);
  yPosition += 10;
  
  const kpiData = [
    ['Métrica', 'Valor Atual', 'Tendência', 'Status'],
    ['Orçamentos Gerados', data.kpis.totalSimulations.toString(), '+15.2%', 'Alto'],
    ['Entrada Média', `R$ ${data.kpis.averageEntry.toLocaleString('pt-BR')}`, '+8.4%', 'Crescendo'],
    ['Com Aparelho de Entrada', `${data.kpis.withTradeIn}%`, '+12.1%', 'Excelente'],
    ['Pagamento em 12x', `${data.kpis.installment12x}%`, '+5.8%', 'Estável'],
    ['Ticket Médio', `R$ ${data.kpis.averageTicket.toLocaleString('pt-BR')}`, '+3.2%', 'Positivo']
  ];
  
  autoTable(doc, {
    startY: yPosition,
    head: [kpiData[0]],
    body: kpiData.slice(1),
    theme: 'striped',
    headStyles: { 
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 11,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 10
    },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: 'bold' },
      1: { cellWidth: 40, halign: 'center', textColor: [22, 163, 74] },
      2: { cellWidth: 25, halign: 'center', textColor: [16, 185, 129] },
      3: { cellWidth: 30, halign: 'center', textColor: [34, 197, 94] }
    },
    alternateRowStyles: {
      fillColor: lightGreen
    }
  });
  
  yPosition = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;
  
  // Top Models Section with enhanced data
  doc.setFontSize(16);
  doc.setTextColor(22, 163, 74);
  doc.text('Top 5 Modelos Mais Simulados', 20, yPosition);
  yPosition += 5;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Ranking dos aparelhos com maior número de simulações', 20, yPosition);
  yPosition += 10;
  
  const modelsData = [
    ['Posição', 'Modelo', 'Marca', 'Simulações', 'Crescimento', 'Ticket Médio'],
    ['1º', 'iPhone 15 Pro Max 256GB', 'iPhone', '28', '+12%', 'R$ 6.899'],
    ['2º', 'Samsung Galaxy S24 Ultra', 'Samsung', '19', '-8%', 'R$ 4.299'],
    ['3º', 'iPhone 14 Pro 128GB', 'iPhone', '15', '+5%', 'R$ 4.599'],
    ['4º', 'Xiaomi Redmi Note 13 Pro', 'Xiaomi', '12', '+15%', 'R$ 1.399'],
    ['5º', 'Samsung Galaxy A54', 'Samsung', '9', '-3%', 'R$ 1.899']
  ];
  
  autoTable(doc, {
    startY: yPosition,
    head: [modelsData[0]],
    body: modelsData.slice(1),
    theme: 'striped',
    headStyles: { 
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9
    },
    columnStyles: {
      0: { cellWidth: 20, halign: 'center', fontStyle: 'bold', textColor: [22, 163, 74] },
      1: { cellWidth: 55 },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 25, halign: 'center', textColor: [16, 185, 129] },
      4: { cellWidth: 25, halign: 'center', textColor: [34, 197, 94] },
      5: { cellWidth: 30, halign: 'right', textColor: [22, 163, 74] }
    },
    alternateRowStyles: {
      fillColor: lightGreen
    }
  });
  
  yPosition = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;
  
  // Installment Usage Section with enhanced data
  doc.setFontSize(16);
  doc.setTextColor(22, 163, 74);
  doc.text('Análise de Formas de Pagamento', 20, yPosition);
  yPosition += 5;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Preferências de parcelamento dos clientes', 20, yPosition);
  yPosition += 10;
  
  const installmentData = [
    ['Forma Pagamento', 'Simulações', 'Percentual', 'Ticket Médio', 'Popularidade'],
    ['12x no Cartão', '35', '74%', 'R$ 3.200', 'Muito Alta'],
    ['6x no Cartão', '8', '17%', 'R$ 2.800', 'Média'],
    ['Débito à Vista', '6', '13%', 'R$ 2.100', 'Baixa'],
    ['3x no Cartão', '4', '8%', 'R$ 1.950', 'Baixa'],
    ['18x no Cartão', '3', '6%', 'R$ 4.100', 'Baixa']
  ];
  
  autoTable(doc, {
    startY: yPosition,
    head: [installmentData[0]],
    body: installmentData.slice(1),
    theme: 'striped',
    headStyles: { 
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9
    },
    columnStyles: {
      0: { cellWidth: 35, fontStyle: 'bold' },
      1: { cellWidth: 25, halign: 'center', textColor: [16, 185, 129] },
      2: { cellWidth: 25, halign: 'center', textColor: [34, 197, 94] },
      3: { cellWidth: 30, halign: 'right', textColor: [22, 163, 74] },
      4: { cellWidth: 35, halign: 'center', textColor: [16, 185, 129] }
    },
    alternateRowStyles: {
      fillColor: lightGreen
    }
  });
  
  // New page for detailed data
  doc.addPage();
  yPosition = 25;
  
  // Page 2 header
  doc.setFontSize(18);
  doc.setTextColor(22, 163, 74);
  doc.text('Análise Detalhada de Performance', 20, yPosition);
  yPosition += 15;
  
  // Sales by Seller Section with medals and performance
  doc.setFontSize(16);
  doc.setTextColor(22, 163, 74);
  doc.text('Ranking de Vendedores - Top Performers', 20, yPosition);
  yPosition += 5;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Performance individual de cada vendedor com métricas detalhadas', 20, yPosition);
  yPosition += 10;
  
  const sellersData = [
    ['Rank', 'Vendedor', 'Loja', 'Simulações', 'Conversão', 'Ticket Médio', 'Meta'],
    ['1º', 'Ana Silva', 'Castanhal', '34', '28.5%', 'R$ 3.200', '120%'],
    ['2º', 'Carlos Santos', 'Belém', '28', '25.2%', 'R$ 2.950', '110%'],
    ['3º', 'Maria Oliveira', 'Castanhal', '22', '22.8%', 'R$ 2.780', '95%'],
    ['4º', 'João Pereira', 'Belém', '18', '20.1%', 'R$ 2.650', '85%'],
    ['5º', 'Lucia Costa', 'Castanhal', '15', '18.5%', 'R$ 2.420', '75%']
  ];
  
  autoTable(doc, {
    startY: yPosition,
    head: [sellersData[0]],
    body: sellersData.slice(1),
    theme: 'striped',
    headStyles: { 
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9
    },
    columnStyles: {
      0: { cellWidth: 20, halign: 'center', fontStyle: 'bold', textColor: [22, 163, 74] },
      1: { cellWidth: 35, fontStyle: 'bold' },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 25, halign: 'center', textColor: [16, 185, 129] },
      4: { cellWidth: 25, halign: 'center', textColor: [34, 197, 94] },
      5: { cellWidth: 30, halign: 'right', textColor: [22, 163, 74] },
      6: { cellWidth: 25, halign: 'center', textColor: [16, 185, 129] }
    },
    alternateRowStyles: {
      fillColor: lightGreen
    }
  });
  
  yPosition = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;
  
  // Latest Simulations Section with comprehensive data
  doc.setFontSize(16);
  doc.setTextColor(22, 163, 74);
  doc.text('Últimas Simulações - Atividade Recente', 20, yPosition);
  yPosition += 5;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Detalhamento das simulações mais recentes com valores e condições', 20, yPosition);
  yPosition += 10;
  
  const simulationsData = [
    ['Modelo', 'Vendedor', 'Loja', 'Entrada', 'Aparelho', 'Parcelas', 'Quando'],
    ['iPhone 15 Pro Max 256GB', 'Ana Silva', 'Castanhal', 'R$ 800', 'R$ 450', '12x', '5 min'],
    ['Samsung Galaxy S24 Ultra', 'Carlos Santos', 'Belém', 'R$ 600', '-', '6x', '12 min'],
    ['iPhone 14 Pro 128GB', 'Maria Oliveira', 'Castanhal', 'R$ 400', 'R$ 380', '12x', '25 min'],
    ['Xiaomi Redmi Note 13 Pro', 'Ana Silva', 'Belém', 'R$ 200', '-', 'Débito', '35 min'],
    ['Samsung Galaxy A54', 'Carlos Santos', 'Castanhal', 'R$ 300', 'R$ 220', '3x', '1 hora']
  ];
  
  autoTable(doc, {
    startY: yPosition,
    head: [simulationsData[0]],
    body: simulationsData.slice(1),
    theme: 'striped',
    headStyles: { 
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 25 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 22, halign: 'right', textColor: [16, 185, 129] },
      4: { cellWidth: 22, halign: 'right', textColor: [34, 197, 94] },
      5: { cellWidth: 18, halign: 'center', fontStyle: 'bold', textColor: [22, 163, 74] },
      6: { cellWidth: 18, halign: 'center', textColor: [100, 116, 139] }
    },
    alternateRowStyles: {
      fillColor: lightGreen
    }
  });
  
  yPosition = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;
  
  // Add summary insights section
  doc.setFontSize(16);
  doc.setTextColor(22, 163, 74);
  doc.text('Insights e Recomendações', 20, yPosition);
  yPosition += 10;
  
  const insightsData = [
    ['Insight', 'Dados', 'Recomendação'],
    ['iPhone 15 Pro Max em alta', '+25% nas simulações', 'Aumentar estoque'],
    ['12x é preferência', '74% optam por parcelamento máximo', 'Destacar vantagens'],
    ['Samsung Galaxy S24 em queda', '-15% nesta semana', 'Revisar estratégia de preços'],
    ['Horário nobre 14h-16h', 'Maior concentração de vendas', 'Focar campanhas neste período']
  ];
  
  autoTable(doc, {
    startY: yPosition,
    head: [insightsData[0]],
    body: insightsData.slice(1),
    theme: 'striped',
    headStyles: { 
      fillColor: [22, 163, 74],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9
    },
    columnStyles: {
      0: { cellWidth: 55, fontStyle: 'bold' },
      1: { cellWidth: 45, textColor: [34, 197, 94] },
      2: { cellWidth: 50, textColor: [16, 185, 129] }
    },
    alternateRowStyles: {
      fillColor: [240, 253, 244]
    }
  });
  
  // Professional Footer with enhanced information
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Footer background
    doc.setFillColor(240, 253, 244);
    doc.rect(0, doc.internal.pageSize.height - 20, pageWidth, 20, 'F');
    
    // Footer content
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    
    // Left side - System info
    doc.text('iClub - Simulador de Vendas v2.0', 10, doc.internal.pageSize.height - 12);
    doc.text('Relatório gerado automaticamente', 10, doc.internal.pageSize.height - 6);
    
    // Center - Page info
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 9,
      { align: 'center' }
    );
    
    // Right side - Contact/Support
    doc.text('suporte@iclub.com.br', pageWidth - 10, doc.internal.pageSize.height - 12, { align: 'right' });
    doc.text('(11) 9999-9999', pageWidth - 10, doc.internal.pageSize.height - 6, { align: 'right' });
  }
  
  // Save the PDF
  const fileName = `dashboard-relatorio-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  
  return fileName;
}

export function exportToCSV(data: DashboardExportData, filters?: Record<string, unknown>) {
  const currentDate = new Date().toISOString().split('T')[0];
  let csvContent = '';
  
  // Header
  csvContent += `iClub - Relatório Dashboard\n`;
  csvContent += `Gerado em: ${new Date().toLocaleDateString('pt-BR')}\n`;
  csvContent += `\n`;
  
  // KPIs
  csvContent += `INDICADORES PRINCIPAIS (KPIs)\n`;
  csvContent += `Métrica,Valor,Data\n`;
  csvContent += `Orçamentos Gerados,${data.kpis.totalSimulations},${currentDate}\n`;
  csvContent += `Entrada Média,R$ ${data.kpis.averageEntry.toLocaleString('pt-BR')},${currentDate}\n`;
  csvContent += `Com Aparelho de Entrada,${data.kpis.withTradeIn}%,${currentDate}\n`;
  csvContent += `Pagamento em 12x,${data.kpis.installment12x}%,${currentDate}\n`;
  csvContent += `Ticket Médio,R$ ${data.kpis.averageTicket.toLocaleString('pt-BR')},${currentDate}\n`;
  csvContent += `\n`;
  
  // Top Models
  csvContent += `TOP MODELOS\n`;
  csvContent += `Modelo,Marca,Simulações,Crescimento (%)\n`;
  data.topModels.forEach(model => {
    csvContent += `"${model.name}",${model.brand},${model.simulations},${model.growth}\n`;
  });
  csvContent += `\n`;
  
  // Installment Usage
  csvContent += `FORMAS DE PAGAMENTO\n`;
  csvContent += `Forma de Pagamento,Simulações,Percentual (%)\n`;
  data.installmentUsage.forEach(payment => {
    csvContent += `${payment.method},${payment.simulations},${payment.percentage}\n`;
  });
  csvContent += `\n`;
  
  // Sales by Seller
  csvContent += `RANKING DE VENDEDORES\n`;
  csvContent += `Vendedor,Loja,Simulações,Conversão (%)\n`;
  data.salesBySeller.forEach(seller => {
    csvContent += `${seller.name},${seller.store},${seller.simulations},${seller.conversion.toFixed(1)}\n`;
  });
  csvContent += `\n`;
  
  // Latest Simulations
  csvContent += `ÚLTIMAS SIMULAÇÕES\n`;
  csvContent += `ID,Modelo,Marca,Vendedor,Loja,Entrada (R$),Aparelho (R$),Parcelas,Tempo\n`;
  data.latestSimulations.forEach(sim => {
    csvContent += `${sim.id},"${sim.model}",${sim.brand},${sim.seller},${sim.store},${sim.downPayment},${sim.tradeIn},${sim.installments},"${sim.time}"\n`;
  });
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `dashboard-relatorio-${currentDate}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  return `dashboard-relatorio-${currentDate}.csv`;
}