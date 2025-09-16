import { useState, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';

// Base entity interface - all entities should have an id
export interface BaseEntity {
  id: string;
  [key: string]: unknown;
}

// CRUD operation types
export type CRUDOperation = 'create' | 'read' | 'update' | 'delete';

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// CRUD configuration interface
export interface CRUDConfig<T extends BaseEntity> {
  entityName: string; // For error messages and toasts
  entityNamePlural?: string;

  // Validation functions
  validateCreate?: (entity: Omit<T, 'id'>) => ValidationResult;
  validateUpdate?: (entity: T) => ValidationResult;
  validateDelete?: (entity: T) => ValidationResult;

  // Success/Error messages
  messages?: {
    createSuccess?: string;
    updateSuccess?: string;
    deleteSuccess?: string;
    createError?: string;
    updateError?: string;
    deleteError?: string;
  };

  // Auto-generate messages if not provided
  autoGenerateMessages?: boolean;
}

// CRUD hook return type
export interface UseCRUDReturn<T extends BaseEntity> {
  // Data state
  items: T[];
  loading: boolean;
  error: string | null;

  // CRUD operations
  createItem: (item: Omit<T, 'id'>) => Promise<boolean>;
  updateItem: (item: T) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  deleteItems: (ids: string[]) => Promise<boolean>;

  // Data management
  setItems: (items: T[]) => void;
  addItem: (item: T) => void;
  removeItem: (id: string) => void;
  getItem: (id: string) => T | undefined;

  // Bulk operations
  bulkUpdate: (updates: Partial<T>, ids: string[]) => Promise<boolean>;
  bulkDelete: (ids: string[]) => Promise<boolean>;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Validation
  validateItem: (item: Partial<T>, operation: CRUDOperation) => ValidationResult;

  // Statistics
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
}

/**
 * Generic CRUD hook for managing entity operations
 */
export function useCRUD<T extends BaseEntity>(
  initialItems: T[] = [],
  config: CRUDConfig<T>
): UseCRUDReturn<T> {
  const [items, setItems] = useState<T[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const {
    entityName,
    entityNamePlural = `${entityName}s`,
    validateCreate,
    validateUpdate,
    validateDelete,
    messages = {},
    autoGenerateMessages = true
  } = config;

  // Auto-generate messages if not provided
  const finalMessages = useMemo(() => {
    if (!autoGenerateMessages) return messages;

    return {
      createSuccess: `${entityName} criado com sucesso`,
      updateSuccess: `${entityName} atualizado com sucesso`,
      deleteSuccess: `${entityName} excluído com sucesso`,
      createError: `Erro ao criar ${entityName.toLowerCase()}`,
      updateError: `Erro ao atualizar ${entityName.toLowerCase()}`,
      deleteError: `Erro ao excluir ${entityName.toLowerCase()}`,
      ...messages
    };
  }, [entityName, messages, autoGenerateMessages]);

  // Generate unique ID
  const generateId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Validation helper
  const validateItem = useCallback((item: Partial<T>, operation: CRUDOperation): ValidationResult => {
    switch (operation) {
      case 'create':
        return validateCreate?.(item as Omit<T, 'id'>) || { isValid: true, errors: {} };
      case 'update':
        return validateUpdate?.(item as T) || { isValid: true, errors: {} };
      case 'delete':
        return validateDelete?.(item as T) || { isValid: true, errors: {} };
      default:
        return { isValid: true, errors: {} };
    }
  }, [validateCreate, validateUpdate, validateDelete]);

  // Create item
  const createItem = useCallback(async (newItem: Omit<T, 'id'>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Validate
      const validation = validateItem(newItem, 'create');
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join(', ');
        setError(errorMessage);
        toast({
          title: "Erro de Validação",
          description: errorMessage,
          variant: "destructive"
        });
        return false;
      }

      // Create with generated ID
      const itemWithId = { ...newItem, id: generateId() } as T;

      // Add to items
      setItems(prev => [...prev, itemWithId]);

      // Success toast
      toast({
        title: "Sucesso",
        description: finalMessages.createSuccess
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : finalMessages.createError!;
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [validateItem, generateId, finalMessages, toast]);

  // Update item
  const updateItem = useCallback(async (updatedItem: T): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Validate
      const validation = validateItem(updatedItem, 'update');
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join(', ');
        setError(errorMessage);
        toast({
          title: "Erro de Validação",
          description: errorMessage,
          variant: "destructive"
        });
        return false;
      }

      // Update in items
      setItems(prev => prev.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      ));

      // Success toast
      toast({
        title: "Sucesso",
        description: finalMessages.updateSuccess
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : finalMessages.updateError!;
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [validateItem, finalMessages, toast]);

  // Delete item
  const deleteItem = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const item = items.find(i => i.id === id);
      if (!item) {
        setError(`${entityName} não encontrado`);
        return false;
      }

      // Validate
      const validation = validateItem(item, 'delete');
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join(', ');
        setError(errorMessage);
        toast({
          title: "Erro de Validação",
          description: errorMessage,
          variant: "destructive"
        });
        return false;
      }

      // Remove from items
      setItems(prev => prev.filter(item => item.id !== id));

      // Success toast
      toast({
        title: "Sucesso",
        description: finalMessages.deleteSuccess
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : finalMessages.deleteError!;
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [items, validateItem, entityName, finalMessages, toast]);

  // Delete multiple items
  const deleteItems = useCallback(async (ids: string[]): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Validate all items
      for (const id of ids) {
        const item = items.find(i => i.id === id);
        if (item) {
          const validation = validateItem(item, 'delete');
          if (!validation.isValid) {
            const errorMessage = Object.values(validation.errors).join(', ');
            setError(errorMessage);
            toast({
              title: "Erro de Validação",
              description: `${item.id}: ${errorMessage}`,
              variant: "destructive"
            });
            return false;
          }
        }
      }

      // Remove from items
      setItems(prev => prev.filter(item => !ids.includes(item.id)));

      // Success toast
      toast({
        title: "Sucesso",
        description: `${ids.length} ${ids.length === 1 ? entityName : entityNamePlural} excluído(s) com sucesso`
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : finalMessages.deleteError!;
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [items, validateItem, entityName, entityNamePlural, finalMessages, toast]);

  // Bulk update
  const bulkUpdate = useCallback(async (updates: Partial<T>, ids: string[]): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Apply updates
      setItems(prev => prev.map(item =>
        ids.includes(item.id) ? { ...item, ...updates } : item
      ));

      // Success toast
      toast({
        title: "Sucesso",
        description: `${ids.length} ${ids.length === 1 ? entityName : entityNamePlural} atualizado(s) em massa`
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro na atualização em massa';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [entityName, entityNamePlural, toast]);

  // Bulk delete (alias for deleteItems)
  const bulkDelete = deleteItems;

  // Helper functions
  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const getItem = useCallback((id: string): T | undefined => {
    return items.find(item => item.id === id);
  }, [items]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Statistics
  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter(item =>
      'active' in item ? item.active : true
    ).length;
    const inactive = total - active;

    return { total, active, inactive };
  }, [items]);

  return {
    // Data state
    items,
    loading,
    error,

    // CRUD operations
    createItem,
    updateItem,
    deleteItem,
    deleteItems,

    // Data management
    setItems,
    addItem,
    removeItem,
    getItem,

    // Bulk operations
    bulkUpdate,
    bulkDelete,

    // State management
    setLoading,
    setError,
    clearError,

    // Validation
    validateItem,

    // Statistics
    stats
  };
}

// Common validation functions
export const validators = {
  required: (value: unknown, fieldName: string): string | null => {
    if (value === null || value === undefined || value === '') {
      return `${fieldName} é obrigatório`;
    }
    return null;
  },

  minLength: (value: string, minLength: number, fieldName: string): string | null => {
    if (value && value.length < minLength) {
      return `${fieldName} deve ter pelo menos ${minLength} caracteres`;
    }
    return null;
  },

  maxLength: (value: string, maxLength: number, fieldName: string): string | null => {
    if (value && value.length > maxLength) {
      return `${fieldName} deve ter no máximo ${maxLength} caracteres`;
    }
    return null;
  },

  email: (value: string, fieldName: string = 'Email'): string | null => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return `${fieldName} deve ser um email válido`;
    }
    return null;
  },

  numeric: (value: unknown, fieldName: string): string | null => {
    if (value !== null && value !== undefined && isNaN(Number(value))) {
      return `${fieldName} deve ser um número válido`;
    }
    return null;
  },

  positive: (value: number, fieldName: string): string | null => {
    if (value !== null && value !== undefined && value <= 0) {
      return `${fieldName} deve ser um número positivo`;
    }
    return null;
  }
};

// Utility function to combine validation results
export function combineValidations(...validations: (string | null)[]): ValidationResult {
  const errors: string[] = validations.filter(Boolean) as string[];

  return {
    isValid: errors.length === 0,
    errors: errors.reduce((acc, error, index) => {
      acc[`error_${index}`] = error;
      return acc;
    }, {} as Record<string, string>)
  };
}