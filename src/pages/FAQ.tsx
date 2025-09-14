import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Calculator, 
  Settings, 
  CreditCard,
  Smartphone,
  AlertCircle,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "simulador" | "configuracao" | "pagamento" | "geral";
  keywords: string[];
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "Como funciona o simulador de vendas?",
    answer: "O simulador permite criar orçamentos rápidos para clientes. Selecione a loja, digite o modelo do produto, configure valores de entrada e aparelho usado, escolha a máquina de cartão e copie o orçamento formatado.",
    category: "simulador",
    keywords: ["simulador", "orçamento", "venda", "como usar"]
  },
  {
    id: "2", 
    question: "Como adicionar um aparelho de entrada?",
    answer: "Clique no botão '+' ao lado de 'Aparelho de Entrada', digite o modelo do aparelho seminovo, selecione as avarias (se houver), e informe o valor final da avaliação. O sistema validará se o valor está dentro dos limites configurados.",
    category: "simulador",
    keywords: ["aparelho", "entrada", "troca", "usado", "seminovo"]
  },
  {
    id: "3",
    question: "Por que não aparecem sugestões quando digito um modelo?",
    answer: "Verifique se: 1) Uma loja foi selecionada, 2) O produto está cadastrado para essa loja, 3) O produto está ativo. Você pode verificar e cadastrar produtos em Configurações > Modelos para Adicionar.",
    category: "simulador", 
    keywords: ["autocomplete", "sugestoes", "modelo", "busca", "não aparece"]
  },
  {
    id: "4",
    question: "Como configurar uma nova loja?",
    answer: "Vá em Configurações > Lojas, clique em 'Nova Loja', preencha os dados (nome, endereço, telefone) e salve. Depois configure produtos e máquinas de cartão específicas para essa loja.",
    category: "configuracao",
    keywords: ["loja", "nova", "configurar", "cadastrar"]
  },
  {
    id: "5",
    question: "Como adicionar novos produtos?",
    answer: "Acesse Configurações > Modelos para Adicionar, clique em 'Novo Modelo', preencha nome, categoria, subcategoria, storage, preço e selecione as lojas onde estará disponível.",
    category: "configuracao", 
    keywords: ["produto", "modelo", "novo", "cadastrar", "adicionar"]
  },
  {
    id: "6",
    question: "Como configurar máquinas de cartão?",
    answer: "Em Configurações > Máquinas de Cartão, cadastre as máquinas disponíveis com suas respectivas taxas de juros para cada quantidade de parcelas. Depois associe cada máquina às lojas correspondentes.",
    category: "configuracao",
    keywords: ["máquina", "cartão", "taxa", "juros", "parcelas"]
  },
  {
    id: "7",
    question: "Por que o parcelamento não aparece?",
    answer: "Certifique-se de que: 1) Uma máquina de cartão foi selecionada, 2) A máquina está configurada para a loja atual, 3) Há valor a ser financiado (preço - entrada - aparelho usado > 0).",
    category: "pagamento",
    keywords: ["parcelamento", "cartão", "não aparece", "financiamento"]
  },
  {
    id: "8", 
    question: "Como funcionam as taxas de juros?",
    answer: "Cada máquina de cartão tem suas próprias taxas configuradas por quantidade de parcelas. O sistema calcula automaticamente o valor total e das parcelas baseado nessas taxas.",
    category: "pagamento",
    keywords: ["juros", "taxa", "cálculo", "parcelas"]
  },
  {
    id: "9",
    question: "Posso usar o sistema em qualquer dispositivo?",
    answer: "Sim! O sistema é responsivo e funciona em computadores, tablets e smartphones. A interface se adapta automaticamente ao tamanho da tela.",
    category: "geral",
    keywords: ["dispositivo", "mobile", "responsivo", "tablet", "celular"]
  },
  {
    id: "10",
    question: "Os dados ficam salvos no navegador?",
    answer: "Sim, o sistema salva automaticamente suas configurações, histórico de buscas e preferências no navegador. Os dados ficam disponíveis mesmo após fechar e reabrir o sistema.",
    category: "geral", 
    keywords: ["dados", "salvar", "navegador", "localStorage", "histórico"]
  },
  {
    id: "11",
    question: "Como limpar o histórico de buscas?",
    answer: "No simulador, quando aparecem as sugestões de busca recente, clique no botão 'Limpar Histórico' para remover todas as buscas anteriores.",
    category: "geral",
    keywords: ["histórico", "limpar", "buscas", "recentes"]
  },
  {
    id: "12",
    question: "Existe limite de aparelhos de entrada?",
    answer: "Não há limite técnico, mas recomendamos avaliar no máximo 2-3 aparelhos por venda para manter o orçamento claro para o cliente.",
    category: "simulador",
    keywords: ["limite", "aparelhos", "entrada", "quantidade"]
  }
];

