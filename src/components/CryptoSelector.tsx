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

  // Popular cryptocurrencies organized by categories
  const cryptoCategories = {
    'Top Coins': ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'the-open-network', 'dogecoin'],
    'Layer 1': ['ethereum', 'solana', 'avalanche-2', 'cardano', 'polkadot', 'near'],
    'DeFi': ['uniswap', 'aave', 'maker', 'compound-governance-token', 'curve-dao-token', 'sushi'],
    'AI & Data': ['fetch-ai', 'singularitynet', 'ocean-protocol', 'numeraire', 'cortex', 'deepbrain-chain'],
    'Gaming': ['axie-infinity', 'the-sandbox', 'decentraland', 'enjincoin', 'gala', 'immutable-x'],
    'Meme': ['dogecoin', 'shiba-inu', 'pepe', 'bonk', 'floki', 'baby-doge-coin']
  };
  
  const [selectedCryptoCategory, setSelectedCryptoCategory] = useState<string>('Top Coins');
  const allPopularCryptos = Object.values(cryptoCategories).flat();

  // Cache-busting helper to avoid proxy caching stale prices
  const withCB = (url: string) => url + (url.includes('?') ? '&' : '?') + 'cb=' + Date.now();

  const fetchCryptoData = async (cryptoId: string) => {
    if (!cryptoId) return;
    
    // Normalize common symbols to CoinGecko IDs
    const symbolToId: Record<string, string> = {
      btc: 'bitcoin', eth: 'ethereum', bnb: 'binancecoin', ton: 'the-open-network',
      avax: 'avalanche-2', ada: 'cardano', dot: 'polkadot', sol: 'solana', matic: 'polygon'
    };
    const normalizedId = symbolToId[cryptoId.toLowerCase()] || cryptoId.toLowerCase();
    
    setLoading(true);
    setError('');
    
    try {
      // First try the lightweight markets endpoint (more reliable and less rate-limited)
      try {
        const mktResp = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(withCB(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${normalizedId}`))}`);
        if (mktResp.ok) {
          const proxy = await mktResp.json();
          const arr = JSON.parse(proxy.contents);
          if (Array.isArray(arr) && arr.length > 0) {
            const c = arr[0];
            const crypto: CryptoData = {
              id: c.id,
              symbol: (c.symbol || '').toUpperCase(),
              name: c.name || 'Unknown',
              price: c.current_price ?? 0,
              change24h: c.price_change_24h ?? (c.current_price * (c.price_change_percentage_24h ?? 0) / 100) ?? 0,
              changePercent24h: c.price_change_percentage_24h ?? 0,
              volume24h: typeof c.total_volume === 'number' ? c.total_volume.toLocaleString() : 'N/A',
              marketCap: typeof c.market_cap === 'number' ? (c.market_cap / 1e9).toFixed(1) + 'B' : 'N/A',
              image: c.image
            };
            setCryptoData(crypto);
            onCryptoChange(c.id);
            onCryptoDataChange?.(crypto);
            return; // success via markets endpoint
          }
        }
      } catch (_) {
        // Ignore and fall through to full /coins endpoint below
      }

      // Fallback to full /coins endpoint
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(withCB(`https://api.coingecko.com/api/v3/coins/${normalizedId}`))}`);
      
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
        const fallbackData = getFallbackCryptoData(normalizedId);
        if (fallbackData) {
          setCryptoData(fallbackData);
          onCryptoChange(normalizedId);
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

  // Lightweight live price refresher (every 30s) to keep ETH and others accurate
  useEffect(() => {
    if (!cryptoData?.id) return;
    const id = cryptoData.id.toLowerCase();

    const update = async () => {
      try {
        const resp = await fetch(
          `https://api.allorigins.win/get?url=${encodeURIComponent(
            withCB(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`)
          )}`
        );
        if (!resp.ok) return;
        const pr = await resp.json();
        const simple = JSON.parse(pr.contents);
        const entry = simple?.[id];
        if (!entry) return;

        setCryptoData((prev) => {
          if (!prev) return prev;
          const newPrice = typeof entry.usd === 'number' ? entry.usd : prev.price;
          const pct = typeof entry.usd_24h_change === 'number' ? entry.usd_24h_change : prev.changePercent24h;
          const changeAbs = typeof pct === 'number' && typeof newPrice === 'number' ? (newPrice * pct) / 100 : prev.change24h;
          const vol = entry.usd_24h_vol;
          const mkt = entry.usd_market_cap;
          return {
            ...prev,
            price: newPrice,
            changePercent24h: pct,
            change24h: changeAbs,
            volume24h: typeof vol === 'number' ? vol.toLocaleString() : prev.volume24h,
            marketCap: typeof mkt === 'number' ? (mkt / 1e9).toFixed(1) + 'B' : prev.marketCap,
          };
        });
      } catch {}
    };

    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [cryptoData?.id]);

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

        {/* Category Selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Categories:</span>
            {Object.keys(cryptoCategories).map((category) => (
              <Button
                key={category}
                variant={selectedCryptoCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCryptoCategory(category)}
                className="h-6 text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
          
          {/* Category Cryptos */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center">{selectedCryptoCategory}:</span>
            {cryptoCategories[selectedCryptoCategory as keyof typeof cryptoCategories].map((cryptoId) => (
              <Button
                key={cryptoId}
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect(cryptoId)}
                className="h-7 text-xs capitalize"
              >
                {cryptoId === 'binancecoin' ? 'BNB' : 
                 cryptoId === 'avalanche-2' ? 'AVAX' : 
                 cryptoId === 'the-open-network' ? 'TON' :
                 cryptoId === 'curve-dao-token' ? 'CRV' :
                 cryptoId === 'compound-governance-token' ? 'COMP' :
                 cryptoId.replace('-', ' ')}
              </Button>
            ))}
          </div>
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