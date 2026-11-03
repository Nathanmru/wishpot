import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#15120F",
        paper: "#EFEAE2",
        bone: "#EFEAE2",
        ink: "#1A1714",
        muted: "#6F675E",
        line: "#DDD5CA",
        brass: "#B08D5E",
        walnut: { DEFAULT: "#6E4A30", dark: "#4E3220", soft: "#E8DED1" },
        dusk: { DEFAULT: "#2C2F42", dark: "#1C1E2B", soft: "#E3E3EA" },
        apricot: { DEFAULT: "#D9905E", soft: "#F5E3D3" },
        moss: { DEFAULT: "#4F7A5C", soft: "#E2ECE4" },
        // alias historiques
        cream: "#EFEAE2",
        terra: { DEFAULT: "#6E4A30", dark: "#4E3220", soft: "#E8DED1" },
        sea: { DEFAULT: "#2C2F42", soft: "#E3E3EA" },
        sage: { DEFAULT: "#4F7A5C", soft: "#E2ECE4" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Didot", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: { label: "0.18em" },
      borderRadius: { xl2: "1rem", xl3: "1.25rem" },
      boxShadow: {
        soft: "0 1px 2px rgba(26,23,20,0.04), 0 8px 24px -12px rgba(26,23,20,0.14)",
        lift: "0 2px 4px rgba(26,23,20,0.05), 0 30px 60px -24px rgba(26,23,20,0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;
