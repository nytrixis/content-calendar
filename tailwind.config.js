/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0e0e0e",
        card: "#1a1a1a",
        accentPurple: "#c084fc",
        accentCyan: "#38bdf8",
        text: "#d4d4d4",
        status: "#facc15",
      },
    },
  },
  plugins: [],
}