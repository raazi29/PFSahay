// PFSahay design tokens — premium fintech product with deep navy primary.
// Clean white canvas, deep navy primary, indigo brand accent,
// orange for document uploads/warnings, restrained and professional.
export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F8F9FC",       // very light cool gray
        surface: "#FFFFFF",
        ink: "#1B2E4B",          // deep navy - primary text
        muted: "#64748B",        // slate gray for secondary text
        line: "#E2E8F0",         // cool gray border
        primary: {
          DEFAULT: "#1B2E4B",    // deep navy - buttons, CTAs
          soft: "#EEF2FF",       // very light indigo tint
          ink: "#0F1D32",        // deeper navy for hover
          light: "#3B5998",      // lighter navy for accents
        },
        brand: {
          DEFAULT: "#4F46E5",    // indigo — accent, active/selected states, links
          soft: "#EEF2FF",
          dark: "#4338CA",
        },
        accent: {
          DEFAULT: "#E8743B",    // orange for upload CTAs, warnings
          soft: "#FFF4ED",
          dark: "#D4622E",
        },
        success: {
          DEFAULT: "#16A34A",
          soft: "#F0FDF4",
        },
        warning: {
          DEFAULT: "#EA580C",
          soft: "#FFF7ED",
        },
        danger: {
          DEFAULT: "#DC2626",
          soft: "#FEF2F2",
        },
        info: {
          DEFAULT: "#6366F1",    // indigo for info badges
          soft: "#EEF2FF",
        },
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
        "3xl": "28px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
        soft: "0 1px 2px rgba(0,0,0,0.05)",
        elevated: "0 4px 16px rgba(27,46,75,0.08)",
        glow: "0 0 20px rgba(27,46,75,0.1)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Noto Sans",
          "Noto Sans Devanagari",
          "sans-serif",
        ],
      },
      maxWidth: {
        app: "480px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.25s ease-out",
        shimmer: "shimmer 1.5s infinite",
        "pulse-soft": "pulse-soft 1.5s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
