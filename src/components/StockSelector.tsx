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
  currency?: string;
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

export const StockSelector = ({ selectedStock, onStockChange, onStockDataChange, currency = 'usd' }: StockSelectorProps) => {
  
  const currencySymbols: Record<string, string> = {
    usd: '$',
    eur: '€',
    sek: 'kr'
  };
  
  const currencyRates: Record<string, number> = {
    usd: 1,
    eur: 0.92,
    sek: 10.50
  };
  
  const convertPrice = (priceUSD: number) => {
    return priceUSD * currencyRates[currency];
  };
  
  const getCurrencySymbol = () => {
    return currencySymbols[currency];
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tech Giants');

  // Popular stocks organized by categories
  const stockCategories = {
    'Tech Giants': ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META', 'NFLX'],
    'Finance': ['JPM', 'BAC', 'WFC', 'GS', 'MS', 'C'],
    'Healthcare': ['JNJ', 'PFE', 'UNH', 'ABBV', 'MRK', 'BMY'],
    'Consumer': ['KO', 'PEP', 'WMT', 'HD', 'MCD', 'NKE'],
    'Energy': ['XOM', 'CVX', 'COP', 'SLB', 'EOG', 'MPC'],
    'Industrial': ['BA', 'CAT', 'GE', 'MMM', 'HON', 'LMT']
  };
  
  const allPopularStocks = Object.values(stockCategories).flat();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    searchStocks(value);
  };

  const searchStocks = (query: string) => {
    if (!query || query.length < 1) {
      setSearchResults([]);
      return;
    }
    
    // Search through popular stocks for matches
    const matches = allPopularStocks.filter(symbol => 
      symbol.toLowerCase().includes(query.toLowerCase())
    );
    
    // Add some common stock suggestions based on query
    const suggestions = [
      { symbol: 'AAPL', name: 'Apple Inc.' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.' },
      { symbol: 'MSFT', name: 'Microsoft Corporation' },
      { symbol: 'TSLA', name: 'Tesla, Inc.' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation' },
      { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
      { symbol: 'META', name: 'Meta Platforms, Inc.' },
      { symbol: 'NFLX', name: 'Netflix, Inc.' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
      { symbol: 'BAC', name: 'Bank of America Corporation' },
      { symbol: 'JNJ', name: 'Johnson & Johnson' },
      { symbol: 'UNH', name: 'UnitedHealth Group Incorporated' },
      { symbol: 'KO', name: 'The Coca-Cola Company' },
      { symbol: 'PEP', name: 'PepsiCo, Inc.' },
      { symbol: 'WMT', name: 'Walmart Inc.' },
      { symbol: 'HD', name: 'The Home Depot, Inc.' },
      { symbol: 'XOM', name: 'Exxon Mobil Corporation' },
      { symbol: 'CVX', name: 'Chevron Corporation' },
      { symbol: 'BA', name: 'The Boeing Company' },
      { symbol: 'CAT', name: 'Caterpillar Inc.' }
    ].filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    setSearchResults(suggestions);
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
        <div className="relative">
          <div className="flex gap-2">
            <Input
              placeholder="Search stocks by symbol or company name..."
              value={searchQuery}
              onChange={handleInputChange}
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
          
          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
              {searchResults.map((result) => (
                <button
                  key={result.symbol}
                  onClick={() => { handleQuickSelect(result.symbol); setSearchResults([]); }}
                  className="w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-2"
                >
                  <div>
                    <div className="font-medium">{result.symbol}</div>
                    <div className="text-sm text-muted-foreground">{result.name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Categories:</span>
            {Object.keys(stockCategories).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="h-6 text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
          
          {/* Category Stocks */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center">{selectedCategory}:</span>
            {stockCategories[selectedCategory as keyof typeof stockCategories].map((symbol) => (
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
            <div className="text-2xl font-bold mb-1">{getCurrencySymbol()}{convertPrice(stockData.price).toFixed(2)}</div>
            <div className={`text-sm ${stockData.change >= 0 ? 'text-success' : 'text-destructive'}`}>
              {stockData.change >= 0 ? '+' : ''}{getCurrencySymbol()}{convertPrice(stockData.change).toFixed(2)} Today
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