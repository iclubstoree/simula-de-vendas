/**
 * Input de moeda com auto-save onBlur
 */

import { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { CurrencyInput } from '@/lib/CurrencyInput';

interface AutoSaveCurrencyInputProps {
  label: string;
  value: number; // Valor inicial em reais
  onSave: (value: number) => Promise<void> | void; // Chamado no onBlur para persistir
  placeholder?: string;
  className?: string;
  hasError?: boolean;
  disabled?: boolean;
  id?: string;
}

export function AutoSaveCurrencyInput({
  label,
  value: initialValue,
  onSave,
  placeholder = "R$ 0,00",
  className = "",
  hasError = false,
  disabled = false,
  id
}: AutoSaveCurrencyInputProps) {
  const [localCents, setLocalCents] = useState(Math.round(initialValue * 100));
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Sincroniza com valor externo quando muda
  useEffect(() => {
    const newCents = Math.round(initialValue * 100);
    // Only update if the external value actually changed significantly
    if (Math.abs(newCents - localCents) > 1 && !hasChanges) {
      setLocalCents(newCents);
    }
  }, [initialValue, localCents, hasChanges]);

  // onChange: apenas atualiza estado local
  const handleChange = useCallback((cents: number) => {
    console.log(`${id} - onChange:`, { cents });
    setLocalCents(cents);
    setHasChanges(true);
  }, [id]);

  // onBlur: persiste no backend/cache
  const handleBlur = useCallback(async () => {
    const reaisValue = localCents / 100;
    console.log(`${id} - onBlur:`, { reaisValue, initialValue, hasChanges, localCents });
    
    // Sempre salva se há mudanças, independente da comparação
    if (!hasChanges) {
      console.log(`${id} - Sem mudanças para salvar`);
      return;
    }

    console.log(`${id} - Salvando valor:`, reaisValue);
    setIsSaving(true);
    try {
      await onSave(reaisValue);
      console.log(`${id} - Salvo com sucesso`);
      setHasChanges(false);
    } catch (error) {
      console.error(`Erro ao salvar ${id}:`, error);
      // Reverte para valor original em caso de erro
      setLocalCents(Math.round(initialValue * 100));
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  }, [localCents, initialValue, onSave, id, hasChanges]);

  return (
    <div className="space-y-1">
      <Label className="text-xs" htmlFor={id}>
        {label}
      </Label>
      <CurrencyInput
        id={id}
        value={localCents}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
      />
    </div>
  );
}