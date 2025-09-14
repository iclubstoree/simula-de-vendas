import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calculator, 
  Plus, 
  Settings, 
  Search, 
  Keyboard, 
  MousePointer,
  ArrowRight,
  CheckCircle,
  Info,
  Zap
} from "lucide-react";

const Tutorial = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Tutorial do Sistema</h1>
        <p className="text-muted-foreground text-lg">
          Aprenda a usar o iClub Vendas de forma eficiente
        </p>
      </div>

      {/* Como Usar o Simulador */}
      <Card className="card-animate hover-float">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <CardTitle>Como Usar o Simulador de Vendas</CardTitle>
          </div>
          <CardDescription>
            Passo a passo para realizar uma simulação completa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold">Selecione a Loja</h4>
                <p className="text-muted-foreground text-sm">Escolha a loja onde a venda será realizada</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold">Digite o Modelo</h4>
                <p className="text-muted-foreground text-sm">Use o autocomplete para encontrar o produto desejado</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold">Configure Valores</h4>
                <p className="text-muted-foreground text-sm">Ajuste preenchimento, entrada e aparelho de troca</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <h4 className="font-semibold">Escolha a Máquina</h4>
                <p className="text-muted-foreground text-sm">Selecione a máquina de cartão e veja as opções de parcelamento</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">5</div>
              <div>
                <h4 className="font-semibold">Copie o Orçamento</h4>
                <p className="text-muted-foreground text-sm">Use os botões para copiar o orçamento formatado</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Atalhos do Teclado */}
      <Card className="card-animate hover-float">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Keyboard className="h-6 w-6 text-primary" />
            <CardTitle>Atalhos do Teclado</CardTitle>
          </div>
          <CardDescription>
            Acelere seu trabalho com estes atalhos úteis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">Focar no campo modelo</span>
                <Badge variant="secondary">Ctrl + M</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">Abrir configurações</span>
                <Badge variant="secondary">Ctrl + ,</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">Novo orçamento</span>
                <Badge variant="secondary">Ctrl + N</Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">Copiar orçamento</span>
                <Badge variant="secondary">Ctrl + C</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">Abrir dashboard</span>
                <Badge variant="secondary">Ctrl + D</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">Adicionar entrada</span>
                <Badge variant="secondary">Ctrl + E</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funcionalidades Principais */}
      <Card className="card-animate hover-float">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <CardTitle>Funcionalidades Principais</CardTitle>
          </div>
          <CardDescription>
            Conheça os recursos mais importantes do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Search className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Busca Inteligente</h4>
                  <p className="text-muted-foreground text-sm">
                    O sistema encontra produtos mesmo com busca parcial
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Plus className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Aparelho de Entrada</h4>
                  <p className="text-muted-foreground text-sm">
                    Avalie aparelhos usados com sistema de danos automático
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Validações Automáticas</h4>
                  <p className="text-muted-foreground text-sm">
                    O sistema valida valores e previne erros
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MousePointer className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Interface Intuitiva</h4>
                  <p className="text-muted-foreground text-sm">
                    Navegação simples e design responsivo
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Settings className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Configuração Flexível</h4>
                  <p className="text-muted-foreground text-sm">
                    Personalize produtos, lojas e máquinas
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Fluxo Otimizado</h4>
                  <p className="text-muted-foreground text-sm">
                    Processo de venda rápido e eficiente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dicas Importantes */}
      <Card className="card-animate hover-float">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-6 w-6 text-primary" />
            <CardTitle>Dicas Importantes</CardTitle>
          </div>
          <CardDescription>
            Dicas para usar o sistema de forma mais eficiente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
              <h4 className="font-semibold text-blue-900">💡 Dica de Busca</h4>
              <p className="text-blue-800 text-sm mt-1">
                Digite apenas parte do nome do produto. Ex: "iphone 14" encontra "iPhone 14 Pro 128GB"
              </p>
            </div>
            
            <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
              <h4 className="font-semibold text-green-900">✅ Validação de Entrada</h4>
              <p className="text-green-800 text-sm mt-1">
                O sistema calcula automaticamente os valores máximos permitidos para aparelhos de entrada
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
              <h4 className="font-semibold text-yellow-900">⚡ Performance</h4>
              <p className="text-yellow-800 text-sm mt-1">
                Use os atalhos do teclado para trabalhar mais rapidamente
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg">
              <h4 className="font-semibold text-purple-900">🎯 Precisão</h4>
              <p className="text-purple-800 text-sm mt-1">
                Sempre verifique se a loja selecionada está correta antes de finalizar o orçamento
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tutorial;