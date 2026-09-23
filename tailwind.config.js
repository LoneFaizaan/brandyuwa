/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#f9f9f7",
        surface: "#f9f9f7",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f4f4f2",
        "surface-container": "#eeeeec",
        "surface-container-high": "#e8e8e6",
        "surface-container-highest": "#e2e3e1",
        "surface-subtle": "#F5F5F2",
        "surface-bright": "#f9f9f7",
        "surface-dim": "#dadad8",
        border: "#E7E7E4",
        "text-primary": "#0A0A0A",
        "text-muted": "#747878",
        secondary: "#5e5e5e",
        primary: "#000000",
        "primary-container": "#1c1b1b",
        "on-primary": "#ffffff",
        "error-sale": "#C53030",
        success: "#238636",
        warning: "#B7791F",
        error: "#ba1a1a",
        outline: "#747878",
        "outline-variant": "#c4c7c7",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        headline: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        sm: "0.5rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px"
      }
    },
  },
  plugins: [],
}
