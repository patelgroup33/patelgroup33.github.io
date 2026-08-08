import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blood: "#8B0000",
        crimson: "#C1121F",
        neon: "#FF2E2E",
        silver: "#C7CCD1",
        metal: "#1a1a1e",
        ink: "#050506",
      },
      fontFamily: {
        display: ["var(--font-space)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.06em",
      },
      keyframes: {
        flicker: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.82" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
        spinReverse: {
          to: { transform: "rotate(-360deg)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        flicker: "flicker 4s ease-in-out infinite",
        scan: "scan 4s linear infinite",
        "spin-slow": "spinSlow 24s linear infinite",
        "spin-reverse": "spinReverse 18s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
