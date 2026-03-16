import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogIn, LogOut, History } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useBrowsingHistory } from "@/hooks/useBrowsingHistory";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  useBrowsingHistory();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">PortfolioHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#examples" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Examples
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full p-0 w-10 h-10">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="text-sm font-semibold" style={{ background: 'var(--gradient-primary)', color: 'white' }}>
                        {getUserInitials(user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/history">
                      <History className="w-4 h-4 mr-2" />
                      History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground" asChild>
                  <Link to="/auth">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button className="btn-hero text-sm !px-5 !py-2.5 !rounded-lg" asChild>
                  <a href="/portfolio-setup">
                    <User className="w-4 h-4 mr-1.5" />
                    Create Portfolio
                  </a>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border animate-fade-in">
            <div className="py-4 space-y-1">
              <a
                href="#features"
                className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#examples"
                className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Examples
              </a>
              <div className="pt-3 mt-3 border-t border-border space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs font-semibold" style={{ background: 'var(--gradient-primary)', color: 'white' }}>
                          {getUserInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground truncate">{user.email}</span>
                    </div>
                    <Button variant="ghost" className="w-full justify-start text-sm" asChild>
                      <Link to="/history" onClick={() => setIsMenuOpen(false)}>
                        <History className="w-4 h-4 mr-2" />
                        View History
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm text-destructive hover:text-destructive"
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="w-full justify-start text-sm" asChild>
                      <Link to="/auth">
                        <LogIn className="w-4 h-4 mr-2" />
                        Login
                      </Link>
                    </Button>
                    <Button className="w-full btn-hero !text-sm !rounded-lg" asChild>
                      <a href="/portfolio-setup">
                        <User className="w-4 h-4 mr-1.5" />
                        Create Portfolio
                      </a>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
