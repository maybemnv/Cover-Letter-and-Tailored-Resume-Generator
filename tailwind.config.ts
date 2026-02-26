import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#080A0C",
        surface: "#0F1215",
        surface2: "#161B20",
        border: "#1E2530",
        "border-glow": "#2A9D8F",
        accent: "#2A9D8F",
        accent2: "#E9C46A",
        accent3: "#E76F51",
        text: "#EAE8E3",
        "text-muted": "#5A6470",
        "text-dim": "#8A939E",
      },
      fontFamily: {
        syne: ["var(--font-syne)"],
        mono: ["var(--font-dm-mono)"],
        serif: ["var(--font-instrument-serif)"],
      },
    },
  },
  plugins: [],
};

export default config;
