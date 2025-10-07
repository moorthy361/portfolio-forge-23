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
  Home
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

const MyPortfolio = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If viewing by ID, allow public access without auth check
    if (id) {
      loadPortfolioData();
      return;
    }
    
    // If accessing without ID, require authentication
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
      
      // If viewing a specific portfolio by ID
      if (id) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        profileData = data;
      } else {
        // Load the most recent profile for this user
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

      setProfile(profileData);
      
      // Use the profile's user_id for loading related data
      const portfolioUserId = profileData.user_id;

      // Parallel data loading for maximum speed
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
    navigate("/portfolio-setup");
  };

  const handleDownload = () => {
    window.print();
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
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
                {profile.bio && <a href="#about" className="text-sm font-medium hover:text-primary transition-all hover-scale">About</a>}
                {projects.length > 0 && <a href="#projects" className="text-sm font-medium hover:text-primary transition-all hover-scale">Projects</a>}
                {skills.length > 0 && <a href="#skills" className="text-sm font-medium hover:text-primary transition-all hover-scale">Skills</a>}
                {education.length > 0 && <a href="#education" className="text-sm font-medium hover:text-primary transition-all hover-scale">Education</a>}
                {achievements.length > 0 && <a href="#achievements" className="text-sm font-medium hover:text-primary transition-all hover-scale">Achievements</a>}
                {profile.email && <a href="#contact" className="text-sm font-medium hover:text-primary transition-all hover-scale">Contact</a>}
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
                <span className="text-gradient">
                  {profile.full_name}
                </span>
              </h1>
              <p className="text-2xl md:text-4xl font-bold text-primary mb-6 animate-slide-up">
                {profile.profession}
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

        {/* About Section */}
        {profile.bio && (
          <section id="about" className="py-20 scroll-mt-16">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 animate-fade-in">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
              </div>
              
              <Card className="card-glass shadow-2xl border-0 overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
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
                      
                      {(profile.linkedin_url || profile.github_url || profile.website_url) && (
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
                          {profile.github_url && (
                            <a 
                              href={profile.github_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-3 bg-primary/10 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all hover-scale shadow-lg"
                            >
                              <Github className="h-6 w-6" />
                            </a>
                          )}
                          {profile.website_url && (
                            <a 
                              href={profile.website_url} 
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
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <section id="projects" className="py-20 scroll-mt-16 section-gradient">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Projects</h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-6"></div>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Here are some of my recent projects that showcase my skills and expertise
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {projects.map((project, index) => (
                <Card key={index} className="card-glass border-0 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 animate-scale-in">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <Code className="h-6 w-6" />
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
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="px-3 py-1 hover-scale">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <section id="skills" className="py-20 scroll-mt-16">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16 animate-fade-in">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Technical Skills</h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
              </div>
              
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
            </div>
          </section>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <section id="education" className="py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Education</h2>
              <div className="w-24 h-1 bg-primary mx-auto"></div>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              {education.map((edu, index) => (
                <Card key={index} className="card-elevated">
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
        )}

        {/* Achievements Section */}
        {achievements.length > 0 && (
          <section id="achievements" className="py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Achievements & Certifications</h2>
              <div className="w-24 h-1 bg-primary mx-auto"></div>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-4">
              {achievements.map((achievement, index) => (
                <Card key={index} className="card-elevated">
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
        )}

        {/* Contact Section */}
        <section id="contact" className="py-20">
          <Card className="card-elevated max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                I'm always open to discussing new opportunities and interesting projects. 
                Let's connect and see how we can work together!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {profile.email && (
                  <Button size="lg" className="btn-hero">
                    <Mail className="h-5 w-5 mr-2" />
                    Email Me
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
      </div>
    </div>
  );
};

export default MyPortfolio;