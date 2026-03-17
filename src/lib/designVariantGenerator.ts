// Design Variant Generator - creates unique random visual configurations per portfolio
// Supports 100+ unique combinations through randomized property mixing

export interface DesignVariant {
  layout: "sidebar" | "top-header" | "split" | "card-stack" | "editorial" | "asymmetric";
  colorAccent: "neon" | "pastel" | "dark-pro" | "gradient-tech" | "aurora" | "ember" | "ocean" | "sunset" | "mint" | "lavender";
  animationStyle: "fade" | "slide" | "scale" | "blur-reveal";
  backgroundStyle: "gradient" | "mesh" | "grid" | "glass" | "aurora" | "minimal" | "dots" | "radial" | "noise";
  typographyWeight: "light" | "regular" | "bold";
  colorTheme: "dark-bold" | "soft-pastels" | "earthy-tones" | "clean-minimal" | "vibrant-colorful" | "midnight-blue" | "forest-dark" | "warm-charcoal";
  fontPairing: "serif-sans" | "mono-serif" | "display-light" | "geometric-elegant" | "humanist-mono";
  cardStyle: "glass" | "solid" | "bordered" | "shadow" | "gradient-border";
  sectionOrder: string[];
}

const layoutVariants: DesignVariant["layout"][] = ["sidebar", "top-header", "split", "card-stack", "editorial", "asymmetric"];
const colorAccents: DesignVariant["colorAccent"][] = ["neon", "pastel", "dark-pro", "gradient-tech", "aurora", "ember", "ocean", "sunset", "mint", "lavender"];
const animationStyles: DesignVariant["animationStyle"][] = ["fade", "slide", "scale", "blur-reveal"];
const backgroundStyles: DesignVariant["backgroundStyle"][] = ["gradient", "mesh", "grid", "glass", "aurora", "minimal", "dots", "radial", "noise"];
const typographyWeights: DesignVariant["typographyWeight"][] = ["light", "regular", "bold"];
const colorThemes: DesignVariant["colorTheme"][] = ["dark-bold", "soft-pastels", "earthy-tones", "clean-minimal", "vibrant-colorful", "midnight-blue", "forest-dark", "warm-charcoal"];
const fontPairings: DesignVariant["fontPairing"][] = ["serif-sans", "mono-serif", "display-light", "geometric-elegant", "humanist-mono"];
const cardStyles: DesignVariant["cardStyle"][] = ["glass", "solid", "bordered", "shadow", "gradient-border"];

// Total combinations: 6 × 10 × 4 × 9 × 3 × 8 × 5 × 5 = 129,600

const shuffleArray = <T>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const reorderableSections = ["skills", "projects", "education", "about"];

