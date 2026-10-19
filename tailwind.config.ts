import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        canvas: {
          950: "#110e0c",
          900: "#1b1613",
          850: "#261f1a",
          800: "#3a312a",
          700: "#57493e",
        },
        ink: {
          200: "#f6efe8",
          300: "#e6d9cc",
          400: "#b7a89a",
          500: "#8d7d70",
          700: "#5a4c42",
          800: "#3a312a",
        },
        pulse: {
          200: "#ffd8cc",
          300: "#ffb59a",
          400: "#ff8f66",
          500: "#ff6b3d",
          600: "#ef5424",
          950: "#3c160e",
        },
        brass: {
          300: "#f6e2a8",
          400: "#e8c56a",
          500: "#d4a84a",
          600: "#b8892e",
        },
        clay: {
          300: "#f0c2b4",
          400: "#e09a86",
          500: "#c97b64",
        },
        sage: {
          300: "#d5e0cf",
          400: "#8eae96",
          500: "#6d9178",
        },
      },
    },
  },
  plugins: [],
};
export default config;
