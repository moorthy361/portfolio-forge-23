import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  fullName: string;
  profilePhoto: File | null;
  bio: string;
  education: Array<{ degree: string; institution: string; year: string }>;
  skills: string[];
  projects: Array<{ title: string; description: string; link: string }>;
  achievements: string[];
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    website: string;
  };
}

const CreatePortfolio = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    profilePhoto: null,
    bio: '',
    education: [{ degree: '', institution: '', year: '' }],
    skills: [],
    projects: [{ title: '', description: '', link: '' }],
    achievements: [''],
    contact: {
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      website: '',
    },
  });

  const [newSkill, setNewSkill] = useState('');

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profilePhoto: file });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove),
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: '', institution: '', year: '' }],
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updatedEducation = formData.education.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    );
    setFormData({ ...formData, education: updatedEducation });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { title: '', description: '', link: '' }],
    });
  };

  const updateProject = (index: number, field: string, value: string) => {
    const updatedProjects = formData.projects.map((project, i) =>
      i === index ? { ...project, [field]: value } : project
    );
    setFormData({ ...formData, projects: updatedProjects });
  };

  const addAchievement = () => {
    setFormData({
      ...formData,
      achievements: [...formData.achievements, ''],
    });
  };

  const updateAchievement = (index: number, value: string) => {
    const updatedAchievements = formData.achievements.map((achievement, i) =>
      i === index ? value : achievement
    );
    setFormData({ ...formData, achievements: updatedAchievements });
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.fullName || !formData.bio || !formData.contact.email) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Store form data in localStorage for the portfolio page
    localStorage.setItem('portfolioData', JSON.stringify(formData));
    
    toast({
      title: "Portfolio created successfully!",
      description: "Redirecting to your new portfolio...",
    });

    // Navigate to the generated portfolio
    navigate('/portfolio');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="text-base font-medium">
                Full Name *
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label className="text-base font-medium">Profile Photo</Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="profile-photo"
                />
                <label htmlFor="profile-photo" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formData.profilePhoto 
                      ? formData.profilePhoto.name 
                      : "Click to upload or drag and drop"}
                  </p>
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="bio" className="text-base font-medium">
                Short Bio / About Me *
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                className="mt-2 min-h-[120px]"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">Education</Label>
              <Button type="button" onClick={addEducation} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>
            
            {formData.education.map((edu, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`degree-${index}`}>Degree</Label>
                    <Input
                      id={`degree-${index}`}
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      placeholder="e.g., Bachelor of Science"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`institution-${index}`}>Institution</Label>
                    <Input
                      id={`institution-${index}`}
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      placeholder="e.g., University of Technology"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`year-${index}`}>Year</Label>
                    <Input
                      id={`year-${index}`}
                      value={edu.year}
                      onChange={(e) => updateEducation(index, 'year', e.target.value)}
                      placeholder="e.g., 2023"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Label className="text-base font-medium">Skills</Label>
            
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button type="button" onClick={addSkill} variant="outline">
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="pr-2">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">Projects</Label>
              <Button type="button" onClick={addProject} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
            
            {formData.projects.map((project, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`project-title-${index}`}>Project Title</Label>
                    <Input
                      id={`project-title-${index}`}
                      value={project.title}
                      onChange={(e) => updateProject(index, 'title', e.target.value)}
                      placeholder="e.g., E-commerce Website"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`project-description-${index}`}>Description</Label>
                    <Textarea
                      id={`project-description-${index}`}
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      placeholder="Describe your project..."
                    />
                  </div>
                  <div>
                    <Label htmlFor={`project-link-${index}`}>Project Link</Label>
                    <Input
                      id={`project-link-${index}`}
                      value={project.link}
                      onChange={(e) => updateProject(index, 'link', e.target.value)}
                      placeholder="https://github.com/yourproject"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">Achievements / Certifications</Label>
              <Button type="button" onClick={addAchievement} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Achievement
              </Button>
            </div>
            
            {formData.achievements.map((achievement, index) => (
              <div key={index}>
                <Input
                  value={achievement}
                  onChange={(e) => updateAchievement(index, e.target.value)}
                  placeholder="e.g., AWS Certified Developer"
                />
              </div>
            ))}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <Label className="text-base font-medium">Contact Information</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value }
                  })}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.contact.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, phone: e.target.value }
                  })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.contact.linkedin}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, linkedin: e.target.value }
                  })}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={formData.contact.github}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, github: e.target.value }
                  })}
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="website">Personal Website</Label>
                <Input
                  id="website"
                  value={formData.contact.website}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, website: e.target.value }
                  })}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center mb-2">Create Your Portfolio</h1>
            <p className="text-muted-foreground text-center">
              Step {currentStep} of {totalSteps}
            </p>
            
            {/* Progress bar */}
            <div className="w-full bg-secondary rounded-full h-2 mt-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Basic Information"}
                {currentStep === 2 && "Education"}
                {currentStep === 3 && "Skills"}
                {currentStep === 4 && "Projects"}
                {currentStep === 5 && "Achievements"}
                {currentStep === 6 && "Contact Information"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderStep()}
              
              <div className="flex justify-between mt-8">
                <Button
                  onClick={handlePrev}
                  variant="outline"
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <Button onClick={handleNext}>
                  {currentStep === totalSteps ? 'Generate Portfolio' : 'Next'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatePortfolio;