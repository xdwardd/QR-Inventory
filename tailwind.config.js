/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],

  darkMode: "class",

  theme: {
    extend: {
      width: {
        128: "32rem",
      },
      height: {
        "input-height": "3.5rem",
        "form-height": "28rem",
      },
      colors: {
        "button-gradient":
          "linear-gradient(to right, #00c6ff 0%, #0072ff  51%, #00c6ff  100%)",
      },
    },
  },
  plugins: [
    require("flowbite/plugin")({
      charts: true,
    }),
  ],
};
