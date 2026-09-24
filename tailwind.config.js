/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wd-dark-blue': '#1f2a44',
        'wd-deep-blue': '#0e1118',
        'wd-orange': '#ff7e15',
        'wd-turqoise': '#6af0ff',
        'wd-mushroom': '#e9e7e1',
        'wd-light-grey': '#f3f1ec',
        'wd-beige': '#dcd8cc',
        'wd-light-charcoal': '#535353',
        'wd-ash-blue': '#2c374b',
        'dark-bg': '#090b10',
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Cardinal Classic Long"', 'ui-serif', 'Georgia', 'serif'],
        condensed: ['"Oswald"', '"Arial Narrow"', 'sans-serif'],
      },
      transitionTimingFunction: {
        'wd-ease-out': 'cubic-bezier(0.5, 1, 0.89, 1)',
        'wd-reveal': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'wd-primary': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      borderRadius: {
        'wd-sm': '0.25rem',
        'wd-hover': '0.275rem',
        'wd-md': '0.5rem',
        'wd-lg': '2.5rem',
      },
      spacing: {
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
      },
      height: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
}
