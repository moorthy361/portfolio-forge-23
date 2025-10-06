import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trash2, ArrowLeft, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBrowsingHistory } from '@/hooks/useBrowsingHistory';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';

const History = () => {
  const { history, clearHistory } = useBrowsingHistory();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth';
        return;
      }
      setUser(user);
    };

    checkAuth();
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return formatDate(date);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // Filter to show only portfolio entries
  const portfolioHistory = history.filter(entry => entry.isPortfolio);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <Briefcase className="w-8 h-8 text-primary" />
                  My Portfolios
                </h1>
                <p className="text-muted-foreground mt-2">
                  View and access all your created portfolios
                </p>
              </div>
            </div>
            
            {portfolioHistory.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearHistory}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {portfolioHistory.length === 0 ? (
            <Card className="card-elevated">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Portfolios Yet</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Create your first portfolio to see it listed here.
                </p>
                <Button className="mt-4" asChild>
                  <Link to="/portfolio-setup">Create Portfolio</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {portfolioHistory.length} portfolio{portfolioHistory.length !== 1 ? 's' : ''} created
                </p>
              </div>

              <div className="grid gap-4">
                {portfolioHistory.map((entry) => (
                  <Card key={`${entry.path}-${entry.timestamp.getTime()}`} className="card-elevated hover:shadow-lg transition-all border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 flex items-start gap-4">
                          <div className="mt-1 p-2 bg-primary/10 rounded-lg">
                            <Briefcase className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                              {entry.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              Created {formatRelativeTime(entry.timestamp)} • {formatDate(entry.timestamp)}
                            </p>
                            <Button asChild size="sm" className="gap-2">
                              <Link to={entry.path}>
                                View Portfolio
                                <ArrowLeft className="w-4 h-4 rotate-180" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;