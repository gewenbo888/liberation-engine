import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // deep indigo cosmic void — a meditative night lit from within
        void: {
          950: "#070611",
          900: "#0c0a1c",
          800: "#141128",
          700: "#1d1938",
          600: "#2a2550",
          500: "#383163",
        },
        // bodhi gold — the lamp, awakening, the saffron robe (PRIMARY accent)
        bodhi: {
          500: "#f4c25a",
          400: "#ffd584",
          300: "#ffe7b0",
        },
        // lotus — compassion, the opening flower, dawn rose
        lotus: {
          500: "#ef84b1",
          400: "#f6abc8",
          300: "#fbcadd",
        },
        // jade — liberation, flow, the cool of cessation, still water
        jade: {
          500: "#4fd6c0",
          400: "#82e3d3",
          300: "#aeefe4",
        },
        // amethyst — consciousness, transcendence, the violet of depth
        amethyst: {
          500: "#9d8bf0",
          400: "#b8aaf6",
          300: "#d4cbfb",
        },
        // ember — suffering, the heat of craving, dukkha's glow
        ember: {
          500: "#e0664f",
          400: "#ea8773",
          300: "#f2aa9b",
        },
        // warm bone / candlelit-white text
        bone: {
          50: "#fbf6ee",
          100: "#f3ebdf",
          300: "#d6c9b8",
          500: "#9b8d79",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "ui-serif", "Georgia", "serif"],
        serif: ['"Newsreader"', "ui-serif", "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        zh: ['"Noto Serif SC"', "serif"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(244,194,90,0.42), 0 0 120px -40px rgba(157,139,240,0.28)",
        bodhiglow: "0 0 40px -8px rgba(244,194,90,0.5)",
        lotusglow: "0 0 40px -8px rgba(239,132,177,0.45)",
        jadeglow: "0 0 40px -8px rgba(79,214,192,0.45)",
        amethystglow: "0 0 40px -8px rgba(157,139,240,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
