/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background-dark)',
        card: 'var(--background-light)',
        primary: 'var(--primary-blue)',
        'primary-foreground': 'var(--text-primary)',
        'muted': 'var(--background-hover)',
        'muted-foreground': 'var(--text-secondary)',
        'accent': 'var(--primary-blue-hover)',
        'foreground': 'var(--text-primary)',
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
      },
      keyframes: {
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};