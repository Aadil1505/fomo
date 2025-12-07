import { InvestmentResult, HistoricalPrice, ChartDataPoint } from '@/types';

export function calculateInvestment(
  initialInvestment: number,
  initialPrice: number,
  currentPrice: number,
  startDate: string,
  endDate: string
): InvestmentResult {
  const shares = initialInvestment / initialPrice;
  const currentValue = shares * currentPrice;
  const profit = currentValue - initialInvestment;
  const profitPercentage = (profit / initialInvestment) * 100;

  return {
    initialInvestment,
    currentValue,
    profit,
    profitPercentage,
    shares,
    initialPrice,
    currentPrice,
    startDate,
    endDate,
  };
}

export function generateChartData(
  historicalPrices: HistoricalPrice[],
  shares: number
): ChartDataPoint[] {
  return historicalPrices.map((item) => ({
    date: item.date,
    value: item.price * shares,
    price: item.price,
  }));
}

export function getFunStats(result: InvestmentResult) {
  const stats = [];

  // Calculate daily returns
  const daysDiff = Math.floor(
    (new Date(result.endDate).getTime() - new Date(result.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const dailyReturn = result.profit / daysDiff;

  stats.push({
    label: 'Daily Return',
    value: `$${dailyReturn.toFixed(2)}`,
  });

  // If profitable, show what they could buy
  if (result.profit > 0) {
    const coffees = Math.floor(result.profit / 5);
    const iphones = Math.floor(result.profit / 999);

    if (coffees > 0) {
      stats.push({
        label: 'Could buy',
        value: `${coffees.toLocaleString()} coffees`,
      });
    }

    if (iphones > 0) {
      stats.push({
        label: 'Could buy',
        value: `${iphones} iPhone${iphones > 1 ? 's' : ''}`,
      });
    }
  }

  // ROI per year
  const years = daysDiff / 365;
  if (years > 0) {
    const annualizedReturn = (result.profitPercentage / years);
    stats.push({
      label: 'Annualized Return',
      value: `${annualizedReturn.toFixed(2)}%`,
    });
  }

  return stats;
}
