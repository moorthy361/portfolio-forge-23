import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Eye, Users, Activity, TrendingUp, Monitor, Tablet, Smartphone,
  Upload, Pencil, ExternalLink, Share2, BarChart3, User, Globe,
  FileText, LogOut, LayoutDashboard, Home
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [deviceView, setDeviceView] = useState<"mobile" | "tablet" | "laptop">("laptop");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    { label: "Total Visits", value: "0", icon: Eye, change: "+0%" },
    { label: "Unique Visitors", value: "0", icon: Users, change: "+0%" },
    { label: "Active Now", value: "0", icon: Activity, change: "" },
    { label: "This Week", value: "0", icon: TrendingUp, change: "+0%" },
  ];

  const sidebarItems = [
    { label: "Portfolio", icon: LayoutDashboard, href: "/my-portfolio" },
  ];

  const deviceViews = [
    { key: "mobile" as const, icon: Smartphone, label: "Mobile" },
    { key: "tablet" as const, icon: Tablet, label: "Tablet" },
    { key: "laptop" as const, icon: Monitor, label: "Laptop" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        <div className="p-6">
          <Link to="/" className="text-xl font-bold text-foreground">
            PortfolioHub
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-sm"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium text-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-sm"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {user.email?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate max-w-[140px]">
              {user.email}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="border-b border-border bg-card/50 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Device Toggle */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {deviceViews.map((dv) => (
                <Button
                  key={dv.key}
                  variant={deviceView === dv.key ? "default" : "ghost"}
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => setDeviceView(dv.key)}
                >
                  <dv.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{dv.label}</span>
                </Button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" asChild>
                <Link to="/portfolio-setup">
                  <Upload className="w-3.5 h-3.5" />
                  Upload New Resume
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Pencil className="w-3.5 h-3.5" />
                Edit Content
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" asChild>
                <Link to="/my-portfolio">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Preview
                </Link>
              </Button>
              <Button size="sm" className="gap-1.5 text-xs">
                <Share2 className="w-3.5 h-3.5" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-card border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <stat.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                    {stat.change && (
                      <span className="text-xs text-muted-foreground mb-1">{stat.change}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Visits */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Daily Visits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                  <div className="text-center">
                    <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>No visit data yet</p>
                    <p className="text-xs mt-1">Share your portfolio to start tracking</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Overview */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Weekly Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">This week</span>
                  <span className="text-sm font-medium text-foreground">0 visits</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last week</span>
                  <span className="text-sm font-medium text-foreground">0 visits</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Change</span>
                  <span className="text-sm font-medium text-foreground">+0%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
                  No traffic data yet
                </div>
              </CardContent>
            </Card>

            {/* Devices */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Devices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Desktop</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">0%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Mobile</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">0%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Bottom Bar (visible on small screens) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                {user.email?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">{user.email}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs text-muted-foreground">
            <LogOut className="w-3.5 h-3.5 mr-1" />
            Sign out
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
