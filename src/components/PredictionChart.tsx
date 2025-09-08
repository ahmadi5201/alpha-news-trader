import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

interface PredictionChartProps {
  selectedStock: string;
  modelType: string;
}

export const PredictionChart = ({ selectedStock, modelType }: PredictionChartProps) => {
  // Mock chart data - in real implementation, this would be actual chart data
  const chartData = {
    historical: [
      { date: '2024-01-01', price: 165.2 },
      { date: '2024-01-15', price: 168.4 },
      { date: '2024-02-01', price: 172.1 },
      { date: '2024-02-15', price: 169.8 },
      { date: '2024-03-01', price: 175.4 },
    ],
    predictions: [
      { date: '2024-03-15', price: 178.2, confidence: 0.9 },
      { date: '2024-04-01', price: 182.7, confidence: 0.8 },
      { date: '2024-04-15', price: 185.1, confidence: 0.7 },
      { date: '2024-05-01', price: 187.9, confidence: 0.6 },
    ]
  };

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

      {/* Detailed Predictions Table */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle>Detailed Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: 'Tomorrow', price: 177.23, change: 1.8, confidence: 92 },
              { date: 'Next Week', price: 180.45, change: 5.02, confidence: 87 },
              { date: '2 Weeks', price: 183.12, change: 7.69, confidence: 81 },
              { date: '1 Month', price: 185.90, change: 10.47, confidence: 74 },
              { date: '3 Months', price: 187.90, change: 12.47, confidence: 65 }
            ].map((prediction, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium w-20">{prediction.date}</div>
                  <div className="text-lg font-bold">${prediction.price}</div>
                  <Badge variant={prediction.change > 0 ? "default" : "destructive"} className="text-xs">
                    +{prediction.change}%
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground">
                    {prediction.confidence}% confidence
                  </div>
                  <div className="w-20 h-2 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${prediction.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};