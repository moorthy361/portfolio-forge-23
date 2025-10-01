import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      icon: <Palette className="w-8 h-8 text-primary" />,
      title: "Auto-Styled Design",
      description: "Beautiful, professional layouts generated automatically based on your content and industry."
    },
    {
      icon: <Smartphone className="w-8 h-8 text-accent" />,
      title: "Mobile-First Responsive",
      description: "Your portfolio looks perfect on all devices - phones, tablets, and desktops."
    },
    {
      icon: <Zap className="w-8 h-8 text-success" />,
      title: "Lightning Fast",
      description: "Create a complete portfolio in under 5 minutes. No design or coding experience needed."
    },
    {
      icon: <FileText className="w-8 h-8 text-secondary" />,
      title: "PDF Export",
      description: "Download your portfolio as a professional PDF for offline sharing and applications."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Secure & Private",
      description: "Your data is encrypted and secure. You control who sees your portfolio and when."
    },
    {
      icon: <BarChart className="w-8 h-8 text-accent" />,
      title: "Analytics Insights",
      description: "Track views, engagement, and see how recruiters interact with your portfolio."
    },
    {
      icon: <Users className="w-8 h-8 text-success" />,
      title: "Multiple Templates",
      description: "Choose from various professional templates tailored to different industries and roles."
    },
    {
      icon: <Globe className="w-8 h-8 text-secondary" />,
      title: "Custom Domain",
      description: "Use your own domain name to make your portfolio truly yours and boost your brand."
    },
    {
      icon: <Download className="w-8 h-8 text-primary" />,
      title: "Easy Updates",
      description: "Update your portfolio anytime with our simple form. Changes reflect instantly."
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need to
            <span className="block text-gradient">Stand Out</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform provides all the tools and features you need to create a 
            professional portfolio that impresses employers and showcases your unique talents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="card-elevated animate-scale-in hover:scale-105 transition-transform duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">95%</div>
              <div className="text-muted-foreground">User Satisfaction</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">24/7</div>
              <div className="text-muted-foreground">Support Available</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl md:text-4xl font-bold text-success mb-2">5min</div>
              <div className="text-muted-foreground">Average Setup Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;