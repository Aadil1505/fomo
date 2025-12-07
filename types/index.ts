export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: 'stock';
}

export interface HistoricalPrice {
  date: string;
  price: number;
}

export interface InvestmentResult {
  initialInvestment: number;
  currentValue: number;
  profit: number;
  profitPercentage: number;
  shares: number;
  initialPrice: number;
  currentPrice: number;
  startDate: string;
  endDate: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  price: number;
}
