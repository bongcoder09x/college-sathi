/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0e1521",
        cream: "#faf7f2",
        sand: "#f2ece1",
        brand: {
          50: "#eaf5f1",
          100: "#cfe9e0",
          300: "#7cc4b0",
          500: "#127a66",
          600: "#0d5c4d",
          700: "#0a4a3e",
          900: "#062b24",
        },
        accent: {
          100: "#fbeed6",
          400: "#e9a94b",
          500: "#e08b2d",
          600: "#c0731f",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Hind Siliguri", "system-ui", "sans-serif"],
        display: ["Fraunces", "Hind Siliguri", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(14,21,33,.04), 0 12px 32px -12px rgba(14,21,33,.16)",
        lift: "0 2px 4px rgba(14,21,33,.05), 0 24px 60px -24px rgba(14,21,33,.28)",
      },
      borderRadius: { xl2: "1.25rem" },
      maxWidth: { shell: "76rem" },
    },
  },
  plugins: [],
};
