import { useState } from 'react';
import { TradingDashboard } from '@/components/TradingDashboard';
import { StockSelector } from '@/components/StockSelector';
import { CryptoSelector } from '@/components/CryptoSelector';
import { ModelConfiguration } from '@/components/ModelConfiguration';
import { NewsAnalysis } from '@/components/NewsAnalysis';
import { PortfolioOverview } from '@/components/PortfolioOverview';
import { PredictionChart } from '@/components/PredictionChart';
import { StopLossConfig } from '@/components/StopLossConfig';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const Index = () => {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [cryptoData, setCryptoData] = useState<any>(null);
  const [modelConfig, setModelConfig] = useState({
    type: 'ARIMA',
    parameters: { p: 1, d: 1, q: 1 }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary shadow-glow"></div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-secondary bg-clip-text text-transparent">
                AI Trading Agent
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Market Status: <span className="text-success">Open</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Tabs defaultValue="stocks" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stocks">Stocks</TabsTrigger>
                <TabsTrigger value="crypto">Crypto</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stocks">
                <StockSelector 
                  selectedStock={selectedStock}
                  onStockChange={setSelectedStock}
                  onStockDataChange={setStockData}
                />
              </TabsContent>
              
              <TabsContent value="crypto">
                <CryptoSelector 
                  selectedCrypto={selectedCrypto}
                  onCryptoChange={setSelectedCrypto}
                  onCryptoDataChange={setCryptoData}
                />
              </TabsContent>
            </Tabs>
            
            <ModelConfiguration 
              config={modelConfig}
              onConfigChange={setModelConfig}
            />
            <StopLossConfig />
          </div>

          {/* Main Dashboard */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="analysis" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              </TabsList>

              <TabsContent value="analysis" className="space-y-6">
                <TradingDashboard 
                  selectedStock={selectedStock}
                  stockData={stockData}
                  modelConfig={modelConfig}
                />
              </TabsContent>

              <TabsContent value="predictions" className="space-y-6">
                <PredictionChart 
                  selectedStock={selectedStock}
                  modelType={modelConfig.type}
                />
              </TabsContent>

              <TabsContent value="news" className="space-y-6">
                <NewsAnalysis selectedStock={selectedStock} />
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-6">
                <PortfolioOverview />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;