// Testing Mode Configuration
// Set TEST_MODE to true to enable mock data and debug logging
// Set to false for production

const isDev = import.meta.env.DEV;

export const TEST_MODE = isDev && false; // Set to true to enable testing mode

// Debug logger - only logs in development
export const debugLog = (...args: any[]) => {
  if (isDev) {
    console.log("[Portfolio Debug]", ...args);
  }
};

// Mock resume data for testing without hitting the edge function
export const MOCK_RESUME_DATA = {
  full_name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 555-123-4567",
  bio: "Passionate full-stack developer with 3+ years of experience building scalable web applications. Skilled in React, Node.js, and cloud technologies.",
  profession: "Full Stack Developer",
  location: "San Francisco, CA",
  linkedin_url: "https://linkedin.com/in/alexjohnson",
  skills: [
    "React", "TypeScript", "Node.js", "Python", "PostgreSQL",
    "Docker", "AWS", "Git",
    "Communication", "Teamwork", "Problem Solving", "Leadership"
  ],
  education: [
    { degree: "B.S. Computer Science", institution: "Stanford University", year: "2021", gpa: "3.8" }
  ],
  experience: [
    { title: "Full Stack Developer at TechCorp", description: "Built and maintained customer-facing web applications using React and Node.js" },
    { title: "Software Engineering Intern at StartupXYZ", description: "Developed REST APIs and integrated third-party services" }
  ],
  projects: [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce app with payment integration and real-time inventory",
      tech_stack: ["React", "Node.js", "PostgreSQL", "Stripe"],
      project_url: "https://github.com/alex/ecommerce"
    },
    {
      title: "AI Chat Assistant",
      description: "Conversational AI chatbot using GPT APIs with custom training data",
      tech_stack: ["Python", "FastAPI", "OpenAI", "Redis"],
      project_url: "https://github.com/alex/chatbot"
    }
  ]
};

// Validation helpers
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePortfolioData = (data: {
  full_name: string;
  job_role: string;
  technicalSkills: string[];
  userId?: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!data.full_name?.trim()) {
    errors.push("Name is required");
  }

  if (!data.job_role) {
    errors.push("Job role must be selected");
  }

  if (!data.technicalSkills || data.technicalSkills.length === 0) {
    errors.push("At least 1 technical skill is required");
  }

  if (!data.userId) {
    errors.push("User must be authenticated");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
