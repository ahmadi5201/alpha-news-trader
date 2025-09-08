import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StockSelectorProps {
  selectedStock: string;
  onStockChange: (stock: string) => void;
}

const stockData = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.31, changePercent: 1.33 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2847.52, change: -12.45, changePercent: -0.44 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 414.78, change: 8.92, changePercent: 2.20 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 238.45, change: -5.67, changePercent: -2.32 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 23.45, changePercent: 2.75 },
];

export const StockSelector = ({ selectedStock, onStockChange }: StockSelectorProps) => {
  const currentStock = stockData.find(stock => stock.symbol === selectedStock) || stockData[0];

  return (
    <Card className="bg-card border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Stock Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedStock} onValueChange={onStockChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {stockData.map((stock) => (
              <SelectItem key={stock.symbol} value={stock.symbol}>
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{stock.symbol}</span>
                  <span className="text-sm text-muted-foreground ml-2">{stock.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Current Stock Info */}
        <div className="p-4 rounded-lg bg-gradient-primary border border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">{currentStock.symbol}</h3>
            <Badge variant={currentStock.change >= 0 ? "default" : "destructive"}>
              {currentStock.change >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {currentStock.changePercent > 0 ? '+' : ''}{currentStock.changePercent}%
            </Badge>
          </div>
          <div className="text-2xl font-bold mb-1">${currentStock.price}</div>
          <div className={`text-sm ${currentStock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
            {currentStock.change >= 0 ? '+' : ''}${currentStock.change} Today
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="text-center p-2 rounded bg-muted">
            <div className="text-xs text-muted-foreground">Volume</div>
            <div className="font-semibold">2.4M</div>
          </div>
          <div className="text-center p-2 rounded bg-muted">
            <div className="text-xs text-muted-foreground">Volatility</div>
            <div className="font-semibold">18.5%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};