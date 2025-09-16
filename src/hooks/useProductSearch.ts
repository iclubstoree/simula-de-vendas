import { useState, useCallback } from 'react';
import { PhoneModel } from '@/data/mockData';
import { useRecentSearches } from '@/hooks/useLocalStorage';

export interface UseProductSearchProps {
  searchFunction: (query: string, type?: 'novo' | 'seminovo', store?: string) => PhoneModel[];
  selectedStore?: string;
  onModelSelect?: (model: PhoneModel) => void;
}

export interface UseProductSearchReturn {
  // Search state
  searchQuery: string;
  selectedModel: PhoneModel | null;
  suggestions: PhoneModel[];
  showSuggestions: boolean;

  // Search actions
  handleSearchChange: (query: string) => void;
  handleModelSelect: (model: PhoneModel) => void;
  handleFocus: () => void;
  handleBlur: () => void;
  clearSearch: () => void;

  // Recent searches
  recentSearches: Array<{ id: string; query: string; timestamp: string }>;
  handleRecentSearchClick: (query: string) => void;
  clearRecentSearches: () => void;
}

/**
 * Hook for managing product search functionality
 */
export function useProductSearch({
  searchFunction,
  selectedStore,
  onModelSelect
}: UseProductSearchProps): UseProductSearchReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<PhoneModel | null>(null);
  const [suggestions, setSuggestions] = useState<PhoneModel[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Recent searches management
  const {
    searches: recentSearches,
    addSearch,
    clearSearches
  } = useRecentSearches('sales-simulator-search-history', 10);

  // Handle search input change
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setSelectedModel(null); // Clear selected model when typing

    if (query.trim() && selectedStore) {
      const results = searchFunction(query, 'novo', selectedStore);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(query.trim() === '' && recentSearches.length > 0);
    }
  }, [searchFunction, selectedStore, recentSearches.length]);

  // Handle model selection
  const handleModelSelect = useCallback((model: PhoneModel) => {
    setSearchQuery(model.name);
    setSelectedModel(model);
    setShowSuggestions(false);

    // Add to recent searches
    addSearch(model.name, 1);

    // Notify parent component
    onModelSelect?.(model);
  }, [addSearch, onModelSelect]);

  // Handle input focus
  const handleFocus = useCallback(() => {
    // Clear previous selection when focusing to search again
    if (selectedModel) {
      setSearchQuery('');
      setSelectedModel(null);
    }

    // Show recent searches if input is empty
    if (!searchQuery.trim() && recentSearches.length > 0) {
      setShowSuggestions(true);
    }
  }, [selectedModel, searchQuery, recentSearches.length]);

  // Handle input blur (with delay for dropdown clicks)
  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  }, []);

  // Handle recent search click
  const handleRecentSearchClick = useCallback((query: string) => {
    if (selectedStore) {
      const results = searchFunction(query, 'novo', selectedStore);
      if (results.length > 0) {
        const exactMatch = results.find(result =>
          result.name.toLowerCase() === query.toLowerCase()
        );
        const modelToSelect = exactMatch || results[0];
        handleModelSelect(modelToSelect);
      }
    }
  }, [selectedStore, searchFunction, handleModelSelect]);

  // Clear search and selection
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSelectedModel(null);
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    clearSearches();
  }, [clearSearches]);

  return {
    // Search state
    searchQuery,
    selectedModel,
    suggestions,
    showSuggestions,

    // Search actions
    handleSearchChange,
    handleModelSelect,
    handleFocus,
    handleBlur,
    clearSearch,

    // Recent searches
    recentSearches,
    handleRecentSearchClick,
    clearRecentSearches
  };
}

/**
 * Hook for managing search filtering and categorization
 */
export function useSearchFiltering() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'novo' | 'seminovo' | ''>('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });

  const filterResults = useCallback((results: PhoneModel[]): PhoneModel[] => {
    return results.filter(model => {
      const categoryMatch = !selectedCategory || model.category === selectedCategory;
      const typeMatch = !selectedType || model.type === selectedType;
      const priceMatch = priceRange.max === 0 ||
        (model.price >= priceRange.min && model.price <= priceRange.max);

      return categoryMatch && typeMatch && priceMatch;
    });
  }, [selectedCategory, selectedType, priceRange]);

  const clearFilters = useCallback(() => {
    setSelectedCategory('');
    setSelectedType('');
    setPriceRange({ min: 0, max: 0 });
  }, []);

  return {
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    priceRange,
    setPriceRange,
    filterResults,
    clearFilters,
    hasActiveFilters: !!(selectedCategory || selectedType || priceRange.max > 0)
  };
}

/**
 * Hook for search analytics and insights
 */
export function useSearchAnalytics() {
  const [searchStats, setSearchStats] = useState({
    totalSearches: 0,
    successfulSearches: 0,
    popularTerms: [] as string[],
    averageResultCount: 0
  });

  const trackSearch = useCallback((query: string, resultCount: number) => {
    setSearchStats(prev => ({
      totalSearches: prev.totalSearches + 1,
      successfulSearches: prev.successfulSearches + (resultCount > 0 ? 1 : 0),
      popularTerms: [...prev.popularTerms, query].slice(-50), // Keep last 50 terms
      averageResultCount: ((prev.averageResultCount * prev.totalSearches) + resultCount) / (prev.totalSearches + 1)
    }));
  }, []);

  const getSearchInsights = useCallback(() => {
    const successRate = searchStats.totalSearches > 0
      ? (searchStats.successfulSearches / searchStats.totalSearches) * 100
      : 0;

    const termFrequency = searchStats.popularTerms.reduce((acc, term) => {
      acc[term] = (acc[term] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topTerms = Object.entries(termFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([term]) => term);

    return {
      successRate: Math.round(successRate),
      averageResults: Math.round(searchStats.averageResultCount),
      topSearchTerms: topTerms,
      totalSearches: searchStats.totalSearches
    };
  }, [searchStats]);

  return {
    trackSearch,
    getSearchInsights,
    searchStats
  };
}