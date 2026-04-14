/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        forest: '#f8fafc',
        cream: '#ffffff',
        clay: '#8CC63F',
        sage: '#2BAABC',
        charcoal: '#1e293b',
        sand: '#f1f5f9',
      },
      fontFamily: {
        display: ['"Montserrat"', 'system-ui', 'sans-serif'],
        body: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'fluid-sm':  'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'fluid-base':'clamp(1rem, 0.925rem + 0.375vw, 1.125rem)',
        'fluid-lg':  'clamp(1.125rem, 1rem + 0.625vw, 1.375rem)',
        'fluid-xl':  'clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem)',
        'fluid-3xl': 'clamp(2rem, 1.5rem + 2.5vw, 3.5rem)',
        'fluid-4xl': 'clamp(2.5rem, 1.75rem + 3.75vw, 5rem)',
        'fluid-5xl': 'clamp(3rem, 2rem + 5vw, 7rem)',
        'fluid-hero':'clamp(3.5rem, 2rem + 7.5vw, 9rem)',
      },
      spacing: {
        section: 'clamp(5rem, 4rem + 5vw, 9rem)',
        gutter:  'clamp(1rem, 0.5rem + 2.5vw, 2.5rem)',
      },
      transitionTimingFunction: {
        expo:  'cubic-bezier(0.16, 1, 0.3, 1)',
        circ:  'cubic-bezier(0.4, 0, 0.2, 1)',
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      borderRadius: {
        pill: '9999px',
        card: '1.25rem',
      },
      backgroundImage: {
        'radial-forest': 'radial-gradient(ellipse at center, #f1f5f9 0%, #ffffff 100%)',
        'radial-charcoal': 'radial-gradient(ellipse at center, #e2e8f0 0%, #f1f5f9 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':       { transform: 'translateY(-20px) rotate(3deg)' },
          '66%':       { transform: 'translateY(-10px) rotate(-2deg)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        float:       'float 8s ease-in-out infinite',
        'float-delay':'float 10s ease-in-out 2s infinite',
        marquee:     'marquee 30s linear infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
      },
    },
  },
  plugins: [],
};
