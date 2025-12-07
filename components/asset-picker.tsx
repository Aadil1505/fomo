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
            .filter((stock) => stock.typeDisp === 'Equity' || stock.typeDisp === 'ETF')
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
        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <div>
            <div className="text-sm font-medium text-foreground">
              {selectedAsset.symbol}
            </div>
            <div className="text-xs text-muted-foreground">
              {selectedAsset.name}
            </div>
          </div>
          <button
            onClick={() => onAssetSelect(null as any)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="relative">
          <Label htmlFor="asset-search" className="mb-2 block text-sm text-foreground">
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
            <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-popover shadow-lg">
              <div className="max-h-64 overflow-y-auto py-1">
                {results.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => handleAssetSelect(asset)}
                    className="w-full px-3 py-2 text-left hover:bg-accent"
                  >
                    <div className="text-sm font-medium text-foreground">
                      {asset.symbol}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {asset.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isSearching && query.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              Searching...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
