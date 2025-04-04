import type { Config } from "tailwindcss";
import tailwindAnimations from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#33ccff", // Neon accent color
        input: "#1a1d23", // Dark bg, neon border
        ring: "#66d9ef", // Neon focus ring (primary/secondary)
        background: "#0a0a2a", // Deep dark blue/purple/black
        foreground: "#ffffff", // Bright cyan/white/light grey
        primary: {
          DEFAULT: "#ff69b4", // Neon Pink/Magenta
          foreground: "#ffffff", // Light color
        },
        secondary: {
          DEFAULT: "#03a9f4", // Electric Blue/Cyan
          foreground: "#ffffff", // Light color
        },
        destructive: {
          DEFAULT: "#f97316", // Keep standard red for errors
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#2f343a", // Darker, less saturated shade
          foreground: "#ffffff", // Muted light color
        },
        accent: {
          DEFAULT: "#8f0a1a", // Vivid Purple/Green
          foreground: "#ffffff", // Light color
        },
        popover: {
          DEFAULT: "#1a1d23", // Dark background
          foreground: "#ffffff", // Bright foreground
        },
        card: {
          DEFAULT: "#14161a", // Slightly lighter dark shade, maybe with neon border
          foreground: "#ffffff", // Bright foreground
        },
        // Custom cyberpunk specific colors if needed
        "cyber-bg": "#0a0a2a", // Example dark blue
        "cyber-glow": "#00f0ff", // Example cyan glow
      },
      borderRadius: {
        lg: "var(--radius)", // Keep or adjust for sharper edges
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slow-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        // Pulse glow animation for neon effects
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 5px #ff69b4" },
          "50%": { opacity: "0.7", boxShadow: "0 0 20px #ff69b4, 0 0 30px #ff69b4" },
        },
        "pulse-glow-secondary": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 5px #03a9f4" },
          "50%": { opacity: "0.7", boxShadow: "0 0 20px #03a9f4, 0 0 30px #03a9f4" },
        },
        "border-beam": {
          "100%": { "offset-distance": "100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 10s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-glow-secondary": "pulse-glow-secondary 10s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        "slow-spin": "slow-spin 6s linear infinite",
      },
    },
  },
  plugins: [tailwindAnimations, require("@tailwindcss/typography")], // Ensure typography plugin is present
} satisfies Config;
