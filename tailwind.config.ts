import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        'surface-secondary': 'var(--surface-secondary)',
        border: 'var(--border)',
        'nav-active': 'var(--nav-active)',
        'nav-inactive': 'var(--nav-inactive)',
        project: {
          findu: 'var(--project-findu)',
          mkrs: 'var(--project-mkrs)',
          flock: 'var(--project-flock)',
          bloom: 'var(--project-bloom)',
        },
      },
      borderRadius: {
        'button': '12px',
        'card': '20px',
        'nav': '32px',
      },
      maxWidth: {
        'container': '1000px',
      },
      spacing: {
        'section': '108px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
export default config;