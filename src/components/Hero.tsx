import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, User } from "lucide-react";
import heroImage from "@/assets/hero-portfolio.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 section-hero opacity-80 z-10" />
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8">
            <Sparkles className="w-4 h-4 mr-2 text-accent-light" />
            <span className="text-white font-medium">Create Professional Portfolios in Minutes</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Build Your Dream
            <span className="block text-gradient bg-gradient-to-r from-accent-light to-white bg-clip-text text-transparent">
              Portfolio
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Create stunning, professional portfolios that showcase your skills and achievements. 
            No coding required - just fill in your details and let our system generate a beautiful, 
            responsive website for you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="btn-hero text-lg px-8 py-4">
              <User className="w-5 h-5 mr-2" />
              Start Creating
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button size="lg" variant="outline" className="btn-outline-hero text-lg px-8 py-4 text-accent-light border-white hover:bg-white hover:text-primary">
              <Play className="w-5 h-5 mr-2" />
              View Examples
            </Button>
          </div>

          {/* Features Preview */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 text-center rounded-xl border border-white/20" style={{background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'}}>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-primary-light" />
              </div>
              <h3 className="font-semibold mb-2" style={{color: '#1a237e'}}>Auto-Generated</h3>
              <p className="text-sm" style={{color: '#424242'}}>Fill in your details and get a beautiful portfolio instantly</p>
            </div>
            
            <div className="p-6 text-center rounded-xl border border-white/20" style={{background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)'}}>
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-secondary-light font-bold">📱</span>
              </div>
              <h3 className="font-semibold mb-2" style={{color: '#1a237e'}}>Mobile-First</h3>
              <p className="text-sm" style={{color: '#424242'}}>Responsive design that looks perfect on all devices</p>
            </div>
            
            <div className="p-6 text-center rounded-xl border border-white/20" style={{background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)'}}>
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-accent-light font-bold">⚡</span>
              </div>
              <h3 className="font-semibold mb-2" style={{color: '#1a237e'}}>PDF Export</h3>
              <p className="text-sm" style={{color: '#424242'}}>Download your portfolio as a professional PDF</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;