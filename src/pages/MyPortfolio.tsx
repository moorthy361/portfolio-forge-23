import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, Phone, MapPin, Linkedin, Github, Globe,
  Download, Edit, GraduationCap, Briefcase, Award, Code,
  ExternalLink, Home, Terminal, Palette, BarChart3, Shield,
  Cloud, Bot, Megaphone, Smartphone, Menu, X
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { themeStyles, type ThemeId } from "@/lib/themes";
import { jobRoles } from "@/lib/roleThemeMapping";
import { useDesignEngine } from "@/hooks/useDesignEngine";
import type { DesignVariant } from "@/lib/designVariantGenerator";
import FuturisticWrapper, { AnimatedSection, GlowCard } from "@/components/FuturisticWrapper";
import { debugLog } from "@/lib/testConfig";

/** Prevent javascript: scheme injection – only allow http(s) and mailto URLs */
const safeUrl = (url: string): string =>
  /^https?:\/\//i.test(url) ? url : '#';

const safeEmail = (email: string): string =>
  /^[^:\/]+@[^:\/]+$/.test(email) ? `mailto:${email}` : '#';

interface Profile {
  user_id: string;
  full_name: string;
  profession: string;
  bio: string;
  location: string;
  phone: string;
  email: string;
  linkedin_url: string;
  github_url: string;
  website_url: string;
  profile_image_url: string;
  job_role: string;
  is_fresher: boolean;
  template_type: string;
  theme: string;
}

interface Skill { name: string; }
interface Project { title: string; description: string; tech_stack: string[]; project_url: string; }
interface Education { degree: string; institution: string; year: string; gpa: string; }
interface Achievement { title: string; description: string; }

// Role-specific configuration for layout customization
const roleLayoutConfig: Record<string, {
  projectsLabel: string;
  projectsSubtext: string;
  skillsLabel: string;
  heroSubtext: string;
  projectIcon: React.ReactNode;
  showTechStackProminent: boolean;
  sectionOrder: string[];
}> = {
  "frontend-developer": {
    projectsLabel: "UI Projects & Applications",
    projectsSubtext: "Interactive web experiences I've built",
    skillsLabel: "Frontend Stack",
    heroSubtext: "Crafting beautiful, responsive user interfaces",
    projectIcon: <Code className="h-6 w-6" />,
    showTechStackProminent: true,
    sectionOrder: ["about", "projects", "skills", "education", "achievements", "contact"],
  },
  "backend-developer": {
    projectsLabel: "Systems & APIs",
    projectsSubtext: "Backend architectures and services I've engineered",
    skillsLabel: "Backend Stack",
    heroSubtext: "Building robust, scalable server-side solutions",
    projectIcon: <Terminal className="h-6 w-6" />,
    showTechStackProminent: true,
    sectionOrder: ["about", "skills", "projects", "education", "achievements", "contact"],
  },
  "fullstack-developer": {
    projectsLabel: "Full Stack Projects",
    projectsSubtext: "End-to-end applications from database to UI",
    skillsLabel: "Tech Stack",
    heroSubtext: "Bridging frontend and backend seamlessly",
    projectIcon: <Code className="h-6 w-6" />,
    showTechStackProminent: true,
    sectionOrder: ["about", "projects", "skills", "education", "achievements", "contact"],
  },
  "uiux-designer": {
    projectsLabel: "Design Portfolio",
    projectsSubtext: "User-centered designs and creative explorations",
    skillsLabel: "Design Tools & Skills",
    heroSubtext: "Designing intuitive and delightful experiences",
    projectIcon: <Palette className="h-6 w-6" />,
    showTechStackProminent: false,
    sectionOrder: ["about", "projects", "skills", "achievements", "education", "contact"],
  },
  "mobile-developer": {
    projectsLabel: "Mobile Applications",
    projectsSubtext: "Native and cross-platform apps I've developed",
    skillsLabel: "Mobile Stack",
    heroSubtext: "Creating seamless mobile experiences",
    projectIcon: <Smartphone className="h-6 w-6" />,
    showTechStackProminent: true,
    sectionOrder: ["about", "projects", "skills", "education", "achievements", "contact"],
  },
  "data-analyst": {
    projectsLabel: "Data Projects & Analysis",
    projectsSubtext: "Insights and visualizations from complex datasets",
    skillsLabel: "Analytics Tools",
    heroSubtext: "Turning data into actionable insights",
    projectIcon: <BarChart3 className="h-6 w-6" />,
    showTechStackProminent: false,
    sectionOrder: ["about", "skills", "projects", "education", "achievements", "contact"],
  },
  "data-scientist": {
    projectsLabel: "Research & ML Projects",
    projectsSubtext: "Machine learning models and data science research",
    skillsLabel: "ML & Data Stack",
    heroSubtext: "Advancing knowledge through data science",
    projectIcon: <Bot className="h-6 w-6" />,
    showTechStackProminent: true,
    sectionOrder: ["about", "projects", "skills", "education", "achievements", "contact"],
  },
  "devops-engineer": {
    projectsLabel: "Infrastructure Projects",
    projectsSubtext: "CI/CD pipelines, cloud infrastructure, and automation",
    skillsLabel: "DevOps Toolchain",
    heroSubtext: "Automating and scaling cloud infrastructure",
    projectIcon: <Terminal className="h-6 w-6" />,
    showTechStackProminent: true,
    sectionOrder: ["about", "skills", "projects", "achievements", "education", "contact"],
  },
  "cloud-engineer": {
    projectsLabel: "Cloud Solutions",
    projectsSubtext: "Cloud architectures and migrations",
    skillsLabel: "Cloud Platforms & Tools",
    heroSubtext: "Architecting scalable cloud solutions",
    projectIcon: <Cloud className="h-6 w-6" />,
    showTechStackProminent: true,
    sectionOrder: ["about", "skills", "projects", "achievements", "education", "contact"],
  },
  "cybersecurity-analyst": {
    projectsLabel: "Security Projects",
    projectsSubtext: "Vulnerability assessments and security implementations",
    skillsLabel: "Security Tools & Certifications",
    heroSubtext: "Protecting systems and securing data",
    projectIcon: <Shield className="h-6 w-6" />,
    showTechStackProminent: false,
    sectionOrder: ["about", "skills", "achievements", "projects", "education", "contact"],
  },
  "aiml-engineer": {
    projectsLabel: "AI/ML Projects",
    projectsSubtext: "Deep learning models and AI applications",
    skillsLabel: "AI/ML Stack",
    heroSubtext: "Building intelligent systems with AI",
    projectIcon: <Bot className="h-6 w-6" />,
    showTechStackProminent: true,
    sectionOrder: ["about", "projects", "skills", "education", "achievements", "contact"],
  },
  "graphic-designer": {
    projectsLabel: "Creative Works",
    projectsSubtext: "Visual designs, branding, and creative projects",
    skillsLabel: "Creative Tools",
    heroSubtext: "Bringing ideas to life through visual design",
    projectIcon: <Palette className="h-6 w-6" />,
    showTechStackProminent: false,
    sectionOrder: ["about", "projects", "achievements", "skills", "education", "contact"],
  },
  "digital-marketer": {
    projectsLabel: "Marketing Campaigns",
    projectsSubtext: "Digital campaigns and growth strategies",
    skillsLabel: "Marketing Tools & Platforms",
    heroSubtext: "Driving growth through digital strategies",
    projectIcon: <Megaphone className="h-6 w-6" />,
    showTechStackProminent: false,
    sectionOrder: ["about", "projects", "skills", "achievements", "education", "contact"],
  },
  "business-analyst": {
    projectsLabel: "Business Projects",
    projectsSubtext: "Process improvements and strategic analyses",
    skillsLabel: "Business & Analytics Tools",
    heroSubtext: "Bridging business needs with technical solutions",
    projectIcon: <Briefcase className="h-6 w-6" />,
    showTechStackProminent: false,
    sectionOrder: ["about", "skills", "projects", "education", "achievements", "contact"],
  },
  "fresher": {
    projectsLabel: "Academic & Personal Projects",
    projectsSubtext: "Projects built during coursework and self-learning",
    skillsLabel: "Skills & Technologies",
    heroSubtext: "Eager to learn and ready to contribute",
    projectIcon: <GraduationCap className="h-6 w-6" />,
    showTechStackProminent: false,
    sectionOrder: ["about", "education", "projects", "skills", "achievements", "contact"],
  },
};

