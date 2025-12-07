import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const { searchParams } = new URL(request.url);
  const period1 = searchParams.get('period1');
  const period2 = searchParams.get('period2');

  try {
    let url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;

    if (period1 && period2) {
      url += `?period1=${period1}&period2=${period2}&interval=1d`;
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Yahoo Finance');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Stock data error:', error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}
