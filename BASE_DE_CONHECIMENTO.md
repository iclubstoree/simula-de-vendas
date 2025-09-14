# 📱 iClub — Simulador de Vendas

Um sistema SaaS de simulação e orçamentos de celulares, desenvolvido para lojas e redes varejistas, que padroniza o atendimento, elimina erros de cálculo e permite que lojistas e vendedores avaliem aparelhos de entrada com praticidade e autonomia.

## 🚀 Funcionalidades Principais

### 📊 Dashboard Inteligente
- Visão 360° dos orçamentos por loja, vendedor e período.
- KPIs principais: número de simulações, ticket médio, % com entrada, % em 12x.
- Gráficos interativos de tendência de modelos, mix de parcelamento e horários de pico.
- Ranking de vendedores com gamificação (medalhas).
- Últimas simulações listadas com acesso rápido.

### 🧮 Simulador de Orçamentos
- Autocomplete de modelos (com histórico de pesquisas recentes).
- Valor do produto preenchido automaticamente, mas editável com máscara BRL.
- Entrada manual ou via modal de aparelho de entrada:
  - Seleção de aparelho seminovo.
  - Faixa min/máx configurada por loja.
  - Checklist de avarias por subcategoria (ex.: display, bateria, carcaça).
  - Valor sugerido calculado automaticamente.
- Orçamentos prontos:
  - Texto à vista.
  - Texto em 12x (usando exatamente a parcela n=12).
  - Texto com aparelho de entrada ("a volta é de R$ X").
- Tabela de Parcelas:
  - Débito + 1 até 21x.
  - Seleção de máquina (quando houver mais de uma).
  - Cada linha com botão copiar orçamento.

## ⚙️ Configurações Avançadas

CRUD completo para:
- Lojas: preços, taxas e entradas min/máx por loja.
- Modelos: novos e seminovos, categorias, subcategorias, texto padrão de orçamento.
- Aparelhos de Entrada: apenas seminovos, com valores min/máx.
- Matriz de Avarias: valores de desconto por subcategoria × avaria.
- Taxas: cadastro de máquinas de cartão e taxas por parcela.
- Usuários: dono, gerente e vendedor, com permissões granulares.
- Exportar/Importar JSON com pré-visualização e toasts.

## 🧠 Análises Inteligentes
- Tendência de modelos (crescimento/queda %).
- Preferência de parcelamento (débito vs 12x).
- Impacto de entrada e avarias nas simulações.
- Insights personalizados por vendedor.
- Alertas de queda brusca (>25%) em simulações.
- Sugestões práticas de preço, estoque e treinamento.

## 🔔 Notificações
- Vendedor: alerta de queda de preço de modelos.
- Administrador/Gerente: alertas de estoque e desempenho da equipe.
- Centro de notificações no header com badge e dropdown.

## 🎨 Experiência do Usuário (UX/UI)

### 🖥️ Interface Moderna
- Tailwind CSS + shadcn/ui para consistência visual.
- Sidebar animada (colapsável/expandida).
- Header glassmorphism fixo com notificações e perfil.
- Cards arredondados com hover-float e press effect.
- Dark/Light Mode persistente.
- Toasts modernos para feedback rápido.
- Skeleton shimmer em carregamentos.

### 🎯 Fluxo de Experiência
- Início: acesso ao Dashboard ou Simulador da loja.
- Simulação:
  - Seleciona modelo→preço é preenchido.
  - Adiciona entrada ou aparelho→recalcula orçamento.
  - Visualiza orçamentos prontos e tabela de parcelas.
  - Copia com 1 clique.
- Configurações: administrador ajusta modelos, taxas e avarias.
- Dashboard: gestor acompanha métricas, rankings e insights.

### 📱 Mobile-First
- Sidebar vira drawer.
- Tabelas responsivas com scroll.
- Botões maiores (touch-friendly).
- Modais otimizados para telas pequenas.

## 🛠 Tecnologias Utilizadas
- React 18 + TypeScript
- Vite para build rápido
- Tailwind CSS para estilo utilitário
- shadcn/ui para componentes prontos
- Lucide Icons para iconografia
- React Hook Form + Zod para formulários
- TanStack Table para tabelas
- Recharts/ApexCharts para gráficos
- Sonner para notificações
- kbar (Command Palette) opcional

## 📐 Regras de Cálculo

```
valorBase = max(0, valorProduto − entrada − aparelhoEntrada)

Para cada n (0 = Débito, 1..21 = parcelas):
  parcelas = (n→0 ? 1 : n)
  t = taxas[n] / 100
  totalTeorico = valorBase / (1 − t)
  Total = floor(totalTeorico, 2)
  Loop: enquanto Total * (1 − t) < valorBase, adicionar +R$ 0,01
  Parcela = Total / parcelas

Exibição:
  n=0→"Débito: R$ [Parcela]"
  n≥1→"N× de R$ [Parcela]"
  Se houver entrada→prefixar "R$ [entrada] + …"

12x usa exatamente a parcela de n=12.
Total exibido: apenas o valor financiado (não soma entrada).
```

## ✅ Definition of Done
- Máscara BRL perfeita (caret lógico).
- Modal de aparelho: min/máx, avarias, valor sugerido, validação ≤ Máx.
- Orçamentos readonly com botão copiar funcionando.
- Tabela Débito + 1..21x correta, com select de máquina se houver.
- Configurações persistem e refletem no simulador sem reload.
- Dashboard responsivo com KPIs, gráficos e insights.