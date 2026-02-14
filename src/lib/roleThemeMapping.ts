export interface JobRole {
  id: string;
  label: string;
  icon: string; // lucide icon name
  category: string;
}

export const jobRoles: JobRole[] = [
  { id: "frontend-developer", label: "Frontend Developer", icon: "Monitor", category: "Development" },
  { id: "backend-developer", label: "Backend Developer", icon: "Server", category: "Development" },
  { id: "fullstack-developer", label: "Full Stack Developer", icon: "Layers", category: "Development" },
  { id: "uiux-designer", label: "UI/UX Designer", icon: "Palette", category: "Design" },
  { id: "mobile-developer", label: "Mobile App Developer", icon: "Smartphone", category: "Development" },
  { id: "data-analyst", label: "Data Analyst", icon: "BarChart3", category: "Data" },
  { id: "data-scientist", label: "Data Scientist", icon: "BrainCircuit", category: "Data" },
  { id: "devops-engineer", label: "DevOps Engineer", icon: "Container", category: "Infrastructure" },
  { id: "cloud-engineer", label: "Cloud Engineer", icon: "Cloud", category: "Infrastructure" },
  { id: "cybersecurity-analyst", label: "Cybersecurity Analyst", icon: "Shield", category: "Security" },
  { id: "software-tester", label: "Software Tester", icon: "Bug", category: "Development" },
  { id: "aiml-engineer", label: "AI/ML Engineer", icon: "Bot", category: "Data" },
  { id: "graphic-designer", label: "Graphic Designer", icon: "PenTool", category: "Design" },
  { id: "digital-marketer", label: "Digital Marketer", icon: "Megaphone", category: "Marketing" },
  { id: "business-analyst", label: "Business Analyst", icon: "Briefcase", category: "Business" },
  { id: "fresher", label: "Fresher (No Experience)", icon: "GraduationCap", category: "Entry Level" },
];

export interface RoleThemeRecommendation {
  themeId: string;
  label: string;
  reason: string;
}

