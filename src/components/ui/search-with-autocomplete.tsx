import React, { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, X } from "lucide-react";

export interface SearchOption<T = unknown> {
  id: string;
  label: string;
  value: string;
  data?: T;
  description?: string;
  badge?: string;
}

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: string;
}

export interface SearchWithAutocompleteProps<T = unknown> {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (option: SearchOption<T>) => void;

  // Search configuration
  placeholder?: string;
  disabled?: boolean;
  searchFn?: (query: string) => SearchOption<T>[] | Promise<SearchOption<T>[]>;
  options?: SearchOption<T>[];

  // Recent searches
  enableRecentSearches?: boolean;
  recentSearches?: RecentSearch[];
  onRecentSearchClick?: (query: string) => void;
  onClearRecentSearches?: () => void;
  maxRecentSearches?: number;

  // UI configuration
  showSearchIcon?: boolean;
  showDropdownOnFocus?: boolean;
  maxDropdownHeight?: string;
  minCharsToSearch?: number;
  debounceMs?: number;

  // Loading state
  loading?: boolean;

  // Custom rendering
  renderOption?: (option: SearchOption<T>) => React.ReactNode;
  renderRecentSearch?: (search: RecentSearch) => React.ReactNode;

  // Styling
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
}

export function SearchWithAutocomplete<T = unknown>({
  value,
  onChange,
  onSelect,
  placeholder = "Digite para pesquisar...",
  disabled = false,
  searchFn,
  options = [],
  enableRecentSearches = true,
  recentSearches = [],
  onRecentSearchClick,
  onClearRecentSearches,
  maxRecentSearches = 5,
  showSearchIcon = true,
  showDropdownOnFocus = true,
  maxDropdownHeight = "300px",
  minCharsToSearch = 1,
  debounceMs = 300,
  loading = false,
  renderOption,
  renderRecentSearch,
  className = "",
  inputClassName = "",
  dropdownClassName = ""
}: SearchWithAutocompleteProps<T>) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchOption<T>[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search function
  const debouncedSearch = useCallback(async (query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (query.length >= minCharsToSearch && searchFn) {
        setIsSearching(true);
        try {
          const results = await searchFn(query);
          setSearchResults(Array.isArray(results) ? results : []);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, debounceMs);
  }, [searchFn, minCharsToSearch, debounceMs]);

  // Handle input change
  const handleInputChange = (newValue: string) => {
    onChange(newValue);

    if (searchFn) {
      debouncedSearch(newValue);
    } else {
      // Filter provided options
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(newValue.toLowerCase()) ||
        option.value.toLowerCase().includes(newValue.toLowerCase())
      );
      setSearchResults(filtered);
    }

    if (newValue.trim() || showDropdownOnFocus) {
      setShowDropdown(true);
    }
  };

  // Handle input focus
  const handleFocus = () => {
    if (showDropdownOnFocus) {
      setShowDropdown(true);

      // Show recent searches if no current value
      if (!value.trim() && enableRecentSearches) {
        setSearchResults([]);
      }
    }
  };

  // Handle input blur (with delay for dropdown clicks)
  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  // Handle option selection
  const handleOptionSelect = (option: SearchOption<T>) => {
    onChange(option.value);
    setShowDropdown(false);
    onSelect?.(option);
  };

  // Handle recent search click
  const handleRecentSearchClick = (search: RecentSearch) => {
    onChange(search.query);
    setShowDropdown(false);
    onRecentSearchClick?.(search.query);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Default option renderer
  const defaultRenderOption = (option: SearchOption<T>) => (
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="font-medium text-sm">{option.label}</p>
        {option.description && (
          <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
        )}
      </div>
      {option.badge && (
        <Badge variant="outline" className="text-xs ml-2">
          {option.badge}
        </Badge>
      )}
    </div>
  );

  // Default recent search renderer
  const defaultRenderRecentSearch = (search: RecentSearch) => (
    <div className="flex items-center gap-2">
      <Clock className="h-3 w-3 text-muted-foreground" />
      <span className="text-sm">{search.query}</span>
    </div>
  );

  const showRecentSearches = enableRecentSearches &&
                             !value.trim() &&
                             recentSearches.length > 0 &&
                             showDropdown;

  const showSearchResults = value.trim().length >= minCharsToSearch &&
                           searchResults.length > 0 &&
                           showDropdown;

  const showNoResults = value.trim().length >= minCharsToSearch &&
                       searchResults.length === 0 &&
                       !isSearching &&
                       !loading &&
                       showDropdown;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`${showSearchIcon ? 'pr-10' : ''} ${inputClassName}`}
        />

        {showSearchIcon && (
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        )}
      </div>

      {/* Dropdown */}
      {(showRecentSearches || showSearchResults || showNoResults || isSearching || loading) && (
        <div
          ref={dropdownRef}
          className={`absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg overflow-hidden ${dropdownClassName}`}
          style={{ maxHeight: maxDropdownHeight }}
        >
          <div className="overflow-y-auto" style={{ maxHeight: maxDropdownHeight }}>
            {/* Loading state */}
            {(isSearching || loading) && (
              <div className="p-4 text-center text-muted-foreground text-sm">
                Pesquisando...
              </div>
            )}

            {/* Recent searches */}
            {showRecentSearches && (
              <div className="p-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Pesquisas recentes
                  </div>
                  {onClearRecentSearches && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClearRecentSearches}
                      className="h-auto p-1 text-xs"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {recentSearches.slice(0, maxRecentSearches).map((search) => (
                  <button
                    key={search.id}
                    className="w-full text-left px-2 py-1 text-sm hover:bg-accent rounded transition-colors"
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    {renderRecentSearch ? renderRecentSearch(search) : defaultRenderRecentSearch(search)}
                  </button>
                ))}
              </div>
            )}

            {/* Search results */}
            {showSearchResults && (
              <div>
                {searchResults.map((option) => (
                  <button
                    key={option.id}
                    className="w-full text-left p-3 hover:bg-accent border-b last:border-0 transition-colors"
                    onClick={() => handleOptionSelect(option)}
                  >
                    {renderOption ? renderOption(option) : defaultRenderOption(option)}
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {showNoResults && (
              <div className="p-4 text-center text-muted-foreground text-sm">
                Nenhum resultado encontrado para "{value}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Utility function to create search options
// eslint-disable-next-line react-refresh/only-export-components
export const createSearchOption = <T,>(
  id: string,
  label: string,
  value: string,
  data?: T,
  options: Partial<SearchOption<T>> = {}
): SearchOption<T> => ({
  id,
  label,
  value,
  data,
  ...options
});