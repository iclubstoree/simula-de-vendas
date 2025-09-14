import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  searchModels, 
  formatCurrency, 
  damageTypes, 
  tradeInDevices, 
  PhoneModel,
  TradeInDevice,
  DamageType 
} from "@/data/mockData";
import { StandaloneCurrencyInput } from "@/lib/ControlledCurrencyInput";
import { parseInputToCents } from "@/lib/currency";

interface TradeInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (value: number) => void;
  store: string;
}

export function TradeInModal({ open, onOpenChange, onApply, store }: TradeInModalProps) {
  const [modelQuery, setModelQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState<PhoneModel | null>(null);
  const [selectedTradeIn, setSelectedTradeIn] = useState<TradeInDevice | null>(null);
  const [finalValueCents, setFinalValueCents] = useState(0);
  const [selectedDamages, setSelectedDamages] = useState<string[]>([]);
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);
  const [modelSuggestions, setModelSuggestions] = useState<PhoneModel[]>([]);
  const { toast } = useToast();



  const handleModelInputChange = (value: string) => {
    setModelQuery(value);
    
    // If there's already a selected model and user is typing, clear it for new selection
    if (selectedModel && value !== selectedModel.name) {
      setSelectedModel(null);
      setSelectedTradeIn(null);
      setFinalValueCents(0);
      setSelectedDamages([]);
    }
    
    if (value.trim()) {
      const suggestions = searchModels(value, 'seminovo', store);
      setModelSuggestions(suggestions);
      setShowModelSuggestions(suggestions.length > 0);
    } else {
      setModelSuggestions([]);
      setShowModelSuggestions(false);
    }
  };

  const handleModelFocus = () => {
    // If there's a selected model, clear it for new selection
    if (selectedModel) {
      setModelQuery("");
      setSelectedModel(null);
      setSelectedTradeIn(null);
      setFinalValueCents(0);
      setSelectedDamages([]);
    }
  };

  const handleModelSelect = (model: PhoneModel) => {
    setModelQuery(model.name);
    setSelectedModel(model);
    setShowModelSuggestions(false);
    
    // Find trade-in device for this model
    const tradeIn = tradeInDevices.find(device => device.modelId === model.id && device.store === store);
    setSelectedTradeIn(tradeIn || null);
    
    // Don't auto-fill the final value, leave empty for user to fill
    setFinalValueCents(0);
    
    // Reset damages
    setSelectedDamages([]);
  };

  const handleDamageChange = (damageId: string, checked: boolean) => {
    if (checked) {
      setSelectedDamages(prev => [...prev, damageId]);
    } else {
      setSelectedDamages(prev => prev.filter(id => id !== damageId));
    }
  };

  const calculateSuggestedValue = () => {
    if (!selectedTradeIn) return 0;
    
    const totalDiscount = selectedDamages.reduce((total, damageId) => {
      const damage = damageTypes.find(d => d.id === damageId);
      return total + (damage?.discount || 0);
    }, 0);
    
    return Math.max(0, selectedTradeIn.maxValue - totalDiscount);
  };

  const suggestedValue = calculateSuggestedValue();

  // Remove auto-suggestion of value - user should manually input

  const resetModal = () => {
    setModelQuery("");
    setSelectedModel(null);
    setSelectedTradeIn(null);
    setFinalValueCents(0);
    setSelectedDamages([]);
    setShowModelSuggestions(false);
  };

  const handleApply = () => {
    const value = finalValueCents / 100; // Converte cents para reais
    
    // Basic validation
    if (value < 0) {
      toast({
        title: "Valor inválido",
        description: "O valor não pode ser negativo",
        variant: "destructive",
      });
      return;
    }

    // Trade-in device specific validation
    if (selectedTradeIn) {
      // Calculate total discounts
      const totalDiscounts = selectedDamages.reduce((total, damageId) => {
        const damage = damageTypes.find(d => d.id === damageId);
        return total + (damage?.discount || 0);
      }, 0);

      // Max allowed value with discounts
      const maxAllowedValue = selectedTradeIn.maxValue - totalDiscounts;

      // Validation: cannot exceed max value
      if (value > selectedTradeIn.maxValue) {
        toast({
          title: "Valor inválido",
          description: `O valor final não pode ser maior que o valor máximo (${formatCurrency(selectedTradeIn.maxValue)})`,
          variant: "destructive",
        });
        return;
      }

      // Validation: final value cannot exceed max - discounts (always apply this limit)
      if (value > maxAllowedValue) {
        toast({
          title: "Valor inválido",
          description: `Com os descontos selecionados, o valor máximo permitido é ${formatCurrency(maxAllowedValue)}`,
          variant: "destructive",
        });
        return;
      }

      // Validation: cannot be less than minimum value
      if (value < selectedTradeIn.minValue && value > 0) {
        toast({
          title: "Valor muito baixo",
          description: `O valor mínimo para este aparelho é ${formatCurrency(selectedTradeIn.minValue)}`,
          variant: "destructive",
        });
        return;
      }
    }
    
    onApply(value);
    onOpenChange(false);
    toast({
      title: "Aplicado ao orçamento",
      description: `Aparelho de entrada: ${formatCurrency(value)}`,
    });
    resetModal();
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetModal();
  };

  const handleReset = () => {
    setSelectedDamages([]);
    if (selectedTradeIn) {
      setFinalValue(formatCurrency(selectedTradeIn.maxValue));
    }
  };

  useEffect(() => {
    if (!open) {
      resetModal();
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.autocomplete-container')) {
        setShowModelSuggestions(false);
      }
    };

    if (showModelSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showModelSuggestions]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aparelho de Entrada</DialogTitle>
          <DialogDescription>
            Selecione o modelo do aparelho de entrada e avalie seu estado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Direct Model Input */}
          <div className="relative autocomplete-container">
            <Label htmlFor="trade-model">Modelo do aparelho (seminovo)</Label>
            <Input
              id="trade-model"
              value={modelQuery}
              onChange={(e) => handleModelInputChange(e.target.value)}
              onFocus={handleModelFocus}
              placeholder="Ex: iPhone 14 Pro 128GB, Samsung Galaxy S23"
              className="mt-1"
            />
            
            {/* Autocomplete suggestions */}
            {showModelSuggestions && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {modelSuggestions.map(suggestion => (
                  <button 
                    key={suggestion.id} 
                    className="w-full text-left p-3 hover:bg-accent border-b last:border-0 transition-colors" 
                    onClick={() => handleModelSelect(suggestion)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{suggestion.name}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {suggestion.storage}GB
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Seminovo
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-primary ml-2">
                        {formatCurrency(suggestion.price)}
                      </p>
                    </div>
                  </button>
                ))}
                
                {modelQuery.trim() && modelSuggestions.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Nenhum modelo seminovo encontrado para "{modelQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Value Range - Only show when a trade-in device is found */}
          {selectedTradeIn && (
            <div>
              <Label>Faixa de Valor</Label>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Min da loja</Label>
                  <div className="p-3 bg-muted rounded-md text-sm font-medium">
                    {formatCurrency(selectedTradeIn.minValue)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Máx da loja</Label>
                  <div className="p-3 bg-muted rounded-md text-sm font-medium">
                    {formatCurrency(selectedTradeIn.maxValue)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Condition Assessment */}
          <div>
            <Label>Estado do aparelho</Label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {damageTypes.map((damage) => (
                <div key={damage.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={damage.id}
                    checked={selectedDamages.includes(damage.id)}
                    onCheckedChange={(checked) => handleDamageChange(damage.id, checked as boolean)}
                  />
                  <Label htmlFor={damage.id} className="text-sm">
                    {damage.name} (-{formatCurrency(damage.discount)})
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Calculation Summary */}
          {selectedTradeIn && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-3">Resumo de cálculo</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Descontos selecionados:</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(selectedDamages.reduce((total, damageId) => {
                      const damage = damageTypes.find(d => d.id === damageId);
                      return total + (damage?.discount || 0);
                    }, 0))}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Valor sugerido:</span>
                  <span className="text-primary">
                    {(() => {
                      const totalDiscounts = selectedDamages.reduce((total, damageId) => {
                        const damage = damageTypes.find(d => d.id === damageId);
                        return total + (damage?.discount || 0);
                      }, 0);
                      const minSuggested = Math.max(0, selectedTradeIn.minValue - totalDiscounts);
                      const maxSuggested = Math.max(0, selectedTradeIn.maxValue - totalDiscounts);
                      return `${formatCurrency(minSuggested)} - ${formatCurrency(maxSuggested)}`;
                    })()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Final Value Input */}
          <div>
            <Label htmlFor="final-value">Valor final da avaliação (R$)</Label>
            <StandaloneCurrencyInput
              id="final-value"
              value={finalValueCents}
              onChange={setFinalValueCents}
              placeholder="R$ 0,00"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Digite o valor final após avaliação do aparelho
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleApply} 
            disabled={!modelQuery.trim() || finalValueCents === 0}
            className="bg-success hover:bg-success/90"
          >
            Aplicar
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          {modelQuery.trim() && (
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Resetar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}