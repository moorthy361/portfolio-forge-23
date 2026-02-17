// Design Variant Generator - creates unique random visual configurations per portfolio

export interface DesignVariant {
  layout: "sidebar" | "top-header" | "split" | "card-stack";
  colorAccent: "neon" | "pastel" | "dark-pro" | "gradient-tech" | "aurora" | "ember";
  animationStyle: "fade" | "slide" | "scale" | "blur-reveal";
  backgroundStyle: "gradient" | "mesh" | "grid" | "glass" | "aurora" | "minimal";
  typographyWeight: "light" | "regular" | "bold";
}

const layoutVariants: DesignVariant["layout"][] = ["sidebar", "top-header", "split", "card-stack"];
const colorAccents: DesignVariant["colorAccent"][] = ["neon", "pastel", "dark-pro", "gradient-tech", "aurora", "ember"];
const animationStyles: DesignVariant["animationStyle"][] = ["fade", "slide", "scale", "blur-reveal"];
const backgroundStyles: DesignVariant["backgroundStyle"][] = ["gradient", "mesh", "grid", "glass", "aurora", "minimal"];
const typographyWeights: DesignVariant["typographyWeight"][] = ["light", "regular", "bold"];

const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateDesignVariant = (): DesignVariant => ({
  layout: randomFrom(layoutVariants),
  colorAccent: randomFrom(colorAccents),
  animationStyle: randomFrom(animationStyles),
  backgroundStyle: randomFrom(backgroundStyles),
  typographyWeight: randomFrom(typographyWeights),
});

// Color accent CSS mappings
export const colorAccentStyles: Record<DesignVariant["colorAccent"], { primary: string; glow: string; gradient: string }> = {
  neon: {
    primary: "text-cyan-400",
    glow: "shadow-[0_0_40px_rgba(34,211,238,0.4)]",
    gradient: "from-cyan-400 via-blue-500 to-purple-600",
  },
  pastel: {
    primary: "text-rose-300",
    glow: "shadow-[0_0_30px_rgba(251,207,232,0.3)]",
    gradient: "from-rose-300 via-pink-300 to-violet-300",
  },
  "dark-pro": {
    primary: "text-emerald-400",
    glow: "shadow-[0_0_30px_rgba(52,211,153,0.3)]",
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
  },
  "gradient-tech": {
    primary: "text-violet-400",
    glow: "shadow-[0_0_35px_rgba(167,139,250,0.35)]",
    gradient: "from-violet-400 via-purple-500 to-fuchsia-600",
  },
  aurora: {
    primary: "text-green-300",
    glow: "shadow-[0_0_40px_rgba(134,239,172,0.3)]",
    gradient: "from-green-300 via-teal-400 to-blue-500",
  },
  ember: {
    primary: "text-amber-400",
    glow: "shadow-[0_0_35px_rgba(251,191,36,0.3)]",
    gradient: "from-amber-400 via-orange-500 to-red-600",
  },
};

export const backgroundStyleCSS: Record<DesignVariant["backgroundStyle"], string> = {
  gradient: "bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950",
  mesh: "bg-gray-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]",
  grid: "bg-gray-950 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]",
  glass: "bg-gradient-to-br from-slate-900/95 via-gray-900/90 to-slate-950/95 backdrop-blur-3xl",
  aurora: "bg-gray-950 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.08),transparent_50%)]",
  minimal: "bg-gray-950",
};

export const typographyWeightCSS: Record<DesignVariant["typographyWeight"], { heading: string; body: string }> = {
  light: { heading: "font-light tracking-wide", body: "font-light" },
  regular: { heading: "font-bold", body: "font-normal" },
  bold: { heading: "font-extrabold tracking-tight", body: "font-medium" },
};
