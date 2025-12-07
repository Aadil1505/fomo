'use client';

import { useState } from 'react';
import { Asset, InvestmentResult, ChartDataPoint } from '@/types';
import { AssetPicker } from '@/components/asset-picker';
import { InvestmentInputs } from '@/components/investment-inputs';
import { ResultsDisplay } from '@/components/results-display';
import { getStockHistoricalData } from '@/lib/stock-api';
import { calculateInvestment, generateChartData, getFunStats } from '@/lib/calculations';

export default function Home() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [amount, setAmount] = useState<string>('');
  const [result, setResult] = useState<InvestmentResult | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [funStats, setFunStats] = useState<{ label: string; value: string }[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCalculate = selectedAsset && startDate && amount && parseFloat(amount) > 0;

  const handleCalculate = async () => {
    if (!canCalculate || !selectedAsset || !startDate) return;

    setIsCalculating(true);
    setError(null);

    try {
      const actualEndDate = endDate || new Date();

      // Fetch historical data
      const historicalData = await getStockHistoricalData(
        selectedAsset.symbol,
        startDate,
        actualEndDate
      );

      if (!historicalData || historicalData.length === 0) {
        throw new Error('No historical data available for the selected period');
      }

      const initialPrice = historicalData[0].price;
      const currentPrice = historicalData[historicalData.length - 1].price;

      // Calculate investment results
      const investmentResult = calculateInvestment(
        parseFloat(amount),
        initialPrice,
        currentPrice,
        historicalData[0].date,
        historicalData[historicalData.length - 1].date
      );

      // Generate chart data
      const chart = generateChartData(historicalData, investmentResult.shares);

      // Get fun stats
      const stats = getFunStats(investmentResult);

      setResult(investmentResult);
      setChartData(chart);
      setFunStats(stats);
    } catch (err) {
      console.error('Calculation error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to calculate investment. Please try again.'
      );
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-2xl px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-foreground">
            FOMO Calculator
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            See what your investment could have been worth
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-8">
          <AssetPicker
            onAssetSelect={setSelectedAsset}
            selectedAsset={selectedAsset}
          />

          <InvestmentInputs
            startDate={startDate}
            endDate={endDate}
            amount={amount}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onAmountChange={setAmount}
            onCalculate={handleCalculate}
            canCalculate={!!canCalculate && !isCalculating}
          />

          {error && (
            <div className="rounded-md bg-destructive/10 px-4 py-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {isCalculating && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Calculating...
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="mt-12">
            <ResultsDisplay result={result} chartData={chartData} funStats={funStats} />
          </div>
        )}
      </main>
    </div>
  );
}
