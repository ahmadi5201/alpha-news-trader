import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';

interface TradingDashboardProps {
  selectedStock: string;
  modelConfig: {
    type: string;
    parameters: any;
  };
}

export const TradingDashboard = ({ selectedStock, modelConfig }: TradingDashboardProps) => {
  // Mock data for demonstration
  const analysisData = {
    currentPrice: 175.43,
    predictedPrice: 182.75,
    confidence: 87.2,
    trend: 'bullish',
    volatility: 18.5,
    riskScore: 6.2
  };

  const priceDiff = analysisData.predictedPrice - analysisData.currentPrice;
  const priceChangePercent = (priceDiff / analysisData.currentPrice) * 100;

  return (
    <div className="space-y-6">
      {/* Analysis Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-primary border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-2xl font-bold">${analysisData.currentPrice}</p>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-success border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Predicted Price</p>
                <p className="text-2xl font-bold">${analysisData.predictedPrice}</p>
                <p className={`text-xs ${priceDiff >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {priceDiff >= 0 ? '+' : ''}${priceDiff.toFixed(2)} ({priceChangePercent.toFixed(1)}%)
                </p>
              </div>
              <Target className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className="text-2xl font-bold">{analysisData.confidence}%</p>
                <Progress value={analysisData.confidence} className="w-16 h-1 mt-1" />
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <p className="text-2xl font-bold">{analysisData.riskScore}/10</p>
                <Badge variant={analysisData.riskScore <= 5 ? "default" : "destructive"} className="text-xs">
                  {analysisData.riskScore <= 3 ? 'Low' : analysisData.riskScore <= 7 ? 'Medium' : 'High'}
                </Badge>
              </div>
              <Activity className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Analysis Details */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{modelConfig.type} Analysis for {selectedStock}</span>
            <Badge variant="outline">{analysisData.trend.toUpperCase()}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="font-semibold mb-2">Technical Indicators</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>RSI (14)</span>
                  <span className="font-medium">68.4</span>
                </div>
                <div className="flex justify-between">
                  <span>MACD</span>
                  <span className="font-medium text-success">+2.3</span>
                </div>
                <div className="flex justify-between">
                  <span>Bollinger</span>
                  <span className="font-medium">Upper Band</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <h4 className="font-semibold mb-2">Model Parameters</h4>
              <div className="space-y-2 text-sm">
                {Object.entries(modelConfig.parameters).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="uppercase">{key}</span>
                    <span className="font-medium">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <h4 className="font-semibold mb-2">Volatility Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Historical Vol</span>
                  <span className="font-medium">{analysisData.volatility}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Implied Vol</span>
                  <span className="font-medium">22.1%</span>
                </div>
                <div className="flex justify-between">
                  <span>Vol Skew</span>
                  <span className="font-medium">-0.12</span>
                </div>
              </div>
            </div>
          </div>

          {/* Prediction Timeline */}
          <div className="pt-4 border-t border-border">
            <h4 className="font-semibold mb-3">Prediction Timeline</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                { period: '1 Day', price: 177.23, confidence: 92 },
                { period: '1 Week', price: 180.45, confidence: 87 },
                { period: '1 Month', price: 182.75, confidence: 76 },
                { period: '3 Months', price: 185.20, confidence: 64 }
              ].map((prediction) => (
                <div key={prediction.period} className="p-3 rounded-lg bg-gradient-primary border border-primary/20">
                  <div className="text-xs text-muted-foreground mb-1">{prediction.period}</div>
                  <div className="font-bold">${prediction.price}</div>
                  <div className="text-xs">
                    <Progress value={prediction.confidence} className="w-full h-1 mt-1" />
                    <span className="text-muted-foreground">{prediction.confidence}% confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};