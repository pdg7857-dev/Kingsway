import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b1020",
        panel: "#121933",
        panel2: "#0e1530",
        border: "#1e2748",
        fg: "#e7ecff",
        muted: "#9aa6cf",
        subtle: "#6b78a8",
        accent: "#3fa9ff",
        accentSoft: "#13294f",
        good: "#34d399",
        warn: "#fbbf24",
        bad: "#f87171",
      },
    },
  },
  plugins: [],
};
export default config;
