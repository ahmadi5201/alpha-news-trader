import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield } from 'lucide-react';

export const StopLossConfig = () => {
  const [enabled, setEnabled] = useState(true);
  const [stopLossPercent, setStopLossPercent] = useState(5);
  const [trailingStop, setTrailingStop] = useState(false);

  return (
    <Card className="bg-card border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Stop Loss Protection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Enable/Disable */}
        <div className="flex items-center justify-between">
          <Label htmlFor="stop-loss-enabled">Enable Stop Loss</Label>
          <Switch
            id="stop-loss-enabled"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        {enabled && (
          <>
            {/* Stop Loss Percentage */}
            <div className="space-y-2">
              <Label>Stop Loss Percentage</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={stopLossPercent}
                  onChange={(e) => setStopLossPercent(Number(e.target.value))}
                  min="1"
                  max="50"
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Sell automatically if price drops {stopLossPercent}% below entry
              </div>
            </div>

            {/* Trailing Stop */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="trailing-stop">Trailing Stop</Label>
                <div className="text-xs text-muted-foreground">
                  Adjust stop loss as price moves favorably
                </div>
              </div>
              <Switch
                id="trailing-stop"
                checked={trailingStop}
                onCheckedChange={setTrailingStop}
              />
            </div>

            {/* Current Settings Display */}
            <div className="p-3 rounded-lg bg-gradient-danger border border-destructive/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="font-medium text-sm">Protection Active</span>
              </div>
              <div className="text-xs space-y-1">
                <div>• Max Loss: {stopLossPercent}% of position</div>
                <div>• Trailing: {trailingStop ? 'Enabled' : 'Disabled'}</div>
                <div>• Auto-sell at buying price if market drops</div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">Protection Status</span>
              <Badge variant="outline" className="text-success border-success">
                Active
              </Badge>
            </div>
          </>
        )}

        {!enabled && (
          <div className="p-3 rounded-lg bg-muted text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-warning" />
            <div className="text-sm text-muted-foreground">
              Stop loss protection is disabled. Your positions are not protected against losses.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};