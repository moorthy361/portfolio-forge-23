import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, User, Zap, Smartphone, FileDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-portfolio.jpg";

interface HeroProps {
  handleGetStarted: () => void;
}

const Hero = ({ handleGetStarted }: HeroProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 section-hero opacity-85 z-10" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 z-10 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center px-5 py-2.5 rounded-full border border-white/15 backdrop-blur-md mb-10"
            style={{ background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.08), hsl(0 0% 100% / 0.03))' }}>
            <Sparkles className="w-4 h-4 mr-2.5 text-accent-light" />
            <span className="text-sm font-medium text-white/90 tracking-wide">AI-Powered Portfolio Builder</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            Build Your Dream
            <span className="block mt-2 bg-gradient-to-r from-accent-light via-white to-accent-light bg-clip-text text-transparent">
              Portfolio
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Create stunning, professional portfolios that showcase your skills and achievements. 
            No coding required — just fill in your details and get a beautiful, 
            responsive website instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <Button 
              size="lg" 
              className="btn-hero text-base sm:text-lg px-8 py-5 w-full sm:w-auto" 
              onClick={handleGetStarted}
              disabled={loading}
            >
              <User className="w-5 h-5 mr-2" />
              {loading ? "Loading..." : "Create Your Portfolio"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button size="lg" variant="outline" className="btn-outline-hero text-base sm:text-lg px-8 py-5 w-full sm:w-auto" asChild>
              <a href="#features">
                See How It Works
              </a>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-white/50 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-light" />
              <span>Ready in 5 minutes</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-accent-light" />
              <span>Mobile responsive</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2">
              <FileDown className="w-4 h-4 text-accent-light" />
              <span>PDF export included</span>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto px-4">
            {[
              { icon: <Sparkles className="w-6 h-6" />, title: "Auto-Generated", desc: "Beautiful portfolio instantly from your details" },
              { icon: <Smartphone className="w-6 h-6" />, title: "Mobile-First", desc: "Perfect on every device, every time" },
              { icon: <FileDown className="w-6 h-6" />, title: "PDF Export", desc: "Download and share offline anytime" },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-2xl border border-white/10 backdrop-blur-md text-center group hover:-translate-y-1 transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.06), hsl(0 0% 100% / 0.02))' }}>
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center text-accent-light"
                  style={{ background: 'hsl(var(--accent) / 0.12)' }}>
                  {item.icon}
                </div>
                <h3 className="font-semibold text-white mb-1 text-sm">{item.title}</h3>
                <p className="text-xs text-white/55 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
