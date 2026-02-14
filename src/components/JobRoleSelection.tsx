import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Monitor, Server, Layers, Palette, Smartphone, BarChart3, BrainCircuit, Cloud, Shield, Bug, Bot, PenTool, Megaphone, Briefcase, GraduationCap } from "lucide-react";
import { jobRoles } from "@/lib/roleThemeMapping";

const iconMap: Record<string, React.ReactNode> = {
  Monitor: <Monitor className="h-6 w-6" />,
  Server: <Server className="h-6 w-6" />,
  Layers: <Layers className="h-6 w-6" />,
  Palette: <Palette className="h-6 w-6" />,
  Smartphone: <Smartphone className="h-6 w-6" />,
  BarChart3: <BarChart3 className="h-6 w-6" />,
  BrainCircuit: <BrainCircuit className="h-6 w-6" />,
  Container: <Server className="h-6 w-6" />,
  Cloud: <Cloud className="h-6 w-6" />,
  Shield: <Shield className="h-6 w-6" />,
  Bug: <Bug className="h-6 w-6" />,
  Bot: <Bot className="h-6 w-6" />,
  PenTool: <PenTool className="h-6 w-6" />,
  Megaphone: <Megaphone className="h-6 w-6" />,
  Briefcase: <Briefcase className="h-6 w-6" />,
  GraduationCap: <GraduationCap className="h-6 w-6" />,
};

interface JobRoleSelectionProps {
  selectedRole: string;
  onRoleSelect: (roleId: string) => void;
}

export const JobRoleSelection = ({ selectedRole, onRoleSelect }: JobRoleSelectionProps) => {
  const categories = [...new Set(jobRoles.map(r => r.category))];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Select Your Job Role</h2>
        <p className="text-muted-foreground">Choose the role that best describes you — this will personalize your portfolio</p>
      </div>

      {categories.map(category => (
        <div key={category} className="space-y-3">
          <Badge variant="outline" className="text-xs">{category}</Badge>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {jobRoles.filter(r => r.category === category).map(role => (
              <Card
                key={role.id}
                className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                  selectedRole === role.id 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : "hover:border-primary/50"
                }`}
                onClick={() => onRoleSelect(role.id)}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className={`p-2 rounded-lg ${selectedRole === role.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    {iconMap[role.icon] || <Monitor className="h-6 w-6" />}
                  </div>
                  <span className="text-sm font-medium leading-tight">{role.label}</span>
                  {selectedRole === role.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
