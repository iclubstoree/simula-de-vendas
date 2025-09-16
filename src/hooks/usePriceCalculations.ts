import { useMemo, useCallback } from 'react';
import { formatCurrency, CardMachine } from '@/data/mockData';
import { formatCentsToBRL } from '@/lib/currency';

export interface PaymentOption {
  type: string;
  value: string;
  total: string;
  hasDownPayment: boolean;
  installmentCount?: number;
  rate?: number;
}

export interface PriceCalculation {
  baseValue: number; // Value to be financed
  totalValue: number; // Total product value
  downPaymentValue: number;
  tradeInValue: number;
  installmentOptions: PaymentOption[];
}

export interface UsePriceCalculationsProps {
  priceCents: number;
  downPaymentCents: number;
  tradeInValueCents: number;
  selectedCardMachine: string;
  availableCardMachines: CardMachine[];
}

export interface UsePriceCalculationsReturn {
  calculation: PriceCalculation;
  formatPaymentText: (option: PaymentOption) => string;
  getInstallmentOption: (installmentCount: number) => PaymentOption | undefined;
  calculateCustomInstallment: (installmentCount: number, customRate?: number) => PaymentOption | null;
  getPaymentSummary: () => {
    totalProduct: string;
    totalDiscount: string;
    totalToFinance: string;
    bestInstallmentOption: PaymentOption | undefined;
  };
}

/**
 * Hook for managing price calculations and payment options
 */
export function usePriceCalculations({
  priceCents,
  downPaymentCents,
  tradeInValueCents,
  selectedCardMachine,
  availableCardMachines
}: UsePriceCalculationsProps): UsePriceCalculationsReturn {

  // Calculate installment options
  const calculation = useMemo((): PriceCalculation => {
    const totalValue = priceCents / 100;
    const downPaymentValue = downPaymentCents / 100;
    const tradeInValue = tradeInValueCents / 100;
    const baseValue = Math.max(0, totalValue - downPaymentValue - tradeInValue);

    const installmentOptions: PaymentOption[] = [];

    if (!selectedCardMachine) {
      return {
        baseValue,
        totalValue,
        downPaymentValue,
        tradeInValue,
        installmentOptions
      };
    }

    const machine = availableCardMachines.find(m => m.id === selectedCardMachine);
    if (!machine) {
      return {
        baseValue,
        totalValue,
        downPaymentValue,
        tradeInValue,
        installmentOptions
      };
    }

    // Debit option
    installmentOptions.push({
      type: "Débito",
      value: formatCurrency(baseValue),
      total: formatCurrency(baseValue),
      hasDownPayment: downPaymentValue > 0,
      installmentCount: 1,
      rate: 0
    });

    // Installment options (1x to maxInstallments)
    for (let i = 1; i <= machine.maxInstallments; i++) {
      const rate = machine.rates[i] || 0;
      const tax = rate / 100;
      const totalWithTax = baseValue / (1 - tax);
      const installmentValue = totalWithTax / i;

      installmentOptions.push({
        type: `${i}x`,
        value: formatCurrency(installmentValue),
        total: formatCurrency(totalWithTax),
        hasDownPayment: downPaymentValue > 0,
        installmentCount: i,
        rate
      });
    }

    return {
      baseValue,
      totalValue,
      downPaymentValue,
      tradeInValue,
      installmentOptions
    };
  }, [priceCents, downPaymentCents, tradeInValueCents, selectedCardMachine, availableCardMachines]);

  // Format payment text for copying
  const formatPaymentText = useCallback((option: PaymentOption): string => {
    const downPaymentText = option.hasDownPayment
      ? `${formatCentsToBRL(downPaymentCents)} + `
      : '';

    const paymentType = option.type === "Débito" ? "Débito" : option.type;
    return `${downPaymentText}${paymentType} de ${option.value}`;
  }, [downPaymentCents]);

  // Get specific installment option
  const getInstallmentOption = useCallback((installmentCount: number): PaymentOption | undefined => {
    if (installmentCount === 1) {
      return calculation.installmentOptions.find(option => option.type === "Débito");
    }
    return calculation.installmentOptions.find(option => option.installmentCount === installmentCount);
  }, [calculation.installmentOptions]);

  // Calculate custom installment with specific rate
  const calculateCustomInstallment = useCallback((
    installmentCount: number,
    customRate?: number
  ): PaymentOption | null => {
    if (calculation.baseValue <= 0) return null;

    const rate = customRate ?? 0;
    const tax = rate / 100;
    const totalWithTax = calculation.baseValue / (1 - tax);
    const installmentValue = totalWithTax / installmentCount;

    return {
      type: `${installmentCount}x`,
      value: formatCurrency(installmentValue),
      total: formatCurrency(totalWithTax),
      hasDownPayment: calculation.downPaymentValue > 0,
      installmentCount,
      rate
    };
  }, [calculation.baseValue, calculation.downPaymentValue]);

  // Get payment summary
  const getPaymentSummary = useCallback(() => {
    const totalDiscount = calculation.downPaymentValue + calculation.tradeInValue;

    // Find best installment option (lowest total cost)
    const creditOptions = calculation.installmentOptions.filter(option =>
      option.type !== "Débito"
    );

    const bestInstallmentOption = creditOptions.reduce((best, current) => {
      if (!best) return current;

      const currentTotal = parseFloat(current.total.replace(/[^\d,]/g, '').replace(',', '.'));
      const bestTotal = parseFloat(best.total.replace(/[^\d,]/g, '').replace(',', '.'));

      return currentTotal < bestTotal ? current : best;
    }, undefined as PaymentOption | undefined);

    return {
      totalProduct: formatCurrency(calculation.totalValue),
      totalDiscount: formatCurrency(totalDiscount),
      totalToFinance: formatCurrency(calculation.baseValue),
      bestInstallmentOption
    };
  }, [calculation]);

  return {
    calculation,
    formatPaymentText,
    getInstallmentOption,
    calculateCustomInstallment,
    getPaymentSummary
  };
}

