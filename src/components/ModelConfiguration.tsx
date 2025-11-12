import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, PlayCircle } from 'lucide-react';

interface ModelConfigurationProps {
  config: {
    type: string;
    parameters: any;
  };
  onConfigChange: (config: any) => void;
  onRunPrediction: () => void;
  isRunning: boolean;
}

export const ModelConfiguration = ({ config, onConfigChange, onRunPrediction, isRunning }: ModelConfigurationProps) => {
  const modelTypes = [
    { value: 'ARMA', label: 'ARMA', description: 'AutoRegressive Moving Average' },
    { value: 'ARIMA', label: 'ARIMA', description: 'AutoRegressive Integrated MA' },
    { value: 'SARIMA', label: 'SARIMA', description: 'Seasonal ARIMA' },
    { value: 'GARCH', label: 'GARCH', description: 'Generalized ARCH' },
  ];

  const handleModelChange = (modelType: string) => {
    const defaultParams = {
      ARMA: { p: 1, q: 1 },
      ARIMA: { p: 1, d: 1, q: 1 },
      SARIMA: { p: 1, d: 1, q: 1, P: 1, D: 1, Q: 1, s: 12 },
      GARCH: { p: 1, q: 1, o: 1, m: 1 }
    };
    
    onConfigChange({
      type: modelType,
      parameters: defaultParams[modelType as keyof typeof defaultParams]
    });
  };

  return (
    <Card className="bg-card border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Model Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Model Type Selection */}
        <div className="space-y-2">
          <Label>Model Type</Label>
          <Select value={config.type} onValueChange={handleModelChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {modelTypes.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  <div>
                    <div className="font-medium">{model.label}</div>
                    <div className="text-xs text-muted-foreground">{model.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Parameters */}
        <div className="space-y-3">
          <Label>Parameters</Label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(config.parameters).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase">{key}</Label>
                <Input
                  type="number"
                  value={value as number}
                  onChange={(e) => onConfigChange({
                    ...config,
                    parameters: {
                      ...config.parameters,
                      [key]: parseInt(e.target.value)
                    }
                  })}
                  className="h-8"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Training Status */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Model Status</span>
            <Badge variant="outline" className="text-success border-success">Trained</Badge>
          </div>
          <Button 
            className="w-full" 
            size="sm" 
            onClick={onRunPrediction}
            disabled={isRunning}
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            {isRunning ? "Running..." : "Run Prediction"}
          </Button>
        </div>

        {/* Model Metrics */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="text-center p-2 rounded bg-muted">
            <div className="text-xs text-muted-foreground">Accuracy</div>
            <div className="font-semibold text-success">84.2%</div>
          </div>
          <div className="text-center p-2 rounded bg-muted">
            <div className="text-xs text-muted-foreground">R²</div>
            <div className="font-semibold">0.741</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};