import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Search, Loader2 } from 'lucide-react';

interface CryptoSelectorProps {
  selectedCrypto: string;
  onCryptoChange: (crypto: string) => void;
  onCryptoDataChange?: (cryptoData: CryptoData | null) => void;
}

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h?: string;
  marketCap?: string;
  image?: string;
}

interface TrendingCrypto {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  price_btc: number;
}

export const CryptoSelector = ({ selectedCrypto, onCryptoChange, onCryptoDataChange }: CryptoSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState<CryptoData[]>([]);
  const [trendingCryptos, setTrendingCryptos] = useState<TrendingCrypto[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);

  // Updated popular cryptocurrencies including trending ones
  const popularCryptos = ['bitcoin', 'ethereum', 'solana', 'sui', 'aptos', 'avalanche-2', 'cardano', 'polygon'];

  const fetchCryptoData = async (cryptoId: string) => {
    if (!cryptoId) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Using CoinGecko API with CORS proxy
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.coingecko.com/api/v3/coins/${cryptoId.toLowerCase()}`)}`);
      
      if (!response.ok) {
        throw new Error('Network error occurred');
      }
      
      const proxyResponse = await response.json();
      const data = JSON.parse(proxyResponse.contents);
      
      // Check if API returned an error (like rate limit)
      if (data.status && data.status.error_code) {
        if (data.status.error_code === 429) {
          throw new Error('API rate limit exceeded. Using fallback data.');
        }
        throw new Error(data.status.error_message || 'API error occurred');
      }
      
      // Validate required fields exist
      if (!data.id || !data.symbol || !data.name || !data.market_data) {
        throw new Error('Invalid cryptocurrency data received');
      }
      
      const crypto: CryptoData = {
        id: data.id,
        symbol: data.symbol?.toUpperCase() || 'N/A',
        name: data.name || 'Unknown',
        price: data.market_data?.current_price?.usd || 0,
        change24h: data.market_data?.price_change_24h || 0,
        changePercent24h: data.market_data?.price_change_percentage_24h || 0,
        volume24h: data.market_data?.total_volume?.usd?.toLocaleString() || 'N/A',
        marketCap: data.market_data?.market_cap?.usd ? (data.market_data.market_cap.usd / 1e9).toFixed(1) + 'B' : 'N/A',
        image: data.image?.small
      };
      
      setCryptoData(crypto);
      onCryptoChange(data.id);
      onCryptoDataChange?.(crypto);
    } catch (err) {
      console.error('Crypto fetch error:', err);
      
      // Provide fallback data for common cryptocurrencies
      if (err instanceof Error && err.message.includes('rate limit')) {
        const fallbackData = getFallbackCryptoData(cryptoId);
        if (fallbackData) {
          setCryptoData(fallbackData);
          onCryptoChange(cryptoId);
          onCryptoDataChange?.(fallbackData);
          setError('Using cached data due to API limitations.');
          return;
        }
      }
      
      setError('Failed to fetch cryptocurrency data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fallback data for when API is rate limited
  const getFallbackCryptoData = (cryptoId: string): CryptoData | null => {
    const fallbackPrices: Record<string, CryptoData> = {
      'bitcoin': {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 112332,
        change24h: -1240,
        changePercent24h: -1.09,
        volume24h: '28,500,000,000',
        marketCap: '2220B'
      },
      'ethereum': {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        price: 3420,
        change24h: -85,
        changePercent24h: -2.42,
        volume24h: '15,200,000,000',
        marketCap: '411B'
      },
      'solana': {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        price: 142,
        change24h: 3.2,
        changePercent24h: 2.31,
        volume24h: '2,800,000,000',
        marketCap: '67B'
      },
      'sui': {
        id: 'sui',
        symbol: 'SUI',
        name: 'Sui',
        price: 1.85,
        change24h: 0.12,
        changePercent24h: 6.94,
        volume24h: '1,200,000,000',
        marketCap: '5.2B'
      }
    };
    
    return fallbackPrices[cryptoId] || null;
  };

  const searchCryptos = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`)}`);
      const proxyResponse = await response.json();
      const data = JSON.parse(proxyResponse.contents);
      
      const results = data.coins.slice(0, 5).map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.thumb
      }));
      
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchCryptoData(searchQuery.trim().toLowerCase());
      setSearchResults([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleQuickSelect = (cryptoId: string) => {
    setSearchQuery(cryptoId);
    fetchCryptoData(cryptoId);
    setSearchResults([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    searchCryptos(value);
  };

  const fetchTrendingCryptos = async () => {
    setTrendingLoading(true);
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://api.coingecko.com/api/v3/search/trending')}`);
      const proxyResponse = await response.json();
      const data = JSON.parse(proxyResponse.contents);
      
      setTrendingCryptos(data.coins.slice(0, 6).map((coin: any) => ({
        id: coin.item.id,
        name: coin.item.name,
        symbol: coin.item.symbol,
        market_cap_rank: coin.item.market_cap_rank,
        thumb: coin.item.thumb,
        price_btc: coin.item.price_btc
      })));
    } catch (err) {
      console.error('Failed to fetch trending cryptos:', err);
    } finally {
      setTrendingLoading(false);
    }
  };

  // Load default crypto and trending on mount
  useEffect(() => {
    if (selectedCrypto && !cryptoData) {
      fetchCryptoData(selectedCrypto);
    } else if (!selectedCrypto) {
      fetchCryptoData('bitcoin'); // Default to Bitcoin
    }
    fetchTrendingCryptos();
  }, [selectedCrypto]);

  return (
    <Card className="bg-card border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Cryptocurrency Search & Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="flex gap-2">
            <Input
              placeholder="Enter crypto name or symbol (e.g., bitcoin, ETH)"
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
                  key={result.id}
                  onClick={() => handleQuickSelect(result.id)}
                  className="w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-2"
                >
                  {result.image && (
                    <img src={result.image} alt={result.name} className="w-6 h-6 rounded-full" />
                  )}
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-muted-foreground">{result.symbol}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Select Buttons */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">Popular:</span>
          {popularCryptos.map((cryptoId) => (
            <Button
              key={cryptoId}
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(cryptoId)}
              className="h-7 text-xs capitalize"
            >
              {cryptoId === 'binancecoin' ? 'BNB' : 
               cryptoId === 'avalanche-2' ? 'AVAX' : 
               cryptoId === 'sui' ? 'SUI' :
               cryptoId === 'aptos' ? 'APT' :
               cryptoId.replace('-', ' ')}
            </Button>
          ))}
        </div>

        {/* Trending Cryptocurrencies */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">🔥 Trending Now</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchTrendingCryptos}
              disabled={trendingLoading}
              className="h-6 text-xs"
            >
              {trendingLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Refresh'}
            </Button>
          </div>
          
          {trendingCryptos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {trendingCryptos.map((crypto) => (
                <Button
                  key={crypto.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickSelect(crypto.id)}
                  className="h-auto p-2 flex items-center gap-2 justify-start hover:bg-gradient-primary/10"
                >
                  <img src={crypto.thumb} alt={crypto.name} className="w-5 h-5 rounded-full" />
                  <div className="text-left">
                    <div className="text-xs font-medium">{crypto.symbol}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-16">#{crypto.market_cap_rank}</div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Current Crypto Info */}
        {cryptoData && (
          <div className="p-4 rounded-lg bg-gradient-primary border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {cryptoData.image && (
                  <img src={cryptoData.image} alt={cryptoData.name} className="w-8 h-8 rounded-full" />
                )}
                <div>
                  <h3 className="font-bold text-lg">{cryptoData.symbol}</h3>
                  <p className="text-xs text-muted-foreground truncate max-w-40">{cryptoData.name}</p>
                </div>
              </div>
              <Badge variant={cryptoData.changePercent24h >= 0 ? "default" : "destructive"}>
                {cryptoData.changePercent24h >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {cryptoData.changePercent24h > 0 ? '+' : ''}{cryptoData.changePercent24h.toFixed(2)}%
              </Badge>
            </div>
            <div className="text-2xl font-bold mb-1">${cryptoData.price.toLocaleString()}</div>
            <div className={`text-sm ${cryptoData.changePercent24h >= 0 ? 'text-success' : 'text-destructive'}`}>
              {cryptoData.changePercent24h >= 0 ? '+' : ''}${cryptoData.change24h?.toFixed(2)} (24h)
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {cryptoData && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="text-center p-2 rounded bg-muted">
              <div className="text-xs text-muted-foreground">Volume (24h)</div>
              <div className="font-semibold">${cryptoData.volume24h || 'N/A'}</div>
            </div>
            <div className="text-center p-2 rounded bg-muted">
              <div className="text-xs text-muted-foreground">Market Cap</div>
              <div className="font-semibold">${cryptoData.marketCap || 'N/A'}</div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !cryptoData && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-muted-foreground">Fetching cryptocurrency data...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};