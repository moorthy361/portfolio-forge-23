import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Theme {
  id: string;
  name: string;
  description: string;
  preview: {
    bg: string;
    primary: string;
    secondary: string;
    accent: string;
  };
}

const themes: Theme[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Timeless elegance with professional blue tones",
    preview: {
      bg: "bg-gradient-to-br from-blue-50 to-indigo-100",
      primary: "bg-blue-600",
      secondary: "bg-indigo-500",
      accent: "bg-blue-400",
    },
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary with purple accents",
    preview: {
      bg: "bg-gradient-to-br from-purple-50 to-pink-100",
      primary: "bg-purple-600",
      secondary: "bg-pink-500",
      accent: "bg-purple-400",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and focused with neutral tones",
    preview: {
      bg: "bg-gradient-to-br from-gray-50 to-slate-100",
      primary: "bg-slate-700",
      secondary: "bg-gray-600",
      accent: "bg-slate-500",
    },
  },
  {
    id: "dark",
    name: "Dark",
    description: "Bold and dramatic with dark backgrounds",
    preview: {
      bg: "bg-gradient-to-br from-gray-900 to-slate-800",
      primary: "bg-cyan-500",
      secondary: "bg-blue-400",
      accent: "bg-cyan-300",
    },
  },
  {
    id: "vibrant",
    name: "Vibrant",
    description: "Energetic and colorful with bright accents",
    preview: {
      bg: "bg-gradient-to-br from-orange-50 to-red-100",
      primary: "bg-orange-600",
      secondary: "bg-red-500",
      accent: "bg-yellow-500",
    },
  },
];

interface ThemeSelectionProps {
  selectedTheme: string;
  onThemeSelect: (themeId: string) => void;
  onContinue: () => void;
}

export const ThemeSelection = ({ selectedTheme, onThemeSelect, onContinue }: ThemeSelectionProps) => {
  const [previewTheme, setPreviewTheme] = useState(selectedTheme);

  const currentTheme = themes.find(t => t.id === previewTheme) || themes[0];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Your Portfolio Theme</h2>
        <p className="text-muted-foreground">Select a theme that best represents your style</p>
      </div>

      {/* Theme Preview */}
      <Card className="p-8 overflow-hidden">
        <div className={`${currentTheme.preview.bg} rounded-lg p-8 space-y-6 transition-all duration-300`}>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${currentTheme.preview.primary} rounded-full`} />
              <div className="space-y-2 flex-1">
                <div className={`h-4 ${currentTheme.preview.primary} rounded w-1/2`} />
                <div className={`h-3 ${currentTheme.preview.secondary} rounded w-1/3`} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className={`${currentTheme.preview.primary} h-24 rounded-lg`} />
            <div className={`${currentTheme.preview.secondary} h-24 rounded-lg`} />
            <div className={`${currentTheme.preview.accent} h-24 rounded-lg`} />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-xl mb-1">{currentTheme.name} Theme</h3>
            <p className="text-sm opacity-80">{currentTheme.description}</p>
          </div>
        </div>
      </Card>

      {/* Theme Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Card
            key={theme.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
              selectedTheme === theme.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onThemeSelect(theme.id)}
            onMouseEnter={() => setPreviewTheme(theme.id)}
            onMouseLeave={() => setPreviewTheme(selectedTheme)}
          >
            <div className="space-y-3">
              <div className={`${theme.preview.bg} h-32 rounded-lg relative overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center gap-2">
                  <div className={`w-8 h-8 ${theme.preview.primary} rounded-full`} />
                  <div className={`w-8 h-8 ${theme.preview.secondary} rounded-full`} />
                  <div className={`w-8 h-8 ${theme.preview.accent} rounded-full`} />
                </div>
                {selectedTheme === theme.id && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold">{theme.name}</h4>
                <p className="text-xs text-muted-foreground">{theme.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button onClick={onContinue} size="lg" className="px-8">
          Continue with {themes.find(t => t.id === selectedTheme)?.name} Theme
        </Button>
      </div>
    </div>
  );
};
