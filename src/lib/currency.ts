/**
 * Utilitário central para formatação e parse de moeda BRL (pt-BR)
 * 
 * Estado fonte-da-verdade em cents (inteiro)
 * Renderização formatada com Intl.NumberFormat
 * Parse robusto para diferentes formatos de entrada
 */

/**
 * Converte cents (inteiro) para string formatada em BRL
 * @param cents - Valor em centavos (ex: 120000 = R$ 1.200,00)
 * @returns String formatada em BRL (ex: "R$ 1.200,00")
 */
export function formatCentsToBRL(cents: number): string {
  const reais = cents / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(reais);
}

/**
 * Converte string de entrada para cents (inteiro)
 * Aceita diversos formatos:
 * - "1200" -> 120000 cents (R$ 1.200,00)
 * - "1.200,50" -> 120050 cents (R$ 1.200,50)
 * - "1234.56" -> 123456 cents (R$ 1.234,56)
 * - "12,5" -> 1250 cents (R$ 12,50)
 * - "R$ 1.200,00" -> 120000 cents
 * 
 * @param input - String de entrada do usuário
 * @returns Valor em cents (inteiro)
 */
export function parseInputToCents(input: string): number {
  if (!input || typeof input !== 'string') return 0;
  
  // Remove espaços e símbolos de moeda
  let cleaned = input.trim().replace(/[R$\s]/g, '');
  
  if (!cleaned) return 0;
  
  // Se contém vírgula, assumimos formato brasileiro (vírgula = decimal)
  if (cleaned.includes(',')) {
    // Exemplo: "1.200,50" ou "1200,50" ou "12,5"
    const parts = cleaned.split(',');
    if (parts.length === 2) {
      const integerPart = parts[0].replace(/\./g, ''); // Remove pontos (separadores de milhares)
      const decimalPart = parts[1].padEnd(2, '0').slice(0, 2); // Garante 2 dígitos
      
      const reais = parseInt(integerPart || '0', 10);
      const centavos = parseInt(decimalPart, 10);
      
      return (reais * 100) + centavos;
    }
  }
  
  // Se contém ponto, pode ser separador de milhares OU decimal
  if (cleaned.includes('.')) {
    const parts = cleaned.split('.');
    
    // Se último grupo tem exatamente 2 dígitos, assumimos que é decimal
    // Exemplo: "1234.56" = R$ 1.234,56
    if (parts.length >= 2 && parts[parts.length - 1].length === 2) {
      const lastPart = parts.pop()!; // Parte decimal
      const integerPart = parts.join(''); // Remove todos os pontos restantes
      
      const reais = parseInt(integerPart || '0', 10);
      const centavos = parseInt(lastPart, 10);
      
      return (reais * 100) + centavos;
    } else {
      // Pontos são separadores de milhares: "1.200" = R$ 1.200,00
      const integerValue = parts.join('');
      const reais = parseInt(integerValue || '0', 10);
      return reais * 100;
    }
  }
  
  // Apenas números: "1200" = R$ 1.200,00
  const numericValue = parseInt(cleaned.replace(/\D/g, ''), 10);
  if (isNaN(numericValue)) return 0;
  
  return numericValue * 100;
}

/**
 * Converte cents para reais (decimal) - para casos específicos onde necessário
 * @param cents - Valor em centavos
 * @returns Valor em reais (decimal)
 */
export function centsToReais(cents: number): number {
  return cents / 100;
}

/**
 * Converte reais (decimal) para cents
 * @param reais - Valor em reais (decimal)
 * @returns Valor em centavos (inteiro)
 */
export function reaisToCents(reais: number): number {
  return Math.round(reais * 100);
}

/**
 * Valida se uma string pode ser convertida para um valor de moeda válido
 * @param input - String de entrada
 * @returns boolean indicando se é válido
 */
export function isValidCurrencyInput(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  
  const cents = parseInputToCents(input);
  return !isNaN(cents) && cents >= 0;
}

/**
 * Converte string BRL formatada para número decimal
 * Útil para componentes que precisam extrair valores numéricos de strings formatadas
 * @param formattedValue - String formatada (ex: "R$ 1.200,50" ou "1.200,50")
 * @returns Número decimal (ex: 1200.50)
 */
export function parseBRLToNumber(formattedValue: string): number {
  if (!formattedValue || typeof formattedValue !== 'string') return 0;
  
  // Remove tudo exceto dígitos e vírgula, depois substitui vírgula por ponto
  const cleaned = formattedValue.replace(/[^\d,]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}