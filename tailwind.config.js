/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        muted: '#6b7280',
        border: '#c7d2fe',
        inputbg: '#f5f7ff',
        successbg: '#dcfce7',
        successtext: '#166534',
        errorbg: '#fee2e2',
        errortext: '#991b1b',
      },
    },
  },
  plugins: [],
};