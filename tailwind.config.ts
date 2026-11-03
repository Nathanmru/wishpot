import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF7F1",
        ink: "#1F1B16",
        muted: "#6B6258",
        line: "#E8E0D4",
        terra: { DEFAULT: "#C8553D", dark: "#A6432F", soft: "#F6E3DC" },
        sea: { DEFAULT: "#2E6F8E", soft: "#DDEBF2" },
        sage: { DEFAULT: "#5E7D5A", soft: "#E3ECDF" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
} satisfies Config;
