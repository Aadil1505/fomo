import { HistoricalPrice } from '@/types';

export interface YahooSearchResult {
  symbol: string;
  name: string;
  exchDisp: string;
  typeDisp: string;
}

export async function searchStocks(query: string): Promise<YahooSearchResult[]> {
  try {
    const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to fetch stock search results');
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
}

export async function getStockPrice(symbol: string): Promise<number> {
  try {
    const response = await fetch(`/api/stocks/${symbol}`);
    if (!response.ok) throw new Error('Failed to fetch stock price');
    const data = await response.json();

    const quote = data.chart.result[0].meta.regularMarketPrice;
    return quote;
  } catch (error) {
    console.error('Error getting stock price:', error);
    throw error;
  }
}

export async function getStockHistoricalData(
  symbol: string,
  startDate: Date,
  endDate: Date
): Promise<HistoricalPrice[]> {
  try {
    const period1 = Math.floor(startDate.getTime() / 1000);
    const period2 = Math.floor(endDate.getTime() / 1000);

    const response = await fetch(
      `/api/stocks/${symbol}?period1=${period1}&period2=${period2}`
    );

    if (!response.ok) throw new Error('Failed to fetch stock historical data');
    const data = await response.json();

    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const prices = result.indicators.quote[0].close;

    return timestamps.map((timestamp: number, index: number) => ({
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      price: prices[index],
    })).filter((item: HistoricalPrice) => item.price !== null);
  } catch (error) {
    console.error('Error getting stock historical data:', error);
    throw error;
  }
}