const defaultLayoutConfig = roleLayoutConfig["fullstack-developer"];

const MyPortfolio = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("classic");
  const [designVariant, setDesignVariant] = useState<DesignVariant | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadPortfolioData();
      return;
    }
    if (!loading && !user) {
      navigate("/auth");
      return;
    }
    if (user) {
      loadPortfolioData();
    }
  }, [user, loading, navigate, id]);

  const loadPortfolioData = async () => {
    try {
      const isOwnerView = !id && !!user;
      let profileData;

      if (id) {
        const { data } = await (supabase as any)
          .from("profiles_public")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        profileData = data;
      } else {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        profileData = data;
      }

      if (!profileData) {
        navigate("/portfolio-setup");
        return;
      }

      setProfile(profileData as any);
      setTheme((profileData as any).theme || "classic");
      setTechnicalSkills((profileData as any).technical_skills || []);
      setSoftSkills((profileData as any).soft_skills || []);
      setDesignVariant((profileData as any).design_variant || null);

      debugLog("Portfolio loaded:", {
        id: profileData.id,
        job_role: (profileData as any).job_role,
        theme: (profileData as any).theme,
        design_variant: (profileData as any).design_variant,
        technical_skills: (profileData as any).technical_skills?.length,
        soft_skills: (profileData as any).soft_skills?.length,
      });
      
      const portfolioUserId = profileData.user_id;
      const educationTable = isOwnerView ? "education" : "education_public";

      const [
        { data: skillsData },
        { data: projectsData },
        { data: educationData },
        { data: achievementsData }
      ] = await Promise.all([
        supabase.from("skills").select("*").eq("user_id", portfolioUserId),
        supabase.from("projects").select("*").eq("user_id", portfolioUserId),
        (supabase as any).from(educationTable).select("*").eq("user_id", portfolioUserId),
        supabase.from("achievements").select("*").eq("user_id", portfolioUserId)
      ]);

      setSkills(skillsData || []);
      setProjects(projectsData || []);
      setEducation(educationData || []);
      setAchievements(achievementsData || []);
    } catch (error) {
      console.error("Error loading portfolio data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    const profileId = id || (profile as any)?.id;
    if (profileId) {
      navigate(`/portfolio-setup?edit=${profileId}`);
    } else {
      navigate("/portfolio-setup");
    }
  };

  const handleDownload = () => {
    window.print();
  };

  const currentTheme = themeStyles[theme as ThemeId] || themeStyles.classic;
  const layoutConfig = profile?.job_role
    ? roleLayoutConfig[profile.job_role] || defaultLayoutConfig
    : defaultLayoutConfig;

  const isFresher = profile?.is_fresher || profile?.job_role === "fresher";

  const roleLabel = profile?.job_role
    ? jobRoles.find(r => r.id === profile.job_role)?.label || profile.profession
    : profile?.profession;

  const engine = useDesignEngine(profile?.job_role || "fresher", designVariant);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-t-cyan-400 border-cyan-400/20 rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-2xl md:text-4xl font-bold text-white/80">Loading your portfolio...</h2>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Portfolio not found</h2>
          <p className="text-sm md:text-base text-white/60 leading-relaxed mb-4">
            It looks like you haven't created your portfolio yet.
          </p>
          <Button onClick={() => navigate("/portfolio-setup")} className="px-5 py-2.5 text-white">
            Create Portfolio
          </Button>
        </div>
      </div>
    );
  }

  // ============ LAYOUT-SPECIFIC HERO RENDERERS ============

  const renderHeroTopHeader = () => (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 pb-10 md:pt-24 md:pb-20 px-4">
      <div className="text-center max-w-5xl mx-auto w-full">
        <div className="mb-8 md:mb-12">
          {profile.profile_image_url && (
            <div className="mb-6 md:mb-8 flex justify-center">
              <div className={`rounded-full overflow-hidden ${engine.accentGlowClass}`}>
                <img
                  src={profile.profile_image_url}
                  alt={profile.full_name}
                  loading="lazy"
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-white/10"
                />
              </div>
            </div>
          )}
          <h1 className={`text-3xl sm:text-5xl md:text-7xl lg:text-8xl ${engine.headingClass} mb-4 md:mb-6 leading-tight text-white`}>
            Hi, I'm{" "}
            <span className={`bg-gradient-to-r ${engine.accentGradientClass} bg-clip-text text-transparent`}>
              {profile.full_name}
            </span>
          </h1>
          <p className={`text-xl sm:text-2xl md:text-4xl ${engine.headingClass} ${engine.accentPrimaryClass} mb-4`}>
            {profile.profession || roleLabel}
          </p>
          <p className={`text-sm md:text-base lg:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed ${engine.bodyClass}`}>
            {layoutConfig.heroSubtext}
          </p>
        </div>
        {renderHeroCTA()}
      </div>
    </section>
  );

  const renderHeroSidebar = () => (
    <section id="home" className="relative min-h-screen flex items-center pt-20 pb-10 md:pt-24 md:pb-20 px-4">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
        {/* Left sidebar with image and quick info */}
        <div className="flex flex-col items-center md:items-start space-y-6">
          {profile.profile_image_url && (
            <div className={`rounded-2xl overflow-hidden ${engine.accentGlowClass}`}>
              <img
                src={profile.profile_image_url}
                alt={profile.full_name}
                loading="lazy"
                className="w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover ring-4 ring-white/10"
              />
            </div>
          )}
          <div className="space-y-3 text-center md:text-left">
            {profile.location && (
              <div className="flex items-center gap-2">
                <MapPin className={`h-4 w-4 ${engine.accentPrimaryClass}`} />
                <span className="text-sm text-white/60">{profile.location}</span>
              </div>
            )}
            {profile.email && (
              <div className="flex items-center gap-2">
                <Mail className={`h-4 w-4 ${engine.accentPrimaryClass}`} />
                <a href={safeEmail(profile.email)} className="text-sm text-white/60 hover:text-white transition-colors">{profile.email}</a>
              </div>
            )}
          </div>
        </div>
        {/* Main content */}
        <div className="md:col-span-2 text-center md:text-left">
          <h1 className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl ${engine.headingClass} mb-4 md:mb-6 leading-tight text-white`}>
            {profile.full_name}
          </h1>
          <p className={`text-xl sm:text-2xl md:text-3xl ${engine.headingClass} ${engine.accentPrimaryClass} mb-4`}>
            {profile.profession || roleLabel}
          </p>
          <p className={`text-sm md:text-base lg:text-xl text-white/50 max-w-2xl leading-relaxed mb-8 ${engine.bodyClass}`}>
            {layoutConfig.heroSubtext}
          </p>
          {renderHeroCTA("justify-center md:justify-start")}
        </div>
      </div>
    </section>
  );

  const renderHeroSplit = () => (
    <section id="home" className="relative min-h-screen flex items-center pt-20 pb-10 md:pt-24 md:pb-20 px-4">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div className="order-2 md:order-1 text-center md:text-left">
          <p className={`text-sm uppercase tracking-widest ${engine.accentPrimaryClass} mb-4 ${engine.bodyClass}`}>
            {layoutConfig.heroSubtext}
          </p>
          <h1 className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl ${engine.headingClass} mb-6 leading-tight text-white`}>
            {profile.full_name}
          </h1>
          <p className={`text-xl sm:text-2xl md:text-3xl ${engine.headingClass} ${engine.accentPrimaryClass} mb-8`}>
            {profile.profession || roleLabel}
          </p>
          {renderHeroCTA("justify-center md:justify-start")}
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          {profile.profile_image_url ? (
            <div className={`rounded-3xl overflow-hidden ${engine.accentGlowClass} rotate-2 hover:rotate-0 transition-transform duration-500`}>
              <img
                src={profile.profile_image_url}
                alt={profile.full_name}
                loading="lazy"
                className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl object-cover"
              />
            </div>
          ) : (
            <div className={`w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl ${engine.cardClass} flex items-center justify-center`}>
              <span className={`text-8xl ${engine.accentPrimaryClass}`}>{profile.full_name.charAt(0)}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const renderHeroCardStack = () => (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 pb-10 md:pt-24 md:pb-20 px-4">
      <div className="max-w-3xl mx-auto w-full">
        <GlowCard className={`${engine.cardClass} rounded-2xl`} glowColor={`bg-gradient-to-r ${engine.accentGradientClass}`}>
          <div className="p-6 md:p-10 lg:p-14 text-center">
            {profile.profile_image_url && (
              <div className="mb-8 flex justify-center">
                <div className={`rounded-full overflow-hidden ${engine.accentGlowClass}`}>
                  <img
                    src={profile.profile_image_url}
                    alt={profile.full_name}
                    loading="lazy"
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover ring-4 ring-white/10"
                  />
                </div>
              </div>
            )}
            <h1 className={`text-3xl sm:text-5xl md:text-6xl ${engine.headingClass} mb-4 leading-tight text-white`}>
              {profile.full_name}
            </h1>
            <p className={`text-xl sm:text-2xl ${engine.headingClass} ${engine.accentPrimaryClass} mb-4`}>
              {profile.profession || roleLabel}
            </p>
            <div className={`w-16 h-1 bg-gradient-to-r ${engine.accentGradientClass} mx-auto rounded-full mb-6`}></div>
            <p className={`text-sm md:text-base lg:text-lg text-white/50 max-w-xl mx-auto leading-relaxed mb-8 ${engine.bodyClass}`}>
              {layoutConfig.heroSubtext}
            </p>
            {renderHeroCTA()}
          </div>
        </GlowCard>
      </div>
    </section>
  );

  const renderHeroEditorial = () => (
    <section id="home" className="relative min-h-screen flex items-end pt-20 pb-16 md:pt-24 md:pb-24 px-4">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <p className={`text-xs sm:text-sm uppercase tracking-[0.3em] ${engine.accentPrimaryClass} mb-6 ${engine.bodyClass}`}>
            Portfolio — {new Date().getFullYear()}
          </p>
          <h1 className={`text-4xl sm:text-6xl md:text-8xl lg:text-9xl ${engine.headingClass} leading-[0.9] text-white mb-6`}>
            {profile.full_name.split(" ").map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <p className={`text-lg sm:text-xl md:text-2xl ${engine.accentPrimaryClass} ${engine.headingClass}`}>
              {profile.profession || roleLabel}
            </p>
            <div className={`hidden sm:block w-24 h-px bg-gradient-to-r ${engine.accentGradientClass}`}></div>
            <p className={`text-sm md:text-base text-white/40 max-w-md leading-relaxed ${engine.bodyClass}`}>
              {layoutConfig.heroSubtext}
            </p>
          </div>
        </div>
        {renderHeroCTA("justify-start")}
      </div>
    </section>
  );

  const renderHeroAsymmetric = () => (
    <section id="home" className="relative min-h-screen flex items-center pt-20 pb-10 md:pt-24 md:pb-20 px-4">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 md:col-start-1">
            <h1 className={`text-3xl sm:text-5xl md:text-7xl ${engine.headingClass} mb-6 leading-tight text-white`}>
              <span className={`bg-gradient-to-r ${engine.accentGradientClass} bg-clip-text text-transparent`}>
                {profile.full_name}
              </span>
            </h1>
            <p className={`text-xl sm:text-2xl md:text-3xl ${engine.headingClass} text-white/70 mb-4`}>
              {profile.profession || roleLabel}
            </p>
            <p className={`text-sm md:text-base lg:text-lg text-white/40 max-w-lg leading-relaxed mb-8 ${engine.bodyClass}`}>
              {layoutConfig.heroSubtext}
            </p>
            {renderHeroCTA("justify-start")}
          </div>
          <div className="md:col-span-4 md:col-start-9 flex justify-center md:justify-end">
            {profile.profile_image_url ? (
              <div className={`rounded-2xl overflow-hidden ${engine.accentGlowClass} -rotate-3 hover:rotate-0 transition-transform duration-500`}>
                <img
                  src={profile.profile_image_url}
                  alt={profile.full_name}
                  loading="lazy"
                  className="w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-2xl object-cover"
                />
              </div>
            ) : (
              <div className={`w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-2xl ${engine.cardClass} flex items-center justify-center`}>
                <span className={`text-7xl ${engine.accentPrimaryClass} ${engine.headingClass}`}>{profile.full_name.charAt(0)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  const renderHeroCTA = (justifyClass = "justify-center") => (
    <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${justifyClass} px-4`}>
      <a href="#projects" className="w-full sm:w-auto">
        <Button size="lg" className={`w-full sm:w-auto h-11 text-sm sm:text-base md:text-lg px-5 py-2.5 sm:px-10 sm:py-6 bg-gradient-to-r ${engine.accentGradientClass} text-white border-0 ${engine.accentGlowClass} hover:opacity-90 transition-all flex items-center justify-center gap-2`}>
          View My Work
        </Button>
      </a>
      <a href="#contact" className="w-full sm:w-auto">
        <Button size="lg" variant="outline" className="w-full sm:w-auto h-11 text-sm sm:text-base md:text-lg px-5 py-2.5 sm:px-10 sm:py-6 border-white/20 text-white hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
          Get in Touch
        </Button>
      </a>
    </div>
  );

  const heroRenderers: Record<string, () => React.ReactNode> = {
    "top-header": renderHeroTopHeader,
    "sidebar": renderHeroSidebar,
    "split": renderHeroSplit,
    "card-stack": renderHeroCardStack,
    "editorial": renderHeroEditorial,
    "asymmetric": renderHeroAsymmetric,
  };

  // Section renderers with futuristic design
  const renderAbout = () => {
    if (!profile.bio) return null;
    return (
      <AnimatedSection animationType={engine.heroAnimationType} delay={0.1} key="about">
        <section id="about" className="relative py-10 md:py-20 scroll-mt-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 md:mb-16">
              <h2 className={`text-2xl md:text-4xl lg:text-5xl ${engine.headingClass} mb-4 text-white`}>About Me</h2>
              <div className={`w-24 h-1.5 bg-gradient-to-r ${engine.accentGradientClass} mx-auto rounded-full`}></div>
            </div>
            
            <GlowCard className={engine.cardClass + " overflow-hidden rounded-xl"} glowColor={`bg-gradient-to-r ${engine.accentGradientClass}`}>
              <div className="p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                  <div className="space-y-6">
                    {isFresher && (
                      <Badge className={`mb-2 ${engine.badgeClass}`}>
                        <GraduationCap className="h-3 w-3 mr-1" />
                        Fresh Graduate
                      </Badge>
                    )}
                    {roleLabel && !isFresher && (
                      <Badge className={`mb-2 ${engine.badgeClass}`}>
                        {roleLabel}
                      </Badge>
                    )}
                    <p className={`text-sm md:text-base lg:text-lg leading-relaxed text-white/80 ${engine.bodyClass}`}>
                      {profile.bio}
                    </p>
                    
                    <div className="space-y-4 pt-4">
                      {profile.location && (
                        <div className="flex items-center gap-3 group">
                          <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                            <MapPin className={`h-5 w-5 ${engine.accentPrimaryClass}`} />
                          </div>
                          <span className="text-sm md:text-base text-white/70 leading-relaxed">{profile.location}</span>
                        </div>
                      )}
                      {profile.phone && (
                        <div className="flex items-center gap-3 group">
                          <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                            <Phone className={`h-5 w-5 ${engine.accentPrimaryClass}`} />
                          </div>
                          <a href={`tel:${profile.phone}`} className="text-sm md:text-base text-white/70 hover:text-white transition-colors leading-relaxed">
                            {profile.phone}
                          </a>
                        </div>
                      )}
                      {profile.email && (
                        <div className="flex items-center gap-3 group">
                          <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                            <Mail className={`h-5 w-5 ${engine.accentPrimaryClass}`} />
                          </div>
                          <a href={safeEmail(profile.email)} className="text-sm md:text-base text-white/70 hover:text-white transition-colors leading-relaxed">
                            {profile.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-8">
                    {profile.profile_image_url && (
                      <div className={`relative group rounded-xl overflow-hidden ${engine.accentGlowClass}`}>
                        <img
                          src={profile.profile_image_url}
                          alt={profile.full_name}
                          loading="lazy"
                          className="w-64 h-64 rounded-xl object-cover"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${engine.accentGradientClass} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                      </div>
                    )}
                    
                    {(profile.linkedin_url || (profile as any).github_url || (profile as any).website_url) && (
                      <div className="flex gap-4">
                        {profile.linkedin_url && (
                          <a href={safeUrl(profile.linkedin_url)} target="_blank" rel="noopener noreferrer"
                            className={`p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 ${engine.accentGlowClass.replace('shadow', 'hover:shadow')}`}>
                            <Linkedin className={`h-6 w-6 ${engine.accentPrimaryClass}`} />
                          </a>
                        )}
                        {(profile as any).github_url && (
                          <a href={safeUrl((profile as any).github_url)} target="_blank" rel="noopener noreferrer"
                            className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                            <Github className={`h-6 w-6 ${engine.accentPrimaryClass}`} />
                          </a>
                        )}
                        {(profile as any).website_url && (
                          <a href={safeUrl((profile as any).website_url)} target="_blank" rel="noopener noreferrer"
                            className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                            <Globe className={`h-6 w-6 ${engine.accentPrimaryClass}`} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>
        </section>
      </AnimatedSection>
    );
  };

  const renderProjects = () => {
    if (projects.length === 0) return null;
    return (
      <AnimatedSection animationType={engine.heroAnimationType} delay={0.15} key="projects">
        <section id="projects" className={`relative py-10 md:py-20 scroll-mt-16 px-4 ${engine.sectionBgClass}`}>
          <div className="text-center mb-10 md:mb-16">
            <h2 className={`text-2xl md:text-4xl lg:text-5xl ${engine.headingClass} mb-4 text-white`}>{layoutConfig.projectsLabel}</h2>
            <div className={`w-24 h-1.5 bg-gradient-to-r ${engine.accentGradientClass} mx-auto rounded-full mb-4`}></div>
            <p className={`text-sm md:text-base lg:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed ${engine.bodyClass}`}>
              {layoutConfig.projectsSubtext}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {projects.map((project, index) => (
              <GlowCard key={index} className={`${engine.cardClass} rounded-xl`} glowColor={`bg-gradient-to-r ${engine.accentGradientClass}`}>
                <div className="p-4 md:p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white/5 rounded-xl">
                      {layoutConfig.projectIcon}
                    </div>
                    {project.project_url && (
                      <a href={safeUrl(project.project_url)} target="_blank" rel="noopener noreferrer"
                        className="p-2 hover:bg-white/10 rounded-lg transition-all">
                        <ExternalLink className={`h-5 w-5 ${engine.accentPrimaryClass}`} />
                      </a>
                    )}
                  </div>
                  
                  <h3 className={`text-lg md:text-xl ${engine.headingClass} mb-4 text-white`}>
                    {project.title}
                  </h3>
                  <p className={`text-sm md:text-base text-white/60 mb-4 leading-relaxed line-clamp-3 ${engine.bodyClass}`}>
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.map((tech, techIndex) => (
                      <Badge key={techIndex} className={`px-3 py-1 ${engine.badgeClass}`}>
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </section>
      </AnimatedSection>
    );
  };

  const renderSkills = () => {
    const hasTechnical = technicalSkills.length > 0;
    const hasSoft = softSkills.length > 0;
    const hasLegacy = skills.length > 0;
    if (!hasTechnical && !hasSoft && !hasLegacy) return null;

    return (
      <AnimatedSection animationType={engine.heroAnimationType} delay={0.2} key="skills">
        <section id="skills" className="relative py-10 md:py-20 scroll-mt-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 md:mb-16">
              <h2 className={`text-2xl md:text-4xl lg:text-5xl ${engine.headingClass} mb-4 text-white`}>{layoutConfig.skillsLabel}</h2>
              <div className={`w-24 h-1.5 bg-gradient-to-r ${engine.accentGradientClass} mx-auto rounded-full`}></div>
            </div>
            
            <div className="space-y-8">
              {hasTechnical && (
                <GlowCard className={`${engine.cardClass} rounded-xl`} glowColor={`bg-gradient-to-r ${engine.accentGradientClass}`}>
                  <div className="p-4 md:p-6 lg:p-8">
                    <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                      <Code className={`h-5 w-5 ${engine.accentPrimaryClass}`} />
                      Technical Skills
                    </h3>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {technicalSkills.map((skill, index) => (
                        <Badge key={index} className={`px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-medium ${engine.badgeClass} transition-all duration-300 hover:scale-105`}>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </GlowCard>
              )}

              {hasSoft && (
                <GlowCard className={`${engine.cardClass} rounded-xl`}>
                  <div className="p-4 md:p-6 lg:p-8">
                    <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                      <Award className={`h-5 w-5 ${engine.accentPrimaryClass}`} />
                      Soft Skills
                    </h3>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {softSkills.map((skill, index) => (
                        <Badge key={index} className="px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-medium rounded-full bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </GlowCard>
              )}

              {!hasTechnical && !hasSoft && hasLegacy && (
                <GlowCard className={`${engine.cardClass} rounded-xl`}>
                  <div className="p-4 md:p-6 lg:p-8">
                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                      {skills.map((skill, index) => (
                        <Badge key={index} className={`px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-medium ${engine.badgeClass} hover:scale-105 transition-all duration-300`}>
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </GlowCard>
              )}
            </div>
          </div>
        </section>
      </AnimatedSection>
    );
  };

  const renderEducation = () => {
    if (education.length === 0) return null;
    return (
      <AnimatedSection animationType={engine.heroAnimationType} delay={0.25} key="education">
        <section id="education" className="relative py-10 md:py-20 scroll-mt-16 px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className={`text-2xl md:text-4xl lg:text-5xl ${engine.headingClass} mb-4 text-white`}>
              {isFresher ? "Education & Academics" : "Education"}
            </h2>
            <div className={`w-24 h-1.5 bg-gradient-to-r ${engine.accentGradientClass} mx-auto rounded-full`}></div>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {education.map((edu, index) => (
              <GlowCard key={index} className={`${engine.cardClass} rounded-xl`}>
                <div className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <GraduationCap className={`h-6 w-6 ${engine.accentPrimaryClass}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">{edu.degree}</h3>
                      <p className={`text-sm md:text-base ${engine.accentPrimaryClass} font-medium mb-2 leading-relaxed`}>{edu.institution}</p>
                      <div className="flex flex-wrap gap-4 text-sm md:text-base text-white/50 leading-relaxed">
                        <span>{edu.year}</span>
                        {edu.gpa && <span>GPA: {edu.gpa}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </section>
      </AnimatedSection>
    );
  };

  const renderAchievements = () => {
    if (achievements.length === 0) return null;
    return (
      <AnimatedSection animationType={engine.heroAnimationType} delay={0.3} key="achievements">
        <section id="achievements" className="relative py-10 md:py-20 scroll-mt-16 px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className={`text-2xl md:text-4xl lg:text-5xl ${engine.headingClass} mb-4 text-white`}>
              {isFresher ? "Certifications & Achievements" : "Achievements & Certifications"}
            </h2>
            <div className={`w-24 h-1.5 bg-gradient-to-r ${engine.accentGradientClass} mx-auto rounded-full`}></div>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {achievements.map((achievement, index) => (
              <GlowCard key={index} className={`${engine.cardClass} rounded-xl`}>
                <div className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    <Award className={`h-6 w-6 ${engine.accentPrimaryClass} mt-1 flex-shrink-0`} />
                    <div>
                      <h3 className="text-base md:text-lg font-semibold mb-2 text-white">{achievement.title}</h3>
                      {achievement.description && (
                        <p className="text-sm md:text-base text-white/60 leading-relaxed">{achievement.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </section>
      </AnimatedSection>
    );
  };

  const renderContact = () => (
    <AnimatedSection animationType={engine.heroAnimationType} delay={0.35} key="contact">
      <section id="contact" className="relative py-10 md:py-20 scroll-mt-16 px-4">
        <GlowCard className={`${engine.cardClass} max-w-4xl mx-auto rounded-xl`} glowColor={`bg-gradient-to-r ${engine.accentGradientClass}`}>
          <div className="p-4 md:p-6 lg:p-8 text-center">
            <h2 className={`text-2xl md:text-4xl ${engine.headingClass} mb-4 text-white`}>Get In Touch</h2>
            <div className={`w-24 h-1.5 bg-gradient-to-r ${engine.accentGradientClass} mx-auto rounded-full mb-4`}></div>
            <p className={`text-sm md:text-base lg:text-lg text-white/50 mb-8 max-w-2xl mx-auto leading-relaxed ${engine.bodyClass}`}>
              {isFresher
                ? "I'm actively looking for opportunities to kickstart my career. Let's connect!"
                : "I'm always open to discussing new opportunities and interesting projects. Let's connect and see how we can work together!"}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              {profile.email && (
                <Button size="lg" className={`h-11 px-5 py-2.5 bg-gradient-to-r ${engine.accentGradientClass} text-white border-0 hover:opacity-90 ${engine.accentGlowClass}`} asChild>
                  <a href={safeEmail(profile.email)} className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Me
                  </a>
                </Button>
              )}
              {profile.linkedin_url && (
                <Button size="lg" variant="outline" className="h-11 px-5 py-2.5 border-white/20 text-white hover:bg-white/10 hover:text-white" asChild>
                  <a href={safeUrl(profile.linkedin_url)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Linkedin className="h-5 w-5" />
                    LinkedIn
                  </a>
                </Button>
              )}
            </div>
          </div>
        </GlowCard>
      </section>
    </AnimatedSection>
  );

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    about: renderAbout,
    projects: renderProjects,
    skills: renderSkills,
    education: renderEducation,
    achievements: renderAchievements,
    contact: renderContact,
  };

  const effectiveSectionOrder = engine.sectionOrder.length > 0 ? engine.sectionOrder : layoutConfig.sectionOrder;

  const navSections = effectiveSectionOrder.filter(section => {
    if (section === "about") return !!profile.bio;
    if (section === "projects") return projects.length > 0;
    if (section === "skills") return technicalSkills.length > 0 || softSkills.length > 0 || skills.length > 0;
    if (section === "education") return education.length > 0;
    if (section === "achievements") return achievements.length > 0;
    if (section === "contact") return !!profile.email;
    return false;
  });

  const navLabels: Record<string, string> = {
    about: "About",
    projects: layoutConfig.projectsLabel.split(" ").slice(0, 2).join(" "),
    skills: layoutConfig.skillsLabel.split(" ").slice(0, 2).join(" "),
    education: isFresher ? "Academics" : "Education",
    achievements: "Achievements",
    contact: "Contact",
  };

  const renderHero = heroRenderers[engine.layoutType] || renderHeroTopHeader;

  // Dynamic SEO meta
  const portfolioUrl = id ? `${window.location.origin}/portfolio-view/${id}` : `${window.location.origin}/my-portfolio`;
  const metaTitle = `${profile.full_name} — ${profile.profession || roleLabel || "Portfolio"}`;
  const metaDescription = profile.bio
    ? profile.bio.substring(0, 155) + (profile.bio.length > 155 ? "…" : "")
    : `View ${profile.full_name}'s professional portfolio.`;

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={portfolioUrl} />
        {profile.profile_image_url && <meta property="og:image" content={profile.profile_image_url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {profile.profile_image_url && <meta name="twitter:image" content={profile.profile_image_url} />}
        <link rel="canonical" href={portfolioUrl} />
      </Helmet>

      <FuturisticWrapper engine={engine}>
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gray-950/80 border-b border-white/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4 lg:gap-8 min-w-0">
                <h1 className={`text-base sm:text-xl font-bold bg-gradient-to-r ${engine.accentGradientClass} bg-clip-text text-transparent truncate`}>
                  {profile.full_name}
                </h1>
                <div className="hidden lg:flex space-x-6">
                  <a href="#home" className="text-sm font-medium text-white/60 hover:text-white transition-all">Home</a>
                  {navSections.map(section => (
                    <a key={section} href={`#${section}`} className="text-sm font-medium text-white/60 hover:text-white transition-all">
                      {navLabels[section]}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {id && (
                  <Button 
                    onClick={() => {
                      const shareUrl = `${window.location.origin}/portfolio-view/${id}`;
                      navigator.clipboard.writeText(shareUrl);
                      toast({ title: 'Link Copied!', description: 'Portfolio link copied to clipboard' });
                    }} 
                    variant="outline" 
                    size="sm"
                    className="h-11 px-4 py-2 border-white/20 text-white hover:bg-white/10 hover:text-white hidden sm:flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Share
                  </Button>
                )}
                {user && profile && user.id === profile.user_id && (
                  <>
                    <Button onClick={handleEdit} variant="ghost" size="sm" className="h-11 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 hidden sm:flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button onClick={handleDownload} variant="ghost" size="sm" className="h-11 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 hidden sm:flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                  </>
                )}
                <Button onClick={() => navigate("/")} size="sm" className={`h-11 px-4 py-2 bg-gradient-to-r ${engine.accentGradientClass} text-white border-0 hover:opacity-90 hidden sm:flex items-center gap-2`}>
                  <Home className="h-4 w-4" />
                  Home
                </Button>
                {/* Mobile hamburger */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden h-11 w-11 text-white hover:bg-white/10 hover:text-white"
                  onClick={() => setMobileNavOpen(!mobileNavOpen)}
                >
                  {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile dropdown nav */}
          {mobileNavOpen && (
            <div className="lg:hidden bg-gray-950/95 backdrop-blur-xl border-t border-white/5 px-4 py-4 space-y-2">
              <a href="#home" className="block py-2 text-sm text-white/70 hover:text-white" onClick={() => setMobileNavOpen(false)}>Home</a>
              {navSections.map(section => (
                <a key={section} href={`#${section}`} className="block py-2 text-sm text-white/70 hover:text-white" onClick={() => setMobileNavOpen(false)}>
                  {navLabels[section]}
                </a>
              ))}
              <div className="pt-2 border-t border-white/10 flex flex-wrap gap-3">
                {id && (
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/portfolio-view/${id}`);
                      toast({ title: 'Link Copied!' });
                      setMobileNavOpen(false);
                    }}
                    variant="outline" size="sm" className="h-11 px-4 py-2 border-white/20 text-white hover:bg-white/10 hover:text-white flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" /> Share
                  </Button>
                )}
                {user && profile && user.id === profile.user_id && (
                  <>
                    <Button onClick={() => { handleEdit(); setMobileNavOpen(false); }} variant="ghost" size="sm" className="h-11 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-2">
                      <Edit className="h-4 w-4" /> Edit
                    </Button>
                    <Button onClick={() => { handleDownload(); setMobileNavOpen(false); }} variant="ghost" size="sm" className="h-11 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-2">
                      <Download className="h-4 w-4" /> Download
                    </Button>
                  </>
                )}
                <Button onClick={() => { navigate("/"); setMobileNavOpen(false); }} size="sm" className={`h-11 px-4 py-2 bg-gradient-to-r ${engine.accentGradientClass} text-white border-0 hover:opacity-90 flex items-center gap-2`}>
                  <Home className="h-4 w-4" /> Home
                </Button>
              </div>
            </div>
          )}
        </nav>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
          {/* Hero Section - layout-specific */}
          <AnimatedSection animationType={engine.heroAnimationType}>
            {renderHero()}
          </AnimatedSection>

          {/* Render sections in variant/role-specific order */}
          <div className="space-y-0">
            {effectiveSectionOrder.map(section => sectionRenderers[section]?.())}
          </div>
        </div>
      </FuturisticWrapper>
    </>
  );
};

export default MyPortfolio;
