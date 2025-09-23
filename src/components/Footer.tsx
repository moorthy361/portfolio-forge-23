import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-gradient bg-gradient-to-r from-white to-accent-light bg-clip-text text-transparent mb-4">
              PortfolioHub
            </h3>
            <p className="text-primary-foreground/80 mb-4 max-w-md">
              Create stunning, professional portfolios in minutes. No coding required - 
              just fill in your details and get a beautiful, responsive website.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="secondary" size="sm">
                Start Creating
              </Button>
              <Button variant="outline" size="sm" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                View Examples
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#examples" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Examples
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#support" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="w-4 h-4" />
                <span>hello@portfoliohub.com</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 border-primary-foreground/20" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-primary-foreground/80 text-sm">
            © 2024 PortfolioHub. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-primary-foreground/80 text-sm">
            Made with <Heart className="w-4 h-4 text-red-400 mx-1" /> for creators worldwide
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#privacy" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;