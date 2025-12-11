import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, TrendingDown, Zap, Shield, Target, BarChart3, Activity } from 'lucide-react';
import { useState } from 'react';

interface Strategy {
  id: string;
  name: string;
  description: string;
  type: 'momentum' | 'mean-reversion' | 'trend-following' | 'arbitrage' | 'sentiment';
  performance: number;
  winRate: number;
  riskLevel: 'low' | 'medium' | 'high';
  enabled: boolean;
  signals: number;
  lastSignal: string;
}

interface MLStrategiesProps {
  selectedAsset: string;
  assetType: string;
}

export const MLStrategies = ({ selectedAsset, assetType }: MLStrategiesProps) => {
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: 'momentum-lstm',
      name: 'LSTM Momentum',
      description: 'Deep learning model detecting momentum patterns using LSTM networks',
      type: 'momentum',
      performance: 18.4,
      winRate: 67.2,
      riskLevel: 'medium',
      enabled: true,
      signals: 12,
      lastSignal: 'BUY'
    },
    {
      id: 'mean-reversion-rf',
      name: 'Random Forest Mean Reversion',
      description: 'Ensemble learning approach for mean reversion opportunities',
      type: 'mean-reversion',
      performance: 12.8,
      winRate: 71.5,
      riskLevel: 'low',
      enabled: true,
      signals: 8,
      lastSignal: 'HOLD'
    },
    {
      id: 'trend-xgb',
      name: 'XGBoost Trend Follower',
      description: 'Gradient boosting model for trend detection and following',
      type: 'trend-following',
      performance: 24.6,
      winRate: 62.3,
      riskLevel: 'high',
      enabled: false,
      signals: 15,
      lastSignal: 'BUY'
    },
    {
      id: 'sentiment-bert',
      name: 'BERT Sentiment Analyzer',
      description: 'NLP-based sentiment analysis from news and social media',
      type: 'sentiment',
      performance: 9.2,
      winRate: 58.9,
      riskLevel: 'medium',
      enabled: true,
      signals: 23,
      lastSignal: 'SELL'
    },
    {
      id: 'arb-neural',
      name: 'Neural Arbitrage Detector',
      description: 'Deep neural network for cross-market arbitrage opportunities',
      type: 'arbitrage',
      performance: 6.7,
      winRate: 82.1,
      riskLevel: 'low',
      enabled: false,
      signals: 3,
      lastSignal: 'HOLD'
    }
  ]);

  const toggleStrategy = (id: string) => {
    setStrategies(prev => 
      prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    );
  };

  const getTypeIcon = (type: Strategy['type']) => {
    switch (type) {
      case 'momentum': return <Zap className="w-4 h-4" />;
      case 'mean-reversion': return <Activity className="w-4 h-4" />;
      case 'trend-following': return <TrendingUp className="w-4 h-4" />;
      case 'arbitrage': return <BarChart3 className="w-4 h-4" />;
      case 'sentiment': return <Brain className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Strategy['type']) => {
    switch (type) {
      case 'momentum': return 'bg-chart-primary/20 text-chart-primary';
      case 'mean-reversion': return 'bg-chart-secondary/20 text-chart-secondary';
      case 'trend-following': return 'bg-success/20 text-success';
      case 'arbitrage': return 'bg-warning/20 text-warning';
      case 'sentiment': return 'bg-primary/20 text-primary';
    }
  };

  const getRiskColor = (risk: Strategy['riskLevel']) => {
    switch (risk) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'bg-success text-success-foreground';
      case 'SELL': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const enabledStrategies = strategies.filter(s => s.enabled);
  const avgPerformance = enabledStrategies.length > 0 
    ? enabledStrategies.reduce((sum, s) => sum + s.performance, 0) / enabledStrategies.length 
    : 0;
  const avgWinRate = enabledStrategies.length > 0
    ? enabledStrategies.reduce((sum, s) => sum + s.winRate, 0) / enabledStrategies.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Strategy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-primary border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Strategies</p>
                <p className="text-2xl font-bold">{enabledStrategies.length}/{strategies.length}</p>
              </div>
              <Brain className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-success border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Performance</p>
                <p className="text-2xl font-bold text-success">+{avgPerformance.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Win Rate</p>
                <p className="text-2xl font-bold">{avgWinRate.toFixed(1)}%</p>
                <Progress value={avgWinRate} className="w-16 h-1 mt-1" />
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Signals Today</p>
                <p className="text-2xl font-bold">{strategies.reduce((sum, s) => sum + s.signals, 0)}</p>
              </div>
              <Activity className="w-8 h-8 text-chart-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategy List */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>ML Trading Strategies for {selectedAsset.toUpperCase()}</span>
            <Button variant="outline" size="sm">
              <Brain className="w-4 h-4 mr-2" />
              Run All Active
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {strategies.map((strategy) => (
            <div 
              key={strategy.id}
              className={`p-4 rounded-lg border transition-all ${
                strategy.enabled 
                  ? 'bg-muted/50 border-primary/30' 
                  : 'bg-muted/20 border-border opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${getTypeColor(strategy.type)}`}>
                      {getTypeIcon(strategy.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{strategy.name}</h4>
                      <p className="text-sm text-muted-foreground">{strategy.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Performance</p>
                      <p className={`font-bold ${strategy.performance >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {strategy.performance >= 0 ? '+' : ''}{strategy.performance}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Win Rate</p>
                      <p className="font-bold">{strategy.winRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Risk Level</p>
                      <p className={`font-bold capitalize ${getRiskColor(strategy.riskLevel)}`}>
                        {strategy.riskLevel}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Signals Today</p>
                      <p className="font-bold">{strategy.signals}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Signal</p>
                      <Badge className={getSignalColor(strategy.lastSignal)}>
                        {strategy.lastSignal}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={strategy.enabled}
                    onCheckedChange={() => toggleStrategy(strategy.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Strategy Correlation Matrix */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Strategy Diversification Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="font-semibold mb-2">Correlation Score</h4>
              <p className="text-3xl font-bold text-success">0.23</p>
              <p className="text-sm text-muted-foreground">Low correlation = better diversification</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="font-semibold mb-2">Portfolio Risk Reduction</h4>
              <p className="text-3xl font-bold text-primary">34%</p>
              <p className="text-sm text-muted-foreground">Estimated risk reduction from diversification</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="font-semibold mb-2">Optimal Allocation</h4>
              <div className="space-y-1 text-sm">
                {enabledStrategies.map(s => (
                  <div key={s.id} className="flex justify-between">
                    <span>{s.name.split(' ')[0]}</span>
                    <span className="font-medium">{(100 / enabledStrategies.length).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
