import React, { useState, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PhoneModel, RecentSearch } from "@/data/mockData";
import { useRecentSearches } from "@/hooks/useLocalStorage";

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
  onModelSelect: (model: PhoneModel) => void;
  searchFunction: (query: string, type?: 'novo' | 'seminovo', store?: string) => PhoneModel[];
  selectedStore?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function ProductSearch({
  value,
  onChange,
  onModelSelect,
  searchFunction,
  selectedStore,
  disabled = false,
  placeholder = "Digite o modelo do celular"
}: ProductSearchProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<PhoneModel[]>([]);
  const [modelWasSelected, setModelWasSelected] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Use the reusable localStorage hook for recent searches
  const {
    searches: recentSearches,
    addSearch,
    clearSearches
  } = useRecentSearches('sales-simulator-search-history', 10);

  // Handle input change with search
  const handleInputChange = useCallback((newValue: string) => {
    onChange(newValue);

    if (newValue.trim() && selectedStore) {
      const results = searchFunction(newValue, 'novo', selectedStore);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(newValue.trim() === '' && recentSearches.length > 0);
    }
  }, [onChange, searchFunction, selectedStore, recentSearches.length]);

  // Handle input focus
  const handleFocus = useCallback(() => {
    // Clear selection if model was previously selected
    if (modelWasSelected) {
      onChange("");
      setModelWasSelected(false);
    }

    // Show recent searches when focusing empty input
    if (!value.trim() && recentSearches.length > 0) {
      setShowSuggestions(true);
    }
  }, [modelWasSelected, value, recentSearches.length, onChange]);

  // Handle input blur (with delay for clicks)
  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  }, []);

  // Handle model selection from suggestions
  const handleModelSelect = useCallback((model: PhoneModel) => {
    onChange(model.name);
    setModelWasSelected(true);
    setShowSuggestions(false);

    // Add to search history
    addSearch(model.name, 1);

    // Notify parent component
    onModelSelect(model);

    toast({
      title: "Modelo selecionado",
      description: `${model.name} - R$ ${model.price?.toFixed(2) || '0,00'}`,
      duration: 2000
    });
  }, [onChange, onModelSelect, addSearch, toast]);

  // Handle recent search click
  const handleRecentSearchClick = useCallback((query: string) => {
    if (selectedStore) {
      const results = searchFunction(query, 'novo', selectedStore);
      if (results.length > 0) {
        const exactMatch = results.find(s => s.name.toLowerCase() === query.toLowerCase());
        const modelToSelect = exactMatch || results[0];
        handleModelSelect(modelToSelect);
      }
    }
  }, [selectedStore, searchFunction, handleModelSelect]);

  // Clear recent searches
  const handleClearRecentSearches = useCallback(() => {
    clearSearches();
    toast({
      title: "Pesquisas limpas",
      description: "Histórico de pesquisas foi removido",
      duration: 2000
    });
  }, [clearSearches, toast]);

  const effectivePlaceholder = selectedStore ? placeholder : "Selecione uma loja primeiro";

  return (
    <div className="relative">
      <Label htmlFor="model">Modelo:</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="model"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={effectivePlaceholder}
          className="pr-10"
          disabled={disabled || !selectedStore}
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {value.trim() === '' && recentSearches.length > 0 ? (
            // Recent searches
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Últimas pesquisas
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearRecentSearches}
                  className="h-5 px-2 text-xs"
                >
                  Limpar
                </Button>
              </div>
              {recentSearches.slice(0, 5).map((search) => (
                <button
                  key={search.id}
                  className="w-full text-left px-2 py-1 text-sm hover:bg-accent rounded text-muted-foreground"
                  onClick={() => handleRecentSearchClick(search.query)}
                >
                  {search.query}
                </button>
              ))}
            </div>
          ) : (
            // Model suggestions
            <>
              {suggestions.map((suggestion) => (
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
                          {suggestion.category}
                        </Badge>
                        <Badge variant="default" className="text-xs">
                          novo
                        </Badge>
                      </div>
                    </div>
                    <p className="font-bold text-primary text-sm">
                      R$ {suggestion.price?.toFixed(2) || '0,00'}
                    </p>
                  </div>
                </button>
              ))}

              {value.trim() && suggestions.length === 0 && (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  Nenhum modelo encontrado para "{value}" na loja selecionada
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}