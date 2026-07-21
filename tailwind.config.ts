import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        earth: { 50: "#f6f8f2", 100: "#e8eedc", 500: "#55734a", 700: "#31553a", 900: "#173327" }
      }
    }
  },
  plugins: []
};

export default config;
