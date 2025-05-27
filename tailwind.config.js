/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",       // 👈 añade esto para expo-router
    "./components/**/*.{js,jsx,ts,tsx}", // ✅ tus componentes personalizados
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
