import { 
  Palette, 
  Smartphone, 
  Zap, 
  FileText, 
  Shield, 
  BarChart,
  Users,
  Globe,
  Download
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Auto-Styled Design",
      description: "Beautiful, professional layouts generated automatically based on your content and industry.",
      color: "text-primary",
      bg: "bg-primary/8",
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile-First Responsive",
      description: "Your portfolio looks perfect on all devices — phones, tablets, and desktops.",
      color: "text-accent",
      bg: "bg-accent/8",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Create a complete portfolio in under 5 minutes. No design or coding experience needed.",
      color: "text-success",
      bg: "bg-success/8",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "PDF Export",
      description: "Download your portfolio as a professional PDF for offline sharing and applications.",
      color: "text-secondary",
      bg: "bg-secondary/8",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data is encrypted and secure. You control who sees your portfolio and when.",
      color: "text-primary",
      bg: "bg-primary/8",
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Analytics Insights",
      description: "Track views, engagement, and see how recruiters interact with your portfolio.",
      color: "text-accent",
      bg: "bg-accent/8",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Unique Every Time",
      description: "Every portfolio gets a randomized design variant — layouts, colors, and typography differ each time.",
      color: "text-success",
      bg: "bg-success/8",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Shareable Links",
      description: "Get a unique public URL and QR code to share your portfolio with anyone, anywhere.",
      color: "text-secondary",
      bg: "bg-secondary/8",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Easy Updates",
      description: "Update your portfolio anytime with our simple form. Changes reflect instantly.",
      color: "text-primary",
      bg: "bg-primary/8",
    }
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-5 tracking-tight leading-tight">
            Everything You Need to
            <span className="block text-gradient">Stand Out</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            All the tools and features you need to create a professional portfolio 
            that impresses employers and showcases your unique talents.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="feature-card group">
              <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 md:mt-24 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {[
              { value: "95%", label: "User Satisfaction", color: "text-primary" },
              { value: "24/7", label: "Always Available", color: "text-accent" },
              { value: "<5min", label: "Average Setup Time", color: "text-success" },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <div className={`text-3xl md:text-4xl font-extrabold ${stat.color} mb-2 tracking-tight`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
