import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { addPortfolioToHistory } from "@/hooks/useBrowsingHistory";
import SharePortfolioModal from "@/components/SharePortfolioModal";
import { ThemeSelection } from "@/components/ThemeSelection";
import { JobRoleSelection } from "@/components/JobRoleSelection";
import { ResumeUpload, ParsedResumeData } from "@/components/ResumeUpload";
import { roleThemeMap, suggestThemeFromSkills, RoleThemeRecommendation } from "@/lib/roleThemeMapping";
import { generateDesignVariant, type DesignVariant } from "@/lib/designVariantGenerator";
import { X, Plus, Home, Check } from "lucide-react";

interface ProfileData {
  full_name: string;
  profession: string;
  bio: string;
  location: string;
  phone: string;
  linkedin_url: string;
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
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const editProfileId = searchParams.get("edit");
  const isEditMode = !!editProfileId;
  
  const [profile, setProfile] = useState<ProfileData>({
    full_name: "",
    profession: "",
    bio: "",
    location: "",
    phone: "",
    linkedin_url: "",
  });
  
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [newTechnicalSkill, setNewTechnicalSkill] = useState("");
  const [newSoftSkill, setNewSoftSkill] = useState("");
  const [newSkill, setNewSkill] = useState("");
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Project>({
    title: "", description: "", tech_stack: [], project_url: "",
  });
  const [newTech, setNewTech] = useState("");
  
