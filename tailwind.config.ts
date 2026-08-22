import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#07160F", // Ink Emerald — base background
          soft: "#0D2118",
          line: "#1B3527",
        },
        gold: {
          DEFAULT: "#C9A24B", // Sadu Gold — primary accent
          soft: "#E4C877",
          dim: "#8A7136",
        },
        signal: {
          DEFAULT: "#4FE6C4", // Signal Cyan — AI / intelligence accent
          soft: "#9FF5E1",
          dim: "#1F5F52",
        },
        linen: "#EFE7D8", // Sand Linen — light text on dark
        dune: "#8B9490", // Dune Grey — muted secondary text
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(circle at 50% 30%, rgba(79,230,196,0.14), transparent 60%)",
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
