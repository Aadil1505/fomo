'use client';

import { ChartDataPoint } from '@/types';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';

interface InvestmentChartProps {
  data: ChartDataPoint[];
  initialInvestment: number;
}

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function InvestmentChart({ data, initialInvestment }: InvestmentChartProps) {
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const isProfit = data.length > 0 && data[data.length - 1].value >= initialInvestment;

  return (
    <div className="w-full">
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={isProfit ? '#10b981' : '#ef4444'}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={isProfit ? '#10b981' : '#ef4444'}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              try {
                return format(new Date(value), 'MMM d');
              } catch {
                return value;
              }
            }}
            className="text-xs text-zinc-600 dark:text-zinc-400"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={formatCurrency}
            className="text-xs text-zinc-600 dark:text-zinc-400"
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(label) => formatDate(label as string)}
                formatter={(value) => formatCurrency(value as number)}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={isProfit ? '#10b981' : '#ef4444'}
            strokeWidth={2}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
