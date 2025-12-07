'use client';

import { useState } from 'react';
import { ChartDataPoint } from '@/types';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { Area, AreaChart, Brush, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

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
  const [zoomRange, setZoomRange] = useState<{ startIndex: number; endIndex: number } | null>(null);
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

  const handleResetZoom = () => {
    setZoomRange({ startIndex: 0, endIndex: data.length - 1 });
  };

  const handleBrushChange = (range: { startIndex?: number; endIndex?: number }) => {
    if (range.startIndex !== undefined && range.endIndex !== undefined) {
      setZoomRange({ startIndex: range.startIndex, endIndex: range.endIndex });
    }
  };

  const isZoomed = zoomRange !== null && !(zoomRange.startIndex === 0 && zoomRange.endIndex === data.length - 1);

  const displayStartIndex = zoomRange?.startIndex ?? 0;
  const displayEndIndex = zoomRange?.endIndex ?? data.length - 1;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Viewing {format(new Date(data[displayStartIndex].date), 'MMM d, yyyy')} - {format(new Date(data[displayEndIndex].date), 'MMM d, yyyy')}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetZoom}
          disabled={!isZoomed}
          className="h-7 text-xs"
        >
          <RotateCcw className="mr-1 size-3" />
          Reset Zoom
        </Button>
      </div>
      <ChartContainer config={chartConfig} className="h-[350px] w-full">
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
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              try {
                return format(new Date(value), 'MMM d');
              } catch {
                return value;
              }
            }}
            className="text-xs text-muted-foreground"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={formatCurrency}
            className="text-xs text-muted-foreground"
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;

              const data = payload[0].payload as ChartDataPoint;

              return (
                <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl">
                  <div className="mb-2 font-medium text-foreground">
                    {formatDate(data.date)}
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center justify-between gap-6">
                      <span className="text-muted-foreground">Stock Price</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatCurrency(data.price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-6">
                      <span className="text-muted-foreground">Portfolio Value</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatCurrency(data.value)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={isProfit ? '#10b981' : '#ef4444'}
            strokeWidth={2}
            fill="url(#colorValue)"
          />
          <Brush
            dataKey="date"
            height={60}
            stroke="hsl(var(--primary))"
            fill="hsl(var(--muted))"
            onChange={handleBrushChange}
            startIndex={zoomRange?.startIndex}
            endIndex={zoomRange?.endIndex}
            travellerWidth={15}
            className="[&_.recharts-brush-traveller]:cursor-ew-resize [&_.recharts-brush-traveller-rect]:fill-primary [&_.recharts-brush-traveller-rect]:stroke-primary [&_.recharts-brush-traveller-rect]:stroke-2 [&_text]:hidden"
          >
            <AreaChart>
              <Area
                type="monotone"
                dataKey="value"
                stroke={isProfit ? '#10b981' : '#ef4444'}
                fill={isProfit ? '#10b981' : '#ef4444'}
                fillOpacity={0.3}
              />
            </AreaChart>
          </Brush>
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
