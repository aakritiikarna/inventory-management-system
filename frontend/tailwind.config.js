/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Custom palette: deep slate sidebar + teal accent, deliberately
        // not the generic indigo-on-white admin-template default.
        ink: {
          950: "#0c1420",
          900: "#101b2c",
          800: "#16243a",
          700: "#1f3350",
        },
        teal: {
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(16, 27, 44, 0.06), 0 1px 3px 0 rgba(16, 27, 44, 0.08)",
      },
    },
  },
  plugins: [],
};
