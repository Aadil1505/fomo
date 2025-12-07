'use client';

import { useState, useEffect } from 'react';
import { Asset } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { searchStocks, YahooSearchResult } from '@/lib/stock-api';

interface AssetPickerProps {
  onAssetSelect: (asset: Asset) => void;
  selectedAsset: Asset | null;
}

export function AssetPicker({ onAssetSelect, selectedAsset }: AssetPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Asset[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchAssets = async () => {
      if (query.length < 1) {
        setResults([]);
        return;
      }

      setIsSearching(true);

      try {
        const stockResults = await searchStocks(query);
        setResults(
          stockResults
            .filter((stock) => stock.typeDisp === 'Equity')
            .map((stock: YahooSearchResult) => ({
              id: stock.symbol,
              symbol: stock.symbol,
              name: stock.name,
              type: 'stock',
            }))
        );
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchAssets, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleAssetSelect = (asset: Asset) => {
    onAssetSelect(asset);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="space-y-3">
      {selectedAsset ? (
        <div className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800">
          <div>
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {selectedAsset.symbol}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-500">
              {selectedAsset.name}
            </div>
          </div>
          <button
            onClick={() => onAssetSelect(null as any)}
            className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-50"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="relative">
          <Label htmlFor="asset-search" className="mb-2 block text-sm text-zinc-700 dark:text-zinc-300">
            Stock symbol
          </Label>
          <div className="relative">
            <Input
              id="asset-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="AAPL"
              className="h-10"
            />
          </div>

          {results.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-black">
              <div className="max-h-64 overflow-y-auto py-1">
                {results.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => handleAssetSelect(asset)}
                    className="w-full px-3 py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  >
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {asset.symbol}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-500">
                      {asset.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isSearching && query.length > 0 && (
            <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
              Searching...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
