/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./apps/dashboard/src/**/*.{html,ts,scss}",
    "./libs/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        'admin-blue': '#1e3a8a',
        'owner-green': '#064e3b',
        'viewer-slate': '#1e293b',
      },
    },
  },
  plugins: [],
}