'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

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

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="amount" className="mb-2 block text-sm text-zinc-700 dark:text-zinc-300">
          Investment amount
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
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
        <Label className="mb-2 block text-sm text-zinc-700 dark:text-zinc-300">
          Investment date
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, 'MMM d, yyyy') : 'Select date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={onStartDateChange}
              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label className="text-sm text-zinc-700 dark:text-zinc-300">
            Sell date
          </Label>
          <button
            onClick={() => {
              setShowEndDate(!showEndDate);
              if (showEndDate) {
                onEndDateChange(new Date());
              }
            }}
            className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            {showEndDate ? 'Use today' : 'Custom'}
          </button>
        </div>

        {showEndDate ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-10 w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'MMM d, yyyy') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={onEndDateChange}
                disabled={(date) =>
                  date > new Date() ||
                  (startDate ? date < startDate : false)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        ) : (
          <div className="flex h-10 items-center rounded-md border border-zinc-200 px-3 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
            Today
          </div>
        )}
      </div>

      <Button
        onClick={onCalculate}
        disabled={!canCalculate}
        className="mt-6 h-10 w-full bg-zinc-900 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
      >
        Calculate
      </Button>
    </div>
  );
}
