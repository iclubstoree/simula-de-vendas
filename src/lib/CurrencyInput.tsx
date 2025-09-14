/**
 * Componente de input de moeda reutilizável
 * 
 * - Recebe value em cents e dispara onChange em cents
 * - Exibe formatado (BRL) quando perde o foco
 * - Não usa bibliotecas de máscara
 * - Evita loops de formatação
 */

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { formatCentsToBRL, parseInputToCents, isValidCurrencyInput } from './currency';

interface CurrencyInputProps {
  value: number; // Valor em cents
  onChange: (cents: number) => void; // Callback com valor em cents
  onBlur?: () => void; // Callback para onBlur
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  'data-testid'?: string;
}

export function CurrencyInput({
  value,
  onChange,
  onBlur: externalOnBlur,
  placeholder = "R$ 0,00",
  disabled = false,
  className = "",
  id,
  name,
  'data-testid': testId,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Atualiza display quando value prop muda (apenas quando não focado)
  useEffect(() => {
    if (!isFocused) {
      if (value === 0) {
        setDisplayValue('');
      } else {
        setDisplayValue(formatCentsToBRL(value));
      }
    }
  }, [value, isFocused]);
  
  // Inicializa o display value
  useEffect(() => {
    if (value === 0) {
      setDisplayValue('');
    } else {
      setDisplayValue(formatCentsToBRL(value));
    }
  }, []);
  
  const handleFocus = () => {
    setIsFocused(true);
    // Remove formatação para facilitar edição
    if (value === 0) {
      setDisplayValue('');
    } else {
      // Mostra apenas números para facilitar edição
      const reais = value / 100;
      if (reais % 1 === 0) {
        // Número inteiro, mostra sem decimais
        setDisplayValue(reais.toString());
      } else {
        // Tem decimais, mostra com vírgula
        setDisplayValue(reais.toFixed(2).replace('.', ','));
      }
    }
    
    // Seleciona todo o texto para facilitar substituição
    setTimeout(() => {
      inputRef.current?.select();
    }, 0);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    
    // Converte o valor atual para cents e formata
    const cents = parseInputToCents(displayValue);
    
    // Atualiza o valor se mudou
    if (cents !== value) {
      onChange(cents);
    }
    
    // Formata para exibição
    if (cents === 0) {
      setDisplayValue('');
    } else {
      setDisplayValue(formatCentsToBRL(cents));
    }

    // Chama callback externo se fornecido
    if (externalOnBlur) {
      externalOnBlur();
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Apenas atualiza o display, não dispara onChange ainda
    setDisplayValue(inputValue);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permite: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].includes(e.keyCode)) {
      return;
    }
    
    // Permite: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode)) {
      return;
    }
    
    // Permite: números, vírgula, ponto
    if (
      (e.keyCode >= 48 && e.keyCode <= 57) || // 0-9
      (e.keyCode >= 96 && e.keyCode <= 105) || // numpad 0-9
      e.keyCode === 188 || // vírgula
      e.keyCode === 190 || // ponto
      e.keyCode === 110 // ponto do numpad
    ) {
      return;
    }
    
    // Bloqueia qualquer outra tecla
    e.preventDefault();
  };
  
  return (
    <Input
      ref={inputRef}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      id={id}
      name={name}
      data-testid={testId}
      autoComplete="off"
    />
  );
}