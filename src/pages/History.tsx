import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft, Briefcase, Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';

interface PortfolioEntry {
  id: string;
  full_name: string;
  profession: string | null;
  username: string | null;
  created_at: string;
  user_id: string;
}

const History = () => {
  const [user, setUser] = useState<any>(null);
  const [portfolios, setPortfolios] = useState<PortfolioEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth';
        return;
      }
      setUser(user);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, profession, username, created_at, user_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPortfolios(data);
      }
      setLoading(false);
    };

    init();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

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
          </div>

          {portfolios.length === 0 ? (
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
              <p className="text-sm text-muted-foreground">
                {portfolios.length} portfolio{portfolios.length !== 1 ? 's' : ''} created
              </p>

              <div className="grid gap-4">
                {portfolios.map((portfolio) => {
                  const viewPath = portfolio.username
                    ? `/p/${portfolio.username}`
                    : `/portfolio-view/${portfolio.user_id}`;

                  return (
                    <Card key={portfolio.id} className="card-elevated hover:shadow-lg transition-all border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 flex items-start gap-4">
                            <div className="mt-1 p-2 bg-primary/10 rounded-lg">
                              <Briefcase className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-foreground mb-1">
                                {portfolio.full_name || 'Untitled Portfolio'}
                              </h3>
                              {portfolio.profession && (
                                <p className="text-sm text-muted-foreground mb-1">{portfolio.profession}</p>
                              )}
                              <p className="text-sm text-muted-foreground mb-3">
                                Created {formatDate(portfolio.created_at)}
                              </p>
                              <div className="flex gap-2">
                                <Button asChild size="sm" className="gap-2">
                                  <Link to={viewPath}>
                                    <Eye className="w-4 h-4" />
                                    View
                                  </Link>
                                </Button>
                                <Button asChild size="sm" variant="outline" className="gap-2">
                                  <Link to="/portfolio-setup">
                                    <Pencil className="w-4 h-4" />
                                    Edit
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
