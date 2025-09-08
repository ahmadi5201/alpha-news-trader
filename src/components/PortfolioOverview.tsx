import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wallet, TrendingUp, TrendingDown, DollarSign, BarChart3, Target } from 'lucide-react';

export const PortfolioOverview = () => {
  // Mock portfolio data
  const portfolioData = {
    totalValue: 125430.75,
    totalGain: 8750.23,
    totalGainPercent: 7.51,
    dayChange: 1245.67,
    dayChangePercent: 1.01,
    cashBalance: 15240.50,
    positions: [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        shares: 50,
        avgPrice: 165.20,
        currentPrice: 175.43,
        totalValue: 8771.50,
        gain: 511.50,
        gainPercent: 6.19,
        allocation: 7.0
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        shares: 15,
        avgPrice: 2850.00,
        currentPrice: 2847.52,
        totalValue: 42712.80,
        gain: -37.20,
        gainPercent: -0.09,
        allocation: 34.1
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        shares: 80,
        avgPrice: 390.50,
        currentPrice: 414.78,
        totalValue: 33182.40,
        gain: 1942.40,
        gainPercent: 6.22,
        allocation: 26.5
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        shares: 45,
        avgPrice: 245.80,
        currentPrice: 238.45,
        totalValue: 10730.25,
        gain: -330.75,
        gainPercent: -2.99,
        allocation: 8.6
      },
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corp.',
        shares: 35,
        avgPrice: 820.00,
        currentPrice: 875.28,
        totalValue: 30634.80,
        gain: 1934.80,
        gainPercent: 6.74,
        allocation: 24.4
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-primary border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Portfolio</p>
                <p className="text-2xl font-bold">${portfolioData.totalValue.toLocaleString()}</p>
                <p className={`text-xs ${portfolioData.totalGainPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {portfolioData.totalGainPercent >= 0 ? '+' : ''}${portfolioData.totalGain.toLocaleString()} ({portfolioData.totalGainPercent}%)
                </p>
              </div>
              <Wallet className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Change</p>
                <p className={`text-2xl font-bold ${portfolioData.dayChangePercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {portfolioData.dayChangePercent >= 0 ? '+' : ''}${portfolioData.dayChange.toLocaleString()}
                </p>
                <p className={`text-xs ${portfolioData.dayChangePercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {portfolioData.dayChangePercent >= 0 ? '+' : ''}{portfolioData.dayChangePercent}%
                </p>
              </div>
              {portfolioData.dayChangePercent >= 0 ? (
                <TrendingUp className="w-8 h-8 text-success" />
              ) : (
                <TrendingDown className="w-8 h-8 text-destructive" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cash Balance</p>
                <p className="text-2xl font-bold">${portfolioData.cashBalance.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Available to trade</p>
              </div>
              <DollarSign className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Positions</p>
                <p className="text-2xl font-bold">{portfolioData.positions.length}</p>
                <p className="text-xs text-muted-foreground">Holdings</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Allocation */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Portfolio Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolioData.positions.map((position) => (
              <div key={position.symbol} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{position.symbol}</span>
                    <span className="text-sm text-muted-foreground">{position.name}</span>
                  </div>
                  <span className="text-sm font-medium">{position.allocation}%</span>
                </div>
                <Progress value={position.allocation} className="h-2" />
              </div>
            ))}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="font-medium">Cash</span>
                <span className="text-sm font-medium">12.1%</span>
              </div>
              <Progress value={12.1} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Holdings Detail */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Current Holdings</CardTitle>
          <Button variant="outline" size="sm">
            Add Position
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolioData.positions.map((position) => (
              <div key={position.symbol} className="p-4 rounded-lg border border-border bg-muted hover:bg-muted/80 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold">{position.symbol}</h3>
                      <p className="text-sm text-muted-foreground">{position.name}</p>
                    </div>
                  </div>
                  <Badge variant={position.gainPercent >= 0 ? "default" : "destructive"}>
                    {position.gainPercent >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {position.gainPercent >= 0 ? '+' : ''}{position.gainPercent}%
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Shares</p>
                    <p className="font-medium">{position.shares}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Price</p>
                    <p className="font-medium">${position.avgPrice}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Price</p>
                    <p className="font-medium">${position.currentPrice}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Value</p>
                    <p className="font-medium">${position.totalValue.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className={`text-sm ${position.gainPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {position.gain >= 0 ? '+' : ''}${position.gain.toLocaleString()} Total Gain/Loss
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Buy More</Button>
                    <Button variant="outline" size="sm">Sell</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Trading Recommendations */}
      <Card className="bg-gradient-success border-border shadow-card">
        <CardHeader>
          <CardTitle>AI Trading Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-card/50 border border-success/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Rebalance Portfolio</span>
                <Badge variant="outline" className="text-success border-success">High Priority</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Consider reducing GOOGL allocation and increasing NVDA position based on AI predictions.
              </p>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
            
            <div className="p-3 rounded-lg bg-card/50 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Stop Loss Alert</span>
                <Badge variant="outline" className="text-warning border-warning">Medium Priority</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                TSLA approaching stop loss threshold. Consider adjusting strategy.
              </p>
              <Button size="sm" variant="outline">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};