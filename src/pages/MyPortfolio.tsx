import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe,
  Download,
  Edit,
  GraduationCap,
  Briefcase,
  Award,
  Code,
  ExternalLink,
  Home,
  Terminal,
  Palette,
  BarChart3,
  Shield,
  Cloud,
  Bot,
  Megaphone,
  Smartphone
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { themeStyles, type ThemeId } from "@/lib/themes";
import { jobRoles } from "@/lib/roleThemeMapping";

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

interface Skill {
  name: string;
}

interface Project {
  title: string;
  description: string;
  tech_stack: string[];
  project_url: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
  gpa: string;
}

interface Achievement {
  title: string;
  description: string;
}

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
      let profileData;
      if (id) {
        const { data } = await supabase
          .from("profiles")
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
      
      const portfolioUserId = profileData.user_id;

      const [
        { data: skillsData },
        { data: projectsData },
        { data: educationData },
        { data: achievementsData }
      ] = await Promise.all([
        supabase.from("skills").select("*").eq("user_id", portfolioUserId),
        supabase.from("projects").select("*").eq("user_id", portfolioUserId),
        supabase.from("education").select("*").eq("user_id", portfolioUserId),
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

  // Find the role label for display
  const roleLabel = profile?.job_role
    ? jobRoles.find(r => r.id === profile.job_role)?.label || profile.profession
    : profile?.profession;

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading your portfolio...</h2>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Portfolio not found</h2>
          <p className="text-muted-foreground mb-4">
            It looks like you haven't created your portfolio yet.
          </p>
          <Button onClick={() => navigate("/portfolio-setup")}>
            Create Portfolio
          </Button>
        </div>
      </div>
    );
  }

  // Section renderers
  const renderAbout = () => {
    if (!profile.bio) return null;
    return (
      <section id="about" className="py-20 scroll-mt-16" key="about">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
          </div>
          
          <Card className="card-glass shadow-2xl border-0 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                  {isFresher && (
                    <Badge className="mb-2 bg-primary/10 text-primary border-primary/20">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      Fresh Graduate
                    </Badge>
                  )}
                  {roleLabel && !isFresher && (
                    <Badge className="mb-2 bg-primary/10 text-primary border-primary/20">
                      {roleLabel}
                    </Badge>
                  )}
                  <p className="text-lg leading-relaxed text-foreground/90">
                    {profile.bio}
                  </p>
                  
                  <div className="space-y-4 pt-4">
                    {profile.location && (
                      <div className="flex items-center gap-3 group">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-foreground/80">{profile.location}</span>
                      </div>
                    )}
                    {profile.phone && (
                      <div className="flex items-center gap-3 group">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <a href={`tel:${profile.phone}`} className="text-foreground/80 hover:text-primary transition-colors">
                          {profile.phone}
                        </a>
                      </div>
                    )}
                    {profile.email && (
                      <div className="flex items-center gap-3 group">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <a href={`mailto:${profile.email}`} className="text-foreground/80 hover:text-primary transition-colors">
                          {profile.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-8">
                  {profile.profile_image_url && (
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                      <img
                        src={profile.profile_image_url}
                        alt={profile.full_name}
                        className="relative w-64 h-64 rounded-xl object-cover shadow-2xl"
                      />
                    </div>
                  )}
                  
                  {(profile.linkedin_url || (profile as any).github_url || (profile as any).website_url) && (
                    <div className="flex gap-4">
                      {profile.linkedin_url && (
                        <a 
                          href={profile.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-primary/10 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all hover-scale shadow-lg"
                        >
                          <Linkedin className="h-6 w-6" />
                        </a>
                      )}
                      {(profile as any).github_url && (
                        <a 
                          href={(profile as any).github_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-primary/10 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all hover-scale shadow-lg"
                        >
                          <Github className="h-6 w-6" />
                        </a>
                      )}
                      {(profile as any).website_url && (
                        <a 
                          href={(profile as any).website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-primary/10 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all hover-scale shadow-lg"
                        >
                          <Globe className="h-6 w-6" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  };

  const renderProjects = () => {
    if (projects.length === 0) return null;
    return (
      <section id="projects" className="py-20 scroll-mt-16 section-gradient" key="projects">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{layoutConfig.projectsLabel}</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {layoutConfig.projectsSubtext}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <Card key={index} className="card-glass border-0 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 animate-scale-in">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    {layoutConfig.projectIcon}
                  </div>
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-primary/20 rounded-lg transition-all hover-scale"
                    >
                      <ExternalLink className="h-5 w-5 text-primary" />
                    </a>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-foreground/70 mb-6 leading-relaxed line-clamp-3">
                  {project.description}
                </p>
                
                {layoutConfig.showTechStackProminent ? (
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.map((tech, techIndex) => (
                      <Badge key={techIndex} className="px-3 py-1 bg-primary/10 text-primary border-0 font-medium hover-scale">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="px-3 py-1 hover-scale">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  };

  const renderSkills = () => {
    const hasTechnical = technicalSkills.length > 0;
    const hasSoft = softSkills.length > 0;
    const hasLegacy = skills.length > 0;
    
    // If no skills at all, don't render
    if (!hasTechnical && !hasSoft && !hasLegacy) return null;

    return (
      <section id="skills" className="py-20 scroll-mt-16" key="skills">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{layoutConfig.skillsLabel}</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-8">
            {/* Technical Skills */}
            {hasTechnical && (
              <Card className="card-glass border-0 shadow-2xl">
                <CardContent className="p-8 md:p-12">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {technicalSkills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        className="px-5 py-2.5 text-base font-medium bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary hover:to-accent hover:text-primary-foreground transition-all duration-300 cursor-default hover-scale shadow-md border-0"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Soft Skills */}
            {hasSoft && (
              <Card className="card-glass border-0 shadow-2xl">
                <CardContent className="p-8 md:p-12">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Soft Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {softSkills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="px-5 py-2.5 text-base font-medium rounded-full hover:bg-secondary/80 transition-all duration-300 cursor-default hover-scale shadow-sm"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fallback: Legacy skills (if no technical/soft defined) */}
            {!hasTechnical && !hasSoft && hasLegacy && (
              <Card className="card-glass border-0 shadow-2xl">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {skills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        className="px-5 py-2.5 text-base font-medium bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary hover:to-accent hover:text-primary-foreground transition-all duration-300 cursor-default hover-scale shadow-md border-0"
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    );
  };

  const renderEducation = () => {
    if (education.length === 0) return null;
    return (
      <section id="education" className="py-20 scroll-mt-16" key="education">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {isFresher ? "Education & Academics" : "Education"}
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {education.map((edu, index) => (
            <Card key={index} className="card-elevated hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{edu.degree}</h3>
                    <p className="text-primary font-medium mb-2">{edu.institution}</p>
                    <div className="flex gap-4 text-muted-foreground">
                      <span>{edu.year}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  };

  const renderAchievements = () => {
    if (achievements.length === 0) return null;
    return (
      <section id="achievements" className="py-20 scroll-mt-16" key="achievements">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {isFresher ? "Certifications & Achievements" : "Achievements & Certifications"}
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {achievements.map((achievement, index) => (
            <Card key={index} className="card-elevated hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Award className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
                    {achievement.description && (
                      <p className="text-muted-foreground">{achievement.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  };

  const renderContact = () => (
    <section id="contact" className="py-20 scroll-mt-16" key="contact">
      <Card className="card-elevated max-w-4xl mx-auto">
        <CardContent className="p-8 md:p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {isFresher
              ? "I'm actively looking for opportunities to kickstart my career. Let's connect!"
              : "I'm always open to discussing new opportunities and interesting projects. Let's connect and see how we can work together!"}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {profile.email && (
              <Button size="lg" className="btn-hero" asChild>
                <a href={`mailto:${profile.email}`}>
                  <Mail className="h-5 w-5 mr-2" />
                  Email Me
                </a>
              </Button>
            )}
            {profile.linkedin_url && (
              <Button size="lg" variant="outline" asChild>
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5 mr-2" />
                  LinkedIn
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );

  // Map section names to renderers
  const sectionRenderers: Record<string, () => React.ReactNode> = {
    about: renderAbout,
    projects: renderProjects,
    skills: renderSkills,
    education: renderEducation,
    achievements: renderAchievements,
    contact: renderContact,
  };

  // Build nav links based on section order (only show sections with data)
  const navSections = layoutConfig.sectionOrder.filter(section => {
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

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text}`}>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/90 border-b shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gradient">
                {profile.full_name}
              </h1>
              <div className="hidden md:flex space-x-6">
                <a href="#home" className="text-sm font-medium hover:text-primary transition-all hover-scale">Home</a>
                {navSections.map(section => (
                  <a key={section} href={`#${section}`} className="text-sm font-medium hover:text-primary transition-all hover-scale">
                    {navLabels[section]}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {id && (
                <Button 
                  onClick={() => {
                    const portfolioUrl = `${window.location.origin}/portfolio-view/${id}`;
                    navigator.clipboard.writeText(portfolioUrl);
                    toast({
                      title: 'Link Copied!',
                      description: 'Portfolio link copied to clipboard'
                    });
                  }} 
                  variant="outline" 
                  size="sm"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
              {user && profile && user.id === profile.user_id && (
                <>
                  <Button onClick={handleEdit} variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button onClick={handleDownload} variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </>
              )}
              <Button onClick={() => navigate("/")} variant="default" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center pt-24 pb-20">
          <div className="text-center max-w-5xl mx-auto animate-fade-in">
            <div className="mb-12">
              {profile.profile_image_url && (
                <div className="mb-8 flex justify-center">
                  <img
                    src={profile.profile_image_url}
                    alt={profile.full_name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-primary/20 shadow-2xl animate-scale-in"
                  />
                </div>
              )}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
                Hi, I'm{" "}
                <span className={currentTheme.primary}>
                  {profile.full_name}
                </span>
              </h1>
              <p className={`text-2xl md:text-4xl font-bold ${currentTheme.secondary} mb-4 animate-slide-up`}>
                {profile.profession || roleLabel}
              </p>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up">
                {layoutConfig.heroSubtext}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <a href="#projects">
                <Button size="lg" className="text-lg px-10 py-6 shadow-lg hover:shadow-2xl transition-all">
                  View My Work
                </Button>
              </a>
              <a href="#contact">
                <Button size="lg" variant="outline" className="text-lg px-10 py-6 shadow-md hover:shadow-xl transition-all">
                  Get in Touch
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Render sections in role-specific order */}
        {layoutConfig.sectionOrder.map(section => sectionRenderers[section]?.())}
      </div>
    </div>
  );
};

export default MyPortfolio;
