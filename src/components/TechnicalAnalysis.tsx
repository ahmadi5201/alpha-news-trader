import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Activity, Target } from "lucide-react";

interface TechnicalAnalysisProps {
  selectedAsset: string;
  assetType: string;
  currentPrice?: number;
}

export const TechnicalAnalysis = ({ selectedAsset, assetType, currentPrice }: TechnicalAnalysisProps) => {
  // Mock data for order blocks - in real app this would come from API
  const orderBlocks = [
    {
      type: "Supply Zone",
      price: currentPrice ? currentPrice * 1.15 : 250,
      strength: 85,
      volume: "High",
      status: "Active"
    },
    {
      type: "Demand Zone", 
      price: currentPrice ? currentPrice * 0.92 : 200,
      strength: 78,
      volume: "Medium",
      status: "Active"
    },
    {
      type: "Supply Zone",
      price: currentPrice ? currentPrice * 1.08 : 230,
      strength: 65,
      volume: "Low",
      status: "Broken"
    }
  ];

  // Mock Fibonacci levels
  const fibLevels = [
    { level: "100%", price: currentPrice ? currentPrice * 1.20 : 260, type: "Extension" },
    { level: "78.6%", price: currentPrice ? currentPrice * 1.12 : 242, type: "Retracement" },
    { level: "61.8%", price: currentPrice ? currentPrice * 1.05 : 227, type: "Retracement" },
    { level: "50%", price: currentPrice || 216, type: "Retracement" },
    { level: "38.2%", price: currentPrice ? currentPrice * 0.95 : 205, type: "Retracement" },
    { level: "23.6%", price: currentPrice ? currentPrice * 0.88 : 190, type: "Retracement" },
    { level: "0%", price: currentPrice ? currentPrice * 0.80 : 172, type: "Base" }
  ];

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return "text-success";
    if (strength >= 60) return "text-warning";
    return "text-destructive";
  };

  const getStatusBadge = (status: string) => {
    return status === "Active" ? (
      <Badge variant="default" className="bg-success/20 text-success border-success/30">
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-muted text-muted-foreground">
        Broken
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Order Block Analysis */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Order Block Analysis
            <Badge variant="outline" className="ml-auto">
              {selectedAsset}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {orderBlocks.map((block, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {block.type === "Supply Zone" ? (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-success" />
                    )}
                    <span className="font-medium">{block.type}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${block.price.toFixed(2)}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">Strength</div>
                    <div className={`text-sm ${getStrengthColor(block.strength)}`}>
                      {block.strength}%
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium">Volume</div>
                    <div className="text-sm text-muted-foreground">{block.volume}</div>
                  </div>
                  
                  {getStatusBadge(block.status)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-muted/30">
            <h4 className="font-medium mb-2">Key Insights</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Strong supply zone at ${orderBlocks[0].price.toFixed(2)} likely to act as resistance</p>
              <p>• Demand zone at ${orderBlocks[1].price.toFixed(2)} providing support</p>
              <p>• Monitor volume at these levels for potential breakouts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fibonacci Analysis */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Fibonacci Analysis
            <Badge variant="outline" className="ml-auto">
              Retracements & Extensions
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            {fibLevels.map((fib, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-background/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium">
                    {fib.level}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${fib.price.toFixed(2)}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {fib.type}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Progress 
                    value={parseFloat(fib.level.replace('%', ''))} 
                    className="w-20 h-2"
                  />
                  <div className="text-xs text-muted-foreground w-12">
                    {fib.level === "50%" ? "Mid" : fib.level === "61.8%" ? "Golden" : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-success/5 border border-success/20">
              <h4 className="font-medium text-success mb-2">Support Levels</h4>
              <div className="space-y-1 text-sm">
                <p>Primary: ${fibLevels[4].price.toFixed(2)} (38.2%)</p>
                <p>Secondary: ${fibLevels[3].price.toFixed(2)} (50%)</p>
                <p>Strong: ${fibLevels[5].price.toFixed(2)} (23.6%)</p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
              <h4 className="font-medium text-destructive mb-2">Resistance Levels</h4>
              <div className="space-y-1 text-sm">
                <p>Primary: ${fibLevels[2].price.toFixed(2)} (61.8%)</p>
                <p>Secondary: ${fibLevels[1].price.toFixed(2)} (78.6%)</p>
                <p>Extension: ${fibLevels[0].price.toFixed(2)} (100%)</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-muted/30">
            <h4 className="font-medium mb-2">Fibonacci Strategy</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Watch for bounces at the 61.8% Golden Ratio level (${fibLevels[2].price.toFixed(2)})</p>
              <p>• 50% level often acts as psychological support/resistance</p>
              <p>• Extensions above 100% indicate strong momentum continuation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};