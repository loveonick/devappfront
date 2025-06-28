/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",       // 👈 añade esto para expo-router
    "./components/**/*.{js,jsx,ts,tsx}", // ✅ tus componentes personalizados
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        colorboton: '#9D5C63',
        colorfondo : '#FEF5EF',
        colortag: '#6B0A1D'
      },
       fontFamily: {
      sans: ['Jost', 'System'],
      },
    },
  },
  plugins: [],
};
