import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // Surface palette — deep slate / obsidian
        bg: {
          DEFAULT: "hsl(222 47% 5%)",
          subtle: "hsl(222 40% 7%)",
          panel: "hsl(222 36% 9%)",
          raised: "hsl(222 32% 11%)",
          hover: "hsl(222 28% 14%)",
        },
        border: {
          DEFAULT: "hsl(222 24% 17%)",
          subtle: "hsl(222 20% 13%)",
        },
        fg: {
          DEFAULT: "hsl(210 40% 96%)",
          muted: "hsl(215 16% 65%)",
          subtle: "hsl(215 14% 45%)",
        },
        // Accent — neon-cyan / electric-violet for that AI-OS feel
        accent: {
          DEFAULT: "hsl(186 100% 55%)",
          glow: "hsl(186 100% 65%)",
          soft: "hsl(186 60% 20%)",
        },
        violet: {
          DEFAULT: "hsl(265 89% 66%)",
          soft: "hsl(265 60% 20%)",
        },
        success: { DEFAULT: "hsl(150 80% 50%)", soft: "hsl(150 60% 15%)" },
        warn:    { DEFAULT: "hsl(38 92% 58%)",  soft: "hsl(38 60% 18%)" },
        danger:  { DEFAULT: "hsl(0 84% 62%)",   soft: "hsl(0 60% 18%)" },
        info:    { DEFAULT: "hsl(210 92% 62%)", soft: "hsl(210 60% 18%)" },
        // Business swatches
        biz: {
          lexus:      "hsl(0 84% 60%)",
          fitness:    "hsl(150 80% 50%)",
          content:    "hsl(280 90% 65%)",
          phone:      "hsl(38 92% 58%)",
          supplements:"hsl(186 100% 55%)",
          personal:   "hsl(215 28% 65%)",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      boxShadow: {
        panel: "0 1px 0 hsl(222 30% 14%) inset, 0 8px 24px -16px hsl(222 60% 2% / 0.6)",
        glow: "0 0 0 1px hsl(186 100% 55% / 0.4), 0 0 30px -5px hsl(186 100% 55% / 0.45)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 20% 0%, hsl(265 89% 66% / 0.10), transparent 40%), radial-gradient(circle at 80% 10%, hsl(186 100% 55% / 0.10), transparent 45%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(186 100% 55% / 0.55)" },
          "50%": { boxShadow: "0 0 0 8px hsl(186 100% 55% / 0)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.4s linear infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
