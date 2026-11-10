/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Premium warm luxury palette
        ink: "#3B2118",
        cream: "#F8F2E7",
        ivory: "#FFFAF3",
        sand: "#F3E7D6",
        beige: "#EAD9C3",
        white: "#FFFAF3",
        brand: {
          50: "#FCEFF2",
          100: "#F8DCE2",
          200: "#EFB9C5",
          300: "#E08CA0",
          400: "#C9506C",
          500: "#BB1F45",
          600: "#A9002A",
          700: "#8C0023",
          800: "#6E001C",
          900: "#4B0013",
        },
        accent: {
          50: "#FDF6E7",
          100: "#FAEBCB",
          200: "#F2D79B",
          300: "#E5BC63",
          400: "#D5A22B",
          500: "#C58A00",
          600: "#A87300",
          700: "#855A00",
          800: "#634200",
          900: "#453000",
        },
        // warm neutral ramp (replaces the cool slate)
        slate: {
          50: "#FBF5EC",
          100: "#F6EDE0",
          200: "#EAD9C3",
          300: "#DCC6A9",
          400: "#B99B85",
          500: "#8B6855",
          600: "#7B5949",
          700: "#614436",
          800: "#4A3227",
          900: "#3B2118",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Hind Siliguri", "system-ui", "sans-serif"],
        display: ["Cormorant Garamond", "Hind Siliguri", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(59,33,24,.05), 0 18px 42px -24px rgba(59,33,24,.30)",
        lift: "0 2px 6px rgba(59,33,24,.06), 0 34px 70px -32px rgba(59,33,24,.38)",
        glass: "inset 0 1px 0 rgba(255,255,255,.6), 0 18px 42px -24px rgba(59,33,24,.32)",
      },
      borderRadius: { xl2: "1.25rem" },
      maxWidth: { shell: "76rem" },
      transitionTimingFunction: { lux: "cubic-bezier(.22,.61,.36,1)" },
    },
  },
  plugins: [],
};
