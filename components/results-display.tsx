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
        <div className="text-sm text-muted-foreground">
          Your ${result.initialInvestment.toLocaleString()} would be worth
        </div>
        <div className="text-5xl font-semibold text-foreground">
          {/* {formatCurrency(result.currentValue)} */}
          <NumberTicker
            value={result.currentValue}
            decimalPlaces={2}
            className="text-5xl font-semibold text-foreground"
            // startValue={result.currentValue*.8}
          />
        </div>
        <div className={`text-lg ${isProfit ? 'text-green-600' : 'text-destructive'}`}>
          {formatCurrency(result.profit)} ({formatPercent(result.profitPercentage)})
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-3">
        <div className="text-sm text-foreground">Growth over time</div>
        <InvestmentChart data={chartData} initialInvestment={result.initialInvestment} />
      </div>

      {/* Stats Grid */}
      <div className="space-y-3">
        <div className="text-sm text-foreground">Details</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shares/Units</span>
            <span className="text-foreground">{result.shares.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Initial Price</span>
            <span className="text-foreground">{formatCurrency(result.initialPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Price</span>
            <span className="text-foreground">{formatCurrency(result.currentPrice)}</span>
          </div>
          {funStats.map((stat, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-muted-foreground">{stat.label}</span>
              <span className="text-foreground">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
