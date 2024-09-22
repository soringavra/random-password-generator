/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        karla: ["var(--font-karla)"],
        inconsolata: ["var(--font-inconsolata)"],
      },
      borderWidth: {
        DEFAULT: "1px",
      },
      borderColor: {
        DEFAULT: "#e5e5e5",
      },
      screens: {
        "xs": "470px",
      },
    },
  },
  plugins: [],
};
