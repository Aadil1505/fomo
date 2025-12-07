'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';

function formatDate(date: Date | undefined) {
  if (!date) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

interface InvestmentInputsProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  amount: string;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onAmountChange: (amount: string) => void;
  onCalculate: () => void;
  canCalculate: boolean;
}

export function InvestmentInputs({
  startDate,
  endDate,
  amount,
  onStartDateChange,
  onEndDateChange,
  onAmountChange,
  onCalculate,
  canCalculate,
}: InvestmentInputsProps) {
  const [showEndDate, setShowEndDate] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [startMonth, setStartMonth] = useState<Date | undefined>(startDate);
  const [endMonth, setEndMonth] = useState<Date | undefined>(endDate);
  const [startValue, setStartValue] = useState(formatDate(startDate));
  const [endValue, setEndValue] = useState(formatDate(endDate));

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="amount" className="mb-2 block text-sm text-foreground">
          Investment amount
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="1000"
            className="h-10 pl-7"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="start-date" className="mb-2 block text-sm text-foreground">
          Investment date
        </Label>
        <div className="relative flex gap-2">
          <Input
            id="start-date"
            value={startValue}
            placeholder="June 01, 2020"
            className="bg-background pr-10"
            onChange={(e) => {
              const date = new Date(e.target.value);
              setStartValue(e.target.value);
              if (isValidDate(date) && date <= new Date()) {
                onStartDateChange(date);
                setStartMonth(date);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setStartOpen(true);
              }
            }}
          />
          <Popover open={startOpen} onOpenChange={setStartOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              >
                <CalendarIcon className="size-3.5" />
                <span className="sr-only">Select date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={startDate}
                captionLayout="dropdown"
                month={startMonth}
                onMonthChange={setStartMonth}
                onSelect={(date) => {
                  onStartDateChange(date);
                  setStartValue(formatDate(date));
                  setStartOpen(false);
                }}
                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                fromYear={1900}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label className="text-sm text-foreground">
            Sell date
          </Label>
          <button
            onClick={() => {
              setShowEndDate(!showEndDate);
              if (showEndDate) {
                onEndDateChange(new Date());
                setEndValue('');
              }
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {showEndDate ? 'Use today' : 'Custom'}
          </button>
        </div>

        {showEndDate ? (
          <div className="relative flex gap-2">
            <Input
              id="end-date"
              value={endValue}
              placeholder="December 06, 2025"
              className="bg-background pr-10"
              onChange={(e) => {
                const date = new Date(e.target.value);
                setEndValue(e.target.value);
                if (isValidDate(date) && date <= new Date() && (!startDate || date >= startDate)) {
                  onEndDateChange(date);
                  setEndMonth(date);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setEndOpen(true);
                }
              }}
            />
            <Popover open={endOpen} onOpenChange={setEndOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                >
                  <CalendarIcon className="size-3.5" />
                  <span className="sr-only">Select date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="end"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="single"
                  selected={endDate}
                  captionLayout="dropdown"
                  month={endMonth}
                  onMonthChange={setEndMonth}
                  onSelect={(date) => {
                    onEndDateChange(date);
                    setEndValue(formatDate(date));
                    setEndOpen(false);
                  }}
                  disabled={(date) =>
                    date > new Date() ||
                    (startDate ? date < startDate : false)
                  }
                  fromYear={startDate?.getFullYear() || 1900}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div className="flex h-10 items-center rounded-md border border-border px-3 text-sm text-muted-foreground">
            Today
          </div>
        )}
      </div>

      <Button
        onClick={onCalculate}
        disabled={!canCalculate}
        className="mt-6 h-10 w-full"
      >
        Calculate
      </Button>
    </div>
  );
}
