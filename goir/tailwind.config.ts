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
        // Surface palette — obsidian (near-black with a faint blue cast)
        bg: {
          DEFAULT: "hsl(222 44% 3.5%)",
          subtle: "hsl(222 40% 5%)",
          panel: "hsl(222 34% 7%)",
          raised: "hsl(221 30% 9.5%)",
          hover: "hsl(221 26% 13%)",
        },
        border: {
          DEFAULT: "hsl(220 22% 15%)",
          subtle: "hsl(220 20% 11%)",
        },
        fg: {
          DEFAULT: "hsl(200 30% 97%)",
          muted: "hsl(214 15% 62%)",
          subtle: "hsl(216 14% 42%)",
        },
        // Accent — electric cyan with a glow
        accent: {
          DEFAULT: "hsl(184 100% 52%)",
          glow: "hsl(184 100% 64%)",
          soft: "hsl(187 70% 16%)",
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
          eprocurement:"hsl(214 95% 62%)",
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
        panel: "0 1px 0 hsl(220 30% 16% / 0.6) inset, 0 10px 30px -18px hsl(222 80% 1% / 0.8)",
        glow: "0 0 0 1px hsl(184 100% 52% / 0.45), 0 0 28px -4px hsl(184 100% 52% / 0.5)",
        lift: "0 12px 40px -20px hsl(222 90% 1% / 0.9)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 20% 0%, hsl(265 89% 66% / 0.10), transparent 40%), radial-gradient(circle at 80% 10%, hsl(184 100% 52% / 0.10), transparent 45%)",
        "hairline":
          "linear-gradient(90deg, transparent, hsl(184 100% 52% / 0.5), transparent)",
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
