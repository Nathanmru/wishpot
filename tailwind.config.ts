import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F5F1",
        ink: "#1A1F2B",
        muted: "#5E6472",
        line: "#E3DED6",
        walnut: { DEFAULT: "#7A4B2A", dark: "#5C3519", soft: "#EFE5D9" },
        dusk: { DEFAULT: "#2E3270", dark: "#1F2252", soft: "#E6E7F3" },
        apricot: { DEFAULT: "#F2A65A", soft: "#FCEBD7" },
        moss: { DEFAULT: "#4F7A5C", soft: "#E2ECE4" },
        // alias historiques
        cream: "#F7F5F1",
        terra: { DEFAULT: "#7A4B2A", dark: "#5C3519", soft: "#EFE5D9" },
        sea: { DEFAULT: "#2E3270", soft: "#E6E7F3" },
        sage: { DEFAULT: "#4F7A5C", soft: "#E2ECE4" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: { xl2: "1.25rem", xl3: "1.75rem" },
      boxShadow: {
        soft: "0 1px 2px rgba(26,31,43,0.04), 0 8px 24px -12px rgba(26,31,43,0.12)",
        lift: "0 2px 4px rgba(26,31,43,0.05), 0 24px 48px -20px rgba(26,31,43,0.28)",
      },
    },
  },
  plugins: [],
} satisfies Config;
