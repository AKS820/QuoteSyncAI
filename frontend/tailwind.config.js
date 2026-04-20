/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'ibm-blue':      '#0F62FE',
        'ibm-blue-hover':'#0353E9',
        'ibm-blue-light':'#4589FF',
        'ibm-blue-dim':  'rgba(15,98,254,0.12)',
        surface:         '#111118',
        'surface-2':     '#1A1A28',
        'surface-3':     '#22223A',
        border:          '#2A2A3E',
        'border-bright': '#3E3E58',
        muted:           '#8B8BA7',
        success:         '#24A148',
        'success-dim':   'rgba(36,161,72,0.12)',
        warning:         '#F1C21B',
        'warning-dim':   'rgba(241,194,27,0.12)',
        danger:          '#FA4D56',
        'danger-dim':    'rgba(250,77,86,0.12)',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(15,98,254,0.18) 0%, transparent 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':      'float 5s ease-in-out infinite',
        'scan':       'scan 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      boxShadow: {
        'glow-blue': '0 0 40px rgba(15,98,254,0.2)',
        'glow-blue-sm': '0 0 20px rgba(15,98,254,0.15)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      }
    },
  },
  plugins: [],
};
