import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DesignEngine } from "@/hooks/useDesignEngine";

interface FuturisticWrapperProps {
  children: React.ReactNode;
  engine: DesignEngine;
}

// Floating particle component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/10"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Grid overlay for terminal/devops styles
const GridOverlay = () => (
  <div
    className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
    style={{
      backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
      backgroundSize: "40px 40px",
    }}
  />
);

// Section reveal animation variants
const sectionVariants = {
  fade: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  },
  slide: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  },
  "blur-reveal": {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } },
  },
};

export const AnimatedSection: React.FC<{
  children: React.ReactNode;
  animationType: string;
  delay?: number;
  className?: string;
}> = ({ children, animationType, delay = 0, className = "" }) => {
  const variant = sectionVariants[animationType as keyof typeof sectionVariants] || sectionVariants.fade;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: variant.hidden,
        visible: {
          ...variant.visible,
          transition: {
            ...(variant.visible as any).transition,
            delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animated gradient background
const AnimatedGradientBg: React.FC<{ gradientClass: string }> = ({ gradientClass }) => (
  <motion.div
    className={`fixed inset-0 pointer-events-none z-0 opacity-30 bg-gradient-to-r ${gradientClass}`}
    animate={{
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      ease: "linear",
    }}
    style={{ backgroundSize: "200% 200%" }}
  />
);

// Hover glow card wrapper
export const GlowCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}> = ({ children, className = "", glowColor }) => {
  return (
    <motion.div
      className={`relative group ${className}`}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
    >
      {glowColor && (
        <div
          className={`absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg ${glowColor}`}
        />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  );
};

const FuturisticWrapper: React.FC<FuturisticWrapperProps> = ({ children, engine }) => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background layer */}
      <div className={`fixed inset-0 z-0 ${engine.backgroundClass}`} />
      
      {/* Animated gradient overlay */}
      <AnimatedGradientBg gradientClass={engine.accentGradientClass} />

      {/* Particles */}
      {engine.showParticles && <FloatingParticles />}

      {/* Grid overlay */}
      {engine.showGrid && <GridOverlay />}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default FuturisticWrapper;
