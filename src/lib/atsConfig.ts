/**
 * ATS (Applicant Tracking System) configuration per job role.
 * Provides keywords, action verbs, section ordering, and professional summaries
 * to make portfolios optimized for ATS scanning.
 */

export interface ATSRoleConfig {
  /** ATS-friendly professional summary template */
  summary: string;
  /** Priority keywords ATS systems look for */
  keywords: string[];
  /** Action verbs for describing projects/experience */
  actionVerbs: string[];
  /** ATS-optimized section order */
  sectionOrder: string[];
  /** Section heading overrides for ATS clarity */
  sectionLabels: Record<string, string>;
}

export const atsRoleConfigs: Record<string, ATSRoleConfig> = {
  "frontend-developer": {
    summary:
      "Results-driven Frontend Developer with expertise in building responsive, accessible, and high-performance web applications using modern JavaScript frameworks.",
    keywords: [
      "React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS",
      "Next.js", "Redux", "REST API", "Git", "Responsive Design",
      "Web Accessibility", "Performance Optimization", "Agile",
    ],
    actionVerbs: [
      "Developed", "Implemented", "Designed", "Optimized", "Integrated",
      "Built", "Refactored", "Delivered", "Collaborated",
    ],
    sectionOrder: ["summary", "skills", "projects", "experience", "education", "certifications"],
    sectionLabels: {
      summary: "Professional Summary",
      skills: "Technical Skills",
      projects: "Projects",
      experience: "Experience",
      education: "Education",
      certifications: "Certifications & Achievements",
    },
  },
  "backend-developer": {
    summary:
      "Backend Developer skilled in designing scalable APIs, microservices, and database architectures that power high-traffic applications.",
    keywords: [
      "Node.js", "Python", "Java", "SQL", "PostgreSQL", "MongoDB",
      "REST API", "GraphQL", "Docker", "AWS", "CI/CD", "Microservices",
      "System Design", "Git", "Agile",
    ],
    actionVerbs: [
      "Engineered", "Architected", "Developed", "Optimized", "Deployed",
      "Automated", "Scaled", "Implemented", "Maintained",
    ],
    sectionOrder: ["summary", "skills", "projects", "experience", "education", "certifications"],
    sectionLabels: {
      summary: "Professional Summary",
      skills: "Technical Skills",
      projects: "Projects",
      experience: "Experience",
      education: "Education",
      certifications: "Certifications & Achievements",
    },
  },
  "fullstack-developer": {
    summary:
      "Full Stack Developer experienced in building end-to-end web applications, from database design to pixel-perfect user interfaces.",
    keywords: [
      "React", "Node.js", "TypeScript", "PostgreSQL", "MongoDB", "REST API",
      "GraphQL", "Docker", "AWS", "Git", "CI/CD", "Agile", "Full Stack",
    ],
    actionVerbs: [
      "Developed", "Architected", "Built", "Deployed", "Integrated",
      "Optimized", "Delivered", "Collaborated", "Maintained",
    ],
    sectionOrder: ["summary", "skills", "projects", "experience", "education", "certifications"],
    sectionLabels: {
      summary: "Professional Summary",
      skills: "Technical Skills",
      projects: "Projects",
      experience: "Experience",
      education: "Education",
      certifications: "Certifications & Achievements",
    },
  },
  "uiux-designer": {
    summary:
      "Creative UI/UX Designer with a strong portfolio of user-centered designs, wireframes, and prototypes that improve usability and drive engagement.",
    keywords: [
      "Figma", "Sketch", "Adobe XD", "Wireframing", "Prototyping",
      "User Research", "Design Systems", "Usability Testing", "Accessibility",
      "Interaction Design", "Visual Design", "Information Architecture",
    ],
    actionVerbs: [
      "Designed", "Created", "Prototyped", "Conducted", "Improved",
      "Collaborated", "Iterated", "Delivered", "Researched",
    ],
    sectionOrder: ["summary", "skills", "projects", "experience", "education", "certifications"],
    sectionLabels: {
      summary: "Professional Summary",
      skills: "Design Tools & Skills",
      projects: "Design Portfolio",
      experience: "Experience",
      education: "Education",
      certifications: "Certifications & Achievements",
    },
  },
  "mobile-developer": {
    summary:
      "Mobile Developer proficient in building native and cross-platform applications with a focus on performance, user experience, and clean architecture.",
    keywords: [
      "React Native", "Flutter", "Swift", "Kotlin", "iOS", "Android",
      "Mobile UI", "App Store", "Firebase", "REST API", "Git", "Agile",
    ],
    actionVerbs: [
      "Developed", "Published", "Optimized", "Designed", "Integrated",
      "Deployed", "Built", "Tested", "Delivered",
    ],
    sectionOrder: ["summary", "skills", "projects", "experience", "education", "certifications"],
    sectionLabels: {
      summary: "Professional Summary",
      skills: "Mobile Stack",
      projects: "Mobile Applications",
      experience: "Experience",
      education: "Education",
      certifications: "Certifications & Achievements",
    },
  },
  "data-analyst": {
    summary:
      "Detail-oriented Data Analyst skilled in transforming raw data into actionable insights using statistical analysis, visualization, and reporting tools.",
    keywords: [
      "Python", "SQL", "Excel", "Tableau", "Power BI", "Data Visualization",
      "Statistical Analysis", "ETL", "Data Cleaning", "Reporting", "R",
    ],
    actionVerbs: [
      "Analyzed", "Visualized", "Reported", "Identified", "Streamlined",
      "Automated", "Presented", "Extracted", "Interpreted",
    ],
    sectionOrder: ["summary", "skills", "projects", "experience", "education", "certifications"],
    sectionLabels: {
      summary: "Professional Summary",
      skills: "Analytics Tools & Skills",
      projects: "Data Projects",
      experience: "Experience",
      education: "Education",
      certifications: "Certifications & Achievements",
    },
  },
  "data-scientist": {
    summary:
      "Data Scientist with expertise in machine learning, statistical modeling, and data-driven decision making to solve complex business problems.",
    keywords: [
      "Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
      "Pandas", "NumPy", "SQL", "Data Modeling", "NLP", "Computer Vision",
      "Statistics", "Jupyter",
    ],
    actionVerbs: [
      "Developed", "Trained", "Analyzed", "Modeled", "Predicted",
      "Implemented", "Researched", "Published", "Optimized",
    ],
    sectionOrder: ["summary", "skills", "projects", "experience", "education", "certifications"],
    sectionLabels: {
      summary: "Professional Summary",
      skills: "ML & Data Stack",
      projects: "Research & ML Projects",
      experience: "Experience",
      education: "Education",
      certifications: "Certifications & Achievements",
    },
  },
  "devops-engineer": {
    summary:
      "DevOps Engineer experienced in building CI/CD pipelines, infrastructure automation, and container orchestration to accelerate software delivery.",
    keywords: [
      "Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Jenkins",
      "Linux", "Ansible", "Monitoring", "Git", "Infrastructure as Code",
    ],
    actionVerbs: [
      "Automated", "Deployed", "Configured", "Monitored", "Scaled",
      "Optimized", "Migrated", "Implemented", "Maintained",
    ],
    sectionOrder: ["summary", "skills", "projects", "experience", "education", "certifications"],
    sectionLabels: {
      summary: "Professional Summary",
      skills: "DevOps Toolchain",
      projects: "Infrastructure Projects",
      experience: "Experience",
      education: "Education",
      certifications: "Certifications & Achievements",
    },
  },
  "cloud-engineer": {
    summary:
      "Cloud Engineer with hands-on experience in designing, deploying, and managing cloud infrastructure on AWS, Azure, or GCP.",
    keywords: [
      "AWS", "Azure", "GCP", "Terraform", "CloudFormation", "Docker",
      "Kubernetes", "Serverless", "IAM", "VPC", "Cloud Security", "Linux",
    ],
    actionVerbs: [
      "Architected", "Deployed", "Migrated", "Automated", "Secured",
      "Optimized", "Managed", "Configured", "Scaled",
    ],
    sectionOrder: ["summary", "skills", "projects", "experience", "education", "certifications"],
    sectionLabels: {
      summary: "Professional Summary",
      skills: "Cloud Platforms & Tools",
      projects: "Cloud Solutions",
      experience: "Experience",
      education: "Education",
      certifications: "Certifications & Achievements",
    },
  },
  "cybersecurity-analyst": {
    summary:
      "Cybersecurity Analyst dedicated to identifying vulnerabilities, implementing security controls, and protecting organizational assets from cyber threats.",
    keywords: [
      "SIEM", "Penetration Testing", "Vulnerability Assessment", "Firewall",
      "IDS/IPS", "SOC", "Incident Response", "OWASP", "Nmap", "Wireshark",
      "CompTIA Security+", "CISSP",
    ],
    actionVerbs: [
      "Identified", "Assessed", "Remediated", "Monitored", "Investigated",
      "Implemented", "Documented", "Hardened", "Conducted",
    ],
    sectionOrder: ["summary", "skills", "certifications", "projects", "experience", "education"],
    sectionLabels: {
      summary: "Professional Summary",
      skills: "Security Tools & Certifications",
      projects: "Security Projects",
      experience: "Experience",
      education: "Education",
      certifications: "Certifications & Achievements",
    },
  },
  "software-tester": {
    summary:
      "Quality-focused Software Tester with experience in manual and automated testing, test planning, and defect tracking to ensure software reliability.",
    keywords: [
      "Selenium", "JIRA", "TestNG", "Cypress", "API Testing", "Regression Testing",
      "Test Plans", "Bug Tracking", "Agile", "CI/CD",
    ],
    actionVerbs: [
      "Tested", "Identified", "Reported", "Automated", "Validated",
      "Documented", "Executed", "Verified", "Collaborated",
    ],
    sectionOrder: ["summary", "skills", "projects", "experience", "education", "certifications"],
    sectionLabels: {
      summary: "Professional Summary",
      skills: "Testing Tools & Skills",
      projects: "QA Projects",
      experience: "Experience",
      education: "Education",
      certifications: "Certifications & Achievements",
    },
  },
  "aiml-engineer": {
    summary:
      "AI/ML Engineer with expertise in deep learning, neural networks, and deploying production-grade AI systems that solve real-world problems.",
    keywords: [
      "Python", "TensorFlow", "PyTorch", "Deep Learning", "NLP",
      "Computer Vision", "MLOps", "Docker", "AWS SageMaker", "Transformers",
      "Model Deployment",
    ],
    actionVerbs: [
      "Developed", "Trained", "Deployed", "Optimized", "Researched",
      "Implemented", "Fine-tuned", "Evaluated", "Scaled",
    ],
    sectionOrder: ["summary", "skills", "projects", "experience", "education", "certifications"],
    sectionLabels: {
      summary: "Professional Summary",
      skills: "AI/ML Stack",
      projects: "AI/ML Projects",
      experience: "Experience",
      education: "Education",
      certifications: "Certifications & Achievements",
    },
  },
  "graphic-designer": {
    summary:
      "Creative Graphic Designer with a strong eye for visual storytelling, branding, and creating compelling designs across print and digital media.",
    keywords: [
      "Adobe Photoshop", "Illustrator", "InDesign", "Figma", "Branding",
      "Typography", "Layout Design", "Print Design", "Digital Design",
    ],
    actionVerbs: [
      "Designed", "Created", "Produced", "Conceptualized", "Delivered",
      "Collaborated", "Illustrated", "Refined", "Branded",
    ],
    sectionOrder: ["summary", "skills", "projects", "experience", "education", "certifications"],
    sectionLabels: {
      summary: "Professional Summary",
      skills: "Creative Tools",
      projects: "Creative Works",
      experience: "Experience",
      education: "Education",
      certifications: "Certifications & Achievements",
    },
  },
  "digital-marketer": {
    summary:
      "Results-oriented Digital Marketer experienced in SEO, SEM, social media marketing, and data-driven campaigns that drive engagement and conversions.",
    keywords: [
      "SEO", "SEM", "Google Analytics", "Google Ads", "Social Media Marketing",
      "Content Marketing", "Email Marketing", "HubSpot", "A/B Testing",
      "Conversion Rate Optimization",
    ],
    actionVerbs: [
      "Managed", "Optimized", "Launched", "Analyzed", "Increased",
      "Created", "Targeted", "Reported", "Drove",
    ],
    sectionOrder: ["summary", "skills", "projects", "experience", "education", "certifications"],
    sectionLabels: {
      summary: "Professional Summary",
      skills: "Marketing Tools & Platforms",
      projects: "Marketing Campaigns",
      experience: "Experience",
      education: "Education",
      certifications: "Certifications & Achievements",
    },
  },
  "business-analyst": {
    summary:
      "Analytical Business Analyst skilled in requirements gathering, process mapping, and stakeholder management to deliver impactful business solutions.",
    keywords: [
      "Requirements Analysis", "JIRA", "Confluence", "SQL", "Tableau",
      "Process Mapping", "Stakeholder Management", "Agile", "Scrum",
      "Business Intelligence",
    ],
    actionVerbs: [
      "Analyzed", "Documented", "Facilitated", "Mapped", "Presented",
      "Improved", "Collaborated", "Delivered", "Streamlined",
    ],
    sectionOrder: ["summary", "skills", "projects", "experience", "education", "certifications"],
    sectionLabels: {
      summary: "Professional Summary",
      skills: "Business & Analytics Tools",
      projects: "Business Projects",
      experience: "Experience",
      education: "Education",
      certifications: "Certifications & Achievements",
    },
  },
  fresher: {
    summary:
      "Motivated and quick-learning recent graduate eager to apply academic knowledge and project experience to a professional environment.",
    keywords: [
      "Problem Solving", "Communication", "Teamwork", "Time Management",
      "Adaptability", "Quick Learner", "Project Management",
    ],
    actionVerbs: [
      "Developed", "Created", "Learned", "Collaborated", "Participated",
      "Built", "Presented", "Contributed", "Completed",
    ],
    sectionOrder: ["summary", "education", "skills", "projects", "certifications"],
    sectionLabels: {
      summary: "Career Objective",
      skills: "Skills & Technologies",
      projects: "Academic & Personal Projects",
      experience: "Internships & Experience",
      education: "Education",
      certifications: "Certifications & Achievements",
    },
  },
};

/** Fallback config for unknown roles */
export const defaultATSConfig: ATSRoleConfig = atsRoleConfigs["fresher"];

export const getATSConfig = (roleId: string): ATSRoleConfig =>
  atsRoleConfigs[roleId] || defaultATSConfig;
