/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Monochrome only — the brand's entire palette
        ink: '#0A0A0A', // near-black
        paper: '#FFFFFF', // pure white
        greige: '#EDE7E1', // warm greige for circular frames + pills
        'greige-deep': '#E2DAD1',
      },
      fontFamily: {
        // Heavy condensed display, ALL CAPS section headers
        display: ['Anton', 'Archivo Black', 'Impact', 'sans-serif'],
        // High-contrast light serif for the mixed-weight hero line
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        // Body
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.28em',
        wide: '0.18em',
      },
      maxWidth: {
        shell: '1180px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'marquee': 'marquee 26s linear infinite',
      },
    },
  },
  plugins: [],
}
