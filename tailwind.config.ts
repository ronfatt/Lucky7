import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070A12",
        foreground: "#F8FAFC",
        obsidian: {
          950: "#04060A",
          900: "#070A12",
          850: "#0B101D",
          800: "#0F1626",
          700: "#17223B",
          600: "#223254",
        },
        gold: {
          50: "#FDFBF7",
          100: "#F9F4E8",
          200: "#F2E4C4",
          300: "#E9CE96",
          400: "#DFB566",
          500: "#D49B35",
          600: "#B87F28",
          700: "#925F20",
          800: "#754C1F",
          900: "#603E1D",
          champagne: "#D4AF37",
          light: "#E5C158",
          dark: "#AA8520",
        },
        element: {
          wood: "#10B981",   // Emerald Green
          fire: "#EF4444",   // Imperial Vermilion / Fire Red
          earth: "#D97706",  // Amber / Ochre Earth
          metal: "#94A3B8",  // Refined White / Platinum Slate
          water: "#38BDF8",  // Azure / Deep Stream Cyan
        }
      },
      fontFamily: {
        serif: ["Songti SC", "Noto Serif SC", "STSong", "serif"],
        sans: ["PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "sans-serif"],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        'glass-panel': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
};
export default config;
