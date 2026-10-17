/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#030508',        // Pure aerospace pitch black / void
          secondary: '#070B10',   // Deep avionics console back
          panel: '#0B1118',       // Flight instrument panel
          elevated: '#111A24',    // Elevated instrument pod
          subtle: '#182433',      // Subtle highlight
        },
        cyan: {
          DEFAULT: '#00E5FF',     // SpaceX telemetry electric cyan
          hover: '#33EBFF',
          glow: 'rgba(0, 229, 255, 0.25)',
          dark: 'rgba(0, 229, 255, 0.08)',
        },
        teal: {
          DEFAULT: '#00FF88',     // SpaceX flight nominal neon green
          glow: 'rgba(0, 255, 136, 0.25)',
          dark: 'rgba(0, 255, 136, 0.08)',
        },
        amber: {
          DEFAULT: '#FF9900',     // SpaceX warning amber/orange
          glow: 'rgba(255, 153, 0, 0.25)',
          dark: 'rgba(255, 153, 0, 0.08)',
        },
        red: {
          DEFAULT: '#FF2A4D',     // SpaceX critical abort crimson
          glow: 'rgba(255, 42, 77, 0.3)',
          dark: 'rgba(255, 42, 77, 0.08)',
        },
        text: {
          main: '#FFFFFF',        // Pure white high contrast
          secondary: '#D1D9E6',   // High readability telemetry
          muted: '#7A8C9E',       // Muted avionics labels
          dim: '#485766',         // Dim markings
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.10)',
          subtle: 'rgba(255, 255, 255, 0.05)',
          bright: 'rgba(0, 229, 255, 0.4)',
          glow: 'rgba(0, 229, 255, 0.2)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        din: ['"Barlow Condensed"', 'Oswald', 'sans-serif'],
        barlow: ['"Barlow Condensed"', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['"Barlow Condensed"', 'Oswald', 'sans-serif'],
      },
      boxShadow: {
        'panel': '0 4px 30px rgba(0, 0, 0, 0.8)',
        'cyan-glow': '0 0 20px rgba(0, 229, 255, 0.35)',
        'cyan-glow-lg': '0 0 35px rgba(0, 229, 255, 0.5)',
        'amber-glow': '0 0 20px rgba(255, 153, 0, 0.35)',
        'red-glow': '0 0 25px rgba(255, 42, 77, 0.4)',
        'teal-glow': '0 0 20px rgba(0, 255, 136, 0.35)',
      }
    },
  },
  plugins: [],
}