export const generateDesignVariant = (): DesignVariant => ({
  layout: randomFrom(layoutVariants),
  colorAccent: randomFrom(colorAccents),
  animationStyle: randomFrom(animationStyles),
  backgroundStyle: randomFrom(backgroundStyles),
  typographyWeight: randomFrom(typographyWeights),
  colorTheme: randomFrom(colorThemes),
  fontPairing: randomFrom(fontPairings),
  cardStyle: randomFrom(cardStyles),
  sectionOrder: [...shuffleArray(reorderableSections), "achievements", "contact"],
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
  ocean: {
    primary: "text-sky-400",
    glow: "shadow-[0_0_35px_rgba(56,189,248,0.35)]",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
  },
  sunset: {
    primary: "text-orange-400",
    glow: "shadow-[0_0_35px_rgba(251,146,60,0.35)]",
    gradient: "from-yellow-400 via-orange-500 to-rose-600",
  },
  mint: {
    primary: "text-emerald-300",
    glow: "shadow-[0_0_30px_rgba(110,231,183,0.3)]",
    gradient: "from-emerald-300 via-green-400 to-teal-500",
  },
  lavender: {
    primary: "text-purple-300",
    glow: "shadow-[0_0_30px_rgba(196,181,253,0.3)]",
    gradient: "from-purple-300 via-violet-400 to-indigo-500",
  },
};

export const backgroundStyleCSS: Record<DesignVariant["backgroundStyle"], string> = {
  gradient: "bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950",
  mesh: "bg-gray-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]",
  grid: "bg-gray-950 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]",
  glass: "bg-gradient-to-br from-slate-900/95 via-gray-900/90 to-slate-950/95 backdrop-blur-3xl",
  aurora: "bg-gray-950 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.08),transparent_50%)]",
  minimal: "bg-gray-950",
  dots: "bg-gray-950 bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]",
  radial: "bg-gray-950 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)]",
  noise: "bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950",
};

export const typographyWeightCSS: Record<DesignVariant["typographyWeight"], { heading: string; body: string }> = {
  light: { heading: "font-light tracking-wide", body: "font-light" },
  regular: { heading: "font-bold", body: "font-normal" },
  bold: { heading: "font-extrabold tracking-tight", body: "font-medium" },
};

// Color theme CSS mappings
export const colorThemeCSS: Record<DesignVariant["colorTheme"], { bg: string; cardBg: string; textPrimary: string; textSecondary: string; accent: string }> = {
  "dark-bold": {
    bg: "bg-gray-950",
    cardBg: "bg-gray-900/80 border-white/10",
    textPrimary: "text-white",
    textSecondary: "text-white/60",
    accent: "text-cyan-400",
  },
  "soft-pastels": {
    bg: "bg-gradient-to-br from-rose-950/80 via-purple-950/70 to-indigo-950/80",
    cardBg: "bg-white/5 backdrop-blur-md border-pink-300/10",
    textPrimary: "text-pink-100",
    textSecondary: "text-pink-200/60",
    accent: "text-rose-300",
  },
  "earthy-tones": {
    bg: "bg-gradient-to-br from-stone-950 via-amber-950/40 to-stone-900",
    cardBg: "bg-stone-900/70 border-amber-400/10",
    textPrimary: "text-amber-50",
    textSecondary: "text-amber-200/60",
    accent: "text-amber-400",
  },
  "clean-minimal": {
    bg: "bg-slate-950",
    cardBg: "bg-slate-900/60 border-slate-700/20",
    textPrimary: "text-slate-100",
    textSecondary: "text-slate-400",
    accent: "text-blue-400",
  },
  "vibrant-colorful": {
    bg: "bg-gradient-to-br from-violet-950 via-fuchsia-950/60 to-blue-950",
    cardBg: "bg-white/8 backdrop-blur-md border-fuchsia-400/15",
    textPrimary: "text-white",
    textSecondary: "text-fuchsia-200/60",
    accent: "text-fuchsia-400",
  },
  "midnight-blue": {
    bg: "bg-gradient-to-br from-blue-950 via-indigo-950/80 to-slate-950",
    cardBg: "bg-blue-900/30 backdrop-blur-md border-blue-400/10",
    textPrimary: "text-blue-50",
    textSecondary: "text-blue-200/50",
    accent: "text-blue-300",
  },
  "forest-dark": {
    bg: "bg-gradient-to-br from-green-950 via-emerald-950/60 to-gray-950",
    cardBg: "bg-emerald-900/20 backdrop-blur-md border-emerald-400/10",
    textPrimary: "text-emerald-50",
    textSecondary: "text-emerald-200/50",
    accent: "text-emerald-400",
  },
  "warm-charcoal": {
    bg: "bg-gradient-to-br from-neutral-950 via-stone-900/50 to-neutral-950",
    cardBg: "bg-neutral-900/60 border-neutral-700/20",
    textPrimary: "text-neutral-100",
    textSecondary: "text-neutral-400",
    accent: "text-orange-400",
  },
};

// Font pairing CSS mappings
export const fontPairingCSS: Record<DesignVariant["fontPairing"], { heading: string; body: string }> = {
  "serif-sans": {
    heading: "font-serif",
    body: "font-sans",
  },
  "mono-serif": {
    heading: "font-mono",
    body: "font-serif",
  },
  "display-light": {
    heading: "font-sans font-black tracking-tighter",
    body: "font-sans font-light",
  },
  "geometric-elegant": {
    heading: "font-sans tracking-widest uppercase",
    body: "font-sans font-normal tracking-wide",
  },
  "humanist-mono": {
    heading: "font-sans font-bold tracking-tight",
    body: "font-mono font-normal",
  },
};

// Card style CSS mappings
export const cardStyleCSS: Record<DesignVariant["cardStyle"], string> = {
  glass: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg",
  solid: "bg-gray-900/90 border border-white/5",
  bordered: "bg-transparent border-2 border-white/15",
  shadow: "bg-gray-900/70 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/5",
  "gradient-border": "bg-gray-900/60 border border-white/10 ring-1 ring-white/5",
};