const categoryInfo = {
  simulador: { icon: Calculator, label: "Simulador", color: "bg-blue-100 text-blue-800" },
  configuracao: { icon: Settings, label: "Configuração", color: "bg-green-100 text-green-800" },
  pagamento: { icon: CreditCard, label: "Pagamento", color: "bg-purple-100 text-purple-800" },
  geral: { icon: HelpCircle, label: "Geral", color: "bg-gray-100 text-gray-800" }
};

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = searchTerm === "" || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const categories = Object.entries(categoryInfo);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Perguntas Frequentes</h1>
        <p className="text-muted-foreground text-lg">
          Encontre respostas para as dúvidas mais comuns sobre o sistema
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="card-animate hover-float">
        <CardHeader>
          <CardTitle>Buscar FAQ</CardTitle>
          <CardDescription>
            Digite sua dúvida ou selecione uma categoria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ex: como adicionar produto, parcelamento, máquina cartão..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedCategory === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory("all")}
            >
              Todas ({faqData.length})
            </Badge>
            {categories.map(([key, info]) => {
              const count = faqData.filter(faq => faq.category === key).length;
              return (
                <Badge
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(key)}
                >
                  <info.icon className="h-3 w-3 mr-1" />
                  {info.label} ({count})
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Results */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma FAQ encontrada</h3>
              <p className="text-muted-foreground">
                Tente buscar com outros termos ou selecione uma categoria diferente
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {filteredFAQs.length} pergunta{filteredFAQs.length !== 1 ? 's' : ''} encontrada{filteredFAQs.length !== 1 ? 's' : ''}
            </p>
            
            {filteredFAQs.map((faq) => {
              const categoryData = categoryInfo[faq.category];
              const isOpen = openItems.includes(faq.id);
              
              return (
                <Card key={faq.id} className="transition-all duration-200 hover:shadow-md">
                  <Collapsible>
                    <CollapsibleTrigger 
                      className="w-full"
                      onClick={() => toggleItem(faq.id)}
                    >
                      <CardHeader className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-3 text-left">
                            <categoryData.icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <div className="space-y-2">
                              <CardTitle className="text-base leading-relaxed">
                                {faq.question}
                              </CardTitle>
                              <Badge variant="secondary" className={cn("text-xs", categoryData.color)}>
                                {categoryData.label}
                              </Badge>
                            </div>
                          </div>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="flex gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div className="space-y-3">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                            {faq.keywords.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                <span className="text-xs text-muted-foreground">Tags:</span>
                                {faq.keywords.map((keyword, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Help Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <HelpCircle className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Ainda tem dúvidas?</h3>
          </div>
          <p className="text-blue-800 mb-4">
            Se não encontrou a resposta que procurava, consulte o Tutorial para um guia completo do sistema.
          </p>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-white">
              📚 Tutorial disponível no menu lateral
            </Badge>
            <Badge variant="outline" className="bg-white">
              ⚡ Atalhos do teclado incluídos
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQ;