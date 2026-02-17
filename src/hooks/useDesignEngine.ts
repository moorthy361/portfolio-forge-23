import { useMemo } from "react";
import { getDesignConfig, type RoleDesignConfig } from "@/lib/roleDesignConfig";
import {
  type DesignVariant,
  colorAccentStyles,
  backgroundStyleCSS,
  typographyWeightCSS,
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
}

export const useDesignEngine = (
  jobRole: string,
  designVariant: DesignVariant | null
): DesignEngine => {
  return useMemo(() => {
    const roleConfig = getDesignConfig(jobRole);
    const variant = designVariant;

    // Merge role config with variant overrides
    const colorAccent = variant?.colorAccent || "neon";
    const accentConfig = colorAccentStyles[colorAccent];
    const bgStyle = variant?.backgroundStyle || "gradient";
    const typoWeight = variant?.typographyWeight || "regular";
    const typoConfig = typographyWeightCSS[typoWeight];

    return {
      roleConfig,
      variant,
      backgroundClass: `${roleConfig.heroStyle} ${backgroundStyleCSS[bgStyle]}`,
      headingClass: typoConfig.heading,
      bodyClass: typoConfig.body,
      accentPrimaryClass: accentConfig.primary,
      accentGlowClass: accentConfig.glow,
      accentGradientClass: accentConfig.gradient,
      cardClass: roleConfig.cardStyle,
      badgeClass: roleConfig.badgeStyle,
      sectionBgClass: roleConfig.sectionBg,
      heroAnimationType: variant?.animationStyle || roleConfig.heroAnimation,
      showParticles: roleConfig.particleEffect,
      showGrid: roleConfig.gridOverlay,
      layoutType: variant?.layout || "top-header",
    };
  }, [jobRole, designVariant]);
};
