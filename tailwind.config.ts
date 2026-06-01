import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#050816",
          surface: "#0B1120",
          elevated: "#111827",
        },

        text: {
          primary: "#F5F1E8",
          secondary: "#C8C1B4",
          muted: "#8A857D",
        },

        accent: {
          gold: "#C9A86A",
          bronze: "#9B7B4F",
          primary: "#7D6B9E",
          secondary: "#5A4D74",
        },

        border: {
          primary: "#1F2937",
        },
      },

      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
        display: ["var(--font-display)"],
      },

      boxShadow: {
        atmospheric:
          "0 8px 32px rgba(0,0,0,0.45)",

        floating:
          "0 20px 60px rgba(0,0,0,0.55)",

        card:
          "0 10px 40px rgba(0,0,0,0.35)",

        glass:
          "0 8px 30px rgba(0,0,0,0.25)",

        glowGold:
          "0 0 24px rgba(201,168,106,0.18)",

        glowPurple:
          "0 0 24px rgba(125,107,158,0.18)",

        glowSoft:
          "0 0 16px rgba(255,255,255,0.08)",
      },

      spacing: {
        18: "72px",
        22: "88px",
      },

      backdropBlur: {
        glass: "20px",
      },
    },
  },

  plugins: [],
};

export default config;