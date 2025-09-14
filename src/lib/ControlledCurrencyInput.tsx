/**
 * Wrapper controlado para integração com react-hook-form
 * 
 * Mantém cents no formulário como fonte-da-verdade
 * Integra com Controller do react-hook-form
 */

import React from 'react';
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';
import { CurrencyInput } from './CurrencyInput';
import { Label } from '@/components/ui/label';

interface ControlledCurrencyInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control: Control<TFieldValues>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  'data-testid'?: string;
}

export function ControlledCurrencyInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  placeholder = "R$ 0,00",
  disabled = false,
  className = "",
  required = false,
  'data-testid': testId,
}: ControlledCurrencyInputProps<TFieldValues, TName>) {
  return (
    <div className="space-y-1">
      {label && (
        <Label htmlFor={name} className="text-xs">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <>
            <CurrencyInput
              id={name}
              value={value || 0} // Garante que sempre é número
              onChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              className={`${className} ${error ? 'border-destructive' : ''}`}
              data-testid={testId}
            />
            {error && (
              <p className="text-xs text-destructive mt-1">
                {error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}

/**
 * Versão standalone para casos onde não há react-hook-form
 */
interface StandaloneCurrencyInputProps {
  label?: string;
  value: number; // Em cents
  onChange: (cents: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  error?: string;
  id?: string;
  'data-testid'?: string;
}

export function StandaloneCurrencyInput({
  label,
  value,
  onChange,
  placeholder = "R$ 0,00",
  disabled = false,
  className = "",
  required = false,
  error,
  id,
  'data-testid': testId,
}: StandaloneCurrencyInputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <Label htmlFor={id} className="text-xs">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <CurrencyInput
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`${className} ${error ? 'border-destructive' : ''}`}
        data-testid={testId}
      />
      {error && (
        <p className="text-xs text-destructive mt-1">
          {error}
        </p>
      )}
    </div>
  );
}