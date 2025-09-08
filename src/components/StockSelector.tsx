import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Search, Loader2 } from 'lucide-react';

interface StockSelectorProps {
  selectedStock: string;
  onStockChange: (stock: string) => void;
  onStockDataChange?: (stockData: StockData | null) => void;
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: string;
  marketCap?: string;
}

export const StockSelector = ({ selectedStock, onStockChange, onStockDataChange }: StockSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Popular stocks for quick selection
  const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META', 'NFLX'];

  const fetchStockData = async (symbol: string) => {
    if (!symbol) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Using Yahoo Finance API through a CORS proxy
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`)}`);
      const data = await response.json();
      const parsed = JSON.parse(data.contents);
      
      if (parsed.chart?.result?.[0]) {
        const result = parsed.chart.result[0];
        const meta = result.meta;
        const currentPrice = meta.regularMarketPrice;
        const previousClose = meta.previousClose;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;
        
        const stock: StockData = {
          symbol: symbol.toUpperCase(),
          name: meta.longName || meta.shortName || symbol,
          price: currentPrice,
          change: change,
          changePercent: changePercent,
          volume: meta.regularMarketVolume?.toLocaleString(),
          marketCap: meta.marketCap ? (meta.marketCap / 1e9).toFixed(1) + 'B' : undefined
        };
        
        setStockData(stock);
        onStockChange(symbol.toUpperCase());
        onStockDataChange?.(stock);
      } else {
        setError('Stock not found');
      }
    } catch (err) {
      setError('Failed to fetch stock data. Please try again.');
      console.error('Stock fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchStockData(searchQuery.trim().toUpperCase());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleQuickSelect = (symbol: string) => {
    setSearchQuery(symbol);
    fetchStockData(symbol);
  };

  // Load default stock on mount
  useEffect(() => {
    if (selectedStock && !stockData) {
      fetchStockData(selectedStock);
    } else if (!selectedStock) {
      fetchStockData('AAPL'); // Default to Apple
    }
  }, [selectedStock]);

  return (
    <Card className="bg-card border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Stock Search & Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter stock symbol (e.g., AAPL, TSLA)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch} 
            disabled={loading || !searchQuery.trim()}
            size="icon"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>

        {/* Quick Select Buttons */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">Popular:</span>
          {popularStocks.map((symbol) => (
            <Button
              key={symbol}
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(symbol)}
              className="h-7 text-xs"
            >
              {symbol}
            </Button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Current Stock Info */}
        {stockData && (
          <div className="p-4 rounded-lg bg-gradient-primary border border-border">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-lg">{stockData.symbol}</h3>
                <p className="text-xs text-muted-foreground truncate max-w-40">{stockData.name}</p>
              </div>
              <Badge variant={stockData.change >= 0 ? "default" : "destructive"}>
                {stockData.change >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {stockData.changePercent > 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%
              </Badge>
            </div>
            <div className="text-2xl font-bold mb-1">${stockData.price.toFixed(2)}</div>
            <div className={`text-sm ${stockData.change >= 0 ? 'text-success' : 'text-destructive'}`}>
              {stockData.change >= 0 ? '+' : ''}${stockData.change.toFixed(2)} Today
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {stockData && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="text-center p-2 rounded bg-muted">
              <div className="text-xs text-muted-foreground">Volume</div>
              <div className="font-semibold">{stockData.volume || 'N/A'}</div>
            </div>
            <div className="text-center p-2 rounded bg-muted">
              <div className="text-xs text-muted-foreground">Market Cap</div>
              <div className="font-semibold">{stockData.marketCap || 'N/A'}</div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !stockData && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-muted-foreground">Fetching stock data...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};