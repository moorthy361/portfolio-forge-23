import { Badge } from "@/components/ui/badge";
import { getATSConfig } from "@/lib/atsConfig";
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from "lucide-react";

interface Profile {
  full_name: string;
  profession: string;
  bio: string;
  location: string;
  phone: string;
  email: string;
  linkedin_url: string;
  github_url?: string;
  website_url?: string;
  profile_image_url: string;
  job_role: string;
  is_fresher: boolean;
}

interface Skill { name: string; }
interface Project { title: string; description: string; tech_stack: string[]; project_url: string; }
interface Education { degree: string; institution: string; year: string; gpa: string; }
interface Achievement { title: string; description: string; }

interface ATSPortfolioViewProps {
  profile: Profile;
  skills: Skill[];
  technicalSkills: string[];
  softSkills: string[];
  projects: Project[];
  education: Education[];
  achievements: Achievement[];
}

const ATSPortfolioView = ({
  profile,
  skills,
  technicalSkills,
  softSkills,
  projects,
  education,
  achievements,
}: ATSPortfolioViewProps) => {
  const atsConfig = getATSConfig(profile.job_role || "fresher");

  // Merge all skills for display
  const allSkills = [
    ...technicalSkills,
    ...softSkills,
    ...skills.map(s => s.name),
  ].filter((v, i, a) => a.indexOf(v) === i);

  // Highlight matching ATS keywords
  const keywordSet = new Set(atsConfig.keywords.map(k => k.toLowerCase()));
  const isKeyword = (skill: string) => keywordSet.has(skill.toLowerCase());

  const sectionMap: Record<string, () => React.ReactNode> = {
    summary: () => (
      <section key="summary" className="mb-8">
        <h2 className="text-lg font-bold uppercase tracking-wide border-b-2 border-foreground pb-1 mb-3">
          {atsConfig.sectionLabels.summary}
        </h2>
        <p className="text-sm leading-relaxed text-foreground/80">
          {profile.bio || atsConfig.summary}
        </p>
      </section>
    ),
    skills: () =>
      allSkills.length > 0 ? (
        <section key="skills" className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-wide border-b-2 border-foreground pb-1 mb-3">
            {atsConfig.sectionLabels.skills}
          </h2>
          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill, i) => (
              <Badge
                key={i}
                variant={isKeyword(skill) ? "default" : "secondary"}
                className={`text-xs px-3 py-1 rounded-sm ${
                  isKeyword(skill)
                    ? "bg-foreground text-background font-semibold"
                    : "bg-muted text-foreground border border-border"
                }`}
              >
                {skill}
              </Badge>
            ))}
          </div>
          {/* Hidden ATS keywords for scanner pickup */}
          <div className="sr-only" aria-hidden="true">
            {atsConfig.keywords.join(", ")}
          </div>
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-wide border-b-2 border-foreground pb-1 mb-3">
            {atsConfig.sectionLabels.projects}
          </h2>
          <ul className="space-y-4">
            {projects.map((project, i) => (
              <li key={i}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-sm text-foreground">{project.title}</h3>
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary underline"
                    >
                      View Project
                    </a>
                  )}
                </div>
                {project.description && (
                  <p className="text-sm text-foreground/70 mt-1 leading-relaxed">
                    • {project.description}
                  </p>
                )}
                {project.tech_stack?.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Technologies: {project.tech_stack.join(", ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null,
    experience: () => null, // No separate experience table yet — placeholder
    education: () =>
      education.length > 0 ? (
        <section key="education" className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-wide border-b-2 border-foreground pb-1 mb-3">
            {atsConfig.sectionLabels.education}
          </h2>
          <ul className="space-y-3">
            {education.map((edu, i) => (
              <li key={i}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-sm text-foreground">{edu.degree}</h3>
                  {edu.year && <span className="text-xs text-muted-foreground">{edu.year}</span>}
                </div>
                <p className="text-sm text-foreground/70">{edu.institution}</p>
                {edu.gpa && <p className="text-xs text-muted-foreground">GPA: {edu.gpa}</p>}
              </li>
            ))}
          </ul>
        </section>
      ) : null,
    certifications: () =>
      achievements.length > 0 ? (
        <section key="certifications" className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-wide border-b-2 border-foreground pb-1 mb-3">
            {atsConfig.sectionLabels.certifications}
          </h2>
          <ul className="list-disc list-inside space-y-1">
            {achievements.map((a, i) => (
              <li key={i} className="text-sm text-foreground/80">
                <span className="font-medium">{a.title}</span>
                {a.description && <span> — {a.description}</span>}
              </li>
            ))}
          </ul>
        </section>
      ) : null,
  };

  return (
    <div className="min-h-screen bg-background text-foreground print:bg-white print:text-black">
      <div className="max-w-3xl mx-auto px-6 py-10 print:px-8 print:py-6">
        {/* Header — Name & Contact */}
        <header className="text-center mb-8 border-b-2 border-foreground pb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
            {profile.full_name}
          </h1>
          <p className="text-base font-medium text-foreground/70 mb-3">
            {profile.profession || atsConfig.sectionLabels.summary}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-foreground/60">
            {profile.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" /> {profile.email}
              </span>
            )}
            {profile.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> {profile.phone}
              </span>
            )}
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {profile.location}
              </span>
            )}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary underline"
              >
                <Linkedin className="h-3 w-3" /> LinkedIn
              </a>
            )}
            {(profile as any).github_url && (
              <a
                href={(profile as any).github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary underline"
              >
                <Github className="h-3 w-3" /> GitHub
              </a>
            )}
          </div>
        </header>

        {/* Sections in ATS order */}
        {atsConfig.sectionOrder.map(section => sectionMap[section]?.())}
      </div>
    </div>
  );
};

export default ATSPortfolioView;
