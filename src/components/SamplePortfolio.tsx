import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  ExternalLink,
  Download,
  GraduationCap,
  Briefcase,
  Award,
  Code
} from "lucide-react";
import sampleProfile from "@/assets/sample-profile.jpg";

const SamplePortfolio = () => {
  const skills = [
    "JavaScript", "React", "Node.js", "Python", "TypeScript", 
    "AWS", "Docker", "MongoDB", "PostgreSQL", "Git"
  ];

  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with React frontend and Node.js backend",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "#"
    },
    {
      title: "Task Management App",
      description: "Collaborative task management tool with real-time updates",
      tech: ["React", "Firebase", "TypeScript", "Material-UI"],
      link: "#"
    },
    {
      title: "Weather Dashboard",
      description: "Interactive weather dashboard with data visualization",
      tech: ["Vue.js", "D3.js", "OpenWeather API", "Chart.js"],
      link: "#"
    }
  ];

  const education = [
    {
      degree: "Bachelor of Science in Computer Science",
      school: "Tech University",
      year: "2019-2023",
      gpa: "3.8/4.0"
    }
  ];

  const achievements = [
    "Winner of HackTech 2023 - Best Innovation Award",
    "Google Developer Student Club Lead (2022-2023)",
    "AWS Certified Solutions Architect Associate",
    "Published research paper on machine learning applications"
  ];

  return (
    <section id="examples" className="py-20 section-gradient">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Here's an example of what your generated portfolio could look like. 
            This is automatically created from a simple form - no design skills required!
          </p>
        </div>

        {/* Portfolio Preview */}
        <div className="max-w-6xl mx-auto">
          <div className="card-elevated p-8 md:p-12 animate-slide-up">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
              <div className="relative">
                <img 
                  src={sampleProfile} 
                  alt="Profile" 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary/20"
                />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-success rounded-full border-2 border-background"></div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Alex Johnson
                </h1>
                <p className="text-xl text-primary font-semibold mb-4">
                  Full-Stack Developer & UI/UX Designer
                </p>
                <p className="text-muted-foreground mb-6 max-w-2xl">
                  Passionate developer with 3+ years of experience creating beautiful, 
                  functional web applications. I love turning complex problems into 
                  simple, elegant solutions that users enjoy.
                </p>
                
                {/* Contact Info */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>alex.johnson@email.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>San Francisco, CA</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center md:justify-start gap-4">
                  <Button variant="outline" size="sm">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                  <Button className="btn-hero">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                {education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4">
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-primary">{edu.school}</p>
                    <div className="flex justify-between text-muted-foreground text-sm">
                      <span>{edu.year}</span>
                      <span>GPA: {edu.gpa}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Projects Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Featured Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {projects.map((project, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-foreground">{project.title}</h3>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-muted-foreground mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Achievements & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Create Your Own?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of professionals who have already created their stunning portfolios
            </p>
            <Button size="lg" className="btn-hero">
              Start Building Your Portfolio
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SamplePortfolio;