export const roleThemeMap: Record<string, RoleThemeRecommendation[]> = {
  "frontend-developer": [
    { themeId: "modern", label: "Modern", reason: "Showcases UI/UX sensibility" },
    { themeId: "dark", label: "Dark", reason: "Trendy developer aesthetic" },
    { themeId: "vibrant", label: "Vibrant", reason: "Highlights creativity" },
  ],
  "backend-developer": [
    { themeId: "dark", label: "Dark", reason: "Terminal-inspired developer theme" },
    { themeId: "minimal", label: "Minimal", reason: "Code-focused clean layout" },
    { themeId: "classic", label: "Classic", reason: "Professional and structured" },
  ],
  "fullstack-developer": [
    { themeId: "modern", label: "Modern", reason: "Versatile and balanced" },
    { themeId: "dark", label: "Dark", reason: "Developer-friendly aesthetic" },
    { themeId: "classic", label: "Classic", reason: "Professional showcase" },
  ],
  "uiux-designer": [
    { themeId: "vibrant", label: "Vibrant", reason: "Creative and bold" },
    { themeId: "modern", label: "Modern", reason: "Clean design showcase" },
    { themeId: "minimal", label: "Minimal", reason: "Focus on content" },
  ],
  "mobile-developer": [
    { themeId: "modern", label: "Modern", reason: "App-inspired design" },
    { themeId: "dark", label: "Dark", reason: "Sleek mobile aesthetic" },
    { themeId: "vibrant", label: "Vibrant", reason: "App store vibe" },
  ],
  "data-analyst": [
    { themeId: "classic", label: "Classic", reason: "Professional data presentation" },
    { themeId: "minimal", label: "Minimal", reason: "Clean chart-friendly layout" },
    { themeId: "dark", label: "Dark", reason: "Analytics dashboard feel" },
  ],
  "data-scientist": [
    { themeId: "dark", label: "Dark", reason: "Research-style presentation" },
    { themeId: "classic", label: "Classic", reason: "Academic professionalism" },
    { themeId: "minimal", label: "Minimal", reason: "Clean data focus" },
  ],
  "devops-engineer": [
    { themeId: "dark", label: "Dark", reason: "Infrastructure dashboard feel" },
    { themeId: "minimal", label: "Minimal", reason: "Clean and efficient" },
    { themeId: "classic", label: "Classic", reason: "Professional and structured" },
  ],
  "cloud-engineer": [
    { themeId: "modern", label: "Modern", reason: "Cloud-inspired design" },
    { themeId: "dark", label: "Dark", reason: "Tech-forward aesthetic" },
    { themeId: "classic", label: "Classic", reason: "Enterprise professional" },
  ],
  "cybersecurity-analyst": [
    { themeId: "dark", label: "Dark", reason: "Security-focused aesthetic" },
    { themeId: "minimal", label: "Minimal", reason: "Clean and precise" },
    { themeId: "classic", label: "Classic", reason: "Trust-building design" },
  ],
  "software-tester": [
    { themeId: "classic", label: "Classic", reason: "Structured and reliable" },
    { themeId: "minimal", label: "Minimal", reason: "Focused and clean" },
    { themeId: "modern", label: "Modern", reason: "QA-professional look" },
  ],
  "aiml-engineer": [
    { themeId: "dark", label: "Dark", reason: "AI-inspired futuristic feel" },
    { themeId: "modern", label: "Modern", reason: "Tech innovation look" },
    { themeId: "vibrant", label: "Vibrant", reason: "Creative ML showcase" },
  ],
  "graphic-designer": [
    { themeId: "vibrant", label: "Vibrant", reason: "Bold creative showcase" },
    { themeId: "modern", label: "Modern", reason: "Design portfolio style" },
    { themeId: "minimal", label: "Minimal", reason: "Let work speak for itself" },
  ],
  "digital-marketer": [
    { themeId: "vibrant", label: "Vibrant", reason: "Marketing energy" },
    { themeId: "modern", label: "Modern", reason: "Brand-savvy look" },
    { themeId: "classic", label: "Classic", reason: "Corporate professional" },
  ],
  "business-analyst": [
    { themeId: "classic", label: "Classic", reason: "Corporate professional" },
    { themeId: "minimal", label: "Minimal", reason: "Data-driven clarity" },
    { themeId: "modern", label: "Modern", reason: "Contemporary business" },
  ],
  "fresher": [
    { themeId: "minimal", label: "Minimal", reason: "Clean and academic" },
    { themeId: "classic", label: "Classic", reason: "Professional first impression" },
    { themeId: "modern", label: "Modern", reason: "Fresh and contemporary" },
  ],
};

// Smart theme suggestion based on skills
export function suggestThemeFromSkills(skills: string[]): RoleThemeRecommendation[] {
  const skillsLower = skills.map(s => s.toLowerCase());

  const frontendKeywords = ["react", "vue", "angular", "tailwind", "css", "html", "javascript", "typescript", "next.js", "svelte"];
  const backendKeywords = ["node", "python", "java", "spring", "django", "express", "go", "rust", "php", "ruby"];
  const dataKeywords = ["python", "ml", "machine learning", "tensorflow", "pytorch", "pandas", "numpy", "r", "statistics", "data"];
  const devopsKeywords = ["aws", "docker", "kubernetes", "terraform", "ci/cd", "jenkins", "azure", "gcp", "linux"];
  const designKeywords = ["figma", "sketch", "photoshop", "illustrator", "ui", "ux", "design", "adobe"];

  const scores: Record<string, number> = {
    frontend: 0, backend: 0, data: 0, devops: 0, design: 0
  };

  for (const skill of skillsLower) {
    if (frontendKeywords.some(k => skill.includes(k))) scores.frontend++;
    if (backendKeywords.some(k => skill.includes(k))) scores.backend++;
    if (dataKeywords.some(k => skill.includes(k))) scores.data++;
    if (devopsKeywords.some(k => skill.includes(k))) scores.devops++;
    if (designKeywords.some(k => skill.includes(k))) scores.design++;
  }

  const maxCategory = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

  if (maxCategory[1] === 0) {
    return roleThemeMap["fresher"];
  }

  const categoryToRole: Record<string, string> = {
    frontend: "frontend-developer",
    backend: "backend-developer",
    data: "data-scientist",
    devops: "devops-engineer",
    design: "uiux-designer",
  };

  return roleThemeMap[categoryToRole[maxCategory[0]]] || roleThemeMap["fresher"];
}
