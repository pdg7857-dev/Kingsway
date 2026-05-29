import type { Config } from "tailwindcss";

/**
 * Professional, trust-forward palette for a B2B government-procurement audience.
 * Deep navy ("ink") as the authority color, a confident blue accent, and a
 * warm signal color ("gold") for value/proof moments. Light-first.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0b1b3a",
          900: "#081530",
          800: "#0b1b3a",
          700: "#13294f",
          600: "#1d3a66",
        },
        brand: {
          DEFAULT: "#1d63d8",
          50: "#eef4ff",
          100: "#dbe6ff",
          200: "#bccffe",
          300: "#8eabfc",
          400: "#5a7ef8",
          500: "#3457ef",
          600: "#1d63d8",
          700: "#1b4fb0",
          800: "#1c438c",
          900: "#1c3c71",
        },
        gold: {
          DEFAULT: "#c8932f",
          50: "#fbf6ea",
          100: "#f4e6c4",
          400: "#dcab4c",
          500: "#c8932f",
          600: "#a6781f",
        },
        paper: {
          DEFAULT: "#ffffff",
          soft: "#f7f9fc",
          muted: "#eef2f8",
        },
        line: {
          DEFAULT: "#e2e8f2",
          strong: "#cdd7e6",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        serif: ["var(--font-serif)", "Georgia", "ui-serif", "serif"],
      },
      maxWidth: {
        prose: "44rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,27,58,0.04), 0 12px 32px -16px rgba(11,27,58,0.18)",
        lift: "0 24px 60px -28px rgba(11,27,58,0.35)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
