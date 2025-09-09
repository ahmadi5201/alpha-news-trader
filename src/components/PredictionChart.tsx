import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

interface PredictionChartProps {
  selectedStock: string;
  modelType: string;
}

export const PredictionChart = ({ selectedStock, modelType }: PredictionChartProps) => {
  // Generate realistic prediction data with actual dates
  const today = new Date();
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  // Generate future dates for predictions
  const generatePredictions = () => {
    const predictions = [];
    const basePrice = 175 + Math.random() * 50; // Random base price
    
    for (let i = 1; i <= 30; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      
      // Generate price with some volatility
      const volatility = (Math.random() - 0.5) * 0.02; // ±1% daily volatility
      const trendFactor = 1 + (i * 0.001); // Slight upward trend
      const price = basePrice * trendFactor * (1 + volatility);
      
      predictions.push({
        date: formatDate(futureDate),
        fullDate: futureDate,
        price: price,
        confidence: Math.max(0.5, 0.95 - (i * 0.015)) // Decreasing confidence over time
      });
    }
    return predictions;
  };

  const predictions = generatePredictions();
  
  // Determine buy/sell signals based on price trends
  const getBuySellSignals = () => {
    const signals = [];
    const currentPrice = predictions[0]?.price || 175;
    
    // Find significant price movements for buy/sell signals
    for (let i = 0; i < predictions.length - 1; i++) {
      const current = predictions[i];
      const next = predictions[i + 1];
      
      if (next && current) {
        const priceChange = ((next.price - current.price) / current.price) * 100;
        
        // Buy signal: significant dip followed by recovery
        if (priceChange < -2 && i < predictions.length - 5) {
          const futurePrice = predictions[i + 3]?.price;
          if (futurePrice && futurePrice > current.price) {
            signals.push({
              date: current.fullDate,
              dateStr: current.date,
              type: 'BUY',
              price: current.price,
              reason: 'Technical dip - buy opportunity',
              confidence: current.confidence
            });
          }
        }
        
        // Sell signal: significant gain
        if (priceChange > 3 && current.confidence > 0.7) {
          signals.push({
            date: current.fullDate,
            dateStr: current.date,
            type: 'SELL',
            price: current.price,
            reason: 'Take profit - resistance level',
            confidence: current.confidence
          });
        }
      }
    }
    
    return signals.slice(0, 3); // Limit to 3 signals
  };

  const buySellSignals = getBuySellSignals();

  return (
    <div className="space-y-6">
      {/* Chart Header */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              <span>{selectedStock} Price Predictions - {modelType}</span>
            </div>
            <Badge variant="outline">Live</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mock Chart Area */}
          <div className="h-96 w-full bg-gradient-primary rounded-lg border border-primary/20 flex items-center justify-center relative overflow-hidden">
            {/* Chart Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-12 h-full">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="border-r border-primary/20"></div>
                ))}
              </div>
              <div className="absolute inset-0 grid grid-rows-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border-b border-primary/20"></div>
                ))}
              </div>
            </div>
            
            {/* Mock Chart Line */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
              {/* Historical line (blue) */}
              <path
                d="M 50 250 Q 100 200 150 180 Q 200 220 250 150"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                className="opacity-80"
              />
              
              {/* Prediction line (green) */}
              <path
                d="M 250 150 Q 300 120 350 100"
                fill="none"
                stroke="hsl(var(--success))"
                strokeWidth="3"
                strokeDasharray="8,4"
                className="opacity-80"
              />
              
              {/* Confidence bands */}
              <path
                d="M 250 130 Q 300 100 350 80 L 350 120 Q 300 140 250 170 Z"
                fill="hsl(var(--success))"
                className="opacity-20"
              />
              
              {/* Data points */}
              <circle cx="50" cy="250" r="4" fill="hsl(var(--primary))" />
              <circle cx="150" cy="180" r="4" fill="hsl(var(--primary))" />
              <circle cx="250" cy="150" r="4" fill="hsl(var(--primary))" />
              <circle cx="350" cy="100" r="4" fill="hsl(var(--success))" />
            </svg>
            
            {/* Chart Labels */}
            <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
              Historical Data
            </div>
            <div className="absolute top-4 right-4 text-xs text-success">
              Predictions (90 days)
            </div>
          </div>
          
          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-primary"></div>
              <span>Historical Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-success border-dashed"></div>
              <span>Predicted Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-2 bg-success/20 rounded"></div>
              <span>Confidence Band</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Trend Direction</p>
                <p className="font-bold text-success">Bullish</p>
                <p className="text-xs text-muted-foreground">Next 30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Price Target</p>
                <p className="font-bold">$187.90</p>
                <p className="text-xs text-success">+7.1% upside</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Model Accuracy</p>
                <p className="font-bold">84.2%</p>
                <p className="text-xs text-muted-foreground">Last 100 predictions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Buy/Sell Signals */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Trading Signals & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {buySellSignals.length > 0 ? (
            <div className="space-y-4">
              {buySellSignals.map((signal, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${
                  signal.type === 'BUY' 
                    ? 'bg-success/10 border-success/30' 
                    : 'bg-warning/10 border-warning/30'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant={signal.type === 'BUY' ? 'default' : 'secondary'} className="font-bold">
                        {signal.type}
                      </Badge>
                      <div className="text-lg font-bold">${signal.price.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">on {signal.dateStr}</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Confidence: </span>
                      <span className="font-semibold">{Math.round(signal.confidence * 100)}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{signal.reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No strong buy/sell signals detected for the next 30 days</p>
              <p className="text-xs">Continue monitoring for opportunities</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Predictions Table */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle>30-Day Price Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {predictions.slice(0, 30).map((prediction, index) => {
              const basePrice = predictions[0]?.price || 175;
              const change = ((prediction.price - basePrice) / basePrice) * 100;
              const dayLabel = index === 0 ? 'Tomorrow' : 
                             index === 6 ? 'Next Week' : 
                             index === 13 ? '2 Weeks' : 
                             index === 29 ? '1 Month' : `Day ${index + 1}`;
              
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium w-24">{prediction.date}</div>
                    <div className="text-sm text-muted-foreground w-20">{dayLabel}</div>
                    <div className="text-lg font-bold">${prediction.price.toFixed(2)}</div>
                    <Badge variant={change > 0 ? "default" : "destructive"} className="text-xs">
                      {change > 0 ? '+' : ''}{change.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground">
                      {Math.round(prediction.confidence * 100)}% confidence
                    </div>
                    <div className="w-16 h-2 bg-background rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${prediction.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};