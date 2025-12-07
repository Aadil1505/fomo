'use client';

import { InvestmentResult, ChartDataPoint } from '@/types';
import { InvestmentChart } from './investment-chart';
import { NumberTicker } from './ui/number-ticker';

interface ResultsDisplayProps {
  result: InvestmentResult;
  chartData: ChartDataPoint[];
  funStats: { label: string; value: string }[];
}

export function ResultsDisplay({ result, chartData, funStats }: ResultsDisplayProps) {
  const isProfit = result.profit >= 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-8">
      {/* Main Result */}
      <div className="space-y-3">
        <div className="text-sm text-zinc-500 dark:text-zinc-500">
          Your ${result.initialInvestment.toLocaleString()} would be worth
        </div>
        <div className="text-5xl font-semibold text-zinc-900 dark:text-zinc-50">
          {/* {formatCurrency(result.currentValue)} */}
          <NumberTicker
            value={result.currentValue}
            decimalPlaces={2}
            className="text-5xl font-semibold text-zinc-900 dark:text-zinc-50"
            // startValue={result.currentValue*.8}
          />
        </div>
        <div className={`text-lg ${isProfit ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
          {formatCurrency(result.profit)} ({formatPercent(result.profitPercentage)})
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-3">
        <div className="text-sm text-zinc-700 dark:text-zinc-300">Growth over time</div>
        <InvestmentChart data={chartData} initialInvestment={result.initialInvestment} />
      </div>

      {/* Stats Grid */}
      <div className="space-y-3">
        <div className="text-sm text-zinc-700 dark:text-zinc-300">Details</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-500">Shares/Units</span>
            <span className="text-zinc-900 dark:text-zinc-50">{result.shares.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-500">Initial Price</span>
            <span className="text-zinc-900 dark:text-zinc-50">{formatCurrency(result.initialPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-500">Current Price</span>
            <span className="text-zinc-900 dark:text-zinc-50">{formatCurrency(result.currentPrice)}</span>
          </div>
          {funStats.map((stat, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-500">{stat.label}</span>
              <span className="text-zinc-900 dark:text-zinc-50">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
