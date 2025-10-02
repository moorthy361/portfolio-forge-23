import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { X, Plus, Home } from "lucide-react";

interface ProfileData {
  full_name: string;
  profession: string;
  bio: string;
  location: string;
  phone: string;
  linkedin_url: string;
  github_url: string;
  website_url: string;
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

const PortfolioSetup = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<ProfileData>({
    full_name: "",
    profession: "",
    bio: "",
    location: "",
    phone: "",
    linkedin_url: "",
    github_url: "",
    website_url: "",
  });
  
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState("");
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Project>({
    title: "",
    description: "",
    tech_stack: [],
    project_url: "",
  });
  const [newTech, setNewTech] = useState("");
  
  const [education, setEducation] = useState<Education[]>([]);
  const [newEducation, setNewEducation] = useState<Education>({
    degree: "",
    institution: "",
    year: "",
    gpa: "",
  });
  
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newAchievement, setNewAchievement] = useState<Achievement>({
    title: "",
    description: "",
  });
  
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);


  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { name: newSkill.trim() }]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addTechToProject = () => {
    if (newTech.trim()) {
      setNewProject({
        ...newProject,
        tech_stack: [...newProject.tech_stack, newTech.trim()]
      });
      setNewTech("");
    }
  };

  const removeTechFromProject = (index: number) => {
    setNewProject({
      ...newProject,
      tech_stack: newProject.tech_stack.filter((_, i) => i !== index)
    });
  };

  const addProject = () => {
    if (newProject.title.trim()) {
      setProjects([...projects, newProject]);
      setNewProject({
        title: "",
        description: "",
        tech_stack: [],
        project_url: "",
      });
    }
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    if (newEducation.degree.trim() && newEducation.institution.trim()) {
      setEducation([...education, newEducation]);
      setNewEducation({
        degree: "",
        institution: "",
        year: "",
        gpa: "",
      });
    }
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addAchievement = () => {
    if (newAchievement.title.trim()) {
      setAchievements([...achievements, newAchievement]);
      setNewAchievement({
        title: "",
        description: "",
      });
    }
  };

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const savePortfolio = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      let profileImageUrl = "";

      // Upload profile image if one was selected
      if (profileImage) {
        const fileExt = profileImage.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(fileName, profileImage, { upsert: true });

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          toast({
            title: "Error",
            description: "Failed to upload profile image",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('profile-images')
          .getPublicUrl(fileName);

        profileImageUrl = publicUrl;
      }
      
      // Upsert profile (insert or update if user_id already exists)
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          ...profile,
          profile_image_url: profileImageUrl,
          title: "My Portfolio",
          email: user.email,
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (profileError) throw profileError;
      
      const profileId = profileData.id;

      // Add skills for this portfolio
      if (skills.length > 0) {
        const { error: skillsError } = await supabase
          .from("skills")
          .insert(skills.map(skill => ({ user_id: user.id, name: skill.name })));
        
        if (skillsError) throw skillsError;
      }

      // Add projects for this portfolio
      if (projects.length > 0) {
        const { error: projectsError } = await supabase
          .from("projects")
          .insert(projects.map(project => ({ user_id: user.id, ...project })));
        
        if (projectsError) throw projectsError;
      }

      // Add education for this portfolio
      if (education.length > 0) {
        const { error: educationError } = await supabase
          .from("education")
          .insert(education.map(edu => ({ user_id: user.id, ...edu })));
        
        if (educationError) throw educationError;
      }

      // Add achievements for this portfolio
      if (achievements.length > 0) {
        const { error: achievementsError } = await supabase
          .from("achievements")
          .insert(achievements.map(achievement => ({ user_id: user.id, ...achievement })));
        
        if (achievementsError) throw achievementsError;
      }

      toast({
        title: "Portfolio Created!",
        description: "Your new portfolio has been successfully created.",
      });

      // Navigate to the newly created portfolio
      navigate(`/portfolio-view/${profileId}`);
    } catch (error: any) {
      console.error("Error saving portfolio:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save portfolio",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    "Personal Information",
    "Skills",
    "Projects", 
    "Education",
    "Achievements"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold mb-4">Create Your Portfolio</h1>
              <p className="text-muted-foreground">
                Fill in your details to generate a stunning portfolio
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className={`text-sm font-medium ${
                    index <= currentSection ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {section}
                </div>
              ))}
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
              />
            </div>
          </div>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>{sections[currentSection]}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Personal Information */}
              {currentSection === 0 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="profileImage">Profile Photo</Label>
                    <div className="flex items-center gap-4 mt-2">
                      {profileImagePreview && (
                        <img
                          src={profileImagePreview}
                          alt="Profile preview"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      )}
                      <Input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="profession">Profession *</Label>
                      <Input
                        id="profession"
                        value={profile.profession}
                        onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
                        placeholder="e.g., Full Stack Developer"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio/Summary *</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                      <Input
                        id="linkedin_url"
                        value={profile.linkedin_url}
                        onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="github_url">GitHub URL</Label>
                      <Input
                        id="github_url"
                        value={profile.github_url}
                        onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="website_url">Website URL</Label>
                      <Input
                        id="website_url"
                        value={profile.website_url}
                        onChange={(e) => setProfile({ ...profile, website_url: e.target.value })}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Skills */}
              {currentSection === 1 && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    />
                    <Button onClick={addSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-2">
                        {skill.name}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeSkill(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {currentSection === 2 && (
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold">Add New Project</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="project_title">Project Title</Label>
                        <Input
                          id="project_title"
                          value={newProject.title}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          placeholder="Project name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="project_url">Project URL</Label>
                        <Input
                          id="project_url"
                          value={newProject.project_url}
                          onChange={(e) => setNewProject({ ...newProject, project_url: e.target.value })}
                          placeholder="https://project-demo.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="project_description">Description</Label>
                      <Textarea
                        id="project_description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="Describe your project"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Tech Stack</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={newTech}
                          onChange={(e) => setNewTech(e.target.value)}
                          placeholder="Add technology"
                          onKeyPress={(e) => e.key === "Enter" && addTechToProject()}
                        />
                        <Button onClick={addTechToProject}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newProject.tech_stack.map((tech, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-2">
                            {tech}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeTechFromProject(index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button onClick={addProject} disabled={!newProject.title.trim()}>
                      Add Project
                    </Button>
                  </div>

                  {projects.map((project, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{project.title}</h4>
                          <p className="text-muted-foreground text-sm">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.tech_stack.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeProject(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {currentSection === 3 && (
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold">Add Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="degree">Degree</Label>
                        <Input
                          id="degree"
                          value={newEducation.degree}
                          onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                          placeholder="Bachelor of Science in..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="institution">Institution</Label>
                        <Input
                          id="institution"
                          value={newEducation.institution}
                          onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                          placeholder="University name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="year">Year</Label>
                        <Input
                          id="year"
                          value={newEducation.year}
                          onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                          placeholder="2019-2023"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gpa">GPA (Optional)</Label>
                        <Input
                          id="gpa"
                          value={newEducation.gpa}
                          onChange={(e) => setNewEducation({ ...newEducation, gpa: e.target.value })}
                          placeholder="3.8/4.0"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={addEducation} 
                      disabled={!newEducation.degree.trim() || !newEducation.institution.trim()}
                    >
                      Add Education
                    </Button>
                  </div>

                  {education.map((edu, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{edu.degree}</h4>
                          <p className="text-primary">{edu.institution}</p>
                          <div className="flex gap-4 text-muted-foreground text-sm">
                            <span>{edu.year}</span>
                            {edu.gpa && <span>GPA: {edu.gpa}</span>}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeEducation(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Achievements */}
              {currentSection === 4 && (
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold">Add Achievement</h3>
                    <div>
                      <Label htmlFor="achievement_title">Title</Label>
                      <Input
                        id="achievement_title"
                        value={newAchievement.title}
                        onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                        placeholder="Achievement title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="achievement_description">Description (Optional)</Label>
                      <Textarea
                        id="achievement_description"
                        value={newAchievement.description}
                        onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                        placeholder="Describe your achievement"
                        rows={2}
                      />
                    </div>
                    <Button onClick={addAchievement} disabled={!newAchievement.title.trim()}>
                      Add Achievement
                    </Button>
                  </div>

                  {achievements.map((achievement, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{achievement.title}</h4>
                          {achievement.description && (
                            <p className="text-muted-foreground text-sm">{achievement.description}</p>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeAchievement(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
            >
              Previous
            </Button>
            
            {currentSection < sections.length - 1 ? (
              <Button onClick={() => setCurrentSection(currentSection + 1)}>
                Next
              </Button>
            ) : (
              <Button 
                onClick={savePortfolio} 
                disabled={isSubmitting || !profile.full_name || !profile.profession || !profile.bio}
                className="btn-hero"
              >
                {isSubmitting ? "Creating Portfolio..." : "Create Portfolio"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSetup;