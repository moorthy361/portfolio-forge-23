import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import SamplePortfolio from "@/components/SamplePortfolio";
import Footer from "@/components/Footer";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/portfolio-setup");
    } else {
      navigate("/auth");
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero handleGetStarted={handleGetStarted} />
      <Features />
      <SamplePortfolio handleGetStarted={handleGetStarted} />
      <Footer />
    </div>
  );
};

export default Index;
