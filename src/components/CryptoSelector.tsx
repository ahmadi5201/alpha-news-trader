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
  currency?: string;
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

export const CryptoSelector = ({ selectedCrypto, onCryptoChange, onCryptoDataChange, currency = 'usd' }: CryptoSelectorProps) => {
  
  const currencySymbols: Record<string, string> = {
    usd: '$',
    eur: '€',
    sek: 'kr'
  };
  
  const getCurrencySymbol = () => {
    return currencySymbols[currency];
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState<CryptoData[]>([]);
  const [trendingCryptos, setTrendingCryptos] = useState<TrendingCrypto[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);

  // Popular cryptocurrencies organized by categories (CoinCap IDs)
  const cryptoCategories = {
    'Top Coins': ['bitcoin', 'ethereum', 'binance-coin', 'solana', 'toncoin', 'dogecoin'],
    'Layer 1': ['ethereum', 'solana', 'avalanche', 'cardano', 'polkadot', 'near-protocol'],
    'DeFi': ['uniswap', 'aave', 'maker', 'compound', 'curve-dao-token', 'sushi'],
    'AI & Data': ['fetch-ai', 'singularitynet', 'ocean-protocol', 'numeraire', 'cortex', 'deepbrain-chain'],
    'Gaming': ['axie-infinity', 'the-sandbox', 'decentraland', 'enjin-coin', 'gala', 'immutable-x'],
    'Meme': ['dogecoin', 'shiba-inu', 'pepe', 'bonk', 'floki', 'baby-doge-coin']
  };
  
  const [selectedCryptoCategory, setSelectedCryptoCategory] = useState<string>('Top Coins');
  const allPopularCryptos = Object.values(cryptoCategories).flat();

  // API fallback system - tries each API in order until one works
  const fetchCryptoData = async (cryptoId: string) => {
    if (!cryptoId) return;
    
    setLoading(true);
    setError('');
    
    // Define API providers with their fetch functions
    const apiProviders = [
      {
        name: 'CoinCap',
        fetch: async (id: string) => {
          const symbolToId: Record<string, string> = {
            btc: 'bitcoin', eth: 'ethereum', bnb: 'binance-coin', ton: 'toncoin',
            avax: 'avalanche', ada: 'cardano', dot: 'polkadot', sol: 'solana', matic: 'polygon'
          };
          const normalizedId = symbolToId[id.toLowerCase()] || id.toLowerCase();
          
          const response = await fetch(`https://api.coincap.io/v2/assets/${normalizedId}`);
          if (!response.ok) throw new Error('CoinCap API failed');
          
          const result = await response.json();
          const data = result.data;
          if (!data || !data.id) throw new Error('Invalid data');
          
          // Currency conversion rates
          const currencyRates: Record<string, number> = {
            usd: 1,
            eur: 0.92,
            sek: 10.50
          };
          const rate = currencyRates[currency];
          
          const priceUSD = parseFloat(data.priceUsd) || 0;
          const change24hUSD = parseFloat(data.changePercent24Hr) ? (priceUSD * parseFloat(data.changePercent24Hr) / 100) : 0;
          
          return {
            id: data.id,
            symbol: (data.symbol || '').toUpperCase(),
            name: data.name || 'Unknown',
            price: priceUSD * rate,
            change24h: change24hUSD * rate,
            changePercent24h: parseFloat(data.changePercent24Hr) || 0,
            volume24h: data.volumeUsd24Hr ? (parseFloat(data.volumeUsd24Hr) * rate).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 'N/A',
            marketCap: data.marketCapUsd ? ((parseFloat(data.marketCapUsd) * rate) / 1e9).toFixed(1) + 'B' : 'N/A',
          };
        }
      },
      {
        name: 'CoinGecko',
        fetch: async (id: string) => {
          const symbolToId: Record<string, string> = {
            btc: 'bitcoin', eth: 'ethereum', bnb: 'binancecoin', ton: 'the-open-network',
            avax: 'avalanche-2', ada: 'cardano', dot: 'polkadot', sol: 'solana', matic: 'polygon'
          };
          const normalizedId = symbolToId[id.toLowerCase()] || id.toLowerCase();
          
          const response = await fetch(`https://api.coingecko.com/api/v3/coins/${normalizedId}`);
          if (!response.ok) throw new Error('CoinGecko API failed');
          
          const data = await response.json();
          if (data.status?.error_code) throw new Error(data.status.error_message);
          if (!data.id || !data.market_data) throw new Error('Invalid data');
          
          const priceKey = currency.toLowerCase();
          return {
            id: data.id,
            symbol: (data.symbol || '').toUpperCase(),
            name: data.name || 'Unknown',
            price: data.market_data?.current_price?.[priceKey] || data.market_data?.current_price?.usd || 0,
            change24h: data.market_data?.price_change_24h_in_currency?.[priceKey] || data.market_data?.price_change_24h || 0,
            changePercent24h: data.market_data?.price_change_percentage_24h || 0,
            volume24h: data.market_data?.total_volume?.[priceKey]?.toLocaleString() || data.market_data?.total_volume?.usd?.toLocaleString() || 'N/A',
            marketCap: data.market_data?.market_cap?.[priceKey] ? (data.market_data.market_cap[priceKey] / 1e9).toFixed(1) + 'B' : (data.market_data?.market_cap?.usd ? (data.market_data.market_cap.usd / 1e9).toFixed(1) + 'B' : 'N/A'),
            image: data.image?.small
          };
        }
      },
      {
        name: 'CoinGecko (Proxy)',
        fetch: async (id: string) => {
          const symbolToId: Record<string, string> = {
            btc: 'bitcoin', eth: 'ethereum', bnb: 'binancecoin', ton: 'the-open-network',
            avax: 'avalanche-2', ada: 'cardano', dot: 'polkadot', sol: 'solana', matic: 'polygon'
          };
          const normalizedId = symbolToId[id.toLowerCase()] || id.toLowerCase();
          
          const response = await fetch(
            `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${normalizedId}`)}`
          );
          if (!response.ok) throw new Error('CoinGecko Proxy failed');
          
          const proxy = await response.json();
          const arr = JSON.parse(proxy.contents);
          if (!Array.isArray(arr) || arr.length === 0) throw new Error('No data');
          
          const c = arr[0];
          return {
            id: c.id,
            symbol: (c.symbol || '').toUpperCase(),
            name: c.name || 'Unknown',
            price: c.current_price ?? 0,
            change24h: c.price_change_24h ?? 0,
            changePercent24h: c.price_change_percentage_24h ?? 0,
            volume24h: typeof c.total_volume === 'number' ? c.total_volume.toLocaleString() : 'N/A',
            marketCap: typeof c.market_cap === 'number' ? (c.market_cap / 1e9).toFixed(1) + 'B' : 'N/A',
            image: c.image
          };
        }
      }
    ];
    
    // Try each API in sequence until one works
    let lastError: Error | null = null;
    for (const provider of apiProviders) {
      try {
        console.log(`Trying ${provider.name}...`);
        const cryptoData = await provider.fetch(cryptoId);
        
        // Success! Update state and return
        setCryptoData(cryptoData);
        onCryptoChange(cryptoData.id);
        onCryptoDataChange?.(cryptoData);
        console.log(`✓ ${provider.name} succeeded`);
        setLoading(false);
        return;
      } catch (err) {
        console.warn(`✗ ${provider.name} failed:`, err);
        lastError = err as Error;
        // Continue to next provider
      }
    }
    
    // All APIs failed
    console.error('All APIs failed. Last error:', lastError);
    setError('Unable to fetch data from any provider. Please try again later.');
    setLoading(false);
  };


  const searchCryptos = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    // Try multiple search APIs with fallback
    const searchProviders = [
      {
        name: 'CoinCap',
        search: async () => {
          const response = await fetch(`https://api.coincap.io/v2/assets?search=${encodeURIComponent(query)}&limit=5`);
          if (!response.ok) throw new Error('CoinCap search failed');
          const result = await response.json();
          return result.data.map((coin: any) => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
          }));
        }
      },
      {
        name: 'CoinGecko',
        search: async () => {
          const response = await fetch(
            `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`)}`
          );
          if (!response.ok) throw new Error('CoinGecko search failed');
          const proxy = await response.json();
          const data = JSON.parse(proxy.contents);
          return data.coins.slice(0, 5).map((coin: any) => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            image: coin.thumb
          }));
        }
      }
    ];
    
    for (const provider of searchProviders) {
      try {
        const results = await provider.search();
        setSearchResults(results);
        return;
      } catch (err) {
        console.warn(`${provider.name} search failed:`, err);
      }
    }
    
    // All search APIs failed
    console.error('All search APIs failed');
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

  // Refetch when currency changes
  useEffect(() => {
    if (cryptoData) {
      fetchCryptoData(cryptoData.id);
    }
  }, [currency]);

  // Lightweight live price refresher (every 30s) with API fallback
  useEffect(() => {
    if (!cryptoData?.id) return;
    const id = cryptoData.id.toLowerCase();

    const update = async () => {
      // Try CoinCap first
      try {
        const resp = await fetch(`https://api.coincap.io/v2/assets/${id}`);
        if (resp.ok) {
          const result = await resp.json();
          const data = result.data;
          if (data) {
            setCryptoData((prev) => {
              if (!prev) return prev;
              const newPrice = parseFloat(data.priceUsd) || prev.price;
              const pct = parseFloat(data.changePercent24Hr) || prev.changePercent24h;
              const changeAbs = (newPrice * pct) / 100;
              return {
                ...prev,
                price: newPrice,
                changePercent24h: pct,
                change24h: changeAbs,
                volume24h: data.volumeUsd24Hr ? parseFloat(data.volumeUsd24Hr).toLocaleString(undefined, { maximumFractionDigits: 0 }) : prev.volume24h,
                marketCap: data.marketCapUsd ? (parseFloat(data.marketCapUsd) / 1e9).toFixed(1) + 'B' : prev.marketCap,
              };
            });
            return;
          }
        }
      } catch {}
      
      // Fallback to CoinGecko simple price API
      try {
        const symbolToId: Record<string, string> = {
          'bitcoin': 'bitcoin', 'ethereum': 'ethereum', 'binance-coin': 'binancecoin',
          'solana': 'solana', 'toncoin': 'the-open-network', 'avalanche': 'avalanche-2'
        };
        const geckoId = symbolToId[id] || id;
        
        const resp = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${geckoId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
        );
        if (resp.ok) {
          const simple = await resp.json();
          const entry = simple?.[geckoId];
          if (entry) {
            setCryptoData((prev) => {
              if (!prev) return prev;
              const newPrice = entry.usd || prev.price;
              const pct = entry.usd_24h_change || prev.changePercent24h;
              return {
                ...prev,
                price: newPrice,
                changePercent24h: pct,
                change24h: (newPrice * pct) / 100,
                volume24h: entry.usd_24h_vol ? entry.usd_24h_vol.toLocaleString() : prev.volume24h,
                marketCap: entry.usd_market_cap ? (entry.usd_market_cap / 1e9).toFixed(1) + 'B' : prev.marketCap,
              };
            });
          }
        }
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
                {cryptoId === 'binance-coin' ? 'BNB' : 
                 cryptoId === 'avalanche' ? 'AVAX' : 
                 cryptoId === 'toncoin' ? 'TON' :
                 cryptoId === 'curve-dao-token' ? 'CRV' :
                 cryptoId === 'enjin-coin' ? 'ENJ' :
                 cryptoId === 'near-protocol' ? 'NEAR' :
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
            <div className="text-2xl font-bold mb-1">{getCurrencySymbol()}{cryptoData.price.toLocaleString()}</div>
            <div className={`text-sm ${cryptoData.changePercent24h >= 0 ? 'text-success' : 'text-destructive'}`}>
              {cryptoData.changePercent24h >= 0 ? '+' : ''}{getCurrencySymbol()}{cryptoData.change24h?.toFixed(2)} (24h)
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