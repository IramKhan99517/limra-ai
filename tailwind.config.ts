import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Original design tokens (preserved) ──
        ink: {
          DEFAULT: "#07160F",
          soft: "#0D2118",
          line: "#1B3527",
        },
        gold: {
          DEFAULT: "#C9A24B",
          soft: "#E4C877",
          dim: "#8A7136",
        },
        signal: {
          DEFAULT: "#4FE6C4",
          soft: "#9FF5E1",
          dim: "#1F5F52",
        },
        linen: "#EFE7D8",
        dune: "#8B9490",
        // ── Vision 2030 Saudi theme (new) ──
        saudi: {
          green: "#006C35",
          "green-light": "#00854A",
          "green-dark": "#004D26",
          sand: "#F5F0E8",
          cream: "#FAFAF5",
        },
        nitaqat: {
          red: "#DC2626",
          yellow: "#F59E0B",
          green: "#16A34A",
          platinum: "#8B5CF6",
        },
        vision: {
          teal: "#00B4D8",
          "teal-dark": "#0096B7",
          navy: "#0D1B2A",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(circle at 50% 30%, rgba(79,230,196,0.14), transparent 60%)",
        "gradient-vision":
          "linear-gradient(135deg, #006C35 0%, #0096B7 50%, #C9A24B 100%)",
        "gradient-dark":
          "linear-gradient(135deg, #07160F 0%, #0D2118 50%, #1B3527 100%)",
        "gradient-gold":
          "linear-gradient(135deg, #C9A24B 0%, #E4C877 50%, #8A7136 100%)",
        "gradient-saudi":
          "linear-gradient(135deg, #006C35 0%, #004D26 100%)",
      },
      keyframes: {
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "spin-slower": {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.9" },
        },
        "rise-fade": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 60s linear infinite",
        "spin-slower": "spin-slower 90s linear infinite",
        "pulse-glow": "pulse-glow 3.4s ease-in-out infinite",
        "rise-fade": "rise-fade 0.7s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
