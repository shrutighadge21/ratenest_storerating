/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF7F0', // Warm Sand
        surface: '#FFFFFF',
        surfaceSecondary: '#EEF5F7', // Soft Mist Blue
        primary: '#273238', // Primary Text
        muted: '#69757A', // Secondary Text
        brand: '#397C78', // Deep Teal
        brandSecondary: '#C97862', // Muted Terracotta
        rating: '#E8B84A', // Warm Amber
        success: '#E8F1EA', // Muted Sage
        borderSoft: '#E2E5E3',
        pastel: {
          blue: '#EEF5F7',
          sage: '#E8F1EA',
          apricot: '#FCEBDD',
          rose: '#F5E6E8',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        heading: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 8px 24px -4px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'lg': '6px',
        'xl': '8px',
        '2xl': '12px',
        '3xl': '16px',
      }
    },
  },
  plugins: [],
}
