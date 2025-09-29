import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  Globe, 
  GraduationCap, 
  Award,
  ExternalLink,
  Download,
  Edit,
  User
} from 'lucide-react';

interface PortfolioData {
  username?: string;
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
  createdAt?: string;
}

const Portfolio = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const [isOwnPortfolio, setIsOwnPortfolio] = useState(false);

  useEffect(() => {
    let data = null;
    
    if (username) {
      // Load specific portfolio by username
      const portfolios = JSON.parse(localStorage.getItem('portfolios') || '{}');
      data = portfolios[username];
      
      // Check if this is the current user's portfolio
      const currentPortfolio = localStorage.getItem('portfolioData');
      if (currentPortfolio) {
        const currentData = JSON.parse(currentPortfolio);
        setIsOwnPortfolio(currentData.username === username);
      }
    } else {
      // Load current user's portfolio
      const storedData = localStorage.getItem('portfolioData');
      if (storedData) {
        data = JSON.parse(storedData);
        setIsOwnPortfolio(true);
      }
    }

    if (data) {
      setPortfolioData(data);
      
      // Convert profile photo to URL if it exists and is a valid File/Blob
      if (data.profilePhoto && data.profilePhoto instanceof File) {
        const url = URL.createObjectURL(data.profilePhoto);
        setProfileImageUrl(url);
        
        // Cleanup URL when component unmounts
        return () => URL.revokeObjectURL(url);
      }
    } else if (!username) {
      // Only redirect if no username provided and no data found
      navigate('/create-portfolio');
    }
  }, [navigate, username]);

  const handleEdit = () => {
    navigate('/create-portfolio');
  };

  const handleDownload = () => {
    // Simple implementation - in a real app, you'd generate a PDF
    window.print();
  };

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {username ? "Portfolio not found" : "Loading your portfolio..."}
          </h2>
          <p className="text-muted-foreground">
            {username 
              ? "This portfolio doesn't exist or has been removed." 
              : "If this takes too long, please create a new portfolio."
            }
          </p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Action buttons */}
        <div className="flex justify-center gap-4 mb-8">
          {isOwnPortfolio && (
            <>
              <Button onClick={handleEdit} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Portfolio
              </Button>
              <Button onClick={handleDownload} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </>
          )}
          {username && (
            <Button 
              onClick={() => {
                const portfolioUrl = `${window.location.origin}/portfolio/${username}`;
                navigator.clipboard.writeText(portfolioUrl);
                // You could add a toast notification here
              }} 
              variant="outline"
            >
              Copy Share Link
            </Button>
          )}
          <Button onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {profileImageUrl ? (
                    <img 
                      src={profileImageUrl} 
                      alt={portfolioData.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl font-bold mb-4">{portfolioData.fullName}</h1>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {portfolioData.bio}
                  </p>
                  
                  {/* Contact Links */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    {portfolioData.contact.email && (
                      <a 
                        href={`mailto:${portfolioData.contact.email}`}
                        className="flex items-center gap-2 text-primary hover:text-primary/80"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </a>
                    )}
                    {portfolioData.contact.phone && (
                      <a 
                        href={`tel:${portfolioData.contact.phone}`}
                        className="flex items-center gap-2 text-primary hover:text-primary/80"
                      >
                        <Phone className="h-4 w-4" />
                        Phone
                      </a>
                    )}
                    {portfolioData.contact.linkedin && (
                      <a 
                        href={portfolioData.contact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:text-primary/80"
                      >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </a>
                    )}
                    {portfolioData.contact.github && (
                      <a 
                        href={portfolioData.contact.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:text-primary/80"
                      >
                        <Github className="h-4 w-4" />
                        GitHub
                      </a>
                    )}
                    {portfolioData.contact.website && (
                      <a 
                        href={portfolioData.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:text-primary/80"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Section */}
          {portfolioData.skills.length > 0 && (
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Education Section */}
          {portfolioData.education.some(edu => edu.degree || edu.institution) && (
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData.education
                    .filter(edu => edu.degree || edu.institution)
                    .map((edu, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-muted-foreground">{edu.institution}</p>
                      {edu.year && <p className="text-sm text-muted-foreground">{edu.year}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Projects Section */}
          {portfolioData.projects.some(project => project.title) && (
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {portfolioData.projects
                    .filter(project => project.title)
                    .map((project, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{project.title}</h3>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-muted-foreground">{project.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Achievements Section */}
          {portfolioData.achievements.some(achievement => achievement.trim()) && (
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {portfolioData.achievements
                    .filter(achievement => achievement.trim())
                    .map((achievement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Award className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;