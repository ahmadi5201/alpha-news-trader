import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, TrendingUp, TrendingDown, Clock, ExternalLink } from 'lucide-react';

interface NewsAnalysisProps {
  selectedStock: string;
}

export const NewsAnalysis = ({ selectedStock }: NewsAnalysisProps) => {
  // Mock news data with sentiment analysis
  const newsData = [
    {
      id: 1,
      title: "Apple Reports Strong Q4 Earnings, Beats Expectations",
      summary: "Apple Inc. reported quarterly earnings that exceeded analyst expectations, driven by strong iPhone and services revenue.",
      sentiment: "positive",
      sentimentScore: 0.85,
      source: "Reuters",
      publishedAt: "2 hours ago",
      impact: "high",
      url: "#"
    },
    {
      id: 2,
      title: "Tech Stocks Rally as Market Conditions Improve",
      summary: "Major technology stocks including Apple saw significant gains as investor confidence returns to the sector.",
      sentiment: "positive",
      sentimentScore: 0.72,
      source: "Bloomberg",
      publishedAt: "4 hours ago",
      impact: "medium",
      url: "#"
    },
    {
      id: 3,
      title: "Supply Chain Concerns Continue to Affect Manufacturing",
      summary: "Ongoing supply chain disruptions may impact production schedules for major tech companies in the coming quarter.",
      sentiment: "negative",
      sentimentScore: -0.45,
      source: "Financial Times",
      publishedAt: "6 hours ago",
      impact: "medium",
      url: "#"
    },
    {
      id: 4,
      title: "New Product Launch Expected to Drive Growth",
      summary: "Industry analysts predict that upcoming product launches will significantly boost revenue in the next quarter.",
      sentiment: "positive",
      sentimentScore: 0.68,
      source: "WSJ",
      publishedAt: "8 hours ago",
      impact: "high",
      url: "#"
    }
  ];

  const overallSentiment = newsData.reduce((acc, news) => acc + news.sentimentScore, 0) / newsData.length;
  const positiveNews = newsData.filter(news => news.sentiment === 'positive').length;
  const negativeNews = newsData.filter(news => news.sentiment === 'negative').length;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-destructive';
      default:
        return 'text-warning';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Newspaper className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-primary border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Sentiment</p>
                <p className={`text-2xl font-bold ${overallSentiment > 0 ? 'text-success' : 'text-destructive'}`}>
                  {overallSentiment > 0 ? 'Positive' : 'Negative'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Score: {overallSentiment.toFixed(2)}
                </p>
              </div>
              {overallSentiment > 0 ? (
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
                <p className="text-sm text-muted-foreground">Positive News</p>
                <p className="text-2xl font-bold text-success">{positiveNews}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Negative News</p>
                <p className="text-2xl font-bold text-destructive">{negativeNews}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Market Impact</p>
                <p className="text-2xl font-bold">High</p>
              </div>
              <Newspaper className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* News Feed */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            News Analysis for {selectedStock}
          </CardTitle>
          <Button variant="outline" size="sm">
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {newsData.map((news) => (
            <div key={news.id} className="p-4 rounded-lg border border-border bg-muted hover:bg-muted/80 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={getSentimentColor(news.sentiment)}>
                    {getSentimentIcon(news.sentiment)}
                  </div>
                  <div>
                    <Badge 
                      variant={news.sentiment === 'positive' ? 'default' : news.sentiment === 'negative' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {news.sentiment.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {news.impact.toUpperCase()} IMPACT
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {news.publishedAt}
                </div>
              </div>
              
              <h3 className="font-semibold mb-2 text-foreground">{news.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{news.summary}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">Source: {news.source}</span>
                  <span className="text-xs text-muted-foreground">
                    Sentiment Score: <span className={getSentimentColor(news.sentiment)}>
                      {news.sentimentScore > 0 ? '+' : ''}{news.sentimentScore.toFixed(2)}
                    </span>
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Read More
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sentiment Analysis Summary */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle>AI Sentiment Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-primary border border-primary/20">
              <h4 className="font-semibold mb-2">Key Insights</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Strong earnings performance driving positive sentiment</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Market conditions improving for tech sector</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <span>Supply chain concerns present moderate risk</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Upcoming product launches expected to boost growth</span>
                </li>
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted text-center">
                <div className="text-sm text-muted-foreground mb-1">Recommendation</div>
                <div className="font-bold text-success">BUY</div>
              </div>
              <div className="p-3 rounded-lg bg-muted text-center">
                <div className="text-sm text-muted-foreground mb-1">Confidence</div>
                <div className="font-bold">78%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};