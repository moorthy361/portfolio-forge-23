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

interface Profile {
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
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      loadPortfolioData();
    }
  }, [user, loading, navigate]);

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

      // Load skills
      const { data: skillsData } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", portfolioUserId);

      if (skillsData) {
        setSkills(skillsData);
      }

      // Load projects
      const { data: projectsData } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", portfolioUserId);

      if (projectsData) {
        setProjects(projectsData);
      }

      // Load education
      const { data: educationData } = await supabase
        .from("education")
        .select("*")
        .eq("user_id", portfolioUserId);

      if (educationData) {
        setEducation(educationData);
      }

      // Load achievements
      const { data: achievementsData } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", portfolioUserId);

      if (achievementsData) {
        setAchievements(achievementsData);
      }
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {profile.full_name}
              </h1>
              <div className="hidden md:flex space-x-6">
                <a href="#home" className="text-foreground hover:text-primary transition-colors">Home</a>
                <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
                <a href="#projects" className="text-foreground hover:text-primary transition-colors">Projects</a>
                <a href="#skills" className="text-foreground hover:text-primary transition-colors">Skills</a>
                <a href="#education" className="text-foreground hover:text-primary transition-colors">Education</a>
                <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => navigate("/")} variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold mb-6">
                Hi, I'm{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  {profile.full_name.split(" ")[0]}
                </span>
              </h1>
              <p className="text-2xl md:text-3xl text-primary font-semibold mb-6">
                {profile.profession}
              </p>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {profile.bio}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-hero text-lg px-8 py-6">
                View My Work
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Get in Touch
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <Card className="card-elevated max-w-6xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">About Me</h2>
                <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  {profile.profile_image_url && (
                    <div className="flex justify-center md:justify-start">
                      <img
                        src={profile.profile_image_url}
                        alt={profile.full_name}
                        className="w-48 h-48 rounded-lg object-cover shadow-lg"
                      />
                    </div>
                  )}
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {profile.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <a href={`mailto:${profile.email}`} className="hover:text-primary transition-colors">
                        {profile.email}
                      </a>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <a href={`tel:${profile.phone}`} className="hover:text-primary transition-colors">
                        {profile.phone}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex gap-4 pt-4">
                    {profile.linkedin_url && (
                      <a 
                        href={profile.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        <Linkedin className="h-5 w-5 text-primary" />
                      </a>
                    )}
                    {profile.github_url && (
                      <a 
                        href={profile.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        <Github className="h-5 w-5 text-primary" />
                      </a>
                    )}
                    {profile.website_url && (
                      <a 
                        href={profile.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        <Globe className="h-5 w-5 text-primary" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Projects Section */}
        {projects.length > 0 && (
          <section id="projects" className="py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Here are some of my recent projects that showcase my skills and expertise
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {projects.map((project, index) => (
                <Card key={index} className="card-elevated hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="text-xs">
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
          <section id="skills" className="py-20">
            <Card className="card-elevated max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl font-bold mb-4">Technical Skills</CardTitle>
                <div className="w-24 h-1 bg-primary mx-auto"></div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-wrap gap-3 justify-center">
                  {skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="px-4 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
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