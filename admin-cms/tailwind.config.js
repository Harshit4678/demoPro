// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // nested object bhi chalega; Tailwind classes become "bg-brand-green"
        brand: {
          green: "#10B981", // apna desired hex yahan daalo
        },
        // ya single key style:
        // "brand-green": "#10B981",
      },
    },
  },
  plugins: [],
}