  const [education, setEducation] = useState<Education[]>([]);
  const [newEducation, setNewEducation] = useState<Education>({
    degree: "", institution: "", year: "", gpa: "",
  });
  
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newAchievement, setNewAchievement] = useState<Achievement>({
    title: "", description: "",
  });
  
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState("classic");
  const [selectedRole, setSelectedRole] = useState("");
  const [isFresher, setIsFresher] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [recommendedThemes, setRecommendedThemes] = useState<RoleThemeRecommendation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [createdPortfolioId, setCreatedPortfolioId] = useState<string>("");
  const [createdPortfolioName, setCreatedPortfolioName] = useState<string>("");
  const [editUserId, setEditUserId] = useState<string>("");
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load existing data in edit mode
  useEffect(() => {
    if (isEditMode && user && !dataLoaded) {
      loadExistingData();
    }
  }, [isEditMode, user, dataLoaded]);

  const loadExistingData = async () => {
    if (!editProfileId || !user) return;
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", editProfileId)
        .single();

      if (!profileData) {
        toast({ title: "Error", description: "Portfolio not found", variant: "destructive" });
        navigate("/portfolio-setup");
        return;
      }

      setEditUserId(profileData.user_id);
      setProfile({
        full_name: profileData.full_name || "",
        profession: profileData.profession || "",
        bio: profileData.bio || "",
        location: profileData.location || "",
        phone: profileData.phone || "",
        linkedin_url: profileData.linkedin_url || "",
      });
      setSelectedTheme(profileData.theme || "classic");
      setSelectedRole(profileData.job_role || "");
      setIsFresher(profileData.is_fresher || false);
      setResumeUrl(profileData.resume_url || "");
      if (profileData.profile_image_url) {
        setProfileImagePreview(profileData.profile_image_url);
      }

      // Load technical_skills and soft_skills from profile
      setTechnicalSkills((profileData as any).technical_skills || []);
      setSoftSkills((profileData as any).soft_skills || []);

      const [
        { data: skillsData },
        { data: projectsData },
        { data: educationData },
        { data: achievementsData },
      ] = await Promise.all([
        supabase.from("skills").select("*").eq("user_id", profileData.user_id),
        supabase.from("projects").select("*").eq("user_id", profileData.user_id),
        supabase.from("education").select("*").eq("user_id", profileData.user_id),
        supabase.from("achievements").select("*").eq("user_id", profileData.user_id),
      ]);

      setSkills((skillsData || []).map((s: any) => ({ name: s.name })));
      setProjects((projectsData || []).map((p: any) => ({
        title: p.title,
        description: p.description || "",
        tech_stack: p.tech_stack || [],
        project_url: p.project_url || "",
      })));
      setEducation((educationData || []).map((e: any) => ({
        degree: e.degree,
        institution: e.institution,
        year: e.year || "",
        gpa: e.gpa || "",
      })));
      setAchievements((achievementsData || []).map((a: any) => ({
        title: a.title,
        description: a.description || "",
      })));

      // Skip to personal info step (step 2) in edit mode
      setCurrentSection(2);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error loading portfolio for edit:", error);
      toast({ title: "Error", description: "Failed to load portfolio data", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (!isEditMode) {
      localStorage.removeItem('portfolioData');
      localStorage.removeItem('currentPortfolio');
      sessionStorage.removeItem('portfolioData');
      setCurrentSection(0);
      setIsSubmitting(false);
      setShowShareModal(false);
    }
  }, [isEditMode]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Update fresher status and theme recommendations when role changes
  useEffect(() => {
    const fresher = selectedRole === "fresher";
    setIsFresher(fresher);
    if (selectedRole && roleThemeMap[selectedRole]) {
      setRecommendedThemes(roleThemeMap[selectedRole]);
      // Auto-select first recommended theme
      setSelectedTheme(roleThemeMap[selectedRole][0].themeId);
    }
  }, [selectedRole]);

  // Known technical keywords for auto-classification
  const TECHNICAL_KEYWORDS = [
    "react", "node", "python", "java", "javascript", "typescript", "sql", "nosql", "mongodb",
    "docker", "kubernetes", "aws", "azure", "gcp", "html", "css", "sass", "tailwind",
    "git", "github", "linux", "api", "rest", "graphql", "firebase", "supabase",
    "flutter", "swift", "kotlin", "c++", "c#", "rust", "go", "php", "ruby",
    "django", "flask", "spring", "express", "next", "vue", "angular", "svelte",
    "tensorflow", "pytorch", "pandas", "numpy", "scikit", "opencv", "keras",
    "machine learning", "deep learning", "ai", "ml", "data analysis", "data science",
    "devops", "ci/cd", "jenkins", "terraform", "ansible", "agile", "scrum",
    "figma", "photoshop", "illustrator", "sketch", "xd", "ui", "ux",
    "mysql", "postgresql", "redis", "elasticsearch", "kafka",
    "blockchain", "solidity", "web3", "lstm", "bi-lstm", "gans", "yolo",
    "ocr", "nlp", "computer vision", "neural network", "hadoop", "spark",
    "tableau", "power bi", "excel", "r", "matlab", "sas", "spss",
    "selenium", "cypress", "jest", "mocha", "testing", "qa",
    "networking", "tcp/ip", "dns", "http", "ssl", "tls",
    "oops", "software engineering", "data structures", "algorithms",
  ];

  const classifySkill = (skill: string): "technical" | "soft" => {
    const lower = skill.toLowerCase().trim();
    return TECHNICAL_KEYWORDS.some(kw => lower.includes(kw) || kw.includes(lower))
      ? "technical"
      : "soft";
  };

  const handleResumeParsed = (data: ParsedResumeData) => {
    setProfile({
      full_name: data.full_name || "",
      profession: data.profession || "",
      bio: data.bio || "",
      location: data.location || "",
      phone: data.phone || "",
      linkedin_url: data.linkedin_url || "",
    });
    
    // Auto-classify skills from resume
    const allSkills = data.skills || [];
    const tech: string[] = [];
    const soft: string[] = [];
    allSkills.forEach(s => {
      if (classifySkill(s) === "technical") tech.push(s);
      else soft.push(s);
    });
    setTechnicalSkills(tech);
    setSoftSkills(soft);
    // Keep backward-compatible skills
    setSkills(allSkills.map(s => ({ name: s })));
    
    setEducation(data.education || []);
    setProjects(data.projects || []);
    if (data.experience?.length > 0) {
      setAchievements(data.experience.map(e => ({ title: e.title, description: e.description })));
    }
    // Smart theme suggestion from skills
    if (allSkills.length > 0) {
      const suggested = suggestThemeFromSkills(allSkills);
      setRecommendedThemes(suggested);
      setSelectedTheme(suggested[0].themeId);
    }
    // Move to personal info step for review
    setCurrentSection(2);
    toast({ title: "Resume Data Loaded", description: "Review and edit your details below." });
  };

  const addSkill = () => { if (newSkill.trim()) { setSkills([...skills, { name: newSkill.trim() }]); setNewSkill(""); } };
  const removeSkill = (i: number) => setSkills(skills.filter((_, idx) => idx !== i));
  const addTechnicalSkill = () => { if (newTechnicalSkill.trim() && !technicalSkills.includes(newTechnicalSkill.trim())) { setTechnicalSkills([...technicalSkills, newTechnicalSkill.trim()]); setNewTechnicalSkill(""); } };
  const removeTechnicalSkill = (i: number) => setTechnicalSkills(technicalSkills.filter((_, idx) => idx !== i));
  const addSoftSkill = () => { if (newSoftSkill.trim() && !softSkills.includes(newSoftSkill.trim())) { setSoftSkills([...softSkills, newSoftSkill.trim()]); setNewSoftSkill(""); } };
  const removeSoftSkill = (i: number) => setSoftSkills(softSkills.filter((_, idx) => idx !== i));
  const addTechToProject = () => { if (newTech.trim()) { setNewProject({ ...newProject, tech_stack: [...newProject.tech_stack, newTech.trim()] }); setNewTech(""); } };
  const removeTechFromProject = (i: number) => setNewProject({ ...newProject, tech_stack: newProject.tech_stack.filter((_, idx) => idx !== i) });
  const addProject = () => { if (newProject.title.trim()) { setProjects([...projects, newProject]); setNewProject({ title: "", description: "", tech_stack: [], project_url: "" }); } };
  const removeProject = (i: number) => setProjects(projects.filter((_, idx) => idx !== i));
  const addEducation = () => { if (newEducation.degree.trim() && newEducation.institution.trim()) { setEducation([...education, newEducation]); setNewEducation({ degree: "", institution: "", year: "", gpa: "" }); } };
  const removeEducation = (i: number) => setEducation(education.filter((_, idx) => idx !== i));
  const addAchievement = () => { if (newAchievement.title.trim()) { setAchievements([...achievements, newAchievement]); setNewAchievement({ title: "", description: "" }); } };
  const removeAchievement = (i: number) => setAchievements(achievements.filter((_, idx) => idx !== i));

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const savePortfolio = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      let profileImageUrl = profileImagePreview || "";
      if (profileImage) {
        const fileExt = profileImage.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('profile-images').upload(fileName, profileImage, { upsert: true });
        if (uploadError) { toast({ title: "Error", description: "Failed to upload profile image", variant: "destructive" }); setIsSubmitting(false); return; }
        const { data: { publicUrl } } = supabase.storage.from('profile-images').getPublicUrl(fileName);
        profileImageUrl = publicUrl;
      }

      // Generate a new design variant only for new portfolios
      const designVariant = isEditMode ? undefined : generateDesignVariant();

      const profilePayload: Record<string, any> = {
        user_id: user.id,
        ...profile,
        profile_image_url: profileImageUrl,
        title: "My Portfolio",
        email: user.email,
        theme: selectedTheme,
        job_role: selectedRole,
        is_fresher: isFresher,
        resume_url: resumeUrl,
        template_type: selectedTheme,
        technical_skills: technicalSkills,
        soft_skills: softSkills,
      };

      if (designVariant) {
        profilePayload.design_variant = designVariant;
      }

      let profileId: string;

      if (isEditMode && editProfileId) {
        // UPDATE existing profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .update(profilePayload as any)
          .eq("id", editProfileId)
          .select()
          .single();
        if (profileError) throw profileError;
        profileId = profileData.id;

        // Delete old related data, then re-insert
        const userId = user.id;
        await Promise.all([
          supabase.from("skills").delete().eq("user_id", userId),
          supabase.from("projects").delete().eq("user_id", userId),
          supabase.from("education").delete().eq("user_id", userId),
          supabase.from("achievements").delete().eq("user_id", userId),
        ]);
      } else {
        // INSERT new profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .insert(profilePayload as any)
          .select()
          .single();
        if (profileError) throw profileError;
        profileId = profileData.id;
      }

      const insertPromises = [];
      if (skills.length > 0) insertPromises.push(supabase.from("skills").insert(skills.map(s => ({ user_id: user.id, name: s.name }))));
      if (projects.length > 0) insertPromises.push(supabase.from("projects").insert(projects.map(p => ({ user_id: user.id, ...p }))));
      if (education.length > 0) insertPromises.push(supabase.from("education").insert(education.map(e => ({ user_id: user.id, ...e }))));
      if (achievements.length > 0) insertPromises.push(supabase.from("achievements").insert(achievements.map(a => ({ user_id: user.id, ...a }))));
      await Promise.allSettled(insertPromises);

      addPortfolioToHistory(profileId, profile.full_name);
      toast({ title: isEditMode ? "Portfolio Updated!" : "Portfolio Created!", description: isEditMode ? "Your portfolio has been successfully updated." : "Your new portfolio has been successfully created." });
      setCreatedPortfolioId(profileId);
      setCreatedPortfolioName(profile.full_name);
      
      if (isEditMode) {
        navigate(`/portfolio-view/${profileId}`);
      } else {
        setShowShareModal(true);
      }
    } catch (error: any) {
      console.error("Error saving portfolio:", error);
      toast({ title: "Error", description: error.message || "Failed to save portfolio", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic sections based on fresher status
  const sections = isFresher
    ? ["Job Role", "Resume Upload", "Personal Information", "Skills", "Projects", "Education", "Theme Selection"]
    : ["Job Role", "Resume Upload", "Personal Information", "Skills", "Projects", "Education", "Achievements", "Theme Selection"];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <h2 className="text-2xl font-bold">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold mb-4">{isEditMode ? "Edit Your Portfolio" : "Create Your Portfolio"}</h1>
              <p className="text-muted-foreground">{isEditMode ? "Update your details and save changes" : "Fill in your details to generate a stunning portfolio"}</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")} className="flex items-center gap-2">
              <Home className="h-4 w-4" /> Back to Home
            </Button>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {sections.map((section, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      index < currentSection
                        ? "bg-primary text-primary-foreground"
                        : index === currentSection
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index < currentSection ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  <span className={`text-xs mt-1 text-center hidden md:block ${
                    index <= currentSection ? "text-primary font-medium" : "text-muted-foreground"
                  }`}>
                    {section}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
              />
            </div>
          </div>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>{sections[currentSection]}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Step 0: Job Role */}
              {currentSection === 0 && (
                <div className="animate-fade-in">
                  <JobRoleSelection selectedRole={selectedRole} onRoleSelect={setSelectedRole} />
                </div>
              )}

              {/* Step 1: Resume Upload */}
              {currentSection === 1 && user && (
                <div className="animate-fade-in">
                  <ResumeUpload
                    userId={user.id}
                    onParsed={handleResumeParsed}
                    onSkip={() => setCurrentSection(2)}
                  />
                </div>
              )}

              {/* Step 2: Personal Information */}
              {currentSection === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <Label htmlFor="profileImage">Profile Photo</Label>
                    <div className="flex items-center gap-4 mt-2">
                      {profileImagePreview && (
                        <img src={profileImagePreview} alt="Profile preview" className="w-20 h-20 rounded-full object-cover" />
                      )}
                      <Input id="profileImage" type="file" accept="image/*" onChange={handleProfileImageChange} className="flex-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input id="full_name" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} placeholder="Your full name" required />
                    </div>
                    <div>
                      <Label htmlFor="profession">Profession *</Label>
                      <Input id="profession" value={profile.profession} onChange={(e) => setProfile({ ...profile, profession: e.target.value })} placeholder="e.g., Full Stack Developer" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio/Summary *</Label>
                    <Textarea id="bio" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell us about yourself..." rows={4} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder="City, Country" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+1 (555) 123-4567" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input id="linkedin_url" value={profile.linkedin_url} onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/..." />
                  </div>
                </div>
              )}

              {/* Step 3: Skills */}
              {currentSection === 3 && (
                <div className="space-y-8 animate-fade-in">
                  {/* Technical Skills */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">💻 Technical Skills</h3>
                      <p className="text-sm text-muted-foreground">Programming languages, frameworks, tools, and technologies</p>
                    </div>
                    <div className="flex gap-2">
                      <Input value={newTechnicalSkill} onChange={(e) => setNewTechnicalSkill(e.target.value)} placeholder="e.g., React, Python, Docker, SQL..." onKeyPress={(e) => e.key === "Enter" && addTechnicalSkill()} />
                      <Button onClick={addTechnicalSkill}><Plus className="h-4 w-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {technicalSkills.map((skill, index) => (
                        <Badge key={index} className="flex items-center gap-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                          {skill}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeTechnicalSkill(index)} />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border" />

                  {/* Soft Skills */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">🤝 Soft Skills</h3>
                      <p className="text-sm text-muted-foreground">Interpersonal, communication, and leadership abilities</p>
                    </div>
                    <div className="flex gap-2">
                      <Input value={newSoftSkill} onChange={(e) => setNewSoftSkill(e.target.value)} placeholder="e.g., Communication, Teamwork, Leadership..." onKeyPress={(e) => e.key === "Enter" && addSoftSkill()} />
                      <Button onClick={addSoftSkill}><Plus className="h-4 w-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {softSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-2">
                          {skill}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeSoftSkill(index)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Projects */}
              {currentSection === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold">Add New Project</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="project_title">Project Title</Label>
                        <Input id="project_title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="Project name" />
                      </div>
                      <div>
                        <Label htmlFor="project_url">Project URL</Label>
                        <Input id="project_url" value={newProject.project_url} onChange={(e) => setNewProject({ ...newProject, project_url: e.target.value })} placeholder="https://project-demo.com" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="project_description">Description</Label>
                      <Textarea id="project_description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} placeholder="Describe your project" rows={3} />
                    </div>
                    <div>
                      <Label>Tech Stack</Label>
                      <div className="flex gap-2 mt-2">
                        <Input value={newTech} onChange={(e) => setNewTech(e.target.value)} placeholder="Add technology" onKeyPress={(e) => e.key === "Enter" && addTechToProject()} />
                        <Button onClick={addTechToProject}><Plus className="h-4 w-4" /></Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newProject.tech_stack.map((tech, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-2">
                            {tech}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => removeTechFromProject(index)} />
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button onClick={addProject} disabled={!newProject.title.trim()}>Add Project</Button>
                  </div>
                  {projects.map((project, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{project.title}</h4>
                          <p className="text-muted-foreground text-sm">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.tech_stack.map((tech, ti) => (<Badge key={ti} variant="outline" className="text-xs">{tech}</Badge>))}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeProject(index)}><X className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 5: Education */}
              {currentSection === 5 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold">Add Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="degree">Degree</Label>
                        <Input id="degree" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} placeholder="Bachelor of Science in..." />
                      </div>
                      <div>
                        <Label htmlFor="institution">Institution</Label>
                        <Input id="institution" value={newEducation.institution} onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })} placeholder="University name" />
                      </div>
                      <div>
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" value={newEducation.year} onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })} placeholder="2019-2023" />
                      </div>
                      <div>
                        <Label htmlFor="gpa">GPA (Optional)</Label>
                        <Input id="gpa" value={newEducation.gpa} onChange={(e) => setNewEducation({ ...newEducation, gpa: e.target.value })} placeholder="3.8/4.0" />
                      </div>
                    </div>
                    <Button onClick={addEducation} disabled={!newEducation.degree.trim() || !newEducation.institution.trim()}>Add Education</Button>
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
                        <Button variant="ghost" size="sm" onClick={() => removeEducation(index)}><X className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 6 (non-fresher): Achievements */}
              {!isFresher && currentSection === 6 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold">Add Achievement</h3>
                    <div>
                      <Label htmlFor="achievement_title">Title</Label>
                      <Input id="achievement_title" value={newAchievement.title} onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })} placeholder="Achievement title" />
                    </div>
                    <div>
                      <Label htmlFor="achievement_description">Description (Optional)</Label>
                      <Textarea id="achievement_description" value={newAchievement.description} onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })} placeholder="Describe your achievement" rows={2} />
                    </div>
                    <Button onClick={addAchievement} disabled={!newAchievement.title.trim()}>Add Achievement</Button>
                  </div>
                  {achievements.map((achievement, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{achievement.title}</h4>
                          {achievement.description && <p className="text-muted-foreground text-sm">{achievement.description}</p>}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeAchievement(index)}><X className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Theme Selection (last step) */}
              {currentSection === sections.length - 1 && (
                <div className="animate-fade-in space-y-6">
                  {/* Recommended Themes */}
                  {recommendedThemes.length > 0 && (
                    <Card className="p-4 border-primary/30 bg-primary/5">
                      <h3 className="font-semibold mb-3 text-primary">🎯 Recommended for You</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {recommendedThemes.map((rec) => (
                          <Card
                            key={rec.themeId}
                            className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                              selectedTheme === rec.themeId ? "ring-2 ring-primary" : ""
                            }`}
                            onClick={() => setSelectedTheme(rec.themeId)}
                          >
                            <p className="font-medium text-sm">{rec.label}</p>
                            <p className="text-xs text-muted-foreground">{rec.reason}</p>
                          </Card>
                        ))}
                      </div>
                    </Card>
                  )}
                  <ThemeSelection
                    selectedTheme={selectedTheme}
                    onThemeSelect={setSelectedTheme}
                    onContinue={savePortfolio}
                  />
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
            {currentSection < sections.length - 1 && currentSection !== 1 && (
              <Button
                onClick={() => setCurrentSection(currentSection + 1)}
                disabled={currentSection === 0 && !selectedRole}
              >
                Next
              </Button>
            )}
            {currentSection === 1 && (
              <Button onClick={() => setCurrentSection(2)}>
                Skip to Manual Entry
              </Button>
            )}
          </div>
        </div>
      </div>

      <SharePortfolioModal
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          navigate(`/portfolio-view/${createdPortfolioId}`);
        }}
        portfolioId={createdPortfolioId}
        portfolioName={createdPortfolioName}
      />
    </div>
  );
};

export default PortfolioSetup;