/**
 * Hook for advanced pricing features
 */
export function useAdvancedPricing() {
  // Calculate discount percentage
  const calculateDiscountPercentage = useCallback((originalPrice: number, finalPrice: number): number => {
    if (originalPrice <= 0) return 0;
    return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
  }, []);

  // Calculate monthly budget impact
  const calculateBudgetImpact = useCallback((
    monthlyIncome: number,
    installmentValue: number,
    installmentCount: number
  ) => {
    const monthlyInstallment = installmentValue;
    const budgetPercentage = (monthlyInstallment / monthlyIncome) * 100;
    const totalCommitment = monthlyInstallment * installmentCount;

    return {
      monthlyInstallment,
      budgetPercentage: Math.round(budgetPercentage),
      totalCommitment,
      isAffordable: budgetPercentage <= 30, // 30% rule
      recommendation: budgetPercentage <= 20 ? 'excellent' :
                     budgetPercentage <= 30 ? 'good' :
                     budgetPercentage <= 40 ? 'caution' : 'risky'
    };
  }, []);

  // Compare financing options
  const compareFinancingOptions = useCallback((options: PaymentOption[]) => {
    return options.map(option => {
      const totalValue = parseFloat(option.total.replace(/[^\d,]/g, '').replace(',', '.'));
      const installmentValue = parseFloat(option.value.replace(/[^\d,]/g, '').replace(',', '.'));

      return {
        ...option,
        totalCost: totalValue,
        monthlyCost: installmentValue,
        totalInterest: totalValue - (installmentValue * (option.installmentCount || 1)),
        effectiveRate: option.rate || 0
      };
    }).sort((a, b) => a.totalCost - b.totalCost);
  }, []);

  return {
    calculateDiscountPercentage,
    calculateBudgetImpact,
    compareFinancingOptions
  };
}

/**
 * Hook for price validation and constraints
 */
export function usePriceValidation() {
  const validatePriceInput = useCallback((priceCents: number) => {
    const errors: string[] = [];

    if (priceCents < 0) {
      errors.push('O preço não pode ser negativo');
    }

    if (priceCents === 0) {
      errors.push('O preço deve ser maior que zero');
    }

    if (priceCents > 10000000) { // R$ 100,000.00
      errors.push('O preço parece muito alto, verifique o valor');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const validateDownPayment = useCallback((downPaymentCents: number, priceCents: number) => {
    const errors: string[] = [];

    if (downPaymentCents < 0) {
      errors.push('A entrada não pode ser negativa');
    }

    if (downPaymentCents > priceCents) {
      errors.push('A entrada não pode ser maior que o preço do produto');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const validateTradeInValue = useCallback((tradeInCents: number, priceCents: number) => {
    const errors: string[] = [];

    if (tradeInCents < 0) {
      errors.push('O valor do aparelho de entrada não pode ser negativo');
    }

    if (tradeInCents > priceCents) {
      errors.push('O valor do aparelho de entrada não pode ser maior que o preço do produto');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  return {
    validatePriceInput,
    validateDownPayment,
    validateTradeInValue
  };
}