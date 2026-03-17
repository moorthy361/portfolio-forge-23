import { useMemo } from "react";
import { getDesignConfig, type RoleDesignConfig } from "@/lib/roleDesignConfig";
import {
  type DesignVariant,
  colorAccentStyles,
  backgroundStyleCSS,
  typographyWeightCSS,
  colorThemeCSS,
  fontPairingCSS,
  cardStyleCSS,
} from "@/lib/designVariantGenerator";

export interface DesignEngine {
  roleConfig: RoleDesignConfig;
  variant: DesignVariant | null;
  // Computed styles
  backgroundClass: string;
  headingClass: string;
  bodyClass: string;
  accentPrimaryClass: string;
  accentGlowClass: string;
  accentGradientClass: string;
  cardClass: string;
  badgeClass: string;
  sectionBgClass: string;
  heroAnimationType: string;
  showParticles: boolean;
  showGrid: boolean;
  layoutType: string;
  // Theme-driven
  colorThemeBg: string;
  colorThemeCardBg: string;
  colorThemeTextPrimary: string;
  colorThemeTextSecondary: string;
  colorThemeAccent: string;
  fontPairingHeading: string;
  fontPairingBody: string;
  sectionOrder: string[];
  // Card style
  variantCardClass: string;
}

export const useDesignEngine = (
  jobRole: string,
  designVariant: DesignVariant | null
): DesignEngine => {
  return useMemo(() => {
    const roleConfig = getDesignConfig(jobRole);
    const variant = designVariant;

    const colorAccent = variant?.colorAccent || "neon";
    const accentConfig = colorAccentStyles[colorAccent] || colorAccentStyles["neon"];
    const bgStyle = variant?.backgroundStyle || "gradient";
    const typoWeight = variant?.typographyWeight || "regular";
    const typoConfig = typographyWeightCSS[typoWeight];

    const colorTheme = variant?.colorTheme || "dark-bold";
    const themeConfig = colorThemeCSS[colorTheme] || colorThemeCSS["dark-bold"];
    const fontPair = variant?.fontPairing || "display-light";
    const fontConfig = fontPairingCSS[fontPair] || fontPairingCSS["display-light"];
    const cardVariant = variant?.cardStyle || "glass";
    const variantCard = cardStyleCSS[cardVariant] || cardStyleCSS["glass"];

    const sectionOrder = variant?.sectionOrder || [
      "about", "projects", "skills", "education", "achievements", "contact",
    ];

    return {
      roleConfig,
      variant,
      backgroundClass: `${roleConfig.heroStyle} ${backgroundStyleCSS[bgStyle] || backgroundStyleCSS["gradient"]}`,
      headingClass: `${typoConfig.heading} ${fontConfig.heading}`,
      bodyClass: `${typoConfig.body} ${fontConfig.body}`,
      accentPrimaryClass: accentConfig.primary,
      accentGlowClass: accentConfig.glow,
      accentGradientClass: accentConfig.gradient,
      cardClass: variantCard,
      badgeClass: roleConfig.badgeStyle,
      sectionBgClass: roleConfig.sectionBg,
      heroAnimationType: variant?.animationStyle || roleConfig.heroAnimation,
      showParticles: roleConfig.particleEffect,
      showGrid: roleConfig.gridOverlay,
      layoutType: variant?.layout || "top-header",
      colorThemeBg: themeConfig.bg,
      colorThemeCardBg: themeConfig.cardBg,
      colorThemeTextPrimary: themeConfig.textPrimary,
      colorThemeTextSecondary: themeConfig.textSecondary,
      colorThemeAccent: themeConfig.accent,
      fontPairingHeading: fontConfig.heading,
      fontPairingBody: fontConfig.body,
      sectionOrder,
      variantCardClass: variantCard,
    };
  }, [jobRole, designVariant]);
};
